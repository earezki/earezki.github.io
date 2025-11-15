FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

RUN apt-get update \
     && apt-get install -y --no-install-recommends \
         build-essential \
         git \
         wget \
         ca-certificates \
         libpq-dev \
     && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

RUN python -m pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /app/requirements.txt

RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app

COPY ./server /app

EXPOSE 8000

# Environment defaults for low-power CPUs (J4125)
ENV OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    OPENBLAS_NUM_THREADS=1 \
    UVICORN_WORKERS=1 \
    UVICORN_TIMEOUT=120

USER appuser

# Run the API with Uvicorn. Use 1 worker by default to limit CPU use; you can
# override UVICORN_WORKERS at runtime if you have more CPU.
CMD ["sh", "-c", "exec uvicorn api:app --host 0.0.0.0 --port 8000 --workers ${UVICORN_WORKERS} --timeout-keep-alive ${UVICORN_TIMEOUT}"]
