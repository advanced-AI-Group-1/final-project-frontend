import React from "react";
import { HiArrowLeft } from "react-icons/hi";

interface HeaderProps {
  onBack: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, transparent = false }) => {
  const containerClass = `w-full flex justify-end items-center px-4 ${
    transparent ? "" : "shadow-sm h-16"
  }`;

  const style = transparent
    ? {
        background:
          "linear-gradient(to bottom, rgba(61, 90, 115, 0.85), rgba(61, 90, 115, 0))",
        height: "96px",
        borderBottom: "none",
      }
    : {
        backgroundColor: "#3D5A73",
      };

  return (
    <div className={containerClass} style={style}>
      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
      >
        <HiArrowLeft className="w-10 h-10 text-white mr-20 flex-shrink-0" />
      </button>
    </div>
  );
};

export default Header;
