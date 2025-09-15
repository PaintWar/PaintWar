// Temporary function that draws a grid to show camera movement
export function drawArena(context, camera, gridSize, mapWidth, mapHeight) {
    context.strokeStyle = "black";
    context.lineWidth = 1;

    const startX = Math.max(0, Math.floor(camera.x / gridSize) * gridSize);
    const startY = Math.max(0, Math.floor(camera.y / gridSize) * gridSize);
    const endX = Math.min(mapWidth, camera.x + camera.width);
    const endY = Math.min(mapHeight, camera.y + camera.height);

    // Draw vertical lines 
    for(let x = startX; x < endX; x += gridSize) {
        const screenX = x - camera.x;
        context.beginPath();
        context.moveTo(screenX, 0);
        context.lineTo(screenX, camera.height);
        context.stroke();
    }
    // Draw horizontal lines
    for(let y = startY; y < endY; y += gridSize) {
        const screenY = y - camera.y;
        context.beginPath();
        context.moveTo(0, screenY);
        context.lineTo(camera.width, screenY);
        context.stroke();
    }

}
