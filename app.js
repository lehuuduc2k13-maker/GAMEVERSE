/**
 * TRỢ LÝ AI LƯỢNG TỬ ĐA VŨ TRỤ V20 - GOD MODE EDITION
 * Đóng gói hoàn toàn trong Web Component (Shadow DOM) để đạt hiệu năng tuyệt đối.
 */
class QuantumAIWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.initElements();
    this.registerEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <link rel="stylesheet" href="style.css">
      <style>
        :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .messages-container { height: 250px; overflow-y: auto; scroll-behavior: smooth; padding-right: 5px; }
        .msg-bubble { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; border-radius: 1rem; color: #e2e8f0; margin-bottom: 0.75rem; line-height: 1.5; font-size: 0.85rem; }
        .input-wrapper { display: flex; gap: 0.5rem; }
        .quantum-input { flex: 1; background: #09090b; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.75rem; padding: 0.75rem; color: white; outline: none; transition: border-color 0.2s; font-size: 0.85rem; }
        .quantum-input:focus { border-color: oklch(0.7 0.25 210); }
        .send-btn { background: linear-gradient(90deg, oklch(0.7 0.25 210), oklch(0.5 0.3 260)); border: none; color: white; padding: 0 1.25rem; border-radius: 0.75rem; cursor: pointer; display: grid; place-items: center; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
        .title { font-weight: bold; color: oklch(0.7 0.25 210); display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
        .close-btn { background: none; border: none; color: #a1a1aa; cursor: pointer; font-size: 1rem; }
        .close-btn:hover { color: white; }
      </style>

      <button class="quantum-trigger" id="core-trigger" aria-label="Toggle Quantum AI">
        <i class="fas fa-atom"></i>
      </button>
      
      <div class="quantum-panel hidden" id="core-window">
        <div class="header">
          <div class="title">
            <i class="fas fa-brain" style="color: oklch(0.6 0.35 10)"></i> MULTIVERSE QUANTUM AI V20
          </div>
          <button class="close-btn" id="core-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="messages-container" id="msg-stream">
          <div class="msg-bubble">
            🌌 <b>Quantum Core:</b> Chào bro! Thực thể AI cấp độ God Mode đã đồng bộ với thực tại này. Cần tìm game hay cấu trúc lại không gian GameVerse, cứ ra lệnh cho tao!
          </div>
        </div>
        <div class="input-wrapper">
          <input type="text" class="quantum-input" id="user-input" placeholder="Truyền tín hiệu sóng não (vd: tìm game VIP)...">
          <button class="send-btn" id="btn-transmit"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;
  }

  initElements() {
    this.trigger = this.shadowRoot.getElementById('core-trigger');
    this.window = this.shadowRoot.getElementById('core-window');
    this.closeBtn = this.shadowRoot.getElementById('core-close');
    this.transmitBtn = this.shadowRoot.getElementById('btn-transmit');
    this.input = this.shadowRoot.getElementById('user-input');
    this.stream = this.shadowRoot.getElementById('msg-stream');
  }

  registerEvents() {
    this.trigger.addEventListener('click', () => this.toggleWidget());
    this.closeBtn.addEventListener('click', () => this.toggleWidget());
    this.transmitBtn.addEventListener('click', () => this.processTransmission());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.processTransmission();
    });
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.window.classList.remove('hidden');
      this.window.style.setProperty('--hyper-chromatic-shift', '50');
      this.input.focus();
    } else {
      this.window.classList.add('hidden');
      this.window.style.setProperty('--hyper-chromatic-shift', '0');
    }
  }

  processTransmission() {
    const query = this.input.value.trim();
    if (!query) return;

    this.appendMessage('User', query);
    this.input.value = '';

    this.window.style.setProperty('--subatomic-string-vibration', '180deg');
    
    setTimeout(() => {
      let randomReply = `⚛️ [Quantum Decryption]: Tín hiệu "${query}" đã được phân rã và xử lý trên tần số 11 chiều!`;
      const text = query.toLowerCase();

      if (text.includes("vip") || text.includes("game vip")) {
        randomReply = "👑 [Quantum VIP]: Bấm nút <b>Kho Game Siêu VIP</b> màu vàng ở trên để lọc riêng các siêu phẩm VIP nha bro!";
      } else if (text.includes("chào") || text.includes("hi") || text.includes("hello")) {
        randomReply = "🌌 [Quantum Core]: Chào bro! Chúc bro trải nghiệm cổng game Lượng Tử đỉnh cao nhất!";
      } else if (text.includes("hot") || text.includes("hay")) {
        randomReply = "🔥 [Quantum Hot]: Đội hình game ở đầu danh sách đang chiếm lượt chơi cao nhất, quất ngay đi bro!";
      }

      this.appendMessage('Quantum AI', randomReply);
      this.window.style.setProperty('--subatomic-string-vibration', '360deg');
    }, 500);
  }

  appendMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = `<b>${sender}:</b> ${text}`;
    this.stream.appendChild(bubble);
    this.stream.scrollTop = this.stream.scrollHeight;
  }
}

if (!customElements.get('quantum-ai-widget')) {
  customElements.define('quantum-ai-widget', QuantumAIWidget);
}
