const popupMenuContainer = document.getElementById("popup-menu-container");

// General
var quitHandler;
var keydownHandlers = [];
var popup;
var background;

// LobbyHub related variables
var colors;
var associatedPlayers;

export function setColorState(state) {
    associatedPlayers = state;
}

export function setColors(c) {
    colors = c;
}

export function isPopupActive() {
    return popupMenuContainer.innerHTML !== "";
}

export function clearPopup() {
    if (popup)
        popup.remove();

    if (background)
        background.remove();

    if (quitHandler)
        document.removeEventListener("keydown", quitHandler);

    for (const handler of keydownHandlers)
        popup.removeEventListener("keydown", handler);
    keydownHandlers = [];

    popupMenuContainer.innerHTML = "";
}

export function colorPopup(connection, player) {
    clearPopup();
    createPopup("Color selection", colorContent(connection, player));
}

function createPopup(title, content) {
    popup = document.createElement("div");

    popup.id = "popup-menu";
    popup.style.display = "flex";
    popup.tabIndex = "-1";

    const header = document.createElement("h1");
    header.textContent = title;

    const footer = document.createElement("h3");
    footer.textContent = "[Q] to close";

    popup.append(header, content, footer);

    for (const handler of keydownHandlers)
        popup.addEventListener("keydown", handler);

    quitHandler = (e) => {
        if (e.key === "q" || e.key === "Q") {
            clearPopup();
            e.preventDefault();
        }
    }

    document.addEventListener("keydown", quitHandler);

    createBackground();
    popupMenuContainer.append(popup);
    popup.focus();
}

function createBackground() {
    background = document.createElement("div");
    background.id = "popup-background";
    background.addEventListener("click", (e) => {
        if (background.contains(e.target)) {
            clearPopup();
        }
    })
    popupMenuContainer.append(background);
}

function colorContent(connection, player) {
    const content = document.createElement("div");
    content.id = "color-content";

    for (let i = 0; i < colors.length; i++) {
        const div = document.createElement("div");
        div.className = "color-container";

        const span = document.createElement("span");
        span.className = "color-box";

        const num = document.createElement("span");
        num.innerText = `[${i + 1}]`;
        num.style.fontWeight = "bold";

        const color = colors[i];
        var r = (color >> 16) & 255;
        var g = (color >> 8) & 255;
        var b = color & 255;
        span.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        if (associatedPlayers[i] === player.publicId) {
            span.innerHTML = '<svg viewbox="0 0 100 100"><circle r=38 cx=50 cy=50 fill=none stroke="#111" stroke-width=10 /></svg>';
        }
        else if (associatedPlayers[i] !== null) {
            // https://www.svgrepo.com/svg/12848/x-symbol, Public Domain (CC0)
            span.innerHTML = '<svg fill="#111" height="100%" width="100%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-46.08 -46.08 552.93 552.93" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-46.08" y="-46.08" width="552.93" height="552.93" rx="0" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="4.60775"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>';
        }

        clickInvoke(connection, span, ["ChangeColor", player.privateId, i]);
        keydownInvocationAppend(connection, (i + 1).toString(), ["ChangeColor", player.privateId, i]);

        div.append(span, num);
        content.append(div);
    }

    return content;
}

function clickInvoke(connection, element, args) {
    element.addEventListener("click", (e) => {
        connection.invoke(...args).catch((err) => {
            return console.error(err.toString());
        });
    });
}

function keydownInvocationAppend(connection, key, args) {
    const handler = (e) => {
        if (e.key !== key) return;

        connection.invoke(...args).catch((err) => {
            return console.error(err.toString());
        });
    }

    keydownHandlers.push(handler);
}