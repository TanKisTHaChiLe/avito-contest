import { Card, Text, Stack, Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

interface DecisionsChartProps {
  data: any;
}

export const DecisionsChart = observer(({ data }: DecisionsChartProps) => {
  if (!data) return null;

  const pieData = [
    { name: 'Одобрено', value: data.datasets[0].data[0] || 0 },
    { name: 'Отклонено', value: data.datasets[0].data[1] || 0 },
    { name: 'На доработке', value: data.datasets[0].data[2] || 0 },
  ];

  return (
    <Card.Root p={4}>
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Распределение решений
        </Text>
        <Box height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value: string) => (
                  <span style={{ color: '#333', fontSize: '14px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Card.Root>
  );
});
