import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProdukPage from './pages/ProdukPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<ProdukPage />} />
          <Route path="/produk" element={<ProdukPage />} />
        </Routes>
      </Router>
  );
}

export default App;