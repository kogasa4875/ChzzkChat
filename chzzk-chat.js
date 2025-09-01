// functions/chzzk-chat.js

exports.handler = async (event) => {
  const { channelId } = event.queryStringParameters;
  
  if (!channelId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Channel ID is required." }),
    };
  }

  // 재시도 로직을 위한 헬퍼 함수
  const fetchWithRetry = async (url, options = {}, retries = 3) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      const isNetworkError = error.message.includes('Failed to fetch') || error.message.includes('ECONNRESET');
      if (retries > 0 && isNetworkError) {
        console.log(`Fetch failed, retrying... (${retries} retries left)`);
        await new Promise(res => setTimeout(res, 1000)); // 1초 대기 후 재시도
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  try {
    // live-status 엔드포인트에서 라이브 정보 가져오기
    const liveStatusResponse = await fetchWithRetry(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/live-status`);
    const liveStatusData = await liveStatusResponse.json();
    const liveId = liveStatusData.content?.liveId;

    if (!liveId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Chat channel not found. Is the channel live?" }),
      };
    }
    
    // 채팅 채널 ID를 가져오기
    const chatInfoResponse = await fetchWithRetry(`https://api.chzzk.naver.com/service/v1/chats/access-token?chatChannelId=${liveId}&poll=false`);
    const chatInfoData = await chatInfoResponse.json();
    const chatChannelId = chatInfoData.content?.chatChannelId;

    if (!chatChannelId) {
      throw new Error("Failed to get chat channel ID.");
    }
    
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
