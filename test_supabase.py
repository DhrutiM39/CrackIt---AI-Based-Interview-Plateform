"""One-row Supabase smoke test using backend/.env credentials."""

import os
import traceback
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client


load_dotenv(Path(__file__).resolve().parent / "backend" / ".env")


def main() -> None:
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    topic_id_value = os.getenv("SUPABASE_TEST_TOPIC_ID")

    if not supabase_url or not service_role_key:
        raise RuntimeError("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env")
    if not topic_id_value:
        raise RuntimeError("Set SUPABASE_TEST_TOPIC_ID to an existing topics.id in backend/.env")

    try:
        topic_id = int(topic_id_value)
    except ValueError as exc:
        raise RuntimeError("SUPABASE_TEST_TOPIC_ID must be an integer") from exc

    client = create_client(supabase_url, service_role_key)
    payload = {
        "topic_id": topic_id,
        "question": "Smoke test: what is the purpose of this record?",
        "answer": "Verify service-role insertion into the questions table.",
        "difficulty": "Easy",
    }

    try:
        result = client.table("questions").insert(payload).execute()
        print("Supabase insert succeeded:", result.data)
    except Exception as exc:
        print("Supabase insert failed:", exc)
        traceback.print_exc()
        raise


if __name__ == "__main__":
    main()
