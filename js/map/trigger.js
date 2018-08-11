function triggerCode(){
  this.ghostTrigger = function(trigger){
    trigger.objData.inactive = true;

    var ghostSpawnTrigger;

    for (var triggerid in GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor]) {
      if (GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor].hasOwnProperty(triggerid)) {
        if(GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor][triggerid].id == trigger.objData.spawnid){
          ghostSpawnTrigger = GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor][triggerid];
        }
      }
    }

    newGhost = new ghost(
      Math.round((ghostSpawnTrigger.x + ghostSpawnTrigger.width/2) / MapData.tilewidth) - 1,
      Math.round((ghostSpawnTrigger.y + ghostSpawnTrigger.height/2) / MapData.tileheight) - 1,
      ghostSpawnTrigger.currentFloor
    );
    newGhost.pivot.set(newGhost.width/2, newGhost.height/2);
    newGhost.position.set(ghostSpawnTrigger.x + ghostSpawnTrigger.width/2, ghostSpawnTrigger.y + ghostSpawnTrigger.height/2);
    GAMEMANAGER.Map.floors[newGhost.currentFloor].addChild(newGhost);

    console.log(newGhost);
  };

  this.ghostSpawn = function(trigger){

  }
}