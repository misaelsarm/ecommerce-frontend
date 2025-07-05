import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

interface Props {
  id: string,
  items: string[]
  setItems: any
  index: number
}

export function SortableItem({ id, index, items, setItems }: Props) {
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
      <div className='sortable-item-image'>
        <Image alt='' fill src={id} />
        <button
          onClick={(e) => {
            console.log('click')
            const newImages = [...items]
            newImages.splice(index, 1)
            setItems(items.filter(picture => picture !== id))
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}