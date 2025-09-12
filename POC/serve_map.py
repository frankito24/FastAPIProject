#!/usr/bin/env python3
"""
Servidor local simple para servir el frontend del mapa
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

def start_server():
    """Inicia un servidor HTTP local en el directorio POC"""

    # Cambiar al directorio POC
    poc_dir = Path(__file__).parent.parent / "POC"
    os.chdir(poc_dir)

    PORT = 8080

    class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # Agregar headers CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()

    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🌐 Servidor iniciado en http://localhost:{PORT}")
            print(f"📁 Sirviendo archivos desde: {poc_dir}")
            print("🔗 Abriendo navegador...")

            # Abrir navegador automáticamente
            webbrowser.open(f'http://localhost:{PORT}')

            print("⏹️  Presiona Ctrl+C para detener el servidor")
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    start_server()
