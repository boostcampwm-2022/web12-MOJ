import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import { css } from '@emotion/react';
import React, { forwardRef, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Router, { useRouter } from 'next/router';
import axiosInstance from '../../../axios';
import IOList, { useIOList } from '../../../components/common/IOList';
import style from '../../../styles/style';

const WrappedEditor = dynamic(
  () => import('../../../components/Editor/wrapperEditor'),
  {
    ssr: false,
  },
);

const EditorWithForwardedRef = React.forwardRef(
  (props, ref: React.LegacyRef<Editor>) => (
    <WrappedEditor {...props} forwardedRef={ref} />
  ),
);

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

  const handleSubmit = async () => {
    const id = router.query.id;

    let _id = 1;
    if (!id) _id = 1;
    else if (Array.isArray(id)) _id = 1;
    else _id = +id;

    const result = await axiosInstance.put(`/api/problems/${_id}`, {
      title: title,
      timeLimit: timeLimit,
      memoryLimit: 512,
      content: contentEditorRef.current?.getInstance().getMarkdown(),
      input: inputEditorRef.current?.getInstance().getMarkdown(),
      output: outputEditorRef.current?.getInstance().getMarkdown(),
      limit: limitEditorRef.current?.getInstance().getMarkdown(),
      explanation: exampleEditorRef.current?.getInstance().getMarkdown(),
      examples: examples,
    });
    if (result.status === 200) {
      Router.push('/my-problem');
    } else {
      // 에러처리
    }
  };

  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchProblem() {
      const id = router.query.id;

      let _id = 1;
      if (!id) _id = 1;
      else if (Array.isArray(id)) _id = 1;
      else _id = +id;

      const { data } = await axiosInstance.get(`/api/problems/${_id}`);

      setTitle(data.title);
      setTimeLimit(data.timeLimit);
      contentEditorRef.current?.getInstance().setMarkdown(data.content);
      inputEditorRef.current?.getInstance().setMarkdown(data.io.input);
      outputEditorRef.current?.getInstance().setMarkdown(data.io.output);
      limitEditorRef.current?.getInstance().setMarkdown(data.limitExplain);
      exampleEditorRef.current?.getInstance().setMarkdown(data.ioExplain);

      setExamples(data.ioExample);
    }

    fetchProblem();
  }, [router.isReady, router.query.id]);

  return (
    <div css={style.relativeContainer}>
      <div css={style.title}>문제 편집</div>
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
        <Button minWidth="60px" onClick={handleAddClick}>
          + 예제 추가
        </Button>
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
      <div css={style.footer}>
        <Button
          style="cancel"
          minWidth="60px"
          onClick={() => {
            Router.back();
          }}
        >
          취소
        </Button>
        <Button minWidth="60px" onClick={handleSubmit}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default NewMyProblem;
