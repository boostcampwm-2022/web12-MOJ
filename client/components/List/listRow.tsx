import { css, SerializedStyles } from '@emotion/react';
import Link from 'next/link';
import { MouseEventHandler, ReactNode } from 'react';

interface ListMapper<T> {
  path: undefined | keyof T;
  name: string;
  style?: {
    head?: SerializedStyles;
    row?: ((row: T) => SerializedStyles) | SerializedStyles;
    all?: SerializedStyles;
  };
  weight: number;
  format?: (value: any) => ReactNode;
  onclick?: MouseEventHandler;
}

interface ListRowProps<T> {
  row: T;

  mapper: ListMapper<T>[];

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

    align-items: center;
    :hover {
      cursor: pointer;
    }
  `,
};

function isFunction(x: any) {
  return Object.prototype.toString.call(x) == '[object Function]';
}

function ListRow<T>({ rowHref, mapper, row }: ListRowProps<T>) {
  return (
    <Link css={style.unset} href={rowHref(row)}>
      <div css={style.row}>
        {mapper.map(
          ({ weight, style: _style, path, format, name, onclick }) => {
            const get = (
              style:
                | SerializedStyles
                | ((row: T) => SerializedStyles)
                | undefined,
              row: T,
            ) => {
              if (style === undefined) return undefined;
              else if (typeof style === 'function') return style(row);
              else return style;
            };

            return (
              <div
                key={name}
                css={[
                  style.cell,
                  style.flexWeight(weight),
                  get(_style?.all, row),
                  get(_style?.row, row),
                ]}
                onClick={onclick}
              >
                {
                  format
                    ? format(path ? row[path] : '')
                    : path
                    ? (row[path] as ReactNode)
                    : '' /* TODO: 너 왜 타입에러야. */
                }
              </div>
            );
          },
        )}
      </div>
    </Link>
  );
}

export default ListRow;
