let roleHarvester = require('role.harvester')
let roleUpgrader = require('role.upgrader')
let roleBuilder = require('role.builder')
let roleSpawn = require('role.spawn')
let roleTower = require('role.tower')
let roleWorker = require('role.worker')

// TODOs:
// Add construction sites and build buildings


module.exports.loop = function () {
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

        // Legacy code ;)
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
