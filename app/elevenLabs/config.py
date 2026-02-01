"""
Configuration management for ElevenLabs and Supabase integration
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration"""

    # ElevenLabs Configuration
    ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')

    # Validate required configuration
    @classmethod
    def validate(cls):
        """Validate that all required config values are present"""
        missing = []

        if not cls.ELEVENLABS_API_KEY:
            missing.append('ELEVENLABS_API_KEY')
        if not cls.SUPABASE_URL:
            missing.append('SUPABASE_URL')
        if not cls.SUPABASE_KEY:
            missing.append('SUPABASE_KEY')

        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

        return True