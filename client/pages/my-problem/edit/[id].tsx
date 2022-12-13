import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import Button from '../../../components/common/Button';
import Router, { useRouter } from 'next/router';
import axiosInstance from '../../../axios';
import IOList, { useIOList } from '../../../components/common/IOList';
import style from '../../../styles/style';
import axios from 'axios';
import Head from 'next/head';

const WrappedEditor = dynamic(
  () => import('../../../components/Editor/wrapperEditor'),
  {
    ssr: false,
  },
);

const EditorWithForwardedRef = React.forwardRef(
  (props: EditorProps, ref: React.LegacyRef<Editor>) => (
    <WrappedEditor {...props} forwardedRef={ref} />
  ),
);

EditorWithForwardedRef.displayName = 'EditorWithForwardedRef';

function NewMyProblem() {
  const contentEditorRef = React.useRef<Editor>(null);
  const inputEditorRef = React.useRef<Editor>(null);
  const outputEditorRef = React.useRef<Editor>(null);
  const limitEditorRef = React.useRef<Editor>(null);
  const exampleEditorRef = React.useRef<Editor>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = React.useState<string>('');
  const [timeLimit, setTimeLimit] = React.useState<number>(100);
  const [problem, setProblem] = React.useState<any>();
  const [loadedEditorCount, setLoadedEditorCount] = React.useState(0);

  const [examples, setExamples] = useIOList();

  const handleAddClick = () => {
    setExamples((array) => [...array, { input: '', output: '' }]);
  };

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(parseInt(e.target.value))) {
      setTimeLimit(parseInt(e.target.value));
    } else {
      setTimeLimit(0);
    }
  };

  const handleSubmit = async () => {
    const id = router.query.id;

    let _id = 1;
    if (!id) _id = 1;
    else if (Array.isArray(id)) _id = 1;
    else _id = +id;

    try {
      const result = await axiosInstance.patch(`/api/problems/${_id}`, {
        title: title,
        timeLimit: timeLimit,
        memoryLimit: 512,
        content: contentEditorRef.current?.getInstance().getMarkdown(),
        input: inputEditorRef.current?.getInstance().getMarkdown(),
        output: outputEditorRef.current?.getInstance().getMarkdown(),
        limitExplanation: limitEditorRef.current?.getInstance().getMarkdown(),
        explanation: exampleEditorRef.current?.getInstance().getMarkdown(),
        examples: examples,
      });

      Router.push('/my-problem');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          if (Array.isArray(error.response.data.message)) {
            alert(error.response.data.message.join('\n'));
          } else {
            alert(error.response.data.message);
          }
        } else {
          alert('에러가 발생했습니다.');
        }

        const status = error.response?.status;
        if ([401, 403, 404].find((v) => v === status)) {
          router.back();
        }
      }
    }
  };

  const handleEditorLoad = () => {
    setLoadedEditorCount((count) => count + 1);
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
      try {
        const { data } = await axiosInstance.get(`/api/problems/${_id}`);

        setTitle(data.title);
        setTimeLimit(data.timeLimit);

        setProblem(data);
        setExamples(data.examples);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) router.back();
          if (error.response?.status === 404) router.back();
        }
      }
    }

    fetchProblem();
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (!problem) return;

    contentEditorRef.current?.getInstance().setMarkdown(problem.content, false);
    inputEditorRef.current?.getInstance().setMarkdown(problem.input, false);
    outputEditorRef.current?.getInstance().setMarkdown(problem.output, false);
    limitEditorRef.current
      ?.getInstance()
      .setMarkdown(problem.limitExplanation, false);
    exampleEditorRef.current
      ?.getInstance()
      .setMarkdown(problem.explanation, false);

    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [problem, loadedEditorCount]);

  return (
    <>
      <Head>
        <title>MOJ | 문제 수정</title>
      </Head>
      <div css={style.relativeContainer}>
        <div css={style.title}>문제 편집</div>
        <div css={style.labelWrapper}>
          <div css={style.flexWeight(4)}>
            <div css={style.label}>제목</div>
            <input
              css={style.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleRef}
            ></input>
          </div>
          <div css={style.flexWeight(1)}>
            <div css={style.label}>시간 제한(ms)</div>
            <input
              css={style.input}
              value={timeLimit}
              onChange={handleTimeLimitChange}
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
        <EditorWithForwardedRef
          ref={contentEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>입력</div>
        <EditorWithForwardedRef
          ref={inputEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>출력</div>
        <EditorWithForwardedRef
          ref={outputEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>제한</div>
        <EditorWithForwardedRef
          ref={limitEditorRef}
          onLoad={handleEditorLoad}
        />
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
        <EditorWithForwardedRef
          ref={exampleEditorRef}
          onLoad={handleEditorLoad}
        />
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
    </>
  );
}

export default NewMyProblem;
