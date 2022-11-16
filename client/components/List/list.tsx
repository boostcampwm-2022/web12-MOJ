// 리스트
// 헤드
// 목록
// 페이지네이션

import { css, SerializedStyles } from '@emotion/react';
import Paginator from './paginator';
import ListRow from './listRow';
import { ReactNode } from 'react';

interface ListMapper<T> {
  path: keyof T;
  name: string;
  style?: {
    head?: SerializedStyles;
    row?: ((row: T) => SerializedStyles) | SerializedStyles;
    all?: SerializedStyles;
  };
  weight: number;
  format?: (value: any) => ReactNode;
}

interface ListProps<T> {
  pageCount: number;
  currentPage: number;

  data: T[];

  mapper: ListMapper<T>[];

  rowHref: (row: T) => string;
  pageHref: (page: number) => string;
}

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
  unset: css`
    all: unset;
  `,
  row: css`
    display: flex;
    font-size: 16px;
    font-weight: 400;
    color: #636971;
    :hover {
      cursor: pointer;
    }
  `,
};

function List<T>({
  pageCount,
  currentPage,
  data,
  mapper,
  rowHref,
  pageHref,
}: ListProps<T>) {
  return (
    <div css={style.container}>
      <div css={style.head}>
        {mapper.map(({ name, weight, style: _style }) => (
          <div
            key={name}
            css={[
              style.cell,
              style.flexWeight(weight),
              _style?.all,
              _style?.head,
            ]}
          >
            {name}
          </div>
        ))}
      </div>
      {data.map((row, index) => (
        <ListRow key={index} row={row} rowHref={rowHref} mapper={mapper} />
      ))}
      <Paginator
        pageCount={pageCount}
        currentPage={currentPage}
        href={pageHref}
      />
    </div>
  );
}

export default List;
