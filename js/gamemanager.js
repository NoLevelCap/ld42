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
    _this.Map.checkCollision(_this.player.mapx, _this.player.mapy);

//    _this.gameContainer.pivot.x = 960 * 0.25;
//    _this.gameContainer.pivot.y = 720 * 0.25;
//    _this.gameContainer.scale.x = _this.gameContainer.scale.y = 2.0;

    _this.cameraTimer = 30;

    _this.overlay = new overlay();
    _this.uiContainer.addChild(_this.overlay);
    _this.textmanager = new textmanager();
    _this.uiContainer.addChild(_this.textmanager);
    var d = new Date();
    _this.currentTime = d.getSeconds();

    _this.interactable = false;
    _this.interactText = new PIXI.Text("Press E", {fontFamily: "Courier", fontSize: 24, fill: 0xFFFFFF, alight: "left"});
    _this.interactText.x = 480;
    _this.interactText.y = 360;
    _this.uiContainer.addChild(_this.interactText);
    _this.interactText.visible = false;

  }

  this.maingameloading = function(){

  }

  this.maingame = function(){
    if (_this.interactable && !paused) {
      _this.interactText.visible = true;
    } else {
      _this.interactText.visible = false;
    }
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
