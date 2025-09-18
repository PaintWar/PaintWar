// Temporary function that draws a grid to show camera movement
export function drawArena(world, gridSize, mapWidth, mapHeight) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x000000, 1);

    for (let x = 0; x <= mapWidth; x += gridSize) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, mapHeight);
    }

    for (let y = 0; y <= mapHeight; y += gridSize) {
        graphics.moveTo(0, y);
        graphics.lineTo(mapWidth, y);
    }

    world.addChild(graphics);
}
