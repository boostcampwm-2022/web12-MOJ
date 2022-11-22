import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import Logo from './Logo';
import Menu from './Menu';
import UserInfo from './UserInfo';

const gnbStyle = css`
  background-color: #3949ab;
  width: 100%;
  height: 70px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function GNB() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const result = (await axiosInstance('/api/users/login-status')).data;
        setLoggedIn(true);
        setUserName(result.userName);
      } catch (error) {
        setLoggedIn(false);
      }
    })();
  }, [router.pathname]);

  return (
    <div css={gnbStyle}>
      <Logo />
      <Menu isLoggedIn={isLoggedIn} />
      <UserInfo isLoggedIn={isLoggedIn} userName={userName} />
    </div>
  );
}

export default GNB;
