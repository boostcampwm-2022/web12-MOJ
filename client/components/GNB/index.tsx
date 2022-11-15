import { css } from '@emotion/react';
import Logo from './Logo';

const gnbStyle = css`
  background-color: #3949ab;
  width: 100%;
  height: 70px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function GNB() {
  return (
    <div css={gnbStyle}>
      <Logo />
    </div>
  );
}

export default GNB;
