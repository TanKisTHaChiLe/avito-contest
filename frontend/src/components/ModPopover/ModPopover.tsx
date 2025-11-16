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

interface ModPopoverProps {
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

const revisionReasons = [
  'Запрещённый товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
];

export const ModPopover = ({
  selectedReasons,
  customReason,
  onReasonChange,
  onCustomReasonChange,
  onSubmit,
  onClose,
  isSubmitDisabled,
  loading,
  disabled,
}: ModPopoverProps) => (
  <Popover.Root positioning={{ placement: 'top' }} onExitComplete={onClose}>
    <Popover.Trigger asChild>
      <Button colorPalette="yellow" flex={1} disabled={disabled}>
        Вернуть на доработку
      </Button>
    </Popover.Trigger>
    <Portal>
      <Popover.Positioner>
        <Popover.Content width="300px">
          <Popover.Arrow />
          <Popover.Body padding={4}>
            <VStack gap={4} align="stretch" width="100%">
              <Heading size="sm" marginBottom={2}>
                Укажите причину доработки
              </Heading>
              <VStack
                gap={3}
                align="stretch"
                maxHeight="200px"
                overflowY="auto"
              >
                {revisionReasons.map((reason) => (
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
                    placeholder="Введите причину доработки..."
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
                  colorPalette="yellow"
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
