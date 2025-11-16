import { Box, Grid, Text, Heading, Image, Card } from '@chakra-ui/react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => (
  <Card.Root minHeight="350px">
    <Card.Body height="100%">
      <Box height={{ base: 'auto', md: '350px' }}>
        <Heading size="md" mb={4}>
          Галерея изображений
        </Heading>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          templateRows={{
            base: `repeat(${images.length}, 1fr)`,
            md: '1fr 1fr',
          }}
          gap={3}
          flex="1"
          minHeight="0"
        >
          {images.map((image, index) => {
            if (index > 4) return;
            return (
              <Box
                key={index}
                backgroundColor="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                minHeight="120px"
                position="relative"
                overflow="hidden"
              >
                {false && image ? (
                  <Image
                    src={image}
                    alt={`Изображение ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    Нет изображения
                  </Text>
                )}
              </Box>
            );
          })}
        </Grid>
      </Box>
    </Card.Body>
  </Card.Root>
);
