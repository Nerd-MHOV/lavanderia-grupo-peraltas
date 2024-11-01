/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useReducer } from "react";
import { Input } from "./input"; // Shandcn UI Input

type TextInputProps = {
    name: string;
    placeholder: string;
    className?: string;
    value?: number;
};

// Brazilian currency config
const moneyFormatter = Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function MoneyInput(props: TextInputProps) {

    const [value, setValue] = useReducer((_: any, next: string) => {
        const digits = next.replace(/\D/g, "");
        return moneyFormatter.format(Number(digits) / 100);
    }, props.value ? moneyFormatter.format(props.value) : "");

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
        <input type="hidden" name={props.name} value={Number(value.replace(/\D/g, ""))/100}/>
        </>
    );
}
