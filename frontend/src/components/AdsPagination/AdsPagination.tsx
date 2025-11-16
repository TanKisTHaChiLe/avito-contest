import { Center, Pagination, IconButton, ButtonGroup } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface AdsPaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AdsPagination = ({
  totalItems,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
}: AdsPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Center mt={8}>
      <Pagination.Root
        count={totalItems}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(details) => onPageChange(details.page)}
        siblingCount={1}
      >
        <ButtonGroup variant="outline" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton
                variant={{
                  base: 'outline',
                  _selected: 'solid',
                }}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Center>
  );
};
