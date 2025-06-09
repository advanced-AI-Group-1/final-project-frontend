// src/pages/MainPage.tsx
import React from "react";
import Header from "../shared/components/Header";

const MainPage = () => {
  const handleSearch = () => {
    console.log("검색 버튼 클릭됨");
  };

  const handleDirectInput = () => {
    console.log("직접입력 버튼 클릭됨");
  };

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭됨");
  };

  return (
    <div className="min-h-screen bg-white relative">
      <Header onBack={handleBack} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center space-x-4 flex-nowrap">
          <input
            type="text"
            placeholder="(예) 삼성전자 분석해줘"
            className="border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300"
          />

          <button
            onClick={handleSearch}
            className="bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/17320/17320840.png"
              alt="검색 아이콘"
              className="w-7 h-7"
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
