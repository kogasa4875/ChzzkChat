document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.querySelector('.chat-messages');

    // 테스트를 위한 더미 메시지 추가 함수
    function addMessage(sender, message, isMine) {
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row');
        if (isMine) {
            messageRow.classList.add('mine');
        } else {
            messageRow.classList.add('other');
        }

        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        messageRow.innerHTML = `
            ${!isMine ? `<img class="profile-img" src="https://via.placeholder.com/40">` : ''}
            <div class="message-content">
                ${!isMine ? `<div class="message-sender">${sender}</div>` : ''}
                <div class="message-bubble">${message}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        chatMessages.appendChild(messageRow);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤을 항상 아래로
    }

    // 예시 메시지
    addMessage('치지직봇', '안녕하세요! 치지직톡에 오신 것을 환영합니다.', false);
    addMessage('시청자1', '오늘 방송 재밌네요!', false);
    addMessage('나', '감사합니다!', true);

   // ... 기존 코드 ...
// 웹소켓 URL을 받아오는 주소
const API_URL = `https://[랜덤문자].up.railway.app/.netlify/functions/chzzk-chat?channelId=${channelId}`;
// TODO: 이 변수들을 실제 로그인 과정을 통해 얻은 값으로 교체해야 합니다.
// 현재는 임시로 값을 넣어 테스트할 수 있습니다.
const YOUR_ACCESS_TOKEN = '여기에 여러분의 액세스 토큰을 넣으세요'; 
const CHAT_CHANNEL_ID = '여러분이 원하는 채팅 채널 ID';

sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();

    if (message && YOUR_ACCESS_TOKEN) {
        // 백엔드 서버의 메시지 전송 API를 호출합니다.
        fetch('chzzk-chat-backend.railway.internal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatChannelId: CHAT_CHANNEL_ID,
                message: message,
                accessToken: YOUR_ACCESS_TOKEN
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                console.log('메시지 전송 성공:', data);
                // 성공적으로 전송되면 화면에도 메시지를 추가합니다.
                addMessage('나', message, true); 
                chatInput.value = ''; // 입력창 비우기
            } else {
                console.error('메시지 전송 실패:', data.error);
                addMessage('시스템', '메시지 전송에 실패했습니다.', false);
            }
        })
        .catch(error => {
            console.error('네트워크 오류:', error);
            addMessage('시스템', '서버와 연결할 수 없습니다.', false);
        });
    }
});

// ... 기존 addMessage 함수 및 기타 코드 ...
    });

    // Enter 키 입력 시 메시지 전송
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // TODO: 여기에 치지직 API를 통해 실시간 채팅 메시지를 받아와 addMessage 함수로 추가하는 로직을 구현해야 합니다.
    // 백엔드 서버를 통해 치지직 WebSocket에 연결하고, 메시지를 프론트엔드로 전달받아야 합니다.
);
