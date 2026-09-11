from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class DikshaSettings:
    """Runtime settings. Never commit credentials to the repository."""

    base_url: str = "https://diksha.gov.in"
    api_key: str | None = None
    channel_id: str | None = None
    timeout_seconds: float = 20.0

    @classmethod
    def from_environment(cls) -> "DikshaSettings":
        return cls(
            base_url=os.getenv("DIKSHA_BASE_URL", "https://diksha.gov.in").rstrip("/"),
            api_key=os.getenv("DIKSHA_API_KEY") or None,
            channel_id=os.getenv("DIKSHA_CHANNEL_ID") or None,
            timeout_seconds=float(os.getenv("DIKSHA_TIMEOUT_SECONDS", "20")),
        )
