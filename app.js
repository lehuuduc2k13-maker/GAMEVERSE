"use strict";

/*
 GAMEVERSE V3 CORE

 IMPORTANT:
 - No fake players
 - No fake likes
 - No fake market volume
 - New account starts with 0 Coin
 - Market is virtual
 - AI is local prototype
*/


/* ============================================================
   DATABASE
============================================================ */

const DB_KEY = "GAMEVERSE_V3_CORE";

const REALMS = [
    "Luyện Khí","Trúc Cơ","Kim Đan","Nguyên Anh",
    "Hóa Thần","Luyện Hư","Hợp Thể","Đại Thừa",
    "Độ Kiếp","Chân Tiên","Thiên Tiên","Kim Tiên",
    "Thái Ất","Đại La","Tiên Vương","Tiên Hoàng",
    "Tiên Đế","Thánh Nhân","Hỗn Nguyên","Chí Tôn",
    "Vô Thượng","Đạo Tổ","Siêu Thoát","Vĩnh Hằng"
];

const DEFAULT_DB = {

    version:"V3",

    user:{
        name:"Player",
        creatorName:"New Creator",

        /*
         * IMPORTANT:
         * 1 Coin = $1 according to platform rules.
         * Therefore new user = 0.
         */
        coin:0,

        creatorXP:0,
        creatorLevel:1
    },

    settings:{
        page:"discover"
    },

    games:[
        {
            id:"official-xian",
            title:"Tiên Đạo Vô Tận",
            creator:"GAMEVERSE",
            category:"RPG",
            description:
                "Official Gameverse prototype world.",
            players:0,
            likes:0,
            rating:null,
            shareIndex:0,
            published:true,

            stock:{
                symbol:"XIAN",
                price:1,
                previous:1,
                volume:0,
                marketCap:0
            }
        }
    ],

    projects:[],

    portfolio:{},

    runtime:{
        level:1,
        xp:0,
        hp:100,
        qi:100,
        realm:"Luyện Khí",
        meditation:false,
        stones:0,
        inventory:{
            "Linh Thạch":0,
            "Mộc Tâm":0,
            "Tinh Hoa":0
        }
    }
};


function deepClone(obj){
    return JSON.parse(JSON.stringify(obj));
}


function merge(base, extra){

    if(!extra || typeof extra !== "object")
        return base;

    for(const key of Object.keys(extra)){

        if(
            extra[key] &&
            typeof extra[key] === "object" &&
            !Array.isArray(extra[key]) &&
            base[key] &&
            typeof base[key] === "object" &&
            !Array.isArray(base[key])
        ){

            base[key] = merge(base[key],extra[key]);

        }else{

            base[key] = extra[key];

        }
    }

    return base;
}


function loadDB(){

    try{

        const raw = localStorage.getItem(DB_KEY);

        if(!raw)
            return deepClone(DEFAULT_DB);

        return merge(
            deepClone(DEFAULT_DB),
            JSON.parse(raw)
        );

    }catch(error){

        console.error(error);

        return deepClone(DEFAULT_DB);
    }
}


let DB = loadDB();


function saveDB(){
    localStorage.setItem(
        DB_KEY,
        JSON.stringify(DB)
    );
}


function uid(prefix="id"){
    return prefix + "_" +
        Math.random().toString(36).slice(2,10);
}


function money(value){
    return Number(value || 0).toLocaleString("en-US");
}


function escapeHTML(value){

    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}


function toast(message){

    const box =
        document.getElementById("toast-container");

    const el =
        document.createElement("div");

    el.className="toast";

    el.textContent=message;

    box.appendChild(el);

    setTimeout(()=>{
        el.remove();
    },2800);
}


/* ============================================================
   APP
============================================================ */

const App = {

    start(){

        saveDB();

        this.render();

    },


    render(){

        document.getElementById("app").innerHTML=`

            <div class="app-shell">

                ${this.header()}

                <main class="page">
                    ${this.page()}
                </main>

            </div>

        `;

    },


    header(){

        const page=DB.settings.page;

        return `

        <header class="topbar">

            <div class="logo">
                GAME<span>VERSE</span>
                <small class="version">V3 CORE</small>
            </div>

            <nav class="nav">

                ${this.nav("discover","🎮 Discover")}

                ${this.nav("builder","🤖 AI Builder")}

                ${this.nav("studio","🧑‍💻 Studio")}

                ${this.nav("market","📈 Market")}

                ${this.nav("analytics","📊 Analytics")}

            </nav>

            <div class="top-actions">

                <div class="coin">
                    🪙 ${money(DB.user.coin)}
                </div>

                <button
                    class="creator-btn"
                    onclick="App.creator()">
                    Creator
                </button>

            </div>

        </header>
        `;
    },


    nav(id,label){

        return `
            <button
                class="${DB.settings.page===id?"active":""}"
                onclick="App.go('${id}')">
                ${label}
            </button>
        `;
    },


    go(page){

        DB.settings.page=page;

        saveDB();

        this.render();

        window.scrollTo(0,0);
    },


    page(){

        switch(DB.settings.page){

            case "builder":
                return Builder.render();

            case "studio":
                return Studio.render();

            case "market":
                return Market.render();

            case "analytics":
                return Analytics.render();

            default:
                return Discover.render();
        }
    },


    creator(){

        const name=prompt(
            "Tên Creator:",
            DB.user.creatorName
        );

        if(name===null)
            return;

        if(!name.trim())
            return;

        DB.user.creatorName=name.trim();

        saveDB();

        toast("Creator profile updated");

        this.render();
    }

};


/* ============================================================
   DISCOVER
============================================================ */

const Discover = {

    render(){

        return `

        <section>

            <div class="hero">

                <div class="panel hero-main">

                    <div class="kicker">
                        GAMEVERSE V3
                    </div>

                    <h1>
                        PLAY.
                        <span class="gradient">
                            CREATE.
                        </span>
                        PUBLISH.
                    </h1>

                    <p>
                        Nền tảng kết hợp AI Game Creation
                        với hệ sinh thái game kiểu Roblox.
                        Người chơi chơi game, creator tạo game,
                        AI hỗ trợ xây dựng thế giới.
                    </p>

                    <div class="hero-buttons">

                        <button
                            class="primary-btn"
                            onclick="App.go('builder')">
                            🤖 Create with AI
                        </button>

                        <button
                            class="secondary-btn"
                            onclick="App.go('studio')">
                            🧑‍💻 Open Studio
                        </button>

                    </div>

                </div>


                <div class="panel trending">

                    <div class="section-title">
                        <h2>🔥 Trending</h2>
                    </div>

                    ${this.trending()}

                </div>

            </div>


            <div class="section-title">

                <h2>🎮 Discover Games</h2>

                <span class="muted">
                    ${DB.games.length} games
                </span>

            </div>


            <div class="games-grid">

                ${DB.games.map(g=>this.card(g)).join("")}

            </div>

        </section>

        `;
    },


    trending(){

        if(!DB.games.length)
            return `<div class="empty">No games yet.</div>`;

        return DB.games
            .slice()
            .sort((a,b)=>
                (b.players||0)-(a.players||0)
            )
            .slice(0,4)
            .map((g,i)=>`

                <div style="
                    display:flex;
                    gap:10px;
                    padding:13px 0;
                    border-bottom:1px solid #18223a;
                ">

                    <b style="color:#596681">
                        #${i+1}
                    </b>

                    <div style="flex:1">

                        <b>
                            ${escapeHTML(g.title)}
                        </b>

                        <div class="muted"
                             style="font-size:11px">
                            ${money(g.players)}
                            real players
                        </div>

                    </div>

                    <span>
                        ${g.rating ?? "—"} ⭐
                    </span>

                </div>

            `).join("");
    },


    card(g){

        return `

        <article class="panel game-card">

            <div class="game-cover">
                🎮
            </div>

            <div class="game-info">

                <div class="game-title">
                    ${escapeHTML(g.title)}
                </div>

                <div class="game-creator">
                    by ${escapeHTML(g.creator)}
                </div>

                <div class="game-description">
                    ${escapeHTML(g.description)}
                </div>

                <div class="stats">

                    <div class="stat">
                        <b>${money(g.players)}</b>
                        <span>PLAYERS</span>
                    </div>

                    <div class="stat">
                        <b>${money(g.likes)}</b>
                        <span>LIKES</span>
                    </div>

                    <div class="stat">
                        <b>${g.rating ?? "—"}</b>
                        <span>RATING</span>
                    </div>

                </div>

                <button
                    class="primary-btn game-play"
                    onclick="Runtime.launch('${g.id}')">
                    ▶ PLAY
                </button>

            </div>

        </article>

        `;
    }

};


/* ============================================================
   AI ENGINE
============================================================ */

const AIEngine = {

    generate(prompt){

        const p=prompt.toLowerCase();

        const systems=[];

        const add=(condition,name)=>{
            if(condition && !systems.includes(name))
                systems.push(name);
        };

        add(/3d|three|3 chiều/,"3D World");
        add(/2d|pixel/,"2D World");

        add(
            /rpg|tu tiên|cấp độ|level|cultivation/,
            "Progression"
        );

        add(
            /combat|chiến đấu|đánh|kiếm|súng/,
            "Combat"
        );

        add(
            /npc|nhân vật|đối thoại/,
            "NPC + Dialogue"
        );

        add(
            /quest|nhiệm vụ/,
            "Quest System"
        );

        add(
            /inventory|túi đồ|item|vật phẩm/,
            "Inventory"
        );

        add(
            /craft|chế tạo/,
            "Crafting"
        );

        add(
            /shop|cửa hàng|mua|bán/,
            "Shop"
        );

        add(
            /boss|quái|monster/,
            "Enemy AI"
        );

        add(
            /weather|mưa|tuyết|thời tiết/,
            "Weather"
        );

        add(
            /day|night|ngày|đêm/,
            "Day / Night"
        );

        add(
            /multiplayer|online|nhiều người/,
            "Multiplayer Architecture"
        );

        add(
            /mobile|android|ios|điện thoại/,
            "Mobile Controls"
        );

        add(
            /save|lưu|database/,
            "Persistent Save"
        );

        if(!systems.length){

            systems.push(
                "Core Gameplay",
                "Player System",
                "Progression",
                "Save System"
            );
        }


        let score=62;

        score +=
            Math.min(25,systems.length*2.5);

        if(prompt.length>150)
            score+=5;

        if(/3d/.test(p))
            score+=4;

        score=Math.min(
            100,
            Math.round(score)
        );


        let tier="B";

        if(score>=95)
            tier="S+";
        else if(score>=90)
            tier="S";
        else if(score>=80)
            tier="A";


        const genre=
            /tu tiên|xianxia|cultivation/.test(p)
            ? "Xianxia RPG"
            : /racing|đua xe/.test(p)
            ? "Racing"
            : /survival|sinh tồn/.test(p)
            ? "Survival"
            : /strategy|chiến thuật/.test(p)
            ? "Strategy"
            : /horror|kinh dị/.test(p)
            ? "Horror"
            : /rpg/.test(p)
            ? "RPG"
            : "Adventure";


        const title=
            /tu tiên|xianxia|cultivation/.test(p)
            ? "Tiên Đạo Vô Tận"
            : /zombie/.test(p)
            ? "Zombie Frontier"
            : /racing|đua xe/.test(p)
            ? "Velocity Legends"
            : /space|vũ trụ/.test(p)
            ? "Galaxy Frontier"
            : "AI Generated World";


        return {

            title,

            genre,

            prompt,

            score,

            tier,

            shareIndex:
                Math.min(
                    100,
                    Math.round(score*.75)
                ),

            systems,

            world:{
                type:/3d/.test(p)
                    ?"3D"
                    :"2D",

                openWorld:
                    /open world|thế giới mở/.test(p),

                multiplayer:
                    /multiplayer|online|nhiều người/.test(p)
            },

            gameplay:{
                combat:/combat|chiến đấu|đánh/.test(p),
                quests:/quest|nhiệm vụ/.test(p),
                inventory:/inventory|túi đồ/.test(p),
                crafting:/craft|chế tạo/.test(p),
                npc:/npc|nhân vật/.test(p),
                weather:/weather|thời tiết/.test(p)
            }

        };
    }

};


/* ============================================================
   BUILDER
============================================================ */

const Builder = {

    lastSpec:null,


    render(){

        return `

        <section>

            <div class="section-title">
                <div>
                    <div class="kicker">
                        AI GAME ARCHITECT
                    </div>

                    <h2>
                        Build a game with AI
                    </h2>

                    <p class="muted">
                        Mô tả game → AI phân tích → GameSpec →
                        tạo project → test → publish.
                    </p>
                </div>
            </div>


            <div class="builder-grid">

                <div class="panel panel-padding">

                    <label>
                        WHAT DO YOU WANT TO BUILD?
                    </label>

                    <textarea
                        id="ai-prompt"
                        placeholder="Ví dụ:

Tạo game tu tiên 3D open world.
Người chơi bắt đầu từ Luyện Khí,
có 24 cảnh giới, NPC, quest, boss,
combat, skill, inventory, crafting,
shop, ngày đêm, thời tiết và tối ưu Android."></textarea>


                    <div class="form-row">

                        <select id="builder-type">
                            <option>RPG</option>
                            <option>Adventure</option>
                            <option>Action</option>
                            <option>Survival</option>
                            <option>Racing</option>
                            <option>Strategy</option>
                        </select>

                        <select id="builder-quality">
                            <option>Prototype</option>
                            <option>High</option>
                            <option>Ultra</option>
                        </select>

                        <select id="builder-platform">
                            <option>PC + Mobile</option>
                            <option>PC</option>
                            <option>Mobile</option>
                        </select>

                    </div>


                    <div class="hero-buttons">

                        <button
                            class="primary-btn"
                            onclick="Builder.generate()">
                            ⚡ GENERATE GAME
                        </button>

                        <button
                            class="secondary-btn"
                            onclick="Builder.example()">
                            ✨ EXAMPLE
                        </button>

                    </div>

                </div>


                <div
                    id="ai-result"
                    class="panel panel-padding ai-result">

                    <div class="empty">
                        <div style="font-size:45px">
                            🤖
                        </div>

                        <b>
                            AI Architect đang chờ prompt
                        </b>

                        <p>
                            Hãy mô tả game mày muốn tạo.
                        </p>
                    </div>

                </div>

            </div>

        </section>

        `;
    },


    example(){

        const el=
            document.getElementById("ai-prompt");

        if(!el)return;

        el.value=
`Tạo game tu tiên 3D open world cực lớn.
Người chơi bắt đầu ở Luyện Khí và có 24 cảnh giới.
Có hệ thống hấp thụ linh khí, thiền định,
NPC, dialogue, quest, quái vật, boss,
combat, skill, inventory, item, crafting,
shop, ngày đêm, thời tiết và save.
Game tối ưu cho Android và PC.`;
    },


    generate(){

        const prompt=
            document.getElementById("ai-prompt")
            ?.value.trim();

        if(!prompt){

            toast("Bro nhập prompt trước 😭");

            return;
        }

        this.lastSpec=
            AIEngine.generate(prompt);

        this.showResult(
            this.lastSpec
        );
    },


    showResult(spec){

        document.getElementById("ai-result").innerHTML=`

            <div class="kicker">
                AI ARCHITECT RESULT
            </div>

            <h2 style="margin:7px 0">
                ${escapeHTML(spec.title)}
            </h2>

            <div style="display:flex;
                        align-items:center;
                        gap:20px">

                <div class="score">
                    ${spec.score}
                </div>

                <div>
                    <b>
                        ${spec.tier} TIER
                    </b>

                    <div class="muted">
                        Game Share Index
                        ${spec.shareIndex}/100
                    </div>
                </div>

            </div>


            <div class="section-title">
                <h2>Detected Systems</h2>
            </div>

            <div class="systems">

                ${spec.systems.map(s=>`
                    <span class="tag">
                        ${escapeHTML(s)}
                    </span>
                `).join("")}

            </div>


            <div class="section-title">
                <h2>Generated Architecture</h2>
            </div>

            <div class="panel"
                 style="padding:14px;background:#070b17">

                <pre style="
                    white-space:pre-wrap;
                    color:#8f9ab7;
                    font-size:11px;
                    line-height:1.6;
                ">${escapeHTML(
                    JSON.stringify(spec,null,2)
                )}</pre>

            </div>


            <div class="hero-buttons">

                <button
                    class="primary-btn"
                    onclick="Builder.createProject()">
                    🚀 CREATE PROJECT
                </button>

                <button
                    class="secondary-btn"
                    onclick="Builder.copy()">
                    COPY SPEC
                </button>

            </div>
        `;
    },


    copy(){

        if(!this.lastSpec)
            return;

        navigator.clipboard?.writeText(
            JSON.stringify(
                this.lastSpec,
                null,
                2
            )
        );

        toast("GameSpec copied");
    },


    createProject(){

        if(!this.lastSpec)
            return;

        const project={

            id:uid("project"),

            title:this.lastSpec.title,

            creator:DB.user.creatorName,

            category:this.lastSpec.genre,

            description:this.lastSpec.prompt,

            spec:deepClone(this.lastSpec),

            versions:[
                {
                    number:1,
                    createdAt:Date.now(),
                    spec:deepClone(this.lastSpec)
                }
            ],

            activeVersion:1,

            published:false,

            createdAt:Date.now(),
            updatedAt:Date.now()
        };


        DB.projects.unshift(project);

        DB.user.creatorXP+=100;

        DB.user.creatorLevel=
            Math.floor(
                DB.user.creatorXP/500
            )+1;


        saveDB();

        toast("Project created 🚀");

        App.go("studio");
    }

};


/* ============================================================
   STUDIO
============================================================ */

const Studio = {

    render(){

        return `

        <section>

            <div class="section-title">

                <div>

                    <div class="kicker">
                        CREATOR STUDIO
                    </div>

                    <h2>
                        Your Projects
                    </h2>

                </div>

                <button
                    class="primary-btn"
                    onclick="App.go('builder')">
                    + NEW GAME
                </button>

            </div>


            ${
                DB.projects.length

                ?

                `<div class="project-grid">

                    ${DB.projects
                        .map(p=>this.card(p))
                        .join("")}

                </div>`

                :

                `
                <div class="panel empty">

                    <div style="font-size:50px">
                        🧑‍💻
                    </div>

                    <h3>
                        Chưa có project
                    </h3>

                    <p>
                        Tạo game đầu tiên bằng AI Builder.
                    </p>

                    <button
                        class="primary-btn"
                        onclick="App.go('builder')">
                        CREATE GAME
                    </button>

                </div>
                `
            }

        </section>
        `;
    },


    card(p){

        return `

        <div class="panel project-card">

            <div class="project-meta">

                <span>
                    ${escapeHTML(p.category)}
                </span>

                <span>
                    v${p.activeVersion}
                </span>

            </div>

            <h3>
                ${escapeHTML(p.title)}
            </h3>

            <p class="muted"
               style="font-size:12px">
                ${escapeHTML(p.description)}
            </p>


            <div class="stats">

                <div class="stat">
                    <b>
                        ${p.spec.score}
                    </b>
                    <span>
                        AI SCORE
                    </span>
                </div>

                <div class="stat">
                    <b>
                        ${p.spec.shareIndex}
                    </b>
                    <span>
                        INDEX
                    </span>
                </div>

                <div class="stat">
                    <b>
                        ${p.versions.length}
                    </b>
                    <span>
                        VERSIONS
                    </span>
                </div>

            </div>


            <div class="project-actions">

                <button
                    class="secondary-btn"
                    onclick="Studio.edit('${p.id}')">
                    ✏️ AI EDIT
                </button>

                <button
                    class="primary-btn"
                    onclick="Studio.play('${p.id}')">
                    ▶ TEST
                </button>

            </div>


            <div class="project-actions">

                <button
                    class="secondary-btn"
                    onclick="Studio.publish('${p.id}')">
                    ${p.published?"UPDATE":"PUBLISH"}
                </button>

                <button
                    class="secondary-btn"
                    onclick="Studio.rollback('${p.id}')">
                    ↩ ROLLBACK
                </button>

            </div>

        </div>

        `;
    },


    edit(id){

        const p=
            DB.projects.find(x=>x.id===id);

        if(!p)return;

        const request=prompt(
            "AI EDIT:\nMày muốn thay đổi gì?",
            ""
        );

        if(!request)
            return;

        const combined=
            p.description+
            "\n\nUPDATE REQUEST:\n"+
            request;

        const spec=
            AIEngine.generate(
                combined
            );


        p.spec=spec;

        p.description=
            combined;

        p.activeVersion++;

        p.versions.push({

            number:p.activeVersion,

            createdAt:Date.now(),

            spec:deepClone(spec)
        });

        p.updatedAt=Date.now();


        saveDB();

        toast(
            "AI đã tạo version mới: v"+
            p.activeVersion
        );

        this.render();
    },


    play(id){

        const p=
            DB.projects.find(x=>x.id===id);

        if(!p)return;

        Runtime.launchProject(p);
    },


    publish(id){

        const p=
            DB.projects.find(x=>x.id===id);

        if(!p)return;


        let game=
            DB.games.find(
                g=>g.projectId===id
            );


        if(!game){

            game={

                id:uid("game"),

                projectId:id,

                title:p.title,

                creator:p.creator,

                category:p.category,

                description:p.description,

                players:0,

                likes:0,

                rating:null,

                shareIndex:p.spec.shareIndex,

                published:true,

                stock:{
                    symbol:
                        p.title
                        .replace(/[^A-Za-z]/g,"")
                        .slice(0,4)
                        .toUpperCase()
                        ||"GAME",

                    price:1,

                    previous:1,

                    volume:0,

                    marketCap:0
                }

            };

            DB.games.push(game);

        }else{

            game.title=p.title;

            game.description=p.description;

            game.category=p.category;

            game.shareIndex=
                p.spec.shareIndex;

            game.published=true;

        }


        p.published=true;

        saveDB();

        toast("Game published 🌐");

        App.go("discover");
    },


    rollback(id){

        const p=
            DB.projects.find(x=>x.id===id);

        if(!p)return;

        if(p.versions.length<=1){

            toast("Không có version cũ");

            return;
        }

        p.versions.pop();

        const last=
            p.versions[
                p.versions.length-1
            ];

        p.activeVersion=
            last.number;

        p.spec=
            deepClone(last.spec);

        p.description=
            last.spec.prompt;

        saveDB();

        toast(
            "Rollback về v"+
            last.number
        );

        App.go("studio");
    }

};


/* ============================================================
   MARKET
============================================================ */

const Market = {

    render(){

        return `

        <section>

            <div class="section-title">

                <div>

                    <div class="kicker">
                        GAMEVERSE MARKET
                    </div>

                    <h2>
                        Virtual Market
                    </h2>

                    <p class="muted">
                        Tài sản ảo trong Gameverse.
                        Không phải chứng khoán thật.
                    </p>

                </div>

            </div>


            <div class="panel"
                 style="overflow:auto">

                <table class="market-table">

                    <thead>

                        <tr>
                            <th>GAME / ASSET</th>
                            <th>PRICE</th>
                            <th>CHANGE</th>
                            <th>VOLUME</th>
                            <th>HOLDING</th>
                            <th>ACTION</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            DB.games
                            .filter(g=>g.stock)
                            .map(g=>this.row(g))
                            .join("")
                        }

                    </tbody>

                </table>

            </div>


            <div class="section-title">
                <h2>💼 Portfolio</h2>
            </div>

            <div class="panel panel-padding">

                <h2>
                    🪙 ${money(DB.user.coin)} Coin
                </h2>

                ${
                    Object.keys(DB.portfolio).length

                    ?

                    Object.entries(DB.portfolio)
                    .map(([symbol,amount])=>`
                        <div style="
                            display:flex;
                            justify-content:space-between;
                            padding:13px 0;
                            border-bottom:1px solid #18223a;
                        ">
                            <span>${symbol}</span>
                            <b>${amount}</b>
                        </div>
                    `)
                    .join("")

                    :

                    `<p class="muted">
                        Portfolio trống.
                    </p>`
                }

            </div>

        </section>

        `;
    },


    row(g){

        const s=g.stock;

        const change=
            s.previous
            ?((s.price-s.previous)/s.previous)*100
            :0;

        return `

        <tr>

            <td>
                <b>${escapeHTML(g.title)}</b>

                <div class="muted"
                     style="font-size:10px">
                    ${s.symbol}
                </div>
            </td>

            <td>
                ${s.price} Coin
            </td>

            <td class="${change>=0?"up":"down"}">
                ${change>=0?"+":""}
                ${change.toFixed(2)}%
            </td>

            <td>
                ${money(s.volume)}
            </td>

            <td>
                ${DB.portfolio[s.symbol]||0}
            </td>

            <td>

                <button
                    class="secondary-btn"
                    onclick="Market.trade('${g.id}','buy')">
                    BUY
                </button>

                <button
                    class="secondary-btn"
                    onclick="Market.trade('${g.id}','sell')">
                    SELL
                </button>

            </td>

        </tr>

        `;
    },


    trade(id,type){

        const game=
            DB.games.find(g=>g.id===id);

        if(!game)return;

        const amount=
            Number(
                prompt(
                    `${type==="buy"?"BUY":"SELL"} ${game.stock.symbol}\nSố lượng:`,
                    "1"
                )
            );

        if(!Number.isInteger(amount)||amount<=0){

            toast("Số lượng không hợp lệ");

            return;
        }


        const symbol=
            game.stock.symbol;

        const total=
            game.stock.price*amount;

        DB.portfolio[symbol] ??=0;


        if(type==="buy"){

            if(DB.user.coin<total){

                toast("Không đủ Coin");

                return;
            }

            DB.user.coin-=total;

            DB.portfolio[symbol]+=amount;

        }else{

            if(DB.portfolio[symbol]<amount){

                toast("Không đủ tài sản");

                return;
            }

            DB.portfolio[symbol]-=amount;

            DB.user.coin+=total;

        }


        game.stock.volume+=total;

        saveDB();

        toast(
            `${type==="buy"?"Bought":"Sold"} ${amount} ${symbol}`
        );

        App.render();
    }

};


/* ============================================================
   ANALYTICS
============================================================ */

const Analytics = {

    render(){

        const players=
            DB.games.reduce(
                (sum,g)=>
                    sum+(g.players||0),
                0
            );

        const likes=
            DB.games.reduce(
                (sum,g)=>
                    sum+(g.likes||0),
                0
            );


        return `

        <section>

            <div class="section-title">

                <div>

                    <div class="kicker">
                        ANALYTICS
                    </div>

                    <h2>
                        GAMEVERSE DATA
                    </h2>

                </div>

            </div>


            <div class="analytics-grid">

                ${this.metric(
                    "🎮",
                    "Games",
                    DB.games.length
                )}

                ${this.metric(
                    "👥",
                    "Real Players",
                    money(players)
                )}

                ${this.metric(
                    "❤️",
                    "Real Likes",
                    money(likes)
                )}

                ${this.metric(
                    "🧑‍💻",
                    "Projects",
                    DB.projects.length
                )}

            </div>


            <div class="section-title">
                <h2>
                    Creator Analytics
                </h2>
            </div>


            <div class="panel panel-padding">

                <div>
                    Creator:
                    <b>
                        ${escapeHTML(DB.user.creatorName)}
                    </b>
                </div>

                <div style="margin-top:10px">
                    Creator Level:
                    <b>
                        ${DB.user.creatorLevel}
                    </b>
                </div>

                <div style="margin-top:10px">
                    Creator XP:
                    <b>
                        ${DB.user.creatorXP}
                    </b>
                </div>

            </div>

        </section>

        `;
    },


    metric(icon,label,value){

        return `

        <div class="panel metric">

            <div style="font-size:24px">
                ${icon}
            </div>

            <div class="muted"
                 style="font-size:11px">
                ${label}
            </div>

            <div class="metric-value">
                ${value}
            </div>

        </div>

        `;
    }

};


/* ============================================================
   RUNTIME
============================================================ */

const Runtime = {

    active:false,

    scene:null,
    camera:null,
    renderer:null,

    player:null,

    enemies:[],
    stones:[],

    keys:{},

    clock:null,

    currentGame:null,


    launch(id){

        const game=
            DB.games.find(g=>g.id===id);

        if(!game)return;

        this.currentGame=game;

        this.open();
    },


    launchProject(project){

        this.currentGame={

            id:project.id,

            title:project.title,

            creator:project.creator,

            category:project.category,

            description:project.description,

            players:0,

            likes:0,

            rating:null,

            project:true,

            spec:project.spec
        };

        this.open();
    },


    open(){

        document
            .getElementById("runtime")
            .classList.remove("hidden");


        document.getElementById(
            "runtime-title"
        ).textContent=
            this.currentGame.title;


        this.active=true;

        this.setup();

        this.loop();
    },


    setup(){

        const canvas=
            document.getElementById(
                "gameCanvas"
            );


        this.scene=
            new THREE.Scene();

        this.scene.background=
            new THREE.Color(0x071020);


        this.camera=
            new THREE.PerspectiveCamera(
                65,
                innerWidth/innerHeight,
                .1,
                1000
            );


        this.renderer=
            new THREE.WebGLRenderer({
                canvas,
                antialias:true
            });


        this.renderer.setSize(
            innerWidth,
            innerHeight
        );

        this.renderer.setPixelRatio(
            Math.min(
                devicePixelRatio,
                1.5
            )
        );


        this.clock=
            new THREE.Clock();


        /* LIGHT */

        this.scene.add(
            new THREE.AmbientLight(
                0xffffff,
                .65
            )
        );


        const sun=
            new THREE.DirectionalLight(
                0xffffff,
                1
            );

        sun.position.set(
            30,40,20
        );

        this.scene.add(sun);


        /* WORLD */

        const ground=
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    300,300
                ),

                new THREE.MeshStandardMaterial({
                    color:0x17271d
                })
            );

        ground.rotation.x=
            -Math.PI/2;

        this.scene.add(ground);


        const grid=
            new THREE.GridHelper(
                300,
                60,
                0x33465e,
                0x18283d
            );

        this.scene.add(grid);


        /* PLAYER */

        this.player=
            new THREE.Group();


        const body=
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    .5,
                    1,
                    8,
                    16
                ),

                new THREE.MeshStandardMaterial({
                    color:0x6474ff
                })
            );

        body.position.y=1;

        this.player.add(body);


        const head=
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    .42,
                    16,
                    16
                ),

                new THREE.MeshStandardMaterial({
                    color:0xffcfaa
                })
            );

        head.position.y=2;

        this.player.add(head);


        this.scene.add(
            this.player
        );


        /* STONES */

        this.stones=[];

        for(let i=0;i<20;i++){

            const stone=
                new THREE.Mesh(
                    new THREE.OctahedronGeometry(.32),

                    new THREE.MeshStandardMaterial({
                        color:0x38dfff,
                        emissive:0x0a3744
                    })
                );

            stone.position.set(
                (Math.random()-.5)*90,
                .35,
                (Math.random()-.5)*90
            );

            this.scene.add(stone);

            this.stones.push(stone);
        }


        /* ENEMIES */

        this.enemies=[];

        for(let i=0;i<10;i++){

            const enemy=
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        1.2,
                        1.8,
                        1.2
                    ),

                    new THREE.MeshStandardMaterial({
                        color:0xb94a5e
                    })
                );

            enemy.position.set(
                (Math.random()-.5)*80,
                .9,
                (Math.random()-.5)*80
            );

            this.scene.add(enemy);

            this.enemies.push(enemy);
        }


        this.camera.position.set(
            0,
            6,
            10
        );


        this.camera.lookAt(
            this.player.position
        );


        this.bindKeys();

        this.updateHUD();
    },


    bindKeys(){

        this.keyDown=
            e=>{
                this.keys[
                    e.key.toLowerCase()
                ]=true;

                if(e.key===" ")
                    this.attack();
            };


        this.keyUp=
            e=>{
                this.keys[
                    e.key.toLowerCase()
                ]=false;
            };


        window.addEventListener(
            "keydown",
            this.keyDown
        );

        window.addEventListener(
            "keyup",
            this.keyUp
        );


        this.resize=
            ()=>{
                if(!this.camera)
                    return;

                this.camera.aspect=
                    innerWidth/innerHeight;

                this.camera.updateProjectionMatrix();

                this.renderer.setSize(
                    innerWidth,
                    innerHeight
                );
            };


        window.addEventListener(
            "resize",
            this.resize
        );


        document
            .querySelectorAll(
                ".mobile-controls button"
            )
            .forEach(btn=>{

                const key=
                    btn.dataset.key;

                btn.onpointerdown=
                    ()=>{
                        this.keys[key]=true;
                    };

                btn.onpointerup=
                    ()=>{
                        this.keys[key]=false;
                    };

                btn.onpointerleave=
                    ()=>{
                        this.keys[key]=false;
                    };

            });
    },


    loop(){

        if(!this.active)
            return;


        requestAnimationFrame(
            ()=>this.loop()
        );


        const delta=
            Math.min(
                this.clock.getDelta(),
                .05
            );


        if(!DB.runtime.meditation){

            const speed=
                7*delta;


            if(this.keys.w)
                this.player.position.z-=speed;

            if(this.keys.s)
                this.player.position.z+=speed;

            if(this.keys.a)
                this.player.position.x-=speed;

            if(this.keys.d)
                this.player.position.x+=speed;
        }


        /* ENEMY AI */

        this.enemies.forEach(enemy=>{

            const dx=
                this.player.position.x-
                enemy.position.x;

            const dz=
                this.player.position.z-
                enemy.position.z;

            const distance=
                Math.sqrt(
                    dx*dx+dz*dz
                );


            if(
                distance>2 &&
                distance<35
            ){

                enemy.position.x +=
                    dx/distance*
                    delta*
                    1.3;

                enemy.position.z +=
                    dz/distance*
                    delta*
                    1.3;
            }

        });


        /* CAMERA */

        this.camera.position.x=
            this.player.position.x;

        this.camera.position.z=
            this.player.position.z+10;

        this.camera.lookAt(
            this.player.position.x,
            1,
            this.player.position.z
        );


        this.renderer.render(
            this.scene,
            this.camera
        );
    },


    attack(){

        if(!this.active)
            return;


        if(DB.runtime.meditation){

            toast(
                "Đang thiền. Hãy bấm 🧘 để đứng dậy."
            );

            return;
        }


        let target=null;

        let distance=4;


        for(const enemy of this.enemies){

            const d=
                enemy.position.distanceTo(
                    this.player.position
                );

            if(d<distance){

                distance=d;

                target=enemy;
            }
        }


        if(!target){

            toast(
                "Không có quái vật trong tầm."
            );

            return;
        }


        this.scene.remove(target);

        this.enemies=
            this.enemies.filter(
                e=>e!==target
            );


        this.gainXP(25);

        toast(
            "⚔ Hạ quái vật +25 XP"
        );
    },


    absorb(){

        if(!this.active)
            return;


        if(DB.runtime.meditation){

            toast(
                "Đang thiền."
            );

            return;
        }


        let target=null;

        let distance=3;


        for(const stone of this.stones){

            const d=
                stone.position.distanceTo(
                    this.player.position
                );

            if(d<distance){

                distance=d;

                target=stone;
            }
        }


        if(!target){

            toast(
                "Không có linh thạch gần."
            );

            return;
        }


        this.scene.remove(target);

        this.stones=
            this.stones.filter(
                s=>s!==target
            );


        DB.runtime.stones++;

        DB.runtime.qi=
            Math.min(
                100,
                DB.runtime.qi+10
            );


        DB.runtime.inventory[
            "Linh Thạch"
        ]++;


        this.gainXP(10);

        saveDB();

        this.updateHUD();

        toast(
            "✨ Hấp thụ linh thạch +10 XP"
        );
    },


    meditate(){

        DB.runtime.meditation=
            !DB.runtime.meditation;

        saveDB();

        toast(
            DB.runtime.meditation
            ?"🧘 Bắt đầu thiền — nhân vật sẽ ngồi cho tới khi mày bấm lại."
            :"🧘 Đứng dậy."
        );
    },


    gainXP(amount){

        DB.runtime.xp+=amount;


        while(
            DB.runtime.xp>=100
        ){

            DB.runtime.xp-=100;

            DB.runtime.level++;


            const index=
                Math.min(
                    REALMS.length-1,
                    Math.floor(
                        (DB.runtime.level-1)/10
                    )
                );


            DB.runtime.realm=
                REALMS[index];


            DB.runtime.hp=100;
            DB.runtime.qi=100;


            toast(
                "🔥 Đột phá: "+
                DB.runtime.realm
            );
        }


        saveDB();

        this.updateHUD();
    },


    updateHUD(){

        const realm=
            document.getElementById(
                "hud-realm"
            );

        const hp=
            document.getElementById(
                "hud-hp"
            );

        const qi=
            document.getElementById(
                "hud-qi"
            );

        const level=
            document.getElementById(
                "hud-level"
            );

        const xp=
            document.getElementById(
                "hud-xp"
            );


        if(realm)
            realm.textContent=
                DB.runtime.realm;

        if(hp)
            hp.style.width=
                DB.runtime.hp+"%";

        if(qi)
            qi.style.width=
                DB.runtime.qi+"%";

        if(level)
            level.textContent=
                DB.runtime.level;

        if(xp)
            xp.textContent=
                DB.runtime.xp;
    },


    exit(){

        this.active=false;


        if(this.keyDown)
            window.removeEventListener(
                "keydown",
                this.keyDown
            );

        if(this.keyUp)
            window.removeEventListener(
                "keyup",
                this.keyUp
            );

        if(this.resize)
            window.removeEventListener(
                "resize",
                this.resize
            );


        if(this.renderer)
            this.renderer.dispose();


        document
            .getElementById("runtime")
            .classList.add("hidden");


        saveDB();
    }

};


/* ============================================================
   BOOT
============================================================ */

App.start();
