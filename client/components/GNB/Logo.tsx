import { css } from '@emotion/react';
import { useRouter } from 'next/router';

const logoStyle = css`
  font-weight: bold;
  font-size: 40px;
  color: white;
  font-family: 'NanumSquareNeoHeavy';
  user-select: none;
  cursor: pointer;
  margin: 0 15px;
`;

function Logo() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
  };

  return (
    <div css={logoStyle} onClick={handleClick}>
      MOJ
    </div>
  );
}

export default Logo;
