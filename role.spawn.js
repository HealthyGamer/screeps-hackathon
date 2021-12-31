module.exports = {
    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        if (spawn.spawning) {
            spawn.room.visual.text(
                '🛠️' + Game.creeps[spawn.spawning.name].memory.role,
                spawn.pos.x,
                spawn.pos.y + 2,
                { align: 'center', opacity: 0.8 }
            )
            
            return
        }

        const creepsOptions = new Map() // Use Map to ensure creeps get spawned in the correct order
        creepsOptions.set('harvester', {
            max: 3, 
            parts: [WORK, CARRY, MOVE], 
        })
        creepsOptions.set('upgrader', {
            max: 2, 
            parts: [WORK, CARRY, MOVE], 
        })
        creepsOptions.set('builder', {
            max: 2, 
            parts: [WORK, CARRY, MOVE], 
        })
        
        for (const [role, options] of creepsOptions) {
            let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role)
            let requiredEnergy = _.sum(options.parts, b => BODYPART_COST[b])

            if (
                creeps.length < options.max 
                && spawn.store[RESOURCE_ENERGY] >= requiredEnergy // Calculates how much energy is needed to build creep
            ) {
                let newName = role + Game.time
                console.log('Spawning new ' + role + ': ' + newName)
                spawn.spawnCreep(options.parts, newName, { memory: { role: role } })
                break
            }
        }
    }
}