import type { RatingInfo } from '@/features/report-generation/types/ReportTypes.ts';

export default class CreditRatingUtils {
  static getRatingInfo(rating: string | null): RatingInfo {
    if (!rating) {
      return { color: '#6B7280', progress: 50 };
    }

    const configs: Record<string, RatingInfo> = {
      AAA: { color: '#059669', progress: 95, message: '최우수' },
      AA: { color: '#059669', progress: 90, message: '우수' },
      'A+': { color: '#10B981', progress: 85, message: '양호+' },
      A: { color: '#10B981', progress: 80, message: '양호' },
      'A-': { color: '#10B981', progress: 75, message: '양호-' },
      'B+': { color: '#F59E0B', progress: 70, message: '보통+' },
      B: { color: '#F59E0B', progress: 65, message: '보통' },
      'B-': { color: '#F59E0B', progress: 60, message: '보통-' },
      'C+': { color: '#EF4444', progress: 45, message: '주의+' },
      C: { color: '#EF4444', progress: 35, message: '주의' },
      'C-': { color: '#EF4444', progress: 25, message: '주의-' },
      D: { color: '#DC2626', progress: 15, message: '위험' },
    };

    return configs[rating] || { color: '#6B7280', progress: 50, message: '미분류' };
  }
}
