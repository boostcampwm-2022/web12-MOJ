import { Global, css } from '@emotion/react';
import type { AppProps } from 'next/app';
import GNB from '../components/GNB';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global
        styles={css`
          body,
          html {
            margin: 0;
            // 너 고정.
            height: 100%;
          }

          #__next {
            height: 100%;
          }
        `}
      />
      <GNB />
      <Component {...pageProps} />
    </>
  );
}
