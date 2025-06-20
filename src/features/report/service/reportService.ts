import { useMutation } from "@tanstack/react-query";
import api from "@/shared/config/axios";

interface FinancialData {
  corp_code: string;
  corp_name?: string;
  market_type: string;
  industry_name: string;
  revenue: number;
  operating_profit: number;
  net_income: number;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  debt_ratio: number;
  ROA: number;
  ROE: number;
  asset_turnover_ratio: number;
}

interface ReportRequest {
  company_name: string;
  financial_data: FinancialData;
  report_type: "agent_based";
  additional_context?: string;
}

// 보고서 생성 요청 함수
const generateReport = async (requestData: ReportRequest) => {
  const response = await api.post("/api/query/financial", requestData);
  return response.data;
};

// useMutation을 사용하는 커스텀 훅
export const useReportMutation = () => {
  return useMutation({
    mutationFn: generateReport,
  });
};
