@echo off
chcp 65001 >nul
title Instalador Serviço RFID IN907 - Lavanderia Grupo Peraltas

echo ══════════════════════════════════════════
echo   Instalador Serviço RFID IN907
echo   Lavanderia Grupo Peraltas
echo ══════════════════════════════════════════
echo.

:: Verificar Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Node.js não encontrado!
    echo Baixe em: https://nodejs.org/
    echo Instale e execute este script novamente.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js: %NODE_VERSION%

:: Definir diretório de instalação
set INSTALL_DIR=%USERPROFILE%\rfid-service
echo.
echo Instalando em: %INSTALL_DIR%

:: Copiar arquivos
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%INSTALL_DIR%\src" mkdir "%INSTALL_DIR%\src"
xcopy /Y /E "%~dp0src\*" "%INSTALL_DIR%\src\" >nul
copy /Y "%~dp0package.json" "%INSTALL_DIR%\" >nul

:: Instalar dependências
echo.
echo Instalando dependências...
cd /d "%INSTALL_DIR%"
call npm install --production

:: Configuração da porta
echo.
set /p RFID_PORT="Porta serial do leitor (ex: COM3): "
if "%RFID_PORT%"=="" set RFID_PORT=COM3

set /p SERVER_PORT="Porta do servidor HTTP (padrão: 3001): "
if "%SERVER_PORT%"=="" set SERVER_PORT=3001

:: Criar arquivo .env
(
echo RFID_PORT=%RFID_PORT%
echo RFID_BAUD_RATE=115200
echo RFID_ADDRESS=0
echo RFID_SERVER_PORT=%SERVER_PORT%
echo RFID_DEDUP_MS=3000
) > "%INSTALL_DIR%\.env"

:: Criar script de início
(
echo @echo off
echo cd /d "%INSTALL_DIR%"
echo npx tsx src/rfid-server.ts
echo pause
) > "%INSTALL_DIR%\iniciar-rfid.bat"

:: Criar atalho na pasta Startup (iniciar com Windows)
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
(
echo @echo off
echo cd /d "%INSTALL_DIR%"
echo start /min "" npx tsx src/rfid-server.ts
) > "%STARTUP_DIR%\rfid-service.bat"

echo.
echo ══════════════════════════════════════════
echo   Instalação concluída!
echo ══════════════════════════════════════════
echo.
echo   Porta serial:  %RFID_PORT%
echo   Servidor:      http://localhost:%SERVER_PORT%
echo   Instalado em:  %INSTALL_DIR%
echo.
echo   O serviço vai iniciar automaticamente com o Windows.
echo   Para iniciar manualmente: %INSTALL_DIR%\iniciar-rfid.bat
echo.
echo   No sistema da lavanderia, configure:
echo   NEXT_PUBLIC_RFID_URL_SOCKET="http://SEU_IP:%SERVER_PORT%"
echo.
pause
