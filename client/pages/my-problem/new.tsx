import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import Button from '../../components/common/Button';
import Router from 'next/router';
import axiosInstance from '../../axios';
import IOList, { useIOList } from '../../components/common/IOList';
import style from '../../styles/style';
import axios from 'axios';
import Head from 'next/head';

const WrappedEditor = dynamic(
  () => import('../../components/Editor/wrapperEditor'),
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
    try {
      const result = await axiosInstance.post('/api/problems', {
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
      if (result.status === 201) {
        Router.push('/my-problem');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) alert(error.response.data.message);
        if (error.response?.status === 401) {
          alert('???????????? ????????? ??????????????????.');
          Router.back();
        }
        if (error.response?.status === 429) {
          alert('?????? ?????? ????????? ???????????????. ?????? ??? ?????? ??????????????????.');
        }
      }
    }
  };

  const handleEditorLoad = () => {
    setLoadedEditorCount((count) => count + 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [loadedEditorCount]);

  return (
    <>
      <Head>
        <title>MOJ | ?????? ??????</title>
      </Head>
      <div css={style.relativeContainer}>
        <div css={style.title}>?????? ??????</div>
        <div css={style.labelWrapper}>
          <div css={style.flexWeight(4)}>
            <div css={style.label}>??????</div>
            <input
              css={style.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleRef}
            ></input>
          </div>
          <div css={style.flexWeight(1)}>
            <div css={style.label}>?????? ??????(ms)</div>
            <input
              css={style.input}
              value={timeLimit}
              onChange={handleTimeLimitChange}
            ></input>
          </div>
          <div css={style.flexWeight(1)}>
            <div css={style.label}>????????? ??????(MB)</div>
            <input
              css={style.input}
              value={512}
              contentEditable={false}
              disabled
            ></input>
          </div>
        </div>
        <div css={style.label}>??????</div>
        <EditorWithForwardedRef
          ref={contentEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>??????</div>
        <EditorWithForwardedRef
          ref={inputEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>??????</div>
        <EditorWithForwardedRef
          ref={outputEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.label}>??????</div>
        <EditorWithForwardedRef
          ref={limitEditorRef}
          onLoad={handleEditorLoad}
        />
        <div css={style.addBtn}>
          <Button minWidth="60px" onClick={handleAddClick}>
            + ?????? ??????
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
        <div css={style.label}>?????? ??????</div>
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
            ??????
          </Button>
          <Button minWidth="60px" onClick={handleSubmit}>
            ??????
          </Button>
        </div>
      </div>
    </>
  );
}

export default NewMyProblem;
