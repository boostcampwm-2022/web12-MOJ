import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import { css } from '@emotion/react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
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
        if (error.response?.status === 400)
          alert('입력 형식 및 빈 칸이 없는지 확인하세요.');
        if (error.response?.status === 401) {
          alert('로그인이 필요한 서비스입니다.');
          Router.back();
        }
        if (error.response?.status === 429) {
          alert('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
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
        <title>MOJ | 문제 추가</title>
      </Head>
      <div css={style.relativeContainer}>
        <div css={style.title}>문제 추가</div>
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
