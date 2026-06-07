from fastapi import Header, HTTPException
from app.core.config import API_KEY

API_KEYS = {API_KEY: 5}
SECRET_KEY = "Secret_key"

def verify_api_key(x_api_key: str = Header(None)):
    credits = API_KEYS.get(x_api_key, 0)

    if credits <= 0:
        raise HTTPException(status_code=401, detail="Invalid key or no credits")

    API_KEYS[x_api_key] -= 1
    return x_api_key

def verify_api_key_readonly(x_api_key: str = Header(None)):
    credits = API_KEYS.get(x_api_key, 0)

    if credits <= 0:
        raise HTTPException(status_code=401, detail="Invalid key or no credits")

    # Don't decrement credits for read operations
    return x_api_key

def verify_authenticated_user(x_api_key: str = Header(None), x_user_id: str = Header(None)):
    """
    Allow access if user has valid API key OR is authenticated (has user_id header)
    This allows Firebase-authenticated users to bypass API key requirements
    """
    # Check if user has valid API key
    if x_api_key and x_api_key in API_KEYS and API_KEYS[x_api_key] > 0:
        API_KEYS[x_api_key] -= 1
        return x_api_key

    # Check if user is authenticated (has user_id from frontend)
    if x_user_id:
        return f"authenticated_user_{x_user_id}"

    raise HTTPException(status_code=401, detail="Authentication required")

def verify_authenticated_user_readonly(x_api_key: str = Header(None), x_user_id: str = Header(None)):
    """
    Allow access if user has valid API key OR is authenticated (has user_id header)
    Read-only version that doesn't consume credits
    """
    # Check if user has valid API key
    if x_api_key and x_api_key in API_KEYS and API_KEYS[x_api_key] > 0:
        return x_api_key

    # Check if user is authenticated (has user_id from frontend)
    if x_user_id:
        return f"authenticated_user_{x_user_id}"

    raise HTTPException(status_code=401, detail="Authentication required")