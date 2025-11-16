import { Card, Text, Stack, Box } from '@chakra-ui/react';
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

const ACTIVITY_COLORS = {
  approved: '#00C49F',
  rejected: '#FF8042',
  requestChanges: '#FFBB28',
};

interface ActivityChartProps {
  data: any;
}

export const ActivityChart = observer(({ data }: ActivityChartProps) => {
  if (!data) return null;

  const chartData = data.labels.map((label: string, index: number) => ({
    name: label,
    approved: data.datasets[0].data[index],
    rejected: data.datasets[1]?.data[index] || 0,
    requestChanges: data.datasets[2]?.data[index] || 0,
  }));

  return (
    <Card.Root p={4}>
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Активность проверок
        </Text>
        <Box height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="approved"
                fill={ACTIVITY_COLORS.approved}
                name="Одобрено"
              />
              <Bar
                dataKey="rejected"
                fill={ACTIVITY_COLORS.rejected}
                name="Отклонено"
              />
              <Bar
                dataKey="requestChanges"
                fill={ACTIVITY_COLORS.requestChanges}
                name="На доработку"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Card.Root>
  );
});
