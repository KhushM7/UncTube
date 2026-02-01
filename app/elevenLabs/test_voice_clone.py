#!/usr/bin/env python3
"""
Test script for ElevenLabs voice cloning with a FLAC file
This demonstrates the complete workflow: clone -> store -> generate speech
"""

import requests
import sys
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"
AUDIO_FILE = r"C:\Users\khush\Downloads\charles.flac"# REPLACE WITH YOUR ACTUAL FLAC FILE PATH
USER_ID = "test-user-123"  # You can use any unique user ID
VOICE_NAME = "My Cloned Voice"
VOICE_DESCRIPTION = "Voice cloned from FLAC file"
TEXT_TO_SPEAK = "Hello! This is a test of my cloned voice. It's amazing how realistic this sounds!"
OUTPUT_FILE = "cloned_voice_output.mp3"


def print_step(step_num, message):
    """Print a formatted step message"""
    print(f"\n{'=' * 60}")
    print(f"STEP {step_num}: {message}")
    print('=' * 60)


def print_success(message):
    """Print a success message"""
    print(f"✓ {message}")


def print_error(message):
    """Print an error message"""
    print(f"❌ ERROR: {message}")


def check_audio_file():
    """Check if the audio file exists"""
    if not Path(AUDIO_FILE).exists():
        print_error(f"Audio file '{AUDIO_FILE}' not found!")
        print("\nPlease update the AUDIO_FILE variable with your actual FLAC file path.")
        sys.exit(1)

    file_size = Path(AUDIO_FILE).stat().st_size / 1024  # Size in KB
    print(f"Audio file found: {AUDIO_FILE} ({file_size:.2f} KB)")


def clone_voice():
    """Step 1: Clone the voice"""
    print_step(1, "Cloning Voice")

    # Prepare the files and data
    files = {
        'audio_files': open(AUDIO_FILE, 'rb')
    }

    data = {
        'user_id': USER_ID,
        'voice_name': VOICE_NAME,
        'voice_description': VOICE_DESCRIPTION
    }

    # Make the request
    print(f"Uploading audio to: {BASE_URL}/api/voice/clone")
    print(f"User ID: {USER_ID}")
    print(f"Voice Name: {VOICE_NAME}")

    try:
        response = requests.post(
            f'{BASE_URL}/api/voice/clone',
            files=files,
            data=data
        )

        # Close the file
        files['audio_files'].close()

        # Check response
        if response.status_code == 200:
            result = response.json()
            voice_id = result.get('voice_id')
            print_success("Voice cloned successfully!")
            print(f"Voice ID: {voice_id}")
            return voice_id
        else:
            print_error(f"Failed to clone voice (Status: {response.status_code})")
            print(f"Response: {response.text}")
            sys.exit(1)

    except requests.exceptions.ConnectionError:
        print_error("Could not connect to the API server!")
        print("\nMake sure the server is running:")
        print("  uvicorn api_endpoints:app --reload")
        print("  or")
        print("  python api_endpoints.py")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)


def verify_voice_in_database(user_id):
    """Step 2: Verify the voice is stored in the database"""
    print_step(2, "Verifying Voice in Database")

    try:
        response = requests.get(f'{BASE_URL}/api/voice/{user_id}')

        if response.status_code == 200:
            result = response.json()
            print_success("Voice ID found in database!")
            print(f"User ID: {result.get('user_id')}")
            print(f"Voice ID: {result.get('voice_id')}")

            voice_info = result.get('voice_info')
            if voice_info:
                print(f"Voice Name: {voice_info.get('name')}")
                print(f"Voice Category: {voice_info.get('category')}")

            return result.get('voice_id')
        else:
            print_error(f"Failed to retrieve voice (Status: {response.status_code})")
            print(f"Response: {response.text}")
            sys.exit(1)

    except Exception as e:
        print_error(f"Error verifying voice: {e}")
        sys.exit(1)


def generate_speech(user_id, text):
    """Step 3: Generate speech using the cloned voice"""
    print_step(3, "Generating Speech with Cloned Voice")

    data = {
        'user_id': user_id,
        'text': text
    }

    print(f"Text to speak: '{text}'")
    print(f"Output file: {OUTPUT_FILE}")

    try:
        response = requests.post(
            f'{BASE_URL}/api/tts/generate',
            data=data
        )

        if response.status_code == 200:
            # Save the audio file
            with open(OUTPUT_FILE, 'wb') as f:
                f.write(response.content)

            file_size = Path(OUTPUT_FILE).stat().st_size / 1024  # Size in KB
            print_success("Speech generated successfully!")
            print(f"File saved: {OUTPUT_FILE} ({file_size:.2f} KB)")
            return OUTPUT_FILE
        else:
            print_error(f"Failed to generate speech (Status: {response.status_code})")
            print(f"Response: {response.text}")
            sys.exit(1)

    except Exception as e:
        print_error(f"Error generating speech: {e}")
        sys.exit(1)


def main():
    """Main test workflow"""
    print("\n" + "=" * 60)
    print("ElevenLabs Voice Cloning Test")
    print("=" * 60)

    # Check if audio file exists
    check_audio_file()

    # Step 1: Clone the voice
    voice_id = clone_voice()

    # Step 2: Verify it's in the database
    verify_voice_in_database(USER_ID)

    # Step 3: Generate speech
    output_file = generate_speech(USER_ID, TEXT_TO_SPEAK)

    # Final summary
    print("\n" + "=" * 60)
    print("✅ TEST COMPLETE!")
    print("=" * 60)
    print(f"\nSummary:")
    print(f"  • Voice cloned from: {AUDIO_FILE}")
    print(f"  • Voice ID: {voice_id}")
    print(f"  • User ID: {USER_ID}")
    print(f"  • Audio output: {output_file}")
    print(f"\nYou can now play the audio file:")
    print(f"  • macOS: afplay {output_file}")
    print(f"  • Linux: play {output_file}")
    print(f"  • Windows: start {output_file}")
    print(f"  • Or open it in your media player")
    print()


if __name__ == "__main__":
    main()