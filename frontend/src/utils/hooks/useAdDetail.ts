import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adsStore } from '../../stores/adsStore/adsStore';

export const useAdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedReasons([]);
    setCustomReason('');
    setActionLoading(null);
    setIsInitialized(false);
    setIsRejectDialogOpen(false);
  }, [id]);

  useEffect(() => {
    if (alert) {
      requestAnimationFrame(() => {
        setIsAlertVisible(true);
      });

      const timer = setTimeout(() => {
        setIsAlertVisible(false);
        setTimeout(() => {
          setAlert(null);
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = useCallback(
    (type: 'success' | 'error', message: string) => {
      setAlert({ type, message });
    },
    []
  );

  useEffect(() => {
    const initializeAd = async () => {
      if (!id) return;

      setSelectedReasons([]);
      setCustomReason('');
      setActionLoading(null);

      if (adsStore.ads.length > 0) {
        const existingAd = adsStore.ads.find(
          (ad) => Number(ad.id) === Number(id)
        );
        if (existingAd) {
          adsStore.currentAd = existingAd;
          setIsInitialized(true);
          return;
        }
      }

      await adsStore.fetchAdById(id);
      setIsInitialized(true);
    };

    initializeAd();
  }, [id]);

  const handleBackToList = useCallback(() => {
    navigate('/list');
  }, [navigate]);

  const handlePrevious = useCallback(async () => {
    if (isNavigating || !adsStore.currentAd) return;

    setIsNavigating(true);
    try {
      const previousAdId = adsStore.getPreviousAdId();

      if (previousAdId) {
        const existingAd = adsStore.ads.find((ad) => ad.id === previousAdId);
        if (existingAd) {
          adsStore.currentAd = existingAd;
          navigate(`/item/${previousAdId}`, { replace: true });
        }
      } else if (adsStore.pagination.currentPage > 1) {
        const success = await adsStore.loadPreviousPage();
        if (success && adsStore.ads.length > 0) {
          const lastAdId = adsStore.ads[adsStore.ads.length - 1].id;
          const lastAd = adsStore.ads.find((ad) => ad.id === lastAdId);
          if (lastAd) {
            adsStore.currentAd = lastAd;
            navigate(`/item/${lastAdId}`, { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Error navigating to previous ad:', error);
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating, navigate]);

  const handleNext = useCallback(async () => {
    if (isNavigating || !adsStore.currentAd) return;

    setIsNavigating(true);
    try {
      const nextAdId = adsStore.getNextAdId();

      if (nextAdId) {
        const existingAd = adsStore.ads.find((ad) => ad.id === nextAdId);
        if (existingAd) {
          adsStore.currentAd = existingAd;
          navigate(`/item/${nextAdId}`, { replace: true });
        }
      } else if (
        adsStore.pagination.currentPage < adsStore.pagination.totalPages
      ) {
        const success = await adsStore.loadNextPage();
        if (success && adsStore.ads.length > 0) {
          const firstAdId = adsStore.ads[0].id;
          const firstAd = adsStore.ads.find((ad) => ad.id === firstAdId);
          if (firstAd) {
            adsStore.currentAd = firstAd;
            navigate(`/item/${firstAdId}`, { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Error navigating to next ad:', error);
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating, navigate]);

  const handleApprove = useCallback(async () => {
    if (!id || !adsStore.currentAd) return;

    try {
      if (adsStore.currentAd.status === 'approved') {
        throw new Error('Объявление уже одобрено');
      }

      setActionLoading('approve');

      await adsStore.approveAd(id);
      showAlert('success', 'Статус успешно изменен!');
    } catch (error: any) {
      console.error('Ошибка при одобрении:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Ошибка при одобрении объявления';
      showAlert('error', errorMessage);
    } finally {
      setActionLoading(null);
    }
  }, [id, showAlert]);

  const handleRejectSubmit = useCallback(async () => {
    if (selectedReasons.length === 0 || !id || !adsStore.currentAd) {
      return;
    }

    try {
      if (adsStore.currentAd.status === 'rejected') {
        throw new Error('Объявление уже отклонено');
      }

      setActionLoading('reject');

      let reason = '';
      if (selectedReasons.includes('Другое') && customReason.trim()) {
        reason = customReason;
      } else {
        reason = selectedReasons.join(', ');
      }

      await adsStore.rejectAd(id, reason, customReason);
      showAlert('success', 'Статус успешно изменен!');

      setSelectedReasons([]);
      setCustomReason('');
      setIsRejectDialogOpen(false);
    } catch (error: any) {
      console.error('Ошибка при отклонении:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Ошибка при отклонении объявления';
      showAlert('error', errorMessage);
    } finally {
      setActionLoading(null);
    }
  }, [selectedReasons, id, customReason, showAlert]);

  const handleReturnForRevision = useCallback(async () => {
    if (selectedReasons.length === 0 || !id || !adsStore.currentAd) return;

    setActionLoading('revision');
    try {
      let reason = '';
      if (selectedReasons.includes('Другое') && customReason.trim()) {
        reason = customReason;
      } else {
        reason = selectedReasons.join(', ');
      }

      await adsStore.requestChanges(id, reason, customReason);
      showAlert('success', 'Статус успешно изменен!');

      setSelectedReasons([]);
      setCustomReason('');
    } catch (error: any) {
      console.error('Ошибка при запросе доработки:', error);
      const errorMessage =
        error.response?.data?.message || 'Ошибка при запросе доработки';
      showAlert('error', errorMessage);
    } finally {
      setActionLoading(null);
    }
  }, [selectedReasons, id, customReason, showAlert]);

  const handleReasonChange = useCallback((reason: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons((prev) => [...prev, reason]);
    } else {
      setSelectedReasons((prev) => prev.filter((r) => r !== reason));
    }
  }, []);

  const handlePopoverClose = useCallback(() => {
    setSelectedReasons([]);
    setCustomReason('');
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const isInputFocused =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement;

      if (isInputFocused) return;

      switch (event.key.toLowerCase()) {
        case 'a':
          event.preventDefault();
          handleApprove();
          break;

        case 'd':
          event.preventDefault();

          if (adsStore.currentAd?.status === 'rejected') {
            showAlert('error', 'Объявление уже отклонено');
          } else {
            setIsRejectDialogOpen(true);
          }
          break;

        case 'arrowright':
          event.preventDefault();
          handleNext();
          break;

        case 'arrowleft':
          event.preventDefault();
          handlePrevious();
          break;
      }
    },
    [
      handleApprove,
      handleNext,
      handlePrevious,
      adsStore.currentAd?.status,
      showAlert,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const isSubmitDisabled =
    selectedReasons.length === 0 ||
    (selectedReasons.includes('Другое') && !customReason.trim());

  const canGoPrevious = useCallback(() => {
    if (!adsStore.currentAd) return false;

    if (adsStore.getPreviousAdId() !== null) {
      return true;
    }

    if (adsStore.pagination.currentPage === 1) {
      const currentIndex = adsStore.getCurrentAdIndex();
      return currentIndex > 0;
    }

    return adsStore.pagination.currentPage > 1;
  }, [adsStore.currentAd]);

  const canGoNext = useCallback(() => {
    if (!adsStore.currentAd) return false;

    if (adsStore.getNextAdId() !== null) {
      return true;
    }

    if (adsStore.pagination.currentPage === adsStore.pagination.totalPages) {
      const currentIndex = adsStore.getCurrentAdIndex();
      return currentIndex < adsStore.ads.length - 1;
    }

    return adsStore.pagination.currentPage < adsStore.pagination.totalPages;
  }, [adsStore.currentAd]);

  return {
    id,
    selectedReasons,
    customReason,
    isNavigating,
    isInitialized,
    actionLoading,
    alert,
    isAlertVisible,
    isRejectDialogOpen,
    setIsRejectDialogOpen,
    setSelectedReasons,
    setCustomReason,
    handleBackToList,
    handlePrevious,
    handleNext,
    handleApprove,
    handleRejectSubmit,
    handleReturnForRevision,
    handleReasonChange,
    handlePopoverClose,
    canGoPrevious,
    canGoNext,
    isSubmitDisabled,
    ad: adsStore.currentAd,
    loading: adsStore.loading,
  };
};
