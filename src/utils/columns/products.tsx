import Chip from "@/components/common/Chip/Chip";
import { ProductInterface } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

export const columns = [
    {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (_text: string, record: ProductInterface) => (
            <Image
                width={80}
                height={80}
                style={{
                    objectFit: 'contain'
                }}
                src={record.images[0]}
                alt=''
            />
        )
    },
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Precio',
        dataIndex: 'price',
        key: 'price',
        render: (_text: string, record: ProductInterface) => record.price ? <>{`${record.price} MXN`}</> : 'N/A',
    },
    {
        title: 'Colleciones',
        dataIndex: 'collections',
        key: 'collections',
        render: (text: string, record: ProductInterface) => record.collections.length
    },
    {
        title: 'Estado',
        dataIndex: 'active',
        key: 'active',
        render: (_text: string, record: ProductInterface) => <div className='d-flex flex-column align-start'>
            {
                record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
            }
        </div>
    }
]