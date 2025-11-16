import { Card, Text, Grid, Button } from '@chakra-ui/react';

const periodOptions = [
  { label: 'Сегодня', value: 'today' },
  { label: 'Последние 7 дней', value: 'week' },
  { label: 'Последние 30 дней', value: 'month' },
];

interface StatsPeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const StatsPeriodFilter = ({
  selectedPeriod,
  onPeriodChange,
}: StatsPeriodFilterProps) => {
  return (
    <Card.Root p={4}>
      <Grid gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Период
        </Text>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(3, 1fr)',
          }}
          gap={2}
        >
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? 'solid' : 'outline'}
              onClick={() => onPeriodChange(option.value)}
              size="md"
            >
              {option.label}
            </Button>
          ))}
        </Grid>
      </Grid>
    </Card.Root>
  );
};
