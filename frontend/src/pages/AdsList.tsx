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
  Text,
  HStack,
  Pagination,
  IconButton,
  ButtonGroup,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { AdsCard } from '../components/AdsCard';
import { adsStore } from '../stores/adsStore/adsStore';
import { Filters } from '../components/Filters';

export const AdsList = observer(() => {
  useEffect(() => {
    adsStore.fetchAds(1);
  }, []);

  const handlePageChange = (details: { page: number }) => {
    adsStore.fetchAds(details.page);
  };

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

          <Filters onFiltersChange={() => adsStore.fetchAds(1)} />

          <Flex justify="space-between" align="center">
            <Text color="gray.600" fontSize="sm">
              Найдено объявлений: {adsStore.pagination.totalItems}
            </Text>
            {adsStore.loading && (
              <HStack>
                <Spinner size="sm" />
                <Text fontSize="sm" color="gray.500">
                  Загрузка...
                </Text>
              </HStack>
            )}
          </Flex>

          {adsStore.ads.length === 0 ? (
            <Center py={10}>
              <Text fontSize="lg" color="gray.500">
                {adsStore.error || 'Объявления не найдены'}
              </Text>
            </Center>
          ) : (
            <>
              <Stack gap={6}>
                {adsStore.ads.map((ad) => (
                  <AdsCard
                    key={ad.id}
                    adsInformation={{
                      id: ad.id,
                      images: ad.images || [],
                      title: ad.title,
                      price: ad.price,
                      category: ad.category || 'Без категории',
                      date: new Date(ad.createdAt).toLocaleDateString('ru-RU'),
                      status: ad.status,
                      priority: ad.priority || 'normal',
                    }}
                  />
                ))}
              </Stack>

              {adsStore.pagination.totalPages > 1 && (
                <Center mt={8}>
                  <Pagination.Root
                    count={adsStore.pagination.totalItems}
                    pageSize={adsStore.pagination.limit || 10}
                    page={adsStore.pagination.currentPage}
                    onPageChange={handlePageChange}
                    siblingCount={1}
                  >
                    <ButtonGroup variant="outline" size="sm">
                      <Pagination.PrevTrigger asChild>
                        <IconButton>
                          <LuChevronLeft />
                        </IconButton>
                      </Pagination.PrevTrigger>

                      <Pagination.Items
                        render={(page) => (
                          <IconButton
                            variant={{
                              base: 'outline',
                              _selected: 'solid',
                            }}
                          >
                            {page.value}
                          </IconButton>
                        )}
                      />

                      <Pagination.NextTrigger asChild>
                        <IconButton>
                          <LuChevronRight />
                        </IconButton>
                      </Pagination.NextTrigger>
                    </ButtonGroup>
                  </Pagination.Root>
                </Center>
              )}
            </>
          )}

          {adsStore.error && adsStore.ads.length > 0 && (
            <Center>
              <Text color="red.500">{adsStore.error}</Text>
            </Center>
          )}
        </Stack>
      </Container>
    </Box>
  );
});
