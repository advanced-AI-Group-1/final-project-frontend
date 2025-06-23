import React, { useState } from 'react';
import './LoginRegisterPage.css';

export default function LoginRegisterPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-register-container">
      <div className={`slide-box ${isRegistering ? 'move-right' : ''}`}>
        <div className="slide-item">
          <p>아직 SHEETAI 의 회원이 아니신가요?</p>
          <button className="panel-btn" onClick={() => setIsRegistering(true)}>
            회원가입
          </button>
        </div>
      </div>

      <div className={`slide-box ${isRegistering ? 'move-left' : ''}`}>
        <div className="slide-item">
          <div className="form">
            <img src="로고_URL" alt="SHEETAI" className="logo" />
            <input type="email" placeholder="이메일" />
            <input type="password" placeholder="비밀번호" />
            <button className="submit-btn">로그인</button>
            <div className="links">
              <a href="#">비밀번호 찾기</a> / <a href="#">아이디 찾기</a>
            </div>
            <button className="google-btn">구글로 시작하기</button>
          </div>
        </div>
      </div>

      {isRegistering && (
        <>
          <div className={`slide-box return-left`}>
            <div className="slide-item">
              <div className="form">
                <img src="로고_URL" alt="SHEETAI" className="logo" />
                <input type="email" placeholder="example@inflab.com" />
                <input type="password" placeholder="비밀번호" />
                <div className="password-rule">
                  영문/숫자/특수문자 중, 2가지 이상 포함<br />
                  8자 이상 32자 이하 입력 (공백 제외)
                </div>
                <input type="password" placeholder="비밀번호 확인" />
                <button className="submit-btn">회원가입</button>
              </div>
            </div>
          </div>

          <div className={`slide-box return-right`}>
            <div className="slide-item">
              <p>SHEETAI 회원이신가요?</p>
              <button
                className="panel-btn"
                onClick={() => setIsRegistering(false)}
              >
                로그인
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
