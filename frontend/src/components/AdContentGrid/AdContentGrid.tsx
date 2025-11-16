import { Grid, VStack } from '@chakra-ui/react';
import { ImageGallery } from '../ImageGallery';
import { ModerationHistory } from '../ModerationHistory';
import { ProductCharacteristics } from '../ProductCharacteristics';
import { SellerInfo } from '../SellerInfo';

interface AdContentGridProps {
  images: string[];
  moderationHistory: Array<{
    action: string;
    moderatorName: string;
    comment?: string;
    timestamp: string;
  }>;
  category?: string;
  price?: number;
  status: string;
  priority?: string;
  createdAt: string;
  seller?: {
    name?: string;
    rating?: number;
    totalAds?: number;
    registeredAt?: string;
  };
}

export const AdContentGrid = ({
  images,
  moderationHistory,
  category,
  price,
  status,
  priority,
  createdAt,
  seller,
}: AdContentGridProps) => {
  return (
    <VStack gap={6} align="stretch">
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <ImageGallery images={images} />
        <ModerationHistory history={moderationHistory} />
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <ProductCharacteristics
          category={category || ''}
          price={price || 0}
          status={status}
          priority={priority || ''}
          createdAt={createdAt}
        />
        <SellerInfo
          name={seller?.name || ''}
          rating={seller?.rating || 0}
          totalAds={seller?.totalAds || 0}
          registeredAt={seller?.registeredAt || ''}
        />
      </Grid>
    </VStack>
  );
};
