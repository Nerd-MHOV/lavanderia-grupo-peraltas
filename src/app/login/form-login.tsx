'use client'
import { actionLogin } from '@/actions/serverActions/login';
import React from 'react'
import { useFormState } from 'react-dom';
import ButtonFormLogin from './button-form-login';
import SlackMessage from '@/components/interface/SlackMessage';

const FormLogin = () => {
    const initialState = { message: '', errors: {} }
    const [state, action,] = useFormState(actionLogin, initialState);
    return (
        <form action={action} className="w-96 flex-col flex justify-center h-full items-center">
            {
                state.message &&
                <SlackMessage
                    message={state?.message}
                    type={state?.success ? 'success' : 'alert'}
                />
            }
            <label className="w-full mt-3 mb-5">
                <span className="text-white">Usuário:</span>
                <input name="user" type="text" className="outline-none border-none w-full p-4 rounded-md" placeholder="Informe seu usuário..." />
                {state?.errors && <p className="text-red-500">{state.errors.user}</p>}
            </label>
            <label className="w-full mb-5">
                <span className="text-white">Senha:</span>
                <input name="passwd" type="password" className="outline-none border-none w-full p-4 rounded-md" placeholder="Informe seu usuário..." />
                {state?.errors && <p className="text-red-500">{state.errors.passwd}</p>}
            </label>
            <div className="flex w-full justify-end border-b-gray-500 border-b-2 pb-3">
                <ButtonFormLogin />
            </div>
        </form>
    )
}

export default FormLogin