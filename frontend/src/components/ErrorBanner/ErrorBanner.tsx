import { Center, Text } from '@chakra-ui/react';

interface ErrorBannerProps {
  error: string | null;
  show: boolean;
}

export const ErrorBanner = ({ error, show }: ErrorBannerProps) => {
  if (!show || !error) return null;

  return (
    <Center>
      <Text color="red.500">{error}</Text>
    </Center>
  );
};
