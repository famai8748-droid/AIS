import asyncio
from openai import AsyncOpenAI
async def test():
    try:
        client = AsyncOpenAI(api_key='sk-5dGrv8Dl6WTeMHWkctsZlJZkBZVxqi6oBJRWcGVNn5y61IfF', base_url='https://api.opentyphoon.ai/v1')
        res = await client.chat.completions.create(model='typhoon-v2.5-30b-a3b-instruct', messages=[{'role': 'user', 'content': 'hi'}])
        print(res.choices[0].message.content)
    except Exception as e:
        print(e)
asyncio.run(test())
