import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { SortableItem } from './SortableItem';

interface Props {
  items: string[],
  setItems: any,
  label: string
  uploading: boolean
}

export const Sortable = ({ items, setItems, label, uploading }: Props) => {

  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint: {
        distance: 1
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={rectSortingStrategy}
      >
        <div>{label}</div>
        {
          items.length > 0 && <h3 className='block mb-20'>Puedes arrastrar y ordenar las imagenes.</h3>
        }
        {
          (items.length === 0 && !uploading) &&
          <div className='sortable-dropzone'>
            <input
              accept='image/*'
              multiple
              // onChange={handleFileUpload}
              // ref={fileInputRef}
              type='file'
            />
            <button /* onClick={handleClick} */ className='btn btn-black'>Cargar fotos</button>
          </div>
        }
        {
          uploading &&
          <div /* className={styles.dropZone} */>
            <h2>Cargando imagenes...</h2>
          </div>
        }
        <div className='sortable-grid'>
          {items.map((id, index) => <SortableItem index={index} items={items} setItems={setItems} key={id} id={id} />)}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any) {

    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items: any) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}