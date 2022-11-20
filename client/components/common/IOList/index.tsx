import { css } from '@emotion/react';
import Row from './Row';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

interface IOListProps {
  arr: IO[];
  setArr: Dispatch<SetStateAction<IO[]>>;
}

export function useIOList(): [IO[], Dispatch<SetStateAction<IO[]>>] {
  const [arr, setArr] = useState<Array<IO>>([{ input: '', output: '' }]);

  useEffect(() => {
    if (arr.length === 0) setArr([{ input: '', output: '' }]);
  }, [arr]);

  return [arr, setArr];
}

const style = {
  container: css`
    width: 100%;
    height: auto;
    border: 1px solid gray;
    border-radius: 1rem;
    min-width: 400px;
    min-height: 350px;
    padding: 5px 0px 5px 10px;
  `,
};

function IOList({ arr, setArr }: IOListProps) {
  const setValue = (index: number, value: IO) => {
    setArr((arr) => {
      return arr.map((val, idx) => {
        if (idx === index) {
          val = value;
        }
        return val;
      });
    });
  };

  const addNewIO = () => {
    setArr((arr) => {
      return [...arr, { input: '', output: '' }];
    });
  };

  return (
    <div css={style.container}>
      {arr.map((io, idx) => {
        return (
          <Row
            key={`row-${idx}`}
            value={io}
            setValue={(value: IO) => {
              setValue(idx, value);
            }}
            index={idx + 1}
            onDelete={() => {
              const newArr = arr.filter((_, index) => index != idx);
              setArr(newArr);
            }}
          />
        );
      })}
    </div>
  );
}

export default IOList;
