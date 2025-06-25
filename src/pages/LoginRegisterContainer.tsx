import React, { useState, useEffect } from 'react';
import styles from './LoginRegisterContainer.module.css';
import Header from '../shared/components/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dummyUsers } from '@/shared/data/dummyUsers';

const LoginRegisterContainer: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [users, setUsers] = useState(dummyUsers);

//   // ✅ USER 테이블 기준 더미데이터
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       userId: 'cofl@gmail.com',
//       password: 'test1234!',
//       ip: '192.168.1.10',
//       enabled: true,
//       dateCreated: '2024-06-01T10:00:00',
//       dateWithdraw: null,
//       withdraw: false,
//     },
//   ]);

  useEffect(() => {
    console.log('[더미 USER 데이터]', users);
  }, [users]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedUser = users.find(
      (user) =>
        user.userId === emailInput.trim() &&
        user.password === passwordInput &&
        user.enabled &&
        !user.withdraw
    );

    if (matchedUser) {
      login();
      navigate('/');
    } else {
      alert('이메일 또는 비밀번호가 잘못되었거나, 탈퇴된 계정입니다.');
    }
  };

  return (
    <div>
      <Header onBack={() => navigate(-1)} transparent={false} />

      <div className={`${styles.container} ${isSignUp ? styles.rightPanelActive : ''}`}>
        {/* 로그인 폼 */}
        <div className={styles.formContainer + ' ' + styles.signInContainer}>
          <form onSubmit={handleLogin}>
            <img src="src/assets/image/logo.png" alt="logo" className={styles.logo} />
            <input
              type="email"
              placeholder="이메일"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            <button type="submit" className={styles.primaryButton}>로그인</button>
            <div className={styles.linkContainer}>
              <a href="#">비밀번호 찾기</a>
              <a href="#">아이디 찾기</a>
            </div>
            <button type="button" className={styles.googleButton}>구글로 시작하기</button>
          </form>
        </div>

        {/* 회원가입 폼 */}
        <div className={styles.formContainer + ' ' + styles.signUpContainer}>
          <form onSubmit={(e) => e.preventDefault()}>
            <img src="src/assets/image/logo.png" alt="logo" className={styles.logo} />
            <label className={styles.inputLabel}>이메일</label>
            <input type="email" placeholder="example@inflab.com" />

            <label className={styles.inputLabel}>비밀번호</label>
            <input type="password" placeholder="비밀번호" />
            <div className={styles.passwordHint}>영문/숫자/특수문자 중, 2가지 이상 포함</div>
            <div className={styles.passwordHint}>8자 이상 32자 이하 입력 (공백 제외)</div>

            <label className={styles.inputLabel}>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호 확인" />

            <button type="submit" className={styles.primaryButton}>회원가입</button>
          </form>
        </div>

        {/* 오버레이 */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className={styles.videoBackground}
            >
              <source src="src/assets/image/small.mp4" type="video/mp4" />
            </video>

            <div className={styles.overlayPanel + ' ' + styles.overlayLeft}>
              <h1>SHEETAI 의 회원이신가요?</h1>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsSignUp(false)}
              >
                로그인
              </button>
            </div>
            <div className={styles.overlayPanel + ' ' + styles.overlayRight}>
              <h1>아직 SHEETAI 의 회원이 아니신가요?</h1>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsSignUp(true)}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterContainer;
