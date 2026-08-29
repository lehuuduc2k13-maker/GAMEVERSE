/* =========================================================
   NOVA PLAY V4
   FRONT-END GAME PLATFORM ENGINE
   =========================================================

   SYSTEMS
   ---------------------------------------------------------
   ✓ Game database
   ✓ Game search
   ✓ Genre filter
   ✓ Navigation
   ✓ Player profile
   ✓ XP / Level
   ✓ Coins
   ✓ Daily reward
   ✓ Achievements
   ✓ Missions
   ✓ Event progression
   ✓ Creator Hub
   ✓ Upload UI
   ✓ Favorites
   ✓ Recently played
   ✓ Notifications
   ✓ LocalStorage save system
   ✓ Settings
   ✓ Theme
   ✓ Neon Rush game engine
   ✓ Combo system
   ✓ Boost system
   ✓ Difficulty scaling
   ✓ High score
   ✓ Game over
   ✓ Particles
   ✓ Screen shake
   ✓ Power orbs
   ✓ Enemy types
   ✓ Pause
   ✓ Restart
   ✓ Keyboard controls
   ✓ Mobile controls
   ✓ Leaderboard simulation
   ✓ Toast notifications
   ✓ Modal system
   ========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

const NOVA_VERSION = "4.0.0";

const STORAGE_KEY = "nova_play_v4";


const defaultState = {

    player: {

        name: "Guest",

        level: 1,

        xp: 0,

        coins: 250,

        gamesPlayed: 0,

        totalScore: 0,

        bestScore: 0,

        joined: Date.now()

    },


    settings: {

        theme: "dark",

        sound: true,

        particles: true,

        screenShake: true

    },


    favorites: [],

    recentlyPlayed: [],

    achievements: [],

    missions: {

        playGames: 0,

        collectOrbs: 0,

        score: 0

    },


    event: {

        score: 0,

        completed: false

    },


    daily: {

        claimed: false,

        lastClaim: 0

    },


    creator: {

        uploaded: 0,

        games: []

    },


    notifications: [],

    highScores: []

};


/* =========================================================
   LOAD SAVE
========================================================= */

let state;


function loadState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {

            state =
                structuredClone(defaultState);

            return;

        }

        const parsed =
            JSON.parse(saved);

        state = {

            ...structuredClone(defaultState),

            ...parsed,

            player: {

                ...defaultState.player,

                ...(parsed.player || {})

            },

            settings: {

                ...defaultState.settings,

                ...(parsed.settings || {})

            },

            missions: {

                ...defaultState.missions,

                ...(parsed.missions || {})

            },

            event: {

                ...defaultState.event,

                ...(parsed.event || {})

            },

            daily: {

                ...defaultState.daily,

                ...(parsed.daily || {})

            },

            creator: {

                ...defaultState.creator,

                ...(parsed.creator || {})

            }

        };

    }

    catch (error) {

        console.warn(
            "Save corrupted. Resetting.",
            error
        );

        state =
            structuredClone(defaultState);

    }

}


function saveState() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(state)

    );

}


loadState();


/* =========================================================
   GAME DATABASE
========================================================= */

const games = [

    {
        id: 1,
        name: "Neon Rush",
        genre: "Arcade",
        category: "Arcade",
        players: "1.2K",
        icon: "⚡",
        color: "cyan",
        featured: true,
        playable: true,
        description:
            "Sinh tồn trong đường đua neon và phá kỷ lục."
    },

    {
        id: 2,
        name: "Orbit Defender",
        genre: "Action",
        category: "Action",
        players: "843",
        icon: "🪐",
        color: "purple",
        playable: false,
        description:
            "Bảo vệ hành tinh khỏi những đợt tấn công."
    },

    {
        id: 3,
        name: "Pixel Forge",
        genre: "Sandbox",
        category: "Sandbox",
        players: "621",
        icon: "🧱",
        color: "orange",
        playable: false,
        description:
            "Xây dựng thế giới pixel của riêng bạn."
    },

    {
        id: 4,
        name: "Sky Drift",
        genre: "Racing",
        category: "Racing",
        players: "509",
        icon: "🚀",
        color: "blue",
        playable: false,
        description:
            "Bay xuyên thành phố và đánh bại đối thủ."
    },

    {
        id: 5,
        name: "Dungeon Echo",
        genre: "Adventure",
        category: "Adventure",
        players: "392",
        icon: "🏰",
        color: "red",
        playable: false,
        description:
            "Khám phá dungeon bí ẩn."
    },

    {
        id: 6,
        name: "Nova Chess",
        genre: "Strategy",
        category: "Strategy",
        players: "274",
        icon: "♟️",
        color: "gold",
        playable: false,
        description:
            "Cờ chiến thuật trong vũ trụ Nova."
    },

    {
        id: 7,
        name: "Void Runner",
        genre: "Arcade",
        category: "Arcade",
        players: "198",
        icon: "🌌",
        color: "purple",
        playable: false,
        description:
            "Chạy trốn khỏi vùng không gian sụp đổ."
    },

    {
        id: 8,
        name: "Cyber Miner",
        genre: "Simulation",
        category: "Simulation",
        players: "177",
        icon: "⛏️",
        color: "blue",
        playable: false,
        description:
            "Khai thác tài nguyên và xây dựng đế chế."
    },

    {
        id: 9,
        name: "Galaxy Clash",
        genre: "Action",
        category: "Action",
        players: "151",
        icon: "☄️",
        color: "red",
        playable: false,
        description:
            "Đại chiến giữa những thiên hà."
    },

    {
        id: 10,
        name: "Mystic Farm",
        genre: "Simulation",
        category: "Simulation",
        players: "132",
        icon: "🌱",
        color: "green",
        playable: false,
        description:
            "Xây dựng trang trại trong thế giới huyền bí."
    },

    {
        id: 11,
        name: "Star Builder",
        genre: "Sandbox",
        category: "Sandbox",
        players: "119",
        icon: "⭐",
        color: "gold",
        playable: false,
        description:
            "Tạo hệ mặt trời của riêng bạn."
    },

    {
        id: 12,
        name: "Pixel Arena",
        genre: "Action",
        category: "Action",
        players: "105",
        icon: "⚔️",
        color: "pink",
        playable: false,
        description:
            "Đấu trường pixel tốc độ cao."
    }

];


/* =========================================================
   DOM
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    document.querySelectorAll(selector);


const gameGrid =
    $("#gameGrid");

const allGames =
    $("#allGames");

const search =
    $("#gameSearch");

const modal =
    $("#gameModal");

const canvas =
    $("#gameCanvas");

const ctx =
    canvas ?
    canvas.getContext("2d") :
    null;

const scoreDisplay =
    $("#score");

const eventProgress =
    $("#eventProgress");

const eventText =
    $("#eventText");

const toast =
    $("#toast");


/* =========================================================
   UTILITY
========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function random(
    min,
    max
) {

    return (
        Math.random() *
        (max - min)
    ) + min;

}


function randomInt(
    min,
    max
) {

    return Math.floor(
        random(min, max + 1)
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    if (!toast)
        return;

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2400
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(pageName) {

    $$(".nav-btn")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.page === pageName
            );

        });


    $$(".page")
        .forEach(page => {

            page.classList.toggle(
                "active",
                page.id === pageName
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (
        pageName === "profile"
    ) {

        renderProfile();

    }

}


$$(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openPage(
                    button.dataset.page
                );

            }
        );

    });


/* =========================================================
   GAME CARD
========================================================= */

function createGameCard(game) {

    const favorite =
        state.favorites.includes(
            game.id
        );


    return `

        <article
            class="game-card"
            data-game-id="${game.id}"
        >

            <div
                class="game-image"
                data-color="${game.color}"
            >

                <span>
                    ${game.genre}
                </span>

                ${game.icon}

            </div>


            <div class="game-body">

                <h3>
                    ${game.name}
                </h3>


                <div class="game-meta">

                    ${game.genre}
                    •
                    ${game.players}
                    đang chơi

                </div>


                <div
                    style="
                        margin-top:8px;
                        color:#8994ad;
                        font-size:11px;
                    "
                >

                    ${game.description}

                </div>


                <div
                    style="
                        display:flex;
                        gap:7px;
                        margin-top:12px;
                    "
                >

                    <button
                        class="primary-button"
                        style="flex:1"
                        onclick="launchGame(${game.id})"
                    >

                        ${game.playable
                            ? "▶ CHƠI"
                            : "🚧 SẮP RA MẮT"}

                    </button>


                    <button
                        class="secondary-button"
                        style="
                            width:48px;
                            padding:0;
                        "
                        onclick="toggleFavorite(${game.id})"
                    >

                        ${favorite
                            ? "❤️"
                            : "♡"}

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   RENDER GAMES
========================================================= */

function renderGames(
    list = games
) {

    if (gameGrid) {

        gameGrid.innerHTML =
            list
                .filter(game => game.featured)
                .map(createGameCard)
                .join("");

    }


    if (allGames) {

        allGames.innerHTML =
            list
                .map(createGameCard)
                .join("");

    }

}


renderGames();


/* =========================================================
   SEARCH
========================================================= */

if (search) {

    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                .toLowerCase()
                .trim();


            const filtered =
                games.filter(
                    game =>

                        game.name
                            .toLowerCase()
                            .includes(value)

                        ||

                        game.genre
                            .toLowerCase()
                            .includes(value)

                        ||

                        game.category
                            .toLowerCase()
                            .includes(value)

                );


            renderGames(
                filtered
            );

        }
    );

}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id) {

    const index =
        state.favorites.indexOf(id);


    if (index === -1) {

        state.favorites.push(id);

        showToast(
            "❤️ Đã thêm vào yêu thích"
        );

    }

    else {

        state.favorites.splice(
            index,
            1
        );

        showToast(
            "💔 Đã bỏ khỏi yêu thích"
        );

    }


    saveState();

    renderGames();

}


/* =========================================================
   RECENTLY PLAYED
========================================================= */

function addRecentlyPlayed(
    id
) {

    state.recentlyPlayed =
        state.recentlyPlayed
            .filter(
                gameId =>
                    gameId !== id
            );


    state.recentlyPlayed
        .unshift(id);


    state.recentlyPlayed =
        state.recentlyPlayed
            .slice(0, 8);


    saveState();

}


/* =========================================================
   PLAYER XP SYSTEM
========================================================= */

function xpRequired(
    level
) {

    return Math.floor(
        100 *
        Math.pow(
            1.35,
            level - 1
        )
    );

}


function getPlayerXPProgress() {

    const required =
        xpRequired(
            state.player.level
        );


    return clamp(
        state.player.xp /
        required,
        0,
        1
    );

}


function addXP(amount) {

    if (
        !Number.isFinite(amount)
    )
        return;


    state.player.xp +=
        Math.max(
            0,
            Math.floor(amount)
        );


    let leveledUp =
        false;


    while (
        state.player.xp >=
        xpRequired(
            state.player.level
        )
    ) {

        state.player.xp -=
            xpRequired(
                state.player.level
            );


        state.player.level++;

        leveledUp =
            true;


        const reward =
            100 +
            state.player.level * 25;


        state.player.coins +=
            reward;


        unlockAchievement(
            "level"
        );


        showToast(
            `🎉 LEVEL UP! Bạn đã lên Level ${state.player.level} +${reward} 🪙`
        );

    }


    if (
        !leveledUp &&
        amount >= 50
    ) {

        showToast(
            `✨ +${Math.floor(amount)} XP`
        );

    }


    saveState();

    renderProfile();

}


/* =========================================================
   COINS
========================================================= */

function addCoins(amount) {

    state.player.coins +=
        Math.max(
            0,
            Math.floor(amount)
        );


    saveState();

    renderProfile();

}


function spendCoins(amount) {

    if (
        state.player.coins < amount
    ) {

        showToast(
            "❌ Không đủ NOVA Coins"
        );

        return false;

    }


    state.player.coins -=
        amount;


    saveState();

    renderProfile();

    return true;

}


/* =========================================================
   DAILY REWARD
========================================================= */

function canClaimDaily() {

    const now =
        Date.now();


    const day =
        24 * 60 * 60 * 1000;


    return (
        now -
        state.daily.lastClaim
        >= day
    );

}


function claimDailyReward() {

    if (
        !canClaimDaily()
    ) {

        showToast(
            "⏳ Daily Reward đã nhận rồi. Quay lại sau nhé!"
        );

        return;

    }


    const reward =
        100 +
        state.player.level * 10;


    state.player.coins +=
        reward;


    state.daily.lastClaim =
        Date.now();


    state.daily.claimed =
        true;


    unlockAchievement(
        "daily"
    );


    saveState();


    showToast(
        `🎁 DAILY REWARD +${reward} 🪙`
    );


    renderProfile();

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const achievements = {

    firstGame: {

        name: "First Launch",

        icon: "🚀",

        description:
            "Chơi game đầu tiên"

    },

    score1000: {

        name: "Score Hunter",

        icon: "🎯",

        description:
            "Đạt 1.000 điểm"

    },

    score10000: {

        name: "Score Master",

        icon: "🔥",

        description:
            "Đạt 10.000 điểm"

    },

    orb100: {

        name: "Energy Collector",

        icon: "💎",

        description:
            "Thu thập 100 orb"

    },

    level: {

        name: "Level Up",

        icon: "⭐",

        description:
            "Tăng level"

    },

    daily: {

        name: "Daily Player",

        icon: "📅",

        description:
            "Nhận Daily Reward"

    },

    creator: {

        name: "Creator",

        icon: "🛠️",

        description:
            "Đăng game"

    },

    event: {

        name: "Event Champion",

        icon: "🏆",

        description:
            "Hoàn thành event"

    }

};


function hasAchievement(id) {

    return state.achievements
        .includes(id);

}


function unlockAchievement(id) {

    if (
        !achievements[id]
    )
        return;


    if (
        hasAchievement(id)
    )
        return;


    state.achievements.push(id);


    const reward =
        50 +
        state.achievements.length * 10;


    state.player.coins +=
        reward;


    saveState();


    showToast(
        `🏆 Achievement: ${achievements[id].name} +${reward} 🪙`
    );


    renderProfile();

}


/* =========================================================
   MISSIONS
========================================================= */

function updateMission(
    mission,
    amount = 1
) {

    if (
        !Object.hasOwn(
            state.missions,
            mission
        )
    )
        return;


    state.missions[mission] +=
        amount;


    saveState();

}


/* =========================================================
   EVENT
========================================================= */

const EVENT_TARGET = 10000;


function updateEventProgress() {

    const progress =
        clamp(
            state.event.score /
            EVENT_TARGET,
            0,
            1
        );


    if (eventProgress) {

        eventProgress.style.width =
            `${progress * 100}%`;

    }


    if (eventText) {

        if (
            state.event.completed
        ) {

            eventText.textContent =
                "🏆 EVENT COMPLETED!";

        }

        else {

            eventText.textContent =
                `${Math.floor(
                    state.event.score
                ).toLocaleString()} / ${EVENT_TARGET.toLocaleString()} điểm`;

        }

    }


}


function addEventScore(
    amount
) {

    if (
        state.event.completed
    )
        return;


    state.event.score +=
        Math.max(
            0,
            amount
        );


    if (
        state.event.score >=
        EVENT_TARGET
    ) {

        state.event.score =
            EVENT_TARGET;

        state.event.completed =
            true;


        addCoins(500);

        addXP(300);

        unlockAchievement(
            "event"
        );


        showToast(
            "🏆 NOVA EVENT COMPLETED! +500 🪙"
        );

    }


    updateEventProgress();

    saveState();

}


updateEventProgress();


/* =========================================================
   CREATOR SYSTEM
========================================================= */

function openCreatorUpload() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "main-modal";


    modal.innerHTML = `

        <div class="modal-content">

            <h2>
                🚀 Đăng game lên NOVA PLAY
            </h2>

            <div class="form-group">

                <label>
                    TÊN GAME
                </label>

                <input
                    id="creatorGameName"
                    placeholder="Tên game..."
                >

            </div>


            <div class="form-group">

                <label>
                    THỂ LOẠI
                </label>

                <select id="creatorGameGenre">

                    <option>Arcade</option>

                    <option>Action</option>

                    <option>Adventure</option>

                    <option>Racing</option>

                    <option>Sandbox</option>

                    <option>Strategy</option>

                    <option>Simulation</option>

                </select>

            </div>


            <div class="form-group">

                <label>
                    MÔ TẢ
                </label>

                <input
                    id="creatorGameDescription"
                    placeholder="Mô tả game..."
                >

            </div>


            <div class="modal-actions">

                <button
                    class="secondary-button"
                    id="cancelCreator"
                >
                    Hủy
                </button>

                <button
                    class="primary-button"
                    id="confirmCreator"
                >
                    Đăng game
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    $("#cancelCreator")
        .onclick = () => {

            modal.remove();

        };


    $("#confirmCreator")
        .onclick = () => {

            const name =
                $("#creatorGameName")
                    .value
                    .trim();


            const genre =
                $("#creatorGameGenre")
                    .value;


            const description =
                $("#creatorGameDescription")
                    .value
                    .trim();


            if (!name) {

                showToast(
                    "⚠️ Hãy nhập tên game"
                );

                return;

            }


            const newGame = {

                id:
                    Date.now(),

                name,

                genre,

                category:
                    genre,

                players:
                    "0",

                icon:
                    "🎮",

                color:
                    "purple",

                playable:
                    false,

                creator:
                    true,

                description:
                    description ||
                    "Game được tạo bởi NOVA Creator."

            };


            state.creator.games
                .push(newGame);


            state.creator.uploaded++;


            games.push(
                newGame
            );


            unlockAchievement(
                "creator"
            );


            addXP(100);

            addCoins(150);


            saveState();

            renderGames();


            modal.remove();


            showToast(
                "🚀 Game đã được đưa vào Creator Library!"
            );

        };

}


/* =========================================================
   CONNECT CREATOR BUTTON
========================================================= */

const uploadButton =
    $("#uploadButton");


if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        openCreatorUpload
    );

}


/* =========================================================
   PROFILE RENDER
========================================================= */

function renderProfile() {

    const level =
        state.player.level;


    const xp =
        state.player.xp;


    const required =
        xpRequired(level);


    const progress =
        getPlayerXPProgress() * 100;


    const profileLevel =
        $("#profileLevel");


    const profileXP =
        $("#profileXP");


    const profileCoins =
        $("#profileCoins");


    const profileGames =
        $("#profileGames");


    const profileScore =
        $("#profileScore");


    const xpBar =
        $("#xpProgress");


    if (profileLevel)
        profileLevel.textContent =
            `LEVEL ${level}`;


    if (profileXP)
        profileXP.textContent =
            `${xp} / ${required} XP`;


    if (profileCoins)
        profileCoins.textContent =
            state.player.coins
                .toLocaleString();


    if (profileGames)
        profileGames.textContent =
            state.player.gamesPlayed;


    if (profileScore)
        profileScore.textContent =
            state.player.totalScore
                .toLocaleString();


    if (xpBar)
        xpBar.style.width =
            `${progress}%`;


    const achievementContainer =
        $("#achievementGrid");


    if (
        achievementContainer
    ) {

        achievementContainer.innerHTML =
            Object.entries(
                achievements
            )
            .map(
                ([id, achievement]) => {

                    const unlocked =
                        hasAchievement(id);


                    return `

                        <div
                            class="
                                achievement
                                ${unlocked
                                    ? ""
                                    : "locked"}
                            "
                        >

                            <div
                                class="achievement-icon"
                            >
                                ${achievement.icon}
                            </div>

                            <strong>
                                ${achievement.name}
                            </strong>

                            <small>
                                ${achievement.description}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");

    }


    const dailyButton =
        $("#dailyRewardButton");


    if (dailyButton) {

        dailyButton.textContent =
            canClaimDaily()
                ? "🎁 Nhận Daily Reward"
                : "✓ Đã nhận hôm nay";

    }

}


renderProfile();


/* =========================================================
   DAILY BUTTON
========================================================= */

const dailyButton =
    $("#dailyRewardButton");


if (dailyButton) {

    dailyButton.addEventListener(
        "click",
        claimDailyReward
    );

}


/* =========================================================
   PROFILE NAME
========================================================= */

function changeName() {

    const name =
        prompt(
            "Nhập tên NOVA của bạn:"
        );


    if (!name)
        return;


    const clean =
        name
            .trim()
            .slice(0, 20);


    if (!clean)
        return;


    state.player.name =
        clean;


    saveState();

    renderProfile();


    showToast(
        `👤 Xin chào ${clean}!`
    );

}


/* =========================================================
   THEME
========================================================= */

const themeButton =
    $("#themeButton");


if (themeButton) {

    themeButton.addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    state.settings.theme =
        state.settings.theme ===
        "dark"
            ? "light"
            : "dark";


    document.body.classList.toggle(
        "light-mode",
        state.settings.theme ===
        "light"
    );


    saveState();


    showToast(
        state.settings.theme ===
        "light"
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"
    );

}


if (
    state.settings.theme ===
    "light"
) {

    document.body.classList.add(
        "light-mode"
    );

}


/* =========================================================
   MAIN FEATURE BUTTONS
========================================================= */

const playFeatured =
    $("#playFeatured");


if (playFeatured) {

    playFeatured.onclick =
        () => launchGame(1);

}


const eventPlay =
    $("#eventPlay");


if (eventPlay) {

    eventPlay.onclick =
        () => launchGame(1);

}


const exploreButton =
    $("#exploreButton");


if (exploreButton) {

    exploreButton.onclick =
        () => {

            openPage(
                "games"
            );

        };

}


/* =========================================================
   GAME ENGINE STATE
========================================================= */

let animationFrame =
    null;

let running =
    false;

let paused =
    false;

let lastTime =
    0;

let score =
    0;

let combo =
    0;

let comboTimer =
    0;

let gameTime =
    0;

let spawnTimer =
    0;

let difficulty =
    1;

let gameCoins =
    0;

let boostEnergy =
    100;

let boostActive =
    false;

let gameOverState =
    false;

let screenShake =
    0;

let keys = {};

let player =
    null;

let enemies = [];

let energyOrbs = [];

let particles = [];

let stars = [];


/* =========================================================
   GAME CONSTANTS
========================================================= */

const BASE_SPEED = 210;

const PLAYER_SPEED = 650;

const MAX_BOOST =
    100;


/* =========================================================
   INITIAL STARS
========================================================= */

function createStars() {

    stars = [];


    for (
        let i = 0;
        i < 120;
        i++
    ) {

        stars.push({

            x:
                random(
                    0,
                    canvas.width
                ),

            y:
                random(
                    0,
                    canvas.height
                ),

            size:
                random(
                    .5,
                    2.5
                ),

            speed:
                random(
                    15,
                    70
                ),

            alpha:
                random(
                    .2,
                    .9
                )

        });

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        keys[key] =
            true;


        if (
            [
                "arrowleft",
                "arrowright",
                "a",
                "d",
                " ",
                "p"
            ].includes(key)
        ) {

            event.preventDefault();

        }


        if (
            key === "r" &&
            !modal.classList.contains(
                "hidden"
            )
        ) {

            resetGame();

        }


        if (
            key === "p" &&
            running
        ) {

            togglePause();

        }


        if (
            key === "escape" &&
            running
        ) {

            togglePause();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   LAUNCH GAME
========================================================= */

function launchGame(id) {

    const game =
        games.find(
            item =>
                item.id === id
        );


    if (!game)
        return;


    if (!game.playable) {

        showToast(
            `🚧 ${game.name} đang được phát triển.`
        );

        return;

    }


    addRecentlyPlayed(id);


    state.player.gamesPlayed++;

    updateMission(
        "playGames"
    );


    unlockAchievement(
        "firstGame"
    );


    saveState();


    modal.classList.remove(
        "hidden"
    );


    resetGame();

}


/* =========================================================
   CLOSE GAME
========================================================= */

const closeGameButton =
    $("#closeGame");


if (closeGameButton) {

    closeGameButton.addEventListener(
        "click",
        closeGame
    );

}


function closeGame() {

    running =
        false;

    paused =
        false;

    cancelAnimationFrame(
        animationFrame
    );


    modal.classList.add(
        "hidden"
    );

}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    if (!canvas)
        return;


    player = {

        x:
            canvas.width / 2 - 22,

        y:
            canvas.height - 90,

        width:
            44,

        height:
            44,

        velocity:
            0,

        shield:
            0,

        trail:
            []

    };


    enemies = [];

    energyOrbs = [];

    particles = [];

    score = 0;

    combo = 0;

    comboTimer = 0;

    gameTime = 0;

    spawnTimer = 0;

    difficulty = 1;

    gameCoins = 0;

    boostEnergy =
        MAX_BOOST;

    boostActive =
        false;

    gameOverState =
        false;

    paused =
        false;

    running =
        true;

    screenShake =
        0;


    createStars();


    lastTime =
        performance.now();


    if (scoreDisplay) {

        scoreDisplay.textContent =
            "0";

    }


    cancelAnimationFrame(
        animationFrame
    );


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (
        !running ||
        gameOverState
    )
        return;


    paused =
        !paused;


    showToast(
        paused
            ? "⏸️ GAME PAUSED"
            : "▶️ GAME RESUMED"
    );

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(time) {

    if (!running)
        return;


    const delta =
        Math.min(
            (time - lastTime) / 1000,
            .033
        );


    lastTime =
        time;


    if (!paused) {

        update(
            delta
        );

        render();

    }


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   UPDATE
========================================================= */

function update(delta) {

    gameTime +=
        delta;


    difficulty =
        1 +
        gameTime /
        25;


    /* -----------------------------------------
       MOVEMENT
    ----------------------------------------- */

    let direction =
        0;


    if (
        keys["arrowleft"] ||
        keys["a"]
    ) {

        direction -= 1;

    }


    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        direction += 1;

    }


    const boosting =
        (
            keys[" "] ||
            keys["shift"]
        ) &&
        boostEnergy > 0;


    boostActive =
        boosting;


    if (boosting) {

        boostEnergy -=
            delta * 38;

    }

    else {

        boostEnergy +=
            delta * 15;

    }


    boostEnergy =
        clamp(
            boostEnergy,
            0,
            MAX_BOOST
        );


    const speed =
        PLAYER_SPEED *
        (
            boosting
                ? 1.65
                : 1
        );


    player.x +=
        direction *
        speed *
        delta;


    player.x =
        clamp(
            player.x,
            10,
            canvas.width -
            player.width -
            10
        );


    /* -----------------------------------------
       TRAIL
    ----------------------------------------- */

    player.trail.push({

        x:
            player.x +
            player.width / 2,

        y:
            player.y +
            player.height

    });


    if (
        player.trail.length >
        12
    ) {

        player.trail.shift();

    }


    /* -----------------------------------------
       SPAWN
    ----------------------------------------- */

    spawnTimer -=
        delta;


    const spawnRate =
        Math.max(
            .12,
            .48 -
            gameTime *
            .006
        );


    if (
        spawnTimer <= 0
    ) {

        spawnTimer =
            spawnRate;


        const roll =
            Math.random();


        if (
            roll < .18
        ) {

            spawnOrb();

        }

        else if (
            roll < .30 &&
            gameTime > 10
        ) {

            spawnFastEnemy();

        }

        else if (
            roll < .39 &&
            gameTime > 20
        ) {

            spawnHeavyEnemy();

        }

        else {

            spawnEnemy();

        }

    }


    /* -----------------------------------------
       STARS
    ----------------------------------------- */

    for (
        const star
        of stars
    ) {

        star.y +=
            star.speed *
            delta *
            (
                boostActive
                    ? 2
                    : 1
            );


        if (
            star.y >
            canvas.height
        ) {

            star.y =
                -5;

            star.x =
                random(
                    0,
                    canvas.width
                );

        }

    }


    /* -----------------------------------------
       ENEMIES
    ----------------------------------------- */

    for (
        const enemy
        of enemies
    ) {

        enemy.y +=
            enemy.speed *
            delta *
            difficulty;


        if (
            enemy.type ===
            "zigzag"
        ) {

            enemy.x +=
                Math.sin(
                    gameTime *
                    5 +
                    enemy.seed
                ) *
                120 *
                delta;

        }


        if (
            enemy.type ===
            "fast"
        ) {

            enemy.x +=
                Math.sin(
                    gameTime * 7
                ) *
                40 *
                delta;

        }


        if (
            enemy.type ===
            "heavy"
        ) {

            enemy.rotation +=
                delta;

        }

    }


    /* -----------------------------------------
       ORBS
    ----------------------------------------- */

    for (
        const orb
        of energyOrbs
    ) {

        orb.y +=
            orb.speed *
            delta;


        orb.rotation +=
            delta * 5;

    }


    /* -----------------------------------------
       PARTICLES
    ----------------------------------------- */

    updateParticles(
        delta
    );


    /* -----------------------------------------
       CLEANUP
    ----------------------------------------- */

    enemies =
        enemies.filter(
            enemy =>
                enemy.y <
                canvas.height +
                120
        );


    energyOrbs =
        energyOrbs.filter(
            orb =>
                orb.y <
                canvas.height +
                100
        );


    /* -----------------------------------------
       COLLISION ENEMY
    ----------------------------------------- */

    for (
        const enemy
        of enemies
    ) {

        if (
            rectangleCollision(
                player,
                enemy
            )
        ) {

            if (
                player.shield > 0
            ) {

                player.shield = 0;

                destroyEnemy(
                    enemy
                );

                screenShake = 12;

                createExplosion(
                    enemy.x +
                    enemy.width / 2,

                    enemy.y +
                    enemy.height / 2,

                    25
                );

            }

            else {

                gameOver();

                return;

            }

        }

    }


    /* -----------------------------------------
       ORB COLLECTION
    ----------------------------------------- */

    for (
        let i =
            energyOrbs.length - 1;

        i >= 0;

        i--
    ) {

        const orb =
            energyOrbs[i];


        if (
            circleRectangleCollision(
                orb,
                player
            )
        ) {

            energyOrbs.splice(
                i,
                1
            );


            collectOrb(
                orb
            );

        }

    }


    /* -----------------------------------------
       SCORE
    ----------------------------------------- */

    const scoreMultiplier =
        1 +
        combo *
        .05;


    score +=
        delta *
        12 *
        difficulty *
        scoreMultiplier;


    if (
        comboTimer > 0
    ) {

        comboTimer -=
            delta;

    }

    else {

        combo =
            Math.max(
                0,
                combo - 1
            );

    }


    if (scoreDisplay) {

        scoreDisplay.textContent =
            Math.floor(
                score
            );

    }


    /* -----------------------------------------
       EVENT
    ----------------------------------------- */

    if (
        Math.floor(
            score
        ) % 50 === 0
    ) {

        state.missions.score =
            Math.max(
                state.missions.score,
                Math.floor(score)
            );

    }


    if (
        Math.floor(score) >
        state.player.bestScore
    ) {

        state.player.bestScore =
            Math.floor(score);

    }


    updateEventProgress();

}


/* =========================================================
   SPAWN ENEMY
========================================================= */

function spawnEnemy() {

    const size =
        random(
            32,
            58
        );


    const typeRoll =
        Math.random();


    let type =
        "normal";


    if (
        typeRoll < .35
    ) {

        type =
            "zigzag";

    }


    enemies.push({

        x:
            random(
                15,
                canvas.width -
                size -
                15
            ),

        y:
            -size - 10,

        width:
            size,

        height:
            size,

        speed:
            random(
                130,
                210
            ),

        type,

        rotation:
            0,

        seed:
            Math.random() *
            100

    });

}


/* =========================================================
   FAST ENEMY
========================================================= */

function spawnFastEnemy() {

    const size =
        random(
            25,
            36
        );


    enemies.push({

        x:
            random(
                15,
                canvas.width -
                size -
                15
            ),

        y:
            -50,

        width:
            size,

        height:
            size,

        speed:
            random(
                300,
                430
            ),

        type:
            "fast",

        rotation:
            0,

        seed:
            Math.random() *
            100

    });

}


/* =========================================================
   HEAVY ENEMY
========================================================= */

function spawnHeavyEnemy() {

    const size =
        random(
            60,
            90
        );


    enemies.push({

        x:
            random(
                15,
                canvas.width -
                size -
                15
            ),

        y:
            -100,

        width:
            size,

        height:
            size,

        speed:
            random(
                75,
                120
            ),

        type:
            "heavy",

        rotation:
            0,

        seed:
            Math.random() *
            100,

        hp:
            2

    });

}


/* =========================================================
   ORB
========================================================= */

function spawnOrb() {

    energyOrbs.push({

        x:
            random(
                20,
                canvas.width -
                20
            ),

        y:
            -30,

        radius:
            11,

        speed:
            random(
                130,
                210
            ),

        rotation:
            0

    });

}


/* =========================================================
   COLLECT ORB
========================================================= */

function collectOrb(
    orb
) {

    combo++;

    comboTimer =
        2.2;


    const comboMultiplier =
        1 +
        combo *
        .15;


    const points =
        Math.floor(
            100 *
            comboMultiplier
        );


    score +=
        points;


    gameCoins +=
        3 +
        Math.min(
            combo,
            10
        );


    state.missions.collectOrbs++;


    addEventScore(
        points
    );


    createExplosion(
        orb.x,
        orb.y,
        12
    );


    if (
        state.missions.collectOrbs >=
        100
    ) {

        unlockAchievement(
            "orb100"
        );

    }


    if (
        score >= 1000
    ) {

        unlockAchievement(
            "score1000"
        );

    }


    if (
        score >= 10000
    ) {

        unlockAchievement(
            "score10000"
        );

    }

}


/* =========================================================
   DESTROY ENEMY
========================================================= */

function destroyEnemy(
    enemy
) {

    const index =
        enemies.indexOf(
            enemy
        );


    if (
        index !== -1
    ) {

        enemies.splice(
            index,
            1
        );

    }

}


/* =========================================================
   COLLISION
========================================================= */

function rectangleCollision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width

        &&

        a.x + a.width >
        b.x

        &&

        a.y <
        b.y + b.height

        &&

        a.y + a.height >
        b.y

    );

}


function circleRectangleCollision(
    circle,
    rect
) {

    const closestX =
        clamp(
            circle.x,
            rect.x,
            rect.x +
            rect.width
        );


    const closestY =
        clamp(
            circle.y,
            rect.y,
            rect.y +
            rect.height
        );


    const dx =
        circle.x -
        closestX;


    const dy =
        circle.y -
        closestY;


    return (
        dx * dx +
        dy * dy
    ) <
    circle.radius *
    circle.radius;

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticle(
    x,
    y
) {

    if (
        !state.settings.particles
    )
        return;


    particles.push({

        x,

        y,

        vx:
            random(
                -180,
                180
            ),

        vy:
            random(
                -180,
                180
            ),

        life:
            random(
                .35,
                .8
            ),

        maxLife:
            .8,

        size:
            random(
                2,
                5
            )

    });

}


function createExplosion(
    x,
    y,
    amount = 20
) {

    if (
        !state.settings.particles
    )
        return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        createParticle(
            x,
            y
        );

    }

}


function updateParticles(
    delta
) {

    for (
        const particle
        of particles
    ) {

        particle.x +=
            particle.vx *
            delta;


        particle.y +=
            particle.vy *
            delta;


        particle.vy +=
            180 *
            delta;


        particle.life -=
            delta;

    }


    particles =
        particles.filter(
            particle =>
                particle.life >
                0
        );

}


/* =========================================================
   RENDER
========================================================= */

function render() {

    if (!ctx)
        return;


    ctx.save();


    /* SCREEN SHAKE */

    if (
        screenShake > 0 &&
        state.settings.screenShake
    ) {

        ctx.translate(
            random(
                -screenShake,
                screenShake
            ),

            random(
                -screenShake,
                screenShake
            )
        );


        screenShake *=
            .82;

    }


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* BACKGROUND */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#060918"
    );


    gradient.addColorStop(
        1,
        "#02030a"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* STARS */

    for (
        const star
        of stars
    ) {

        ctx.globalAlpha =
            star.alpha;


        ctx.fillStyle =
            "#ffffff";


        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha =
        1;


    /* GRID */

    drawGrid();


    /* PLAYER TRAIL */

    drawPlayerTrail();


    /* PLAYER */

    drawPlayer();


    /* ENEMIES */

    for (
        const enemy
        of enemies
    ) {

        drawEnemy(
            enemy
        );

    }


    /* ORBS */

    for (
        const orb
        of energyOrbs
    ) {

        drawOrb(
            orb
        );

    }


    /* PARTICLES */

    drawParticles();


    /* UI */

    drawGameUI();


    /* PAUSE */

    if (paused) {

        drawPause();

    }


    ctx.restore();

}


/* =========================================================
   GRID
========================================================= */

function drawGrid() {

    ctx.strokeStyle =
        "#11172a";

    ctx.lineWidth =
        1;


    const offset =
        (gameTime * 40) % 50;


    for (
        let x = 0;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y =
            -50 + offset;

        y < canvas.height;

        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayerTrail() {

    if (
        !player ||
        player.trail.length < 2
    )
        return;


    for (
        let i = 0;
        i < player.trail.length;
        i++
    ) {

        const point =
            player.trail[i];


        const alpha =
            i /
            player.trail.length;


        ctx.globalAlpha =
            alpha *
            .35;


        ctx.fillStyle =
            "#00d9ff";


        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            3 + alpha * 6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha =
        1;

}


function drawPlayer() {

    if (!player)
        return;


    ctx.save();


    ctx.translate(
        player.x +
        player.width / 2,

        player.y +
        player.height / 2
    );


    ctx.shadowBlur =
        25;


    ctx.shadowColor =
        "#00d9ff";


    ctx.fillStyle =
        "#00d9ff";


    ctx.beginPath();


    ctx.moveTo(
        0,
        -25
    );


    ctx.lineTo(
        22,
        20
    );


    ctx.lineTo(
        0,
        12
    );


    ctx.lineTo(
        -22,
        20
    );


    ctx.closePath();


    ctx.fill();


    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();


    ctx.arc(
        0,
        -5,
        5,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /* BOOST FLAME */

    if (
        boostActive
    ) {

        ctx.fillStyle =
            "#ffe45c";


        ctx.shadowColor =
            "#ffe45c";


        ctx.beginPath();


        ctx.moveTo(
            -9,
            17
        );


        ctx.lineTo(
            0,
            38 +
            Math.random() *
            12
        );


        ctx.lineTo(
            9,
            17
        );


        ctx.closePath();


        ctx.fill();

    }


    ctx.restore();

}


/* =========================================================
   ENEMY DRAW
========================================================= */

function drawEnemy(
    enemy
) {

    ctx.save();


    const cx =
        enemy.x +
        enemy.width / 2;


    const cy =
        enemy.y +
        enemy.height / 2;


    ctx.translate(
        cx,
        cy
    );


    if (
        enemy.type ===
        "heavy"
    ) {

        ctx.rotate(
            enemy.rotation
        );

    }


    let color =
        "#ff4265";


    if (
        enemy.type ===
        "fast"
    ) {

        color =
            "#ff9d42";

    }


    if (
        enemy.type ===
        "heavy"
    ) {

        color =
            "#a44dff";

    }


    ctx.shadowBlur =
        22;


    ctx.shadowColor =
        color;


    ctx.fillStyle =
        color;


    if (
        enemy.type ===
        "heavy"
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            -enemy.height / 2
        );

        ctx.lineTo(
            enemy.width / 2,
            0
        );

        ctx.lineTo(
            0,
            enemy.height / 2
        );

        ctx.lineTo(
            -enemy.width / 2,
            0
        );

        ctx.closePath();

        ctx.fill();

    }

    else {

        ctx.fillRect(

            -enemy.width / 2,

            -enemy.height / 2,

            enemy.width,

            enemy.height

        );

    }


    ctx.restore();

}


/* =========================================================
   ORB DRAW
========================================================= */

function drawOrb(
    orb
) {

    ctx.save();


    ctx.translate(
        orb.x,
        orb.y
    );


    ctx.rotate(
        orb.rotation
    );


    ctx.shadowBlur =
        28;


    ctx.shadowColor =
        "#ffe45c";


    ctx.fillStyle =
        "#ffe45c";


    ctx.beginPath();


    ctx.moveTo(
        0,
        -orb.radius
    );


    ctx.lineTo(
        orb.radius,
        0
    );


    ctx.lineTo(
        0,
        orb.radius
    );


    ctx.lineTo(
        -orb.radius,
        0
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   PARTICLE DRAW
========================================================= */

function drawParticles() {

    for (
        const particle
        of particles
    ) {

        ctx.globalAlpha =
            clamp(
                particle.life /
                particle.maxLife,
                0,
                1
            );


        ctx.fillStyle =
            "#ffffff";


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha =
        1;

}


/* =========================================================
   GAME UI
========================================================= */

function drawGameUI() {

    ctx.save();


    /* BOOST */

    const barWidth =
        160;


    const barHeight =
        8;


    const x =
        20;


    const y =
        canvas.height - 25;


    ctx.fillStyle =
        "#1b2135";


    ctx.fillRect(
        x,
        y,
        barWidth,
        barHeight
    );


    const boostWidth =
        barWidth *
        (
            boostEnergy /
            MAX_BOOST
        );


    ctx.fillStyle =
        boostActive
            ? "#ffe45c"
            : "#00d9ff";


    ctx.fillRect(
        x,
        y,
        boostWidth,
        barHeight
    );


    ctx.font =
        "11px system-ui";


    ctx.fillStyle =
        "#8994ad";


    ctx.fillText(
        "BOOST",
        x,
        y - 6
    );


    /* COMBO */

    if (
        combo > 1
    ) {

        ctx.textAlign =
            "right";


        ctx.font =
            "bold 20px system-ui";


        ctx.fillStyle =
            "#ffe45c";


        ctx.fillText(
            `x${combo} COMBO`,
            canvas.width - 20,
            35
        );

    }


    /* DIFFICULTY */

    ctx.textAlign =
        "left";


    ctx.font =
        "10px system-ui";


    ctx.fillStyle =
        "#8994ad";


    ctx.fillText(
        `THREAT x${difficulty.toFixed(1)}`,
        20,
        25
    );


    ctx.restore();

}


/* =========================================================
   PAUSE SCREEN
========================================================= */

function drawPause() {

    ctx.save();


    ctx.fillStyle =
        "rgba(0,0,0,.6)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 50px system-ui";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "PAUSED",
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.font =
        "14px system-ui";


    ctx.fillStyle =
        "#8994ad";


    ctx.fillText(
        "Nhấn P hoặc ESC để tiếp tục",
        canvas.width / 2,
        canvas.height / 2 + 35
    );


    ctx.restore();

}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    running =
        false;


    gameOverState =
        true;


    cancelAnimationFrame(
        animationFrame
    );


    const finalScore =
        Math.floor(score);


    const earnedCoins =
        Math.floor(
            gameCoins +
            finalScore / 100
        );


    state.player.totalScore +=
        finalScore;


    state.player.bestScore =
        Math.max(
            state.player.bestScore,
            finalScore
        );


    state.player.coins +=
        earnedCoins;


    addXP(
        Math.floor(
            finalScore / 20
        )
    );


    addEventScore(
        finalScore
    );


    updateMission(
        "score",
        finalScore
    );


    if (
        finalScore >= 1000
    ) {

        unlockAchievement(
            "score1000"
        );

    }


    if (
        finalScore >= 10000
    ) {

        unlockAchievement(
            "score10000"
        );

    }


    state.highScores.push({

        name:
            state.player.name,

        score:
            finalScore,

        date:
            Date.now()

    });


    state.highScores =
        state.highScores
            .sort(
                (a,b) =>
                    b.score -
                    a.score
            )
            .slice(
                0,
                20
            );


    saveState();


    showGameOverScreen(
        finalScore,
        earnedCoins
    );

}


/* =========================================================
   GAME OVER SCREEN
========================================================= */

function showGameOverScreen(
    finalScore,
    earnedCoins
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "main-modal";


    overlay.innerHTML = `

        <div
            class="modal-content"
            style="text-align:center"
        >

            <div
                style="
                    font-size:55px;
                    margin-bottom:10px;
                "
            >
                💥
            </div>


            <div
                class="eyebrow"
            >
                RUN COMPLETE
            </div>


            <h2
                style="
                    font-size:42px;
                    margin:8px 0;
                "
            >
                ${finalScore.toLocaleString()}
            </h2>


            <p
                style="
                    color:#8994ad;
                    margin-bottom:22px;
                "
            >
                Điểm cuối cùng
            </p>


            <div
                style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:10px;
                    margin-bottom:20px;
                "
            >

                <div
                    style="
                        padding:15px;
                        border:1px solid #29324a;
                        border-radius:12px;
                    "
                >

                    <strong>
                        +${earnedCoins}
                    </strong>

                    <small
                        style="
                            display:block;
                            color:#8994ad;
                        "
                    >
                        NOVA Coins
                    </small>

                </div>


                <div
                    style="
                        padding:15px;
                        border:1px solid #29324a;
                        border-radius:12px;
                    "
                >

                    <strong>
                        +${Math.floor(
                            finalScore / 20
                        )}
                    </strong>

                    <small
                        style="
                            display:block;
                            color:#8994ad;
                        "
                    >
                        XP
                    </small>

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:8px;
                "
            >

                <button
                    class="secondary-button"
                    style="flex:1"
                    id="gameOverClose"
                >
                    Thoát
                </button>


                <button
                    class="primary-button"
                    style="flex:1"
                    id="gameOverRestart"
                >
                    🔄 Chơi lại
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    $("#gameOverClose")
        .onclick = () => {

            overlay.remove();

            closeGame();

        };


    $("#gameOverRestart")
        .onclick = () => {

            overlay.remove();

            resetGame();

        };

}


/* =========================================================
   MOBILE GAME CONTROLS
========================================================= */

function createMobileControls() {

    if (
        document.getElementById(
            "mobileControls"
        )
    )
        return;


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "mobileControls";


    controls.innerHTML = `

        <div
            style="
                position:fixed;
                left:15px;
                bottom:80px;
                z-index:5000;
                display:flex;
                gap:8px;
            "
        >

            <button
                data-key="arrowleft"
                style="
                    width:60px;
                    height:60px;
                    border-radius:16px;
                    border:1px solid #38435e;
                    background:#111728;
                    color:white;
                    font-size:24px;
                "
            >
                ←
            </button>


            <button
                data-key="arrowright"
                style="
                    width:60px;
                    height:60px;
                    border-radius:16px;
                    border:1px solid #38435e;
                    background:#111728;
                    color:white;
                    font-size:24px;
                "
            >
                →
            </button>

        </div>


        <div
            style="
                position:fixed;
                right:15px;
                bottom:80px;
                z-index:5000;
            "
        >

            <button
                data-key=" "
                style="
                    width:75px;
                    height:75px;
                    border-radius:50%;
                    border:1px solid #59698f;
                    background:#242047;
                    color:white;
                    font-weight:900;
                "
            >
                BOOST
            </button>

        </div>

    `;


    document.body.appendChild(
        controls
    );


    controls
        .querySelectorAll(
            "button"
        )
        .forEach(
            button => {

                const key =
                    button.dataset.key;


                const down =
                    event => {

                        event.preventDefault();

                        keys[key] =
                            true;

                    };


                const up =
                    event => {

                        event.preventDefault();

                        keys[key] =
                            false;

                    };


                button.addEventListener(
                    "touchstart",
                    down,
                    {
                        passive:false
                    }
                );


                button.addEventListener(
                    "touchend",
                    up,
                    {
                        passive:false
                    }
                );


                button.addEventListener(
                    "mousedown",
                    down
                );


                button.addEventListener(
                    "mouseup",
                    up
                );

            }
        );

}


createMobileControls();


/* =========================================================
   LEADERBOARD
========================================================= */

function getLeaderboard() {

    const defaultPlayers = [

        {
            name: "NovaPlayer",
            score: 98231
        },

        {
            name: "CyberFox",
            score: 73420
        },

        {
            name: "PixelLord",
            score: 62150
        },

        {
            name: "VoidX",
            score: 51880
        },

        {
            name: "StarKid",
            score: 44120
        }

    ];


    return [

        ...defaultPlayers,

        ...state.highScores

    ]
    .sort(
        (a,b) =>
            b.score -
            a.score
    )
    .slice(
        0,
        10
    );

}


/* =========================================================
   LEADERBOARD UI
========================================================= */

function renderLeaderboard() {

    const container =
        $("#leaderboard");


    if (!container)
        return;


    const board =
        getLeaderboard();


    container.innerHTML =
        board
            .map(
                (player, index) => `

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:12px;
                            padding:13px 0;
                            border-bottom:1px solid rgba(255,255,255,.06);
                        "
                    >

                        <strong
                            style="
                                width:28px;
                                color:#8e80ff;
                            "
                        >
                            #${index + 1}
                        </strong>


                        <div
                            style="flex:1"
                        >

                            <strong>
                                ${player.name}
                            </strong>

                        </div>


                        <span
                            style="
                                color:#ffe45c;
                                font-weight:900;
                            "
                        >
                            ${player.score.toLocaleString()}
                        </span>

                    </div>

                `
            )
            .join("");

}


renderLeaderboard();


/* =========================================================
   RESET DATA
========================================================= */

function resetNOVAData() {

    const confirmed =
        confirm(
            "Xóa toàn bộ dữ liệu NOVA PLAY trên thiết bị này?"
        );


    if (!confirmed)
        return;


    localStorage.removeItem(
        STORAGE_KEY
    );


    location.reload();

}


/* =========================================================
   EXPORT SAVE
========================================================= */

function exportSave() {

    const data =
        JSON.stringify(
            state,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "nova-play-save.json";


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "💾 Đã xuất dữ liệu save"
    );

}


/* =========================================================
   IMPORT SAVE
========================================================= */

function importSave() {

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        ".json";


    input.onchange =
        event => {

            const file =
                event.target
                    .files[0];


            if (!file)
                return;


            const reader =
                new FileReader();


            reader.onload =
                result => {

                    try {

                        const imported =
                            JSON.parse(
                                result.target.result
                            );


                        if (
                            !imported.player
                        ) {

                            throw new Error(
                                "Invalid save"
                            );

                        }


                        state = {

                            ...structuredClone(
                                defaultState
                            ),

                            ...imported,

                            player: {

                                ...defaultState.player,

                                ...(
                                    imported.player
                                    || {}
                                )

                            }

                        };


                        saveState();


                        showToast(
                            "✅ Import save thành công"
                        );


                        setTimeout(
                            () =>
                                location.reload(),
                            700
                        );

                    }

                    catch {

                        showToast(
                            "❌ File save không hợp lệ"
                        );

                    }

                };


            reader.readAsText(
                file
            );

        };


    input.click();

}


/* =========================================================
   NOTIFICATION SYSTEM
========================================================= */

function addNotification(
    title,
    message
) {

    state.notifications.unshift({

        id:
            Date.now(),

        title,

        message,

        time:
            Date.now(),

        read:
            false

    });


    state.notifications =
        state.notifications
            .slice(0, 50);


    saveState();

}


/* =========================================================
   STARTUP
========================================================= */

function startup() {

    updateEventProgress();

    renderProfile();

    renderGames();

    renderLeaderboard();


    if (
        !state.player.name ||
        state.player.name ===
        "Guest"
    ) {

        /* Không ép người dùng nhập tên */

    }


    addNotification(

        "NOVA PLAY",

        `NOVA PLAY V${NOVA_VERSION} đã sẵn sàng.`

    );

}


startup();


/* =========================================================
   DEBUG API
   Dùng trong Console nếu cần test.
========================================================= */

window.NOVA = {

    state,

    games,

    addXP,

    addCoins,

    launchGame,

    resetGame,

    claimDailyReward,

    unlockAchievement,

    renderProfile,

    saveState,

    resetNOVAData,

    exportSave,

    importSave,

    getLeaderboard

};


/* =========================================================
   END NOVA PLAY V4
========================================================= */
