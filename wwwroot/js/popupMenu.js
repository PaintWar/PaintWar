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
            span.innerHTML = '<svg viewbox="0 0 100 100"><line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="10" /><line x1="10" y1="90" x2="90" y2="10" stroke="black" stroke-width="10" /></svg>';
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