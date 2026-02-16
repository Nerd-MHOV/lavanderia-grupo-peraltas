import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";

export async function GET() {
  try {
    const standaloneDir = path.join(process.cwd(), "rfid-standalone");

    if (!existsSync(standaloneDir)) {
      return NextResponse.json(
        { error: "Pacote RFID não encontrado no servidor" },
        { status: 404 }
      );
    }

    const zipPath = path.join("/tmp", "rfid-service-in907.zip");

    execSync(
      `cd "${path.dirname(standaloneDir)}" && zip -r "${zipPath}" rfid-standalone/ -x "rfid-standalone/node_modules/*"`,
      { timeout: 30000 }
    );

    const zipBuffer = readFileSync(zipPath);

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="rfid-service-in907.zip"',
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Erro ao gerar download RFID:", error);
    return NextResponse.json(
      { error: "Erro ao gerar pacote de download" },
      { status: 500 }
    );
  }
}
