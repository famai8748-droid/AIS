# AI Configuration for FindSelf AIS Platform
# This file supports OpenTyphoon Cloud API

import os

# ============================================================
# TYPHOON CLOUD SETTINGS
# ============================================================
TYPHOON_ENABLED = os.getenv("TYPHOON_ENABLED", "true").lower() == "true"
TYPHOON_API_KEY = os.getenv("TYPHOON_API_KEY", "sk-5dGrv8Dl6WTeMHWkctsZlJZkBZVxqi6oBJRWcGVNn5y61IfF")
TYPHOON_BASE_URL = os.getenv("TYPHOON_BASE_URL", "https://api.opentyphoon.ai/v1")
TYPHOON_MODEL = os.getenv("TYPHOON_MODEL", "typhoon-v2.5-30b-a3b-instruct")

# ============================================================
# CLOUD FALLBACK SETTINGS
# ============================================================
CLOUD_ENABLED = os.getenv("CLOUD_ENABLED", "true").lower() == "true"
CLOUD_PROVIDER = os.getenv("CLOUD_PROVIDER", "typhoon")  # typhoon | ais | gemini | openai | openrouter