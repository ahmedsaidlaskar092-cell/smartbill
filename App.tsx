
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Billing from './pages/Billing';
import BillHistory from './pages/BillHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ProductForm from './components/ProductForm';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/history" element={<BillHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;