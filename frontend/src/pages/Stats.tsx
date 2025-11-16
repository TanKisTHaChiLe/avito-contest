import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Heading,
  Grid,
  Flex,
  Container,
  Spinner,
  Center,
  Stack,
  Text,
} from '@chakra-ui/react';
import { statsStore } from '../stores/statsStore/statsStore';
import { StatsPeriodFilter } from '../components/StatsPeriodFilter';
import { StatsMetrics } from '../components/StatsMetrics';
import {
  ActivityChart,
  DecisionsChart,
  CategoriesChart,
} from '../components/StatsCharts';

export const Stats = observer(() => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    statsStore.fetchSummary(selectedPeriod);
    statsStore.fetchCharts(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <Box padding={6} background="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading size="xl">Статистика модератора</Heading>
          </Flex>

          <StatsPeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />

          {statsStore.loading ? (
            <Center py={10} minH="200px">
              <Stack align="center" gap={4}>
                <Spinner size="xl" />
                <Text color="gray.500">Загрузка статистики...</Text>
              </Stack>
            </Center>
          ) : statsStore.error ? (
            <Center py={10}>
              <Text fontSize="lg" color="red.500">
                {statsStore.error}
              </Text>
            </Center>
          ) : (
            <>
              <StatsMetrics />

              <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                <ActivityChart data={statsStore.activityChart} />
                <DecisionsChart data={statsStore.decisionsChart} />
              </Grid>

              <CategoriesChart data={statsStore.categoriesChart} />
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
});
