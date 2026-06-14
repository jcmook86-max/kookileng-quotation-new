import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 이 사이트는 '밝은 화면 전용' — 휴대폰 다크모드가 글자를 흰색으로 뒤집는 것 방지 */}
        <meta name="color-scheme" content="light" />
        <style>{`
          :root { color-scheme: light; }
          html, body {
            background-color: #ffffff;
            color: #222222;                /* 기본 글자색 = 진한 회색(항상 보이게) */
            -webkit-text-size-adjust: 100%; /* 모바일에서 글자 크기 멋대로 키우는 것 방지 */
          }
          /* 입력칸/선택칸: 흰 배경 + 진한 글자 강제 (다크모드에서도 또렷하게) */
          input, select, textarea {
            color: #222222 !important;
            background-color: #ffffff !important;
          }
          input::placeholder, textarea::placeholder { color: #999999 !important; }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
