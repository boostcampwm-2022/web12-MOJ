import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { css } from '@emotion/react';
import Editor from '@monaco-editor/react';
import StatusList from '../../components/status/StatusList';

const style = {
  container: css`
    margin: 64px 20%;
    height: 80vh;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 12px;
  `,
};

interface StatusSummary {
  id: number;
  user: string;
  title: string;
  result: number;
  time: string;
  datetime: number;
}

function StatusDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<StatusSummary | null>(null);

  useEffect(() => {
    (async () => {
      const res = await (await axios.get(`/api/submissions/${id}`)).data;
      setCode(res.code);
      setStatus(res.status);
    })();
  }, []);

  return (
    <div css={style.container}>
      <div css={style.title}>풀이 상세</div>
      {status === null ? (
        <div>로딩중</div>
      ) : (
        <>
          <StatusList status={status} />
          <div
            css={css`
              height: 80%;
              padding: 15px 0;
              border-radius: 8px;
              margin-top: 15px;
              box-shadow: 0px 0px 1.5px 1.5px rgba(0, 0, 0, 0.15);
            `}
          >
            <Editor
              defaultLanguage="python"
              defaultValue={code}
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
                scrollbar: {
                  vertical: 'hidden',
                  verticalScrollbarSize: 0,
                },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </>
      )}
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          padding: 10px 1px;
          width: 100%;
        `}
      >
        <Button>복사</Button>
      </div>
    </div>
  );
}

export default StatusDetail;
