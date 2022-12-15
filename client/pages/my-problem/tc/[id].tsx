import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../axios';
import Button from '../../../components/common/Button';
import IOList, { useIOList } from '../../../components/common/IOList';
import style from '../../../styles/style';
import Head from 'next/head';

function Testcase() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<string>('');
  const [testcase, setTestCase] = useIOList();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const result = await (
          await axiosInstance(`/api/problems/${id}/tc`)
        ).data;
        setTitle(result.title);
        setTestCase(result.testCases);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data.message);
          router.back();
        }
      }
    })();
  }, [id]);

  const handleAddClick = () => {
    setTestCase((array) => [...array, { input: '', output: '' }]);
  };

  const handleSaveClick = async () => {
    try {
      const testcases = testcase.map((val) => {
        if (val.output === '') {
          alert('Testcase는 비워둘 수 없습니다.');
          throw new Error('TC is empty');
        }
        return { output: val.output, input: val.input };
      });
      await axiosInstance.post(`/api/problems/${id}/tc`, {
        testcase: testcases,
      });
      router.push('/my-problem');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      }
    }
  };

  const handleCancelClick = () => {
    router.push('/my-problem');
  };

  return (
    <>
      <Head>
        <title>MOJ | 테스트케이스 등록</title>
      </Head>
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
    </>
  );
}

export default Testcase;
