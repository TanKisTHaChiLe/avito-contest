import { Center, Stack, Spinner, Text } from '@chakra-ui/react';

export const LoadingState = () => {
  return (
    <Center py={10} minH="200px">
      <Stack align="center" gap={4}>
        <Spinner size="xl" />
        <Text color="gray.500">Загрузка объявлений...</Text>
      </Stack>
    </Center>
  );
};
