import { css } from '@emotion/react';
import Link from 'next/link';

interface PaginatorProps {
  pageCount: number;
  currentPage: number;
  href: (page: number) => string;
}

const style = {
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #636971;
    padding: 15px;
  `,
  page: css`
    padding: 4px 8px;
    border-radius: 2px;
    :hover {
      cursor: pointer;
    }
  `,
  'page-active': css`
    background-color: #f6f4f3;
  `,
  active: css`
    color: #000000;
    font-weight: 500;
    :hover {
      cursor: pointer;
    }
  `,
  buttonContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 8px;
  `,
  unset: css`
    all: unset;
  `,
  disabled: css`
    pointer-events: none;
  `,
};

function Paginator({ pageCount, currentPage, href }: PaginatorProps) {
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(currentPage + 2, pageCount);
  const isPrev = start > 1;
  const isNext = end < pageCount;

  if (end - start + 1 < Math.min(5, pageCount)) {
    const need = Math.min(5, pageCount) - (end - start + 1);
    if (start == 1) end += need;
    else start -= need;
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div css={style.container}>
      <Link
        css={[style.unset, isPrev ? undefined : style.disabled]}
        href={isPrev ? href(start - 1) : '#'}
      >
        <div
          css={[style.buttonContainer, isPrev ? style.active : style.disabled]}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>{'Prev'}</div>
        </div>
      </Link>
      {pages.map((page) => (
        <Link href={href(page)} key={page} css={style.unset}>
          <div
            css={[
              style.page,
              ...(page === currentPage
                ? [style.active, style['page-active']]
                : []),
            ]}
          >
            {page}
          </div>
        </Link>
      ))}
      <Link
        css={[style.unset, isNext ? undefined : style.disabled]}
        href={isNext ? href(end + 1) : '#'}
      >
        <div css={[style.buttonContainer, isNext ? style.active : undefined]}>
          <div>{'Next'}</div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default Paginator;
