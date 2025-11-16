import { Select, Portal, createListCollection } from '@chakra-ui/react';

const sortOptions = createListCollection({
  items: [
    { label: 'Новые сначала', value: 'createdAt_desc' },
    { label: 'Старые сначала', value: 'createdAt_asc' },
    { label: 'Цена по убыванию', value: 'price_desc' },
    { label: 'Цена по возрастанию', value: 'price_asc' },
    { label: 'Приоритетные', value: 'priority_desc' },
  ],
});

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const SortSelect = ({ value, onValueChange }: SortSelectProps) => {
  return (
    <Select.Root
      collection={sortOptions}
      size="sm"
      width="250px"
      value={[value]}
      onValueChange={(details) => onValueChange(details.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          style={{
            backgroundColor: '#FFFFFF',
            outline: '2px solid #e2e8f0',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          <Select.ValueText placeholder="Сортировка" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {sortOptions.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
