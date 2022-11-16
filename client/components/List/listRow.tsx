import { css, SerializedStyles } from '@emotion/react';
import Link from 'next/link';

interface ListRowProps<T> {
  row: T;

  mapper: {
    path: keyof T;
    style?: {
      head?: SerializedStyles;
      row?: SerializedStyles;
      all?: SerializedStyles;
    };
    weight: number;
  }[];

  rowHref: (row: T) => string;
}

const style = {
  flexWeight: (weight: number) => css`
    flex: ${weight};
  `,
  cell: css`
    padding: 20px;
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

function ListRow<T>({ rowHref, mapper, row }: ListRowProps<T>) {
  return (
    <Link css={style.unset} href={rowHref(row)}>
      <div css={style.row}>
        {mapper.map(({ weight, style: _style, path }) => {
          return (
            <div
              key={path.toString()}
              css={[
                style.cell,
                style.flexWeight(weight),
                _style?.all,
                _style?.row,
              ]}
            >
              {row[path] /* TODO: 너 왜 타입에러야. */}
            </div>
          );
        })}
      </div>
    </Link>
  );
}

export default ListRow;
