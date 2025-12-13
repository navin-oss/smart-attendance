import os
import jwt
from datetime import datetime, timedelta
from typing import Optional

# Load secret & settings from env (set these in your .env)
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
# print(JWT_SECRET, JWT_ALGORITHM)

def create_jwt(user_id: str, role: str, email: str = None):
    print(JWT_SECRET)
    payload = {
        "sub": user_id,
        "role": role,
        "email": email,           # ← ADD EMAIL TO PAYLOAD
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=30),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt(token: str) -> dict:
    payload = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGORITHM)
    return payload
