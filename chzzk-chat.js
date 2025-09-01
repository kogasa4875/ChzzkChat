// functions/chzzk-chat.js

exports.handler = async (event) => {
  const { channelId } = event.queryStringParameters;
  
  if (!channelId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Channel ID is required." }),
    };
  }

  try {
    // 1. live-status 엔드포인트에서 라이브 정보 가져오기
    const liveStatusResponse = await fetch(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/live-status`);
    
    if (!liveStatusResponse.ok) {
      throw new Error(`Failed to fetch live status: ${liveStatusResponse.statusText}`);
    }
    
    const liveStatusData = await liveStatusResponse.json();
    const liveId = liveStatusData.content?.liveId;

    if (!liveId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Chat channel not found. Is the channel live?" }),
      };
    }
    
    // 2. 채팅 채널 ID를 가져오기
    const chatInfoResponse = await fetch(`https://api.chzzk.naver.com/service/v1/chats/access-token?chatChannelId=${liveId}&poll=false`);
    const chatInfoData = await chatInfoResponse.json();
    const chatChannelId = chatInfoData.content?.chatChannelId;

    if (!chatChannelId) {
      throw new Error("Failed to get chat channel ID.");
    }
    
    // 3. 웹소켓 URL 생성
    const webSocketUrl = `wss://api.chzzk.naver.com/service/v1/chats/ws?chatChannelId=${chatChannelId}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ webSocketUrl }),
    };

  } catch (error) {
    console.error('Error fetching WebSocket URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
