import {
  Dialog,
  VStack,
  HStack,
  Heading,
  Textarea,
  Checkbox,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  selectedReasons: string[];
  customReason: string;
  onReasonChange: (reason: string, checked: boolean) => void;
  onCustomReasonChange: (reason: string) => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const rejectionReasons = [
  'Запрещённый товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
];

export const RejectDialog = ({
  isOpen,
  onOpenChange,
  selectedReasons,
  customReason,
  onReasonChange,
  onCustomReasonChange,
  onSubmit,
  isSubmitDisabled,
  loading,
  disabled,
}: RejectDialogProps) => {
  const handleClose = () => {
    onOpenChange({ open: false });
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content width="400px" maxWidth="90vw">
          <Dialog.Header>
            <Dialog.Title>
              <Heading size="sm">Укажите причину отклонения</Heading>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body padding={4}>
            <VStack gap={4} align="stretch" width="100%">
              <VStack
                gap={3}
                align="stretch"
                maxHeight="200px"
                overflowY="auto"
              >
                {rejectionReasons.map((reason) => (
                  <Checkbox.Root
                    key={reason}
                    checked={selectedReasons.includes(reason)}
                    onCheckedChange={(details) =>
                      onReasonChange(reason, details.checked === true)
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label fontSize="sm" whiteSpace="nowrap">
                      {reason}
                    </Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </VStack>

              {selectedReasons.includes('Другое') && (
                <Box>
                  <Text fontWeight="semibold" mb={2} fontSize="sm">
                    Укажите причину
                  </Text>
                  <Textarea
                    placeholder="Введите причину отклонения..."
                    value={customReason}
                    onChange={(e) => onCustomReasonChange(e.target.value)}
                    minHeight="60px"
                    size="sm"
                    resize="vertical"
                  />
                </Box>
              )}
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap={2} justify="flex-end" width="100%">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                colorPalette="red"
                onClick={handleSubmit}
                disabled={isSubmitDisabled || loading || disabled}
                loading={loading}
                size="sm"
              >
                Отправить
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
