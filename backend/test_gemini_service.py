import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Add current directory to path so we can import services
sys.path.append(os.getcwd())

async def test_gemini():
    try:
        from services.gemini_service import stream_chat
        print("Testing Gemini Service with gemini-2.5-flash...")
        async for chunk in stream_chat("You are a helpful fitness assistant.", [], "Hello, can you help me?"):
            print(chunk, end="", flush=True)
        print("\n\nTest successful!")
    except Exception as e:
        print(f"\nTest failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
