import { Card, Heading, Text } from '@chakra-ui/react';

interface AdDescriptionProps {
  description?: string;
}

export const AdDescription = ({ description }: AdDescriptionProps) => {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" mb={4}>
          Описание
        </Heading>
        <Text fontSize="md" lineHeight="1.6">
          {description || 'Описание отсутствует'}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
