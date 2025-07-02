import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface FooterProps {
  variant?: 'transparent-black' | 'white';
}

const Footer: React.FC<FooterProps> = ({ variant = 'white' }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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
    <footer className={`w-full relative py-4 ${bgClass} text-xs ${textColor}`}>
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <p>© 2025 SheetAI. All rights reserved.</p>
      </div>

      {isLoggedIn && (
        <button
          onClick={handleWithdrawClick}
          className={`absolute right-4 bottom-4 ${textColor} hover:text-red-500 transition-colors underline`}
        >
          회원 탈퇴
        </button>
      )}
    </footer>
  );
};

export default Footer;
