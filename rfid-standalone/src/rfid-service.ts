/**
 * IN907 RFID Reader - Serviço Principal
 *
 * Gerencia a conexão serial com o leitor IN907,
 * implementa buffer de recepção com state machine,
 * e emite eventos quando tags são lidas.
 */

import { EventEmitter } from "events";
import { SerialPort } from "serialport";
import {
  buildCommand,
  Commands,
  extractFrame,
  parseFrame,
  type ParsedFrame,
} from "./protocol";
import { getErrorMessage } from "./error-codes";
import {
  parseRealtimeInventoryTag,
  parseReadTagResponse,
  type RfidTag,
  type ReadTagResult,
} from "./parser";

export interface RfidServiceOptions {
  /** Porta serial (ex: /dev/ttyUSB0, COM3) */
  port: string;
  /** Baud rate (default: 115200) */
  baudRate?: number;
  /** Endereço do leitor (default: 0x00) */
  address?: number;
  /** Intervalo de deduplicação em ms (default: 3000) */
  deduplicationInterval?: number;
}

export interface RfidServiceEvents {
  tag: (tag: RfidTag) => void;
  connected: () => void;
  disconnected: () => void;
  error: (error: Error) => void;
  inventoryEnd: () => void;
  response: (frame: ParsedFrame) => void;
}

export class RfidService extends EventEmitter {
  private serialPort: SerialPort | null = null;
  private receiveBuffer: Buffer = Buffer.alloc(0);
  private address: number;
  private baudRate: number;
  private portPath: string;
  private isInventoryActive = false;

  /** Mapa de deduplicação: EPC → timestamp da última leitura */
  private seenTags = new Map<string, number>();
  private deduplicationInterval: number;

  /** Tags acumuladas durante inventário */
  private inventoryTags: RfidTag[] = [];

  constructor(options: RfidServiceOptions) {
    super();
    this.portPath = options.port;
    this.baudRate = options.baudRate ?? 115200;
    this.address = options.address ?? 0x00;
    this.deduplicationInterval = options.deduplicationInterval ?? 3000;
  }

  /** Conecta à porta serial do leitor */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serialPort = new SerialPort(
        {
          path: this.portPath,
          baudRate: this.baudRate,
          dataBits: 8,
          parity: "none",
          stopBits: 1,
          autoOpen: false,
        },
      );

      this.serialPort.on("data", (data: Buffer) => this.onData(data));
      this.serialPort.on("error", (err) => this.emit("error", err));
      this.serialPort.on("close", () => {
        this.isInventoryActive = false;
        this.emit("disconnected");
      });

      this.serialPort.open((err) => {
        if (err) {
          reject(new Error(`Falha ao abrir porta ${this.portPath}: ${err.message}`));
          return;
        }
        this.emit("connected");
        resolve();
      });
    });
  }

  /** Desconecta da porta serial */
  async disconnect(): Promise<void> {
    if (this.isInventoryActive) {
      await this.stopInventory();
    }
    return new Promise((resolve) => {
      if (!this.serialPort?.isOpen) {
        resolve();
        return;
      }
      this.serialPort.close(() => resolve());
    });
  }

  /** Verifica se está conectado */
  get connected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }

  /** Verifica se inventário está ativo */
  get reading(): boolean {
    return this.isInventoryActive;
  }

  /** Retorna tags acumuladas */
  get tags(): RfidTag[] {
    return [...this.inventoryTags];
  }

  /** Limpa tags acumuladas e mapa de deduplicação */
  clearTags(): void {
    this.inventoryTags = [];
    this.seenTags.clear();
  }

  /** Inicia inventário em tempo real */
  async startInventory(repeat: number = 0xff): Promise<void> {
    this.isInventoryActive = true;
    this.sendCommand(Commands.REAL_TIME_INVENTORY, [repeat]);
  }

  /** Para o inventário */
  async stopInventory(): Promise<void> {
    this.isInventoryActive = false;
    this.sendCommand(Commands.STOP_INVENTORY, []);
  }

  /** Obtém versão do firmware */
  async getVersion(): Promise<void> {
    this.sendCommand(Commands.GET_FIRMWARE_VERSION, []);
  }

  /** Define potência de saída RF (0-30 dBm) */
  async setPower(power: number): Promise<void> {
    const clamped = Math.max(0, Math.min(30, power));
    this.sendCommand(Commands.SET_OUTPUT_POWER, [clamped]);
  }

  /** Obtém potência de saída RF atual */
  async getPower(): Promise<void> {
    this.sendCommand(Commands.GET_OUTPUT_POWER, []);
  }

  /** Define a antena de trabalho (0-3) */
  async setAntenna(antenna: number): Promise<void> {
    this.sendCommand(Commands.SET_WORK_ANTENNA, [antenna & 0x03]);
  }

  /** Define modo do beep (0=off, 1=on) */
  async setBeepMode(mode: number): Promise<void> {
    this.sendCommand(Commands.SET_BEEP_MODE, [mode & 0x01]);
  }

  /**
   * Lê dados de uma tag.
   * @param memBank - Banco de memória (0=Reserved, 1=EPC, 2=TID, 3=User)
   * @param startAddr - Endereço inicial (em words)
   * @param wordCount - Quantidade de words a ler
   * @param password - Senha de acesso (4 bytes, default 00000000)
   */
  async readTag(
    memBank: number = 2,
    startAddr: number = 0,
    wordCount: number = 6,
    password: number[] = [0, 0, 0, 0]
  ): Promise<void> {
    this.sendCommand(Commands.READ, [
      ...password,
      memBank,
      startAddr >> 8,
      startAddr & 0xff,
      wordCount >> 8,
      wordCount & 0xff,
    ]);
  }

  /**
   * Escreve dados em uma tag.
   * @param memBank - Banco de memória (1=EPC, 3=User)
   * @param startAddr - Endereço inicial (em words)
   * @param data - Dados a escrever (array de bytes, deve ser múltiplo de 2)
   * @param password - Senha de acesso (4 bytes, default 00000000)
   */
  async writeTag(
    memBank: number,
    startAddr: number,
    data: number[],
    password: number[] = [0, 0, 0, 0]
  ): Promise<void> {
    const wordCount = Math.ceil(data.length / 2);
    this.sendCommand(Commands.WRITE, [
      ...password,
      memBank,
      startAddr >> 8,
      startAddr & 0xff,
      wordCount >> 8,
      wordCount & 0xff,
      ...data,
    ]);
  }

  /** Reset do leitor */
  async reset(): Promise<void> {
    this.sendCommand(Commands.RESET, []);
  }

  /** Envia um comando ao leitor */
  private sendCommand(command: number, data: number[]): void {
    if (!this.serialPort?.isOpen) {
      this.emit("error", new Error("Porta serial não está aberta"));
      return;
    }
    const frame = buildCommand(this.address, command, data);
    this.serialPort.write(frame);
  }

  /**
   * Callback de recepção de dados da porta serial.
   * Implementa buffer de recepção com state machine para montar pacotes completos.
   * Baseado em rfidUnpack do SDK Java.
   */
  private onData(data: Buffer): void {
    this.receiveBuffer = Buffer.concat([this.receiveBuffer, data]);

    // Tentar extrair frames completos
    let result = extractFrame(this.receiveBuffer);
    while (result.frame) {
      this.receiveBuffer = result.remaining;
      this.processFrame(result.frame);
      result = extractFrame(this.receiveBuffer);
    }
    this.receiveBuffer = result.remaining;

    // Proteção contra buffer overflow
    if (this.receiveBuffer.length > 4096) {
      this.receiveBuffer = Buffer.alloc(0);
    }
  }

  /** Processa um frame completo recebido */
  private processFrame(frameBuffer: Buffer): void {
    const frame = parseFrame(frameBuffer);
    if (!frame) return;

    this.emit("response", frame);

    switch (frame.command) {
      case Commands.REAL_TIME_INVENTORY:
        this.handleInventoryResponse(frame);
        break;
      case Commands.READ:
        this.handleReadResponse(frame);
        break;
      default:
        break;
    }
  }

  /** Processa resposta de inventário em tempo real */
  private handleInventoryResponse(frame: ParsedFrame): void {
    if (frame.data.length === 0) return;

    // Verificar se é fim do inventário (error code 0x04 = inventário concluído)
    if (frame.data.length >= 1 && frame.data[0] === 0x04) {
      // Se inventário contínuo está ativo, o leitor re-inicia automaticamente
      this.emit("inventoryEnd");
      return;
    }

    // Verificar se é erro
    if (frame.data.length >= 1 && frame.data[0] !== 0x00 && frame.data.length < 5) {
      const errorMsg = getErrorMessage(frame.data[0]);
      this.emit("error", new Error(`Erro no inventário: ${errorMsg}`));
      return;
    }

    const tag = parseRealtimeInventoryTag(frame.data);
    if (!tag) return;

    // Deduplicação baseada em EPC + intervalo de tempo
    if (this.isDuplicate(tag.epc)) return;

    this.inventoryTags.push(tag);
    this.emit("tag", tag);
  }

  /** Processa resposta de leitura de tag */
  private handleReadResponse(frame: ParsedFrame): void {
    const result = parseReadTagResponse(frame.data);
    if (result) {
      this.emit("response", { ...frame, parsedRead: result });
    }
  }

  /**
   * Verifica se um EPC é duplicata recente.
   * Implementa deduplicação similar a rfidSaveRealtimeInvenEpc do SDK Java.
   */
  private isDuplicate(epc: string): boolean {
    const now = Date.now();
    const lastSeen = this.seenTags.get(epc);

    if (lastSeen && now - lastSeen < this.deduplicationInterval) {
      return true;
    }

    this.seenTags.set(epc, now);

    // Limpar entradas antigas periodicamente
    if (this.seenTags.size > 1000) {
      this.seenTags.forEach((ts, key) => {
        if (now - ts > this.deduplicationInterval * 2) {
          this.seenTags.delete(key);
        }
      });
    }

    return false;
  }

  /** Lista portas seriais disponíveis */
  static async listPorts(): Promise<string[]> {
    const ports = await SerialPort.list();
    return ports.map((p) => p.path);
  }
}
