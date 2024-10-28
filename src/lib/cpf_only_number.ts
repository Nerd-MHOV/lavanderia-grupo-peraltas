export default function CPFOnlyNumber(cpf: string) {
    return cpf.replace(/\D/g, ''); // \D corresponde a qualquer caractere que não seja número
}
