import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box, defaultSystem } from '@chakra-ui/react';
import { AdsList } from './pages/AdsList';
import { AdDetail } from './pages/AdDetail';
 import { Stats } from './pages/Stats';
import { Navigation } from './components/Navigation/Navigation';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Router>
        <Box minH="100vh" width='100%'>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<AdsList />} />
            <Route path="/item/:id" element={<AdDetail />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;