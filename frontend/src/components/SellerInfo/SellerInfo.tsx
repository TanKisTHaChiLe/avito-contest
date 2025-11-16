import { VStack, Box, Text, Card, Heading } from '@chakra-ui/react';

interface SellerInfoProps {
  name: string;
  rating: number;
  totalAds: number;
  registeredAt: string;
}

export const SellerInfo = ({
  name,
  rating,
  totalAds,
  registeredAt,
}: SellerInfoProps) => (
  <Card.Root>
    <Card.Body>
      <Heading size="md" mb={4}>
        Информация о продавце
      </Heading>
      <VStack gap={3} align="stretch">
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Имя
          </Text>
          <Text>{name || 'Не указано'}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Рейтинг
          </Text>
          <Text>{rating ? `${rating}/5.0` : 'Нет рейтинга'}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Количество объявлений
          </Text>
          <Text>{totalAds || 0}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Дата регистрации
          </Text>
          <Text>
            {registeredAt
              ? new Date(registeredAt).toLocaleDateString('ru-RU')
              : 'Не указана'}
          </Text>
        </Box>
      </VStack>
    </Card.Body>
  </Card.Root>
);
