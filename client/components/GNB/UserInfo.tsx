import { css } from '@emotion/react';

interface UserInfoProps {
  isLoggedIn: boolean;
  userName: string;
}

const userInfoStyle = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const btnStyle = css`
  background-color: #6f74dd;
  border-radius: 1rem;
  padding: 5px 15px;
  color: white;
  font-size: 14px;
  margin: 0 15px;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
  }
`;

const userNameStyle = css`
  color: white;
`;

function UserInfo({ isLoggedIn, userName }: UserInfoProps) {
  return (
    <div css={userInfoStyle}>
      <span css={userNameStyle}>{isLoggedIn ? userName : ''}</span>
      <div css={btnStyle}> {isLoggedIn ? '로그아웃' : '로그인'}</div>
    </div>
  );
}

export default UserInfo;
