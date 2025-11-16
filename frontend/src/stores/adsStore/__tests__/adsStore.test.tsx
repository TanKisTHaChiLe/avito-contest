import { adsStore } from '../adsStore';
import { api } from '../../../services/api';
import { Ad, ModerationAction } from '../types';

jest.mock('../../../services/api');

const mockApi = api as jest.Mocked<typeof api>;

const createMockAd = (overrides?: Partial<Ad>): Ad => ({
  id: '1',
  title: 'Test Ad',
  description: 'Test Description',
  price: 1000,
  category: 'Electronics',
  categoryId: 1,
  images: [],
  status: 'pending',
  priority: 'normal',
  createdAt: '2023-01-01T00:00:00.000Z',
  seller: {
    id: '1',
    name: 'Test Seller',
    rating: 4.5,
    totalAds: 10,
    registeredAt: '2022-01-01T00:00:00.000Z',
  },
  moderationHistory: [],
  characteristics: {},
  ...overrides,
});

const createMockModerationAction = (
  overrides?: Partial<ModerationAction>
): ModerationAction => ({
  id: '1',
  moderatorName: 'Test Moderator',
  action: 'approved',
  timestamp: '2023-01-01T00:00:00.000Z',
  comment: 'Test comment',
  ...overrides,
});

describe('AdsStore', () => {
  let originalConsoleError: typeof console.error;
  let consoleErrorMock: jest.Mock;

  beforeAll(() => {
    originalConsoleError = console.error;
    consoleErrorMock = jest.fn();
    console.error = consoleErrorMock;
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    adsStore.ads = [];
    adsStore.currentAd = null;
    adsStore.loading = false;
    adsStore.error = null;
    adsStore.filters = {
      status: [],
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    adsStore.pagination = {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 10,
    };

    jest.clearAllMocks();
    consoleErrorMock.mockClear();

    mockApi.get.mockResolvedValue({
      data: {
        ads: [],
        pagination: { totalPages: 0, totalItems: 0 },
      },
    });
    mockApi.post.mockResolvedValue({ data: {} });
  });

  describe('fetchAds', () => {
    it('должен успешно загружать объявления', async () => {
      const mockAds = [createMockAd()];
      const mockResponse = {
        data: {
          ads: mockAds,
          pagination: { totalPages: 1, totalItems: 1 },
        },
      };

      mockApi.get.mockResolvedValue(mockResponse);

      await adsStore.fetchAds(1);

      expect(adsStore.ads).toEqual(mockAds);
      expect(adsStore.pagination.totalPages).toBe(1);
      expect(adsStore.loading).toBe(false);
      expect(adsStore.error).toBeNull();
    });

    it('должен обрабатывать ошибку при загрузке', async () => {
      const error = new Error('Network error');
      mockApi.get.mockRejectedValue(error);

      await adsStore.fetchAds(1);

      expect(adsStore.error).toBe('Ошибка при загрузке объявлений');
      expect(adsStore.loading).toBe(false);

      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error fetching ads:',
        error
      );
    });

    it('должен применять фильтры при загрузке', async () => {
      adsStore.setFilters({ search: 'test', status: ['pending'] });

      const mockResponse = {
        data: { ads: [], pagination: { totalPages: 0, totalItems: 0 } },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      await adsStore.fetchAds(1);

      expect(mockApi.get).toHaveBeenCalledWith('/ads', {
        params: expect.any(URLSearchParams),
      });
    });
  });

  describe('fetchAdById', () => {
    it('должен успешно загружать объявление по ID', async () => {
      const mockAd = createMockAd({
        moderationHistory: [createMockModerationAction()],
      });
      mockApi.get.mockResolvedValue({ data: mockAd });

      await adsStore.fetchAdById('1');

      expect(adsStore.currentAd).toEqual(mockAd);
      expect(adsStore.loading).toBe(false);
    });
  });

  describe('действия модерации', () => {
    beforeEach(() => {
      adsStore.currentAd = createMockAd();
      adsStore.ads = [createMockAd()];
    });

    it('должен одобрять объявление', async () => {
      const updatedAd = createMockAd({
        status: 'approved',
        moderationHistory: [createMockModerationAction({ action: 'approved' })],
      });
      mockApi.post.mockResolvedValue({ data: { ad: updatedAd } });

      await adsStore.approveAd('1');

      expect(adsStore.currentAd).toEqual(updatedAd);
      expect(mockApi.post).toHaveBeenCalledWith('/ads/1/approve');
    });

    it('должен отклонять объявление', async () => {
      const updatedAd = createMockAd({
        status: 'rejected',
        moderationHistory: [createMockModerationAction({ action: 'rejected' })],
      });
      mockApi.post.mockResolvedValue({ data: { ad: updatedAd } });

      await adsStore.rejectAd('1', 'spam', 'comment');

      expect(adsStore.currentAd).toEqual(updatedAd);
      expect(mockApi.post).toHaveBeenCalledWith('/ads/1/reject', {
        reason: 'spam',
        comment: 'comment',
      });
    });

    it('должен обрабатывать ошибки модерации', async () => {
      const error = new Error('Network error');
      mockApi.post.mockRejectedValue(error);

      try {
        await adsStore.approveAd('1');
      } catch (e) {}

      expect(adsStore.error).toContain('Ошибка при одобрении объявления');
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error approving ad:',
        error
      );
    });
  });

  describe('навигация', () => {
    beforeEach(() => {
      adsStore.ads = [
        createMockAd({ id: '1', title: 'Ad 1' }),
        createMockAd({ id: '2', title: 'Ad 2' }),
        createMockAd({ id: '3', title: 'Ad 3' }),
      ];
    });

    it('должен получать ID следующего объявления', () => {
      adsStore.currentAd = createMockAd({ id: '1', title: 'Ad 1' });
      expect(adsStore.getNextAdId()).toBe('2');
    });

    it('должен получать ID предыдущего объявления', () => {
      adsStore.currentAd = createMockAd({ id: '2', title: 'Ad 2' });
      expect(adsStore.getPreviousAdId()).toBe('1');
    });

    it('должен возвращать null когда нет следующего объявления', () => {
      adsStore.currentAd = createMockAd({ id: '3', title: 'Ad 3' });
      expect(adsStore.getNextAdId()).toBeNull();
    });
  });

  describe('фильтры', () => {
    it('должен устанавливать фильтры корректно', () => {
      const newFilters = {
        search: 'test',
        status: ['pending'],
        categoryId: '2',
      };
      adsStore.setFilters(newFilters);

      expect(adsStore.filters.search).toBe('test');
      expect(adsStore.filters.status).toEqual(['pending']);
      expect(adsStore.filters.categoryId).toBe('2');
    });

    it('должен сбрасывать фильтры', () => {
      adsStore.setFilters({
        search: 'test',
        sortBy: 'price',
        sortOrder: 'asc',
      });
      adsStore.resetFilters();

      expect(adsStore.filters.search).toBe('');
      expect(adsStore.filters.status).toEqual([]);
      expect(adsStore.filters.sortBy).toBe('price');
      expect(adsStore.filters.sortOrder).toBe('asc');
    });
  });

  describe('пагинация', () => {
    beforeEach(() => {
      adsStore.pagination = {
        currentPage: 1,
        totalPages: 2,
        totalItems: 20,
        limit: 10,
      };
    });

    it('должен загружать следующую страницу', async () => {
      const mockAds = [createMockAd({ id: '3' })];
      mockApi.get.mockResolvedValue({
        data: {
          ads: mockAds,
          pagination: { totalPages: 2, totalItems: 20 },
        },
      });

      const result = await adsStore.loadNextPage();

      expect(result).toBe(true);
      expect(mockApi.get).toHaveBeenCalled();
    });

    it('должен возвращать false когда нет следующей страницы', async () => {
      adsStore.pagination.currentPage = 2;
      adsStore.pagination.totalPages = 2;

      const result = await adsStore.loadNextPage();

      expect(result).toBe(false);
    });
  });

  describe('navigateToAd', () => {
    it('должен переходить к существующему объявлению', async () => {
      const existingAd = createMockAd({ id: '1' });
      adsStore.ads = [existingAd];

      const result = await adsStore.navigateToAd('1');

      expect(result).toBe(true);
      expect(adsStore.currentAd).toEqual(existingAd);
    });

    it('должен загружать объявление если его нет в списке', async () => {
      const mockAd = createMockAd({ id: '99' });
      mockApi.get.mockResolvedValue({ data: mockAd });

      const result = await adsStore.navigateToAd('99');

      expect(result).toBe(true);
      expect(mockApi.get).toHaveBeenCalledWith('/ads/99');
    });
  });

  describe('updateCurrentAd', () => {
    it('должен обновлять текущее объявление при совпадении ID', () => {
      const originalAd = createMockAd({ id: '1', title: 'Original' });
      const updatedAd = createMockAd({ id: '1', title: 'Updated' });

      adsStore.currentAd = originalAd;
      adsStore.ads = [originalAd];

      adsStore.updateCurrentAd(updatedAd);

      expect(adsStore.currentAd).toEqual(updatedAd);
      expect(adsStore.ads[0]).toEqual(updatedAd);
    });
  });
});
