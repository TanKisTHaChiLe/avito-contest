import { Button, Card, Image, Text, Box, HStack } from '@chakra-ui/react';

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
  let statusBackground = '';
  let statusColor = '';
  switch (adsInformation.status) {
    case 'pending':
      statusBackground = '#EAB308';
      statusColor = '#000000';
      break;
    case 'approved':
      statusBackground = '#16A34A';
      statusColor = '#FFFFFF';
      break;
    case 'rejected':
      statusBackground = '#DC2626';
      statusColor = '#FFFFFF';
      break;
    case 'draft':
      statusBackground = '#6B7280';
      statusColor = '#FFFFFF';
      break;
    default:
      statusBackground = '#E5E7EB';
      statusColor = '#374151';
  }

  let priorityBackground = '';
  let priorityColor = '';
  switch (adsInformation.priority) {
    case 'normal':
      priorityBackground = '#2563EB';
      priorityColor = '#FFFFFF';
      break;
    case 'urgent':
      priorityBackground = '#DC2626';
      priorityColor = '#FFFFFF';
      break;
    default:
      priorityBackground = '#E5E7EB';
      priorityColor = '#374151';
  }

  return (
    <Card.Root overflow="hidden" width="100%">
      <Box
        width="100%"
        height="200px"
        position="relative"
        overflow="hidden"
        backgroundColor="#f4f4f5"
      >
        {adsInformation.images[0] ? (
          <Image
            src={adsInformation.images[0]}
            alt="Product image"
            objectFit="cover"
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
          />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Text fontSize="md" textAlign="center" fontWeight="medium">
              No image
            </Text>
          </Box>
        )}
      </Box>

      <Box padding="4" display="flex" flexDirection="column" gap="3">
        <Card.Title fontSize="lg" lineHeight="tight">
          {adsInformation.title}
        </Card.Title>

        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          {adsInformation.price}₽
        </Text>

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
            {adsInformation.status}
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
            {adsInformation.priority}
          </Text>
        </HStack>

        <HStack gap="15px" justify="start" width="auto">
          <Text fontSize="md" color="gray.600" fontWeight="medium">
            {adsInformation.category}
          </Text>
          <Text fontSize="md" color="gray.500">
            {adsInformation.date}
          </Text>
        </HStack>

        <Button
          variant="solid"
          colorPalette="yellow"
          size="md"
          width="full"
          fontWeight="semibold"
          marginTop="2"
        >
          Открыть
        </Button>
      </Box>
    </Card.Root>
  );
};
