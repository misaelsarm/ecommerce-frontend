import React, { useRef, useState } from 'react';
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
import imageCompression from 'browser-image-compression';
import { makeRequest } from '@/utils/makeRequest';
import toast, { LoaderIcon } from 'react-hot-toast';

interface Props {
  items: string[],
  setItems: any,
  label: string
  uploading: boolean
  folder?: string
  setUploading: (uploading: boolean) => void
}

export const Sortable = ({ items, setItems, label, uploading, setUploading, folder }: Props) => {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = (e: any) => {
    console.log('click')
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }
    setUploading(true)
    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 1500,
      useWebWorker: true,
    }
    let compressedBlob
    let compressedFile

    const formData = new FormData()

    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      try {
        compressedBlob = await imageCompression(file, options);
        compressedFile = new File([compressedBlob], compressedBlob.name)
      } catch (error) {
      }
      //@ts-ignore
      formData.append('files', compressedFile)
    }
    //@ts-ignore
    formData.append('folder', folder)

    try {
      const data = await makeRequest('post', '/api/files/multiple', formData)
      toast.success('Imagen cargada')
      //@ts-ignore
      let images = data.map((image) => image.Location);
      //@ts-ignore
      setItems((prev) => [...prev, ...images])
      setUploading(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setUploading(false)
    }
  }

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
        <input
          accept='image/*'
          multiple
          onChange={handleFileUpload}
          
          ref={fileInputRef}
          type='file'
          style={{
            display: 'none'
          }}
        />
        {
          items.length > 0 && <h3 className='block mb-20'>Puedes arrastrar y ordenar las imagenes.</h3>
        }
        {
          (items.length === 0 && !uploading) &&
          <div className='sortable-dropzone'>
            <button onClick={handleClick} className='btn btn-black'>Agregar fotos</button>
          </div>
        }
        {
          uploading &&
          <div className='sortable-loading'>
            <h2>Cargando imagenes...</h2>
            <LoaderIcon style={{
              width: 30,
              height: 30
            }} />
          </div>
        }
        <div className='sortable-grid'>
          {items.map((id, index) => <SortableItem index={index} items={items} setItems={setItems} key={id} id={id} />)}
          {
            items.length > 0 &&
            <div onClick={handleClick} className='sortable-add'>
              <span>  Agregar</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          }
        </div>
        {
          uploading && items.length >= 5 &&
          <div className='sortable-loading'>
            <h2>Cargando imagenes...</h2>
            <LoaderIcon style={{
              width: 30,
              height: 30
            }} />
          </div>
        }
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