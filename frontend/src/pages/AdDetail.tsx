import { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  IconButton,
  Spinner,
  Center,
  Alert,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { adsStore } from '../stores/adsStore/adsStore';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { ModerationHistory } from '../components/ModerationHistory/ModerationHistory';
import { ProductCharacteristics } from '../components/ProductCharacteristics/ProductCharacteristics';
import { SellerInfo } from '../components/SellerInfo/SellerInfo';
import { ModerationActions } from '../components/ModerationActions/ModerationActions';
import { RejectDialog } from '../components/RejectDialog/RejectDialog';

export const AdDetail = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>('');
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

  if (!isInitialized || (adsStore.loading && !adsStore.currentAd)) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!adsStore.currentAd) {
    return (
      <Center h="400px">
        <Text fontSize="lg" color="gray.500">
          Объявление не найдено
        </Text>
      </Center>
    );
  }

  const ad = adsStore.currentAd;
  return (
    <Box padding={6} background="gray.50" minH="100vh">
      <Container maxW="container.xl">
        {alert && (
          <Box
            position="fixed"
            top="20px"
            left="50%"
            transform={`translateX(-50%) ${
              isAlertVisible ? 'translateY(0)' : 'translateY(-100px)'
            }`}
            zIndex="1000"
            transition="transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
            opacity={isAlertVisible ? 1 : 0}
          >
            <Alert.Root status={alert.type}>
              <Alert.Indicator />
              <Alert.Title flex="1">{alert.message}</Alert.Title>
            </Alert.Root>
          </Box>
        )}

        <RejectDialog
          isOpen={isRejectDialogOpen}
          onOpenChange={(details) => setIsRejectDialogOpen(details.open)}
          selectedReasons={selectedReasons}
          customReason={customReason}
          onReasonChange={handleReasonChange}
          onCustomReasonChange={setCustomReason}
          onSubmit={handleRejectSubmit}
          isSubmitDisabled={isSubmitDisabled}
          loading={actionLoading === 'reject'}
          disabled={adsStore.currentAd?.status === 'rejected'}
        />

        <VStack gap={6} align="stretch">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <ImageGallery images={ad.images || []} />
            <ModerationHistory
              history={(ad.moderationHistory || []).map(
                ({ action, moderatorName, comment, timestamp }) => ({
                  action,
                  moderatorName,
                  comment,
                  timestamp,
                })
              )}
            />
          </Grid>

          <Card.Root>
            <Card.Body>
              <Heading size="md" mb={4}>
                Описание
              </Heading>
              <Text fontSize="md" lineHeight="1.6">
                {ad.description || 'Описание отсутствует'}
              </Text>
            </Card.Body>
          </Card.Root>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <ProductCharacteristics
              category={ad.category}
              price={ad.price}
              status={ad.status}
              priority={ad.priority}
              createdAt={ad.createdAt}
            />

            <SellerInfo
              name={ad.seller?.name}
              rating={ad.seller?.rating}
              totalAds={ad.seller?.totalAds}
              registeredAt={ad.seller?.registeredAt}
            />
          </Grid>

          <Card.Root>
            <Card.Body>
              <VStack gap={6} align="stretch">
                <ModerationActions
                  onApprove={handleApprove}
                  onReject={handleRejectSubmit}
                  onReturnForRevision={handleReturnForRevision}
                  selectedReasons={selectedReasons}
                  customReason={customReason}
                  onReasonChange={handleReasonChange}
                  onCustomReasonChange={setCustomReason}
                  onPopoverClose={handlePopoverClose}
                  isSubmitDisabled={isSubmitDisabled}
                  loadingAction={actionLoading}
                  currentAdStatus={adsStore.currentAd?.status}
                />

                <Box>
                  <HStack
                    justify="space-between"
                    width="100%"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleBackToList}
                      flex="0 0 auto"
                      outline="2px solid"
                      outlineColor="gray.400"
                    >
                      Назад к списку
                    </Button>

                    <HStack gap={2}>
                      <HStack gap={2}>
                        <IconButton
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={!canGoPrevious() || isNavigating}
                          aria-label="Предыдущее объявление"
                          outline="1px solid"
                          outlineColor="currentColor"
                        >
                          {isNavigating ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaChevronLeft />
                          )}
                        </IconButton>
                        <IconButton
                          variant="outline"
                          onClick={handleNext}
                          disabled={!canGoNext() || isNavigating}
                          aria-label="Следующее объявление"
                          outline="1px solid"
                          outlineColor="currentColor"
                        >
                          {isNavigating ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaChevronRight />
                          )}
                        </IconButton>
                      </HStack>
                    </HStack>
                  </HStack>

                  <VStack
                    gap={3}
                    align="stretch"
                    display={{ base: 'flex', md: 'none' }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleBackToList}
                      width="100%"
                      outline="2px solid"
                      outlineColor="gray.400"
                    >
                      Назад к списку
                    </Button>

                    <HStack gap={2} width="100%">
                      <IconButton
                        variant="outline"
                        onClick={handlePrevious}
                        flex={1}
                        disabled={!canGoPrevious() || isNavigating}
                        aria-label="Предыдущее объявление"
                        outline="1px solid"
                        outlineColor="currentColor"
                      >
                        {isNavigating ? (
                          <Spinner size="sm" />
                        ) : (
                          <FaChevronLeft />
                        )}
                      </IconButton>
                      <IconButton
                        variant="outline"
                        onClick={handleNext}
                        flex={1}
                        disabled={!canGoNext() || isNavigating}
                        aria-label="Следующее объявление"
                        outline="1px solid"
                        outlineColor="currentColor"
                      >
                        {isNavigating ? (
                          <Spinner size="sm" />
                        ) : (
                          <FaChevronRight />
                        )}
                      </IconButton>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
});
