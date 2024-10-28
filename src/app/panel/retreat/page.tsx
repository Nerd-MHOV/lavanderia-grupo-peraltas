import React from 'react'
import FormRetreat from './form-retreat'
import getCollaborators from '@/core/server/collaborator/getCollaborators';
import getProducts from '@/core/server/product/getProducts';

const Retreat = async () => {
  const collaborators = (await getCollaborators()).collaborators;
  const products = (await getProducts()).products;
  return (
    <div>
      <FormRetreat 
        collaborators={collaborators}
        products={products}
      />
    </div>
  )
}

export default Retreat