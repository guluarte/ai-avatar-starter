import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="AI Avatar Generator" key="title" />
        <meta
          property="og:description"
          content="build with buildspace"
          key="description"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
