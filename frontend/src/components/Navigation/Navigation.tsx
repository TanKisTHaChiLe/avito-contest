import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Link } from '@chakra-ui/react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/list', label: 'Список объявлений' },
    { path: '/stats', label: 'Статистика' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur();
  };

  return (
    <Box borderBottom="1px" borderColor="gray.200" bg="white">
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        px={6}
        maxWidth="1200px"
        mx="auto"
      >
        <HStack gap={8}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              asChild
              fontWeight="medium"
              color={location.pathname === item.path ? 'blue.500' : 'gray.500'}
              outline="none"
              _hover={{
                color: 'blue.500',
                textDecoration: 'none',
              }}
              _active={{
                color: 'blue.600',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <RouterLink to={item.path} onClick={handleClick}>
                {item.label}
              </RouterLink>
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};
