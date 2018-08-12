function ghost(x, y, floor) {
  var _this = this;

  _this.spriteList = new Array();

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

    _this.mapx = x;
    _this.mapy = y;
    _this.currentFloor = floor;

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

    if (!paused) {

    var screenX = _this.x + _this.width/2 + GAMEMANAGER.Map.position.x;
    var screenY = _this.y + _this.height/2 + GAMEMANAGER.Map.position.y;

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
      _this.visible = false;
    } else {
      _this.visible = true;
    }

    //console.log(Date.now() - _this.time);
    if(Date.now() - _this.time > 1000){
      _this.time = Date.now();
      _this.aiRun();
    }

  }
  }

  this.aiRun = function(){
    _this.move(1);
  }

  Container.call( this );
  this.init();


}

ghost.prototype = Object.create(Container.prototype);
