# Configuración de despliegue para FastAPI
# Gunicorn con Uvicorn Workers (Recomendado para producción)

import multiprocessing
import os
from dotenv import load_dotenv

# Cargar variables de entorno del archivo .env
load_dotenv()

# Configuración del servidor
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1  # Fórmula recomendada
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50

# Configuración de logs
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Configuración de timeouts
timeout = 120
keepalive = 2
graceful_timeout = 30

# Configuración de procesos
preload_app = True
daemon = False

# Variables de entorno - cargar desde .env
DATABASE_URL = os.getenv('DATABASE_URL')
API_KEY = os.getenv('API_KEY')

# Verificar que las variables críticas estén configuradas
if not DATABASE_URL:
    print("ERROR: DATABASE_URL no está configurada. Revisa tu archivo .env")
    exit(1)

if not API_KEY:
    print("ERROR: API_KEY no está configurada. Revisa tu archivo .env")
    exit(1)

raw_env = [
    f"DATABASE_URL={DATABASE_URL}",
    f"API_KEY={API_KEY}"
]

# Configuración de memoria y CPU
worker_tmp_dir = "/dev/shm" if os.path.exists("/dev/shm") else None
