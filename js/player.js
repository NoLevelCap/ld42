function player() {
  var _this = this;

  _this.mapx;
  _this.mapy;
  _this.facing = "S";
  _this.inventory = new Array();
  _this.spriteList = new Array();
  _this.moveD = 0;
  _this.moveS = 0;
  _this.movementTimerReset = 10;
  _this.movementTimer = 0;
  _this.playerRotate;
//  _this.qFlag = FALSE;

  this.init = function(){
    _this.spriteList.push(new Sprite(Tex_Main["player1_nw.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_n.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_ne.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_e.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_se.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_s.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_sw.png"]));
    _this.spriteList.push(new Sprite(Tex_Main["player1_w.png"]));
    _this.Sprite = _this.spriteList[0];
    _this.addChild(_this.Sprite);

    _this.position.set(renderer.width/2, renderer.height/2);

    _this.pivot.set(_this.width/2, _this.height/2);

    GAMEMANAGER.animatables.push(_this);

    document.addEventListener('keydown', _this.onKeyDown);
    document.addEventListener('keyup', _this.onKeyUp);
  }

  this.onKeyDown = function(key){

    if (key.keyCode === 81 || key.keyCode === 32) {
      if (!paused && GAMEMANAGER.cameraTimer > 0) {
        GAMEMANAGER.overlay.switch();
      }
    }

    // W Key is 87
    // Up arrow is 38
    if (key.keyCode === 87 || key.keyCode === 38) {
      _this.moveD = 1;
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
      _this.moveD = -1;
    }

    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
      _this.moveS = -1;
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
      _this.moveS = 1;
    }

    if (key.keyCode === 82) {
      if (gameover) {
        GAMEMANAGER.setGameOver(false);

        // PUT MAP RELOAD CODE HERE!
        GAMEMANAGER.endmaingame();
        state = GAMEMANAGER.maingameinit;
      }
    }

    if (key.keyCode === 69) {
      GAMEMANAGER.Map.pickUp(_this.mapx, _this.mapy);
      GAMEMANAGER.Map.openDoors(_this.mapx, _this.mapy, _this.facing);
      _this.selectInteractable();
    }
  }

  this.onKeyUp = function(key) {
    if (key.keyCode === 87 || key.keyCode === 38 || key.keyCode === 83 || key.keyCode === 40) {
      _this.moveD = 0;
      _this.movementTimer = 0;
    }
    if (key.keyCode === 65 || key.keyCode === 37 || key.keyCode === 68 || key.keyCode === 39) {
      _this.moveS = 0;
      _this.movementTimer = 0;
    }
  }

  this.changeSprite = function(i) {
    _this.Sprite = _this.spriteList[i];
    _this.removeChildren();
    _this.addChild(_this.Sprite);
  }

  this.setPosition = function(x, y){
    _this.mapx = x;
    _this.mapy = y;
    GAMEMANAGER.Map.setPosition(x, y);
  }

  this.checkInteractable = function(){
    for (var triggerid in GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor]) {
      if (GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor].hasOwnProperty(triggerid)) {
        var trigger = GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor][triggerid];

        if(trigger.objData.active && trigger.objData.interactable){
          var worldX = _this.position.x - GAMEMANAGER.Map.position.x;
          var worldY = _this.position.y - GAMEMANAGER.Map.position.y;
          var rect = trigger.bounds;

          if(rect.contains(worldX, worldY)){
            GAMEMANAGER.interactable = true;
          }
        }
      }
    }
  }

  this.selectInteractable = function(){
    for (var triggerid in GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor]) {
      if (GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor].hasOwnProperty(triggerid)) {
        var trigger = GAMEMANAGER.Map.triggerdata[GAMEMANAGER.Map.currentFloor][triggerid];

        if(trigger.objData.active && trigger.objData.interactable){
          var worldX = _this.position.x - GAMEMANAGER.Map.position.x;
          var worldY = _this.position.y - GAMEMANAGER.Map.position.y;
          var rect = trigger.bounds;

          if(rect.contains(worldX, worldY)){
            trigger.trigger();
          }
        }
      }
    }
  }

  this.animatable = function(){

    if (!paused) {


    if (_this.moveD != 0 || _this.moveS != 0) {
      _this.movementTimer -= 1;
      if (_this.movementTimer <= 0) {
        _this.movementTimer = _this.movementTimerReset;
        _this.move(_this.moveD, _this.moveS);
      }
    }

    GAMEMANAGER.interactable = false;
    GAMEMANAGER.Map.checkDoors(_this.mapx, _this.mapy, _this.facing);
    GAMEMANAGER.Map.checkObjects(_this.mapx, _this.mapy);
    _this.checkInteractable();

    var mousePos = renderer.plugins.interaction.mouse.global;

    var rot = Math.atan2(mousePos.y - renderer.height/2, mousePos.x - renderer.width/2);

    _this.playerRotate = rot + (90*DEG2RAD);
//    _this.rotation = this.playerRotate;

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


  }
  }

  this.setFacing = function(dir){
    _this.facing = dir;
  }

  this.move = function(d, s){
    var dx = 0, dy = 0;

    if (_this.facing.includes('S')) {
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy + d)) && d != 0) {
        dy = d;
      }
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx - s, _this.mapy)) && s != 0) {
        dx = -s;
      }
    } else if (_this.facing.includes('N')) {
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy - d)) && d != 0) {
        dy = -d;
      }
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx + s, _this.mapy)) && s != 0) {
        dx = s;
      }
    }

    if (_this.facing.includes('E')) {
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx + d, _this.mapy)) && d != 0) {
        dx = d;
      }
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy + s)) && s != 0) {
        dy = s;
      }
    } else if (_this.facing.includes('W')) {
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx - d, _this.mapy)) && d != 0) {
        dx = -d;
      }
      if (!(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy - s)) && s != 0) {
        dy = -s;
      }
    }

    if((GAMEMANAGER.Map.checkCollision(_this.mapx + dx, _this.mapy + dy))){
      dx = 0;
      dy = 0;
    }

    _this.setPosition(_this.mapx + dx, _this.mapy + dy);

  }

  this.addItem = function(id) {
    _this.inventory.push(id);
  }

  this.checkInventory = function(id) {
    for (var i = 0; i < _this.inventory.length; i++) {
      if (_this.inventory[i] == id) {
        return true;
      }
    }
    return false;
  }

  Container.call( this );
  this.init();


}

player.prototype = Object.create(Container.prototype);
