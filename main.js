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

    // 전송 버튼 클릭 시 메시지 추가
    sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('나', message, true); // 내가 보낸 메시지로 처리
            chatInput.value = ''; // 입력창 비우기
            // 실제 치지직 API를 연동하면, 여기서 API 호출을 통해 메시지를 전송합니다.
        }
    });

    // Enter 키 입력 시 메시지 전송
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // TODO: 여기에 치지직 API를 통해 실시간 채팅 메시지를 받아와 addMessage 함수로 추가하는 로직을 구현해야 합니다.
    // 백엔드 서버를 통해 치지직 WebSocket에 연결하고, 메시지를 프론트엔드로 전달받아야 합니다.
});
