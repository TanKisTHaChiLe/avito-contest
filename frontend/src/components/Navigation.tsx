import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Link } from '@chakra-ui/react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const bgColor = 'white';
  const borderColor = 'gray.200';

  const navItems = [
    { path: '/list', label: 'Список объявлений' },
    { path: '/stats', label: 'Статистика' },
  ];

  return (
    <Box borderBottom="1px" borderColor={borderColor} bg={bgColor}>
      <Flex h="16" alignItems="center" justifyContent="space-between" px={6}>
        <HStack gap={8}>
          {navItems.map((item) => (
            <Link key={item.path} asChild>
              <RouterLink
                to={item.path}
                style={{
                  fontWeight: '500',
                  color:
                    location.pathname === item.path ? '#3182CE' : '#718096',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#3182CE')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.color =
                    location.pathname === item.path ? '#3182CE' : '#718096')
                }
              >
                {item.label}
              </RouterLink>
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};
