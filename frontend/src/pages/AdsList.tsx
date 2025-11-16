import { useEffect, useRef, useState } from 'react';
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
  Pagination,
  IconButton,
  ButtonGroup,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { AdsCard } from '../components/AdsCard/AdsCard';
import { adsStore } from '../stores/adsStore/adsStore';
import { Filters } from '../components/Filters/Filters';

const sortOptions = createListCollection({
  items: [
    { label: 'Новые сначала', value: 'createdAt_desc' },
    { label: 'Старые сначала', value: 'createdAt_asc' },
    { label: 'Цена по убыванию', value: 'price_desc' },
    { label: 'Цена по возрастанию', value: 'price_asc' },
    { label: 'Приоритетные', value: 'priority_desc' },
  ],
});

export const AdsList = observer(() => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    adsStore.fetchAds(1);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isSearchFocused || event.key !== '/') {
        return;
      }

      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      event.preventDefault();

      if (searchInputRef.current) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }, 300);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isSearchFocused]);

  const handlePageChange = (details: { page: number }) => {
    adsStore.fetchAds(details.page);
  };

  const handleSortChange = (details: { value: string[] }) => {
    const [sortBy, sortOrder] = details.value[0].split('_');
    adsStore.setFilters({ sortBy: sortBy as any, sortOrder: sortOrder as any });
    adsStore.fetchAds(1);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <Box
      padding={6}
      background="gray.50"
      minH="100vh"
      maxWidth="1200px"
      mx="auto"
    >
      <Container maxW="container.xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading size="xl">Модерация объявлений</Heading>
          </Flex>

          <Filters
            onFiltersChange={() => adsStore.fetchAds(1)}
            searchInputRef={searchInputRef}
            onSearchFocus={handleSearchFocus}
            onSearchBlur={handleSearchBlur}
          />

          <Flex justify="space-between" align="center">
            <Text color="gray.600" fontSize="sm">
              Найдено объявлений: {adsStore.pagination.totalItems}
            </Text>

            <Select.Root
              collection={sortOptions}
              size="sm"
              width="250px"
              value={[
                `${adsStore.filters.sortBy}_${adsStore.filters.sortOrder}`,
              ]}
              onValueChange={handleSortChange}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  style={{
                    backgroundColor: '#FFFFFF',
                    outline: '2px solid #e2e8f0',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  <Select.ValueText placeholder="Сортировка" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {sortOptions.items.map((option) => (
                      <Select.Item item={option} key={option.value}>
                        {option.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          {adsStore.loading ? (
            <Center py={10} minH="200px">
              <Stack align="center" gap={4}>
                <Spinner size="xl" />
                <Text color="gray.500">Загрузка объявлений...</Text>
              </Stack>
            </Center>
          ) : adsStore.ads.length === 0 ? (
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
