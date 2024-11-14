import { Product } from "@prisma/client";

export const ProductsSeed: {
    product: string,
    type: string,
    service: string,
    size: string,
    unitary_value: number,
    barcode?: string,
    finality: Product['finality']
}[] = [
    {
        product: 'Camiseta Amarela',
        type: 'Camiseta',
        service: 'Brotas Eco',
        size: 'P',
        unitary_value: 20.00,
        barcode: '00000005',
        finality: 'collaborator'
    },
    {
        product: 'Camiseta Amarela',
        type: 'Camiseta',
        service: 'Brotas Eco',
        size: 'M',
        unitary_value: 20.00,
        barcode: '00000004',
        finality: 'collaborator'
    },
    {
        product: 'Camiseta Amarela',
        type: 'Camiseta',
        service: 'Brotas Eco',
        size: 'G',
        unitary_value: 20.00,
        barcode: '00000003',
        finality: 'collaborator'
    },
    {
        product: 'Camiseta Amarela',
        type: 'Camiseta',
        service: 'Brotas Eco',
        size: 'GG',
        unitary_value: 20.00,
        barcode: '00000002',
        finality: 'collaborator'
    },
    {
        product: 'Bermuda Monitoria preta',
        type: 'Bermuda',
        service: 'Peraltas',
        size: 'P',
        unitary_value: 20.00,
        barcode: '00000001',
        finality: 'collaborator'
    },
    {
        product: 'Bermuda Monitoria preta',
        type: 'Bermuda',
        service: 'Peraltas',
        size: 'M',
        unitary_value: 20.00,
        finality: 'collaborator'

    },
    {
        product: 'Bermuda Monitoria preta',
        type: 'Bermuda',
        service: 'Peraltas',
        size: 'G',
        unitary_value: 20.00,
        finality: 'collaborator'
    },
    {
        product: 'Bermuda Monitoria Azul',
        type: 'Bermuda',
        service: 'Ceu',
        size: 'M',
        unitary_value: 20.00,
        finality: 'collaborator'
    },
];