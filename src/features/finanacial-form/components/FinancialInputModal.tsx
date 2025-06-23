import React, { useState } from 'react';
import './FinancialInputModal.css';
import { FaRegChartBar } from 'react-icons/fa';
import { useFinancialMutation } from '@/features/finanacial-form/service/financialService.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialInputModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const fields = [
    '매출액',
    '영업이익',
    '당기순이익',
    '총자산',
    '총부채',
    '자본총계',
    '자본금',
    '영업활동현금흐름',
    '이자발생부채',
  ];

  const [values, setValues] = useState<{ [key: string]: string }>(
    Object.fromEntries(fields.map(label => [label, '']))
  );

  const formatNumber = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    if (!numeric) return '';
    return parseInt(numeric, 10).toLocaleString('ko-KR');
  };

  const handleChange = (label: string, rawValue: string) => {
    setValues(prev => ({
      ...prev,
      [label]: formatNumber(rawValue),
    }));
  };

  // ✅ useMutation 훅 연결
  const { mutate, isLoading } = useFinancialMutation();

  // ✅ 확인 버튼 눌렀을 때 실행될 함수
  const handleSubmit = () => {
    const numericData: Record<string, number> = {};
    Object.entries(values).forEach(([key, value]) => {
      const clean = value.replace(/[^0-9]/g, '');
      numericData[key] = parseInt(clean || '0', 10);
    });

    mutate(
      { financialData: numericData },
      {
        onSuccess: res => {
          console.log('✅ 분석 결과:', res);
          alert('분석 요청이 성공적으로 전송되었습니다!');
          onClose();
        },
        onError: (err: any) => {
          console.error('❌ 에러 발생:', err);
          alert('요청 중 오류가 발생했습니다.');
        },
      }
    );
  };

  return (
    <div
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='financial-modal bg-white rounded-xl shadow-2xl w-[620px] p-8 max-h-[85vh] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        {/* 제목 */}
        <div className='flex items-center space-x-3 mb-4'>
          <FaRegChartBar className='text-blue-600 text-xl' />
          <h2 className='text-2xl font-semibold text-gray-800'>직접 재무 입력</h2>
        </div>

        {/* 입력 폼 */}
        <div className='flex flex-col space-y-5'>
          {fields.map(label => (
            <label key={label} className='flex flex-col text-sm font-medium text-gray-700'>
              <span className='mb-1'>{label}</span>
              <div className='flex items-center'>
                <input
                  type='text'
                  inputMode='numeric'
                  placeholder={`${label}을 입력하세요`}
                  value={values[label]}
                  onChange={e => handleChange(label, e.target.value)}
                  className='flex-1 border border-gray-300 bg-gray-50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition'
                />
                <span className='ml-2 text-gray-600 text-sm'>원</span>
              </div>
            </label>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className='flex justify-end space-x-4 pt-6 mt-6 border-t'>
          <button
            onClick={onClose}
            className='px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition'
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-5 py-2 rounded-md ${
              isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold shadow-sm transition`}
          >
            {isLoading ? '분석 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialInputModal;
