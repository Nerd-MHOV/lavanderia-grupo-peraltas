
import React from 'react'
import { format } from 'date-fns'
import { notFound } from 'next/navigation';
import getaCollaborator from '@/core/server/collaborator/getaCollaborator';
import getDepartments from '@/core/server/department/getDepartments';
import FormEditCollaborator from './form-edit-collaborator';

const EditCollaboratorPage = async ({
  params
}: {
  params: Promise<{ collaborator: string }>
}) => {
  const collaborator = (await getaCollaborator((await params).collaborator))?.collaborator;
  if (!collaborator) {
    return notFound();
  }

  const departments = (await getDepartments()).departments;
  
  return (
    <div className="px-10 py-3 relative">
      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl items-center w-full flex justify-between ">
        <div className='flex gap-8'>
          <h1 className='text-xl font-bold'>{collaborator?.name}</h1>
          <h2 className='text-md font-semibold text-slate-500'>{`${collaborator.department} -- ${collaborator.type}`}</h2>
        </div>
        <div className='text-slate-400 flex flex-col items-end text-sm p-0 m-0'>
          <p>criado em: {format(collaborator?.createdAt, 'dd/MM/yyyy HH:mm')}</p>
          <p>ultima atualização: {format(collaborator.updatedAt, 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>

      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl my-5">
        <FormEditCollaborator collaborator={collaborator} departments={departments} />
      </div>

    </div>
  )
}

export default EditCollaboratorPage