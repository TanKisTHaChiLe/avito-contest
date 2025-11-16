import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../services/api';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];
const ACTIVITY_COLORS = {
  approved: '#00C49F',
  rejected: '#FF8042',
  requestChanges: '#FFBB28',
};

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  approvedCount: number;
  rejectedCount: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

class StatsStore {
  summary: StatsSummary | null = null;
  activityChart: ChartData | null = null;
  decisionsChart: ChartData | null = null;
  categoriesChart: any = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSummary(period: string = 'week') {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.get('/stats/summary', { params: { period } });
      console.log(response);
      runInAction(() => {
        this.summary = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке статистики';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchCharts(period: string = 'week') {
    try {
      const [activityResponse, decisionsResponse, categoriesResponse] =
        await Promise.all([
          api.get('/stats/chart/activity', { params: { period } }),
          api.get('/stats/chart/decisions', { params: { period } }),
          api.get('/stats/chart/categories', { params: { period } }),
        ]);

      const activityData = this.transformActivityData(activityResponse.data);
      const decisionsData = this.transformDecisionsData(decisionsResponse.data);

      runInAction(() => {
        this.activityChart = activityData;
        this.decisionsChart = decisionsData;
        this.categoriesChart = categoriesResponse.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке графиков';
      });
    }
  }

  async exportData(format: 'csv' | 'pdf', period: string) {
    try {
      const response = await api.get('/stats/export', {
        params: { format, period },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw new Error('Ошибка при экспорте данных');
    }
  }

  private transformActivityData(apiData: any[]): ChartData {
    const labels = apiData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Одобрено',
          data: apiData.map((item) => item.approved),
          backgroundColor: [ACTIVITY_COLORS.approved],
        },
        {
          label: 'Отклонено',
          data: apiData.map((item) => item.rejected),
          backgroundColor: [ACTIVITY_COLORS.rejected],
        },
        {
          label: 'На доработку',
          data: apiData.map((item) => item.requestChanges),
          backgroundColor: [ACTIVITY_COLORS.requestChanges],
        },
      ],
    };
  }

  private transformDecisionsData(apiData: any): ChartData {
    return {
      labels: ['Одобрено', 'Отклонено', 'На доработку'],
      datasets: [
        {
          label: 'Решения',
          data: [
            apiData.approved || 0,
            apiData.rejected || 0,
            apiData.requestChanges || 0,
          ],
          backgroundColor: COLORS,
        },
      ],
    };
  }
}

export const statsStore = new StatsStore();
