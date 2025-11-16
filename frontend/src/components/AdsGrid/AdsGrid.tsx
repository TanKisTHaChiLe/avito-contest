import { Stack } from '@chakra-ui/react';
import { AdsCard } from '../AdsCard';
import { Ad } from '../../stores/adsStore/type';

interface AdsGridProps {
  ads: Ad[];
}

export const AdsGrid = ({ ads }: AdsGridProps) => {
  return (
    <Stack gap={6}>
      {ads.map((ad) => (
        <AdsCard
          key={ad.id}
          adsInformation={{
            id: ad.id,
            images: ad.images || [],
            title: ad.title,
            price: ad.price,
            category: ad.category || 'Без категории',
            date: new Date(ad.createdAt).toLocaleDateString('ru-RU'),
            status: ad.status,
            priority: ad.priority || 'normal',
          }}
        />
      ))}
    </Stack>
  );
};
