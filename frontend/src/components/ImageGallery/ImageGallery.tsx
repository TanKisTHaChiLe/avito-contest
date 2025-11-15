import { Box, Grid, Text, Heading } from '@chakra-ui/react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => (
  <Box height="350px">
    <Heading size="md" mb={4}>
      Галерея изображений
    </Heading>
    <Grid
      templateColumns="1fr 1fr"
      templateRows="1fr 1fr"
      gap={3}
      flex="1"
      minHeight="0"
    >
      {[1, 2, 3, 4].map((index) => (
        <Box
          key={index}
          backgroundColor="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          minHeight="120px"
        >
          <Text color="gray.500" fontSize="sm">
            {images && images[index - 1]
              ? `Изображение ${index}`
              : 'Нет изображения'}
          </Text>
        </Box>
      ))}
    </Grid>
  </Box>
);
