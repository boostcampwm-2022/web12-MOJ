import React from 'react';
import { css } from '@emotion/react';
import ProblemList from '../components/problemList';
import axios from 'axios';
import axiosInstance from '../axios';

const style = {
  container: css`
    margin: 0 20%;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
  `,
};

interface ProblemSummary {
  id: number;
  title: string;
  rate: number;
}

interface ProblemListResponseData {
  pageCount: number;
  currentPage: number;
  problems: ProblemSummary[];
}

function Home() {
  const [problems, setProblems] =
    React.useState<ProblemListResponseData | null>(null);

  React.useEffect(() => {
    async function fetchProblemList() {
      const { data } = await axiosInstance.get('/api/problem');
      setProblems(data);
    }
    fetchProblemList();
  }, []);

  return (
    <div css={style.container}>
      <div css={style.title}>문제 목록</div>
      {problems === null ? (
        <div>로딩중</div>
      ) : (
        <ProblemList {...problems}></ProblemList>
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
