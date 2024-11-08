'use client'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import React, { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { Edit, Search } from 'lucide-react'
import Link from 'next/link'
import SwitchActiveCollaborator from './switch-active-collaborator'
import { formatCPF } from '@/lib/cpf'

const fuseOptions = {
    keys: ['complete'],
    isCaseSensitive: true,
    threshold: 0.4,
    includeMatches: true,
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
}

const ListCollaborators = ({ collaborators }: {
    collaborators: GetCollaboratorsInterface['collaborators'][]
}) => {

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCollaborators, setFilteredCollaborators] = useState<GetCollaboratorsInterface['collaborators'][]>(collaborators)


    // find collaborators by search term
    useEffect(() => {
        const fuse = new Fuse(collaborators.map(collaborator => ({
            id: collaborator.id,
            name: collaborator.name,
            cpf: collaborator.cpf,
            department: collaborator.department,
            complete: `${collaborator.name} ${collaborator.cpf} ${collaborator.department}`
        })), fuseOptions)

        if (searchTerm) {
            const result = fuse.search(searchTerm).map(result => result.item);

            setFilteredCollaborators(result.map((collaborator) => collaborators.find(p => p.id === collaborator.id) as GetCollaboratorsInterface['collaborators']));
        } else {
            setFilteredCollaborators(collaborators);
        }
    }, [searchTerm, collaborators])
    return (
        <div className='bg-panelWhite p-7 rounded-xl shadow-2xl my-5'>

            <div className='flex items-center max-w-96 border-b-2 mb-2'>
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    type='text' placeholder='Buscar' className='w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent ' />
                <Search className='mr-2' />
            </div>
            <div className='lg:max-h-[calc(100vh-300px)] max-h-screen overflow-auto'>
                <Table>
                    <TableCaption>Lista de Colaboradores</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ativo</TableHead>
                            <TableHead>Editar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredCollaborators.map(collaborator => (
                                <TableRow key={collaborator.id}>
                                    <TableCell>{collaborator.name}</TableCell>
                                    <TableCell>{formatCPF(collaborator.cpf)}</TableCell>
                                    <TableCell>{collaborator.department}</TableCell>
                                    <TableCell>{collaborator.type}</TableCell>
                                    <TableCell><SwitchActiveCollaborator collaborator={collaborator} /></TableCell>
                                    <TableCell>
                                        <Link href={`/panel/collaborators/${collaborator.id}`}>
                                            <Button size='sm' variant='outline' className='bg-orange-200 text-orange-800'><Edit /> Editar</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ListCollaborators