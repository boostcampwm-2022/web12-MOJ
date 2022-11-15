import { Global, css } from '@emotion/react';
import type { AppProps } from 'next/app';
import GNB from '../components/GNB';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <GNB />
      <Component {...pageProps} />
    </>
  );
}
