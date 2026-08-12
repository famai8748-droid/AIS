import asyncio
from typhoon_service import typhoon_service
async def test():
    print(await typhoon_service.is_typhoon_online())
    print(await typhoon_service.chat_with_typhoon('??????'))
asyncio.run(test())
