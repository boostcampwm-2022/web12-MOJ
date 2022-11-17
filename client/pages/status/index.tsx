import React from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../axios';
import List from '../../components/List';
import { css } from '@emotion/react';

const style = {
  container: css`
    margin: 64px 20%;
    padding-bottom: 64px;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 12px;
  `,
};

interface StatusSummary {
  id: number;
  user: string;
  title: string;
  result: number;
  time: string;
  datetime: number;
}

interface StatusListResponseData {
  pageCount: number;
  currentPage: number;
  status: StatusSummary[];
}

function status() {
  const router = useRouter();

  const [status, setStatus] = React.useState<StatusListResponseData | null>(
    null,
  );

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchSubmissionList() {
      const page = router.query.page;

      let _page = 1;
      if (!page) _page = 1;
      else if (Array.isArray(page)) _page = 1;
      else _page = +page;

      const { data } = await axiosInstance.get(
        `/api/submissions?page=${_page}`,
      );
      setStatus(data);
    }

    fetchSubmissionList();
  }, [router.isReady, router.query.page]);

  return (
    <div css={style.container}>
      <div css={style.title}>문제 목록</div>
      {status === null ? (
        <div>로딩중</div>
      ) : (
        <>
          <List
            pageCount={status.pageCount}
            currentPage={status.currentPage}
            data={status.status}
            mapper={[
              { path: 'id', name: '제출 번호', weight: 1 },
              {
                path: 'user',
                name: 'ID',
                weight: 1,
                style: {
                  row: css`
                    color: #3949ab;
                  `,
                },
              },
              {
                path: 'title',
                name: '문제',
                weight: 3,
                style: {
                  row: css`
                    color: #3949ab;
                  `,
                },
              },
              {
                path: 'result',
                name: '결과',
                weight: 1,
                format: (value) => {
                  if (value === 1) return '맞았습니다.';
                  if (value === 2) return '틀렸습니다.';
                  if (value === 3) return '시간 초과';
                  if (value === 4) return '컴파일 에러';
                  if (value === 5) return '런타임 에러';
                },
                style: {
                  row: (row: StatusSummary) => {
                    if (row.result === 1)
                      return css`
                        color: #508f56;
                      `;
                    if (row.result === 2)
                      return css`
                        color: #d64040;
                      `;
                    return css`
                      color: #636971;
                    `;
                  },
                },
              },
              {
                path: 'time',
                name: '시간',
                weight: 1,
                format: (value: number) => `${value} ms`,
              },
              {
                path: 'datetime',
                name: '제출시각',
                weight: 1,
                format: (value: number) => {
                  const date = new Date(value);
                  return (
                    <>
                      {date.toLocaleDateString()}
                      <br />
                      {date.toLocaleTimeString()}
                    </>
                  );
                },
                style: {
                  row: css`
                    font-size: 12px;
                  `,
                },
              },
            ]}
            rowHref={(status: StatusSummary) => `/status/${status.id}`}
            pageHref={(page: number) => `/status?page=${page}`}
          />
        </>
      )}
    </div>
  );
}

export default status;
