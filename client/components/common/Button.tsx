import { css } from '@emotion/react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler;
  style?: 'default' | 'cancel';
  minWidth?: string;
  minHeight?: string;
}

const btnStyle = {
  default: css`
    background-color: #6f74dd;
    border-radius: 1rem;
    border: 1px solid #6f74dd;
    padding: 5px 15px;
    color: white;
    font-size: 14px;
    margin: 0 15px;
    transition: all 0.2s;
    user-select: none;
    text-align: center;

    &:hover {
      cursor: pointer;
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
    }
  `,
  cancel: css`
    background-color: #ffffff;
    border-radius: 1rem;
    border: 1px solid #6f74dd;
    padding: 5px 15px;
    color: #6f74dd;
    font-size: 14px;
    margin: 0 15px;
    transition: all 0.2s;
    user-select: none;
    text-align: center;

    &:hover {
      cursor: pointer;
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
    }
  `,
  minHeight: (height: string) => css`
    min-height: ${height};
  `,
  minWidth: (width: string) => css`
    min-width: ${width};
  `,
};

function Button({
  onClick,
  children,
  minWidth,
  minHeight,
  style = 'default',
}: ButtonProps) {
  return (
    <div
      css={[
        btnStyle[style],
        minHeight && btnStyle.minHeight(minHeight),
        minWidth && btnStyle.minWidth(minWidth),
      ]}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Button;
