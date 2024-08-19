import React from 'react';
import { Editor } from 'draft-js';
import styles from '@/styles/MyEditorComponent.module.scss'; // Assuming you're using CSS modules
import { useDraftEditor } from '@/hooks/useDraftEditor';

const MyEditorComponent = () => {
  const {
    editorState,
    handleEditorChange,
    applyInlineStyle,
    applyBlockStyle,
    isInlineStyleActive,
    isBlockStyleActive,
  } = useDraftEditor();

  return (
    <div>
      <div>
        <button
          className={isInlineStyleActive('BOLD') ? `${styles.activeButton} ${styles.editorButton}` : styles.editorButton}
          onClick={() => applyInlineStyle('BOLD')}
        >
          Bold
        </button>
        <button
          className={isInlineStyleActive('ITALIC') ? `${styles.activeButton} ${styles.editorButton}` : styles.editorButton}
          onClick={() => applyInlineStyle('ITALIC')}
        >
          Italic
        </button>
        <button
          className={isBlockStyleActive('header-one') ? `${styles.activeButton} ${styles.editorButton}` : styles.editorButton}
          onClick={() => applyBlockStyle('header-one')}
        >
          Header
        </button>
      </div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default MyEditorComponent;
