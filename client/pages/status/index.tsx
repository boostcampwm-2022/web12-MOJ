import React from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../axios';
import List from '../../components/List';
import { css } from '@emotion/react';
import style from '../../styles/style';

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
    <div css={style.relativeContainer}>
      <div css={style.title}>채점 현황</div>
      {status === null ? (
        <div>로딩중</div>
      ) : (
        <>
          <List
            pageCount={status.pageCount}
            currentPage={status.currentPage}
            data={status.submissions}
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
              },
              {
                path: 'time',
                name: '시간',
                weight: 1,
                format: (value: number) => `${value ?? '--'} ms`,
              },
              {
                path: 'createdAt',
                name: '제출시각',
                weight: 1,
                format: (value: string) => {
                  const date = new Date(Date.parse(value));
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
