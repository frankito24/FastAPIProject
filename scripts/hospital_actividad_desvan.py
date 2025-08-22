from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
import time
import os

URL = "https://gestiona.comunidad.madrid/desvan/AccionLlamadaArbolDesvan_dwr.icm?tipoArbol=desvan"
DOWNLOAD_DIR = "../downloads/hospital_actividad_csvs"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

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

def wait_for_new_file(download_dir, prev_files, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        files_now = set(os.listdir(download_dir))
        new_files = [f for f in files_now - prev_files if not f.endswith('.crdownload')]
        if new_files:
            return new_files[0]
        time.sleep(1)
    return None

def clean_filename(text):
    nombre = text.lower()
    nombre = nombre.replace("actividad asistencial del ", "")
    nombre = nombre.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    nombre = nombre.replace("ñ", "n")
    nombre = nombre.replace("-", "_")
    nombre = nombre.replace(",", "")
    nombre = nombre.replace(".", "")
    nombre = nombre.replace(":", "")
    nombre = nombre.replace(" ", "_")
    nombre = nombre.replace("__", "_")
    nombre = nombre.strip() + ".csv"
    return nombre

with webdriver.Chrome(options=chrome_options) as driver:
    driver.get(URL)
    time.sleep(3)

    def click_node(text):
        try:
            node = driver.find_element(By.XPATH, f"//*[contains(text(), '{text}')]")
            ActionChains(driver).move_to_element(node).click(node).perform()
            time.sleep(1)
            return True
        except Exception as e:
            print(f"No se encontró el nodo '{text}': {e}")
            return False

    click_node("Salud y servicios sociales")
    click_node("Recursos y asistencia sanitaria")
    click_node("Centros y equipamiento sanitario")
    click_node("Hospitales")
    time.sleep(2)

    grupos = ["Grupo1", "Grupo2", "Grupo3"]
    grupo_clicked = set()
    hospital_clicked = set()
    for grupo in grupos:
        if click_node(grupo):
            time.sleep(3)
            # Itera por todos los nodos Actividad asistencial (pueden aparecer varios)
            activity_nodes = driver.find_elements(By.XPATH, "//a[contains(@href, 'javascript:cargar_temas') and contains(text(), 'Actividad asistencial')]")
            for node in activity_nodes:
                node_id = node.get_attribute("id")
                if node_id and node_id in grupo_clicked:
                    continue
                try:
                    ActionChains(driver).move_to_element(node).click(node).perform()
                    grupo_clicked.add(node_id)
                    time.sleep(3)
                    # Itera por todos los nodos Actividad asistencial del *
                    activity_hospital_nodes = driver.find_elements(By.XPATH, "//a[contains(@href, 'javascript:mostrar_tabla') and contains(text(), 'Actividad asistencial del ')]")
                    for hosp_node in activity_hospital_nodes:
                        hosp_id = hosp_node.get_attribute("id")
                        if hosp_id and hosp_id in hospital_clicked:
                            continue
                        try:
                            ActionChains(driver).move_to_element(hosp_node).click(hosp_node).perform()
                            hospital_clicked.add(hosp_id)
                            time.sleep(3)
                            # Descargar CSV
                            export_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Descargar CSV')]")
                            files_before = set(os.listdir(DOWNLOAD_DIR))
                            export_btn.click()
                            print(f"Descarga iniciada para {hosp_node.text}")
                            filename = wait_for_new_file(DOWNLOAD_DIR, files_before)
                            if filename:
                                nombre = clean_filename(hosp_node.text)
                                os.rename(os.path.join(DOWNLOAD_DIR, filename), os.path.join(DOWNLOAD_DIR, nombre))
                                print(f"Archivo guardado como {nombre}")
                            else:
                                print(f"No se encontró el archivo descargado para {hosp_node.text}")
                        except Exception as e:
                            print(f"Error al descargar {hosp_node.text}: {e}")
                    ActionChains(driver).move_to_element(node).click(node).perform()
                except Exception as e:
                    print(f"Error al hacer clic en {node.text}: {e}")
        click_node(grupo)
    time.sleep(5)
    # Elimina cualquier archivo .crdownload que quede en la carpeta de descargas
    for f in os.listdir(DOWNLOAD_DIR):
        if f.endswith('.crdownload'):
            try:
                os.remove(os.path.join(DOWNLOAD_DIR, f))
                print(f"Archivo temporal eliminado: {f}")
            except Exception as e:
                print(f"No se pudo eliminar {f}: {e}")

def main():
    pass

if __name__ == "__main__":
    main()
