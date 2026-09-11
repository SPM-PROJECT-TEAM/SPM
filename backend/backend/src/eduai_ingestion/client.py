from __future__ import annotations

from typing import Any

import httpx

from .config import DikshaSettings
from .models import SyllabusQuery


class DikshaApiError(RuntimeError):
    """Raised when DIKSHA returns a non-successful API envelope."""


class DikshaClient:
    CONTENT_SEARCH_PATH = "/api/content/v1/search"
    FRAMEWORK_READ_PATH = "/api/framework/v1/read/{framework_id}"

    def __init__(self, settings: DikshaSettings | None = None, client: httpx.AsyncClient | None = None) -> None:
        self.settings = settings or DikshaSettings.from_environment()
        self._client = client

    def _headers(self) -> dict[str, str]:
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        if self.settings.api_key:
            headers["Authorization"] = self.settings.api_key
        if self.settings.channel_id:
            headers["X-Channel-Id"] = self.settings.channel_id
        return headers

    async def search_content(self, query: SyllabusQuery) -> dict[str, Any]:
        if not 1 <= query.limit <= 1000:
            raise ValueError("limit must be between 1 and 1000")
        payload = {
            "request": {
                "filters": query.filters(),
                "limit": query.limit,
                "offset": query.offset,
                "fields": ["identifier", "name", "board", "gradeLevel", "subject", "topics", "contentType", "medium"],
            }
        }
        return await self._request("POST", self.CONTENT_SEARCH_PATH, json=payload)

    async def read_framework(self, framework_id: str) -> dict[str, Any]:
        if not framework_id.strip():
            raise ValueError("framework_id cannot be empty")
        return await self._request("GET", self.FRAMEWORK_READ_PATH.format(framework_id=framework_id))

    async def _request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        owns_client = self._client is None
        client = self._client or httpx.AsyncClient(base_url=self.settings.base_url, timeout=self.settings.timeout_seconds)
        try:
            response = await client.request(method, path, headers=self._headers(), **kwargs)
            response.raise_for_status()
            body = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise DikshaApiError(f"DIKSHA request failed for {method} {path}: {error}") from error
        finally:
            if owns_client:
                await client.aclose()

        if body.get("responseCode") not in (None, "OK"):
            details = body.get("params", {}).get("errmsg", "Unknown DIKSHA API error")
            raise DikshaApiError(f"DIKSHA returned {body.get('responseCode')}: {details}")
        return body
