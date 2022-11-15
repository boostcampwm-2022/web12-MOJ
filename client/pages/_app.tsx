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

          #__next {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        `}
      />
      <GNB />
      <Component {...pageProps} />
    </>
  );
}
