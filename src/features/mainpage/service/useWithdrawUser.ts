import { useMutation } from '@tanstack/react-query';
import api from "@/shared/config/axios";

interface WithdrawUserPayload {
  password?: string; // 소셜 로그인 사용자는 비밀번호 없이도 가능
}

export const useWithdrawUser = () => {
  return useMutation({
    mutationFn: async ({ password }: WithdrawUserPayload) => {
      const response = await api.delete('/api/users/me', {
        params: password ? { password } : {},
        withCredentials: true, // 인증 필요 시 쿠키 포함
      });
      return response.data;
    },
  });
};