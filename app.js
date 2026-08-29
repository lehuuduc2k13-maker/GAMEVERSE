/* =========================================================
   GAMEVERSE — CORE ENGINE
   ========================================================= */

"use strict";

/* =========================================================
   GAME DATA
   ========================================================= */

const games = [
  {
    id: 1,
    name: "Tiên Đạo Vô Tận",
    type: "3D",
    score: 94,
    rank: "THẦN THOẠI",
    icon: "☯️",
    description: "Thế giới tu tiên 3D rộng lớn với cảnh giới, pháp bảo và boss.",
    creator: "GAMEVERSE Studio",
    players: 12450
  },
  {
    id: 2,
    name: "Cyber Runner",
    type: "3D",
    score: 78,
    rank: "SSS",
    icon: "🏃",
    description: "Chạy vô tận trong thành phố cyberpunk đầy thử thách.",
    creator: "NeoDev",
    players: 6830
  },
  {
    id: 3,
    name: "Pixel Warrior",
    type: "2D",
    score: 67,
    rank: "TRUYỀN THUYẾT",
    icon: "⚔️",
    description: "Game chiến đấu pixel cổ điển với nhiều kỹ năng.",
    creator: "PixelMaster",
    players: 4210
  },
  {
    id: 4,
    name: "Galaxy Defender",
    type: "2D",
    score: 48,
    rank: "SSS",
    icon: "🚀",
    description: "Bảo vệ thiên hà khỏi những đợt tấn công ngoài hành tinh.",
    creator: "StarForge",
    players: 3290
  },
  {
    id: 5,
    name: "Dragon Realm",
    type: "3D",
    score: 32,
    rank: "SS",
    icon: "🐉",
    description: "Khám phá vùng đất rồng và chiến đấu với quái vật.",
    creator: "DragonDev",
    players: 1980
  },
  {
    id: 6,
    name: "Fishing Legend",
    type: "2D",
    score: 21,
    rank: "S",
    icon: "🎣",
    description: "Câu những con cá khổng lồ và mở khóa vùng biển mới.",
    creator: "FishKing",
    players: 1560
  }
];

/* =========================================================
   RANK SYSTEM
   ========================================================= */

function getRank(score) {

  score = Number(score);

  if (score >= 76) return "THẦN THOẠI";
  if (score >= 61) return "TRUYỀN THUYẾT";
  if (score >= 42) return "SSS";
  if (score >= 26) return "SS";
  if (score >= 1) return "S";

  return "F";
}

function getRankClass(rank) {

  switch (rank) {
    case "S":
      return "rank-s";

    case "SS":
      return "rank-ss";

    case "SSS":
      return "rank-sss";

    case "TRUYỀN THUYẾT":
      return "rank-legendary";

    case "THẦN THOẠI":
      return "rank-mythic";

    default:
      return "";
  }
}

/* =========================================================
   DOM
   ========================================================= */

const gameList = document.getElementById("gameList");
const featuredGames = document.getElementById("featuredGames");
const searchInput = document.getElementById("searchInput");
const gameCount = document.getElementById("gameCount");

const modal = document.getElementById("gameModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".nav");

/* =========================================================
   GAME CARD
   ========================================================= */

function createGameCard(game) {

  const rank = getRank(game.score);

  const card = document.createElement("article");

  card.className = "game-card";

  card.dataset.type = game.type;
  card.dataset.rank = rank;
  card.dataset.name = game.name.toLowerCase();

  card.innerHTML = `
    <div style="font-size:3rem;margin-bottom:auto">
      ${game.icon}
    </div>

    <div>
      <span class="rank ${getRankClass(rank)}">
        ${rank}
      </span>

      <h3>${escapeHTML(game.name)}</h3>

      <p>
        ${escapeHTML(game.description)}
      </p>

      <div style="
        display:flex;
        justify-content:space-between;
        margin-top:15px;
        color:#8995a8;
        font-size:.78rem;
      ">
        <span>🤖 AI ${game.score}/100</span>
        <span>👥 ${formatNumber(game.players)}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    openGame(game);
  });

  return card;
}

/* =========================================================
   RENDER GAMES
   ========================================================= */

function renderGames(list = games) {

  if (!gameList) return;

  gameList.innerHTML = "";

  if (list.length === 0) {

    gameList.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:60px 20px;
        color:#8995a8;
      ">
        <div style="font-size:3rem">🔎</div>
        <h3 style="margin-top:10px;color:white">
          Không tìm thấy game
        </h3>
        <p style="margin-top:8px">
          Thử từ khóa khác nhé bro.
        </p>
      </div>
    `;

    return;
  }

  list.forEach(game => {
    gameList.appendChild(createGameCard(game));
  });
}

/* =========================================================
   FEATURED
   ========================================================= */

function renderFeatured() {

  if (!featuredGames) return;

  const featured = [...games]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  featuredGames.innerHTML = "";

  featured.forEach(game => {
    featuredGames.appendChild(createGameCard(game));
  });
}

/* =========================================================
   SEARCH
   ========================================================= */

function searchGames() {

  const keyword = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filtered = games.filter(game => {

    return (
      game.name.toLowerCase().includes(keyword) ||
      game.description.toLowerCase().includes(keyword) ||
      game.type.toLowerCase().includes(keyword) ||
      game.rank.toLowerCase().includes(keyword)
    );
  });

  renderGames(filtered);
}

/* =========================================================
   FILTER
   ========================================================= */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const filter = button.dataset.filter;

    if (filter === "all") {
      renderGames(games);
      return;
    }

    if (filter === "2D" || filter === "3D") {

      renderGames(
        games.filter(game => game.type === filter)
      );

      return;
    }

    if (filter === "S") {

      renderGames(
        games.filter(game => {

          const score = game.score;

          return score >= 1;
        })
      );
    }
  });

});

/* =========================================================
   GAME MODAL
   ========================================================= */

function openGame(game) {

  const rank = getRank(game.score);

  modalContent.innerHTML = `
    <div style="
      text-align:center;
      padding:20px 0 10px;
    ">

      <div style="font-size:5rem">
        ${game.icon}
      </div>

      <span class="rank ${getRankClass(rank)}">
        ${rank}
      </span>

      <h1 style="margin-top:12px">
        ${escapeHTML(game.name)}
      </h1>

      <p style="
        color:#8f9bad;
        margin-top:12px;
        line-height:1.6;
      ">
        ${escapeHTML(game.description)}
      </p>
    </div>

    <div style="
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:12px;
      margin-top:25px;
    ">

      <div style="
        padding:18px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:15px;
        background:rgba(255,255,255,.04);
        text-align:center;
      ">
        <strong style="font-size:1.5rem">
          ${game.score}
        </strong>
        <small style="
          display:block;
          color:#8995a8;
          margin-top:5px;
        ">
          AI Score
        </small>
      </div>

      <div style="
        padding:18px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:15px;
        background:rgba(255,255,255,.04);
        text-align:center;
      ">
        <strong style="font-size:1.5rem">
          ${formatNumber(game.players)}
        </strong>
        <small style="
          display:block;
          color:#8995a8;
          margin-top:5px;
        ">
          Players
        </small>
      </div>

    </div>

    <div style="
      margin-top:20px;
      padding:18px;
      border-radius:15px;
      background:rgba(91,140,255,.07);
      border:1px solid rgba(91,140,255,.15);
    ">
      <p style="color:#aeb9ca">
        🎮 Thể loại:
        <strong style="color:white">
          ${game.type}
        </strong>
      </p>

      <p style="
        margin-top:10px;
        color:#aeb9ca;
      ">
        👤 Creator:
        <strong style="color:white">
          ${escapeHTML(game.creator)}
        </strong>
      </p>
    </div>

    <button
      class="primary full"
      style="margin-top:20px"
      onclick="startGame(${game.id})">
      🎮 Play Game
    </button>
  `;

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function startGame(id) {

  const game = games.find(g => g.id === id);

  if (!game) return;

  alert(
    `🎮 ${game.name}\n\n` +
    `Game demo đang được chuẩn bị!\n` +
    `AI Rank: ${getRank(game.score)}`
  );
}

/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeGameModal() {

  modal.classList.remove("show");
  document.body.style.overflow = "";
}

if (closeModal) {
  closeModal.addEventListener("click", closeGameModal);
}

if (modal) {

  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeGameModal();
    }

  });
}

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeGameModal();
  }

});

/* =========================================================
   NAVIGATION
   ========================================================= */

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    });

  if (nav) {
    nav.classList.remove("open");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document
  .querySelectorAll("[data-page]")
  .forEach(button => {

    button.addEventListener("click", () => {

      showPage(button.dataset.page);

    });

  });

/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuBtn && nav) {

  menuBtn.addEventListener("click", () => {

    nav.classList.toggle("open");

  });

}

/* =========================================================
   CREATE GAME
   ========================================================= */

const create2d = document.getElementById("create2d");
const create3d = document.getElementById("create3d");
const createMessage = document.getElementById("createMessage");

function createGame(type) {

  if (!createMessage) return;

  createMessage.innerHTML = `
    🚀 Chế độ tạo game <strong>${type}</strong>
    đã được chọn!
    <br>
    <small style="color:#8995a8">
      GAMEVERSE Creator Engine sẽ được mở rộng ở phiên bản tiếp theo.
    </small>
  `;
}

if (create2d) {
  create2d.addEventListener("click", () => {
    createGame("2D");
  });
}

if (create3d) {
  create3d.addEventListener("click", () => {
    createGame("3D");
  });
}

/* =========================================================
   COMMUNITY
   ========================================================= */

const sendFeedback = document.getElementById("sendFeedback");
const feedbackMessage = document.getElementById("feedbackMessage");

if (sendFeedback) {

  sendFeedback.addEventListener("click", () => {

    const title =
      document.getElementById("feedbackTitle")?.value.trim();

    const text =
      document.getElementById("feedbackText")?.value.trim();

    if (!title || !text) {

      if (feedbackMessage) {
        feedbackMessage.textContent =
          "⚠️ Hãy nhập tiêu đề và nội dung.";
        feedbackMessage.style.color = "#ff647d";
      }

      return;
    }

    if (feedbackMessage) {

      feedbackMessage.textContent =
        "✅ Góp ý đã được ghi nhận! Cảm ơn bro.";

      feedbackMessage.style.color = "#35e39a";
    }

    document.getElementById("feedbackTitle").value = "";
    document.getElementById("feedbackText").value = "";

  });

}

/* =========================================================
   SECURITY / HELPERS
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(number) {

  return Number(number).toLocaleString("en-US");
}

/* =========================================================
   INITIALIZE
   ========================================================= */

function init() {

  if (gameCount) {
    gameCount.textContent = games.length;
  }

  renderGames();
  renderFeatured();

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      searchGames
    );
  }

  console.log(
    "🎮 GAMEVERSE initialized successfully."
  );
}

init();
