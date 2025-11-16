import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../services/api';
import { Ad, AdsFilter } from './type';

class AdsStore {
  ads: Ad[] = [];
  currentAd: Ad | null = null;
  loading = false;
  error: string | null = null;

  filters: AdsFilter = {
    status: [],
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  pagination = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 10,
  };

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAds(page = 1) {
    this.loading = true;
    this.error = null;

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', this.pagination.limit.toString());

      this.filters.status.forEach((status) => {
        params.append('status', status);
      });

      if (this.filters.search) {
        params.append('search', this.filters.search);
      }

      if (this.filters.categoryId) {
        params.append('categoryId', this.filters.categoryId.toString());
      }

      if (this.filters.minPrice !== undefined) {
        params.append('minPrice', this.filters.minPrice.toString());
      }

      if (this.filters.maxPrice !== undefined) {
        params.append('maxPrice', this.filters.maxPrice.toString());
      }

      params.append('sortBy', this.filters.sortBy);
      params.append('sortOrder', this.filters.sortOrder);
      const response = await api.get('/ads', { params });

      runInAction(() => {
        this.ads = response.data.ads;
        this.pagination = {
          ...this.pagination,
          currentPage: page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems,
        };
      });
    } catch (error) {
      console.error('Error fetching ads:', error);
      runInAction(() => {
        this.error = 'Ошибка при загрузке объявлений';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
  async fetchAdById(id: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.get(`/ads/${id}`);

      runInAction(() => {
        this.currentAd = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке объявления';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setFilters(filters: Partial<AdsFilter>) {
    this.filters = { ...this.filters, ...filters };
  }

  getCurrentAdIndex(): number {
    if (!this.currentAd) return -1;
    return this.ads.findIndex((ad) => ad.id === this.currentAd!.id);
  }

  getNextAdId(): string | null {
    const currentIndex = this.getCurrentAdIndex();
    if (currentIndex === -1) return null;

    if (currentIndex < this.ads.length - 1) {
      return this.ads[currentIndex + 1].id;
    }

    if (this.pagination.currentPage < this.pagination.totalPages) {
      return null;
    }

    return null;
  }

  getPreviousAdId(): string | null {
    const currentIndex = this.getCurrentAdIndex();
    if (currentIndex === -1) return null;

    if (currentIndex > 0) {
      return this.ads[currentIndex - 1].id;
    }

    if (this.pagination.currentPage > 1) {
      return null;
    }

    return null;
  }

  async loadNextPage(): Promise<boolean> {
    const nextPage = this.pagination.currentPage + 1;
    if (nextPage > this.pagination.totalPages) return false;

    try {
      await this.fetchAds(nextPage);
      return true;
    } catch (error) {
      console.error('Error loading next page:', error);
      return false;
    }
  }

  async loadPreviousPage(): Promise<boolean> {
    const prevPage = this.pagination.currentPage - 1;
    if (prevPage < 1) return false;

    try {
      await this.fetchAds(prevPage);
      return true;
    } catch (error) {
      console.error('Error loading previous page:', error);
      return false;
    }
  }

  async navigateToAd(adId: string): Promise<boolean> {
    const existingAd = this.ads.find((ad) => ad.id === adId);
    if (existingAd) {
      runInAction(() => {
        this.currentAd = existingAd;
      });
      return true;
    }

    try {
      await this.fetchAdById(adId);
      return true;
    } catch (error) {
      console.error('Error navigating to ad:', error);
      return false;
    }
  }

  updateCurrentAd(updatedAd: Ad) {
    if (this.currentAd && this.currentAd.id === updatedAd.id) {
      this.currentAd = updatedAd;
    }

    const adIndex = this.ads.findIndex((ad) => ad.id === updatedAd.id);
    if (adIndex !== -1) {
      this.ads[adIndex] = updatedAd;
    }
  }

  async approveAd(id: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.post(`/ads/${id}/approve`);

      runInAction(() => {
        this.updateCurrentAd(response.data.ad);
      });

      return response.data;
    } catch (error: any) {
      console.error('Error approving ad:', error);
      runInAction(() => {
        this.error =
          error.response?.data?.message || 'Ошибка при одобрении объявления';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async rejectAd(id: string, reason: string, comment?: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.post(`/ads/${id}/reject`, {
        reason,
        comment,
      });

      runInAction(() => {
        this.updateCurrentAd(response.data.ad);
      });

      return response.data;
    } catch (error: any) {
      console.error('Error rejecting ad:', error);
      runInAction(() => {
        this.error =
          error.response?.data?.message || 'Ошибка при отклонении объявления';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async requestChanges(id: string, reason: string, comment?: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.post(`/ads/${id}/request-changes`, {
        reason,
        comment,
      });

      runInAction(() => {
        this.updateCurrentAd(response.data.ad);
      });

      return response.data;
    } catch (error: any) {
      console.error('Error requesting changes:', error);
      runInAction(() => {
        this.error =
          error.response?.data?.message || 'Ошибка при запросе доработки';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  resetFilters() {
    const currentSortBy = this.filters.sortBy;
    const currentSortOrder = this.filters.sortOrder;

    this.filters = {
      status: [],
      search: '',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    };
  }

  async requestAdChanges(
    id: string,
    reason: string,
    comment?: string
  ): Promise<boolean> {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.post(`/ads/${id}/request-changes`, {
        reason,
        comment: comment || undefined,
      });

      runInAction(() => {
        const adIndex = this.ads.findIndex((ad) => ad.id === id);
        if (adIndex !== -1) {
          this.ads[adIndex] = response.data.ad;
        }

        if (this.currentAd && this.currentAd.id === id) {
          this.currentAd = response.data.ad;
        }
      });

      return true;
    } catch (error: any) {
      console.error('Error requesting ad changes:', error);
      runInAction(() => {
        this.error =
          error.response?.data?.message || 'Ошибка при запросе изменений';
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const adsStore = new AdsStore();
