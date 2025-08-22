import pandas as pd
import os
import csv
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
import unicodedata
from tqdm import tqdm
import gc

# INPUT_CSV = "../downloads/educacion/educapu/educapu.csv"
INPUT_CSV = "../downloads/educacion/error-4.csv"
MATRICULA_DIR = "../downloads/educacion_matricula"
SOLICITUD_DIR = "../downloads/educacion_solicitud"
ERROR_CSV = "../downloads/educacion/error.csv"
CHUNK_SIZE = 200

os.makedirs(MATRICULA_DIR, exist_ok=True)
os.makedirs(SOLICITUD_DIR, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1920,1080')

error_rows = []

def clean_text(text):
    text = text.lower()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = text.replace(' ', '_')
    return text

def save_table_to_csv(table_element, output_path):
    rows = table_element.find_elements(By.TAG_NAME, "tr")
    with open(output_path, "w", newline="") as f:
        writer = csv.writer(f)
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "th") + row.find_elements(By.TAG_NAME, "td")
            writer.writerow([col.text for col in cols])


def main():
    chunk_iter = pd.read_csv(INPUT_CSV, chunksize=CHUNK_SIZE)
    total_processed = 0
    with open(ERROR_CSV, "w", newline="") as error_f:
        error_writer = csv.DictWriter(error_f, fieldnames=["CODIGO", "URL", "ERROR_MESSAGE"])
        error_writer.writeheader()
        for chunk in chunk_iter:
            with webdriver.Chrome(options=chrome_options) as driver:
                for idx, row in tqdm(chunk.iterrows(), total=len(chunk), desc=f"Procesando centros {total_processed+1}-{total_processed+len(chunk)}", unit="centro"):
                    codigo = str(row["CODIGO"]).strip()
                    url = str(row["URL"]).strip()
                    try:
                        driver.get(url)
                        # Mejorar la validación: si el mensaje aparece 2 veces en el HTML, lo consideramos sin datos
                        mensaje = "No hay resultados académicos almacenados en el sistema"
                        if driver.page_source.count(mensaje) >= 2:
                            error_writer.writerow({"CODIGO": codigo, "URL": url, "ERROR_MESSAGE": mensaje})
                            continue
                        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'DATOS ESTADISTICOS')]")))
                        datos_btn = driver.find_element(By.XPATH, "//*[contains(text(), 'DATOS ESTADISTICOS')]")
                        datos_btn.click()
                        try:
                            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "tablaDatos.grafica1")))
                            tabla1 = driver.find_element(By.ID, "tablaDatos.grafica1")
                            matricula_path = os.path.join(MATRICULA_DIR, f"{codigo}.csv")
                            save_table_to_csv(tabla1, matricula_path)
                        except Exception as e:
                            error_writer.writerow({"CODIGO": codigo, "URL": url, "ERROR_MESSAGE": f"tablaDatos.grafica1: {str(e)}"})
                        try:
                            radios = driver.find_elements(By.NAME, "cdnivelEducacion.grafica3")
                            for radio in radios:
                                radio_text = radio.get_attribute("value")
                                label_elem = driver.find_element(By.XPATH, f"//label[@for='{radio.get_attribute('id')}']")
                                label_text = label_elem.text if label_elem else radio_text
                                radio.click()
                                time.sleep(1)
                                try:
                                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "tablaDatos.grafica3")))
                                    tabla3 = driver.find_element(By.ID, "tablaDatos.grafica3")
                                    solicitud_name = f"{codigo}_{clean_text(label_text)}.csv"
                                    solicitud_path = os.path.join(SOLICITUD_DIR, solicitud_name)
                                    save_table_to_csv(tabla3, solicitud_path)
                                except Exception as e:
                                    error_writer.writerow({"CODIGO": codigo, "URL": url, "ERROR_MESSAGE": f"tablaDatos.grafica3: {str(e)}"})
                        except Exception as e:
                            error_writer.writerow({"CODIGO": codigo, "URL": url, "ERROR_MESSAGE": f"radio_buttons: {str(e)}"})
                    except Exception as e:
                        error_writer.writerow({"CODIGO": codigo, "URL": url, "ERROR_MESSAGE": str(e)})
                total_processed += len(chunk)
                gc.collect()
    print(f"Errores guardados en {ERROR_CSV}")

if __name__ == "__main__":
    main()
