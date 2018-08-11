function ghost(x, y, floor) {
  var _this = this;

  this.init = function(){
    _this.Sprite = new Sprite(Tex_Main['player.png']);
    _this.addChild(_this.Sprite);

    _this.mapx = x;
    _this.mapy = y;
    _this.currentFloor = floor;

    _this.time = Date.now();

    GAMEMANAGER.Map.ghosts.push(_this);
    GAMEMANAGER.animatables.push(_this);
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

  this.aiRun = function(){
    _this.move(1);
  }

  Container.call( this );
  this.init();


}

ghost.prototype = Object.create(Container.prototype);
