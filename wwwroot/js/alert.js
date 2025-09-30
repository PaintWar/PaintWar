export default function createAlert(text, lifetime_ms = 4000, backgroundColor = "red", color = "black") {
    const alert = document.createElement("span");

    alert.innerText = text;
    alert.className = "alert";
    alert.style.display = "flex";

    alert.style.color = color;
    alert.style.backgroundColor = backgroundColor;

    document.getElementById("alert-container").append(alert);

    setTimeout(() => {
        alert.style.display = "none";
    }, lifetime_ms);
}