import { useQuery } from "@tanstack/react-query";
import api from "@/shared/config/axios";

// 실제 요청 함수
const fetchQueryResult = async (query: string) => {
  const response = await api.post("/api/query/ask", { query });
  return response.data;
};

// React Query 훅으로 감싼 커스텀 훅
export const useQueryResult = (query: string) => {
  return useQuery({
    queryKey: ["queryResult", query],
    queryFn: () => fetchQueryResult(query),
    enabled: !!query?.trim(), // 빈 문자열이면 실행 안함
  });
};