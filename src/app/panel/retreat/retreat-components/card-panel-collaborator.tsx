'use client'
import { FaceReader } from '@/hooks/useFaceReader';
import React, { useEffect } from 'react'
import CPFOnlyNumber from '@/lib/cpf_only_number';
import { CardPanel } from '@/components/interface/CardPanel';
import { UserSearch } from 'lucide-react';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '@/components/ui/select';

interface CardPanelCollaboratorProps {
  onSelect?: (collaborator: CardPanelCollaborators) => void
  disabled?: boolean
  collaborators: CardPanelCollaborators[]

  resultReader: FaceReader | null
  clear: () => void
}

export interface CardPanelCollaborators {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  cpf: string;
  isDiarist: boolean;
  active: boolean;
  department: string;
}


const CardPanelCollaborator = ({
  collaborators, disabled = false, onSelect = () => { }, resultReader, clear
}: CardPanelCollaboratorProps) => {
  const [value, setValue] = React.useState<CardPanelCollaborators | null>(collaborators[0]);

  const handleSelect = React.useCallback((selected: CardPanelCollaborators) => {
    setValue(selected);
    onSelect(selected);
  }, [onSelect]);

  useEffect(() => {
    if (resultReader) {
      const find = collaborators.find(
        (col) => CPFOnlyNumber(col.cpf) === CPFOnlyNumber(resultReader.id));
      if (find) { handleSelect(find) }
      clear()
    }
  }, [clear, collaborators, handleSelect, resultReader])

  return (
    <CardPanel title='Colaborador' Icon={UserSearch}>
      <Select disabled={disabled} value={value?.id} onValueChange={(e) => setValue(
        collaborators.find( (col) => col.id === e ) || null
      )}>
        <SelectTrigger className='w-full focus-visible:ring-0 bg-transparent'>
          <SelectValue placeholder='colaborador' />
        </SelectTrigger>
        <SelectContent>
          {collaborators.map((collaborator) => (
            <SelectItem value={collaborator.id} key={collaborator.id}>{collaborator.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      < input type='hidden' name='collaborator' value={JSON.stringify(value)} />
    </CardPanel>
  )
}

export default CardPanelCollaborator