import { css } from '@emotion/react';
import { useRouter } from 'next/router';

const logoStyle = css`
  font-weight: bold;
  font-size: 40px;
  color: white;
  font-family: Georgia, 'Times New Roman', Times, serif;
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

// https://fonts.google.com/specimen/Josefin+Sans?sidebar.open=true&selection.family=Noto+Sans+KR:wght@100;300;400;500;700;900&preview.text=MOJ&preview.text_type=custom
