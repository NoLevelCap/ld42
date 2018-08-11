function ghost() {
  var _this = this;

  this.init = function(){
    _this.Sprite = new Sprite(Tex_Main['player.png']);
    _this.addChild(_this.Sprite);

    GAMEMANAGER.Map.ghosts.push(_this);
  }

  this.remove = function(){
    GAMEMANAGER.Map.ghosts.splice(array.indexOf(_this), 1);
    _this.destroy();
  }

  this.animatable = function(){
    
  }

  Container.call( this );
  this.init();


}

ghost.prototype = Object.create(Container.prototype);
