from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from dotenv import load_dotenv
import os

load_dotenv()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

load_dotenv()
config.set_main_option(
    "sqlalchemy.url",
    os.getenv("DATABASE_URL")
)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
from api.models.municipality import Base as MunicipalityBase
from api.models.hospital import Base as HospitalBase
from api.models.education import Base as EducationBase
from api.models.education_admition import Base as EducationAdmitionBase
from api.models.education_enrollment import Base as EducationEnrollmentBase
from api.models.education_municipality import Base as EducationMunicipalityBase
from api.models.hospital_activity import Base as HospitalActivityBase
from api.models.hospital_municipality import Base as HospitalMunicipalityBase
from api.models.hospital_resources import Base as HospitalResourcesBase
from api.models.municipality_demographics import Base as MunicipalityDemographicsBase
from sqlalchemy import MetaData
# target_metadata = mymodel.Base.metadata
target_metadata = MunicipalityBase.metadata
# Merge hospital metadata
for table in HospitalBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge education metadata
for table in EducationBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge education_admition metadata
for table in EducationAdmitionBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge education_enrollment metadata
for table in EducationEnrollmentBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge education_municipality metadata
for table in EducationMunicipalityBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge hospital_activity metadata
for table in HospitalActivityBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge hospital_municipality metadata
for table in HospitalMunicipalityBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge hospital_resources metadata
for table in HospitalResourcesBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)
# Merge municipality_demographics metadata
for table in MunicipalityDemographicsBase.metadata.tables.values():
    target_metadata._add_table(table.name, table.schema, table)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
