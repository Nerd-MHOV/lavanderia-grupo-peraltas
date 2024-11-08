import React from 'react'
import DialogCreateCollaborator from './dialog-create-collaborator'
import DialogCreateDepartment from './dialog-create-department'
import getDepartments from '@/core/server/department/getDepartments';
import getCollaborators from '@/core/server/collaborator/getCollaborators';
import ListCollaborators from './list-collaborators';

const Collaborators = async () => {
  const departments = ( await getDepartments() ).departments;
  const collaborators = ( await getCollaborators() ).collaborators;
  return (
    <div className='px-10 py-3 relative'>
      <div className='bg-panelWhite p-7 rounded-xl shadow-2xl items-center w-full flex justify-between' >
        <h1 className='text-xl font-bold'>Colaboradores</h1>

        <div className='flex gap-2'>
          <DialogCreateDepartment />
          <DialogCreateCollaborator departments={departments} />
        </div>
      </div>


      <ListCollaborators collaborators={collaborators} />

    </div>
  )
}

export default Collaborators