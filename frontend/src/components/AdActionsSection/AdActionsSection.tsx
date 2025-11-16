import { Card, VStack } from '@chakra-ui/react';
import { ModerationActions } from '../ModerationActions';
import { NavigationControls } from '../NavigationControls';

interface AdActionsSectionProps {
  onApprove: () => void;
  onReject: () => void;
  onReturnForRevision: () => void;
  selectedReasons: string[];
  customReason: string;
  onReasonChange: (reason: string, checked: boolean) => void;
  onCustomReasonChange: (reason: string) => void;
  onPopoverClose: () => void;
  isSubmitDisabled: boolean;
  loadingAction: string | null;
  currentAdStatus?: string;
  onBackToList: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isNavigating: boolean;
}

export const AdActionsSection = ({
  onApprove,
  onReject,
  onReturnForRevision,
  selectedReasons,
  customReason,
  onReasonChange,
  onCustomReasonChange,
  onPopoverClose,
  isSubmitDisabled,
  loadingAction,
  currentAdStatus,
  onBackToList,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isNavigating,
}: AdActionsSectionProps) => {
  return (
    <Card.Root>
      <Card.Body>
        <VStack gap={6} align="stretch">
          <ModerationActions
            onApprove={onApprove}
            onReject={onReject}
            onReturnForRevision={onReturnForRevision}
            selectedReasons={selectedReasons}
            customReason={customReason}
            onReasonChange={onReasonChange}
            onCustomReasonChange={onCustomReasonChange}
            onPopoverClose={onPopoverClose}
            isSubmitDisabled={isSubmitDisabled}
            loadingAction={loadingAction}
            currentAdStatus={currentAdStatus}
          />

          <NavigationControls
            onBackToList={onBackToList}
            onPrevious={onPrevious}
            onNext={onNext}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isNavigating={isNavigating}
          />
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
