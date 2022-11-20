import { css } from '@emotion/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button';
import IOList, { useIOList } from '../../../components/common/IOList';
import style from '../../../styles/style';

function Testcase() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<string>('');
  const [testcase, setTestCase] = useIOList();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const result = await (await axios(`/api/problems/${id}/tc`)).data;
        setTitle(result.title);
        setTestCase(result.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleAddClick = () => {
    setTestCase((array) => [...array, { input: '', output: '' }]);
  };

  const handleSaveClick = async () => {
    try {
      testcase.forEach((val) => {
        if (val.input === '' || val.output === '') {
          alert('빈칸 있음 채우셈');
          throw new Error('빈칸..');
        }
      });
      await axios.post(`/api/problems/${id}/tc`, testcase);
      router.push('/my-problem');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelClick = () => {
    router.push('/my-problem');
  };

  return (
    <div css={style.container}>
      <div css={style.header}>
        <div css={style.titleContainer}>
          <span css={style.title}>테스트 케이스 편집</span>
          <span css={style.problemTitle}>{title}</span>
        </div>
        <Button minWidth="60px" onClick={handleAddClick}>
          + 추가
        </Button>
      </div>
      <IOList arr={testcase} setArr={setTestCase} />
      <div css={style.footer}>
        <Button style="cancel" minWidth="60px" onClick={handleCancelClick}>
          취소
        </Button>
        <Button minWidth="60px" onClick={handleSaveClick}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default Testcase;
