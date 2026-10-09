"""Command-line entry point for ingesting NPTEL material into subject prep."""

import argparse
import logging
from pathlib import Path

from app.services.subject_ingestion.database import store_records
from app.services.subject_ingestion.parser import parse_material
from app.services.subject_ingestion.scraper import extract_pdf_text, fetch_transcripts

logger = logging.getLogger("subject_ingestion")


def run_pipeline(
    *,
    subject_name: str,
    playlist_id: str | None = None,
    video_ids: list[str] | None = None,
    pdf_paths: list[str] | None = None,
) -> int:
    """Fetch source text, parse it with Gemini, and persist validated questions."""
    sources: list[tuple[str, str]] = []
    if playlist_id or video_ids:
        sources.extend(
            (f"YouTube video {transcript.video_id}", transcript.text)
            for transcript in fetch_transcripts(playlist_id=playlist_id, video_ids=video_ids)
        )
    for pdf_path in pdf_paths or []:
        path = Path(pdf_path)
        sources.append((path.name, extract_pdf_text(path)))
    if not sources:
        raise ValueError("Provide a playlist ID, video ID, or at least one PDF path")

    records = []
    for source_label, source_text in sources:
        logger.info("Parsing %s", source_label)
        records.extend(parse_material(source_text, subject_name=subject_name, source_label=source_label))
    count = store_records(records)
    logger.info("Stored %d questions across %d preparation records", count, len(records))
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--subject", required=True, help="Subject name shown in the preparation module")
    parser.add_argument("--playlist-id", help="YouTube playlist ID")
    parser.add_argument("--video-id", action="append", dest="video_ids", help="YouTube video ID (repeatable)")
    parser.add_argument("--pdf", action="append", dest="pdf_paths", help="Local PDF path (repeatable)")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging")
    args = parser.parse_args()
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    try:
        run_pipeline(
            subject_name=args.subject,
            playlist_id=args.playlist_id,
            video_ids=args.video_ids,
            pdf_paths=args.pdf_paths,
        )
    except Exception as exc:
        logger.error("Subject ingestion failed: %s", exc)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()