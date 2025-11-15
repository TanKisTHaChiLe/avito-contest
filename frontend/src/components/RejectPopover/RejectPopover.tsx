import {
  Button,
  Popover,
  Portal,
  VStack,
  HStack,
  Heading,
  Textarea,
  Checkbox,
  Box,
  Text,
} from '@chakra-ui/react';

interface RejectPopoverProps {
  selectedReasons: string[];
  customReason: string;
  onReasonChange: (reason: string, checked: boolean) => void;
  onCustomReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
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

export const RejectPopover = ({
  selectedReasons,
  customReason,
  onReasonChange,
  onCustomReasonChange,
  onSubmit,
  onClose,
  isSubmitDisabled,
  loading,
  disabled,
}: RejectPopoverProps) => (
  <Popover.Root positioning={{ placement: 'top' }} onExitComplete={onClose}>
    <Popover.Trigger asChild>
      <Button
        colorPalette="red"
        flex={1}
        disabled={disabled}
        _disabled={{
          cursor: 'not-allowed',
          opacity: 0.6,
        }}
      >
        Отклонить
      </Button>
    </Popover.Trigger>
    <Portal>
      <Popover.Positioner>
        <Popover.Content width="300px">
          <Popover.Arrow />
          <Popover.Body padding={4}>
            <VStack gap={4} align="stretch" width="100%">
              <Heading size="sm" marginBottom={2}>
                Укажите причину отклонения
              </Heading>
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
              <HStack gap={2} justify="flex-end" marginTop={2}>
                <Popover.CloseTrigger asChild>
                  <Button variant="outline" size="sm">
                    Отмена
                  </Button>
                </Popover.CloseTrigger>
                <Button
                  colorPalette="red"
                  onClick={onSubmit}
                  disabled={isSubmitDisabled || loading}
                  loading={loading}
                  size="sm"
                >
                  Отправить
                </Button>
              </HStack>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  </Popover.Root>
);
