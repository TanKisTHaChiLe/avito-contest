import { Table, Badge, Card, Heading } from '@chakra-ui/react';

interface ProductCharacteristicsProps {
  category: string;
  price: number;
  status: string;
  priority: string;
  createdAt: string;
}

export const ProductCharacteristics = ({
  category,
  price,
  status,
  priority,
  createdAt,
}: ProductCharacteristicsProps) => (
  <Card.Root>
    <Card.Body>
      <Heading size="md" mb={4}>
        Характеристики товара
      </Heading>
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.Cell fontWeight="semibold" width="40%">
              Категория
            </Table.Cell>
            <Table.Cell>{category || 'Не указана'}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell fontWeight="semibold">Цена</Table.Cell>
            <Table.Cell>{price}₽</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell fontWeight="semibold">Статус</Table.Cell>
            <Table.Cell>
              <Badge
                colorPalette={
                  status === 'approved'
                    ? 'green'
                    : status === 'rejected'
                      ? 'red'
                      : status === 'draft'
                        ? 'yellow'
                        : 'orange'
                }
              >
                {status === 'approved'
                  ? 'Одобрено'
                  : status === 'rejected'
                    ? 'Отклонено'
                    : status === 'draft'
                      ? 'на доработке'
                      : 'На модерации'}
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell fontWeight="semibold">Приоритет</Table.Cell>
            <Table.Cell>
              <Badge colorPalette={priority === 'urgent' ? 'red' : 'blue'}>
                {priority === 'urgent' ? 'Срочный' : 'Обычный'}
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell fontWeight="semibold">Дата создания</Table.Cell>
            <Table.Cell>
              {new Date(createdAt).toLocaleDateString('ru-RU')}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Card.Body>
  </Card.Root>
);
