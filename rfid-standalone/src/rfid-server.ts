/**
 * IN907 RFID Reader - Servidor Socket.IO + HTTP
 *
 * Serviço standalone que conecta ao leitor RFID via serial
 * e expõe os dados via socket.io para o frontend Next.js consumir.
 *
 * Uso: npx tsx src/core/rfid/rfid-server.ts
 *
 * Variáveis de ambiente:
 *   RFID_PORT       - Porta serial (default: /dev/ttyUSB0)
 *   RFID_BAUD_RATE  - Baud rate (default: 115200)
 *   RFID_ADDRESS    - Endereço do leitor (default: 0x00)
 *   RFID_SERVER_PORT - Porta do servidor HTTP (default: 3001)
 *   RFID_DEDUP_MS   - Intervalo de deduplicação em ms (default: 3000)
 */

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { RfidService } from "./rfid-service";
import type { RfidTag } from "./parser";

const RFID_PORT = process.env.RFID_PORT ?? "/dev/ttyUSB0";
const RFID_BAUD_RATE = parseInt(process.env.RFID_BAUD_RATE ?? "115200", 10);
const RFID_ADDRESS = parseInt(process.env.RFID_ADDRESS ?? "0", 10);
const SERVER_PORT = parseInt(process.env.RFID_SERVER_PORT ?? "3001", 10);
const DEDUP_MS = parseInt(process.env.RFID_DEDUP_MS ?? "3000", 10);

// ── HTTP Server ──────────────────────────────────────────

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://localhost:${SERVER_PORT}`);

  if (req.method === "GET" && url.pathname === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        connected: rfidService.connected,
        reading: rfidService.reading,
        tagCount: rfidService.tags.length,
        port: RFID_PORT,
      })
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/tags") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rfidService.tags));
    return;
  }

  if (req.method === "POST" && url.pathname === "/start") {
    rfidService.startInventory();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Inventário iniciado" }));
    return;
  }

  if (req.method === "POST" && url.pathname === "/stop") {
    rfidService.stopInventory();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Inventário parado" }));
    return;
  }

  if (req.method === "POST" && url.pathname === "/clear") {
    rfidService.clearTags();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Tags limpas" }));
    return;
  }

  if (req.method === "POST" && url.pathname === "/connect") {
    rfidService
      .connect()
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Conectado" }));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      });
    return;
  }

  if (req.method === "POST" && url.pathname === "/disconnect") {
    rfidService
      .disconnect()
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Desconectado" }));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      });
    return;
  }

  if (req.method === "GET" && url.pathname === "/ports") {
    RfidService.listPorts()
      .then((ports) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ports }));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint não encontrado" }));
});

// ── Socket.IO ────────────────────────────────────────────

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[RFID] Cliente conectado: ${socket.id}`);

  if (!rfidService.connected) {
    rfidService
      .connect()
      .then(() => {
        console.log("[RFID] Leitor conectado com sucesso");
        console.log("[RFID] Iniciando inventário em tempo real...");
        rfidService.startInventory();
      })
      .catch((err) => {
        console.error(`[RFID] Falha ao conectar: ${err.message}`);
        console.log("[RFID] Servidor ativo. Use POST /connect para tentar novamente.");
      });
  }

  socket.emit("status", {
    connected: rfidService.connected,
    reading: rfidService.reading,
    tagCount: rfidService.tags.length,
  });

  socket.on("start", () => rfidService.startInventory());
  socket.on("stop", () => rfidService.stopInventory());
  socket.on("clear", () => rfidService.clearTags());

  socket.on("disconnect", () => {
    console.log(`[RFID] Cliente desconectado: ${socket.id}`);
  });
});

// ── RFID Service ─────────────────────────────────────────

const rfidService = new RfidService({
  port: RFID_PORT,
  baudRate: RFID_BAUD_RATE,
  address: RFID_ADDRESS,
  deduplicationInterval: DEDUP_MS,
});

rfidService.on("tag", (tag: RfidTag) => {
  console.log(`[RFID] Tag: ${tag.epc} (RSSI: ${tag.rssi} dBm, Ant: ${tag.antenna})`);
  io.emit("rfid", tag);
});

rfidService.on("error", (err: Error) => {
  console.error(`[RFID] Erro: ${err.message}`);
  io.emit("rfid:error", { message: err.message });
});

rfidService.on("connected", () => {
  console.log("[RFID] Conectado ao leitor");
  io.emit("rfid:connected");
});

rfidService.on("disconnected", () => {
  console.log("[RFID] Desconectado do leitor");
  io.emit("rfid:disconnected");
});

rfidService.on("inventoryEnd", () => {
  io.emit("rfid:inventoryEnd");
});

// ── Start ────────────────────────────────────────────────

server.listen(SERVER_PORT, () => {
  console.log(`[RFID] Servidor rodando em http://localhost:${SERVER_PORT}`);
  console.log(`[RFID] Porta serial: ${RFID_PORT} @ ${RFID_BAUD_RATE} baud`);

  rfidService
    .connect()
    .then(() => {
      console.log("[RFID] Leitor conectado com sucesso");
      console.log("[RFID] Iniciando inventário em tempo real...");
      rfidService.startInventory();
    })
    .catch((err) => {
      console.error(`[RFID] Falha ao conectar: ${err.message}`);
      console.log("[RFID] Servidor ativo. Use POST /connect para tentar novamente.");
    });
});

// ── Graceful Shutdown ────────────────────────────────────

process.on("SIGINT", async () => {
  console.log("\n[RFID] Encerrando...");
  await rfidService.disconnect();
  server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await rfidService.disconnect();
  server.close();
  process.exit(0);
});
