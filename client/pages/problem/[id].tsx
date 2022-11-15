import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import Button from '../../components/common/Button';
import {
  codeContainerStyle,
  controlPanelStyle,
  problemDetailStyle,
  problemViewerStyle,
} from './styles';

function ProblemDetail() {
  const router = useRouter();

  return (
    <div css={problemDetailStyle}>
      <div css={problemViewerStyle}>문제 영역이요</div>
      <div
        css={css`
          width: 50%;
        `}
      >
        <div css={codeContainerStyle}>코드 영역이요</div>
        <div css={controlPanelStyle}>
          <Button>제출</Button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
