import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axiosInstance from '../../axios';

function OAuthPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const code = router.query.code ?? '';

    (async () => {
      const result = await axiosInstance.get(`/api/github-login?code=${code}`);

      if (result.status !== 200) {
        alert('로그인 실패');
      }

      router.replace('/');
    })();
  }, [router.isReady]);

  return <></>;
}

export default OAuthPage;
