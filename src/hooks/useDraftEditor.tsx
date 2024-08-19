import { useState, useCallback } from 'react';
import { EditorState, RichUtils } from 'draft-js';

export const useDraftEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Handler for changing editor state
  const handleEditorChange = useCallback(
    (newState: EditorState) => {
      setEditorState(newState);
    },
    [setEditorState]
  );

  // Function to apply inline style (e.g., bold, italic)
  const applyInlineStyle = useCallback(
    (style: string) => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    },
    [editorState]
  );

  // Function to apply block style (e.g., header, blockquote)
  const applyBlockStyle = useCallback(
    (blockType: string) => {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    },
    [editorState]
  );

  // Function to check if an inline style is currently active
  const isInlineStyleActive = useCallback(
    (style: string) => {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    },
    [editorState]
  );

  // Function to check if a block style is currently active
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

  return {
    editorState,
    handleEditorChange,
    applyInlineStyle,
    applyBlockStyle,
    isInlineStyleActive,
    isBlockStyleActive,
  };
};
