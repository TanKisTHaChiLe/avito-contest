import { Card, Text, Stack } from '@chakra-ui/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  color = 'blue',
}: MetricCardProps) => (
  <Card.Root p={4} height="100%">
    <Stack gap={2}>
      <Text fontSize="sm" color="gray.600" fontWeight="medium">
        {title}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color={`${color}.500`}>
        {value}
      </Text>
      {subtitle && (
        <Text fontSize="xs" color="gray.500">
          {subtitle}
        </Text>
      )}
    </Stack>
  </Card.Root>
);
