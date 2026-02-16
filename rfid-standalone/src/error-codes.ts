/**
 * IN907 RFID Reader - Códigos de Erro
 * Mapeamento de error codes para mensagens legíveis em PT-BR
 */

export const ErrorCodes: Record<number, string> = {
  0x00: "Comando executado com sucesso",
  0x01: "Falha na antena (verificar conexão da antena)",
  0x02: "Comando inválido ou não suportado",
  0x03: "Inventário de tags: mais dados disponíveis",
  0x04: "Inventário de tags: concluído",
  0x05: "Acesso negado à tag (senha incorreta)",
  0x06: "Tag não encontrada no campo",
  0x07: "Erro de CRC na comunicação com a tag",
  0x08: "Página de memória bloqueada na tag",
  0x09: "Falha na operação de lock/kill",
  0x0a: "Tag não suporta esta operação",
  0x0b: "Acesso insuficiente (sem permissão)",
  0x0c: "Erro genérico na operação com tag",
  0x0d: "Erro ao acessar banco de memória da tag",
  0x0e: "Parâmetros inválidos",
  0x0f: "Endereço de palavra inválido",
  0x10: "Comprimento de dados excede limite da tag",
  0x11: "Senha de acesso incorreta",
  0x12: "Erro interno do leitor",
  0x13: "Comando não implementado",
  0x14: "Timeout na operação",
  0x15: "Tag ocupada (tentar novamente)",
  0x16: "Contagem de tags excedeu limite",
  0xee: "Erro de comunicação com módulo RF",
  0xff: "Erro desconhecido",
};

/**
 * Retorna a mensagem de erro para o código fornecido.
 */
export function getErrorMessage(code: number): string {
  return ErrorCodes[code] ?? `Erro desconhecido (0x${code.toString(16).padStart(2, "0")})`;
}
