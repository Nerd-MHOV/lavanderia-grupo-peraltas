/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useReducer } from "react";
import { Input } from "./input"; // Shandcn UI Input
import { formatCPF } from "@/lib/cpf";

type TextInputProps = {
    name: string;
    placeholder: string;
    className?: string;
    value?: string;
};



export default function CPFInput(props: TextInputProps) {

    const [value, setValue] = useReducer((_: any, next: string) => {
        return formatCPF(next);
    }, props.value ? formatCPF(props.value) : "");

    return (
        <>
            <Input
                placeholder={props.placeholder}
                type="text"
                onChange={(ev) => {
                    setValue(ev.target.value);
                }}
                value={value}
                className={props.className}
            />
            <input type="hidden" name={props.name} value={value.replace(/\D/g, "")} />
        </>
    );
}
