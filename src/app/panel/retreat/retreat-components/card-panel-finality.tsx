'use client'
import { CardPanel } from '@/components/interface/CardPanel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Split } from 'lucide-react'
import React from 'react'


interface CardPanelFinalityProps {
  disabled: boolean
}

const CardPanelFinality = ({ disabled }: CardPanelFinalityProps) => {
  const [value, setValue] = React.useState<string>('collaborator');
  return (
    <CardPanel title='Finalidade' Icon={Split}>
      <Select disabled={disabled} value={value} onValueChange={(e) => setValue(e)}>
        <SelectTrigger className='w-full focus-visible:ring-0 bg-transparent'>
          <SelectValue placeholder='finalidade' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='collaborator' >Colaborador</SelectItem>
          <SelectItem value='sector'>Setor</SelectItem>
        </SelectContent>
      </Select>
      <input type='hidden' name='finality' value={JSON.stringify(value)} />
    </CardPanel>
  )
}

export default CardPanelFinality