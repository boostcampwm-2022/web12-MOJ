import { css } from '@emotion/react';

interface ProblemContainerProps {
  problem: Problem;
}

const limitStyle = css`
  width: 100%;

  display: flex;
  justify-content: flex-start;

  & > span {
    font-weight: bold;
    margin-right: 10px;
  }
`;

const problemContainerStyle = css`
  margin-left: 10px;
  overflow: auto;
  height: 100%;
`;

function ProblemContainer({ problem }: ProblemContainerProps) {
  return (
    <div css={problemContainerStyle}>
      <h2>
        {problem.id}번 - {problem.title}
      </h2>

      <div css={limitStyle}>
        <span>시간제한 {problem.timeLimit}ms</span>
        <span>메모리 제한 {problem.memoryLimit}MB</span>
      </div>

      <h3>문제</h3>
      {problem.content}
      <h3>입력</h3>
      {problem.io.input}
      <h3>출력</h3>
      {problem.io.output}
      <h3>제한</h3>
      {problem.limitExplain}

      {problem.ioExample.map(({ input, output }, idx) => {
        return (
          <>
            <h3>예제 입력 {idx + 1}</h3>
            {input}
            <h3>예제 출력 {idx + 1}</h3>
            {output}
          </>
        );
      })}
      <h3>입출력 예제 설명</h3>
      {problem.ioExplain}
    </div>
  );
}

export default ProblemContainer;
