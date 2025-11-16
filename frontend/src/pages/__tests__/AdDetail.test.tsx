import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AdDetail } from '../AdDetail';
import { useAdDetail } from '../../utils/hooks/useAdDetail';
import { Ad } from '../../stores/adsStore/types';

jest.mock('../../utils/hooks/useAdDetail');

jest.mock('../../components/AlertNotification', () => ({
  AlertNotification: () => <div data-testid="alert-notification" />,
}));

jest.mock('../../components/RejectDialog', () => ({
  RejectDialog: () => <div data-testid="reject-dialog" />,
}));

jest.mock('../../components/AdContentGrid', () => ({
  AdContentGrid: ({ category, price, status, priority, seller }: any) => (
    <div data-testid="ad-content-grid">
      <div>Категория: {category}</div>
      <div>Цена: {price} ₽</div>
      <div>Статус: {status}</div>
      <div>Приоритет: {priority}</div>
      <div>Продавец: {seller.name}</div>
    </div>
  ),
}));

jest.mock('../../components/AdDescription', () => ({
  AdDescription: ({ description }: any) => (
    <div data-testid="ad-description">
      <div>Описание: {description}</div>
    </div>
  ),
}));

jest.mock('../../components/AdActionsSection', () => ({
  AdActionsSection: ({
    onApprove,
    onReject,
    onBackToList,
    onPrevious,
    onNext,
    canGoPrevious,
    canGoNext,
  }: any) => (
    <div data-testid="ad-actions-section">
      <button onClick={onApprove}>Одобрить</button>
      <button onClick={onReject}>Отклонить</button>
      <button onClick={onBackToList}>Назад к списку</button>
      <button
        onClick={onPrevious}
        aria-label="Предыдущее объявление"
        disabled={!canGoPrevious}
      >
        Предыдущее
      </button>
      <button
        onClick={onNext}
        aria-label="Следующее объявление"
        disabled={!canGoNext}
      >
        Следующее
      </button>
    </div>
  ),
}));

jest.mock('../../components/AdLoadingState', () => ({
  AdLoadingState: () => (
    <div data-testid="ad-loading-state" role="status">
      Загрузка...
    </div>
  ),
}));

jest.mock('../../components/AdErrorState', () => ({
  AdErrorState: () => (
    <div data-testid="ad-error-state">Объявление не найдено</div>
  ),
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
    name: 'John Doe',
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

describe('AdDetail', () => {
  const mockHandleApprove = jest.fn();
  const mockHandleNext = jest.fn();
  const mockHandlePrevious = jest.fn();
  const mockHandleRejectSubmit = jest.fn();
  const mockHandleBackToList = jest.fn();

  const mockUseAdDetail = {
    id: '1',
    selectedReasons: [],
    customReason: '',
    isNavigating: false,
    isInitialized: true,
    actionLoading: null,
    alert: null,
    isAlertVisible: false,
    isRejectDialogOpen: false,
    setIsRejectDialogOpen: jest.fn(),
    setSelectedReasons: jest.fn(),
    setCustomReason: jest.fn(),
    handleBackToList: mockHandleBackToList,
    handlePrevious: mockHandlePrevious,
    handleNext: mockHandleNext,
    handleApprove: mockHandleApprove,
    handleRejectSubmit: mockHandleRejectSubmit,
    handleReturnForRevision: jest.fn(),
    handleReasonChange: jest.fn(),
    handlePopoverClose: jest.fn(),
    canGoPrevious: jest.fn(() => true),
    canGoNext: jest.fn(() => true),
    isSubmitDisabled: false,
    ad: createMockAd(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAdDetail as jest.Mock).mockReturnValue(mockUseAdDetail);
  });

  it('должен отображать детали объявления', () => {
    renderWithProviders(<AdDetail />);

    expect(screen.getByTestId('ad-content-grid')).toBeInTheDocument();
    expect(screen.getByText('Категория: Electronics')).toBeInTheDocument();
    expect(screen.getByText('Цена: 1000 ₽')).toBeInTheDocument();
    expect(screen.getByText('Статус: pending')).toBeInTheDocument();
    expect(screen.getByText('Продавец: John Doe')).toBeInTheDocument();

    expect(screen.getByTestId('ad-description')).toBeInTheDocument();
    expect(screen.getByText('Описание: Test Description')).toBeInTheDocument();
  });

  it('должен показывать состояние загрузки', () => {
    (useAdDetail as jest.Mock).mockReturnValue({
      ...mockUseAdDetail,
      isInitialized: false,
    });

    renderWithProviders(<AdDetail />);

    expect(screen.getByTestId('ad-loading-state')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('должен показывать состояние ошибки', () => {
    (useAdDetail as jest.Mock).mockReturnValue({
      ...mockUseAdDetail,
      isInitialized: true,
      ad: null,
    });

    renderWithProviders(<AdDetail />);

    expect(screen.getByTestId('ad-error-state')).toBeInTheDocument();
    expect(screen.getByText('Объявление не найдено')).toBeInTheDocument();
  });

  it('должен обрабатывать кнопки навигации', () => {
    renderWithProviders(<AdDetail />);

    const backButton = screen.getByText('Назад к списку');
    fireEvent.click(backButton);

    expect(mockHandleBackToList).toHaveBeenCalled();
  });

  it('должен обрабатывать действия модерации', () => {
    renderWithProviders(<AdDetail />);

    const approveButton = screen.getByText('Одобрить');
    const rejectButton = screen.getByText('Отклонить');
    const backButton = screen.getByText('Назад к списку');

    fireEvent.click(approveButton);
    fireEvent.click(rejectButton);
    fireEvent.click(backButton);

    expect(mockHandleApprove).toHaveBeenCalled();
    expect(mockHandleRejectSubmit).toHaveBeenCalled();
    expect(mockHandleBackToList).toHaveBeenCalled();
  });

  it('должен обрабатывать навигацию по объявлениям', () => {
    renderWithProviders(<AdDetail />);

    const prevButton = screen.getByLabelText('Предыдущее объявление');
    const nextButton = screen.getByLabelText('Следующее объявление');

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(mockHandlePrevious).toHaveBeenCalled();
    expect(mockHandleNext).toHaveBeenCalled();
  });

  it('должен обрабатывать горячие клавиши', () => {
    const originalAddEventListener = document.addEventListener;
    const originalRemoveEventListener = document.removeEventListener;

    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();

    renderWithProviders(<AdDetail />);

    const mockEvent = {
      key: 'a',
      target: document.body,
      preventDefault: jest.fn(),
    };

    const mockHook = useAdDetail as jest.MockedFunction<typeof useAdDetail>;
    const hookInstance = mockHook.mock.results[0].value;

    const mockHandleKeyPress = jest.fn((event) => {
      if (event.key.toLowerCase() === 'a') {
        hookInstance.handleApprove();
      }
    });

    act(() => {
      mockHandleKeyPress(mockEvent);
    });

    expect(mockHandleApprove).toHaveBeenCalled();

    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });

  it('должен обрабатывать горячие клавиши через UI', () => {
    renderWithProviders(<AdDetail />);

    const approveButton = screen.getByText('Одобрить');
    fireEvent.click(approveButton);
    expect(mockHandleApprove).toHaveBeenCalled();

    const nextButton = screen.getByLabelText('Следующее объявление');
    fireEvent.click(nextButton);
    expect(mockHandleNext).toHaveBeenCalled();

    const prevButton = screen.getByLabelText('Предыдущее объявление');
    fireEvent.click(prevButton);
    expect(mockHandlePrevious).toHaveBeenCalled();
  });

  it('должен отображать диалоговые окна', () => {
    renderWithProviders(<AdDetail />);

    expect(screen.getByTestId('alert-notification')).toBeInTheDocument();
    expect(screen.getByTestId('reject-dialog')).toBeInTheDocument();
  });
});
