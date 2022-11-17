import React from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const WrappedEditor = (
  props: EditorProps & { forwardedRef: React.LegacyRef<Editor> },
) => {
  const { forwardedRef } = props;

  return (
    <Editor
      {...props}
      ref={forwardedRef}
      usageStatistics={false}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
    />
  );
};

export default WrappedEditor;
