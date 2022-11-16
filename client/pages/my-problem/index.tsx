import React from 'react';
import Router, { useRouter } from 'next/router';
import axiosInstance from '../../axios';
import List from '../../components/List';
import Button from '../../components/common/Button';
import { css } from '@emotion/react';
import { AddFileSvg, DeleteSvg, EditSvg } from '../../components/svgs';
import Toggle from '../../components/svgs/toggle';
import Link from 'next/link';

const style = {
  container: css`
    margin: 64px 20%;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 12px;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

interface MyProblemSummary {
  id: number;
  title: string;
  datetime: number;
  state: number;
}

interface StatusListResponseData {
  pageCount: number;
  currentPage: number;
  problems: MyProblemSummary[];
}

function MyProblem() {
  const router = useRouter();

  const [myProblems, setMyProblems] =
    React.useState<StatusListResponseData | null>(null);

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchSubmissionList() {
      const page = router.query.page;
      const userName = 'hyoseok0604';

      let _page = 1;
      if (!page) _page = 1;
      else if (Array.isArray(page)) _page = 1;
      else _page = +page;

      const { data } = await axiosInstance.get(`/api/problems?page=${_page}`);
      setMyProblems(data);
    }

    fetchSubmissionList();
  }, [router.isReady, router.query.page]);

  return (
    <div css={style.container}>
      <div css={style.titleContainer}>
        <div css={style.title}>출제 리스트</div>
        <Button onClick={() => Router.push('/my-problem/new')}>+ 추가</Button>
      </div>
      {myProblems === null ? (
        <div>로딩중</div>
      ) : (
        <>
          <List
            pageCount={myProblems.pageCount}
            currentPage={myProblems.currentPage}
            data={myProblems.problems}
            mapper={[
              { path: 'id', name: '제출 번호', weight: 1 },
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
                path: 'datetime',
                name: '출제날짜',
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
              {
                path: 'id',
                name: '편집',
                weight: 0.5,
                style: {
                  all: css`
                    text-align: center;
                  `,
                },
                format: (value: number) => (
                  <Link href={`/my-problem/edit/${value}`}>
                    <EditSvg />
                  </Link>
                ),
              },
              {
                path: undefined,
                name: '삭제',
                weight: 0.5,
                style: {
                  all: css`
                    text-align: center;
                  `,
                },
                onclick: (e) => {
                  e.preventDefault();
                  alert('삭제하시겠습니까?');
                },
                format: () => <DeleteSvg />,
              },
              {
                path: 'id',
                name: 'TC 추가',
                weight: 0.5,
                style: {
                  all: css`
                    text-align: center;
                  `,
                },
                format: (value: number) => (
                  <Link href={`/my-problem/tc/${value}`}>
                    <AddFileSvg />
                  </Link>
                ),
              },
              {
                path: 'state',
                name: '공개/비공개',
                weight: 0.5,
                style: {
                  all: css`
                    text-align: center;
                  `,
                },
                format: (state: number) =>
                  state === 0 ? <Toggle.Off /> : <Toggle.On />,
              },
            ]}
            rowHref={(status: MyProblemSummary) =>
              `/my-problem/edit/${status.id}`
            }
            pageHref={(page: number) => `/my-problem?page=${page}`}
          />
        </>
      )}
    </div>
  );
}

export default MyProblem;
