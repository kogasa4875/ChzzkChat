// 이 부분은 치지직 채팅방의 WebSocket 주소를 알아내야 합니다.
// 개발자 도구(F12)의 네트워크 탭에서 "ws"로 필터링해서 찾을 수 있습니다.
const CHAT_WS_URL = "wss://.../live_chat_url";

const ws = new WebSocket(CHAT_WS_URL);

ws.onmessage = (event) => {
    const chatData = JSON.parse(event.data);
    // 채팅 데이터 구조를 분석해서 메시지 내용을 추출해야 합니다.
    const message = chatData.message;
    const sender = chatData.sender;

    // 카카오톡 UI에 맞게 메시지 HTML 요소를 만듭니다.
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'received');
    messageElement.innerHTML = `
        <img class="profile-pic" src="profile.png">
        <div class="message-bubble">${message}</div>
    `;

    document.querySelector('.chat-messages').appendChild(messageElement);
};
