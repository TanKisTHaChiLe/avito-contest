import { Center, Text } from '@chakra-ui/react';

interface EmptyStateProps {
  error?: string | null;
}

export const EmptyState = ({ error }: EmptyStateProps) => {
  return (
    <Center py={10}>
      <Text fontSize="lg" color="gray.500">
        {error || 'Объявления не найдены'}
      </Text>
    </Center>
  );
};
