export interface ReportData {
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
    summary_card_structured?: SummaryCardStructured;
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
  summary_card_structured?: SummaryCardStructured;
}

export interface FinancialMetrics {
  roa: number;
  roe: number;
  debtRatio: number;
  operatingProfitMargin: number;
}

export interface RatingInfo {
  color: string;
  progress: number;
  message?: string;
}

export interface IndustryInfo {
  industry: string;
  market: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface SummaryCardStructured {
  company_name: string;
  evaluation_date: string;
  credit_rating: string;
  strengths: string[];
  weaknesses: string[];
  financial_metrics: {
    roa: {
      value: number;
      evaluation: string;
    };
    roe: {
      value: number;
      evaluation: string;
    };
    debt_ratio: {
      value: number;
      evaluation: string;
    };
    operating_profit_margin: {
      value: number;
      evaluation: string;
    };
  };
  credit_rating_trend: {
    direction: string;
    reason: string;
  };
  financial_stability: string;
  business_risk: string;
  industry_outlook: string;
}
