module.exports = {
    /** @param {StructureTower} tower **/
    run: function(tower) {
        let closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (closestEnemy) {
            tower.attack(closestEnemy)
        }
        
        let closestRepairable = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        })
        if (closestRepairable) {
            tower.repair(closestRepairable)
        }
    } 
}