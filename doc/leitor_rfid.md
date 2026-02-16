 Excelente! Consegui extrair todo o código-fonte
  Java de dentro do executável do SDK. Aqui está
  uma análise completa do leitor RFID IN907:

  ---
  Como funciona o IN907

  Protocolo de Comunicação

  O leitor usa um protocolo binário proprietário
  com a seguinte estrutura de frame:

  [Head: 0xA0] [Length] [Address] [Command]
  [Data...] [Checksum]

  Campo: Head
  Tamanho: 1 byte
  Descrição: Sempre 0xA0
  ────────────────────────────────────────
  Campo: Length
  Tamanho: 1 byte
  Descrição: 1 (addr) + 1 (cmd) + data.length + 1
    (checksum)
  ────────────────────────────────────────
  Campo: Address
  Tamanho: 1 byte
  Descrição: Endereço do leitor (default 0x00)
  ────────────────────────────────────────
  Campo: Command
  Tamanho: 1 byte
  Descrição: Código do comando (ex: 0x89 =
    inventário real-time)
  ────────────────────────────────────────
  Campo: Data
  Tamanho: N bytes
  Descrição: Dados variáveis conforme o comando
  ────────────────────────────────────────
  Campo: Checksum
  Tamanho: 1 byte
  Descrição: Complemento de dois da soma de todos
  os
    bytes

  Checksum (de CommandContent.java)

  soma = soma de todos bytes (head + length +
  address + command + data)
  checksum = (~soma) + 1   // complemento de dois

  3 Formas de Conexão

  1. Serial (RS232/USB) - Via chip CH341 (driver
  incluso no SDK), baud rate padrão 115200, 8N1
  2. TCP/IP - Conexão por socket de rede
  3. USB HID - Dispositivo HID

  Principais Comandos

  Comando: cmd_real_time_inventory
  Byte: 0x89
  Descrição: Inventário em tempo real (mais usado)
  ────────────────────────────────────────
  Comando: cmd_inventory
  Byte: 0x80
  Descrição: Inventário com cache
  ────────────────────────────────────────
  Comando: cmd_stop_inventory
  Byte: 0x8C
  Descrição: Parar inventário
  ────────────────────────────────────────
  Comando: cmd_read
  Byte: 0x81
  Descrição: Ler dados da tag
  ────────────────────────────────────────
  Comando: cmd_write
  Byte: 0x82
  Descrição: Escrever dados na tag
  ────────────────────────────────────────
  Comando: cmd_get_firmware_version
  Byte: 0x72
  Descrição: Ver versão do firmware
  ────────────────────────────────────────
  Comando: cmd_set_output_power
  Byte: 0x76
  Descrição: Definir potência RF
  ────────────────────────────────────────
  Comando: cmd_get_output_power
  Byte: 0x77
  Descrição: Obter potência RF
  ────────────────────────────────────────
  Comando: cmd_set_work_antenna
  Byte: 0x74
  Descrição: Selecionar antena
  ────────────────────────────────────────
  Comando: cmd_set_beep_mode
  Byte: 0x7A
  Descrição: Modo do beep
  ────────────────────────────────────────
  Comando: cmd_reset
  Byte: 0x70
  Descrição: Reset do leitor

  Dados retornados por tag (classe epcList)

  - ant: Número da antena que leu
  - pc: Protocol Control (2 bytes)
  - epc: Código EPC da tag (identificador único)
  - rssi: Intensidade do sinal
  - freq: Frequência utilizada
  - crc: CRC da tag

  ---
  Como integrar com a sua app Next.js

  A sua aplicação é Next.js + TypeScript + Prisma +
   socket.io. A integração mais prática seria por
  Serial (USB) ou TCP/IP. Aqui estão as opções:

  Opção 1: Conexão TCP/IP (se o leitor suportar
  rede)

  Conectar direto do backend Node.js via socket TCP
   nativo.

  Opção 2: Conexão Serial (USB)

  Usar o pacote serialport no Node.js para se
  comunicar com o leitor via USB.

  Opção 3: Serviço intermediário

  Criar um pequeno serviço Node.js que comunica com
   o leitor e envia os dados via WebSocket
  (socket.io) para o frontend.
