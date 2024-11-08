
import React from 'react'
import ReturnProduct from './return-product'
import getCollaborators from '@/core/server/collaborator/getCollaborators'

const ReturnPage = async () => {
  const collaborators = await (await getCollaborators()).collaborators
  
  return (
    <div className='px-10 py-5'>
      <ReturnProduct collaborators={collaborators} />
    </div>
  )
}

export default ReturnPage