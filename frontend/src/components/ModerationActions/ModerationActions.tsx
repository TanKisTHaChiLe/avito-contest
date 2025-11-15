import { VStack, HStack, Button, Box, Heading } from '@chakra-ui/react';
import { RejectPopover } from '../RejectPopover/RejectPopover';

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
}: ModerationActionsProps) => (
  <Box>
    <Heading size="md" mb={4}>
      Действия модератора
    </Heading>
    <VStack gap={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
      <Button colorPalette="green" width="100%" onClick={onApprove}>
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
      />
      <Button colorPalette="yellow" width="100%" onClick={onReturnForRevision}>
        Доработка
      </Button>
    </VStack>
    <HStack gap={3} display={{ base: 'none', md: 'flex' }}>
      <Button colorPalette="green" flex={1} onClick={onApprove}>
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
      />
      <Button colorPalette="yellow" flex={1} onClick={onReturnForRevision}>
        Доработка
      </Button>
    </HStack>
  </Box>
);
