/**
 * GAMEVERSE CORE V1
 * ASTROCADE × ROBLOX STYLE
 *
 * Core:
 * - Quantum AI Assistant
 * - Game Discovery
 * - Game Creator
 * - Creator system
 * - Coin wallet (local demo)
 * - Game promotion
 * - Game Share Index
 * - Local save
 */

(() => {
  "use strict";

  /* =========================================================
     GAMEVERSE DATABASE - LOCAL V1
  ========================================================= */

  const STORAGE_KEY = "gameverse_v1";

  const defaultData = {
    profile: {
      id: "local-player",
      username: "GameversePlayer",
      coin: 100
    },

    games: [
      {
        id: "quantum-world",
        title: "Quantum World",
        creator: "Gameverse",
        category: "Adventure",
        players: 0,
        likes: 0,
        views: 0,
        score: 86,
        promoted: false
      },
      {
        id: "neon-arena",
        title: "Neon Arena",
        creator: "Gameverse Studio",
        category: "Action",
        players: 0,
        likes: 0,
        views: 0,
        score: 91,
        promoted: false
      }
    ],

    projects: [],

    wallet: {
      coin: 100,
      history: []
    }
  };

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return structuredClone(defaultData);
      }

      return {
        ...structuredClone(defaultData),
        ...JSON.parse(saved)
      };
    } catch (error) {
      console.warn("Gameverse storage error:", error);
      return structuredClone(defaultData);
    }
  }

  let GAMEVERSE = loadData();

  function saveData() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(GAMEVERSE)
    );

    window.dispatchEvent(
      new CustomEvent("gameverse:data-updated", {
        detail: GAMEVERSE
      })
    );
  }


  /* =========================================================
     GAMEVERSE API
  ========================================================= */

  const Gameverse = {

    getState() {
      return GAMEVERSE;
    },

    getGames() {
      return GAMEVERSE.games;
    },

    getGame(id) {
      return GAMEVERSE.games.find(game => game.id === id);
    },

    searchGames(query) {
      const q = String(query || "").toLowerCase().trim();

      if (!q) return GAMEVERSE.games;

      return GAMEVERSE.games.filter(game =>
        game.title.toLowerCase().includes(q) ||
        game.creator.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
      );
    },

    createGame({
      title,
      description = "",
      category = "Adventure"
    }) {

      if (!title || !title.trim()) {
        throw new Error("Tên game không được để trống.");
      }

      const game = {
        id:
          "game-" +
          Date.now() +
          "-" +
          Math.random().toString(36).slice(2, 8),

        title: title.trim(),

        description,

        creator:
          GAMEVERSE.profile.username,

        category,

        players: 0,

        likes: 0,

        views: 0,

        score: 50,

        promoted: false,

        createdAt: Date.now()
      };

      GAMEVERSE.games.push(game);

      GAMEVERSE.projects.push({
        id: game.id,
        title: game.title,
        status: "draft",
        version: 1,
        createdAt: Date.now()
      });

      saveData();

      return game;
    },

    playGame(id) {

      const game = this.getGame(id);

      if (!game) return null;

      game.players++;
      game.views++;

      /*
       * Không cộng tiền chỉ vì người dùng mở game.
       * Sau này backend sẽ xác minh quảng cáo/purchase
       * trước khi ghi nhận doanh thu thật.
       */

      saveData();

      return game;
    },

    likeGame(id) {

      const game = this.getGame(id);

      if (!game) return null;

      game.likes++;

      saveData();

      return game;
    },

    promoteGame(id, coinCost = 10) {

      const game = this.getGame(id);

      if (!game) {
        return {
          success: false,
          message: "Không tìm thấy game."
        };
      }

      if (GAMEVERSE.wallet.coin < coinCost) {
        return {
          success: false,
          message: "Không đủ Coin."
        };
      }

      GAMEVERSE.wallet.coin -= coinCost;

      game.promoted = true;

      game.score = Math.min(
        100,
        game.score + 3
      );

      GAMEVERSE.wallet.history.push({
        type: "promotion",
        amount: -coinCost,
        gameId: id,
        createdAt: Date.now()
      });

      saveData();

      return {
        success: true,
        message:
          `Đã quảng bá "${game.title}" với ${coinCost} Coin.`
      };
    },

    addCoin(amount, reason = "reward") {

      amount = Number(amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        return false;
      }

      GAMEVERSE.wallet.coin += amount;

      GAMEVERSE.wallet.history.push({
        type: reason,
        amount,
        createdAt: Date.now()
      });

      saveData();

      return true;
    },

    getCoin() {
      return GAMEVERSE.wallet.coin;
    },

    getTrendingGames() {

      return [...GAMEVERSE.games]
        .sort((a, b) => {

          const scoreA =
            (a.score * 5) +
            (a.likes * 3) +
            (a.views * 0.1) +
            (a.promoted ? 30 : 0);

          const scoreB =
            (b.score * 5) +
            (b.likes * 3) +
            (b.views * 0.1) +
            (b.promoted ? 30 : 0);

          return scoreB - scoreA;
        });
    }
  };


  /* =========================================================
     AI GAME BUILDER
  ========================================================= */

  const AIBuilder = {

    analyzePrompt(prompt) {

      const text =
        String(prompt || "")
          .toLowerCase()
          .trim();

      let genre = "Adventure";

      if (
        text.includes("bắn") ||
        text.includes("súng") ||
        text.includes("shooter")
      ) {
        genre = "Shooter";
      }

      else if (
        text.includes("đua") ||
        text.includes("racing")
      ) {
        genre = "Racing";
      }

      else if (
        text.includes("phiêu lưu") ||
        text.includes("adventure")
      ) {
        genre = "Adventure";
      }

      else if (
        text.includes("sinh tồn") ||
        text.includes("survival")
      ) {
        genre = "Survival";
      }

      else if (
        text.includes("tu tiên") ||
        text.includes("cultivation")
      ) {
        genre = "RPG";
      }

      return {
        genre,

        multiplayer:
          text.includes("online") ||
          text.includes("nhiều người") ||
          text.includes("multiplayer"),

        mobile: true,

        requested3D:
          text.includes("3d"),

        requested2D:
          text.includes("2d"),

        originalPrompt: prompt
      };
    },

    generate(prompt) {

      if (!prompt || !prompt.trim()) {
        return {
          success: false,
          message: "Bro nhập ý tưởng game trước đã."
        };
      }

      const analysis =
        this.analyzePrompt(prompt);

      let title =
        "Gameverse " +
        analysis.genre;

      if (
        prompt.length > 0 &&
        prompt.length < 40
      ) {
        title = prompt
          .trim()
          .replace(/\s+/g, " ");
      }

      const game =
        Gameverse.createGame({
          title,
          description: prompt,
          category: analysis.genre
        });

      return {
        success: true,

        game,

        analysis,

        message:
          `🤖 AI Game Builder đã tạo project "${game.title}".`
      };
    }
  };


  /* =========================================================
     QUANTUM AI ASSISTANT
  ========================================================= */

  class QuantumAIWidget extends HTMLElement {

    constructor() {
      super();

      this.attachShadow({
        mode: "open"
      });

      this.isOpen = false;
    }

    connectedCallback() {

      this.render();

      this.initElements();

      this.registerEvents();
    }

    render() {

      this.shadowRoot.innerHTML = `

        <style>

          :host {
            display: block;
            font-family:
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Roboto,
              sans-serif;
          }

          .quantum-trigger {

            position: fixed;

            right: 18px;
            bottom: 18px;

            width: 58px;
            height: 58px;

            border-radius: 50%;

            border: 1px solid
              rgba(255,255,255,.25);

            background:
              linear-gradient(
                135deg,
                #9b2cff,
                #00b7ff
              );

            color: white;

            font-size: 22px;

            cursor: pointer;

            z-index: 99999;

            box-shadow:
              0 0 25px
              rgba(120,50,255,.5);
          }

          .quantum-panel {

            position: fixed;

            right: 18px;
            bottom: 88px;

            width:
              min(380px, calc(100vw - 36px));

            height: 430px;

            background:
              rgba(10,12,24,.97);

            border:
              1px solid
              rgba(160,90,255,.35);

            border-radius: 20px;

            padding: 15px;

            box-sizing: border-box;

            z-index: 99998;

            box-shadow:
              0 20px 70px
              rgba(0,0,0,.6);
          }

          .hidden {
            display: none !important;
          }

          .header {

            display: flex;

            justify-content:
              space-between;

            align-items: center;

            padding-bottom: 10px;

            border-bottom:
              1px solid
              rgba(255,255,255,.1);
          }

          .title {

            color: #c084fc;

            font-weight: 800;

            font-size: 13px;
          }

          .close-btn {

            border: none;

            background: none;

            color: #aaa;

            font-size: 20px;

            cursor: pointer;
          }

          .messages-container {

            height: 320px;

            overflow-y: auto;

            padding:
              12px 3px;
          }

          .msg-bubble {

            background:
              rgba(255,255,255,.055);

            border:
              1px solid
              rgba(255,255,255,.09);

            padding: 10px;

            border-radius: 14px;

            color: #e5e7eb;

            margin-bottom: 10px;

            line-height: 1.5;

            font-size: 13px;
          }

          .input-wrapper {

            display: flex;

            gap: 7px;
          }

          .quantum-input {

            flex: 1;

            min-width: 0;

            background: #080a12;

            border:
              1px solid
              rgba(255,255,255,.15);

            border-radius: 12px;

            padding: 11px;

            color: white;

            outline: none;
          }

          .send-btn {

            width: 48px;

            border: none;

            border-radius: 12px;

            background:
              linear-gradient(
                90deg,
                #9b2cff,
                #00b7ff
              );

            color: white;

            cursor: pointer;
          }

        </style>


        <button
          class="quantum-trigger"
          id="core-trigger"
          aria-label="Gameverse AI"
        >
          🤖
        </button>


        <div
          class="quantum-panel hidden"
          id="core-window"
        >

          <div class="header">

            <div class="title">
              ⚛️ GAMEVERSE AI CORE V1
            </div>

            <button
              class="close-btn"
              id="core-close"
            >
              ×
            </button>

          </div>


          <div
            class="messages-container"
            id="msg-stream"
          >

            <div class="msg-bubble">
              🌌 <b>Gameverse AI:</b>
              Chào bro! Tao là AI Core của Gameverse.
              Mày có thể bảo tao tìm game, tạo game,
              xem game hot hoặc kiểm tra Coin.
            </div>

          </div>


          <div class="input-wrapper">

            <input
              type="text"
              class="quantum-input"
              id="user-input"
              placeholder="Ví dụ: tạo game tu tiên 3D..."
            >

            <button
              class="send-btn"
              id="btn-transmit"
            >
              ➤
            </button>

          </div>

        </div>
      `;
    }

    initElements() {

      this.trigger =
        this.shadowRoot
          .getElementById("core-trigger");

      this.window =
        this.shadowRoot
          .getElementById("core-window");

      this.closeBtn =
        this.shadowRoot
          .getElementById("core-close");

      this.transmitBtn =
        this.shadowRoot
          .getElementById("btn-transmit");

      this.input =
        this.shadowRoot
          .getElementById("user-input");

      this.stream =
        this.shadowRoot
          .getElementById("msg-stream");
    }

    registerEvents() {

      this.trigger.addEventListener(
        "click",
        () => this.toggleWidget()
      );

      this.closeBtn.addEventListener(
        "click",
        () => this.toggleWidget()
      );

      this.transmitBtn.addEventListener(
        "click",
        () => this.processTransmission()
      );

      this.input.addEventListener(
        "keydown",
        event => {

          if (event.key === "Enter") {
            this.processTransmission();
          }

        }
      );
    }

    toggleWidget() {

      this.isOpen =
        !this.isOpen;

      this.window.classList.toggle(
        "hidden",
        !this.isOpen
      );

      if (this.isOpen) {

        setTimeout(
          () => this.input.focus(),
          50
        );
      }
    }

    processTransmission() {

      const query =
        this.input.value.trim();

      if (!query) return;

      this.appendMessage(
        "Bro",
        query
      );

      this.input.value = "";

      setTimeout(
        () => {

          const reply =
            this.getAIResponse(query);

          this.appendMessage(
            "Gameverse AI",
            reply
          );

        },
        350
      );
    }

    getAIResponse(query) {

      const text =
        query.toLowerCase();

      /* CREATE GAME */

      if (
        text.includes("tạo game") ||
        text.includes("build game") ||
        text.includes("làm game")
      ) {

        const result =
          AIBuilder.generate(query);

        if (!result.success) {
          return "❌ " + result.message;
        }

        return `
          🚀 <b>Game Builder:</b>
          ${result.message}<br><br>

          🎮 Thể loại:
          ${result.analysis.genre}<br>

          📱 Mobile:
          ${result.analysis.mobile ? "Có" : "Không"}<br>

          🌐 Multiplayer:
          ${result.analysis.multiplayer ? "Có" : "Chưa bật"}<br>

          🧩 Project đã được lưu trong Gameverse.
        `;
      }


      /* SEARCH */

      if (
        text.includes("tìm game") ||
        text.includes("search game")
      ) {

        const keyword =
          query
            .replace(/tìm game/gi, "")
            .replace(/search game/gi, "")
            .trim();

        const games =
          Gameverse.searchGames(keyword);

        if (!games.length) {
          return "🔎 Chưa tìm thấy game phù hợp bro.";
        }

        return (
          "🎮 <b>Game tìm thấy:</b><br>" +
          games
            .slice(0, 5)
            .map(
              game =>
                `• ${this.escape(game.title)}
                 — ${game.category}
                 — Score ${game.score}`
            )
            .join("<br>")
        );
      }


      /* HOT */

      if (
        text.includes("game hot") ||
        text.includes("game hay") ||
        text.includes("trending")
      ) {

        const games =
          Gameverse
            .getTrendingGames()
            .slice(0, 5);

        return (
          "🔥 <b>Game đang nổi:</b><br>" +
          games
            .map(
              (game, index) =>
                `${index + 1}. ${this.escape(game.title)}
                 — ${game.score}/100`
            )
            .join("<br>")
        );
      }


      /* COIN */

      if (
        text.includes("coin") ||
        text.includes("ví")
      ) {

        return `
          💎 <b>Gameverse Wallet</b><br><br>
          Coin hiện tại:
          <b>${Gameverse.getCoin()} Coin</b><br><br>
          Coin V1 hiện chỉ là dữ liệu thử nghiệm.
        `;
      }


      /* PROMOTION */

      if (
        text.includes("quảng bá") ||
        text.includes("promote")
      ) {

        return `
          📢 <b>Game Promotion</b><br><br>
          Creator có thể dùng Coin để
          quảng bá game trong hệ thống.
          <br><br>
          ⚠️ V1 chỉ mô phỏng local;
          quảng cáo/tiền thật sẽ nối backend
          chính thức sau.
        `;
      }


      /* HELLO */

      if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("chào")
      ) {

        return `
          🌌 Chào bro 😎<br><br>
          Gameverse đang online.
          <br><br>
          Thử nói:
          <br>
          • "tạo game tu tiên 3D"
          <br>
          • "game hot"
          <br>
          • "tìm game adventure"
          <br>
          • "xem Coin"
        `;
      }


      return `
        ⚛️ Tao đã nhận:
        "<b>${this.escape(query)}</b>"<br><br>

        Mày có thể yêu cầu tao:
        <br>
        🎮 tạo game
        <br>
        🔎 tìm game
        <br>
        🔥 xem game hot
        <br>
        💎 kiểm tra Coin
        <br>
        📢 quảng bá game
      `;
    }

    appendMessage(sender, text) {

      const bubble =
        document.createElement("div");

      bubble.className =
        "msg-bubble";

      const senderElement =
        document.createElement("b");

      senderElement.textContent =
        sender + ": ";

      bubble.appendChild(
        senderElement
      );

      const content =
        document.createElement("span");

      content.innerHTML = text;

      bubble.appendChild(
        content
      );

      this.stream.appendChild(
        bubble
      );

      this.stream.scrollTop =
        this.stream.scrollHeight;
    }

    escape(value) {

      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  }


  /* =========================================================
     REGISTER
  ========================================================= */

  if (
    !customElements.get(
      "quantum-ai-widget"
    )
  ) {

    customElements.define(
      "quantum-ai-widget",
      QuantumAIWidget
    );
  }


  /* =========================================================
     GLOBAL GAMEVERSE API
  ========================================================= */

  window.Gameverse = Gameverse;

  window.GameverseAI = AIBuilder;


  /* =========================================================
     READY EVENT
  ========================================================= */

  window.dispatchEvent(
    new CustomEvent(
      "gameverse:ready",
      {
        detail: Gameverse
      }
    )
  );

})();
