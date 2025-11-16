import { Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { statsStore } from '../../stores/statsStore/statsStore';
import { MetricCard } from './MetricCard';

export const StatsMetrics = observer(() => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <MetricCard
        title="Всего проверено"
        value={statsStore.summary?.totalReviewed || 0}
        color="blue"
      />
      <MetricCard
        title="Процент одобренных"
        value={`${(statsStore.summary?.approvedPercentage || 0).toFixed(1)}%`}
        color="green"
      />
      <MetricCard
        title="Процент отклоненных"
        value={`${(statsStore.summary?.rejectedPercentage || 0).toFixed(1)}%`}
        color="red"
      />
      <MetricCard
        title="Среднее время проверки на одно объявление"
        value={formatTime(statsStore.summary?.averageReviewTime || 0)}
        color="purple"
      />
    </Grid>
  );
});
