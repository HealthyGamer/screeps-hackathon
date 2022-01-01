module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
	    if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true
            creep.say('🔄 harvest')
	    }
	    
	    if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
	        creep.memory.harvesting = false
	        
	        // Decide on action: 1. filling spawn/extensions, 2. building, 3. upgrading controller
	        const targetOptions = new Map()
	        targetOptions.set({ 
	            action: 'transfer',
	            find: FIND_STRUCTURES,
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
	        })
	        targetOptions.set({ 
	            action: 'build',
	            find: FIND_MY_CONSTRUCTION_SITES,
                filter: (structure) => {}
	        })
	        targetOptions.set({ 
	            action: 'upgrade',
	            find: FIND_STRUCTURES,
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTROLLER
                }
	        })
	        
	        let chosenTarget = null
	        while (!chosenTarget) {
	            const option = Array.of(targetOptions)
	            let targets = creep.room.find(option.find, option.filter)
	            if (targets.length) { // Pick this target!
	                chosenTarget = option
	                creep.memory.targetId = targets[0].id
	                creep.memory.action = option.action
	                creep.say(option.action)
	            }
	        }
	    }

	    if (!creep.memory.harvesting) {
            let target = Game.getObjectById(creep.memory.targetId)
            switch (creep.memory.action) {
                case 'transfer':
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                    break
                case 'build':
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    break
                case 'upgrade':
                    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    break
            }
	    } else {
	        let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
    }
}
