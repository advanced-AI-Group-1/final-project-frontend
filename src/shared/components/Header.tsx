import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onBack: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, transparent = false }) => {
  const containerClass = `w-full flex items-center px-4 py-2`;
  const navigate = useNavigate();

  const style = transparent
    ? {
        background: 'linear-gradient(to bottom, rgba(61, 90, 115, 0.85), rgba(61, 90, 115, 0))',
        height: '96px',
        borderBottom: 'none',
      }
    : { height: '96px' };

  return (
    <div className={containerClass} style={style}>
      <img
        src='src/assets/image/logo.png'
        alt='logo'
        className='w-24 h-16 flex-shrink-0 cursor-pointer'
        onClick={() => {
          navigate('/');
        }}
      />
      <div className='m-auto'></div>
      <button
        onClick={onBack}
        className='w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer'
      >
        <HiArrowLeft className={`w-10 h-10 ${transparent ? 'text-white' : ''} flex-shrink-0`} />
      </button>
    </div>
  );
};

export default Header;
