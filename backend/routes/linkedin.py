from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import requests

from db import get_db
from models import LinkedInUser
from config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

router = APIRouter(prefix="/linkedin", tags=["LinkedIn"])

FRONTEND_URL = "http://localhost:5176"


# 🔹 Step 1: Login — redirects user to LinkedIn OAuth
@router.get("/login")
def login():
    url = (
        "https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=openid profile w_member_social"
    )
    return {"auth_url": url}


# 🔹 Step 2: Callback — LinkedIn redirects here after user approves
@router.get("/callback")
def callback(code: str, db: Session = Depends(get_db)):
    try:
        # Exchange code for access token
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }

        res = requests.post(token_url, data=data)
        token_data = res.json()

        if "access_token" not in token_data:
            return RedirectResponse(f"{FRONTEND_URL}?linkedin=error&message=token_failed")

        access_token = token_data["access_token"]

        # Get user info
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info = requests.get("https://api.linkedin.com/v2/userinfo", headers=headers).json()
        linkedin_id = user_info.get("sub")

        if not linkedin_id:
            return RedirectResponse(f"{FRONTEND_URL}?linkedin=error&message=no_user_id")

        # Save or update user in DB
        existing_user = db.query(LinkedInUser).filter(LinkedInUser.linkedin_id == linkedin_id).first()
        if existing_user:
            existing_user.access_token = access_token
        else:
            user = LinkedInUser(linkedin_id=linkedin_id, access_token=access_token)
            db.add(user)
        db.commit()

        # Redirect back to frontend with success
        return RedirectResponse(f"{FRONTEND_URL}?linkedin=success")

    except Exception as e:
        return RedirectResponse(f"{FRONTEND_URL}?linkedin=error&message={str(e)}")


# 🔹 Check if a LinkedIn account is connected
@router.get("/status")
def status(db: Session = Depends(get_db)):
    user = db.query(LinkedInUser).first()
    if user:
        return {"connected": True, "linkedin_id": user.linkedin_id}
    return {"connected": False}


# 🔹 Step 3: Post Content
@router.post("/post")
def post(text: str, db: Session = Depends(get_db)):
    user = db.query(LinkedInUser).first()
    if not user:
        raise HTTPException(status_code=404, detail="No LinkedIn account connected. Please connect first.")

    access_token = user.access_token
    linkedin_id = user.linkedin_id

    url = "https://api.linkedin.com/v2/ugcPosts"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }

    data = {
        "author": f"urn:li:person:{linkedin_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code != 201:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"LinkedIn API error: {response.json()}"
        )

    return {"message": "Posted successfully!", "response": response.json()}