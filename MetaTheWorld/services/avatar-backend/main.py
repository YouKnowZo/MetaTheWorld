from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/generate-avatar")
async def generate_avatar(file: UploadFile = File(...)):
    # In a real implementation, you would process the uploaded image here
    # using the LAM model to generate the 3D avatar.
    # For now, we'll just return a placeholder response.
    print(f"Received file: {file.filename}, content type: {file.content_type}")
    return JSONResponse({"message": "Avatar generation request received", "filename": file.filename, "avatar_id": "placeholder_id"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
