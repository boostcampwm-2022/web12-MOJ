import React from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../axios';
import List from '../../components/List';
import { css } from '@emotion/react';
import style from '../../styles/style';
import Head from 'next/head';

function Status() {
  const router = useRouter();

  const [status, setStatus] = React.useState<StatusListResponseData | null>(
    null,
  );

  const [range, setRange] = React.useState<{ start: number; end: number }>({
    start: -1,
    end: -1,
  });

  function createUrl(
    page: number,
    { start, end }: { start: number; end: number },
  ) {
    if (start === -1 || end === -1) return `/api/submissions?page=${page}`;
    else return `/api/submissions?start=${start}&end=${end}`;
  }

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchSubmissionList() {
      const page = router.query.page;

      let _page = 1;
      if (!page) _page = 1;
      else if (Array.isArray(page)) _page = 1;
      else _page = +page;

      const { data } = await axiosInstance.get<StatusListResponseData>(
        createUrl(_page, { start: -1, end: -1 }),
      );
      setStatus(data);

      const start = data.submissions.at(-1)?.id;
      const end = data.submissions.at(0)?.id;

      setRange({ start: start ?? -1, end: end ?? -1 });
    }

    fetchSubmissionList();
  }, [router.isReady, router.query.page]);

  React.useEffect(() => {
    if (status === null || range.start === -1 || range.end === -1) return;
    let timer: NodeJS.Timeout | undefined = undefined;
    if (status.submissions.some(({ result }) => result === null)) {
      timer = setTimeout(async () => {
        const { data } = await axiosInstance.get<StatusListResponseData>(
          createUrl(0, range),
        );
        setStatus((before) => {
          if (!before) return null;
          return { ...before, submissions: data.submissions };
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [range, status]);

  return (
    <>
      <Head>
        <title>MOJ | 채점 현황</title>
      </Head>
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
                  style: {
                    row: (row: StatusSummary) => {
                      if (row.result === '정답') {
                        return css`
                          color: #4caf50;
                        `;
                      }
                      if (row.result === '오답') {
                        return css`
                          color: #f44336;
                        `;
                      }
                    },
                  },
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
    </>
  );
}

export default Status;
