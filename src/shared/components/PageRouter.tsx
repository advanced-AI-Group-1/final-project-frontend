import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage.tsx';
import SearchResultPage from '@pages/SearchResultPage.tsx';

import LoginRegisterContainer from '@pages/LoginRegisterContainer.tsx';
import LoginRequiredPage from '@pages/LoginRequiredPage.tsx';

import NewReportPage from '@pages/NewReportPage.tsx';
import TestPdf from '@/tests/TestPdf.tsx';
import WithdrawUser from '@pages/WithdrawUser.tsx';

const PageRouter: React.FC = () => {
  return (
    <Routes>

      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/login" element={<LoginRegisterContainer />} />
      <Route path="/login-required" element={<LoginRequiredPage />} />

      {/* ✅ 탈퇴 페이지 라우트 추가 */}
      <Route path="/withdraw" element={<WithdrawUser />} />

      <Route path='/report' element={<NewReportPage />} />
      <Route path='/test-pdf' element={<TestPdf />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageRouter;
