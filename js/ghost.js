function ghost(x, y, floor) {
  var _this = this;

  _this.spriteList = new Array();
  _this.running = false;

  this.init = function(){
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_nw_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_n_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_ne_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_e_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_se_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_s_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_sw_down.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["ghost1_w_down.png"]));
    _this.Sprite = _this.spriteList[0];
    _this.addChild(_this.Sprite);

    _this.glowSprite = new Sprite(Tex_Main["ghostGlow1.png"]);
    _this.glowSprite.pivot.set(0.5)
    _this.glowSprite.anchor.set(0.5, 0.5);
    _this.glowSprite.scale.set(0.0);
    _this.glowSprite.visible = true;
    _this.glowRadius = 400;
    SOUNDMANAGER.getSound("ghostAppear").play();
    GAMEMANAGER.uiContainer.addChild(_this.glowSprite);
    _this.glowRadius = 0;

    _this.mapx = x;
    _this.mapy = y;
    _this.currentFloor = floor;
    _this.delayTicks = 0;

    _this.time = Date.now();

    GAMEMANAGER.Map.ghosts.push(_this);
    GAMEMANAGER.animatables.push(_this);
  }

  this.changeSprite = function(i) {
    _this.Sprite = _this.spriteList[i];
    _this.removeChildren();
    _this.addChild(_this.Sprite);
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
    if (dist <= 1 && !paused) {
      SOUNDMANAGER.getSound("spark").play();
      GAMEMANAGER.electricityTimer = 20;
      GAMEMANAGER.cameraTimer -= 5;
      //Warps to a random area on the map
      _this.moveFloor(GAMEMANAGER.Map.currentFloor);

      if (GAMEMANAGER.cameraTimer <= 0) {
        GAMEMANAGER.setGameOver(true);
      }
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
    var screenX = _this.x + GAMEMANAGER.Map.position.x;
    var screenY = _this.y + GAMEMANAGER.Map.position.y;

    if (!paused) {
      if (_this.glowRadius < 400) {
        _this.glowRadius += 5;
        _this.glowSprite.scale.set(_this.glowSprite.scale.x + 0.07);
        _this.glowSprite.alpha -= 0.025
        _this.glowSprite.position.set(screenX, screenY)
      } else {
        _this.glowSprite.visible = false;
      }
    }



    var rot = Math.atan2(GAMEMANAGER.player.y - screenY, GAMEMANAGER.player.x - screenX);

//    _this.rotation = rot + (90*DEG2RAD);

    var rotTestValue = rot + Math.PI;
    if((Math.PI*(3/8)) >= rotTestValue && rotTestValue >= (Math.PI*(1/8))){
      _this.setFacing("NW");
      _this.changeSprite(0);
    } else if((Math.PI*(5/8)) >= rotTestValue && rotTestValue >= (Math.PI*(3/8))){
      _this.setFacing("N");
      _this.changeSprite(1);
    } else if((Math.PI*(7/8)) >= rotTestValue && rotTestValue >= (Math.PI*(5/8))){
      _this.setFacing("NE");
      _this.changeSprite(2);
    } else if((Math.PI*(9/8)) >= rotTestValue && rotTestValue >= (Math.PI*(7/8))){
      _this.setFacing("E");
      _this.changeSprite(3);
    } else if((Math.PI*(11/8)) >= rotTestValue && rotTestValue >= (Math.PI*(9/8))){
      _this.setFacing("SE");
      _this.changeSprite(4);
    } else if((Math.PI*(13/8)) >= rotTestValue && rotTestValue >= (Math.PI*(11/8))){
      _this.setFacing("S");
      _this.changeSprite(5);
    } else if((Math.PI*(15/8)) >= rotTestValue && rotTestValue >= (Math.PI*(13/8))){
      _this.setFacing("SW");
      _this.changeSprite(6);
    } else {
      _this.setFacing("W");
      _this.changeSprite(7);
    }

    if (GAMEMANAGER.overlay.active.type == "torch") {
      if (_this.glowRadius < 400) {
        _this.visible = true;
      } else {
        _this.visible = false;
      }
    } else {
      _this.visible = true;
    }


    //check
    if(_this.isInCameraFustrum()){
        _this.running = true;
    } else {
      _this.running = false;
    }





    //console.log(Date.now() - _this.time);
    if(Date.now() - _this.time > 1000){
      _this.time = Date.now();
      _this.aiRun();
    }

  }

  this.isInCameraFustrum = function(){
    var visual = GAMEMANAGER.overlay.active.mask;

    if(GAMEMANAGER.overlay.active === GAMEMANAGER.overlay.cameraobj){
      var screenX = _this.x + GAMEMANAGER.Map.position.x;
      var screenY = _this.y + GAMEMANAGER.Map.position.y;

      var p = visual.position.x;
      var q = visual.position.y;
      var theta = visual.rotation;

      var x1 = visual.position.x - visual.width/2;
      var y1 = visual.position.y - visual.height;

      var x2 = visual.position.x + visual.width/2;
      var y2 = visual.position.y - visual.height;

      var nx1 = (x1 - p) * Math.cos(theta) - (y1 - q) * Math.sin(theta) + p;
      var ny1 = (x1 - p) * Math.sin(theta) + (y1 - q) * Math.cos(theta) + q;

      var nx2 = (x2 - p) * Math.cos(theta) - (y2 - q) * Math.sin(theta) + p;
      var ny2 = (x2 - p) * Math.sin(theta) + (y2 - q) * Math.cos(theta) + q;

      var inCamera = PointInTriangle(screenX, screenY, p, q, nx1, ny1, nx2, ny2);

      /*var dbg = GAMEMANAGER.overlay.cameraobj.debugGraphics;

      dbg.clear();
      dbg.beginFill(0xFFFFFF);
      dbg.drawCircle(nx1, ny1, 10);
      dbg.drawCircle(nx2, ny2, 10);
      dbg.drawCircle(screenX, screenY, 10);
      dbg.drawCircle(p, q, 10);
      dbg.endFill();

      console.log("In camera: " + PointInTriangle(
        screenX, screenY,
        p, q,
        nx1, ny1,
        nx2, ny2),

        screenX, screenY,
        p, q,
        nx1, ny1,
        nx2, ny2,
        theta,
      )*/

      return inCamera;
    }

    return false;
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
    } else if(_this.running){
      _this.delayTicks = 0;
      _this.move(-1);
    } else {
      _this.delayTicks = 0;
      _this.move(1);
    }
  }

  Container.call( this );
  this.init();


}

ghost.prototype = Object.create(Container.prototype);
