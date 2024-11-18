import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import finalityProductTypeMap from '@/core/server/product/finalityProductTypeMap'
import { CircleMinus } from 'lucide-react'
import { OutputsQuantity } from './return-product'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import { Button } from '@/components/ui/button'


const TableReturnProducts = ({
    outputs,
    addOutputReturn,
    removeOutputReturn,
    outputToReturn,
    title,
}: {
    title: string,
    outputs: GetCollaboratorsInterface['collaborators']['Outputs'],
    outputToReturn: OutputsQuantity[],
    addOutputReturn: (output: OutputsQuantity) => void,
    removeOutputReturn: (output: OutputsQuantity) => void
}) => {
    return (
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className='text-end'>Devolver</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    outputs.map(output => {
                        const prodFind = outputToReturn.find((p) => p.id === output.id)
                        return (
                            <TableRow key={output.id}>
                                <TableCell>{output.Product.product}</TableCell>
                                <TableCell>{output.Product.size}</TableCell>
                                <TableCell>{output.Product.service}</TableCell>
                                <TableCell>{output.Product.type}</TableCell>
                                <TableCell className='font-bold'>{output.amount} unidades</TableCell>
                                <TableCell className='flex justify-end'>{
                                    !prodFind ? (
                                        <Button
                                            className='bg-slate-200 hover:bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded'
                                            size='sm'
                                            onClick={() => addOutputReturn(output)}
                                        >Devolver</Button>
                                    ) : (
                                        <div className='flex gap-2 justify-between'>
                                            <Button
                                                className='bg-red-200 hover:bg-red-300 text-red-500 font-bold py-2 px-4 rounded'
                                                size='sm'
                                                onClick={() => removeOutputReturn(output)}
                                            ><CircleMinus /></Button>
                                            <Button
                                                className='bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-4 rounded'
                                                size='sm'
                                                onClick={() => addOutputReturn(output)}
                                            >Devolver: {prodFind?.quantity}</Button>
                                        </div>
                                    )
                                }</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}

export default TableReturnProducts