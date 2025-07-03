import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer'; // ✅ Footer 불러오기

import { useAuth } from '@/context/AuthContext';
import FinancialInputModal from '@/features/finanacial-form/components/FinancialInputModal.tsx';
import { useAtom } from 'jotai';
import { companyInfoAtom, creditRatingAtom, financialDataAtom } from '@/shared/store/atoms.ts';
import { devLog } from '@/shared/util/logger';

import { useQueryResult } from '@/features/mainpage/service/queryService';
import { useReportMutation } from '@/features/report-generation/service/reportService';

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login-required');
    }
  }, [isLoggedIn, navigate]);

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword')?.trim() || '';

  // ✅ React Query 훅 호출 (keyword가 있을 때만 실행)
  const { data, isLoading, error } = useQueryResult(keyword, 8);

  // ✅ 보고서 생성 mutation 훅 호출
  const reportMutation = useReportMutation();

  // jotai atom
  const [, setFinancialData] = useAtom(financialDataAtom);
  const [, setCreditRating] = useAtom(creditRatingAtom);
  const [, setCompanyInfo] = useAtom(companyInfoAtom);

  const handleBack = () => {
    navigate('/');
  };

  const handleSelect = (company: any) => {
    if (isGeneratingReport) {
      return;
    }

    setIsGeneratingReport(true);

    // 보고서 생성 요청 데이터 준비
    const financialData = company.financial_data;

    setFinancialData({
      ROA: financialData?.ROA || 0,
      ROE: financialData?.ROE || 0,
      debt_ratio: financialData?.debt_ratio || 0,
      asset_turnover_ratio: financialData?.asset_turnover_ratio || 0,
      interest_to_assets_ratio: financialData?.interest_to_assets_ratio || 0,
    });

    // 회사 정보 저장
    setCompanyInfo({
      company_name: company.company_name,
      industry_name: financialData?.industry_name || '정보 없음',
      market_type: financialData?.market_type || '정보 없음',
    });

    // 신용등급이 있으면 저장 (API에서 제공하는 경우)
    if (financialData?.credit_rating) {
      setCreditRating(financialData.credit_rating);
    }

    const reportRequest = {
      company_name: company.company_name,
      similarity_score: company.similarity_score,
      financial_data: {
        corp_code: financialData?.corp_code || '',
        corp_name: financialData?.corp_name || '',
        market_type: financialData?.market_type || '',
        industry_name: financialData?.industry_name || '',
        is_consolidated: financialData?.is_consolidated || false,
        revenue: financialData?.revenue || 0,
        operating_profit: financialData?.operating_profit || 0,
        net_income: financialData?.net_income || 0,
        total_assets: financialData?.total_assets || 0,
        total_liabilities: financialData?.total_liabilities || 0,
        total_equity: financialData?.total_equity || 0,
        capital: financialData?.capital || 0,
        operating_cash_flow: financialData?.operating_cash_flow || 0,
        interest_bearing_debt: financialData?.interest_bearing_debt || 0,
        debt_ratio: financialData?.debt_ratio || 0,
        ROA: financialData?.ROA || 0,
        ROE: financialData?.ROE || 0,
        asset_turnover_ratio: financialData?.asset_turnover_ratio || 0,
        interest_to_assets_ratio: financialData?.interest_to_assets_ratio || 0,
        interest_to_revenue_ratio: financialData?.interest_to_revenue_ratio || 0,
        cash_flow_to_interest: financialData?.cash_flow_to_interest || null,
        interest_to_cash_flow: financialData?.interest_to_cash_flow || null,
        log_total_assets: financialData?.log_total_assets || 0,
        log_total_liabilities: financialData?.log_total_liabilities || 0,
        positive_factors: financialData?.positive_factors || null,
        negative_factors: financialData?.negative_factors || null,
        description:
          financialData?.description ||
          `${company.company_name} - ${financialData?.industry_name || ''} - ${financialData?.market_type || ''}`,
      },
      report_type: 'agent_based' as const,
    };

    // 보고서 생성 API 호출
    reportMutation.mutate(reportRequest, {
      onSuccess: data => {
        devLog('보고서 생성 성공:', data);
        setIsGeneratingReport(false);
        
        // 데이터가 유효한지 확인
        if (!data) {
          devLog('보고서 데이터가 없습니다.');
          alert('보고서 데이터를 받지 못했습니다.');
          return;
        }
        
        // 보고서 페이지로 이동하면서 데이터 전달
        try {
          navigate('/report', {
            state: {
              reportData: data,
              companyData: {
                company_name: company.company_name,
                financial_data: company.financial_data,
                similarity_score: company.similarity_score
              }
            }
          });
        } catch (error) {
          devLog('페이지 이동 오류:', error);
          alert('페이지 이동 중 오류가 발생했습니다.');
        }
      },
      onError: error => {
        setIsGeneratingReport(false);
        devLog('보고서 생성 오류:', error);
        alert('보고서 생성 중 오류가 발생했습니다.');
      },
    });
  };

  return (
    <div className='relative min-h-screen flex flex-col'>
      {/* 🔹 배경 이미지 */}
      <div
        className='absolute inset-0 bg-cover bg-center z-0'
        style={{
          backgroundImage: "url('https://cdn.epnc.co.kr/news/photo/201909/92056_82752_5312.jpg')",
        }}
      />

      {/* 🔹 상단 그라데이션 */}
      <div className='absolute top-0 left-0 w-full h-[80%] z-10 pointer-events-none bg-gradient-to-b from-white via-white/95 via-70% to-white/0' />

      <div className='relative z-20 flex flex-col'>
        <Header onBack={handleBack} />
        <FinancialInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className='w-full flex flex-col items-center justify-start px-6 py-8'>
          <div className='w-full max-w-screen-lg'>
            {/* 🔍 검색창 */}
            <div className='flex flex-row items-center justify-center mb-18 mt-10 space-x-4'>
              <input
                type='text'
                placeholder='(예) 삼성전자 분석해줘'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    navigate(`/search?keyword=${encodeURIComponent(input.trim())}`);
                  }
                }}
                className='border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300'
              />

              <button
                onClick={() => navigate(`/search?keyword=${encodeURIComponent(input.trim())}`)}
                className='bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition'
              >
                <img
                  src='https://cdn-icons-png.flaticon.com/512/17320/17320840.png'
                  alt='검색 아이콘'
                  className='w-8 h-8'
                />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className='bg-blue-600 text-white text-lg w-[120px] h-14 rounded whitespace-nowrap hover:bg-blue-700 transition'
              >
                직접입력
              </button>
            </div>

            {/* 🔎 결과 수 */}
            <div className='mb-6 text-gray-700 text-lg font-semibold text-left px-2'>
              🔍 관련 기업 검색 결과 ({data?.length || 0}개)
            </div>

            {/* ✅ 기업 리스트 */}
            {isLoading && (
              <div className='text-blue-500 text-center'>⏳ 백엔드 응답 기다리는 중...</div>
            )}

            {error && (
              <div className='text-red-500 text-center'>
                ❌ 오류 발생: {(error as Error).message}
              </div>
            )}

            {!isLoading && !error && (!data || data.length === 0) ? (
              <div className='text-gray-500 text-center mt-24 text-lg'>관련된 기업이 없습니다.</div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {data?.map((company: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(company)}
                    className={`bg-blue-50 border border-blue-100 rounded-lg shadow-sm p-4 cursor-pointer hover:bg-blue-100 transition h-[180px] flex flex-col justify-between ${
                      isGeneratingReport ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className='text-lg font-semibold text-blue-700'>
                      {company.company_name}
                    </div>
                    <div className='text-sm text-blue-500'>
                      산업: {company.financial_data?.industry_name || '정보 없음'}
                    </div>
                    <div className='text-sm text-blue-500'>
                      시장: {company.financial_data?.market_type || '정보 없음'}
                    </div>
                    <div className='text-sm text-green-600'>
                      유사도 점수: {Math.abs(company.similarity_score || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 보고서 생성 중 로딩 오버레이 */}
            {isGeneratingReport && (
              <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md text-center'>
                  <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>보고서 생성 중</h3>
                  <p className='text-gray-600'>
                    기업 데이터를 분석하여 보고서를 생성하고 있습니다.
                    <br />
                    잠시만 기다려주세요...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer variant="white" />
    </div>
  );
};

export default SearchResultPage;
