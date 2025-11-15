
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import FloatingAddButton from './FloatingAddButton';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <FloatingAddButton />
    </div>
  );
};

export default Layout;