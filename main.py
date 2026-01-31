from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import boto3
from dotenv import load_dotenv
from os import getenv
from typing import Optional, Any
from botocore.exceptions import ClientError

load_dotenv()

AWS_ACCESS_KEY_ID = getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = getenv("AWS_REGION")
AWS_S3_BUCKET = getenv("AWS_S3_BUCKET")
AWS_S3_ENDPOINT_URL = getenv("AWS_S3_ENDPOINT_URL")
AWS_S3_PUBLIC_BASE_URL = getenv("AWS_S3_PUBLIC_BASE_URL")
app = FastAPI()

s3_client: Optional[Any] = None
from botocore.config import Config # Import this

# Update your init_s3 function to include the config
@app.on_event("startup")
def init_s3() -> None:
    global s3_client
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY or not AWS_S3_BUCKET:
        s3_client = None
        return
    client_kwargs = {
        "region_name": AWS_REGION,
        "aws_access_key_id": AWS_ACCESS_KEY_ID,
        "aws_secret_access_key": AWS_SECRET_ACCESS_KEY,
        "config": Config(signature_version="s3v4"),  # Required for many S3-compatible providers
    }
    # Only set an explicit endpoint for S3-compatible providers (MinIO, DO Spaces, etc.).
    if AWS_S3_ENDPOINT_URL:
        client_kwargs["endpoint_url"] = AWS_S3_ENDPOINT_URL

    s3_client = boto3.client(
        "s3",
        **client_kwargs,
    )

@app.get("/")
async def read_root():
    if s3_client is None:
        raise HTTPException(status_code=500, detail="S3 client not initialized")

    # IMPORTANT: Use the literal filename. 
    # If your file has spaces, use spaces here, NOT '+' or '%20'.
    # Boto3 will handle the encoding for the signature.
    object_key = "Screenshot 2025-04-02 092801.png" 

    try:
        # Generate a URL that is valid for 1 hour (3600 seconds)
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': AWS_S3_BUCKET,
                'Key': object_key
            },
            ExpiresIn=3600
        )
        return {"url": presigned_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/image")
async def get_image(key: str = "Screenshot 2025-04-02 092801.png"):
    if s3_client is None:
        raise HTTPException(status_code=500, detail="S3 client not initialized")

    try:
        response = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=key)
    except ClientError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    content_type = response.get("ContentType") or "application/octet-stream"
    headers = {"Content-Disposition": f'inline; filename="{key}"'}
    return StreamingResponse(response["Body"], media_type=content_type, headers=headers)

@app.get("/video")
async def get_video(key: str = "Screen Recording 2025-11-15 175400.mp4"):
    if s3_client is None:
        raise HTTPException(status_code=500, detail="S3 client not initialized")

    try:
        response = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=key)
    except ClientError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    content_type = response.get("ContentType") or "application/octet-stream"
    headers = {"Content-Disposition": f'inline; filename="{key}"'}
    return StreamingResponse(response["Body"], media_type=content_type, headers=headers)

@app.get("/audio")
async def get_audio(key: str = "WhatsApp Ptt 2026-01-31 at 15.12.36.ogg"):
    if s3_client is None:
        raise HTTPException(status_code=500, detail="S3 client not initialized")

    try:
        response = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=key)
    except ClientError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    content_type = response.get("ContentType") or "application/octet-stream"
    headers = {"Content-Disposition": f'inline; filename="{key}"'}
    return StreamingResponse(response["Body"], media_type=content_type, headers=headers)