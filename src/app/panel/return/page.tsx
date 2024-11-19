
import React from 'react'
import ReturnProduct from './return-product'
import getCollaborators from '@/core/server/collaborator/getCollaborators'
import getOutputs from '@/core/server/outputs/getOutputs'

const ReturnPage = async () => {
  const collaborators =  (await getCollaborators()).collaborators
  const outputs =  ( await getOutputs() ).outputs  
  return (
    <div className='px-10 py-5'>
      <ReturnProduct collaborators={collaborators} outputs={outputs} />
    </div>
  )
}

export default ReturnPage