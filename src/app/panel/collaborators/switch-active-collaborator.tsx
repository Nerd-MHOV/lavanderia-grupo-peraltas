import { Switch } from '@/components/ui/switch'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import updateCollaborator from '@/core/server/collaborator/updateCollaborator'
import React from 'react'

const SwitchActiveCollaborator = ({ collaborator }: {
    collaborator: GetCollaboratorsInterface['collaborators']
}) => {
    return (
        <Switch 
            checked={collaborator.active}
            onCheckedChange={(checked) => {
                updateCollaborator({
                    ...collaborator,
                    active: checked,
                })

            }}
        />
    )
}

export default SwitchActiveCollaborator