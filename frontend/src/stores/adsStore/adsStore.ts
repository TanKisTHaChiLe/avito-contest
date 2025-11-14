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

  resetFilters() {
    this.filters = {
      status: [],
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  }
}

export const adsStore = new AdsStore();
