import { VStack, HStack, Button, Box, Heading } from '@chakra-ui/react';
import { RejectPopover } from '../RejectPopover/RejectPopover';
import { ModificatePopover } from '../ModificatePopover/ModificatePopover';
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
  status: string;
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
  status,
}: ModerationActionsProps) => (
  <Box>
    <Heading size="md" mb={4}>
      Действия модератора
    </Heading>
    <VStack gap={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
      <Button
        colorPalette="green"
        width="100%"
        onClick={onApprove}
         disabled={status === 'approved'}
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
        status={status}
      />
      <ModificatePopover
        selectedReasons={selectedReasons}
        customReason={customReason}
        onReasonChange={onReasonChange}
        onCustomReasonChange={onCustomReasonChange}
        onSubmit={onReturnForRevision}
        onClose={onPopoverClose}
        isSubmitDisabled={isSubmitDisabled}
      />
    </VStack>
    <HStack gap={3} display={{ base: 'none', md: 'flex' }}>
      <Button
        colorPalette="green"
        flex={1}
        onClick={onApprove}
        disabled={status === 'approved'}
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
        status={status}
      />
      <ModificatePopover
        selectedReasons={selectedReasons}
        customReason={customReason}
        onReasonChange={onReasonChange}
        onCustomReasonChange={onCustomReasonChange}
        onSubmit={onReturnForRevision}
        onClose={onPopoverClose}
        isSubmitDisabled={isSubmitDisabled}

      />
    </HStack>
  </Box>
);
