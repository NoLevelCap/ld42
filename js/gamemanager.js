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

    loadMap("test3");
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

    _this.cameraTimer = 20;

    _this.overlay = new overlay();
    _this.uiContainer.addChild(_this.overlay);
    var d = new Date();
    _this.currentTime = d.getSeconds();

    _this.interactable = false;
    _this.interactText = new PIXI.Text("Press E", {fontFamily: "Courier", fontSize: 24, fill: 0xFFFFFF, align: "left"});
    _this.interactText.x = 480;
    _this.interactText.y = 360;
    _this.uiContainer.addChild(_this.interactText);
    _this.interactText.visible = false;

    _this.memoryText = new PIXI.Text("", {fontFamily: "Courier", fontSize: 32, fill: 0xFFFFFF, align: "right"});
    _this.memoryText.x = 600;
    _this.memoryText.y = 50;
    _this.uiContainer.addChild(_this.memoryText);

    _this.textmanager = new textmanager();
    _this.uiContainer.addChild(_this.textmanager);

    _this.gameoverSprite = new Sprite(Tex_Main["gameover1.png"]);
    _this.gameoverSprite.x = 160;
    _this.gameoverSprite.y = 200;
    _this.uiContainer.addChild(_this.gameoverSprite);
    _this.gameoverSprite.visible = false;
    _this.gameoverText = new PIXI.Text("Press R to retry this level!", {fontFamily: "Courier", fontSize: 32, fill: 0xDD1111, align: "center", fontWeight: "bold"});
    _this.gameoverText.anchor.set(0.5);
    _this.gameoverText.x = 480;
    _this.gameoverText.y = 500;
    _this.gameoverText.visible = false;
    _this.uiContainer.addChild(_this.gameoverText);

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

  this.setGameOver = function(val) {
    if (val) {
      _this.gameoverSprite.visible = true;
      _this.gameoverText.visible = true;
      gameover = true;
      paused = true;
    } else {
      _this.gameoverSprite.visible = false;
      _this.gameoverText.visible = false;
      gameover = false;
      paused = false;
    }
  }

  this.endmaingame = function(){

  }

  Container.call( this );
  this.init();


}

gamemanager.prototype = Object.create(Container.prototype);
