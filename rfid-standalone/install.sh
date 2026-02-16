#!/bin/bash
# ─────────────────────────────────────────────────────
# Instalador do Serviço RFID IN907
# Lavanderia Grupo Peraltas
# ─────────────────────────────────────────────────────

set -e

SERVICE_NAME="rfid-service"
INSTALL_DIR="/opt/rfid-service"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Instalador Serviço RFID IN907          ${NC}"
echo -e "${GREEN}  Lavanderia Grupo Peraltas              ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Execute como root: sudo bash install.sh${NC}"
  exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}Node.js não encontrado. Instalando...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}Node.js: ${NODE_VERSION}${NC}"

# Detectar porta serial
echo ""
echo -e "${YELLOW}Detectando portas seriais...${NC}"
SERIAL_PORTS=$(ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null || true)

if [ -z "$SERIAL_PORTS" ]; then
  echo -e "${RED}Nenhuma porta serial detectada.${NC}"
  echo -e "${YELLOW}Conecte o leitor IN907 via USB e tente novamente.${NC}"
  RFID_PORT="/dev/ttyUSB0"
  echo -e "Usando porta padrão: ${RFID_PORT}"
else
  echo "Portas encontradas:"
  echo "$SERIAL_PORTS"
  RFID_PORT=$(echo "$SERIAL_PORTS" | head -n1)
  echo -e "${GREEN}Usando: ${RFID_PORT}${NC}"
fi

# Perguntar porta do servidor
echo ""
read -p "Porta do servidor HTTP (padrão: 3001): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-3001}

# Perguntar URL do servidor da lavanderia (para referência)
echo ""
read -p "URL do sistema da lavanderia (padrão: http://localhost:3334): " LAUNDRY_URL
LAUNDRY_URL=${LAUNDRY_URL:-http://localhost:3334}

# Instalar arquivos
echo ""
echo -e "${YELLOW}Instalando em ${INSTALL_DIR}...${NC}"
mkdir -p "$INSTALL_DIR"
cp -r "$CURRENT_DIR"/src "$INSTALL_DIR/"
cp "$CURRENT_DIR"/package.json "$INSTALL_DIR/"

# Instalar dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
cd "$INSTALL_DIR"
npm install --production

# Adicionar usuário ao grupo dialout (acesso serial)
REAL_USER=${SUDO_USER:-$USER}
if id -nG "$REAL_USER" | grep -qw "dialout"; then
  echo -e "${GREEN}Usuário ${REAL_USER} já está no grupo dialout${NC}"
else
  usermod -a -G dialout "$REAL_USER"
  echo -e "${GREEN}Usuário ${REAL_USER} adicionado ao grupo dialout${NC}"
fi

# Criar arquivo de ambiente
cat > "$INSTALL_DIR/.env" << EOF
RFID_PORT=${RFID_PORT}
RFID_BAUD_RATE=115200
RFID_ADDRESS=0
RFID_SERVER_PORT=${SERVER_PORT}
RFID_DEDUP_MS=3000
EOF

echo -e "${GREEN}Configuração salva em ${INSTALL_DIR}/.env${NC}"

# Criar serviço systemd
cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Serviço RFID IN907 - Lavanderia Grupo Peraltas
After=network.target
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=simple
User=${REAL_USER}
WorkingDirectory=${INSTALL_DIR}
EnvironmentFile=${INSTALL_DIR}/.env
ExecStart=$(which node) $(which npx) tsx src/rfid-server.ts
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=rfid-service

[Install]
WantedBy=multi-user.target
EOF

# Ativar e iniciar serviço
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl start "$SERVICE_NAME"

echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Instalação concluída!                   ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""
echo -e "  Porta serial:  ${RFID_PORT}"
echo -e "  Servidor:      http://localhost:${SERVER_PORT}"
echo -e "  Instalado em:  ${INSTALL_DIR}"
echo ""
echo -e "  ${YELLOW}Comandos úteis:${NC}"
echo -e "  sudo systemctl status ${SERVICE_NAME}   # Ver status"
echo -e "  sudo systemctl restart ${SERVICE_NAME}  # Reiniciar"
echo -e "  sudo systemctl stop ${SERVICE_NAME}     # Parar"
echo -e "  sudo journalctl -u ${SERVICE_NAME} -f   # Ver logs"
echo ""
echo -e "  ${YELLOW}No sistema da lavanderia, configure:${NC}"
echo -e "  NEXT_PUBLIC_RFID_URL_SOCKET=\"http://$(hostname -I | awk '{print $1}'):${SERVER_PORT}\""
echo ""
