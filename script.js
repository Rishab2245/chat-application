class ChatApp {
  constructor() {
    this.messageCount = 1;
    this.isDarkMode = false;
    this.currentChat = 'ai';

    this.chatData = {
      ai: {
        name: 'AI Assistant',
        avatar: 'AI',
        status: 'Online • Always ready to help',
        responses: [
          "That's interesting! Tell me more.",
          "I understand. How can I help you with that?",
          "Great question! Let me think about that.",
          "I'm here to assist you with anything you need.",
          "That sounds like a good plan. What's your next step?",
          "I see what you mean. Have you considered other options?",
          "Excellent point! I hadn't thought of it that way.",
          "Thanks for sharing that with me. How do you feel about it?"
        ]
      },
      js: {
        name: 'JavaScript Bot',
        avatar: 'JS',
        status: 'Online • Ready for coding questions',
        responses: [
          "Let's solve this JavaScript problem together!",
          "That's a common JS issue. Here's what I suggest...",
          "Have you tried using async/await for that?",
          "Consider using array methods like map() or filter().",
          "That sounds like a great use case for closures!",
          "ES6 features can make that code much cleaner.",
          "Don't forget to handle error cases in your code.",
          "Performance optimization is key in JavaScript!"
        ]
      },
      design: {
        name: 'Web Design Bot',
        avatar: 'WD',
        status: 'Online • Creative and ready',
        responses: [
          "Great design question! Let's explore some ideas.",
          "Consider the user experience first in your design.",
          "Color psychology plays a big role in UI design.",
          "Mobile-first approach is always recommended.",
          "Whitespace is just as important as content!",
          "Accessibility should be a priority in every design.",
          "Typography can make or break your design.",
          "Let's think about the visual hierarchy here."
        ]
      },
      support: {
        name: 'Support Team',
        avatar: 'SP',
        status: 'Online • Here to help',
        responses: [
          "I'm here to help resolve your issue quickly.",
          "Let me guide you through the troubleshooting steps.",
          "Have you tried clearing your browser cache?",
          "Can you provide more details about the problem?",
          "I'll escalate this to our technical team if needed.",
          "Your feedback helps us improve our service.",
          "Let's work together to find a solution.",
          "Is there anything else I can assist you with?"
        ]
      },
      creative: {
        name: 'Creative Bot',
        avatar: 'CR',
        status: 'Online • Bursting with ideas',
        responses: [
          "What an exciting creative challenge!",
          "Let's brainstorm some innovative ideas together.",
          "Creativity flows when we think outside the box.",
          "Every great project starts with a spark of inspiration.",
          "Don't be afraid to experiment with bold concepts.",
          "Sometimes the best ideas come from unexpected places.",
          "Art and technology can create amazing experiences.",
          "Your unique perspective is what makes creativity special."
        ]
      }
    };

    this.initializeElements();
    this.bindEvents();
    this.autoResizeTextarea();
    this.setupChatSelection();
  }

  initializeElements() {
    this.messageInput      = document.getElementById('messageInput');
    this.sendButton        = document.getElementById('sendButton');
    this.chatMessages      = document.getElementById('chatMessages');
    this.typingIndicator   = document.getElementById('typingIndicator');
    this.themeToggle       = document.getElementById('themeToggle');
    this.menuToggle        = document.getElementById('menuToggle');
    this.sidebar           = document.getElementById('sidebar');
    this.messageCountEl    = document.getElementById('messageCount');
    this.currentThemeEl    = document.getElementById('currentTheme');
    this.currentChatAvatar = document.getElementById('currentChatAvatar');
    this.currentChatName   = document.getElementById('currentChatName');
    this.currentChatStatus = document.getElementById('currentChatStatus');
    this.chatItems         = document.querySelectorAll('.chat-item');
  }

  bindEvents() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.menuToggle.addEventListener('click', () => this.toggleSidebar());

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!this.sidebar.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.sidebar.classList.add('collapsed');
        }
      }
    });
  }

  setupChatSelection() {
    this.chatItems.forEach(item => {
      item.addEventListener('click', () => {
        const chatId = item.getAttribute('data-chat');
        this.switchChat(chatId);

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
          this.sidebar.classList.add('collapsed');
        }
      });
    });
  }

  switchChat(chatId) {
    if (chatId === this.currentChat) return;

    // Update active chat item
    this.chatItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-chat="${chatId}"]`).classList.add('active');

    // Update current chat
    this.currentChat = chatId;
    const chatInfo = this.chatData[chatId];

    // Update header
    this.currentChatAvatar.textContent = chatInfo.avatar;
    this.currentChatName.textContent   = chatInfo.name;
    this.currentChatStatus.textContent = chatInfo.status;

    // Clear chat messages and add welcome message
    this.clearChat();
    this.addWelcomeMessage(chatId);

    // Reset message count for new chat
    this.messageCount = 1;
    this.updateMessageCount();
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
  }

  addWelcomeMessage(chatId) {
    const welcomeMessages = {
      ai:      "Hello! I'm your AI assistant. How can I help you today?",
      js:      "Hey there! Ready to dive into some JavaScript coding?",
      design:  "Welcome! Let's create something beautiful together.",
      support: "Hi! I'm here to help you with any technical issues.",
      creative:"Hello, creative soul! What inspiring project shall we work on?"
    };
    this.addMessage(welcomeMessages[chatId] || welcomeMessages.ai, 'bot', true);
  }

  autoResizeTextarea() {
    // Recalculate height so long texts push the textarea to grow up to 120px
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';

    // Enable/disable send button
    const hasText = this.messageInput.value.trim().length > 0;
    this.sendButton.disabled = !hasText;
  }

  sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.messageInput.value = '';
    this.autoResizeTextarea();
    this.messageCount++;
    this.updateMessageCount();

    // Simulate a bot response
    this.showTypingIndicator();
    const responseDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addBotResponse();
    }, responseDelay);
  }

  addMessage(text, sender, isWelcome = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let statusHtml = '';
    if (sender === 'user') {
      statusHtml = `
        <div class="message-status">
          <svg class="status-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Sent
        </div>
      `;
    } else if (sender === 'bot' && !isWelcome) {
      statusHtml = `
        <div class="message-status">
          <svg class="status-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Delivered
        </div>
      `;
    }

    messageDiv.innerHTML = `
      <div class="message-bubble">
        ${text}
        <div class="message-time">${time}</div>
        ${statusHtml}
      </div>
    `;

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();

    // If it’s a user bubble, flip “Sent” → “Delivered” after a second
    if (sender === 'user') {
      setTimeout(() => {
        const statusDiv = messageDiv.querySelector('.message-status');
        if (statusDiv) {
          statusDiv.innerHTML = `
            <svg class="status-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Delivered
          `;
        }
      }, 1000);
    }
  }

  addBotResponse() {
    const chatInfo = this.chatData[this.currentChat];
    const responses = chatInfo.responses;
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.addMessage(response, 'bot');
    this.messageCount++;
    this.updateMessageCount();
  }

  showTypingIndicator() {
    this.typingIndicator.style.display = 'flex';
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.typingIndicator.style.display = 'none';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 100);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.themeToggle.textContent = this.isDarkMode ? '☀️' : '🌙';
    this.currentThemeEl.textContent = this.isDarkMode ? 'Dark' : 'Light';

    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.log('Theme persistence not available');
    }
  }

  toggleSidebar() {
    this.sidebar.classList.toggle('collapsed');
  }

  updateMessageCount() {
    this.messageCountEl.textContent = this.messageCount;
  }

  loadTheme() {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.toggleTheme();
      }
    } catch (e) {
      console.log('Theme persistence not available');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chatApp = new ChatApp();
  chatApp.loadTheme();
});

window.addEventListener('resize', () => {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768) {
    sidebar.classList.remove('collapsed');
  }
});
