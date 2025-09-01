const axios = require('axios');

exports.handler = async (event) => {
  const { channelId } = event.queryStringParameters;
  
  if (!channelId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Channel ID is required." }),
    };
  }

  try {
    // 1. 방송 상태 조회 API 호출 (실시간 방송 ID 획득)
    const liveStatusRes = await axios.get(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/live-status`);
    const liveId = liveStatusRes.data.content.liveId;

    if (!liveId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Channel is not live." }),
      };
    }
    
    // 2. 채팅 채널 ID 획득
    const chatChannelIdRes = await axios.get(`https://api.chzzk.naver.com/service/v1/chats/access-token?chatChannelId=${liveId}&poll=false`);
    const chatChannelId = chatChannelIdRes.data.content.chatChannelId;

    // 3. 채팅 웹소켓 URL 생성
    const webSocketUrl = `wss://api.chzzk.naver.com/service/v1/chats/ws?chatChannelId=${chatChannelId}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ webSocketUrl }),
    };

  } catch (error) {
    console.error('Error fetching WebSocket URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch WebSocket URL." }),
    };
  }
};
