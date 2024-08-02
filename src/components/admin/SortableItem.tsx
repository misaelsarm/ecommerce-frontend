import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id }: { id: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className='sortable-item'
      ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>
        {id}
      </div>
    </div>
  );
}