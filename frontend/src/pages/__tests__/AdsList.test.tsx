import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AdsList } from '../AdsList';
import { adsStore } from '../../stores/adsStore/adsStore';
import { Ad } from '../../stores/adsStore/types';

jest.mock('../../stores/adsStore/adsStore');

jest.mock('../../components/Filters/Filters', () => ({
  Filters: () => (
    <div data-testid="filters">
      <div>Компонент фильтров</div>
    </div>
  ),
}));

jest.mock('../../components/AdsCard', () => ({
  AdsCard: ({ adsInformation }: any) => (
    <div data-testid="ads-card">
      {adsInformation.title} - {adsInformation.price} ₽
    </div>
  ),
}));

jest.mock('../../components/AdsListHeader', () => ({
  AdsListHeader: ({ totalItems }: any) => (
    <div data-testid="ads-list-header">
      <div>Найдено объявлений: {totalItems}</div>
    </div>
  ),
}));

jest.mock('../../components/LoadingState', () => ({
  LoadingState: () => <div>Загрузка объявлений...</div>,
}));

jest.mock('../../components/EmptyState', () => ({
  EmptyState: ({ error }: any) => (
    <div>{error ? `Ошибка: ${error}` : 'Объявления не найдены'}</div>
  ),
}));

jest.mock('../../components/AdsGrid', () => ({
  AdsGrid: ({ ads }: any) => (
    <div data-testid="ads-grid">
      {ads.map((ad: any) => (
        <div key={ad.id} data-testid="ads-card">
          {ad.title} - {ad.price} ₽
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../../components/AdsPagination', () => ({
  AdsPagination: ({ totalItems, currentPage, totalPages }: any) => (
    <div data-testid="ads-pagination">
      Страница {currentPage} из {totalPages} (всего: {totalItems})
    </div>
  ),
}));

jest.mock('../../components/ErrorBanner', () => ({
  ErrorBanner: ({ error, show }: any) =>
    show ? <div data-testid="error-banner">Ошибка: {error}</div> : null,
}));

const createMockAd = (overrides?: Partial<Ad>): Ad => ({
  id: '1',
  title: 'Test Ad',
  description: 'Test Description',
  price: 1000,
  category: 'Electronics',
  categoryId: 1,
  images: [],
  status: 'pending',
  priority: 'normal',
  createdAt: '2023-01-01T00:00:00.000Z',
  seller: {
    id: '1',
    name: 'Test Seller',
    rating: 4.5,
    totalAds: 10,
    registeredAt: '2022-01-01T00:00:00.000Z',
  },
  moderationHistory: [],
  characteristics: {},
  ...overrides,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>
  );
};

describe('AdsList', () => {
  const mockAds = [
    createMockAd({
      id: '1',
      title: 'Test Ad 1',
      price: 1000,
      category: 'Electronics',
      status: 'pending',
    }),
    createMockAd({
      id: '2',
      title: 'Test Ad 2',
      price: 2000,
      category: 'Books',
      status: 'approved',
      priority: 'urgent',
    }),
  ];

  beforeEach(() => {
    (adsStore.fetchAds as jest.Mock).mockResolvedValue(undefined);
    (adsStore.setFilters as jest.Mock).mockImplementation(() => {});

    adsStore.ads = mockAds;
    adsStore.loading = false;
    adsStore.error = null;
    adsStore.filters = {
      status: [],
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    };
    adsStore.pagination = {
      currentPage: 1,
      totalPages: 2,
      totalItems: 20,
      limit: 10,
    };
  });

  it('отображает заголовок и основные компоненты', () => {
    renderWithProviders(<AdsList />);

    expect(screen.getByText('Модерация объявлений')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('ads-list-header')).toBeInTheDocument();
    expect(screen.getByText('Найдено объявлений: 20')).toBeInTheDocument();
  });

  it('показывает состояние загрузки', () => {
    adsStore.loading = true;

    renderWithProviders(<AdsList />);

    expect(screen.getByText('Загрузка объявлений...')).toBeInTheDocument();
  });

  it('отображает карточки объявлений', () => {
    renderWithProviders(<AdsList />);

    const adsCards = screen.getAllByTestId('ads-card');
    expect(adsCards).toHaveLength(2);
    expect(adsCards[0]).toHaveTextContent('Test Ad 1 - 1000 ₽');
    expect(adsCards[1]).toHaveTextContent('Test Ad 2 - 2000 ₽');
  });

  it('показывает состояние пустого списка', () => {
    adsStore.ads = [];

    renderWithProviders(<AdsList />);

    expect(screen.getByText('Объявления не найдены')).toBeInTheDocument();
  });

  it('показывает состояние ошибки', () => {
    adsStore.error = 'Ошибка загрузки';

    renderWithProviders(<AdsList />);

    expect(screen.getByText('Ошибка: Ошибка загрузки')).toBeInTheDocument();
  });

  it('отображает пагинацию', () => {
    renderWithProviders(<AdsList />);

    expect(screen.getByTestId('ads-pagination')).toBeInTheDocument();
    expect(screen.getByText('Страница 1 из 2 (всего: 20)')).toBeInTheDocument();
  });

  it('вызывает fetchAds при монтировании', () => {
    renderWithProviders(<AdsList />);

    expect(adsStore.fetchAds).toHaveBeenCalledWith(1);
  });
});
