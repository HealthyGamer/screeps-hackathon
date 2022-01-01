let roleSpawn = require('role.spawn')
let roleTower = require('role.tower')
let roleWorker = require('role.worker')
let util = require('util')


// TODOs:
// Add construction sites and build buildings


module.exports.loop = function () {
    // This should only ever run once per "active" room
    for (const name in Game.rooms) {
        const room = Game.rooms[name]
        if (!room.memory.sources) {
            const sources = room.find(FIND_SOURCES)
            let results = []
            for (const source of sources) {
                results.push({ id: source.id, freeTiles: util.getFreeTiles(source.pos) })
            }
            room.memory.sources = results
            console.log('Wrote ' + sources.length + ' sources into memory')
        }
    }
    
    // Cleanup memory
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing memory for non-existent creep: ' + name)
        }
    }

    // Run through all structures
    for (let name in Game.structures) {
        let structure = Game.structures[name]
        if (structure instanceof StructureTower) {
            roleTower.run(structure)
        }
        if (structure instanceof StructureSpawn) {
            roleSpawn.run(structure)
        }
    }

    // Run through all creeps
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'worker') {
            roleWorker.run(creep)
        }
    }
}
