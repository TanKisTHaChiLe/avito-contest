import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { adsStore } from '../stores/adsStore/adsStore';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { ModerationHistory } from '../components/ModerationHistory/ModerationHistory';
import { ProductCharacteristics } from '../components/ProductCharacteristics/ProductCharacteristics';
import { SellerInfo } from '../components/SellerInfo/SellerInfo';
import { ModerationActions } from '../components/ModerationActions/ModerationActions';

export const AdDetail = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshAdData = async () => {
    if (!id) return;
    await adsStore.fetchAdById(id);
  };

  useEffect(() => {
    const initializeAd = async () => {
      if (!id) return;

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

    if (!isInitialized) {
      initializeAd();
    }
  }, [id, isInitialized]);

  const handleBackToList = () => {
    navigate('/list');
  };

  const handlePrevious = async () => {
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
  };

  const handleNext = async () => {
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
  };

  const handleApprove = async () => {
    if (!id || !adsStore.currentAd) return;

    setActionLoading('approve');
    try {
      await adsStore.approveAd(id);
      await refreshAdData();
    } catch (error) {
      console.error('Ошибка при одобрении:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (selectedReasons.length === 0 || !id || !adsStore.currentAd) return;

    setActionLoading('reject');
    try {
      let reason = '';
      if (selectedReasons.includes('Другое') && customReason.trim()) {
        reason = customReason;
      } else {
        reason = selectedReasons.join(', ');
      }

      await adsStore.rejectAd(id, reason, customReason);
      await refreshAdData();

      setSelectedReasons([]);
      setCustomReason('');
    } catch (error) {
      console.error('Ошибка при отклонении:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturnForRevision = async () => {
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
      await refreshAdData();

      setSelectedReasons([]);
      setCustomReason('');
    } catch (error) {
      console.error('Ошибка при запросе доработки:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons([...selectedReasons, reason]);
    } else {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    }
  };

  const handlePopoverClose = () => {
    setSelectedReasons([]);
    setCustomReason('');
  };

  const isSubmitDisabled =
    selectedReasons.length === 0 ||
    (selectedReasons.includes('Другое') && !customReason.trim());

  const canGoPrevious = () => {
    if (!adsStore.currentAd) return false;

    if (adsStore.getPreviousAdId() !== null) {
      return true;
    }

    if (adsStore.pagination.currentPage === 1) {
      const currentIndex = adsStore.getCurrentAdIndex();
      return currentIndex > 0;
    }

    return adsStore.pagination.currentPage > 1;
  };

  const canGoNext = () => {
    if (!adsStore.currentAd) return false;

    if (adsStore.getNextAdId() !== null) {
      return true;
    }

    if (adsStore.pagination.currentPage === adsStore.pagination.totalPages) {
      const currentIndex = adsStore.getCurrentAdIndex();
      return currentIndex < adsStore.ads.length - 1;
    }

    return adsStore.pagination.currentPage < adsStore.pagination.totalPages;
  };

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
        <VStack gap={6} align="stretch">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <Card.Root height="350px">
              <Card.Body height="100%">
                <ImageGallery images={ad.images || []} />
              </Card.Body>
            </Card.Root>

            <Card.Root height="350px">
              <Card.Body height="100%" display="flex" flexDirection="column">
                <Heading size="md" mb={4}>
                  История модерации
                </Heading>
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
              </Card.Body>
            </Card.Root>
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
            <Card.Root>
              <Card.Body>
                <Heading size="md" mb={4}>
                  Характеристики товара
                </Heading>
                <ProductCharacteristics
                  category={ad.category}
                  price={ad.price}
                  status={ad.status}
                  priority={ad.priority}
                  createdAt={ad.createdAt}
                />
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Body>
                <Heading size="md" mb={4}>
                  Информация о продавце
                </Heading>
                <SellerInfo
                  name={ad.seller?.name}
                  rating={ad.seller?.rating}
                  totalAds={ad.seller?.totalAds}
                  registeredAt={ad.seller?.registeredAt}
                />
              </Card.Body>
            </Card.Root>
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
