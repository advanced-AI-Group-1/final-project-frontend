import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage.tsx';
import SearchResultPage from '@pages/SearchResultPage.tsx';

import LoginRegisterContainer from '@pages/LoginRegisterContainer.tsx';
import LoginRequiredPage from '@pages/LoginRequiredPage.tsx';

import NewReportPage from '@pages/NewReportPage.tsx';
import TestPdf from '@/tests/TestPdf.tsx';
import ResetPassword from '@/pages/ResetPassword';
import RequestPasswordReset from '@pages/RequestPasswordReset.tsx';
import EmailVerifiedSuccess from '@pages/verified-success.tsx';
import EmailVerifyFail from '@pages/verify-fail.tsx';


const PageRouter: React.FC = () => {
  return (
    <Routes>

      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/login" element={<LoginRegisterContainer />} />
      <Route path="/login-required" element={<LoginRequiredPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path='/' element={<MainPage />} />
      {/* 여기에 routing 추가 */}
      <Route path='/search' element={<SearchResultPage />} />
      <Route path='/report' element={<NewReportPage />} />
      <Route path='/test-pdf' element={<TestPdf />} />
      <Route path='*' element={<Navigate to='/' replace />} />

      <Route path="/request-password-reset" element={<RequestPasswordReset />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path="/auth/verified-success" element={<EmailVerifiedSuccess />} />
      <Route path="/auth/verify-fail" element={<EmailVerifyFail />} />
      

    </Routes>
  );
};

export default PageRouter;
