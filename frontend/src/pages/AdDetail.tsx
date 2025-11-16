import { VStack, Box, Container } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useAdDetail } from '../utils/hooks/useAdDetail';
import { AlertNotification } from '../components/AlertNotification';
import { RejectDialog } from '../components/RejectDialog';
import { AdContentGrid } from '../components/AdContentGrid';
import { AdDescription } from '../components/AdDescription';
import { AdActionsSection } from '../components/AdActionsSection';
import { AdLoadingState } from '../components/AdLoadingState';
import { AdErrorState } from '../components/AdErrorState';

export const AdDetail = observer(() => {
  const {
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
    ad,
    loading,
  } = useAdDetail();

  if (!isInitialized || (loading && !ad)) {
    return <AdLoadingState />;
  }

  if (!ad) {
    return <AdErrorState />;
  }

  return (
    <Box padding={6} background="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <AlertNotification alert={alert} isVisible={isAlertVisible} />

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
          disabled={ad?.status === 'rejected'}
        />

        <VStack gap={6} align="stretch">
          <AdContentGrid
            images={ad.images || []}
            moderationHistory={(ad.moderationHistory || []).map(
              ({ action, moderatorName, comment, timestamp }) => ({
                action,
                moderatorName,
                comment,
                timestamp,
              })
            )}
            category={ad.category}
            price={ad.price}
            status={ad.status}
            priority={ad.priority}
            createdAt={ad.createdAt}
            seller={ad.seller}
          />

          <AdDescription description={ad.description} />

          <AdActionsSection
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
            currentAdStatus={ad?.status}
            onBackToList={handleBackToList}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={canGoPrevious()}
            canGoNext={canGoNext()}
            isNavigating={isNavigating}
          />
        </VStack>
      </Container>
    </Box>
  );
});
