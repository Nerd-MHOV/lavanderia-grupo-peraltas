#!/bin/bash
# ─────────────────────────────────────────────────────
# Abre o software de configuração do IN907 no Linux
# (extraído do reader_win64.exe - é uma app Java)
# ─────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXE_PATH="$SCRIPT_DIR/../IN907 sdk/IN907 sdk/new_reader_v1.0.2/TID new_reader_v1.0.2/reader_v1.0.2/reader_win64.exe"
EXTRACT_DIR="/tmp/rfid-reader-config"

# Verificar Java
if ! command -v java &> /dev/null; then
  echo "Java não encontrado. Instale com:"
  echo "  sudo apt install default-jre"
  exit 1
fi

# Extrair se necessário
if [ ! -d "$EXTRACT_DIR/com" ]; then
  echo "Extraindo aplicação do SDK..."
  mkdir -p "$EXTRACT_DIR"

  if [ ! -f "$EXE_PATH" ]; then
    # Tentar caminho relativo ao projeto
    EXE_PATH="$(dirname "$SCRIPT_DIR")/IN907 sdk/IN907 sdk/new_reader_v1.0.2/TID new_reader_v1.0.2/reader_v1.0.2/reader_win64.exe"
  fi

  if [ ! -f "$EXE_PATH" ]; then
    echo "Arquivo reader_win64.exe não encontrado."
    echo "Informe o caminho completo:"
    read -p "> " EXE_PATH
  fi

  cd "$EXTRACT_DIR"
  unzip -o "$EXE_PATH" -d . > /dev/null 2>&1
  echo "Extraído com sucesso."
fi

echo "Abrindo configuração do leitor IN907..."
cd "$EXTRACT_DIR"
java --enable-native-access=ALL-UNNAMED -cp . com.xyang.rfidreader.RfidReader
