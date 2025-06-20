import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';
import { useQuery } from '@tanstack/react-query';
import api from '@/shared/config/axios';

interface ReportData {
  company_name: string;
  summary_card: string;
  detailed_report: string;
  html_report: string;
  sections: {
    name: string;
    description: string;
    requires_calculation: boolean;
    requires_research: boolean;
    char_limit: number;
    content: string;
  }[];
  generated_at: string;
  report_type: string;
}

// 보고서 데이터 가져오는 함수
const fetchReportData = async (companyName: string, financialData: any) => {
  const response = await api.post('/api/query/financial', {
    company_name: companyName,
    financial_data: financialData,
    report_type: 'agent_based',
  });
  return response.data;
};

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('summary');

  // 위치 상태에서 초기 데이터 가져오기
  const initialData = location.state?.reportData as ReportData;
  const companyData = location.state?.companyData;

  // React Query를 사용하여 데이터 가져오기 (초기 데이터가 없는 경우)
  const {
    data: reportData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reportData', companyData?.company_name],
    queryFn: () =>
      fetchReportData(companyData?.company_name, companyData?.financial_statements?.financial_data),
    enabled: !!companyData && !initialData, // 초기 데이터가 없고 회사 데이터가 있을 때만 실행
    initialData: initialData, // 초기 데이터가 있으면 사용
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header onBack={handleBack} />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold text-gray-700'>보고서 생성 중...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header onBack={handleBack} />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-700 mb-4'>보고서를 찾을 수 없습니다</h2>
            <p className='text-gray-500 mb-6'>
              {error
                ? `오류 발생: ${(error as Error).message}`
                : '요청하신 보고서 데이터가 없습니다.'}
            </p>
            <button
              onClick={handleBack}
              className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header onBack={handleBack} />

      <div className='container mx-auto px-4 py-8 flex-1'>
        {/* 전체 보고서 - html_report 필드 사용 */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div
            className='prose max-w-none'
            dangerouslySetInnerHTML={{
              __html: reportData.html_report || reportData.detailed_report,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
