import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  variant?: 'transparent-black' | 'white';
}

const Footer: React.FC<FooterProps> = ({ variant = 'white' }) => {
  const navigate = useNavigate();

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  const bgClass =
    variant === 'transparent-black'
      ? 'bg-[rgba(0,0,0,0.5)]'
      : 'bg-white';

  const textColor =
    variant === 'transparent-black'
      ? 'text-gray-300'
      : 'text-gray-500';

  return (
    <footer className={`w-full py-4 ${bgClass} text-xs ${textColor}`}>
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center px-4">
        {/* ✅ 왼쪽 : 문구 컨테이너 */}
        <div className="w-full md:flex-1 text-center md:text-center">
          <p>© 2025 SheetAI. All rights reserved.</p>
        </div>

        {/* ✅ 오른쪽 : 버튼 컨테이너 */}
        <div className="w-full md:flex-1 text-center md:text-right mt-2 md:mt-0">
          <button
            onClick={handleWithdrawClick}
            className={`${textColor} hover:text-red-500 transition-colors underline`}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
