import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import CodeContainer from '../../components/Problem/CodeContainer';
import style from '../../styles/style';

import dynamic from 'next/dynamic';
import axiosInstance from '../../axios';
import axios from 'axios';

const ProblemContainer = dynamic(
  () => import('../../components/Problem/ProblemContainer'),
  { ssr: false },
);

function ProblemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [problem, setProblem] = useState<Problem>();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const result = await (await axiosInstance(`/api/problems/${id}`)).data;
        setProblem(result);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) router.back();
          if (error.response?.status === 404) router.back();
        }
      }
    })();
  }, [id]);

  const handleSubmission = async () => {
    try {
      await axiosInstance.post(`/api/problems/${id}/submissions`, {
        language: 'python',
        code,
      });
      router.push('/status');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div css={style.problemDetail}>
      <div css={style.problemViewer}>
        {problem && <ProblemContainer problem={problem} />}
      </div>
      <div
        css={css`
          width: 50%;
        `}
      >
        <div css={style.codeContainer}>
          <CodeContainer setCode={setCode} />
        </div>
        <div css={style.controlPanel}>
          <Button minWidth="60px" onClick={handleSubmission}>
            제출
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
