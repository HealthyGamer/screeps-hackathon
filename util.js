module.exports = {
    /** @param {RoomPosition} pos **/
    getFreeTiles: function(pos) {
        let results = []
        for (let x = pos.x - 1; x < pos.x + 2; x++) {
            for (let y = pos.y - 1; y < pos.y + 2; y++) {
                if (Game.map.getRoomTerrain(pos.roomName).get(x, y) !== TERRAIN_MASK_WALL) { // Free space!
                    results.push([x, y]) // might be enough to just use a counter for how many free spaces there are, instead of saving the positions?
                }
            }
        }
        return results
    }
}
