import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Heading,
  Input,
  Button,
  Stack,
  Text,
  Flex,
  Checkbox,
  HStack,
  Select,
  Portal,
  createListCollection,
  Grid,
} from '@chakra-ui/react';
import { adsStore } from '../stores/adsStore/adsStore';

interface FiltersProps {
  onFiltersChange?: () => void;
}

export const Filters = observer(({ onFiltersChange }: FiltersProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string[]>([
    'all_categories',
  ]);

  const handleStatusFilterChange = (
    status: string,
    checked: boolean | 'indeterminate'
  ) => {
    const isChecked = checked === true;
    const newStatuses = isChecked
      ? [...adsStore.filters.status, status]
      : adsStore.filters.status.filter((s) => s !== status);
    adsStore.setFilters({ status: newStatuses });
    adsStore.fetchAds(1);
    onFiltersChange?.();
  };

  const handleCategoryChange = (details: { value: string[] }) => {
    const categoryValue = details.value[0];
    setSelectedCategory(details.value);

    const categoryId =
      categoryValue && categoryValue !== 'all_categories'
        ? Number(categoryValue)
        : undefined;

    adsStore.setFilters({ categoryId });
    adsStore.fetchAds(1);
    onFiltersChange?.();
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    adsStore.setFilters({
      minPrice: value,
      maxPrice: adsStore.filters.maxPrice,
    });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    adsStore.setFilters({
      minPrice: adsStore.filters.minPrice,
      maxPrice: value,
    });
  };

  const handlePriceApply = () => {
    adsStore.fetchAds(1);
    onFiltersChange?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    adsStore.setFilters({ search: e.target.value });
  };

  const handleSearchSubmit = () => {
    adsStore.fetchAds(1);
    onFiltersChange?.();
  };

  const handleResetFilters = () => {
    setSelectedCategory(['all_categories']);
    adsStore.resetFilters();
    adsStore.fetchAds(1);
    onFiltersChange?.();
  };

  const categories = createListCollection({
    items: [
      { label: 'Все категории', value: 'all_categories' },
      { label: 'Электроника', value: '0' },
      { label: 'Недвижимость', value: '1' },
      { label: 'Транспорт', value: '2' },
      { label: 'Работа', value: '3' },
      { label: 'Услуги', value: '4' },
      { label: 'Животные', value: '5' },
      { label: 'Мода', value: '6' },
      { label: 'Детское', value: '7' },
    ],
  });

  return (
    <Box
      background="white"
      padding={6}
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      position="relative"
    >
      <Button
        variant="outline"
        onClick={handleResetFilters}
        borderColor="gray.300"
        color="gray.700"
        _hover={{ bg: 'gray.100' }}
        size="sm"
        position="absolute"
        top={4}
        right={6}
      >
        Сбросить всё
      </Button>

      <Stack gap={6}>
        <Heading size="md">Фильтры</Heading>

        <Stack gap={6}>
          <Box>
            <Text fontWeight="semibold" mb={3}>
              Статус
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} gap={3}>
              <Checkbox.Root
                checked={adsStore.filters.status.includes('pending')}
                onCheckedChange={(details) =>
                  handleStatusFilterChange('pending', details.checked)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>На модерации</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={adsStore.filters.status.includes('approved')}
                onCheckedChange={(details) =>
                  handleStatusFilterChange('approved', details.checked)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Одобрено</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={adsStore.filters.status.includes('rejected')}
                onCheckedChange={(details) =>
                  handleStatusFilterChange('rejected', details.checked)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Отклонено</Checkbox.Label>
              </Checkbox.Root>
            </Stack>
          </Box>

          <Box borderBottom="1px" borderColor="gray.200" />

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={6}
            align={{ base: 'stretch', lg: 'flex-end' }}
          >
            <Box flex={{ base: '1', lg: '0 0 auto' }}>
              <Text fontWeight="semibold" mb={3}>
                Категория
              </Text>
              <Select.Root
                collection={categories}
                onValueChange={handleCategoryChange}
                value={selectedCategory}
                size="sm"
                width={{ base: '100%', lg: '250px' }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    style={{
                      outline: '2px solid #e2e8f0',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    <Select.ValueText placeholder="Выберите категорию" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {categories.items.map((category) => (
                        <Select.Item item={category} key={category.value}>
                          {category.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            <Box flex={{ base: '1', lg: '1' }}>
              <Text fontWeight="semibold" mb={3}>
                Цена
              </Text>
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                gap={3}
                align={{ base: 'stretch', sm: 'center' }}
                flexWrap="wrap"
              >
                <HStack
                  gap={3}
                  flex="1"
                  minW={{ base: '100%', sm: 'min-content' }}
                >
                  <Input
                    placeholder="Мин. цена"
                    type="number"
                    value={adsStore.filters.minPrice || ''}
                    onChange={handlePriceMinChange}
                    flex="1"
                  />
                  <Text color="gray.600" flex="0 0 auto">
                    -
                  </Text>
                  <Input
                    placeholder="Макс. цена"
                    type="number"
                    value={adsStore.filters.maxPrice || ''}
                    onChange={handlePriceMaxChange}
                    flex="1"
                  />
                </HStack>
                <Button
                  onClick={handlePriceApply}
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: 'teal.600' }}
                  height="40px"
                  size="sm"
                  minW="80px"
                  flex={{ base: '1 1 100%', sm: '0 0 auto' }}
                >
                  Применить
                </Button>
              </Flex>
            </Box>
          </Flex>

          <Box borderBottom="1px" borderColor="gray.200" />

          <Box>
            <Text fontWeight="semibold" mb={3}>
              Поиск
            </Text>
            <Grid
              templateColumns={{ base: '1fr', md: '1fr auto' }}
              templateRows={{ base: 'auto auto', md: 'auto' }}
              gap={3}
              alignItems="center"
            >
              <Input
                placeholder="Поиск по названию..."
                value={adsStore.filters.search || ''}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                height="40px"
              />
              <Button
                bg="blue.500"
                color="white"
                _hover={{ bg: 'blue.600' }}
                onClick={handleSearchSubmit}
                height="40px"
              >
                Поиск
              </Button>
            </Grid>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
});
