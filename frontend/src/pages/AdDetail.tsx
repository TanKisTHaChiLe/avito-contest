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
  Spinner,
  Center,
} from '@chakra-ui/react';
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

  useEffect(() => {
    if (id) {
      adsStore.fetchAdById(id);
    }
  }, [id]);

  const handleBackToList = () => {
    navigate('/list');
  };

  const handlePrevious = () => {};

  const handleNext = () => {};

  const handleApprove = () => {};

  const handleRejectSubmit = () => {
    if (selectedReasons.length === 0) return;

    let reason = '';
    if (selectedReasons.includes('Другое') && customReason.trim()) {
      reason = customReason;
    } else {
      reason = selectedReasons.join(', ');
    }

    setSelectedReasons([]);
    setCustomReason('');
  };

  const handleReturnForRevision = () => {};

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

  if (adsStore.loading && !adsStore.currentAd) {
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
                    >
                      К списку
                    </Button>

                    <HStack gap={2}>
                      <Button variant="outline" onClick={handlePrevious}>
                        Пред
                      </Button>
                      <Button variant="outline" onClick={handleNext}>
                        След
                      </Button>
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
                    >
                      К списку
                    </Button>

                    <HStack gap={2} width="100%">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        flex={1}
                      >
                        Пред
                      </Button>
                      <Button variant="outline" onClick={handleNext} flex={1}>
                        След
                      </Button>
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
