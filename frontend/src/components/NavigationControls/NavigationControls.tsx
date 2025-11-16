import { HStack, VStack, Button, IconButton, Spinner } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface NavigationControlsProps {
  onBackToList: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isNavigating: boolean;
}

export const NavigationControls = ({
  onBackToList,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isNavigating,
}: NavigationControlsProps) => {
  return (
    <>
      <HStack
        justify="space-between"
        width="100%"
        display={{ base: 'none', md: 'flex' }}
      >
        <Button
          variant="outline"
          onClick={onBackToList}
          flex="0 0 auto"
          outline="2px solid"
          outlineColor="gray.400"
        >
          Назад к списку
        </Button>

        <HStack gap={2}>
          <IconButton
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isNavigating}
            aria-label="Предыдущее объявление"
            outline="1px solid"
            outlineColor="currentColor"
          >
            {isNavigating ? <Spinner size="sm" /> : <FaChevronLeft />}
          </IconButton>
          <IconButton
            variant="outline"
            onClick={onNext}
            disabled={!canGoNext || isNavigating}
            aria-label="Следующее объявление"
            outline="1px solid"
            outlineColor="currentColor"
          >
            {isNavigating ? <Spinner size="sm" /> : <FaChevronRight />}
          </IconButton>
        </HStack>
      </HStack>

      <VStack gap={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
        <Button
          variant="outline"
          onClick={onBackToList}
          width="100%"
          outline="2px solid"
          outlineColor="gray.400"
        >
          Назад к списку
        </Button>

        <HStack gap={2} width="100%">
          <IconButton
            variant="outline"
            onClick={onPrevious}
            flex={1}
            disabled={!canGoPrevious || isNavigating}
            aria-label="Предыдущее объявление"
            outline="1px solid"
            outlineColor="currentColor"
          >
            {isNavigating ? <Spinner size="sm" /> : <FaChevronLeft />}
          </IconButton>
          <IconButton
            variant="outline"
            onClick={onNext}
            flex={1}
            disabled={!canGoNext || isNavigating}
            aria-label="Следующее объявление"
            outline="1px solid"
            outlineColor="currentColor"
          >
            {isNavigating ? <Spinner size="sm" /> : <FaChevronRight />}
          </IconButton>
        </HStack>
      </VStack>
    </>
  );
};
