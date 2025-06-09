import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyRelatedCompanies } from "@/shared/data/relatedCompanies";
import Header from "@/shared/components/Header";

const SearchResultPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const relatedList = dummyRelatedCompanies.relatedCompanies;

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <Header onBack={handleBack} />

      {/* 콘텐츠 */}
      <div className="w-full flex flex-col items-center justify-start px-6 py-6">
        <div className="w-full max-w-screen-lg">
          {/* 검색창 */}
          <div className="flex flex-row items-center justify-center mt-25 mb-20 space-x-4">
            <input
              type="text"
              placeholder="(예) 삼성전자 분석해줘"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300"
            />

            {/* 이미지 검색 버튼 */}
            <button
              className="bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/17320/17320840.png"
                alt="검색 아이콘"
                className="w-7 h-7"
              />
            </button>

            {/* 직접입력 버튼 */}
            <button
              className="bg-blue-600 text-white text-lg w-[120px] h-14 rounded whitespace-nowrap"
            >
              직접입력
            </button>
          </div>

          {/* 카드 리스트 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
            {relatedList.map((company) => (
              <div
                key={company.id}
                className="bg-blue-100 rounded-lg text-center py-6 px-4 text-blue-800 font-medium cursor-pointer hover:bg-blue-200 transition"
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
