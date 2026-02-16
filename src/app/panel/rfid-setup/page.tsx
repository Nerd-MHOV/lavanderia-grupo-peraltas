import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function RfidSetupPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Configurar Leitor RFID IN907</h1>
        <p className="text-muted-foreground mt-1">
          Baixe e instale o serviço no dispositivo onde o leitor estará
          conectado via USB.
        </p>
      </div>

      {/* Download */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">1. Baixar o serviço</h2>
        <p className="text-sm text-muted-foreground">
          O pacote contém o serviço RFID e scripts de instalação para Linux,
          Windows e Android (Termux).
        </p>
        <a href="/api/rfid-download" download>
          <Button size="lg">
            <Download />
            Baixar rfid-service-in907.zip
          </Button>
        </a>
      </div>

      {/* Linux */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">2a. Instalar no Linux</h2>
        <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-1">
          <p className="text-muted-foreground"># Extrair o arquivo</p>
          <p>unzip rfid-service-in907.zip</p>
          <p>cd rfid-standalone</p>
          <p className="text-muted-foreground mt-2"># Instalar (cria serviço systemd)</p>
          <p>sudo bash install.sh</p>
        </div>
        <p className="text-sm text-muted-foreground">
          O instalador configura um serviço que inicia automaticamente com o
          sistema. Ele vai pedir a porta serial e a porta do servidor.
        </p>
        <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-1">
          <p className="text-muted-foreground"># Comandos úteis</p>
          <p>sudo systemctl status rfid-service</p>
          <p>sudo systemctl restart rfid-service</p>
          <p>sudo journalctl -u rfid-service -f</p>
        </div>
      </div>

      {/* Windows */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">2b. Instalar no Windows</h2>
        <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-1">
          <p className="text-muted-foreground"># Extrair o arquivo e executar</p>
          <p>install.bat</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Requer <a href="https://nodejs.org/" target="_blank" rel="noreferrer" className="underline">Node.js</a> instalado.
          O instalador cria um atalho na pasta Inicializar do Windows
          para que o serviço inicie automaticamente.
        </p>
      </div>

      {/* Android / Tablet */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">2c. Instalar no Android / Tablet</h2>
        <p className="text-sm text-muted-foreground">
          Para usar o leitor direto no tablet via USB OTG, sem precisar de
          computador.
        </p>

        <div className="bg-muted rounded-md p-4 text-sm space-y-3">
          <div>
            <p className="font-semibold">Passo 1 - Instalar o Termux</p>
            <p className="text-muted-foreground">
              Baixe o{" "}
              <a
                href="https://f-droid.org/packages/com.termux/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Termux pelo F-Droid
              </a>{" "}
              (nao use a versao da Play Store).
            </p>
          </div>
          <div>
            <p className="font-semibold">Passo 2 - Apps opcionais do Termux</p>
            <p className="text-muted-foreground">
              <a
                href="https://f-droid.org/packages/com.termux.boot/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Termux:Boot
              </a>{" "}
              (auto-iniciar com o Android) e{" "}
              <a
                href="https://f-droid.org/packages/com.termux.widget/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Termux:Widget
              </a>{" "}
              (atalhos na tela inicial).
            </p>
          </div>
          <div>
            <p className="font-semibold">Passo 3 - Conectar o leitor</p>
            <p className="text-muted-foreground">
              Use um adaptador USB OTG para conectar o IN907 ao tablet.
            </p>
          </div>
        </div>

        <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-1">
          <p className="text-muted-foreground"># No Termux, baixar e instalar</p>
          <p>cd ~/storage/downloads</p>
          <p>unzip rfid-service-in907.zip</p>
          <p>cd rfid-standalone</p>
          <p>bash install-termux.sh</p>
        </div>

        <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-1">
          <p className="text-muted-foreground"># Comandos do dia a dia</p>
          <p>bash ~/rfid-service/iniciar.sh             # Iniciar</p>
          <p>bash ~/rfid-service/iniciar-background.sh  # Iniciar em background</p>
          <p>bash ~/rfid-service/parar.sh               # Parar</p>
          <p>tail -f ~/rfid-service/rfid.log            # Ver logs</p>
        </div>

        <p className="text-sm text-muted-foreground">
          Com o Termux:Boot instalado, o serviço inicia automaticamente ao
          ligar o tablet. Com o Termux:Widget, atalhos de iniciar/parar ficam
          na tela inicial.
        </p>
      </div>
    </div>
  );
}
