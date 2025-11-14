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

  return (
    <Box padding={6} background="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading size="xl">Модерация объявлений</Heading>
          </Flex>

          <Filters />
        </Stack>
      </Container>
    </Box>
  );
});
