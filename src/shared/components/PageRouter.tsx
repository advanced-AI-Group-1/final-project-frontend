import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage.tsx';
import SearchResultPage from '@pages/SearchResultPage.tsx';
import LoginRegisterContainer from '@pages/LoginRegisterContainer.tsx';
import LoginRequiredPage from '@pages/LoginRequiredPage.tsx';

const PageRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/login" element={<LoginRegisterContainer />} />
      <Route path="/login-required" element={<LoginRequiredPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageRouter;
