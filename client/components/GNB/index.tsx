import { css } from '@emotion/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import Menu from './Menu';

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
  useEffect(() => {
    (async () => {
      try {
        (await axios('/api/user/login-status')).data;
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      }
    })();
  }, []);

  return (
    <div css={gnbStyle}>
      <Logo />
      <Menu isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default GNB;
