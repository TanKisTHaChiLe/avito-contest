import { renderHook, act } from '@testing-library/react';
import { useAdDetail } from '../../hooks/useAdDetail';
import { adsStore } from '../../../stores/adsStore/adsStore';
import { Ad } from '../../../stores/adsStore/types';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../stores/adsStore/adsStore');

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

describe('useAdDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    adsStore.currentAd = createMockAd({
      id: '1',
      title: 'Test Ad',
      status: 'pending',
    });

    adsStore.ads = [
      createMockAd({ id: '1', title: 'Test Ad' }),
      createMockAd({ id: '2', title: 'Test Ad 2' }),
    ];

    adsStore.pagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      limit: 10,
    };

    (adsStore.fetchAdById as jest.Mock).mockResolvedValue(undefined);
    (adsStore.approveAd as jest.Mock).mockResolvedValue(undefined);
    (adsStore.rejectAd as jest.Mock).mockResolvedValue(undefined);
    (adsStore.requestChanges as jest.Mock).mockResolvedValue(undefined);
    (adsStore.fetchAds as jest.Mock).mockResolvedValue(undefined);
    (adsStore.getPreviousAdId as jest.Mock).mockReturnValue(null);
    (adsStore.getNextAdId as jest.Mock).mockReturnValue(null);
  });

  it('Инициализируется с корректным состоянием', () => {
    const { result } = renderHook(() => useAdDetail());

    expect(result.current.id).toBe('1');
    expect(result.current.selectedReasons).toEqual([]);
    expect(result.current.isInitialized).toBe(true);
  });

  it('Обрабатывает действие одобрения', async () => {
    (adsStore.approveAd as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      await result.current.handleApprove();
    });

    expect(adsStore.approveAd).toHaveBeenCalledWith('1');
  });

  it('Обрабатывает действие отклонения', async () => {
    (adsStore.rejectAd as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      result.current.handleReasonChange('spam', true);
    });

    await act(async () => {
      await result.current.handleRejectSubmit();
    });

    expect(adsStore.rejectAd).toHaveBeenCalled();
  });

  it('Обрабатывает действие возврата на доработку', async () => {
    (adsStore.requestChanges as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      result.current.handleReasonChange('needs_improvement', true);
    });

    await act(async () => {
      await result.current.handleReturnForRevision();
    });

    expect(adsStore.requestChanges).toHaveBeenCalled();
  });

  it('Не вызывает отклонение при отсутствии выбранных причин', async () => {
    (adsStore.rejectAd as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      await result.current.handleRejectSubmit();
    });

    expect(adsStore.rejectAd).not.toHaveBeenCalled();
  });

  it('Не вызывает возврат на доработку при отсутствии выбранных причин', async () => {
    (adsStore.requestChanges as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      await result.current.handleReturnForRevision();
    });

    expect(adsStore.requestChanges).not.toHaveBeenCalled();
  });

  it('Обрабатывает выбор причины', () => {
    const { result } = renderHook(() => useAdDetail());

    act(() => {
      result.current.handleReasonChange('spam', true);
    });

    expect(result.current.selectedReasons).toContain('spam');

    act(() => {
      result.current.handleReasonChange('spam', false);
    });

    expect(result.current.selectedReasons).not.toContain('spam');
  });

  it('Обрабатывает изменение кастомной причины', () => {
    const { result } = renderHook(() => useAdDetail());

    act(() => {
      result.current.setCustomReason('Кастомный текст причины');
    });

    expect(result.current.customReason).toBe('Кастомный текст причины');
  });

  it('Обрабатывает закрытие попапа', () => {
    const { result } = renderHook(() => useAdDetail());

    act(() => {
      result.current.handleReasonChange('spam', true);
      result.current.setCustomReason('Кастомная причина');
    });

    expect(result.current.selectedReasons).toContain('spam');
    expect(result.current.customReason).toBe('Кастомная причина');

    act(() => {
      result.current.handlePopoverClose();
    });

    expect(result.current.selectedReasons).toEqual([]);
    expect(result.current.customReason).toBe('');
  });

  it('Обрабатывает действия навигации', async () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    (adsStore.getPreviousAdId as jest.Mock).mockReturnValue('0');
    (adsStore.getNextAdId as jest.Mock).mockReturnValue('2');

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      await result.current.handlePrevious();
    });

    await act(async () => {
      await result.current.handleNext();
    });

    expect(adsStore.getPreviousAdId).toHaveBeenCalled();
    expect(adsStore.getNextAdId).toHaveBeenCalled();
  });

  it('Обрабатывает возврат к списку', () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useAdDetail());

    act(() => {
      result.current.handleBackToList();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/list');
  });

  it('Корректно вычисляет canGoPrevious и canGoNext', () => {
    (adsStore.getPreviousAdId as jest.Mock).mockReturnValue('0');
    (adsStore.getNextAdId as jest.Mock).mockReturnValue('2');

    const { result } = renderHook(() => useAdDetail());

    const canGoPrevious = result.current.canGoPrevious();
    const canGoNext = result.current.canGoNext();

    expect(canGoPrevious).toBe(true);
    expect(canGoNext).toBe(true);
  });

  it('Корректно вычисляет isSubmitDisabled', () => {
    const { result } = renderHook(() => useAdDetail());

    expect(result.current.isSubmitDisabled).toBe(true);

    act(() => {
      result.current.handleReasonChange('spam', true);
    });

    expect(result.current.isSubmitDisabled).toBe(false);

    act(() => {
      result.current.handleReasonChange('spam', false);
      result.current.handleReasonChange('Другое', true);
    });

    expect(result.current.isSubmitDisabled).toBe(true);

    act(() => {
      result.current.setCustomReason('Кастомная причина');
    });

    expect(result.current.isSubmitDisabled).toBe(false);
  });

  it('Обрабатывает отклонение с кастомной причиной', async () => {
    (adsStore.rejectAd as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdDetail());

    await act(async () => {
      result.current.handleReasonChange('Другое', true);
      result.current.setCustomReason('Кастомная причина');
    });

    await act(async () => {
      await result.current.handleRejectSubmit();
    });

    expect(adsStore.rejectAd).toHaveBeenCalledWith(
      '1',
      'Кастомная причина',
      'Кастомная причина'
    );
  });

  it('Обрабатывает состояния загрузки во время действий', async () => {
    let resolveApprove: (value: unknown) => void;
    const approvePromise = new Promise((resolve) => {
      resolveApprove = resolve;
    });
    (adsStore.approveAd as jest.Mock).mockReturnValue(approvePromise);

    const { result } = renderHook(() => useAdDetail());

    let actionPromise: Promise<void>;
    await act(async () => {
      actionPromise = result.current.handleApprove();
    });

    expect(result.current.actionLoading).toBe('approve');

    await act(async () => {
      resolveApprove!(undefined);
      await actionPromise;
    });

    expect(result.current.actionLoading).toBeNull();
  });

  it('Обрабатывает состояние диалога отклонения', () => {
    const { result } = renderHook(() => useAdDetail());

    expect(result.current.isRejectDialogOpen).toBe(false);

    act(() => {
      result.current.setIsRejectDialogOpen(true);
    });

    expect(result.current.isRejectDialogOpen).toBe(true);

    act(() => {
      result.current.setIsRejectDialogOpen(false);
    });

    expect(result.current.isRejectDialogOpen).toBe(false);
  });
});
