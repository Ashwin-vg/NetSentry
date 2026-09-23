from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import users_collection
from app.security.auth import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class AuthRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(data: AuthRequest):

    username = data.username.strip()

    if len(username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters"
        )

    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    existing_user = users_collection.find_one({
        "username": username
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )

    user = {
        "username": username,
        "password": hash_password(data.password)
    }

    users_collection.insert_one(user)

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login(data: AuthRequest):

    user = users_collection.find_one({
        "username": data.username.strip()
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        user["username"]
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }