import os
import csv
import glob
import re

INPUT_DIR = "../downloads/hospital_poblacion_asignada_csvs"

def main():
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        hospital_name = os.path.splitext(os.path.basename(filepath))[0]
        municipio = None
        try:
            with open(filepath, encoding='utf-8') as f:
                content = f.read()
                # extract municipalities from the note section
                municipios = set()
                lines = content.splitlines()
                note_text = None
                # find the note start line containing 'población asignada'
                for idx, line in enumerate(lines):
                    if 'población asignada al hospital' in line.lower():
                        # collect this line and subsequent continuation lines
                        note_parts = [line.rstrip(';')]
                        j = idx + 1
                        while j < len(lines):
                            nxt = lines[j].strip()
                            if not nxt or nxt.lower().startswith('notas'):
                                break
                            note_parts.append(nxt.rstrip(';'))
                            j += 1
                        note_text = ' '.join(note_parts)
                        break
                if note_text:
                    # extract substring after 'municipios de'
                    start = note_text.lower().find('municipios de')
                    if start != -1:
                        list_text = note_text[start + len('municipios de'):]
                        # split on comma or semicolon
                        for part in re.split(r'[;,]', list_text):
                            name = part.strip()
                            if name:
                                municipios.add(name)
                else:
                    # fallback inline 'del municipio de'
                    for line in lines:
                        m_inline = re.search(r'del municipio de\s*([A-Za-zÁÉÍÓÚáéíóúñÑ \-]+)', line, re.IGNORECASE)
                        if m_inline:
                            municipios.add(m_inline.group(1).strip())
                if municipios:
                    print(f"Hospital: {hospital_name} -> Municipios: {', '.join(sorted(municipios))}")
                else:
                    print(f"ERROR: No se pudo determinar el municipio para el hospital: {hospital_name}")
        except Exception as e:
            print(f"ERROR: {hospital_name} -> {str(e)}")

if __name__ == "__main__":
    main()
