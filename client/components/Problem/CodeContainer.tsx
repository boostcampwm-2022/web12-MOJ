import { useState, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { css } from '@emotion/react';

const CodeContainer = () => {
  const [code, setCode] = useState('');

  const handleChange = (newCode: string | undefined) => {
    if (!newCode) return;
    setCode(newCode);
  };

  const heightStyle = (height: string) => css`
    height: ${height};
  `;

  const languageHeaderStyle = css`
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-weight: bold;
  `;

  const defaultCode = `# print('Hello World!')\n`;

  return (
    <div css={heightStyle('100%')}>
      <div css={[heightStyle('40px'), languageHeaderStyle]}>Python</div>
      <div css={heightStyle('calc(100% - 40px)')}>
        <Editor
          defaultLanguage="python"
          defaultValue={defaultCode}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CodeContainer;
