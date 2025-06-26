import React from 'react';
import type {
  FinancialMetrics,
  RatingInfo,
} from '@/features/report-generation/types/ReportTypes.ts';

interface SummaryCardProps {
  companyName: string;
  generationDate: string;
  creditRating: string | null;
  ratingInfo: RatingInfo;
  financialMetrics: FinancialMetrics;
}

interface FinancialMetricItemProps {
  value: number;
  label: string;
  suffix: string;
  isGood: boolean;
  status: string;
}

const FinancialMetricItem: React.FC<FinancialMetricItemProps> = ({
  value,
  label,
  suffix,
  isGood,
  status,
}) => (
  <div>
    <div className={`text-2xl font-bold mb-1 ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
      {value}
      {suffix}
    </div>
    <div className='text-xs text-gray-600'>
      {label} ({status})
    </div>
  </div>
);

const FinancialMetricsGrid: React.FC<{ metrics: FinancialMetrics }> = ({ metrics }) => (
  <div>
    <div className='text-sm font-semibold text-gray-700 mb-3'>핵심 재무지표:</div>
    <div className='grid grid-cols-4 gap-4 text-center'>
      <FinancialMetricItem
        value={metrics.roa}
        label='ROA'
        suffix='%'
        isGood={metrics.roa > 5}
        status={metrics.roa > 5 ? '양호' : '주의'}
      />
      <FinancialMetricItem
        value={metrics.roe}
        label='ROE'
        suffix='%'
        isGood={metrics.roe > 8}
        status={metrics.roe > 8 ? '양호' : '주의'}
      />
      <FinancialMetricItem
        value={metrics.debtRatio}
        label='부채비율'
        suffix='%'
        isGood={metrics.debtRatio < 200}
        status={metrics.debtRatio < 200 ? '보통' : '주의'}
      />
      <FinancialMetricItem
        value={metrics.operatingProfitMargin}
        label='영업이익률'
        suffix='%'
        isGood={metrics.operatingProfitMargin > 10}
        status={metrics.operatingProfitMargin > 10 ? '우수' : '주의'}
      />
    </div>
  </div>
);

const ReportSummaryCard: React.FC<SummaryCardProps> = ({
  companyName,
  generationDate,
  creditRating,
  ratingInfo,
  financialMetrics,
}) => (
  <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500 avoid-break'>
    <div className='flex items-center mb-4'>
      <div className='bg-blue-500 rounded-full p-0.5 mr-3'>
        <span className='text-blue-600'>📊</span>
      </div>
      <h3 className='text-xl font-bold text-gray-800'>신용분석 요약 카드</h3>
    </div>
    <div>
      <div className='mb-6 flex'>
        <div className='flex flex-col gap-2'>
          <div className='text-sm text-gray-600 mb-1'>
            <span className='font-semibold text-gray-800'>기업명: </span>
            <span>{companyName}</span>
          </div>
          <div className='text-sm text-gray-600 mb-1'>
            <span className='font-semibold text-gray-800'>평가일자: </span>
            {generationDate}
          </div>
          <div>
            <div className='text-sm text-gray-600 mb-1'>
              <span className='font-semibold text-gray-800'>신용등급: </span>
              {creditRating ? (
                <span className='font-bold ml-0.5' style={{ color: ratingInfo.color }}>
                  {creditRating}
                </span>
              ) : (
                <span className='font-medium ml-0.5 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs'>
                  평가 불가
                </span>
              )}
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
    <FinancialMetricsGrid metrics={financialMetrics} />
  </div>
);

export default ReportSummaryCard;
