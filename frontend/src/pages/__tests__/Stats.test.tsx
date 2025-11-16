import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Stats } from '../Stats';
import { statsStore } from '../../stores/statsStore/statsStore';

jest.mock('../../stores/statsStore/statsStore');

jest.mock('../../components/StatsPeriodFilter', () => ({
  StatsPeriodFilter: ({ selectedPeriod, onPeriodChange }: any) => (
    <div data-testid="period-filter">
      <button onClick={() => onPeriodChange('week')}>Week</button>
      <button onClick={() => onPeriodChange('month')}>Month</button>
      <span>Selected: {selectedPeriod}</span>
    </div>
  ),
}));

jest.mock('../../components/StatsMetrics', () => ({
  StatsMetrics: () => <div data-testid="stats-metrics">Stats Metrics</div>,
}));

jest.mock('../../components/StatsCharts', () => ({
  ActivityChart: ({ data }: any) => (
    <div data-testid="activity-chart">
      Activity: {data ? 'has data' : 'no data'}
    </div>
  ),
  DecisionsChart: ({ data }: any) => (
    <div data-testid="decisions-chart">
      Decisions: {data ? 'has data' : 'no data'}
    </div>
  ),
  CategoriesChart: ({ data }: any) => (
    <div data-testid="categories-chart">
      Categories: {data ? 'has data' : 'no data'}
    </div>
  ),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>
  );
};

describe('Stats', () => {
  const mockSummary = {
    totalReviewed: 100,
    totalReviewedToday: 10,
    totalReviewedThisWeek: 50,
    totalReviewedThisMonth: 80,
    approvedPercentage: 60,
    rejectedPercentage: 20,
    approvedCount: 60,
    rejectedCount: 20,
    requestChangesPercentage: 20,
    averageReviewTime: 5.5,
  };

  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Test Dataset',
        data: [10, 20, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const mockActivityChartData = {
    labels: ['01 Jan', '02 Jan', '03 Jan'],
    datasets: [
      {
        label: 'Одобрено',
        data: [5, 10, 15],
        backgroundColor: ['#00C49F'],
      },
      {
        label: 'Отклонено',
        data: [2, 3, 4],
        backgroundColor: ['#FF8042'],
      },
      {
        label: 'На доработку',
        data: [1, 2, 3],
        backgroundColor: ['#FFBB28'],
      },
    ],
  };

  const mockDecisionsChartData = {
    labels: ['Одобрено', 'Отклонено', 'На доработку'],
    datasets: [
      {
        label: 'Решения',
        data: [60, 20, 20],
        backgroundColor: ['#00C49F', '#FF8042', '#FFBB28'],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    statsStore.loading = false;
    statsStore.error = null;
    statsStore.summary = mockSummary;
    statsStore.activityChart = mockActivityChartData;
    statsStore.decisionsChart = mockDecisionsChartData;
    statsStore.categoriesChart = mockChartData;

    (statsStore.fetchSummary as jest.Mock).mockResolvedValue(undefined);
    (statsStore.fetchCharts as jest.Mock).mockResolvedValue(undefined);
  });

  it('должен отображать страницу статистики со всеми компонентами', () => {
    renderWithProviders(<Stats />);

    expect(screen.getByText('Статистика модератора')).toBeInTheDocument();
    expect(screen.getByTestId('period-filter')).toBeInTheDocument();
    expect(screen.getByTestId('stats-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('activity-chart')).toBeInTheDocument();
    expect(screen.getByTestId('decisions-chart')).toBeInTheDocument();
    expect(screen.getByTestId('categories-chart')).toBeInTheDocument();
  });

  it('должен показывать состояние ошибки', () => {
    statsStore.error = 'Ошибка загрузки статистики';

    renderWithProviders(<Stats />);

    expect(screen.getByText('Ошибка загрузки статистики')).toBeInTheDocument();
  });

  it('должен загружать данные при монтировании', () => {
    renderWithProviders(<Stats />);

    expect(statsStore.fetchSummary).toHaveBeenCalledWith('week');
    expect(statsStore.fetchCharts).toHaveBeenCalledWith('week');
  });

  it('должен обрабатывать изменение периода', async () => {
    renderWithProviders(<Stats />);

    const monthButton = screen.getByText('Month');
    fireEvent.click(monthButton);

    await waitFor(() => {
      expect(statsStore.fetchSummary).toHaveBeenCalledWith('month');
      expect(statsStore.fetchCharts).toHaveBeenCalledWith('month');
    });
  });

  it('должен отображать графики когда данные доступны', () => {
    renderWithProviders(<Stats />);

    expect(screen.getByText('Activity: has data')).toBeInTheDocument();
    expect(screen.getByText('Decisions: has data')).toBeInTheDocument();
    expect(screen.getByText('Categories: has data')).toBeInTheDocument();
  });

  it('должен обрабатывать пустые данные графиков', () => {
    statsStore.activityChart = null;
    statsStore.decisionsChart = null;
    statsStore.categoriesChart = null;

    renderWithProviders(<Stats />);

    expect(screen.getByText('Activity: no data')).toBeInTheDocument();
    expect(screen.getByText('Decisions: no data')).toBeInTheDocument();
    expect(screen.getByText('Categories: no data')).toBeInTheDocument();
  });

  it('должен перезагружать данные при изменении периода', async () => {
    renderWithProviders(<Stats />);

    expect(statsStore.fetchSummary).toHaveBeenCalledWith('week');
    expect(statsStore.fetchCharts).toHaveBeenCalledWith('week');

    const monthButton = screen.getByText('Month');
    fireEvent.click(monthButton);

    await waitFor(() => {
      expect(statsStore.fetchSummary).toHaveBeenCalledWith('month');
      expect(statsStore.fetchCharts).toHaveBeenCalledWith('month');
    });

    expect(statsStore.fetchSummary).toHaveBeenCalledTimes(2);
    expect(statsStore.fetchCharts).toHaveBeenCalledTimes(2);
  });

  it('должен сохранять структуру layout', () => {
    renderWithProviders(<Stats />);

    expect(screen.getByText('Статистика модератора')).toBeInTheDocument();

    const gridElements = screen.getAllByTestId(/chart/);
    expect(gridElements).toHaveLength(3);
  });

  it('должен обрабатывать последовательные изменения периода', async () => {
    renderWithProviders(<Stats />);

    const weekButton = screen.getByText('Week');
    const monthButton = screen.getByText('Month');

    fireEvent.click(monthButton);
    fireEvent.click(weekButton);
    fireEvent.click(monthButton);

    await waitFor(() => {
      expect(statsStore.fetchSummary).toHaveBeenCalledTimes(4);
      expect(statsStore.fetchCharts).toHaveBeenCalledTimes(4);
    });
  });
});
