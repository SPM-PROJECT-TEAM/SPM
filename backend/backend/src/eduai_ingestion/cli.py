from __future__ import annotations

import argparse
import asyncio
import json
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

from .client import DikshaClient
from .models import SyllabusQuery
from .service import SyllabusIngestionService


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Create an EduAI curriculum snapshot from DIKSHA.")
    parser.add_argument("--board", required=True, help="DIKSHA board label, for example CBSE")
    parser.add_argument("--grade", help="DIKSHA grade label, for example 'Class 10'")
    parser.add_argument("--subject", help="DIKSHA subject label, for example Mathematics")
    parser.add_argument("--medium", help="Optional medium label")
    parser.add_argument("--framework-id", help="Optional framework to retrieve with taxonomy data")
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--output", type=Path, help="Destination JSON path")
    return parser


async def run(args: argparse.Namespace) -> Path:
    query = SyllabusQuery(args.board, args.grade, args.subject, args.medium, args.limit, args.offset)
    snapshot = await SyllabusIngestionService(DikshaClient()).ingest(query, args.framework_id)
    destination = args.output or Path("data/snapshots") / f"diksha-{datetime.now(timezone.utc):%Y%m%dT%H%M%SZ}.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(asdict(snapshot), default=str, ensure_ascii=False, indent=2), encoding="utf-8")
    return destination


def main() -> None:
    args = build_parser().parse_args()
    destination = asyncio.run(run(args))
    print(f"Saved DIKSHA curriculum snapshot to {destination}")
