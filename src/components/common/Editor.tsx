import React, { useCallback, useRef, useState } from 'react';
import { Editor, EditorState, convertToRaw, RichUtils } from 'draft-js';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import styles from '../styles/RichEditor.module.scss'
import 'draft-js/dist/Draft.css';

interface DraftEditorFormProps {
  name: string;
  control: Control<any>;
  required?: boolean;
  errors?: FieldErrors<any>;
}

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

const DraftEditorForm: React.FC<DraftEditorFormProps> = ({ name, control, required = false, errors }) => {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editorRef = useRef()

  const applyInlineStyle = useCallback(
    (style: string) => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    },
    [editorState]
  );

  const applyBlockStyle = useCallback(
    (blockType: string) => {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    },
    [editorState]
  );

  const isInlineStyleActive = useCallback(
    (style: string) => {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    },
    [editorState]
  );

  const isBlockStyleActive = useCallback(
    (blockType: string) => {
      const selection = editorState.getSelection();
      const block = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey());
      return block.getType() === blockType;
    },
    [editorState]
  );

  return (
    <div>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          validate: () => {
            return (
              !!editorState.getCurrentContent().hasText() || (required && 'This field is required')
            );
          },
        }}
        render={({ field: { onChange } }) => (
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
              onClick={() => { editorRef.current.focus() }}
              className={styles.editor}>
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={(state) => {

                  setEditorState(state);
                  // Extract raw content instead of plain text
                  const rawContent = convertToRaw(state.getCurrentContent());
                  onChange(rawContent); // Pass raw content to React Hook Form
                  console.log(rawContent)
                }}
              />
            </div>
          </div>

        )}
      />
      {/* Show error message if the field is required and empty */}
      {errors && errors[name] && <p style={{ color: 'red' }}>{errors[name]?.message}</p>}
    </div>
  );
};

export default DraftEditorForm;
