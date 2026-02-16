/**
 * IN907 RFID Reader - Binary Protocol Implementation
 *
 * Frame structure:
 * [Head: 0xA0] [Length] [Address] [Command] [Data...] [Checksum]
 *
 * Length = 1 (addr) + 1 (cmd) + data.length + 1 (checksum)
 * Checksum = two's complement of sum of all bytes
 */

export const HEAD = 0xa0;

export const Commands = {
  /** Inventário em tempo real (mais usado) */
  REAL_TIME_INVENTORY: 0x89,
  /** Inventário com cache */
  INVENTORY: 0x80,
  /** Parar inventário */
  STOP_INVENTORY: 0x8c,
  /** Ler dados da tag */
  READ: 0x81,
  /** Escrever dados na tag */
  WRITE: 0x82,
  /** Lock tag */
  LOCK: 0x83,
  /** Kill tag */
  KILL: 0x84,
  /** Ver versão do firmware */
  GET_FIRMWARE_VERSION: 0x72,
  /** Definir potência RF */
  SET_OUTPUT_POWER: 0x76,
  /** Obter potência RF */
  GET_OUTPUT_POWER: 0x77,
  /** Selecionar antena */
  SET_WORK_ANTENNA: 0x74,
  /** Modo do beep */
  SET_BEEP_MODE: 0x7a,
  /** Reset do leitor */
  RESET: 0x70,
  /** Set region */
  SET_REGION: 0x07,
  /** Get region */
  GET_REGION: 0x08,
} as const;

export type CommandCode = (typeof Commands)[keyof typeof Commands];

/**
 * Calcula o checksum (complemento de dois) de um array de bytes.
 * soma = soma de todos os bytes
 * checksum = (~soma + 1) & 0xFF
 */
export function calculateChecksum(bytes: number[]): number {
  let sum = 0;
  for (const b of bytes) {
    sum += b;
  }
  return (~sum + 1) & 0xff;
}

/**
 * Monta um frame de comando completo para enviar ao leitor.
 *
 * @param address - Endereço do leitor (default 0x00)
 * @param command - Código do comando
 * @param data - Dados do comando (pode ser vazio)
 * @returns Buffer com o frame completo
 */
export function buildCommand(
  address: number,
  command: number,
  data: number[] = []
): Buffer {
  const length = 1 + 1 + data.length + 1; // addr + cmd + data + checksum
  const frameWithoutChecksum = [HEAD, length, address, command, ...data];
  const checksum = calculateChecksum(frameWithoutChecksum);
  return Buffer.from([...frameWithoutChecksum, checksum]);
}

export interface ParsedFrame {
  address: number;
  command: number;
  data: Buffer;
}

/**
 * Parseia um frame de resposta do leitor.
 * Retorna null se o frame for inválido.
 *
 * @param buffer - Buffer contendo o frame completo
 * @returns Frame parseado ou null se inválido
 */
export function parseFrame(buffer: Buffer): ParsedFrame | null {
  if (buffer.length < 5) return null; // mínimo: head + length + addr + cmd + checksum
  if (buffer[0] !== HEAD) return null;

  const length = buffer[1];
  const expectedTotalLength = 2 + length; // head + length + (addr + cmd + data + checksum)

  if (buffer.length < expectedTotalLength) return null;

  // Verificar checksum
  const frameBytes: number[] = [];
  for (let i = 0; i < expectedTotalLength - 1; i++) {
    frameBytes.push(buffer[i]);
  }
  const expectedChecksum = calculateChecksum(frameBytes);
  const receivedChecksum = buffer[expectedTotalLength - 1];

  if (expectedChecksum !== receivedChecksum) return null;

  const address = buffer[2];
  const command = buffer[3];
  const dataLength = length - 3; // length inclui addr + cmd + checksum
  const data = buffer.subarray(4, 4 + dataLength);

  return { address, command, data: Buffer.from(data) };
}

/**
 * Tenta extrair um frame completo do buffer de recepção.
 * Retorna o frame extraído e o restante do buffer.
 * Baseado em rfidUnpack do SDK Java.
 */
export function extractFrame(buffer: Buffer): {
  frame: Buffer | null;
  remaining: Buffer;
} {
  // Procurar o header
  let startIndex = -1;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === HEAD) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {
    return { frame: null, remaining: Buffer.alloc(0) };
  }

  // Descartar bytes antes do header
  const buf = buffer.slice(startIndex);

  if (buf.length < 2) {
    return { frame: null, remaining: Buffer.from(Array.from(buf)) };
  }

  const length = buf[1];
  const totalLength = 2 + length; // head + length byte + (payload including checksum)

  if (buf.length < totalLength) {
    return { frame: null, remaining: Buffer.from(Array.from(buf)) };
  }

  const frame = Buffer.from(Array.from(buf.slice(0, totalLength)));
  const remaining = Buffer.from(Array.from(buf.slice(totalLength)));

  return { frame, remaining };
}
