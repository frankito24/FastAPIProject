import os
import csv
import importlib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

MODELS = {
    'education': 'Education',
    'education_admition': 'EducationAdmition',
    'education_enrollment': 'EducationEnrollment',
    'education_municipality': 'EducationMunicipality',
    'hospital': 'Hospital',
    'hospital_activity': 'HospitalActivity',
    'hospital_municipality': 'HospitalMunicipality',
    'hospital_resources': 'HospitalResources',
    'municipality': 'Municipality',
    'municipality_demographics': 'MunicipalityDemographics',
}

MODEL_MODULES = {
    'Education': 'education',
    'EducationAdmition': 'education_admition',
    'EducationEnrollment': 'education_enrollment',
    'EducationMunicipality': 'education_municipality',
    'Hospital': 'hospital',
    'HospitalActivity': 'hospital_activity',
    'HospitalMunicipality': 'hospital_municipality',
    'HospitalResources': 'hospital_resources',
    'Municipality': 'municipality',
    'MunicipalityDemographics': 'municipality_demographics',
}

NORMALIZATION_PATH = os.path.join(os.path.dirname(__file__), '../downloads/normalizacion')

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Helper to get model class
MODEL_MODULE_PATH = 'api.models'
def get_model_class(model_name):
    module_file = MODEL_MODULES.get(model_name)
    if not module_file:
        raise ImportError(f"No module mapping for model {model_name}")
    module = importlib.import_module(f"{MODEL_MODULE_PATH}.{module_file}")
    return getattr(module, model_name)

def read_normalized_csvs():
    results = {}
    for filename in os.listdir(NORMALIZATION_PATH):
        if filename.endswith('.csv'):
            model_key = filename.replace('.csv', '')
            model_name = MODELS.get(model_key, model_key)
            file_path = os.path.join(NORMALIZATION_PATH, filename)
            with open(file_path, encoding='utf-8') as f:
                sample = f.read(1024)
                f.seek(0)
                try:
                    dialect = csv.Sniffer().sniff(sample)
                    delimiter = dialect.delimiter
                except Exception:
                    delimiter = ';'  # fallback
                reader = csv.DictReader(f, delimiter=delimiter)
                results[model_name] = [row for row in reader]
    return results

def save_to_db(normalized_data):
    session = Session()
    for model_name, rows in normalized_data.items():
        model_class = get_model_class(model_name)
        # Get model columns, skip autoincrement PK
        columns = [col.name for col in model_class.__table__.columns if not (col.primary_key and col.autoincrement)]
        # Find required PK columns (non-autoincrement)
        required_pks = [col.name for col in model_class.__table__.columns if col.primary_key and not col.autoincrement]
        objects = []
        skipped = 0
        for row in rows:
            # Only use columns that exist in the model
            data = {col: (row.get(col) or None) for col in columns if col in row}
            # Check required PKs
            missing_pk = False
            for pk in required_pks:
                if not data.get(pk):
                    print(f"WARNING: Skipping row for {model_name} due to missing PK '{pk}': {row}")
                    missing_pk = True
                    skipped += 1
                    break
            if missing_pk:
                continue
            obj = model_class(**data)
            objects.append(obj)
        if objects:
            session.bulk_save_objects(objects)
            session.commit()
            print(f"Inserted {len(objects)} rows into {model_name}. Skipped {skipped} rows.")
        else:
            print(f"No data for {model_name}. Skipped {skipped} rows.")
    session.close()

if __name__ == "__main__":
    normalized_data = read_normalized_csvs()
    save_to_db(normalized_data)
