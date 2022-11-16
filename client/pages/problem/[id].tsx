import { css } from '@emotion/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import CodeContainer from '../../components/Problem/CodeContainer';
import ProblemContainer from '../../components/Problem/ProblemContainer';
import {
  codeContainerStyle,
  controlPanelStyle,
  problemDetailStyle,
  problemViewerStyle,
} from './styles';

function ProblemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [problem, setProblem] = useState<Problem>();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const result = await (await axios(`/api/problem/${id}`)).data;
        setProblem(result);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  return (
    <div css={problemDetailStyle}>
      <div css={problemViewerStyle}>
        {problem && <ProblemContainer problem={problem} />}
      </div>
      <div
        css={css`
          width: 50%;
        `}
      >
        <div css={codeContainerStyle}>
          <CodeContainer setCode={setCode} />
        </div>
        <div css={controlPanelStyle}>
          <Button>제출</Button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
