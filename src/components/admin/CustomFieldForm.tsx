import React, { useState } from 'react'
import { Button, Checkbox, Input, Select } from '../common'
import { v4 as uuidv4 } from "uuid";
import styles from '@/styles/CustomFieldForm.module.scss'

interface Field {

  id: string,
  label: string,
  key: string,
  required: boolean,
  options: any[],
  type: string
}

export const CustomFieldForm = () => {

  const [addedFields, setAddedFields] = useState<Field[]>([])

  const shouldRenderOptions = (index: number) => {

    const currentFieldType = addedFields[index].type

    return currentFieldType === 'select' ||
      currentFieldType === 'checkbox' ||
      currentFieldType === 'radio'
  }


  return (
    <>
      <div className={styles.form}>
        <h4>Campos personalizados</h4>
        {
          addedFields.map((field, index) => (
            <div key={field.id} className={styles.field}>
              <div className="d-flex">
                <div className="flex-grow-1 mr-20">
                  <Input
                    label="Nombre del campo"
                  />
                </div>
                <div className="flex-grow-1">
                  <Select
                    label="Tipo de campo"
                    //control={control}
                    options={[
                      {
                        label: 'Texto corto',
                        value: 'input-text'
                      },
                      {
                        label: 'Texto largo',
                        value: 'textarea'
                      },
                      {
                        label: 'Numerico',
                        value: 'input-number'
                      },
                      {
                        label: 'Casillas de verificación',
                        value: 'checkbox'
                      },
                      {
                        label: 'Opción multiple',
                        value: 'radio'
                      },
                      {
                        label: 'Lista desplegable',
                        value: 'select'
                      },
                    ]}
                    onChange={(e: any) => {
                      const fields = [...addedFields]
                      fields[index].type = e.value
                      setAddedFields(fields)
                    }}
                  />
                </div>
              </div>
              <Checkbox
                label="Requerido"
              />
              {
                shouldRenderOptions(index) &&
                <>
                  <div className={styles.options}>
                    <span>Opciones</span>
                    <div
                      onClick={() => {
                        const fields = [...addedFields]
                        fields[index].options.push({
                          id: uuidv4()
                        })
                        setAddedFields(fields)
                      }}
                      className={styles.iconBtn}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={styles.optionList}
                  >
                    {
                      addedFields[index].options.map((option, optionIndex) => (
                        <div className={styles.option}>
                          <span>
                            {optionIndex + 1}.
                          </span>
                          <Input />
                          <div

                            onClick={() => {
                              const fields = [...addedFields]
                              const currentField = fields[index]
                              const options = [...currentField.options]
                              const filteredOptions = options.filter(opt => opt.id !== option.id)
                              fields[index].options = filteredOptions
                              setAddedFields(fields)
                            }}
                            className={styles.iconBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </>
              }
              <div
                onClick={() => {
                  let fields = [...addedFields]
                  setAddedFields(fields.filter(item => item.id !== field.id))
                }}
                className={styles.iconBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
            </div>
          ))
        }
      </div>
      <Button
        onClick={() => {

          const newField: Field = {
            id: uuidv4(),
            key: '',
            label: '',
            type: '',
            required: false,
            options: []
          }

          setAddedFields([...addedFields, newField])

        }}
      >Agregar</Button>
    </>
  )
}
