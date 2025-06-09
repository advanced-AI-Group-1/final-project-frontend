import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage.tsx';

const PageRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      {/* 여기에 routing 추가 */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default PageRouter;
