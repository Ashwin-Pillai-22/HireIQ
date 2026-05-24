from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
MODEL_NAME = "qwen3:0.6b"
DB_KEY = os.getenv("DB_KEY")