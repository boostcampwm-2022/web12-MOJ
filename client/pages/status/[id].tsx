import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { css } from '@emotion/react';
import Editor from '@monaco-editor/react';
import StatusList from '../../components/status/StatusList';
import style from '../../styles/style';

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
          <div css={style.codeBox}>
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
      <div css={style.footer}>
        <Button>복사</Button>
      </div>
    </div>
  );
}

export default StatusDetail;
