# AgriScheme AI Backend

## Windows PowerShell setup

```powershell
cd C:\Users\User\Downloads\AgriScheme_backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m pytest tests/test_features.py -q
uvicorn app.main:app --reload
```

If `pytest` shows `ModuleNotFoundError: No module named 'app'`, run this before tests:

```powershell
$env:PYTHONPATH = "."
python -m pytest tests/test_features.py -q
```

If you want to recreate the ML embeddings first:

```powershell
python app/ml/train_embeddings.py
```
