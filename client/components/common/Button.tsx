import { css } from '@emotion/react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler;
}

const btnStyle = css`
  background-color: #6f74dd;
  border-radius: 1rem;
  padding: 5px 15px;
  color: white;
  font-size: 14px;
  margin: 0 15px;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
  }
`;

function Button({ onClick, children }: ButtonProps) {
  return (
    <div css={btnStyle} onClick={onClick}>
      {children}
    </div>
  );
}

export default Button;
