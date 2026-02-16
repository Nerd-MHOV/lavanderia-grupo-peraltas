import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function RfidSetupPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Configurar Leitor RFID IN907</h1>
        <p className="text-muted-foreground mt-1">
          Baixe e instale o serviço no computador onde o leitor estará
          conectado via USB.
        </p>
      </div>

      {/* Download */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">1. Baixar o serviço</h2>
        <p className="text-sm text-muted-foreground">
          O pacote contém o serviço RFID e scripts de instalação para Linux e
          Windows.
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

      {/* Mobile */}

      {/* <div className="border rounded-lg p-6 space-y-4"> */}
      {/*   <h2 className="text-lg font-semibold">Usar com celular ou tablet</h2> */}
      {/*   <p className="text-sm text-muted-foreground"> */}
      {/*     O leitor IN907 conecta via USB a um computador. O celular/tablet */}
      {/*     não precisa instalar nada — basta acessar o sistema pelo navegador. */}
      {/*     As tags lidas pelo leitor aparecem em tempo real na tela. */}
      {/*   </p> */}
      {/*   <div className="bg-muted rounded-md p-4 text-sm space-y-2"> */}
      {/*     <p> */}
      {/*       <span className="font-semibold">PC com leitor:</span> Roda o */}
      {/*       serviço RFID (porta 3001) */}
      {/*     </p> */}
      {/*     <p> */}
      {/*       <span className="font-semibold">Celular/Tablet:</span> Acessa o */}
      {/*       site normalmente pelo navegador na mesma rede */}
      {/*     </p> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
}
