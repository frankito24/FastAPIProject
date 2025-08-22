from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
import time
import os

URL = "https://gestiona.comunidad.madrid/desvan/AccionLlamadaArbolDesvan_dwr.icm?tipoArbol=almudena"
DOWNLOAD_DIR = "../downloads/poblacion_censada_csvs"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Configura Selenium para usar Chrome en modo headless
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1920,1080')
chrome_options.add_experimental_option('prefs', {
    'download.default_directory': os.path.abspath(DOWNLOAD_DIR),
    'download.prompt_for_download': False,
    'download.directory_upgrade': True,
    'safebrowsing.enabled': True
})

# Inicializa el driver
with webdriver.Chrome(options=chrome_options) as driver:
    driver.get(URL)
    time.sleep(3)  # Espera a que cargue el árbol

    # Navegación por el árbol (ajusta los selectores si es necesario)
    # Busca y expande los nodos del árbol
    def click_node(text):
        try:
            node = driver.find_element(By.XPATH, f"//*[contains(text(), '{text}')]")
            ActionChains(driver).move_to_element(node).click(node).perform()
            time.sleep(1)
        except Exception as e:
            print(f"No se encontró el nodo '{text}': {e}")

    click_node("Población")
    click_node("Censos")
    click_node("Censo anual")
    click_node("Población censada")
    click_node("Total")
    time.sleep(2)

    def wait_for_new_file(download_dir, prev_files, timeout=30):
        import time
        start = time.time()
        while time.time() - start < timeout:
            files_now = set(os.listdir(download_dir))
            new_files = list(files_now - prev_files)
            # Ignora archivos .crdownload
            new_files = [f for f in new_files if not f.endswith('.crdownload')]
            if new_files:
                return new_files[0]
            time.sleep(1)
        return None

    # Descargar el primer CSV: Población censada: Total
    try:
        total_node = driver.find_element(By.XPATH, "//*[contains(text(), 'Población censada: Total')]")
        ActionChains(driver).move_to_element(total_node).click(total_node).perform()
        time.sleep(2)
        export_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Exportar A CSV')]")
        files_before = set(os.listdir(DOWNLOAD_DIR))
        export_btn.click()
        print("Descarga iniciada para Población censada: Total")
        filename = wait_for_new_file(DOWNLOAD_DIR, files_before)
        if filename:
            os.rename(os.path.join(DOWNLOAD_DIR, filename), os.path.join(DOWNLOAD_DIR, "total.csv"))
            print("Archivo guardado como total.csv")
        else:
            print("No se encontró el archivo descargado para Total")
    except Exception as e:
        print(f"Error al descargar Población censada: Total: {e}")

    # Iterar sobre todos los nodos Población censada de *
    poblacion_nodes = driver.find_elements(By.XPATH, "//*[contains(text(), 'Población censada de ')]")
    print(f"Encontrados {len(poblacion_nodes)} nodos de Población censada de *.")
    for idx, node in enumerate(poblacion_nodes):
        try:
            ActionChains(driver).move_to_element(node).click(node).perform()
            time.sleep(2)
            export_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Exportar A CSV')]")
            files_before = set(os.listdir(DOWNLOAD_DIR))
            export_btn.click()
            print(f"Descarga iniciada para {node.text}")
            filename = wait_for_new_file(DOWNLOAD_DIR, files_before)
            if filename:
                nombre = node.text.replace("Población censada de ", "")
                nombre = nombre.replace(" años", "")
                nombre = nombre.replace(" y más", "_n")
                nombre = nombre.replace("-", "_")
                nombre = nombre.replace(" ", "")
                nombre = nombre.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
                nombre = nombre.replace(",", "")
                nombre = nombre.replace(".", "")
                nombre = nombre.strip() + ".csv"
                os.rename(os.path.join(DOWNLOAD_DIR, filename), os.path.join(DOWNLOAD_DIR, nombre))
                print(f"Archivo guardado como {nombre}")
            else:
                print(f"No se encontró el archivo descargado para {node.text}")
        except Exception as e:
            print(f"Error al descargar {node.text}: {e}")
    time.sleep(5)  # Espera para que las descargas finalicen
    # Elimina cualquier archivo .crdownload que quede en la carpeta de descargas
    for f in os.listdir(DOWNLOAD_DIR):
        if f.endswith('.crdownload'):
            try:
                os.remove(os.path.join(DOWNLOAD_DIR, f))
                print(f"Archivo temporal eliminado: {f}")
            except Exception as e:
                print(f"No se pudo eliminar {f}: {e}")

def main():
    pass  # El script se ejecuta al correrlo

if __name__ == "__main__":
    main()
