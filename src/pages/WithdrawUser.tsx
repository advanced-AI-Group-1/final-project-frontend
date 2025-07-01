import { useNavigate } from "react-router-dom";

function WithdrawButton() {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError } = useWithdrawUser();

  const handleWithdraw = () => {
    console.log("Withdrawal initiated");
    
    mutate(
        { password : prompt('비밀번호를 입력하세요:') || undefined },
        {
          onSuccess: (res) => {
            alert(res.data || '탈퇴 완료되었습니다.');
            navigate('/')
            console.log("Withdrawal successful");
          },
          onError: (error) => {
            console.error("Withdrawal failed:", error);
          },
        }
    )
  };

  return (
    <button onClick={handleWithdraw} disabled={isPending}>
        {isPending ? "처리 중..." : isSuccess ? "탈퇴 완료" : isError ? "탈퇴 실패" : "탈퇴하기"}
    </button>
  );
}