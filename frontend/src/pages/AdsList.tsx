import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Heading, Stack, Flex, Container } from '@chakra-ui/react';
import { adsStore } from '../stores/adsStore/adsStore';
import { Filters } from '../components/Filters/Filters';
import { AdsListHeader } from '../components/AdsListHeader';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { AdsGrid } from '../components/AdsGrid';
import { AdsPagination } from '../components/AdsPagination';
import { ErrorBanner } from '../components/ErrorBanner';

export const AdsList = observer(() => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    adsStore.fetchAds(1);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isSearchFocused || event.key !== '/') return;
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;

      event.preventDefault();

      if (searchInputRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }, 300);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSearchFocused]);

  const handlePageChange = (page: number) => {
    adsStore.fetchAds(page);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_');
    adsStore.setFilters({ sortBy: sortBy as any, sortOrder: sortOrder as any });
    adsStore.fetchAds(1);
  };

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => setIsSearchFocused(false);

  const sortValue = `${adsStore.filters.sortBy}_${adsStore.filters.sortOrder}`;

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

          <AdsListHeader
            totalItems={adsStore.pagination.totalItems}
            sortValue={sortValue}
            onSortChange={handleSortChange}
          />

          {adsStore.loading ? (
            <LoadingState />
          ) : adsStore.ads.length === 0 ? (
            <EmptyState error={adsStore.error} />
          ) : (
            <>
              <AdsGrid ads={adsStore.ads} />
              <AdsPagination
                totalItems={adsStore.pagination.totalItems}
                pageSize={adsStore.pagination.limit || 10}
                currentPage={adsStore.pagination.currentPage}
                totalPages={adsStore.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          <ErrorBanner
            error={adsStore.error}
            show={!!adsStore.error && adsStore.ads.length > 0}
          />
        </Stack>
      </Container>
    </Box>
  );
});
