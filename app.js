const defaultGames = [
  {
    id:1,
    name:"Neon Drift",
    creator:"Kaito",
    type:"Arcade",
    icon:"🏎️",
    plays:12480
  },
  {
    id:2,
    name:"Pixel Warriors",
    creator:"Nova",
    type:"Action",
    icon:"⚔️",
    plays:9870
  },
  {
    id:3,
    name:"Mini City",
    creator:"Mika",
    type:"Simulation",
    icon:"🏙️",
    plays:7520
  },
  {
    id:4,
    name:"Block World",
    creator:"Zen",
    type:"Sandbox",
    icon:"🧱",
    plays:6240
  },
  {
    id:5,
    name:"Cyber Strike",
    creator:"Rin",
    type:"Action",
    icon:"🤖",
    plays:5320
  },
  {
    id:6,
    name:"Space Runner",
    creator:"Leo",
    type:"Arcade",
    icon:"🚀",
    plays:4810
  },
  {
    id:7,
    name:"Farm Life",
    creator:"Luna",
    type:"Simulation",
    icon:"🌾",
    plays:3900
  },
  {
    id:8,
    name:"Build It",
    creator:"Kai",
    type:"Sandbox",
    icon:"🏗️",
    plays:3180
  }
];

let games = loadGames();
let currentFilter = "all";


function loadGames(){

  try{

    const saved =
      localStorage.getItem("gameverse_games");

    if(saved){
      return JSON.parse(saved);
    }

  }catch(error){

    console.log(error);

  }

  return [...defaultGames];
}


function saveGames(){

  localStorage.setItem(
    "gameverse_games",
    JSON.stringify(games)
  );

}


function formatNumber(number){

  return Number(number || 0)
    .toLocaleString("en-US");

}


function escapeHTML(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* =========================
   CHUYỂN TRANG
========================= */

const pages =
  document.querySelectorAll(".page");


document
  .querySelectorAll("[data-page]")
  .forEach(button => {

    button.addEventListener("click",event => {

      event.preventDefault();

      showPage(button.dataset.page);

    });

  });


function showPage(pageId){

  pages.forEach(page => {

    page.classList.toggle(
      "active",
      page.id === pageId
    );

  });


  document
    .querySelectorAll(".nav")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    });


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });


  if(pageId === "games"){
    renderAllGames();
  }

  if(pageId === "event"){
    renderLeaderboard();
  }

}


/* =========================
   GAME CARD
========================= */

function createGameCard(game){

  const card =
    document.createElement("article");

  card.className = "game-card";


  card.innerHTML = `

    <div class="thumb">
      ${escapeHTML(game.icon || "🎮")}
    </div>

    <h3>
      ${escapeHTML(game.name)}
    </h3>

    <p class="meta">
      ${escapeHTML(game.creator)}
      •
      ${escapeHTML(game.type)}
      •
      ${formatNumber(game.plays)}
      plays
    </p>

    <button
      class="btn ghost play"
      data-game-id="${game.id}"
    >
      ▶ Chơi game
    </button>

  `;


  return card;

}


function renderGames(containerId,list){

  const container =
    document.getElementById(containerId);

  if(!container) return;

  container.innerHTML = "";


  if(!list.length){

    container.innerHTML = `

      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
        color:#7f899e
      ">

        <div style="font-size:45px">
          🎮
        </div>

        <h3>
          Không tìm thấy game
        </h3>

        <p>
          Thử tìm từ khóa khác.
        </p>

      </div>

    `;

    return;

  }


  list.forEach(game => {

    container.appendChild(
      createGameCard(game)
    );

  });

}


/* =========================
   TRANG KHÁM PHÁ
========================= */

function renderHomeGames(){

  const featured =
    [...games]
      .sort((a,b) => b.plays - a.plays)
      .slice(0,4);


  const newest =
    [...games]
      .sort((a,b) => b.id - a.id)
      .slice(0,4);


  renderGames(
    "featuredGrid",
    featured
  );


  renderGames(
    "newGrid",
    newest
  );

}


/* =========================
   TẤT CẢ GAME
========================= */

function renderAllGames(){

  const input =
    document.getElementById("search");


  const keyword =
    input
      ? input.value.toLowerCase().trim()
      : "";


  const filtered =
    games.filter(game => {

      const matchesFilter =
        currentFilter === "all" ||
        game.type.toLowerCase() ===
        currentFilter;


      const matchesSearch =
        !keyword ||
        game.name
          .toLowerCase()
          .includes(keyword) ||

        game.creator
          .toLowerCase()
          .includes(keyword);


      return (
        matchesFilter &&
        matchesSearch
      );

    });


  renderGames(
    "allGrid",
    filtered
  );

}


/* =========================
   SEARCH
========================= */

document
  .getElementById("search")
  ?.addEventListener(
    "input",
    renderAllGames
  );


/* =========================
   FILTER
========================= */

document
  .querySelectorAll(".filter")
  .forEach(button => {

    button.addEventListener("click",() => {

      document
        .querySelectorAll(".filter")
        .forEach(btn => {

          btn.classList.remove("active");

        });


      button.classList.add("active");


      currentFilter =
        button.dataset.filter || "all";


      renderAllGames();

    });

  });


/* =========================
   CHƠI GAME
========================= */

document.addEventListener("click",event => {

  const button =
    event.target.closest(".play");


  if(!button) return;


  const game =
    games.find(
      item =>
        item.id ===
        Number(button.dataset.gameId)
    );


  if(!game) return;


  game.plays++;

  saveGames();


  renderHomeGames();
  renderAllGames();
  renderLeaderboard();


  showToast(
    `🎮 Đang mở ${game.name}...`
  );


  setTimeout(() => {

    alert(
      `GAMEVERSE DEMO\n\n` +
      `${game.name}\n` +
      `Creator: ${game.creator}\n\n` +
      `Đây là bản demo UI. Link game thật sẽ được kết nối backend sau.`
    );

  },300);

});


/* =========================
   MODAL ĐĂNG GAME
========================= */

const modal =
  document.getElementById(
    "uploadModal"
  );


document
  .getElementById("uploadBtn")
  ?.addEventListener("click",() => {

    modal.classList.remove("hidden");

  });


document
  .getElementById("closeModal")
  ?.addEventListener("click",() => {

    modal.classList.add("hidden");

  });


modal?.addEventListener("click",event => {

  if(event.target === modal){

    modal.classList.add("hidden");

  }

});


/* =========================
   TẠO GAME
========================= */

document
  .getElementById("submitGame")
  ?.addEventListener("click",() => {

    const name =
      document.getElementById(
        "gameName"
      );

    const type =
      document.getElementById(
        "gameType"
      );

    const desc =
      document.getElementById(
        "gameDesc"
      );


    if(!name.value.trim()){

      showToast(
        "⚠️ Vui lòng nhập tên game."
      );

      name.focus();

      return;

    }


    const icons = {

      Action:"⚔️",

      Simulation:"🏙️",

      Sandbox:"🧱",

      Arcade:"🎮"

    };


    const newGame = {

      id:Date.now(),

      name:name.value.trim(),

      creator:"Guest",

      type:type.value,

      icon:
        icons[type.value] || "🎮",

      plays:0,

      description:
        desc.value.trim()

    };


    games.unshift(newGame);

    saveGames();


    name.value = "";
    desc.value = "";


    modal.classList.add(
      "hidden"
    );


    renderHomeGames();
    renderAllGames();
    renderLeaderboard();

    updateCreatorStats();
    updateSlots();


    showToast(
      "🎉 Đã tạo trang game thành công!"
    );


    showPage("games");

  });


/* =========================
   CREATOR STATS
========================= */

function updateCreatorStats(){

  const mine =
    games.filter(
      game => game.creator === "Guest"
    );


  const myGames =
    document.getElementById(
      "myGames"
    );


  if(myGames){

    myGames.textContent =
      mine.length;

  }


  const stats =
    document.querySelectorAll(
      ".profile-stats div b"
    );


  if(stats.length >= 3){

    stats[0].textContent =
      mine.length;


    const plays =
      mine.reduce(
        (total,game) =>
          total + game.plays,
        0
      );


    stats[2].textContent =
      formatNumber(plays);

  }

}


/* =========================
   FOUNDING SLOTS
========================= */

function updateSlots(){

  const count =
    document.getElementById(
      "slotCount"
    );


  const bar =
    document.getElementById(
      "slotBar"
    );


  if(!count || !bar) return;


  const used =
    Math.min(
      1000,
      games.filter(
        game => game.creator === "Guest"
      ).length
    );


  count.textContent =
    formatNumber(used);


  bar.style.width =
    `${used / 10}%`;

}


/* =========================
   BẢNG XẾP HẠNG
========================= */

function renderLeaderboard(){

  const leaderboard =
    document.getElementById(
      "leaderboard"
    );


  if(!leaderboard) return;


  leaderboard.innerHTML = "";


  const ranking =
    [...games]
      .sort(
        (a,b) => b.plays - a.plays
      )
      .slice(0,8);


  ranking.forEach((game,index) => {

    const row =
      document.createElement("div");


    row.className = "rank";


    const medals = [
      "🥇",
      "🥈",
      "🥉"
    ];


    let prize = "—";


    if(index === 0){
      prize = "1 tháng quảng bá";
    }

    if(index === 1){
      prize = "2 tuần quảng bá";
    }

    if(index === 2){
      prize = "1 tuần quảng bá";
    }


    row.innerHTML = `

      <div class="rankno">
        ${medals[index] || "#" + (index + 1)}
      </div>

      <div class="rankname">

        <b>
          ${escapeHTML(game.name)}
        </b>

        <small>
          ${escapeHTML(game.creator)}
        </small>

      </div>

      <div class="score">
        ${formatNumber(game.plays)}
      </div>

      <div class="prize">
        ${prize}
      </div>

    `;


    leaderboard.appendChild(row);

  });

}


/* =========================
   COUNTDOWN
========================= */

const eventEnd =
  Date.now() +
  30 * 24 * 60 * 60 * 1000;


function updateCountdown(){

  const element =
    document.getElementById(
      "countdown"
    );


  if(!element) return;


  let diff =
    eventEnd - Date.now();


  if(diff <= 0){

    element.textContent =
      "00d 00:00:00";

    return;

  }


  const days =
    Math.floor(
      diff / 86400000
    );


  diff %= 86400000;


  const hours =
    Math.floor(
      diff / 3600000
    );


  diff %= 3600000;


  const minutes =
    Math.floor(
      diff / 60000
    );


  const seconds =
    Math.floor(
      (diff % 60000) / 1000
    );


  element.textContent =
    `${String(days).padStart(2,"0")}d ` +
    `${String(hours).padStart(2,"0")}:` +
    `${String(minutes).padStart(2,"0")}:` +
    `${String(seconds).padStart(2,"0")}`;

}


setInterval(
  updateCountdown,
  1000
);


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn =
  document.getElementById(
    "themeBtn"
  );


function updateThemeIcon(){

  if(!themeBtn) return;


  themeBtn.textContent =
    document.body.classList.contains(
      "light"
    )
      ? "☀"
      : "☾";

}


themeBtn?.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light"
    );


    const light =
      document.body.classList.contains(
        "light"
      );


    localStorage.setItem(
      "gameverse_theme",
      light
        ? "light"
        : "dark"
    );


    updateThemeIcon();


    showToast(
      light
        ? "☀️ Đã chuyển sang giao diện sáng"
        : "🌙 Đã chuyển sang giao diện tối"
    );

  }
);


if(
  localStorage.getItem(
    "gameverse_theme"
  ) === "light"
){

  document.body.classList.add(
    "light"
  );

}


/* =========================
   PROFILE
========================= */

const editProfile =
  document.getElementById(
    "editProfile"
  );


function updateProfileName(name){

  const heading =
    document.querySelector(
      ".profile-hero h1"
    );


  if(heading){

    heading.textContent =
      name;

  }

}


editProfile?.addEventListener(
  "click",
  () => {

    const oldName =
      localStorage.getItem(
        "gameverse_creator_name"
      ) ||
      "Guest Creator";


    const newName =
      prompt(
        "Nhập tên creator:",
        oldName
      );


    if(!newName?.trim()) return;


    const name =
      newName.trim();


    localStorage.setItem(
      "gameverse_creator_name",
      name
    );


    updateProfileName(name);


    showToast(
      "✅ Đã cập nhật profile."
    );

  }
);


const savedName =
  localStorage.getItem(
    "gameverse_creator_name"
  );


if(savedName){

  updateProfileName(
    savedName
  );

}


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(message){

  const toast =
    document.getElementById(
      "toast"
    );


  if(!toast) return;


  toast.textContent =
    message;


  toast.style.opacity =
    "1";


  toast.style.transform =
    "translate(-50%,0)";


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(() => {

      toast.style.opacity =
        "0";

      toast.style.transform =
        "translate(-50%,20px)";

    },2500);

}


/* =========================
   KHỞI ĐỘNG
========================= */

renderHomeGames();

renderAllGames();

renderLeaderboard();

updateCreatorStats();

updateSlots();

updateCountdown();

updateThemeIcon();
