import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/components/Header";
import FinancialInputModal from "../shared/components/FinancialInputModal"; // ✅ 모달 import

const MainPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태

  const handleSearch = () => {
    console.log("검색 버튼 클릭됨");
    navigate("/search");
  };

  const handleDirectInput = () => {
    console.log("직접입력 버튼 클릭됨");
    setIsModalOpen(true); // ✅ 모달 열기
  };

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭됨");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://spp.cmu.ac.th/wp-content/uploads/2020/06/smart-city-01-scaled.jpg')",
      }}
    >
     <Header onBack={handleBack} transparent />


      {/* ✅ 모달 */}
      <FinancialInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center space-x-4 flex-nowrap bg-white/80 p-4 rounded-xl shadow-lg backdrop-blur-sm">
          <input
            type="text"
            placeholder="(예) 삼성전자 분석해줘"
            className="border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button
            onClick={handleSearch}
            className="bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition"
          >
            <img
  src="https://cdn-icons-png.flaticon.com/512/17320/17320840.png"
  alt="검색 아이콘"
  className="mt-2 ml-1 w-9 h-9"
/>

          </button>

          <button
            onClick={handleDirectInput}
            className="bg-blue-600 text-white text-lg w-[120px] h-14 rounded whitespace-nowrap"
          >
            직접입력
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
