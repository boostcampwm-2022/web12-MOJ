import { css } from '@emotion/react';
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
  return (
    <div css={userInfoStyle}>
      <span css={userNameStyle}>{isLoggedIn ? userName : ''}</span>
      <Button>{isLoggedIn ? '로그아웃' : '로그인'}</Button>
    </div>
  );
}

export default UserInfo;
