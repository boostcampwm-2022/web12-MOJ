import { css } from '@emotion/react';
import { Router, useRouter } from 'next/router';
import axiosInstance from '../../axios';
import Button from '../common/Button';

interface UserInfoProps {
  isLoggedIn: boolean;
  userName: string;
}

const userInfoStyle = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const userNameStyle = css`
  color: white;
`;

function UserInfo({ isLoggedIn, userName }: UserInfoProps) {
  const router = useRouter();
  const makeRequestURL = () => {
    const requestURL = 'https://github.com/login/oauth/authorize';
    const redirectURL = `${process.env.SERVER_ORIGIN}${process.env.REDIRECT_URL}`;
    const clientID = process.env.CLIENT_ID ?? '';

    const result = new URL(requestURL);
    result.searchParams.append('client_id', clientID);
    result.searchParams.append('redirect_uri', encodeURI(redirectURL));

    return result.href;
  };

  const handleClick = async () => {
    if (isLoggedIn) {
      await axiosInstance.post('/api/users/logout');
      location.href = '/';
    } else {
      document.location.href = makeRequestURL();
    }
  };

  return (
    <div css={userInfoStyle}>
      <span css={userNameStyle}>{isLoggedIn ? userName : ''}</span>
      <Button onClick={handleClick} minWidth="60px">
        {isLoggedIn ? '로그아웃' : '로그인'}
      </Button>
    </div>
  );
}

export default UserInfo;
