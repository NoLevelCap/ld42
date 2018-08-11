function gamemanager() {
  var _this = this;



  this.init = function(){
    _this.animatables = new Array();
  }

  this.maingameinit = function(){
    state = _this.maingameloading;

    _this.gameContainer = new Container();
    stage.addChild(_this.gameContainer);
    _this.uiContainer = new Container();
    stage.addChild(_this.uiContainer);

    loadMap("test2");
  }

  this.onMapLoad = function(){
    state = _this.maingame;

    _this.player = new player();
    _this.player.setPosition(MapData.properties.spawnX,MapData.properties.spawnY);
    _this.gameContainer.addChild(_this.player);

    _this.overlay = new overlay();
    _this.uiContainer.addChild(_this.overlay);
  }

  this.maingameloading = function(){

  }

  this.maingame = function(){
    for (var i = 0; i < _this.animatables.length; i++) {
      _this.animatables[i].animatable();
    }
  }

  this.endmaingame = function(){

  }

  Container.call( this );
  this.init();


}

gamemanager.prototype = Object.create(Container.prototype);
