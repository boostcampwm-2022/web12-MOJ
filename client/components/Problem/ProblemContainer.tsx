import { css } from '@emotion/react';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { MdContentCopy } from 'react-icons/md';

interface ProblemContainerProps {
  problem: Problem;
}

const style = {
  limit: css`
    width: 100%;

    display: flex;
    justify-content: flex-start;

    & > span {
      font-weight: bold;
      margin-right: 10px;
    }
  `,
  problemContainer: css`
    margin-left: 10px;
    overflow: auto;
    height: calc(100% - 96px);
  `,
  header: css`
    padding: 0 10px;
    padding-bottom: 15px;
  `,
  h2: css`
    margin: 15px 0;
  `,
  h3: css`
    color: #00227b;
    display: inline;
  `,
  exampleContainer: css`
    display: flex;
  `,
  example: css`
    width: 50%;
  `,
  exampleText: css`
    background-color: rgba(0, 0, 0, 0.1);
    margin-right: 25px;
    padding: 5px;
    border-radius: 5px;
  `,
  exampleTitleContainer: css`
    display: flex;
    flex-direction: row;
    align-content: center;
  `,
  copyText: css`
    color: #00227b;
    :hover {
      cursor: pointer;
    }
    font-size: 0.8em;
    margin: auto 4px;
  `,
  input: css`
    border: none;
    background-color: #eaeaea;
    border-radius: 3px;
    padding: 10px 15px;
    overflow-x: auto;
    margin-right: 10px;
  `,

  copy: css`
    :hover {
      cursor: pointer;
      font-size: 13px;
    }
    color: #00227b;
    font-size: 12px;
  `,
};

function ProblemContainer({ problem }: ProblemContainerProps) {
  async function copyExampleToClipboard(example: string) {
    await navigator.clipboard.writeText(example);
  }

  return (
    <>
      <header css={style.header}>
        <h2 css={style.h2}>
          {problem.id}번 - {problem.title}
        </h2>
        <div css={style.limit}>
          <span>시간제한 {problem.timeLimit}ms</span>
          <span>메모리 제한 {problem.memoryLimit}MB</span>
        </div>
      </header>
      <main css={style.problemContainer}>
        <h3 css={style.h3}>문제</h3>
        <Viewer initialValue={problem.content} />
        <h3 css={style.h3}>입력</h3>
        <Viewer initialValue={problem.input} />
        <h3 css={style.h3}>출력</h3>
        <Viewer initialValue={problem.output} />
        <h3 css={style.h3}>제한</h3>
        <Viewer initialValue={problem.limitExplanation} />
        {problem.examples.map(({ input, output }, idx) => {
          return (
            <div css={style.exampleContainer} key={idx}>
              <div css={style.example}>
                <h3 css={style.h3}>예제 입력 {idx + 1} </h3>
                <MdContentCopy
                  css={style.copy}
                  onClick={() => copyExampleToClipboard(input)}
                />
                <pre css={style.input}>{input}</pre>
              </div>
              <div css={style.example}>
                <h3 css={style.h3}>예제 출력 {idx + 1}</h3>
                <pre css={style.input}>{output}</pre>
              </div>
            </div>
          );
        })}
        <h3 css={style.h3}>입출력 예제 설명</h3>
        <Viewer initialValue={problem.explanation} />
      </main>
    </>
  );
}

export default ProblemContainer;
