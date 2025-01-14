import {CPFOnlyNumber, formatCPF, isValidCPF} from "@/lib/cpf";


describe('CPFOnlyNumber', () => {
  it('should remove all non-numeric characters from the CPF', () => {
    expect(CPFOnlyNumber('123.456.789-09')).toBe('12345678909')
  })
})

describe('FormatCPF', () => {
  it('should format the CPF', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09')
  })

  it('should return the same value if the CPF is invalid', () => {
    expect(formatCPF('123456789')).toBe('123456789')
  })
})

describe('IsValidCpf', () => {
  it('should return true if the CPF is valid', () => {
    expect(isValidCPF('52998224725')).toBe(true)
  })

  it('should return false if the CPF is invalid', () => {
    expect(isValidCPF('52998224726')).toBe(false)
    expect(isValidCPF('5299822472')).toBe(false)
    expect(isValidCPF('529982247255')).toBe(false)
  })
})