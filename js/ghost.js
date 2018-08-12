function ghost(x, y, floor) {
  var _this = this;

  this.init = function(){
    _this.Sprite = new Sprite(Tex_Main['player.png']);
    _this.addChild(_this.Sprite);

    _this.mapx = x;
    _this.mapy = y;
    _this.currentFloor = floor;
    _this.delayTicks = 0;

    _this.time = Date.now();

    GAMEMANAGER.Map.ghosts.push(_this);
    GAMEMANAGER.animatables.push(_this);
  }

  this.setPosition = function(x, y){
    _this.mapx = x;
    _this.mapy = y;
    _this.position.set(x * MapData.tilewidth, y * MapData.tileheight);
  }

  this.setGPosition = function(x, y){
    _this.mapx = Math.round(x/MapData.tilewidth)-1;
    _this.mapy = Math.round(y/MapData.tileheight)-1;
    _this.position.set(x, y);
  }

  this.move = function(d){
    var dx = 0, dy = 0;
    if (_this.facing.includes('S')) {
      dy = d;
    } else if (_this.facing.includes('N')) {
      dy = -d;
    }

    if (_this.facing.includes('E')) {
      dx = d;
    } else if (_this.facing.includes('W')) {
      dx = -d;
    }

    _this.setPosition(_this.mapx + dx, _this.mapy + dy);
    var dist = Math.sqrt(Math.pow(_this.mapx - GAMEMANAGER.player.mapx, 2) + Math.pow(_this.mapy - GAMEMANAGER.player.mapy, 2));
    if (dist == 0) {
      GAMEMANAGER.cameraTimer -= 5;
    }
  }

  this.remove = function(){
    GAMEMANAGER.Map.ghosts.splice(array.indexOf(_this), 1);
    _this.destroy();
  }

  this.setFacing = function(dir){
    _this.facing = dir;
  }

  this.animatable = function(){

    var screenX = _this.x + _this.width/2 + GAMEMANAGER.Map.position.x;
    var screenY = _this.y + _this.height/2 + GAMEMANAGER.Map.position.y;

    var rot = Math.atan2(GAMEMANAGER.player.y - screenY, GAMEMANAGER.player.x - screenX);

    _this.rotation = rot + (90*DEG2RAD);

    var rotTestValue = rot + Math.PI;
    if((Math.PI*(3/8)) >= rotTestValue && rotTestValue >= (Math.PI*(1/8))){
      _this.setFacing("NW");
    } else if((Math.PI*(5/8)) >= rotTestValue && rotTestValue >= (Math.PI*(3/8))){
      _this.setFacing("N");
    } else if((Math.PI*(7/8)) >= rotTestValue && rotTestValue >= (Math.PI*(5/8))){
      _this.setFacing("NE");
    } else if((Math.PI*(9/8)) >= rotTestValue && rotTestValue >= (Math.PI*(7/8))){
      _this.setFacing("E");
    } else if((Math.PI*(11/8)) >= rotTestValue && rotTestValue >= (Math.PI*(9/8))){
      _this.setFacing("SE");
    } else if((Math.PI*(13/8)) >= rotTestValue && rotTestValue >= (Math.PI*(11/8))){
      _this.setFacing("S");
    } else if((Math.PI*(15/8)) >= rotTestValue && rotTestValue >= (Math.PI*(13/8))){
      _this.setFacing("SW");
    } else {
      _this.setFacing("W");
    }


    //console.log(Date.now() - _this.time);
    if(Date.now() - _this.time > 1000){
      _this.time = Date.now();
      _this.aiRun();
    }

  }

  this.moveFloor = function(newFloor){
    var triggers = GAMEMANAGER.Map.triggerdata[newFloor];
    var transferPoints = new Array();
    for (var tid in triggers) {
      if (triggers.hasOwnProperty(tid)) {
        var trigger = triggers[tid];
        if(trigger.objData.type == "ghostTransferPoint"){
          transferPoints.push(trigger);

          console.log(_this);
          console.log("Valid Transfer Point");
        }
      }
    }

    if(transferPoints.length <= 0)
      return false;

    var trigger = transferPoints[Math.floor(Math.random() * transferPoints.length)]

    _this.currentFloor = newFloor;
    _this.setGPosition(trigger.x + trigger.width/2, trigger.y + trigger.height/2);

    _this.parent.removeChild(_this);
    GAMEMANAGER.Map.floors[newFloor].ghostLayer.addChild(_this);

  }

  this.aiRun = function(){
    if(_this.currentFloor != GAMEMANAGER.Map.currentFloor){
      if(_this.delayTicks >= 1){
        _this.delayTicks = 0;

        _this.moveFloor(GAMEMANAGER.Map.currentFloor);
      } else {
        _this.delayTicks++;
      }
    } else {
      _this.delayTicks = 0;
      _this.move(1);
    }
  }

  Container.call( this );
  this.init();


}

ghost.prototype = Object.create(Container.prototype);
