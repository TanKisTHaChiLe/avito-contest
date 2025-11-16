import { statsStore } from '../statsStore';
import { api } from '../../../services/api';
import { StatsSummary } from '../types';

jest.mock('../../../services/api');

const mockApi = api as jest.Mocked<typeof api>;

const createMockSummary = (
  overrides?: Partial<StatsSummary>
): StatsSummary => ({
  totalReviewed: 100,
  totalReviewedToday: 10,
  totalReviewedThisWeek: 50,
  totalReviewedThisMonth: 100,
  approvedPercentage: 60,
  rejectedPercentage: 20,
  approvedCount: 60,
  rejectedCount: 20,
  requestChangesPercentage: 20,
  averageReviewTime: 5.5,
  ...overrides,
});

const createMockActivityData = () => [
  { date: '2023-01-01', approved: 5, rejected: 2, requestChanges: 1 },
  { date: '2023-01-02', approved: 7, rejected: 1, requestChanges: 2 },
];

const createMockDecisionsData = () => ({
  approved: 60,
  rejected: 20,
  requestChanges: 20,
});

const createMockCategoriesData = () => ({
  labels: ['Electronics', 'Clothing', 'Books'],
  datasets: [
    {
      data: [40, 30, 30],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
});

describe('StatsStore', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    statsStore.summary = null;
    statsStore.activityChart = null;
    statsStore.decisionsChart = null;
    statsStore.categoriesChart = null;
    statsStore.loading = false;
    statsStore.error = null;

    jest.clearAllMocks();

    mockApi.get.mockResolvedValue({ data: {} });
  });

  describe('Загрузка сводки', () => {
    it('Успешно загружает сводку статистики', async () => {
      const mockSummary = createMockSummary();
      mockApi.get.mockResolvedValue({ data: mockSummary });

      await statsStore.fetchSummary('week');

      expect(statsStore.summary).toEqual(mockSummary);
      expect(statsStore.loading).toBe(false);
      expect(statsStore.error).toBeNull();
      expect(mockApi.get).toHaveBeenCalledWith('/stats/summary', {
        params: { period: 'week' },
      });
    });

    it('Обрабатывает ошибку при загрузке сводки', async () => {
      const error = new Error('Network error');
      mockApi.get.mockRejectedValue(error);

      await statsStore.fetchSummary('week');

      expect(statsStore.error).toBe('Ошибка при загрузке статистики');
      expect(statsStore.loading).toBe(false);
      expect(statsStore.summary).toBeNull();
    });

    it('Устанавливает loading в true во время загрузки', async () => {
      const mockSummary = createMockSummary();
      mockApi.get.mockResolvedValue({ data: mockSummary });

      const fetchPromise = statsStore.fetchSummary('week');

      expect(statsStore.loading).toBe(true);

      await fetchPromise;

      expect(statsStore.loading).toBe(false);
    });
  });

  describe('Загрузка графиков', () => {
    it('Успешно загружает все графики', async () => {
      const mockActivityData = createMockActivityData();
      const mockDecisionsData = createMockDecisionsData();
      const mockCategoriesData = createMockCategoriesData();

      mockApi.get
        .mockResolvedValueOnce({ data: mockActivityData })
        .mockResolvedValueOnce({ data: mockDecisionsData })
        .mockResolvedValueOnce({ data: mockCategoriesData });

      await statsStore.fetchCharts('month');

      expect(statsStore.activityChart).toBeDefined();
      expect(statsStore.decisionsChart).toBeDefined();
      expect(statsStore.categoriesChart).toEqual(mockCategoriesData);
      expect(statsStore.error).toBeNull();

      expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/activity', {
        params: { period: 'month' },
      });
      expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/decisions', {
        params: { period: 'month' },
      });
      expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/categories', {
        params: { period: 'month' },
      });
    });

    it('Обрабатывает ошибку при загрузке графиков', async () => {
      const error = new Error('Network error');
      mockApi.get.mockRejectedValue(error);

      await statsStore.fetchCharts('week');

      expect(statsStore.error).toBe('Ошибка при загрузке графиков');
      expect(statsStore.activityChart).toBeNull();
      expect(statsStore.decisionsChart).toBeNull();
      expect(statsStore.categoriesChart).toBeNull();
    });

    it('Корректно преобразует данные активности', async () => {
      const mockActivityData = createMockActivityData();
      mockApi.get
        .mockResolvedValueOnce({ data: mockActivityData })
        .mockResolvedValueOnce({ data: createMockDecisionsData() })
        .mockResolvedValueOnce({ data: createMockCategoriesData() });

      await statsStore.fetchCharts('week');

      expect(statsStore.activityChart).toMatchObject({
        labels: ['1 янв.', '2 янв.'],
        datasets: [
          {
            label: 'Одобрено',
            data: [5, 7],
            backgroundColor: ['#00C49F'],
          },
          {
            label: 'Отклонено',
            data: [2, 1],
            backgroundColor: ['#FF8042'],
          },
          {
            label: 'На доработку',
            data: [1, 2],
            backgroundColor: ['#FFBB28'],
          },
        ],
      });
    });

    it('Корректно преобразует данные решений', async () => {
      const mockDecisionsData = {
        approved: 30,
        rejected: 10,
        requestChanges: 5,
      };
      mockApi.get
        .mockResolvedValueOnce({ data: createMockActivityData() })
        .mockResolvedValueOnce({ data: mockDecisionsData })
        .mockResolvedValueOnce({ data: createMockCategoriesData() });

      await statsStore.fetchCharts('week');

      expect(statsStore.decisionsChart).toMatchObject({
        labels: ['Одобрено', 'Отклонено', 'На доработку'],
        datasets: [
          {
            label: 'Решения',
            data: [30, 10, 5],
            backgroundColor: ['#00C49F', '#FF8042', '#FFBB28'],
          },
        ],
      });
    });

    it('Обрабатывает нулевые данные при преобразовании решений', async () => {
      const mockDecisionsData = {
        approved: null,
        rejected: undefined,
        requestChanges: 0,
      };
      mockApi.get
        .mockResolvedValueOnce({ data: createMockActivityData() })
        .mockResolvedValueOnce({ data: mockDecisionsData })
        .mockResolvedValueOnce({ data: createMockCategoriesData() });

      await statsStore.fetchCharts('week');

      expect(statsStore.decisionsChart?.datasets[0].data).toEqual([0, 0, 0]);
    });
  });

  describe('Экспорт данных', () => {
    it('Успешно экспортирует данные', async () => {
      const mockBlob = new Blob(['test data']);
      mockApi.get.mockResolvedValue({ data: mockBlob });

      const result = await statsStore.exportData('csv', 'week');

      expect(result).toBe(mockBlob);
      expect(mockApi.get).toHaveBeenCalledWith('/stats/export', {
        params: { format: 'csv', period: 'week' },
        responseType: 'blob',
      });
    });

    it('Бросает ошибку при неудачном экспорте', async () => {
      const error = new Error('Export failed');
      mockApi.get.mockRejectedValue(error);

      await expect(statsStore.exportData('pdf', 'month')).rejects.toThrow(
        'Ошибка при экспорте данных'
      );
    });

    it('Поддерживает разные форматы экспорта', async () => {
      const mockBlob = new Blob(['test data']);
      mockApi.get.mockResolvedValue({ data: mockBlob });

      await statsStore.exportData('csv', 'week');
      expect(mockApi.get).toHaveBeenCalledWith('/stats/export', {
        params: { format: 'csv', period: 'week' },
        responseType: 'blob',
      });

      await statsStore.exportData('pdf', 'month');
      expect(mockApi.get).toHaveBeenCalledWith('/stats/export', {
        params: { format: 'pdf', period: 'month' },
        responseType: 'blob',
      });
    });
  });

  describe('Преобразование данных активности', () => {
    it('Корректно форматирует даты для русского языка', () => {
      const testData = [
        { date: '2023-12-25', approved: 1, rejected: 0, requestChanges: 0 },
        { date: '2023-12-26', approved: 2, rejected: 1, requestChanges: 1 },
      ];

      const result = statsStore['transformActivityData'](testData);

      expect(result.labels).toEqual(['25 дек.', '26 дек.']);
      expect(result.datasets[0].data).toEqual([1, 2]);
      expect(result.datasets[1].data).toEqual([0, 1]);
      expect(result.datasets[2].data).toEqual([0, 1]);
    });

    it('Обрабатывает пустой массив данных', () => {
      const result = statsStore['transformActivityData']([]);

      expect(result.labels).toEqual([]);
      expect(result.datasets[0].data).toEqual([]);
      expect(result.datasets[1].data).toEqual([]);
      expect(result.datasets[2].data).toEqual([]);
    });
  });

  describe('Преобразование данных решений', () => {
    it('Корректно преобразует данные решений', () => {
      const testData = { approved: 25, rejected: 10, requestChanges: 5 };

      const result = statsStore['transformDecisionsData'](testData);

      expect(result.labels).toEqual(['Одобрено', 'Отклонено', 'На доработку']);
      expect(result.datasets[0].data).toEqual([25, 10, 5]);
      expect(result.datasets[0].backgroundColor).toEqual([
        '#00C49F',
        '#FF8042',
        '#FFBB28',
      ]);
    });

    it('Обрабатывает отсутствующие данные', () => {
      const testData = { approved: null, rejected: undefined };

      const result = statsStore['transformDecisionsData'](testData);

      expect(result.datasets[0].data).toEqual([0, 0, 0]);
    });
  });
});
