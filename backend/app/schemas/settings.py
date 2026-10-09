from pydantic import BaseModel
from typing import Optional


class SettingsResponse(BaseModel):
    id: Optional[int] = None
    theme: str = "dark"
    language: str = "en"
    email_notifications: bool = True
    push_notifications: bool = True


class SettingsUpdateRequest(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
