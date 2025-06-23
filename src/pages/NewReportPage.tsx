// 필요한 import 추가
import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';
import api from '@/shared/config/axios';
import { useAtom } from 'jotai';
import { creditRatingAtom, financialDataAtom } from '@/shared/store/atoms.ts';
import Header from '@/shared/components/Header';

// 리포트 데이터 인터페이스 정의
interface ReportData {
  json: {
    company_name: string;
    report_data: {
      company_name: string;
      subtitle: string;
      summary_content: string;
      detailed_content: string;
      generation_date: string;
      industry_name: string;
      market_type: string;
      financial_data?: any;
      sections?: {
        title: string;
        description: string;
        content: string;
      }[];
    };
    sections: {
      title: string;
      description?: string;
      content: string;
    }[];
    generated_at: string;
    report_type: string;
    credit_rating?: string;
  };
  company_name?: string;
  report_data?: {
    company_name: string;
    subtitle: string;
    summary_content: string;
    detailed_content: string;
    generation_date: string;
    industry_name: string;
    market_type: string;
    financial_data?: any;
    sections?: {
      title: string;
      description: string;
      content: string;
    }[];
  };
  sections?: {
    title: string;
    description?: string;
    content: string;
  }[];
  generated_at?: string;
  report_type?: string;
  credit_rating?: string;
}

// 보고서 데이터 가져오는 함수
const fetchReportData = async (companyName: string, financialData: any) => {
  try {
    console.log('API 요청 데이터:', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    const response = await api.post('/api/query/financial', {
      company_name: companyName,
      financial_data: financialData,
      report_type: 'agent_based',
    });
    console.log('API 응답 데이터:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 신용등급에서 텍스트 추출 함수
const extractCreditRating = (content: string): string | null => {
  // 신용등급 패턴 찾기
  const ratingPattern = /신용등급[:\s]*(A{1,3}|B{1,3}|C{1,3}|D)(\+|-)?/i;
  const match = content.match(ratingPattern);
  if (match && match[1]) {
    return `${match[1]}${match[2] || ''}`;
  }
  return null;
};

const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPDFRendering, setIsPDFRendering] = useState(false);

  // 위치 상태에서 초기 데이터 가져오기
  const initialData = location.state?.reportData as ReportData;
  const companyData = location.state?.companyData;

  // jotai atom에서 데이터 가져오기
  const [storedFinancialData] = useAtom(financialDataAtom);
  const [storedCreditRating] = useAtom(creditRatingAtom);

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

  // 재무 섹션 찾기 함수
  const getFinancialSection = (sections: any[] = []) => {
    return sections?.find(
      (section: any) =>
        section.title.includes('재무') ||
        section.title.includes('금융') ||
        section.title.includes('분석')
    );
  };

  // 신용등급 계산 - json 프로퍼티가 있는 경우용
  const creditRating = useMemo(() => {
    if (!reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      console.log('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. json 속성이 있는 경우
    if ('json' in reportData && reportData.json) {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.json.credit_rating) {
        console.log('API에서 제공된 신용등급 (json):', reportData.json.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.json.credit_rating === 'object') {
          return reportData.json.credit_rating.credit_rating || 'A';
        }
        return reportData.json.credit_rating;
      }

      const { report_data, sections = [] } = reportData.json;

      if (!report_data) {
        return 'A';
      }

      const financialSection = getFinancialSection(sections);

      if (financialSection) {
        console.log('재무 섹션 찾음:', financialSection.title);
        return extractCreditRating(financialSection.content) || 'A';
      }

      console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
      return extractCreditRating(report_data.detailed_content || '') || 'A';
    }
    // 3. json 속성이 없는 경우
    else {
      // API에서 직접 제공하는 신용등급이 있으면 사용
      if (reportData.credit_rating) {
        console.log('API에서 제공된 신용등급:', reportData.credit_rating);
        // 객체 형태인 경우 credit_rating 속성 추출
        if (typeof reportData.credit_rating === 'object') {
          return reportData.credit_rating.credit_rating || 'A';
        }
        return reportData.credit_rating;
      }

      const report_data = reportData.report_data;
      const sections = reportData.sections || [];

      if (!report_data) {
        return 'A';
      }

      const financialSection = getFinancialSection(sections);

      if (financialSection) {
        console.log('재무 섹션 찾음:', financialSection.title);
        return extractCreditRating(financialSection.content) || 'A';
      }

      console.log('재무 섹션을 찾을 수 없어 상세 내용에서 추출 시도');
      return extractCreditRating(report_data.detailed_content || '') || 'A';
    }
  }, [reportData, storedCreditRating]);

  // 재무 지표 추출
  const financialMetrics = useMemo(() => {
    if (!reportData) {
      return {
        roa: 0,
        roe: 0,
        debtRatio: 0,
        operatingProfitMargin: 0,
      };
    }

    // 기본 지표 값
    let metrics = {
      roa: 6.7,
      roe: 8.57,
      debtRatio: 27.93,
      operatingProfitMargin: 10.88,
    };

    try {
      // 1. json 속성이 있는 경우
      if ('json' in reportData && reportData.json) {
        const content = reportData.json.report_data?.detailed_content || '';

        // ROA 추출
        const roaMatch = content.match(/ROA[:\s]*([0-9.]+)%/i);
        if (roaMatch && roaMatch[1]) {
          metrics.roa = parseFloat(roaMatch[1]);
        }

        // ROE 추출
        const roeMatch = content.match(/ROE[:\s]*([0-9.]+)%/i);
        if (roeMatch && roeMatch[1]) {
          metrics.roe = parseFloat(roeMatch[1]);
        }

        // 부채비율 추출
        const debtMatch = content.match(/부채비율[:\s]*([0-9.]+)%/i);
        if (debtMatch && debtMatch[1]) {
          metrics.debtRatio = parseFloat(debtMatch[1]);
        }

        // 영업이익률 추출
        const profitMatch = content.match(/영업이익률[:\s]*([0-9.]+)%/i);
        if (profitMatch && profitMatch[1]) {
          metrics.operatingProfitMargin = parseFloat(profitMatch[1]);
        }
      }
      // 2. json 속성이 없는 경우
      else if (reportData.report_data) {
        const content = reportData.report_data.detailed_content || '';

        // ROA 추출
        const roaMatch = content.match(/ROA[:\s]*([0-9.]+)%/i);
        if (roaMatch && roaMatch[1]) {
          metrics.roa = parseFloat(roaMatch[1]);
        }

        // ROE 추출
        const roeMatch = content.match(/ROE[:\s]*([0-9.]+)%/i);
        if (roeMatch && roeMatch[1]) {
          metrics.roe = parseFloat(roeMatch[1]);
        }

        // 부채비율 추출
        const debtMatch = content.match(/부채비율[:\s]*([0-9.]+)%/i);
        if (debtMatch && debtMatch[1]) {
          metrics.debtRatio = parseFloat(debtMatch[1]);
        }

        // 영업이익률 추출
        const profitMatch = content.match(/영업이익률[:\s]*([0-9.]+)%/i);
        if (profitMatch && profitMatch[1]) {
          metrics.operatingProfitMargin = parseFloat(profitMatch[1]);
        }
      }
    } catch (error) {
      console.error('재무 지표 추출 중 오류:', error);
    }

    return metrics;
  }, [reportData]);

  // 신용등급에 따른 색상과 진행률 결정
  const getRatingInfo = (rating: string) => {
    const configs = {
      AAA: { color: 'text-emerald-600', progress: 95 },
      AA: { color: 'text-emerald-600', progress: 90 },
      'A+': { color: 'text-emerald-500', progress: 85 },
      A: { color: 'text-emerald-500', progress: 80 },
      'A-': { color: 'text-emerald-500', progress: 75 },
      'B+': { color: 'text-amber-500', progress: 70 },
      B: { color: 'text-amber-500', progress: 65 },
      'B-': { color: 'text-amber-500', progress: 60 },
      'C+': { color: 'text-red-500', progress: 45 },
      C: { color: 'text-red-500', progress: 35 },
      'C-': { color: 'text-red-500', progress: 25 },
      D: { color: 'text-red-600', progress: 15 },
    };

    // Tailwind CSS 클래스에 맞게 색상 코드 변환
    const colorMap: Record<string, string> = {
      'text-emerald-600': '#059669',
      'text-emerald-500': '#10B981',
      'text-amber-500': '#F59E0B',
      'text-red-500': '#EF4444',
      'text-red-600': '#DC2626',
    };

    const ratingConfig = configs[rating as keyof typeof configs] || {
      color: 'text-emerald-500',
      progress: 80,
    };

    // PieChart에서 사용할 색상 코드 반환
    return {
      color: ratingConfig.color,
      colorCode: colorMap[ratingConfig.color] || '#10B981',
      progress: ratingConfig.progress,
    };
  };

  // PDF 다운로드 함수
  const downloadPDF = async () => {
    if (!reportRef.current) {
      return;
    }

    try {
      // PDF 렌더링 시작 - 스타일 조정
      setIsPDFRendering(true);

      // 약간의 지연을 주어 리렌더링 완료 대기
      await new Promise(resolve => setTimeout(resolve, 100));

      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Tailwind CSS 클래스가 적용된 상태로 캔버스 생성
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: reportRef.current.scrollHeight,
        width: reportRef.current.scrollWidth,
        logging: false,
        ignoreElements: element => {
          const style = window.getComputedStyle(element);
          return style.backgroundImage.includes('oklch');
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // 회사명이 있으면 파일명에 추가
      const companyName = getCompanyName();
      pdf.save(`${companyName}_신용평가보고서.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      // PDF 렌더링 완료 - 원래 스타일로 복원
      setIsPDFRendering(false);
    }
  };

  // 회사명 가져오기
  const getCompanyName = () => {
    if (!reportData) {
      return '보고서';
    }

    if ('json' in reportData && reportData.json) {
      return reportData.json.company_name || '보고서';
    }

    return reportData.company_name || '보고서';
  };

  // 부제목 가져오기
  const getSubtitle = () => {
    if (!reportData) {
      return '금융 분석 | 신용평가';
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return reportData.json.report_data.subtitle || '금융 분석 | 신용평가';
    }

    if (reportData.report_data) {
      return reportData.report_data.subtitle || '금융 분석 | 신용평가';
    }

    return '금융 분석 | 신용평가';
  };

  // 생성 날짜 가져오기
  const getGenerationDate = () => {
    if (!reportData) {
      return '2025년 06월 23일';
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return reportData.json.report_data.generation_date || '2025년 06월 23일';
    }

    if (reportData.report_data) {
      return reportData.report_data.generation_date || '2025년 06월 23일';
    }

    return '2025년 06월 23일';
  };

  // 업종 정보 가져오기
  const getIndustryInfo = () => {
    if (!reportData) {
      return { industry: '', market: '' };
    }

    if ('json' in reportData && reportData.json && reportData.json.report_data) {
      return {
        industry: reportData.json.report_data.industry_name || '',
        market: reportData.json.report_data.market_type || '',
      };
    }

    if (reportData.report_data) {
      return {
        industry: reportData.report_data.industry_name || '',
        market: reportData.report_data.market_type || '',
      };
    }

    return { industry: '', market: '' };
  };

  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1);
  };

  // 로딩 중이거나 에러 발생 시 처리
  if (isLoading) {
    return <div>보고서를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {(error as Error).message}</div>;
  }

  if (!reportData) {
    return <div>보고서 데이터가 없습니다.</div>;
  }

  // 신용등급 정보
  const ratingInfo = getRatingInfo(creditRating || 'A');
  const industryInfo = getIndustryInfo();

  // Recharts용 데이터
  const chartData = [
    { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.colorCode },
    { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
  ];

  return (
    <div>
      <Header onBack={handleBack} />
      <div className='flex justify-center p-5'>
        <button
          onClick={downloadPDF}
          className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-base shadow-lg hover:bg-blue-700 transition-colors'
        >
          📄 PDF 다운로드
        </button>
      </div>

      {/* 리포트 컨텐츠 */}
      <div
        ref={reportRef}
        className='max-w-[794px] mx-auto bg-white shadow-md rounded-lg overflow-hidden'
      >
        {/* 헤더 부분 - 파란색 배경 */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8'>
          <h1 className='text-3xl font-bold mb-2'>{getCompanyName()} 신용등급 보고서</h1>
          <p className='text-blue-100 text-lg'>{getSubtitle()}</p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className='p-8'>
          {/* 신용분석 요약 카드 */}
          <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500'>
            <div className='flex items-center mb-4'>
              <div className='bg-blue-500 rounded-full p-0.5 mr-3'>
                <span className='text-blue-600 '>📊</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800'>신용분석 요약 카드</h3>
            </div>
            <div>
              <div className='mb-6 flex'>
                <div className='flex flex-col gap-2'>
                  <div className='text-sm text-gray-600 mb-1'>
                    <span className='font-semibold  text-gray-800'>기업명: </span>
                    <span className=''>{getCompanyName()}</span>
                  </div>
                  <div className='text-sm text-gray-600 mb-1'>
                    <span className='font-semibold text-gray-800'>평가일자: </span>
                    {getGenerationDate()}
                  </div>
                  <div>
                    <div className='text-sm text-gray-600 mb-1'>
                      <span className='font-semibold text-gray-800'>신용등급: </span>
                      <span className={`font-bold ml-0.5 ${ratingInfo.color}`}>
                        {creditRating || 'A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='m-auto' />
                <div className='flex flex-col gap-3'>
                  <div className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-800'>주요 강점 키워드: </span>
                  </div>
                  <div className='text-sm text-gray-700 break-words mb-1 font-light'>
                    강한 재무건전성, 안정적인 신용 전망, 높은 이익률
                  </div>
                  <div className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-800'>주요 약점 키워드: </span>
                  </div>
                  <div className='text-sm text-gray-700 break-words font-light'>
                    시장 위험, 부채비율 증가, 매출증장 불확실성
                  </div>
                </div>
              </div>
            </div>
            <div className=''>
              <div className='text-sm font-semibold text-gray-700 mb-3'>핵심 재무지표:</div>
              <div className='grid grid-cols-4 gap-4 text-center'>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.roa > 5 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                  >
                    {financialMetrics.roa}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    ROA ({financialMetrics.roa > 5 ? '양호' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.roe > 8 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                  >
                    {financialMetrics.roe}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    ROE ({financialMetrics.roe > 8 ? '양호' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.debtRatio < 200 ? 'text-orange-600' : 'text-red-500'} mb-1`}
                  >
                    {financialMetrics.debtRatio}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    부채비율 ({financialMetrics.debtRatio < 200 ? '보통' : '주의'})
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${financialMetrics.operatingProfitMargin > 10 ? 'text-emerald-600' : 'text-red-500'} mb-1`}
                  >
                    {financialMetrics.operatingProfitMargin}%
                  </div>
                  <div className='text-xs text-gray-600'>
                    영업이익률 ({financialMetrics.operatingProfitMargin > 10 ? '우수' : '주의'})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 신용등급 섹션 */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold mb-6 text-gray-800'>신용등급</h3>
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <PieChart width={280} height={280}>
                  <Pie
                    data={chartData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={120}
                    innerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
                {/* 중앙 텍스트 */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className={`text-6xl font-bold ${ratingInfo.color} mb-2`}>
                    {creditRating || 'A'}
                  </div>
                  <div className='text-gray-600 text-sm font-medium'>투자 적격 등급</div>
                  <div className='text-gray-500 text-xs'>{ratingInfo.progress}% 신뢰도</div>
                </div>
              </div>
            </div>
          </div>

          {/* 섹션별 내용 */}
          {(() => {
            const sections = (() => {
              if (!reportData) {
                return [];
              }

              if ('json' in reportData && reportData.json) {
                return reportData.json.sections || [];
              }

              return reportData.sections || [];
            })();

            return sections.map((section: any, index: number) => (
              <div key={index} className='mb-8'>
                <h3 className='text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2'>
                  {section.title}
                </h3>
                {section.description && (
                  <div className='bg-blue-50 p-4 rounded-lg mb-4'>
                    <p className='text-base font-medium text-blue-800'>{section.description}</p>
                  </div>
                )}
                <div className='text-base leading-relaxed text-gray-700 whitespace-pre-line'>
                  {section.content}
                </div>
              </div>
            ));
          })()}

          {/* 푸터 */}
          <div className='mt-12 pt-6 border-t-2 border-gray-200 text-center'>
            <div className='text-sm text-gray-500 mb-2'>
              본 보고서는 AI에 의해 자동 생성되었으며, 참고용으로만 사용하시기 바랍니다.
            </div>
            <div className='text-sm text-gray-400'>
              {new Date().getFullYear()} Financial AI Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReportPage;
