import React from 'react'
import { Button, ButtonProps } from './button'
import { useFormStatus } from 'react-dom'
import Spin from '../interface/Spin'

interface ButtonSpinProps extends ButtonProps {
    text: string
}
const ButtonSpin = ({ text, ...props }: ButtonSpinProps) => {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} type='submit' {...props}>
            {pending ? <Spin />: text }
        </Button>
    )
}

export default ButtonSpin