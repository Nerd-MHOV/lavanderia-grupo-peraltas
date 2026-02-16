/**
 * IN907 RFID Reader - Parser de dados de tags
 *
 * Parseia as respostas do leitor para extrair informações das tags RFID.
 * Baseado em myRfidCallback.java (rfidGetRealTimeInvenEPC, etc.)
 */

export interface RfidTag {
  /** Número da antena que leu a tag (1-based) */
  antenna: number;
  /** Protocol Control (2 bytes em hex) */
  pc: string;
  /** Electronic Product Code (identificador único da tag) */
  epc: string;
  /** Received Signal Strength Indicator em dBm */
  rssi: number;
  /** Frequência utilizada em kHz */
  frequency: number;
  /** Timestamp da leitura */
  timestamp: number;
}

export interface ReadTagResult {
  /** EPC da tag lida */
  epc: string;
  /** Dados lidos do banco de memória */
  data: string;
  /** Banco de memória (0=Reserved, 1=EPC, 2=TID, 3=User) */
  memBank: number;
}

/**
 * Tabela de frequências base para cálculo.
 * Frequência = base + channel * step
 */
const FREQ_TABLE: Record<number, { base: number; step: number }> = {
  1: { base: 865000, step: 500 }, // EU
  2: { base: 902000, step: 500 }, // US
  4: { base: 920000, step: 250 }, // CN
  6: { base: 915000, step: 500 }, // Korea
  8: { base: 865000, step: 500 }, // Default
};

/**
 * Calcula o comprimento do EPC em bytes a partir do campo PC.
 * Os 5 bits mais significativos do PC indicam o tamanho em words (16 bits).
 */
export function getEpcLengthFromPC(pc: number): number {
  const wordCount = (pc >> 11) & 0x1f;
  return wordCount * 2; // words para bytes
}

/**
 * Calcula o RSSI em dBm a partir do byte raw.
 * Fórmula do SDK: se valor > 127, RSSI = valor - 256 (signed byte)
 */
export function calculateRssi(raw: number): number {
  return raw > 127 ? raw - 256 : raw;
}

/**
 * Calcula a frequência em kHz a partir do byte de frequência.
 * Baseado no SDK Java.
 */
export function calculateFrequency(
  freqByte: number,
  region: number = 2
): number {
  const entry = FREQ_TABLE[region] ?? FREQ_TABLE[2];
  return entry.base + freqByte * entry.step;
}

/**
 * Parseia a resposta de inventário em tempo real (comando 0x89).
 *
 * Formato dos dados de resposta para uma tag:
 * [RSSI] [PC_H] [PC_L] [EPC...] [Antenna] [Frequency]
 *
 * No inventário real-time, o primeiro byte do data é um flag/count,
 * seguido pela sequência de dados da tag.
 */
export function parseRealtimeInventoryTag(data: Buffer): RfidTag | null {
  if (data.length < 5) return null;

  let offset = 0;

  // Primeiro byte pode ser flags/antenna info
  const flags = data[offset++];

  // PC (Protocol Control) - 2 bytes
  if (offset + 2 > data.length) return null;
  const pcHigh = data[offset++];
  const pcLow = data[offset++];
  const pc = (pcHigh << 8) | pcLow;

  // Calcular tamanho do EPC a partir do PC
  const epcLength = getEpcLengthFromPC(pc);

  if (epcLength <= 0 || offset + epcLength > data.length) {
    // Fallback: usar o restante dos dados menos RSSI como EPC
    const fallbackEpcLength = data.length - offset - 1;
    if (fallbackEpcLength <= 0) return null;

    const epcBytes = data.subarray(offset, offset + fallbackEpcLength);
    offset += fallbackEpcLength;

    const rssiRaw = data[offset];

    return {
      antenna: (flags & 0x03) + 1,
      pc: pcHigh.toString(16).padStart(2, "0") + pcLow.toString(16).padStart(2, "0"),
      epc: bufferToHex(epcBytes),
      rssi: calculateRssi(rssiRaw),
      frequency: 0,
      timestamp: Date.now(),
    };
  }

  // EPC
  const epcBytes = data.subarray(offset, offset + epcLength);
  offset += epcLength;

  // RSSI
  const rssiRaw = offset < data.length ? data[offset++] : 0;

  // Antenna (pode estar nos flags ou em byte separado)
  const antenna = (flags & 0x03) + 1;

  // Frequency byte (se disponível)
  const freqByte = offset < data.length ? data[offset++] : 0;

  return {
    antenna,
    pc: pcHigh.toString(16).padStart(2, "0") + pcLow.toString(16).padStart(2, "0"),
    epc: bufferToHex(epcBytes),
    rssi: calculateRssi(rssiRaw),
    frequency: calculateFrequency(freqByte),
    timestamp: Date.now(),
  };
}

/**
 * Parseia a resposta de leitura de tag (comando 0x81).
 */
export function parseReadTagResponse(data: Buffer): ReadTagResult | null {
  if (data.length < 1) return null;

  // Primeiro byte é o status/error code
  const status = data[0];
  if (status !== 0x00) return null;

  if (data.length < 6) return null;

  let offset = 1;

  // Antenna + data count info
  offset++; // skip count/antenna byte

  // PC (2 bytes)
  const pcHigh = data[offset++];
  const pcLow = data[offset++];
  const pc = (pcHigh << 8) | pcLow;
  const epcLength = getEpcLengthFromPC(pc);

  // EPC
  if (offset + epcLength > data.length) return null;
  const epc = bufferToHex(data.subarray(offset, offset + epcLength));
  offset += epcLength;

  // Read data (restante)
  const readData = bufferToHex(data.subarray(offset));

  return {
    epc,
    data: readData,
    memBank: 0,
  };
}

/**
 * Converte Buffer para string hexadecimal uppercase.
 */
function bufferToHex(buf: Buffer): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}
