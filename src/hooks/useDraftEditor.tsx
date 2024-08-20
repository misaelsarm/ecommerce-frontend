import { useState, useCallback } from 'react';
import { EditorState, RichUtils } from 'draft-js';

export const useDraftEditor = () => {
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = useCallback(
    (newState: EditorState) => {
      setEditorState(newState);
    },
    [setEditorState]
  );

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

  return {
    editorState,
    handleEditorChange,
    applyInlineStyle,
    applyBlockStyle,
    isInlineStyleActive,
    isBlockStyleActive,
  };
};
