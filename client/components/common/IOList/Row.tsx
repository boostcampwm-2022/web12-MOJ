import { Dispatch, SetStateAction, useState } from 'react';
import InputContainer from './InputContainer';
import { css } from '@emotion/react';
import RemoveRowSvg from '../../svgs/removeRow';

interface IO {
  input: string;
  output: string;
}
interface RowProps {
  value: IO;
  setValue: (value: IO) => void;
  index: number;
  onDelete: () => void;
}

const style = {
  removeBtn: css`
    height: 32px;
    width: 32px;
    margin-right: 8px;
    padding-top: 29px;
    border-radius: 50%;
  `,
};

function Row({ value, setValue, index, onDelete }: RowProps) {
  const setInputValue = (input: string) => {
    setValue({ ...value, input });
  };

  const setOutputValue = (output: string) => {
    setValue({ ...value, output });
  };

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <InputContainer
        title={`입력${index}`}
        value={value.input}
        setValue={setInputValue}
      />
      <InputContainer
        title={`출력${index}`}
        value={value.output}
        setValue={setOutputValue}
      />
      <div css={style.removeBtn} onClick={onDelete}>
        <RemoveRowSvg />
      </div>
    </div>
  );
}

export default Row;
