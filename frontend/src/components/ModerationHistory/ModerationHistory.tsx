import {
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  Heading,
  Box,
} from '@chakra-ui/react';

interface ModerationHistoryItem {
  moderatorName: string;
  timestamp: string;
  action: 'approved' | 'rejected' | 'changes_requested' | string;
  comment?: string;
}

interface ModerationHistoryProps {
  history: ModerationHistoryItem[];
}

export const ModerationHistory = ({ history }: ModerationHistoryProps) => (
  <Card.Root height={{ base: 'auto', md: '350px' }}>
    <Card.Body height="100%" display="flex" flexDirection="column">
      <Heading size="md" mb={4}>
        История модерации
      </Heading>
      <Box
        flex="1"
        overflowY={{ base: 'visible', md: 'auto' }}
        maxHeight={{ base: 'none', md: '280px' }}
        display="flex"
        flexDirection="column"
      >
        {history && history.length > 0 ? (
          <VStack gap={3} align="stretch">
            {history.map((item, index) => (
              <Card.Root key={index}>
                <Card.Body padding={3}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      {item.moderatorName}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {new Date(item.timestamp).toLocaleString('ru-RU')}
                    </Text>
                  </HStack>
                  <Badge
                    colorPalette={
                      item.action === 'approved'
                        ? 'green'
                        : item.action === 'rejected'
                          ? 'red'
                          : 'orange'
                    }
                    size="sm"
                    mb={2}
                  >
                    {item.action === 'approved'
                      ? 'Одобрено'
                      : item.action === 'rejected'
                        ? 'Отклонено'
                        : 'Возвращено на доработку'}
                  </Badge>
                  {item.comment && (
                    <Text fontSize="sm" color="gray.600">
                      {item.comment}
                    </Text>
                  )}
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex="1"
            height="100%"
          >
            <Text color="gray.500" fontSize="md" textAlign="center">
              Нет записей
            </Text>
          </Box>
        )}
      </Box>
    </Card.Body>
  </Card.Root>
);
