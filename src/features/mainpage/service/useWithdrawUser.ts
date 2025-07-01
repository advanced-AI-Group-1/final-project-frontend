import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import api from "@/shared/config/axios";
import { AxiosError } from 'axios';

/**
 * Payload type for the withdrawal request
 */
export interface WithdrawUserPayload {
  /**
   * User's password (optional for social login users)
   */
  password?: string;
}

/**
 * Successful response type from the withdrawal API
 */
export interface WithdrawUserResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Extended error type for withdrawal operations
 */
export interface WithdrawUserError extends Error {
  message: string;
  status?: number;
  code?: string;
  timestamp?: string;
}

/**
 * Custom hook for handling user account withdrawal
 * @param options Additional TanStack Query options
 * @returns Mutation object with withdrawal status and methods
 */
export const useWithdrawUser = (
  options?: Omit<
    UseMutationOptions<WithdrawUserResponse, WithdrawUserError, WithdrawUserPayload>,
    'mutationFn'
  >
): UseMutationResult<WithdrawUserResponse, WithdrawUserError, WithdrawUserPayload> => {
  const mutationFn = async (payload: WithdrawUserPayload): Promise<WithdrawUserResponse> => {
    try {
      const { password } = payload;
      const params = password ? { password } : undefined;
      
      const response = await api.delete<WithdrawUserResponse>('/api/users/me', {
        params,
        withCredentials: true,
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors
      });

      if (!response.data.success) {
        throw {
          name: 'WithdrawalError',
          message: response.data.message || '회원 탈퇴에 실패했습니다.',
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        message: response.data.message || '회원 탈퇴가 완료되었습니다.',
        data: response.data.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.';
        
        throw {
          name: 'WithdrawalError',
          message: errorMessage,
          status: axiosError.response?.status,
          code: axiosError.code,
          timestamp: new Date().toISOString(),
        };
      }
      
      // For non-Axios errors
      const err = error as Error;
      throw {
        name: err.name || 'WithdrawalError',
        message: err.message || '알 수 없는 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
      };
    }
  };

  return useMutation(mutationFn, {
    retry: 1, // Retry once on failure
    ...options,
  });
};

/**
 * Type guard to check if an error is a WithdrawUserError
 */
export const isWithdrawUserError = (error: unknown): error is WithdrawUserError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};