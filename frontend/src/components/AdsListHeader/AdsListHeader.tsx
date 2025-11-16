import { Flex, Text } from '@chakra-ui/react';
import { SortSelect } from '../SortSelect';

interface AdsListHeaderProps {
  totalItems: number;
  sortValue: string;
  onSortChange: (value: string) => void;
}

export const AdsListHeader = ({
  totalItems,
  sortValue,
  onSortChange,
}: AdsListHeaderProps) => {
  return (
    <Flex justify="space-between" align="center">
      <Text color="gray.600" fontSize="sm">
        Найдено объявлений: {totalItems}
      </Text>
      <SortSelect value={sortValue} onValueChange={onSortChange} />
    </Flex>
  );
};
