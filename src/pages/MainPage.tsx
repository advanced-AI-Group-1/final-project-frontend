import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import FinancialInputModal from '../features/finanacial-form/components/FinancialInputModal.tsx';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed === '') {
      return;
    }
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleDirectInput = () => {
    setIsModalOpen(true);
  };

  const handleBack = () => {
    console.log('뒤로가기 버튼 클릭됨');
  };

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-no-repeat relative'
      style={{
        backgroundImage:
          "url('https://spp.cmu.ac.th/wp-content/uploads/2020/06/smart-city-01-scaled.jpg')",
      }}
    >
      <Header onBack={handleBack} transparent />
      <FinancialInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className='absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-10'>
        <div className='text-white font-bold text-center leading-snug' style={{ fontSize: '46px' }}>
          당신의 AI 기반 재무 진단을 위한
          <br />
          <span className='drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'>신용분석지원시스템</span>,
          <span
            className='drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-[#010440]'
            style={{ color: '#010440' }}
          >
            SheetAI
          </span>
        </div>

        <div className='flex flex-row items-center space-x-4 flex-nowrap bg-white/80 p-4 rounded-xl shadow-lg backdrop-blur-sm'>
          <input
            type='text'
            placeholder='(예) 삼성전자 분석해줘'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className='border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300'
          />

          <button
            onClick={handleSearch}
            className='bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition'
          >
            <img
              src='https://cdn-icons-png.flaticon.com/512/17320/17320840.png'
              alt='검색 아이콘'
              className='mt-2 ml-1 w-9 h-9'
            />
          </button>

          <button
            onClick={handleDirectInput}
            className='bg-blue-600 text-white text-lg w-[120px] h-14 rounded whitespace-nowrap'
          >
            직접입력
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
