from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Allow React dev server
    "http://localhost:5173", # Allow Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/info")
async def get_info(url: str):
    ydl_opts = {}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        formats = []
        for f in info.get('formats', []):
            formats.append({
                'format_id': f.get('format_id'),
                'ext': f.get('ext'),
                'resolution': f.get('resolution'),
                'fps': f.get('fps'),
                'note': f.get('format_note'),
            })
        return {
            "title": info.get('title'),
            "thumbnail": info.get('thumbnail'),
            "formats": formats
        }

@app.get("/api/download")
async def download_video(url: str, format_id: str):
    ydl_opts = {
        'format': format_id,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {"url": info['url']}
