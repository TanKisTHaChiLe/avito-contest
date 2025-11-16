import { Box, Alert } from '@chakra-ui/react';

interface AlertNotificationProps {
  alert: { type: 'success' | 'error'; message: string } | null;
  isVisible: boolean;
}

export const AlertNotification = ({
  alert,
  isVisible,
}: AlertNotificationProps) => {
  if (!alert) return null;

  return (
    <Box
      position="fixed"
      top="20px"
      left="50%"
      transform={`translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(-100px)'}`}
      zIndex="1000"
      transition="transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
      opacity={isVisible ? 1 : 0}
    >
      <Alert.Root status={alert.type}>
        <Alert.Indicator />
        <Alert.Title flex="1">{alert.message}</Alert.Title>
      </Alert.Root>
    </Box>
  );
};
