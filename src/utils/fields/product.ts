const formConfig = [
    {
      type: 'Input',
      props: {
        register,
        name: 'name',
        errors,
        label: 'Nombre del producto',
        required: true,
      },
    },
    {
      type: 'TextArea',
      props: {
        register,
        name: 'description',
        errors,
        label: 'Descripción del producto',
        required: true,
      },
    },
    {
      type: 'Input',
      props: {
        register,
        label: 'Palabras clave',
        name: 'keywords',
      },
    },
    {
      type: 'Input',
      props: {
        type: 'number',
        register,
        name: 'price',
        errors,
        label: 'Precio',
        required: true,
      },
    },
    {
      type: 'Select',
      props: {
        control,
        errors,
        required: true,
        options: collections,
        name: 'collections',
        label: 'Colecciones',
        isMulti: true,
      },
    },
    // Additional fields can be added here
  ];
  