import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Editor } from '@toast-ui/react-editor';
import { css } from '@emotion/react';
import React, { forwardRef } from 'react';
import Button from '../../components/common/Button';
import Router from 'next/router';
import axiosInstance from '../../axios';
import IOList, { useIOList } from '../../components/common/IOList';

const WrappedEditor = dynamic(
  () => import('../../components/Editor/wrapperEditor'),
  {
    ssr: false,
  },
);

const EditorWithForwardedRef = React.forwardRef(
  (props, ref: React.LegacyRef<Editor>) => (
    <WrappedEditor {...props} forwardedRef={ref} />
  ),
);

const style = {
  container: css`
    margin: 64px 20%;
    padding-bottom: 64px;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 0;
  `,
  labelWrapper: css`
    display: flex;
    gap: 24px;
    margin: 12px 0;
  `,
  label: css`
    font-size: 18px;
    font-weight: bold;
    color: #000000;
    margin: 12px 0;
  `,
  input: css`
    all: unset;
    width: 100%;
    box-sizing: border-box;
    background: rgba(217, 217, 217, 0.2);
    border-radius: 10px;
    padding: 7px 16px;
    font-size: 14px;
  `,
  flexWeight: (weight: number) => css`
    flex: ${weight};
  `,
  addBtn: css`
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  `,
};

function NewMyProblem() {
  const contentEditorRef = React.useRef<Editor>(null);
  const inputEditorRef = React.useRef<Editor>(null);
  const outputEditorRef = React.useRef<Editor>(null);
  const limitEditorRef = React.useRef<Editor>(null);
  const exampleEditorRef = React.useRef<Editor>(null);

  const [title, setTitle] = React.useState<string>('');
  const [timeLimit, setTimeLimit] = React.useState<number>(100);

  const [examples, setExamples] = useIOList();

  const handleAddClick = () => {
    setExamples((array) => [...array, { input: '', output: '' }]);
  };

  return (
    <div css={style.container}>
      <div css={style.title}>문제 추가</div>
      <div css={style.labelWrapper}>
        <div css={style.flexWeight(4)}>
          <div css={style.label}>제목</div>
          <input
            css={style.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div css={style.flexWeight(1)}>
          <div css={style.label}>시간 제한(ms)</div>
          <input
            css={style.input}
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          ></input>
        </div>
        <div css={style.flexWeight(1)}>
          <div css={style.label}>메모리 제한(MB)</div>
          <input
            css={style.input}
            value={512}
            contentEditable={false}
            disabled
          ></input>
        </div>
      </div>
      <div css={style.label}>본문</div>
      <EditorWithForwardedRef ref={contentEditorRef} />
      <div css={style.label}>입력</div>
      <EditorWithForwardedRef ref={inputEditorRef} />
      <div css={style.label}>출력</div>
      <EditorWithForwardedRef ref={outputEditorRef} />
      <div css={style.label}>제한</div>
      <EditorWithForwardedRef ref={limitEditorRef} />
      <div css={style.addBtn}>
        <Button onClick={handleAddClick}>+ 예제 추가</Button>
      </div>

      <div
        css={css`
          & > div {
            border: none;
            min-height: 0;
          }
        `}
      >
        <IOList arr={examples} setArr={setExamples} />
      </div>
      <div css={style.label}>예제 설명</div>
      <EditorWithForwardedRef ref={exampleEditorRef} />
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin: 20px 0;
        `}
      >
        <Button
          onClick={() => {
            Router.back();
          }}
        >
          취소
        </Button>
        <Button
          onClick={async () => {
            const result = await axiosInstance.post('/api/problems', {
              title: title,
              timeLimit: timeLimit,
              memoryLimit: 512,
              content: contentEditorRef.current?.getInstance().getMarkdown(),
              input: inputEditorRef.current?.getInstance().getMarkdown(),
              output: outputEditorRef.current?.getInstance().getMarkdown(),
              limit: limitEditorRef.current?.getInstance().getMarkdown(),
              example: exampleEditorRef.current?.getInstance().getMarkdown(),
              examples: examples,
            });
            if (result.status === 201) {
              Router.push('/my-problem');
            } else {
              // 에러처리
            }
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

export default NewMyProblem;
