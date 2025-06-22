import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage.tsx';
import SearchResultPage from '@pages/SearchResultPage.tsx';
import ReportPage from '@pages/ReportPage.tsx';
import TestPdf from '@/tests/TestPdf.tsx';

const PageRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      {/* 여기에 routing 추가 */}
      <Route path='/search' element={<SearchResultPage />} />
      <Route path='/report' element={<ReportPage />} />
      <Route path='/test-pdf' element={<TestPdf />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default PageRouter;
