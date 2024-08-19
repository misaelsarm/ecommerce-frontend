import React, { useRef } from 'react';
import { Editor, convertToRaw } from 'draft-js';
import styles from '@/styles/MyEditorComponent.module.css';
import { useDraftEditor } from '@/hooks/useDraftEditor';

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const MyEditorComponent = () => {
  const {
    editorState,
    handleEditorChange,
    applyInlineStyle,
    applyBlockStyle,
    isInlineStyleActive,
    isBlockStyleActive,
  } = useDraftEditor();

  const editorRef = useRef()

  return (
    <div>
      <div className={styles.toolbar}>
        {INLINE_STYLES.map((type) => (
          <button
            key={type.style}
            className={`${styles.button} ${isInlineStyleActive(type.style) ? styles.activeButton : ''
              }`}
            onClick={() => applyInlineStyle(type.style)}
          >
            {type.label}
          </button>
        ))}
        {BLOCK_TYPES.map((type) => (
          <button
            key={type.style}
            className={`${styles.button} ${isBlockStyleActive(type.style) ? styles.activeButton : ''
              }`}
            onClick={() => applyBlockStyle(type.style)}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div 
      onClick={()=>{editorRef.current.focus()}}
      className={styles.editor}>
        <Editor ref={editorRef} editorState={editorState} onChange={handleEditorChange} />
      </div>

      <button onClick={() => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        const jsonContent = JSON.stringify(rawContent);

        console.log({ jsonContent })
      }}>Show content</button>
    </div>
  );
};

export default MyEditorComponent;
