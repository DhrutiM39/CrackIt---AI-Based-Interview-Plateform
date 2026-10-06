"""Fetch transcripts and extract text from locally downloaded NPTEL PDFs."""

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import pdfplumber
from youtube_transcript_api import YouTubeTranscriptApi

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Transcript:
    video_id: str
    text: str


def _playlist_video_ids(playlist_id: str) -> list[str]:
    """Resolve a YouTube playlist to video IDs using yt-dlp's flat extractor."""
    try:
        from yt_dlp import YoutubeDL
    except ImportError as exc:
        raise RuntimeError("Install yt-dlp to fetch playlist transcripts") from exc

    playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"
    options = {"extract_flat": True, "quiet": True, "skip_download": True}
    try:
        with YoutubeDL(options) as downloader:
            playlist = downloader.extract_info(playlist_url, download=False)
    except Exception as exc:
        raise RuntimeError(f"Unable to read YouTube playlist {playlist_id}") from exc

    entries = (playlist or {}).get("entries") or []
    video_ids = [entry["id"] for entry in entries if entry and entry.get("id")]
    if not video_ids:
        raise ValueError(f"Playlist {playlist_id} did not contain any videos")
    return video_ids


def _transcript_text(video_id: str, languages: list[str]) -> str:
    """Support both current and legacy youtube-transcript-api releases."""
    if hasattr(YouTubeTranscriptApi, "get_transcript"):
        snippets = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
    else:
        snippets = YouTubeTranscriptApi().fetch(video_id, languages=languages)

    parts = []
    for snippet in snippets:
        text = snippet.get("text") if isinstance(snippet, dict) else getattr(snippet, "text", "")
        if text:
            parts.append(text.strip())
    return "\n".join(part for part in parts if part)


def fetch_transcripts(
    *,
    playlist_id: str | None = None,
    video_ids: Iterable[str] | None = None,
    languages: list[str] | None = None,
) -> list[Transcript]:
    """Fetch full available transcripts for playlist or explicitly supplied videos.

    Videos that lack a transcript are logged and skipped; if none are fetched,
    a RuntimeError is raised so the pipeline cannot silently store an empty run.
    """
    ids = list(video_ids or [])
    if playlist_id:
        ids.extend(_playlist_video_ids(playlist_id))
    ids = list(dict.fromkeys(video_id.strip() for video_id in ids if video_id.strip()))
    if not ids:
        raise ValueError("Provide a playlist_id or at least one video_id")

    preferred_languages = languages or ["en"]
    transcripts = []
    for video_id in ids:
        try:
            text = _transcript_text(video_id, preferred_languages)
            if text:
                transcripts.append(Transcript(video_id=video_id, text=text))
            else:
                logger.warning("No transcript text returned for YouTube video %s", video_id)
        except Exception:
            logger.warning("Could not fetch transcript for YouTube video %s", video_id, exc_info=True)

    if not transcripts:
        raise RuntimeError("No transcripts could be fetched for the supplied videos")
    return transcripts


def extract_pdf_text(pdf_path: str | Path) -> str:
    """Extract text page by page from a locally downloaded PDF."""
    path = Path(pdf_path)
    if not path.is_file():
        raise FileNotFoundError(f"PDF file not found: {path}")

    try:
        with pdfplumber.open(path) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
    except Exception as exc:
        raise RuntimeError(f"Unable to extract text from PDF: {path}") from exc

    text = "\n\n".join(page.strip() for page in pages if page.strip())
    if not text:
        raise ValueError(f"PDF contains no extractable text: {path}")
    return text