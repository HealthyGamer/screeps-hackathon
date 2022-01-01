module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
	    if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
	        let sources = creep.room.find(FIND_SOURCES_ACTIVE)
	        creep.memory.harvestTargetId = sources[Math.floor(Math.random() * sources.length)].id
            creep.memory.harvesting = true
            creep.say('🔄 harvest')
	    }
	    
	    if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
	        creep.memory.harvesting = false
	        
	        // Decide on action: 1. filling spawn/extensions, 2. building, 3. upgrading controller
	        const targetOptions = new Map()
	        targetOptions.set('transfer', { 
	            find: FIND_MY_STRUCTURES,
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
	        })
	        targetOptions.set('build', {
	            find: FIND_MY_CONSTRUCTION_SITES,
                filter: null
	        })
	        targetOptions.set('upgrade', { 
	            find: FIND_MY_STRUCTURES,
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTROLLER
                }
	        })
	        
	        for (const [action, option] of targetOptions) {
	            let targets = creep.room.find(option.find, option.filter ? { filter: option.filter } : null)
	            if (targets.length) { // Pick this target!
	                creep.memory.targetId = targets[0].id
	                creep.memory.action = action
	                creep.say(action)
	                
	                break
	            }
	        }
	    }

	    if (!creep.memory.harvesting) {
            let target = Game.getObjectById(creep.memory.targetId)
            let resultCode = -999

            if (target) {
                switch (creep.memory.action) {
                    case 'transfer':
                        resultCode = creep.transfer(target, RESOURCE_ENERGY)
                        break
                    case 'build':
                        resultCode = creep.build(target)
                        break
                    case 'upgrade':
                        resultCode = creep.upgradeController(target)
                        break
                }
            }
            
            switch (resultCode) {
                case OK:
                    break // Everything good!
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                    break
                default: // Something went wrong, go back to harvesting
                    creep.memory.harvesting = true
            }
	    } else {
	        let target = Game.getObjectById(creep.memory.harvestTargetId)
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
    }
}
