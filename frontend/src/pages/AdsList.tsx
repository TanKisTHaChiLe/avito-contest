import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Heading,
  Stack,
  Spinner,
  Center,
  Flex,
  Container,
} from '@chakra-ui/react';
import { AdsCard } from '../components/AdsCard';
import { adsStore } from '../stores/adsStore/adsStore';
import { Filters } from '../components/Filters';

export const AdsList = observer(() => {
  useEffect(() => {
    adsStore.fetchAds();
  }, []);

  if (adsStore.loading && adsStore.ads.length === 0) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  const inform ={
     id: '1',
    images: [''],
    title: 'Объявление 40: Работа для продажи',
    price: 12345,
    category: 'Работа',
    date: '15.12.2023',
    status: 'pending',
    priority: 'urgent',
  };

  return (
    <Box padding={6} background="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading size="xl">Модерация объявлений</Heading>
          </Flex>
          <Filters />

          <AdsCard adsInformation={inform}></AdsCard>
        </Stack>
      </Container>
    </Box>
  );
});
