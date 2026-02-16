#!/data/data/com.termux/files/usr/bin/bash
# ─────────────────────────────────────────────────────
# Instalador do Serviço RFID IN907 para Termux (Android)
# Lavanderia Grupo Peraltas
#
# Uso:
#   1. Abra o Termux
#   2. Execute: bash install-termux.sh
# ─────────────────────────────────────────────────────

set -e

INSTALL_DIR="$HOME/rfid-service"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Instalador RFID IN907 - Termux/Android ${NC}"
echo -e "${GREEN}  Lavanderia Grupo Peraltas              ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""

# ── 1. Permissão USB ──────────────────────────────────
echo -e "${YELLOW}[1/5] Configurando permissões...${NC}"
termux-setup-storage 2>/dev/null || true

# Solicitar acesso USB via API do Termux
if command -v termux-usb &> /dev/null; then
  echo "  Permissão USB via termux-usb disponível."
else
  echo -e "  ${YELLOW}Instale termux-api para suporte USB:${NC}"
  echo "  pkg install termux-api"
fi

# ── 2. Instalar dependências ─────────────────────────
echo ""
echo -e "${YELLOW}[2/5] Instalando dependências do sistema...${NC}"
pkg update -y
pkg install -y nodejs python make clang

echo -e "${GREEN}  Node.js: $(node -v)${NC}"

# ── 3. Copiar arquivos ───────────────────────────────
echo ""
echo -e "${YELLOW}[3/5] Instalando serviço RFID...${NC}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$INSTALL_DIR/src"

# Copiar arquivos fonte
if [ -d "$SCRIPT_DIR/src" ]; then
  cp -r "$SCRIPT_DIR/src/"* "$INSTALL_DIR/src/"
  cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"
  echo -e "${GREEN}  Arquivos copiados de $SCRIPT_DIR${NC}"
else
  echo -e "${RED}  Pasta src/ não encontrada em $SCRIPT_DIR${NC}"
  echo "  Certifique-se de extrair o zip completo."
  exit 1
fi

# ── 4. Instalar pacotes Node.js ──────────────────────
echo ""
echo -e "${YELLOW}[4/5] Instalando pacotes Node.js...${NC}"
cd "$INSTALL_DIR"
npm install --production 2>&1 | tail -3

# ── 5. Configurar ────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/5] Configurando...${NC}"

# Detectar porta serial
SERIAL_PORT=""
for port in /dev/ttyUSB0 /dev/ttyACM0 /dev/bus/usb/*/*; do
  if [ -e "$port" ]; then
    SERIAL_PORT="$port"
    break
  fi
done

if [ -z "$SERIAL_PORT" ]; then
  SERIAL_PORT="/dev/ttyUSB0"
  echo -e "  ${YELLOW}Nenhuma porta USB detectada. Usando padrão: $SERIAL_PORT${NC}"
  echo "  Conecte o leitor e reinicie o serviço."
else
  echo -e "  ${GREEN}Porta detectada: $SERIAL_PORT${NC}"
fi

# Porta do servidor
read -p "  Porta do servidor HTTP (padrão: 3001): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-3001}

# Criar .env
cat > "$INSTALL_DIR/.env" << EOF
RFID_PORT=${SERIAL_PORT}
RFID_BAUD_RATE=115200
RFID_ADDRESS=0
RFID_SERVER_PORT=${SERVER_PORT}
RFID_DEDUP_MS=3000
EOF

# ── Criar script de início ───────────────────────────
cat > "$INSTALL_DIR/iniciar.sh" << 'SCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/rfid-service"

# Carregar .env
set -a
source .env
set +a

echo "[RFID] Iniciando serviço na porta $RFID_SERVER_PORT..."
echo "[RFID] Porta serial: $RFID_PORT"
echo "[RFID] Pressione Ctrl+C para parar"
echo ""
npx tsx src/rfid-server.ts
SCRIPT
chmod +x "$INSTALL_DIR/iniciar.sh"

# ── Criar script de background ───────────────────────
cat > "$INSTALL_DIR/iniciar-background.sh" << 'SCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/rfid-service"

# Carregar .env
set -a
source .env
set +a

# Verificar se já está rodando
if [ -f "$HOME/rfid-service/rfid.pid" ]; then
  OLD_PID=$(cat "$HOME/rfid-service/rfid.pid")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[RFID] Serviço já está rodando (PID: $OLD_PID)"
    echo "[RFID] Para parar: bash ~/rfid-service/parar.sh"
    exit 0
  fi
fi

echo "[RFID] Iniciando em background..."
nohup npx tsx src/rfid-server.ts > "$HOME/rfid-service/rfid.log" 2>&1 &
echo $! > "$HOME/rfid-service/rfid.pid"
echo "[RFID] Rodando em background (PID: $!)"
echo "[RFID] Log: tail -f ~/rfid-service/rfid.log"
echo "[RFID] Parar: bash ~/rfid-service/parar.sh"
SCRIPT
chmod +x "$INSTALL_DIR/iniciar-background.sh"

# ── Criar script para parar ──────────────────────────
cat > "$INSTALL_DIR/parar.sh" << 'SCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
if [ -f "$HOME/rfid-service/rfid.pid" ]; then
  PID=$(cat "$HOME/rfid-service/rfid.pid")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    rm "$HOME/rfid-service/rfid.pid"
    echo "[RFID] Serviço parado."
  else
    rm "$HOME/rfid-service/rfid.pid"
    echo "[RFID] Serviço não estava rodando."
  fi
else
  echo "[RFID] Serviço não está rodando."
fi
SCRIPT
chmod +x "$INSTALL_DIR/parar.sh"

# ── Auto-start no Termux ─────────────────────────────
mkdir -p "$HOME/.termux/boot"
cat > "$HOME/.termux/boot/rfid-service.sh" << 'BOOT'
#!/data/data/com.termux/files/usr/bin/bash
# Auto-start RFID service
sleep 5
bash "$HOME/rfid-service/iniciar-background.sh"
BOOT
chmod +x "$HOME/.termux/boot/rfid-service.sh"

# ── Criar atalho no Termux Widget (se disponível) ────
mkdir -p "$HOME/.shortcuts"
cat > "$HOME/.shortcuts/RFID Iniciar" << 'SHORTCUT'
#!/data/data/com.termux/files/usr/bin/bash
bash "$HOME/rfid-service/iniciar-background.sh"
SHORTCUT
chmod +x "$HOME/.shortcuts/RFID Iniciar"

cat > "$HOME/.shortcuts/RFID Parar" << 'SHORTCUT'
#!/data/data/com.termux/files/usr/bin/bash
bash "$HOME/rfid-service/parar.sh"
SHORTCUT
chmod +x "$HOME/.shortcuts/RFID Parar"

# ── Resultado ─────────────────────────────────────────
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Instalação concluída!                   ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""
echo -e "  Porta serial:  ${SERIAL_PORT}"
echo -e "  Servidor:      http://localhost:${SERVER_PORT}"
echo -e "  Instalado em:  ${INSTALL_DIR}"
echo ""
echo -e "  ${YELLOW}Comandos:${NC}"
echo -e "  bash ~/rfid-service/iniciar.sh             # Iniciar (foreground)"
echo -e "  bash ~/rfid-service/iniciar-background.sh  # Iniciar (background)"
echo -e "  bash ~/rfid-service/parar.sh               # Parar"
echo -e "  tail -f ~/rfid-service/rfid.log            # Ver logs"
echo ""
echo -e "  ${YELLOW}Auto-start:${NC}"
echo -e "  O serviço inicia automaticamente ao abrir o Termux."
echo -e "  (Instale 'Termux:Boot' do F-Droid para iniciar com o Android)"
echo ""
echo -e "  ${YELLOW}Widgets:${NC}"
echo -e "  Instale 'Termux:Widget' do F-Droid para atalhos na tela inicial."
echo ""
echo -e "  ${YELLOW}No navegador do tablet, acesse:${NC}"
echo -e "  http://localhost:${SERVER_PORT}/status"
echo ""
