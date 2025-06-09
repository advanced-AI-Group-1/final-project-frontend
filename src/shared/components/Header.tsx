// src/shared/components/Header.tsx
import React from "react";

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <div className="bg-gray-300 p-4 flex justify-end">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 bg-white text-black px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <span className="text-xl">←</span>
        <span className="text-lg font-medium">뒤로가기</span>
      </button>
    </div>
  );
};

export default Header;
