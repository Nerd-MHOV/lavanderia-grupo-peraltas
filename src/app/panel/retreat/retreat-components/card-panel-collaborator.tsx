'use client'
import { FaceReader } from '@/hooks/useFaceReader';
import React, { useEffect } from 'react'
import {CPFOnlyNumber} from '@/lib/cpf';
import { CardPanel } from '@/components/interface/CardPanel';
import { UserSearch } from 'lucide-react';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '@/components/ui/select';
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators';

interface CardPanelCollaboratorProps {
  onSelect?: (collaborator: GetCollaboratorsInterface['collaborators']) => void
  disabled?: boolean
  collaborators: GetCollaboratorsInterface['collaborators'][]

  resultReader: FaceReader | null
  clear: () => void
}


const CardPanelCollaborator = ({
  collaborators, disabled = false, onSelect = () => { }, resultReader, clear
}: CardPanelCollaboratorProps) => {
  const [value, setValue] = React.useState<GetCollaboratorsInterface['collaborators'] | null>(null);

  const handleSelect = React.useCallback((selected: GetCollaboratorsInterface['collaborators'] | null) => {
    setValue(selected);
    if (selected) onSelect(selected);
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
    <CardPanel noHover title='Colaborador' Icon={UserSearch}>
      <Select disabled={disabled} value={value?.id} onValueChange={(e) => handleSelect(
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