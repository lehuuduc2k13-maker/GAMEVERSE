/* =========================================
   NOVA PLAY V1
   GAME PLATFORM ENGINE
========================================= */


/* ===============================
   GAME DATABASE
================================ */

const games = [

    {
        id: 1,
        name: "Neon Rush",
        genre: "Arcade",
        players: "1.2K",
        icon: "⚡",
        featured: true
    },

    {
        id: 2,
        name: "Orbit Defender",
        genre: "Action",
        players: "843",
        icon: "🪐"
    },

    {
        id: 3,
        name: "Pixel Forge",
        genre: "Sandbox",
        players: "621",
        icon: "🧱"
    },

    {
        id: 4,
        name: "Sky Drift",
        genre: "Racing",
        players: "509",
        icon: "🚀"
    },

    {
        id: 5,
        name: "Dungeon Echo",
        genre: "Adventure",
        players: "392",
        icon: "🏰"
    },

    {
        id: 6,
        name: "Nova Chess",
        genre: "Strategy",
        players: "274",
        icon: "♟️"
    }

];


/* ===============================
   DOM
================================ */

const gameGrid =
    document.getElementById("gameGrid");

const allGames =
    document.getElementById("allGames");

const search =
    document.getElementById("gameSearch");

const modal =
    document.getElementById("gameModal");

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const scoreDisplay =
    document.getElementById("score");

const eventProgress =
    document.getElementById("eventProgress");

const eventText =
    document.getElementById("eventText");


/* ===============================
   PAGE SYSTEM
================================ */

document
.querySelectorAll(".nav-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const target =
            button.dataset.page;

        document
        .querySelectorAll(".nav-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        document
        .querySelectorAll(".page")
        .forEach(page =>
            page.classList.remove("active")
        );

        document
        .getElementById(target)
        .classList.add("active");

    });

});


/* ===============================
   GAME CARDS
================================ */

function createGameCard(game) {

    return `

        <article class="game-card">

            <div class="game-image">

                ${game.icon}

            </div>

            <h3>

                ${game.name}

            </h3>

            <div class="game-meta">

                ${game.genre}
                •
                ${game.players}
                đang chơi

            </div>

            <button
                class="primary-button"
                onclick="launchGame(${game.id})">

                ▶ CHƠI

            </button>

        </article>

    `;

}


function renderGames(list) {

    gameGrid.innerHTML =
        list.map(createGameCard).join("");

    allGames.innerHTML =
        games.map(createGameCard).join("");

}


renderGames(games);


/* ===============================
   SEARCH
================================ */

search.addEventListener(
    "input",
    () => {

        const value =
            search.value
            .toLowerCase()
            .trim();

        const filtered =
            games.filter(game =>

                game.name
                .toLowerCase()
                .includes(value)

                ||

                game.genre
                .toLowerCase()
                .includes(value)

            );

        renderGames(filtered);

    }
);


/* ===============================
   GAME ENGINE
================================ */

let animationFrame;

let running = false;

let lastTime = 0;

let score = 0;

let eventScore = 0;

let spawnTimer = 0;

let keys = {};


/* PLAYER */

let player;


/* OBJECTS */

let enemies = [];

let energyOrbs = [];


/* ===============================
   KEYBOARD
================================ */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (
            [
                "arrowleft",
                "arrowright",
                "a",
                "d",
                " "
            ].includes(key)
        ) {

            event.preventDefault();

        }

        if (
            key === "r"
            &&
            !modal.classList.contains("hidden")
        ) {

            resetGame();

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


/* ===============================
   LAUNCH
================================ */

function launchGame(id) {

    if (id !== 1) {

        showToast(
            "🚧 Game này đang trong roadmap V2."
        );

        return;

    }

    modal.classList.remove("hidden");

    resetGame();

}


document
.getElementById("playFeatured")
.addEventListener(
    "click",
    () => launchGame(1)
);


document
.getElementById("eventPlay")
.addEventListener(
    "click",
    () => launchGame(1)
);


document
.getElementById("exploreButton")
.addEventListener(
    "click",
    () => {

        document
        .querySelector('[data-page="games"]')
        .click();

    }
);


/* ===============================
   CLOSE
================================ */

document
.getElementById("closeGame")
.addEventListener(
    "click",
    closeGame
);


function closeGame() {

    running = false;

    cancelAnimationFrame(
        animationFrame
    );

    modal.classList.add("hidden");

}


/* ===============================
   RESET GAME
================================ */

function resetGame() {

    player = {

        x: canvas.width / 2 - 20,

        y: canvas.height - 80,

        width: 40,

        height: 40,

        velocity: 0,

        acceleration: 1900,

        friction: .001

    };


    enemies = [];

    energyOrbs = [];

    score = 0;

    spawnTimer = 0;

    running = true;

    lastTime =
        performance.now();

    scoreDisplay.textContent =
        "0";

    cancelAnimationFrame(
        animationFrame
    );

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ===============================
   GAME LOOP
================================ */

function gameLoop(time) {

    if (!running)
        return;

    const delta =
        Math.min(
            (time - lastTime) / 1000,
            .033
        );

    lastTime = time;

    update(delta);

    render();

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ===============================
   UPDATE
================================ */

function update(delta) {


    /* MOVEMENT */

    let direction = 0;

    if (
        keys["arrowleft"]
        ||
        keys["a"]
    ) {

        direction -= 1;

    }


    if (
        keys["arrowright"]
        ||
        keys["d"]
    ) {

        direction += 1;

    }


    player.velocity +=
        direction *
        player.acceleration *
        delta;


    player.velocity *=
        Math.pow(
            player.friction,
            delta
        );


    if (keys[" "]) {

        player.velocity *= 1.05;

    }


    player.x +=
        player.velocity *
        delta;


    player.x =
        Math.max(
            10,
            Math.min(
                canvas.width -
                player.width -
                10,

                player.x
            )
        );


    /* SPAWN */

    spawnTimer -= delta;


    if (spawnTimer <= 0) {

        spawnTimer =
            .35 +
            Math.random() *
            .45;


        const random =
            Math.random();


        if (random < .72) {

            spawnEnemy();

        } else {

            spawnOrb();

        }

    }


    /* UPDATE ENEMIES */

    for (
        const enemy
        of enemies
    ) {

        enemy.y +=
            enemy.speed *
            delta;

    }


    /* UPDATE ORBS */

    for (
        const orb
        of energyOrbs
    ) {

        orb.y +=
            orb.speed *
            delta;

        orb.rotation +=
            delta * 4;

    }


    /* REMOVE */

    enemies =
        enemies.filter(
            enemy =>
                enemy.y <
                canvas.height + 100
        );


    energyOrbs =
        energyOrbs.filter(
            orb =>
                orb.y <
                canvas.height + 100
        );


    /* ENEMY COLLISION */

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

            gameOver();

            return;

        }

    }


    /* ORB COLLECTION */

    for (
        let i =
        energyOrbs.length - 1;

        i >= 0;

        i--
    ) {

        if (
            circleRectangleCollision(
                energyOrbs[i],
                player
            )
        ) {

            energyOrbs.splice(i, 1);

            score += 100;

            eventScore += 100;

        }

    }


    /* PASSIVE SCORE */

    score +=
        Math.floor(
            delta * 10
        );


    scoreDisplay.textContent =
        Math.floor(score);


    /* EVENT */

    updateEvent();

}


/* ===============================
   SPAWN ENEMY
================================ */

function spawnEnemy() {

    enemies.push({

        x:
            20 +
            Math.random() *
            (canvas.width - 70),

        y: -60,

        width:
            35 +
            Math.random() * 35,

        height:
            30 +
            Math.random() * 30,

        speed:
            170 +
            Math.random() * 180

    });

}


/* ===============================
   SPAWN ORB
================================ */

function spawnOrb() {

    energyOrbs.push({

        x:
            20 +
            Math.random() *
            (canvas.width - 40),

        y: -30,

        radius: 10,

        speed:
            130 +
            Math.random() * 100,

        rotation: 0

    });

}


/* ===============================
   COLLISION
================================ */

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
        Math.max(
            rect.x,
            Math.min(
                circle.x,
                rect.x +
                rect.width
            )
        );


    const closestY =
        Math.max(
            rect.y,
            Math.min(
                circle.y,
                rect.y +
                rect.height
            )
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


/* ===============================
   RENDER
================================ */

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* BACKGROUND */

    ctx.fillStyle =
        "#050711";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRID */

    ctx.strokeStyle =
        "#151b2e";

    ctx.lineWidth = 1;


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
        let y = 0;
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


    /* PLAYER */

    ctx.save();

    ctx.shadowBlur = 25;

    ctx.shadowColor =
        "#00d9ff";

    ctx.fillStyle =
        "#00d9ff";

    ctx.fillRect(

        player.x,
        player.y,

        player.width,
        player.height

    );

    ctx.restore();


    /* ENEMIES */

    for (
        const enemy
        of enemies
    ) {

        ctx.save();

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            "#ff4265";

        ctx.fillStyle =
            "#ff4265";

        ctx.fillRect(

            enemy.x,
            enemy.y,

            enemy.width,
            enemy.height

        );

        ctx.restore();

    }


    /* ORBS */

    for (
        const orb
        of energyOrbs
    ) {

        ctx.save();

        ctx.translate(
            orb.x,
            orb.y
        );

        ctx.rotate(
            orb.rotation
        );

        ctx.shadowBlur = 25;

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

}


/* ===============================
   GAME OVER
================================ */

function gameOver() {

    running = false;

    cancelAnimationFrame(
        animationFrame
    );


    showToast(
        `💥 GAME OVER — ${Math.floor(score)} điểm`
    );

}


/* ===============================
   EVENT SYSTEM
================================ */

function updateEvent() {

    const progress =
        Math.min(
            eventScore / 1000,
            1
        );


    eventProgress.style.width =
        `${progress * 100}%`;


    eventText.textContent =
        `${Math.min(
            eventScore,
            1000
        )} / 1000 điểm`;


    if (
        eventScore >= 1000
    ) {

        eventText.textContent =
            "🎉 EVENT COMPLETED!";

    }

}


/* ===============================
   CREATOR
================================ */

document
.getElementById("uploadButton")
.addEventListener(
    "click",
    () => {

        showToast(
            "🚀 Creator Upload sẽ được kết nối backend ở V2."
        );

    }
);


/* ===============================
   THEME
================================ */

document
.getElementById("themeButton")
.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );

        showToast(
            "Theme system đã được bật."
        );

    }
);


/* ===============================
   TOAST
================================ */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.style.opacity =
        "1";


    toast.style.transform =
        "translate(-50%,0)";


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translate(-50%,20px)";

        },

        2200
    );

}
