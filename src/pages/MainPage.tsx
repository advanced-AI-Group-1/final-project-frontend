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
      {/* 상단 회색 바 */}
      <div className="bg-gray-300 p-4 flex justify-end">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 bg-white text-black px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <span className="text-xl">←</span>
          <span className="text-lg font-medium">뒤로가기</span>
        </button>
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center space-x-4 flex-nowrap">
          <input
            type="text"
            placeholder="(예) 삼성전자 분석해줘"
            className="border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300"
          />

          {/* 검색 버튼 (이미지만) */}
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


          {/* 직접입력 버튼 */}
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
