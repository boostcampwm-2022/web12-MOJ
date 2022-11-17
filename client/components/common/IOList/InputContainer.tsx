import { SetStateAction, Dispatch } from 'react';
import { css } from '@emotion/react';

interface InputContaierProps {
  title: string;
  value: string;
  setValue: (value: string) => void;
}

const style = {
  container: css`
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 50%;
  `,
  input: css`
    border: none;
    background-color: #eaeaea;
    border-radius: 3px;
    height: 25px;
    appearance: none;
    &:focus {
      outline: none;
    }
  `,
  title: css`
    font-weight: bold;
    padding-bottom: 10px;
  `,
};

function InputContainer({ title, value, setValue }: InputContaierProps) {
  return (
    <div css={style.container}>
      <div css={style.title}>{title}</div>
      <input
        css={style.input}
        value={value}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
          setValue(ev.target.value)
        }
      />
    </div>
  );
}

export default InputContainer;
