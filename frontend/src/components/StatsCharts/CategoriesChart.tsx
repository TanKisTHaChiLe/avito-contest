import { Card, Text, VStack, Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CategoriesChartProps {
  data: any;
}

export const CategoriesChart = observer(({ data }: CategoriesChartProps) => {
  if (!data) return null;

  const chartData = Object.entries(data)
    .map(([category, count]) => ({
      name: category,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const formatLabel = (value: string) => {
    if (value.length > 20) {
      return value.substring(0, 17) + '...';
    }
    return value;
  };

  return (
    <Card.Root p={4}>
      <VStack gap={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Топ категорий
        </Text>
        <Box height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 12 }}
                tickFormatter={formatLabel}
              />
              <Tooltip
                formatter={(value) => [`${value} объявлений`, 'Количество']}
                labelFormatter={(label) => `Категория: ${label}`}
              />
              <Bar dataKey="count" fill="#8884d8" name="Количество" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Card.Root>
  );
});
