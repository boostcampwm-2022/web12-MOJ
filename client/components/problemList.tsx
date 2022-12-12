import { css } from '@emotion/react';
import React from 'react';
import Paginator from './paginator';
import ProblemListRow from './problemListRow';

const style = {
  container: css`
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0px 0px 1.5px 1.5px rgba(0, 0, 0, 0.15);

    & > :not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }
  `,
  head: css`
    display: flex;
    font-size: 14px;
    font-weight: bold;
    color: #636971;
  `,
  flexWeight: (weight: number) => css`
    flex: ${weight};
  `,
  cell: css`
    padding: 20px;
  `,
  center: css`
    text-align: center;
  `,
};

interface ProblemListProps {
  pageCount: number;
  currentPage: number;
  problems: ProblemSummary[];
}

const head = [
  { name: '문제 번호', weight: 1, isCenter: false },
  { name: '제목', weight: 4, isCenter: false },
  { name: '총 제출 수', weight: 1, isCenter: true },
];

function ProblemList({ pageCount, currentPage, problems }: ProblemListProps) {
  return (
    <div css={style.container}>
      <div css={style.head}>
        {head.map(({ name, weight, isCenter }) => (
          <div
            key={name}
            css={[
              style.cell,
              style.flexWeight(weight),
              isCenter ? style.center : undefined,
            ]}
          >
            {name}
          </div>
        ))}
      </div>
      {problems.map((problem) => (
        <ProblemListRow key={problem.id} {...problem} />
      ))}

      <Paginator
        pageCount={pageCount}
        currentPage={currentPage}
        href={(page) => `/?page=${page}`}
      />
    </div>
  );
}

export default ProblemList;
