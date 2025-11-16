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
  action: 'approved' | 'rejected' | 'changes_requested';
  comment?: string;
}

interface ModerationHistoryProps {
  history: ModerationHistoryItem[];
}

export const ModerationHistory = ({ history }: ModerationHistoryProps) => (
  <Card.Root minHeight={{ base: '100px', md: '350px' }}>
    <Card.Body height="100%" display="flex" flexDirection="column">
      <Heading size="md" mb={4}>
        История модерации
      </Heading>
      <VStack
        gap={3}
        align="stretch"
        flex="1"
        overflowY="auto"
        maxHeight="280px"
        paddingRight="2"
      >
        {history && history.length > 0 ? (
          history.map((item, index) => (
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
          ))
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            flex="1"
          >
            <Text color="gray.500" fontSize="md" textAlign="center">
              История модерации пуста
            </Text>
          </Box>
        )}
      </VStack>
    </Card.Body>
  </Card.Root>
);
