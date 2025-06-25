// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dummyRelatedCompanies } from '@/shared/data/relatedCompanies';
import Header from '@/shared/components/Header';
import FinancialInputModal from '@/shared/components/FinancialInputModal';
import { useAuth } from '@/context/AuthContext';

// ✅ 정확한 위치에서 useQueryResult 불러오기
import { useQueryResult } from '@/features/mainpage/service/queryService';

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');


   // ✅ 로그인 안 한 경우 리디렉션
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login-required');
    }
  }, [isLoggedIn, navigate]);
  

  // 🔍 URL에서 keyword 추출
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword')?.trim() || '';

  // ✅ React Query 훅 호출 (keyword가 있을 때만 실행)
  const { data, isLoading, error } = useQueryResult(keyword);

  // 🔍 관련 기업 리스트 필터링
  const relatedList = dummyRelatedCompanies.filter(
    company => company.name.includes(keyword) || company.industry.includes(keyword)
  );

  const handleBack = () => {
    navigate('/');
  };

  const handleSelect = (companyName: string) => {
    console.log('기업 선택:', companyName);
    // 나중에 상세 페이지로 이동
    // navigate(`/report/${companyName}`);
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
              🔍 관련 기업 검색 결과 ({relatedList.length}개)
            </div>

            {/* ✅ 기업 리스트 */}
            {relatedList.length === 0 ? (
              <div className='text-gray-500 text-center mt-24 text-lg'>관련된 기업이 없습니다.</div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {relatedList.map(company => (
                  <div
                    key={company.id}
                    onClick={() => handleSelect(company.name)}
                    className='bg-blue-50 border border-blue-100 rounded-lg shadow-sm p-4 cursor-pointer hover:bg-blue-100 transition h-[140px] flex flex-col justify-between'
                  >
                    <div className='text-lg font-semibold text-blue-700'>{company.name}</div>
                    <div className='text-sm text-blue-500'>산업: {company.industry}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ AI 응답 결과 표시 */}
            <div className='mt-10'>
              {isLoading && (
                <div className='text-blue-500 text-center'>⏳ 백엔드 응답 기다리는 중...</div>
              )}

              {error && (
                <div className='text-red-500 text-center'>
                  ❌ 오류 발생: {(error as Error).message}
                </div>
              )}

              {data && (
                <div className='text-green-600 text-center whitespace-pre-wrap'>
                  ✅ AI 응답: {JSON.stringify(data, null, 2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
