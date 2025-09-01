// functions/chzzk-chat.js
const axios = require('axios');
const axiosRetry = require('axios-retry');

// axios에 재시도 로직을 추가합니다.
axiosRetry(axios, {
  retries: 3, // 최대 3번 재시도
  retryDelay: axiosRetry.exponentialDelay, // 재시도 간격을 지수적으로 증가시켜 서버에 부담을 줄입니다.
  retryCondition: (error) => {
    // ECONNRESET 오류나 네트워크 관련 오류일 때만 재시도합니다.
    return error.code === 'ECONNRESET' || axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

exports.handler = async (event) => {
  const { channelId } = event.queryStringParameters;

  if (!channelId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Channel ID is required." }),
    };
  }

  try {
    // 라이브 상태를 조회하여 채팅 채널 ID를 가져옵니다.
    const chatInfoRes = await axios.get(`https://api.chzzk.naver.com/service/v1/chats/access-token?chatChannelId=${channelId}`);
    const chatChannelId = chatInfoRes.data.content.chatChannelId;

    if (!chatChannelId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Chat channel not found. Is the channel live?" }),
      };
    }

    // 웹소켓 URL을 생성합니다.
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
