import {
  Button,
  Card,
  Text,
  Box,
  HStack,
  VStack,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type AdsInformation = {
  id: string;
  images: string[];
  title: string;
  price: number;
  category: string;
  date: string;
  status: string;
  priority: string;
};

type AdsProps = {
  adsInformation: AdsInformation;
};

export const AdsCard = ({ adsInformation }: AdsProps) => {
  const navigate = useNavigate();

  let statusText = '';
  let statusBackground = '';
  let statusColor = '';

  switch (adsInformation.status) {
    case 'rejected':
      statusText = 'Отклонено';
      statusBackground = '#DC2626';
      statusColor = '#FFFFFF';
      break;
    case 'approved':
      statusText = 'Одобрено';
      statusBackground = '#059669';
      statusColor = '#FFFFFF';
      break;
    case 'pending':
      statusText = 'На модерации';
      statusBackground = '#D97706';
      statusColor = '#FFFFFF';
      break;
    case 'draft':
      statusText = 'На доработке';
      statusBackground = '#86ea0dff';
      statusColor = '#190303ff';
      break;
    default:
      statusText = adsInformation.status;
      statusBackground = '#F3F4F6';
      statusColor = '#374151';
  }

  let priorityText = '';
  let priorityBackground = '';
  let priorityColor = '';

  switch (adsInformation.priority) {
    case 'urgent':
      priorityText = 'Срочный';
      priorityBackground = '#6b2525ff';
      priorityColor = '#FFFFFF';
      break;
    case 'normal':
      priorityText = 'Обычный';
      priorityBackground = '#9bb1d5ff';
      priorityColor = '#FFFFFF';
      break;
    default:
      priorityText = adsInformation.priority;
      priorityBackground = '#F3F4F6';
      priorityColor = '#374151';
  }

  const handleOpenClick = () => {
    navigate(`/item/${adsInformation.id}`);
  };

  return (
    <Card.Root overflow="hidden" width="100%">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        height="full"
      >
        <Box
          flexShrink="0"
          width={{ base: '100%', md: '200px' }}
          height={{ base: '170px', md: 'auto' }}
          aspectRatio={{ base: 'auto', md: '1' }}
          position="relative"
          overflow="hidden"
          backgroundColor="#f4f4f5"
        >
          {false &&
          adsInformation.images &&
          adsInformation.images.length > 0 ? (
            <Image
              src={adsInformation.images[0]}
              alt={adsInformation.title}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Text fontSize="md" textAlign="center" fontWeight="medium">
                Фотография
              </Text>
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          flex="1"
          padding="4"
          gap="4"
          minHeight="0"
        >
          <Box flex="1" display="flex" flexDirection="column" gap="3">
            <VStack
              align="start"
              gap="2"
              flex="1"
              justifyContent="space-between"
            >
              <Card.Title
                fontSize={{ base: 'lg', md: 'xl' }}
                lineHeight="tight"
              >
                {adsInformation.title}
              </Card.Title>

              <Text
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                color="blue.600"
              >
                {adsInformation.price}₽
              </Text>

              <HStack gap="3" justify="start" width="auto">
                <Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', sm: 'row' }}
                    alignItems={{ base: 'start', sm: 'baseline' }}
                    gap={{ base: 0, sm: 1 }}
                  >
                    <Text fontSize="sm" color="gray.500">
                      Категория:
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {adsInformation.category}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', sm: 'row' }}
                    alignItems={{ base: 'start', sm: 'baseline' }}
                    gap={{ base: 0, sm: 1 }}
                  >
                    <Text fontSize="sm" color="gray.500">
                      Дата создания:
                    </Text>
                    <Text fontSize="md" fontWeight="medium" color="gray.700">
                      {adsInformation.date}
                    </Text>
                  </Box>
                </Box>
              </HStack>

              <HStack gap="15px" justify="start" width="auto">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  backgroundColor={statusBackground}
                  color={statusColor}
                  paddingX="2"
                  paddingY="1"
                  borderRadius="md"
                >
                  {statusText}
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  backgroundColor={priorityBackground}
                  color={priorityColor}
                  paddingX="2"
                  paddingY="1"
                  borderRadius="md"
                >
                  {priorityText}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box
            alignSelf={{ base: 'stretch', md: 'flex-end' }}
            width={{ base: 'full', md: 'auto' }}
          >
            <Button
              onClick={handleOpenClick}
              variant="solid"
              colorPalette="yellow"
              size="md"
              width={{ base: 'full', md: 'auto' }}
              minWidth="120px"
              fontWeight="semibold"
              _hover={{
                backgroundColor: 'yellow.400',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.125s ease-in-out"
            >
              Открыть
            </Button>
          </Box>
        </Box>
      </Box>
    </Card.Root>
  );
};
