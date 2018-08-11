function player() {
  var _this = this;

  _this.mapx;
  _this.mapy;
  _this.facing;
  _this.inventory = new Array();

  this.init = function(){
    _this.Sprite = new Sprite(Tex_Main['player.png']);
    _this.addChild(_this.Sprite);

    _this.position.set(renderer.width/2, renderer.height/2);

    _this.pivot.set(_this.width/2, _this.height/2);

    GAMEMANAGER.animatables.push(_this);

    document.addEventListener('keydown', _this.onKeyDown);
  }

  this.onKeyDown = function(key){
    // W Key is 87
    // Up arrow is 38
    if (key.keyCode === 87 || key.keyCode === 38) {
      _this.move(1);
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
      _this.move(-1);
    }
  }

  this.setPosition = function(x, y){
    _this.mapx = x;
    _this.mapy = y;
    GAMEMANAGER.Map.setPosition(x, y);
  }

  this.animatable = function(){
    var mousePos = renderer.plugins.interaction.mouse.global;

    var rot = Math.atan2(mousePos.y - renderer.height/2, mousePos.x - renderer.width/2);

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

  }

  this.setFacing = function(dir){
    _this.facing = dir;
  }

  this.move = function(d){
    var dx = 0, dy = 0;
    if (_this.facing.includes('S')
    && !(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy + d)) ) {
      dy = d;
    } else if (_this.facing.includes('N')
    && !(GAMEMANAGER.Map.checkCollision(_this.mapx, _this.mapy - d)) ) {
      dy = -d;
    }

    if (_this.facing.includes('E')
    && !(GAMEMANAGER.Map.checkCollision(_this.mapx + d, _this.mapy)) ) {
      dx = d;
    } else if (_this.facing.includes('W')
    && !(GAMEMANAGER.Map.checkCollision(_this.mapx - d, _this.mapy)) ) {
      dx = -d;
    }

    if(!(GAMEMANAGER.Map.checkCollision(_this.mapx + dx, _this.mapy + dy))){
      _this.setPosition(_this.mapx + dx, _this.mapy + dy);
    }
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
