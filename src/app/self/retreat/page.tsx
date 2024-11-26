import getCollaborators from '@/core/server/collaborator/getCollaborators'
import React from 'react'
import getProducts from '@/core/server/product/getProducts'
import FormRetreat from '@/app/panel/retreat/form-retreat'

const SelfRetreatPage = async () => {
  const collaborators = (await getCollaborators()).collaborators
  const products = (await getProducts()).products;
  return (
    <div className='max-w-screen-lg mx-auto py-10'>
      <FormRetreat
        collaborators={collaborators}
        products={products}
        onlyCanRetreat
      />
    </div>
  )
}

export default SelfRetreatPage