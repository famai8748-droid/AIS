# AI Configuration for FindSelf AIS Platform
# This file supports both local Ollama models and cloud fallback

import os

# ============================================================
# LOCAL OLLAMA SETTINGS
# ============================================================
OLLAMA_ENABLED = os.getenv("OLLAMA_ENABLED", "true").lower() == "true"
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma2:9b")

# Available local models for Ollama:
# - gemma2:9b        (Recommended) Thai good, ~5GB, fast
# - llama3.1:8b      (Safe) Thai stable, ~4GB  
# - phi3:mini        (Light) Thai OK, ~2.5GB
# - mistral:nemo     (New) Multi-lang, ~5GB
# - qwen2.5:7b       (Avoid) Thai good BUT has Chinese issues

# Server requirements for Ollama:
# Minimum: 4 CPU cores, 8GB RAM, 5GB disk (~3-5 tokens/sec)
# Recommended: 6+ CPU cores, 16GB RAM, SSD (~15-30 tokens/sec)
# Ideal: 8+ CPU cores, 32GB RAM, NVIDIA GPU 4GB+ VRAM (~40-80 tokens/sec)

# ============================================================
# CLOUD FALLBACK SETTINGS
# ============================================================
CLOUD_ENABLED = os.getenv("CLOUD_ENABLED", "true").lower() == "true"
CLOUD_PROVIDER = os.getenv("CLOUD_PROVIDER", "ais")  # ais | gemini | openai | openrouter

# AIS Cloud API (Enterprise - contact AIS for credentials)
AIS_CLOUD_API_KEY = os.getenv("AIS_CLOUD_API_KEY", "")
AIS_CLOUD_API_URL = os.getenv("AIS_CLOUD_API_URL", "https://api.ais.co.th/v1/chat")

# Google Gemini (Freemium - get free key at https://aistudio.google.com)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# OpenAI GPT-4o-mini (Cheap - ~$0.002/req)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# OpenRouter (Multi-model, pay-per-use)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemma-2-9b-it")

# ============================================================
# FALLBACK PRIORITY CHAIN
# ============================================================
# When Ollama local is offline, requests follow this order:
# 1. AIS Cloud API (lowest latency for Thai)
# 2. Gemini API (free tier available)
# 3. OpenAI GPT-4o-mini (best quality)
# 4. OpenRouter (flexible multi-model)

# ============================================================
# DEPLOYMENT COMMANDS
# ============================================================
# Pull recommended model:
#   ollama pull gemma2:9b
#
# Run with env overrides:
#   OLLAMA_MODEL=qwen2.5:7b python backend/main.py
#
# Disable local Ollama (cloud only):
#   OLLAMA_ENABLED=false python backend/main.py
#
# Docker compose deployment:
#   docker-compose up -d

# ============================================================
# MODEL COMPARISON TABLE
# ============================================================
# | Model          | Min RAM | GPU Rec  | Size    | Thai Quality | Chinese Issue |
# |----------------|---------|----------|---------|--------------|---------------|
# | gemma2:9b      | 8GB     | 4GB opt. | ~5GB    | Excellent    | No            |
# | llama3.1:8b    | 8GB     | 4GB opt. | ~4GB    | Excellent    | No            |
# | mistral:nemo   | 8GB     | 4GB opt. | ~5GB    | Very Good    | No            |
# | qwen2.5:7b     | 8GB     | 4GB opt. | ~5GB    | Very Good    | Yes (avoid)   |
# | phi3:mini      | 4GB     | None     | ~2.5GB  | Good         | No            |
# | qwen2.5:32b    | 20GB    | 8GB+     | ~19GB   | Excellent    | No            |
# | llama3.1:70b   | 40GB    | 24GB+    | ~40GB   | Excellent    | No            |