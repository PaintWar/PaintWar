const g_alerts = [];
const alertContainer = document.getElementById("alert-container");

export default function requestAlert(text, lifetime_ms = 4000, backgroundColor = "red", color = "black") {
    if (g_alerts.length >= 3 || g_alerts.findIndex(e => e.innerText == text.trim()) != -1) {
        return;
    };

    const alert = createAlert(text, backgroundColor, color);
    g_alerts.push(alert);

    alertContainer.innerHTML = "";
    g_alerts.forEach(e => alertContainer.append(e));

    setTimeout(() => {
        g_alerts.splice(g_alerts.findIndex(e => e.innerText == text.trim()), 1);
        alert.remove();
    }, lifetime_ms);
}

function createAlert(text, backgroundColor = "red", color = "black") {
    const alert = document.createElement("span");

    alert.innerText = text;
    alert.className = "alert";
    alert.style.display = "flex";

    alert.style.color = color;
    alert.style.backgroundColor = backgroundColor;

    return alert;
}