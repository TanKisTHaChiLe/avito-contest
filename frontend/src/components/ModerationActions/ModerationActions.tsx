import { VStack, HStack, Button, Box, Heading } from '@chakra-ui/react';
import { RejectPopover } from '../RejectPopover/RejectPopover';
import { ModPopover } from '../ModPopover/ModPopover';

interface ModerationActionsProps {
  onApprove: () => void;
  onReject: () => void;
  onReturnForRevision: () => void;
  selectedReasons: string[];
  customReason: string;
  onReasonChange: (reason: string, checked: boolean) => void;
  onCustomReasonChange: (reason: string) => void;
  onPopoverClose: () => void;
  isSubmitDisabled: boolean;
  loadingAction?: string | null;
  currentAdStatus?: string;
}

export const ModerationActions = ({
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
}: ModerationActionsProps) => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Действия модератора
      </Heading>
      <VStack gap={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
        <Button
          colorPalette="green"
          width="100%"
          onClick={onApprove}
          loading={loadingAction === 'approve'}
          disabled={!!loadingAction || currentAdStatus === 'approved'}
          _disabled={{
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
        >
          Одобрить
        </Button>
        <RejectPopover
          selectedReasons={selectedReasons}
          customReason={customReason}
          onReasonChange={onReasonChange}
          onCustomReasonChange={onCustomReasonChange}
          onSubmit={onReject}
          onClose={onPopoverClose}
          isSubmitDisabled={isSubmitDisabled}
          loading={loadingAction === 'reject'}
          disabled={!!loadingAction || currentAdStatus === 'rejected'}
        />
        <ModPopover
          selectedReasons={selectedReasons}
          customReason={customReason}
          onReasonChange={onReasonChange}
          onCustomReasonChange={onCustomReasonChange}
          onSubmit={onReturnForRevision}
          onClose={onPopoverClose}
          isSubmitDisabled={isSubmitDisabled}
          loading={loadingAction === 'revision'}
          disabled={!!loadingAction}
        />
      </VStack>
      <HStack gap={3} display={{ base: 'none', md: 'flex' }}>
        <Button
          colorPalette="green"
          flex={1}
          onClick={onApprove}
          loading={loadingAction === 'approve'}
          disabled={!!loadingAction || currentAdStatus === 'approved'}
          _disabled={{
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
        >
          Одобрить
        </Button>
        <RejectPopover
          selectedReasons={selectedReasons}
          customReason={customReason}
          onReasonChange={onReasonChange}
          onCustomReasonChange={onCustomReasonChange}
          onSubmit={onReject}
          onClose={onPopoverClose}
          isSubmitDisabled={isSubmitDisabled}
          loading={loadingAction === 'reject'}
          disabled={!!loadingAction || currentAdStatus === 'rejected'}
        />
        <ModPopover
          selectedReasons={selectedReasons}
          customReason={customReason}
          onReasonChange={onReasonChange}
          onCustomReasonChange={onCustomReasonChange}
          onSubmit={onReturnForRevision}
          onClose={onPopoverClose}
          isSubmitDisabled={isSubmitDisabled}
          loading={loadingAction === 'revision'}
          disabled={!!loadingAction}
        />
      </HStack>
    </Box>
  );
};
