import React from 'react';
import { css } from '@emotion/react';
import axiosInstance from '../axios';
import { useRouter } from 'next/router';
import List from '../components/List';
import style from '../styles/style';


function Home() {
  const router = useRouter();

  const [problems, setProblems] =
    React.useState<ProblemListResponseData | null>(null);

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchProblemList() {
      const page = router.query.page;

      let _page = 1;
      if (!page) _page = 1;
      else if (Array.isArray(page)) _page = 1;
      else _page = +page;

      const { data } = await axiosInstance.get(`/api/problem?page=${_page}`);
      setProblems(data);
    }

    fetchProblemList();
  }, [router.isReady, router.query.page]);

  return (
    <div css={style.relativeContainer}>
      <div css={style.title}>문제 목록</div>
      {problems === null ? (
        <div>로딩중</div>
      ) : (
        <>
          <List
            pageCount={problems.pageCount}
            currentPage={problems.currentPage}
            data={problems.problems}
            mapper={[
              { path: 'id', name: '문제 번호', weight: 1 },
              {
                path: 'title',
                name: '제목',
                weight: 4,
                style: {
                  row: css`
                    color: #3949ab;
                  `,
                },
              },
              {
                path: 'rate',
                name: '정답 비율',
                weight: 1,
                style: {
                  all: css`
                    text-align: center;
                  `,
                },
                format: (value: number) => `${value}%`,
              },
            ]}
            rowHref={(problem: ProblemSummary) => `/problem/${problem.id}`}
            pageHref={(page: number) => `/?page=${page}`}
          />
        </>
      )}
    </div>
  );
}

export default Home;

//
// 문제 [{ number: , title: , 비율:  }, { }];
// 제출 [{ number: , id: , 문제: , 결과: , 시간: , 제출 시각 }]
// 출제 [{ number: , title: , 날짜: }]; + 버튼들 UI 상에서만.

// data []
// colums : [ { name: "문제 번호", path: "number"}, { name: "제목", path: "title" } ]
// style...
