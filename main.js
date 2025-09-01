document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.querySelector('.chat-messages');

    // **여러분의 치지직 채널 ID와 백엔드 서버 주소**
    const CHAT_CHANNEL_ID = 'f5feedab25060a675ed62f3348e625cf';
    const BACKEND_URL = 'https://chzzk-chat-backend.up.railway.app';
    
    // TODO: 이 액세스 토큰은 실제 로그인 과정을 통해 얻어야 합니다.
    // 현재는 테스트를 위해 유효한 토큰을 임시로 넣을 수 있습니다.
    const YOUR_ACCESS_TOKEN = '여기에 여러분의 액세스 토큰을 넣으세요';

    // Netlify Function을 통해 웹소켓 URL을 받아옵니다.
    const API_URL = `/.netlify/functions/chzzk-chat?channelId=${CHAT_CHANNEL_ID}`;

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
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 예시 메시지
    addMessage('치지직봇', '안녕하세요! 치지직톡에 오신 것을 환영합니다.', false);
    addMessage('시청자1', '오늘 방송 재밌네요!', false);
    addMessage('나', '감사합니다!', true);

    // Netlify Function을 호출하여 웹소켓 URL 가져오기
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.webSocketUrl) {
                const ws = new WebSocket(data.webSocketUrl);

                ws.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);
                    if (messageData.T === 'chat') {
                        const sender = messageData.sender.nickname;
                        const message = messageData.message;
                        const isMine = messageData.sender.nickname === '자신의 닉네임';
                        addMessage(sender, message, isMine);
                    }
                };

                ws.onopen = () => {
                    console.log("WebSocket 연결 성공");
                };
                ws.onclose = () => {
                    console.log("WebSocket 연결 종료");
                };
                ws.onerror = (error) => {
                    console.error("WebSocket 오류 발생:", error);
                };
            } else {
                addMessage('시스템', data.error || '채팅 정보를 불러올 수 없습니다.', false);
            }
        })
        .catch(error => {
            console.error('API 호출 실패:', error);
            addMessage('시스템', '채팅 서버 연결에 실패했습니다.', false);
        });

    sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();

        if (message && YOUR_ACCESS_TOKEN) {
            // Railway 백엔드 서버로 메시지 전송 API를 호출
            fetch(`${BACKEND_URL}/api/send-chat`, {
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
                    addMessage('나', message, true);
                    chatInput.value = '';
                } else {
                    console.error('메시지 전송 실패:', data.error);
                    addMessage('시스템', '메시지 전송에 실패했습니다.', false);
                }
            })
            .catch(error => {
                console.log('네트워크 오류:', error);
                addMessage('시스템', '서버와 연결할 수 없습니다.', false);
            });
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
