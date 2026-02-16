#!/bin/bash
# Desinstalador do Serviço RFID IN907

set -e

SERVICE_NAME="rfid-service"
INSTALL_DIR="/opt/rfid-service"

if [ "$EUID" -ne 0 ]; then
  echo "Execute como root: sudo bash desinstalar.sh"
  exit 1
fi

echo "Removendo serviço RFID..."

systemctl stop "$SERVICE_NAME" 2>/dev/null || true
systemctl disable "$SERVICE_NAME" 2>/dev/null || true
rm -f "/etc/systemd/system/${SERVICE_NAME}.service"
systemctl daemon-reload

rm -rf "$INSTALL_DIR"

echo "Serviço RFID removido com sucesso."
