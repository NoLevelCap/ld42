function gamemanager() {
  var _this = this;

  this.filename = 'test2';

  this.init = function(){
    _this.animatables = new Array();
  }

  this.maingameinit = function(){
    state = _this.maingameloading;

    _this.gameContainer = new Container();
    stage.addChild(_this.gameContainer);
    _this.uiContainer = new Container();
    stage.addChild(_this.uiContainer);

    console.log("Trying to load: " + _this.filename);
    loadMap(_this.filename);
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
    _this.currentTime = Date.now();

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
      GAMEMANAGER.cameraTimer = 0;
      GAMEMANAGER.overlay.switch();
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
    stage.removeChildren();
    _this.animatables = [];
    delete _this.Map;
    _this.textmanager.destroy({children:true});
    _this.gameContainer.destroy({children:true});
    _this.uiContainer.destroy({children:true});
  }

  this.levelselectinit = function(){
    state = _this.levelselect;

    _this.levelSelectUI = new Container();
    stage.addChild(_this.levelSelectUI);

    _this.levelSelectUI.levelSelectTrack = new Container();
    _this.levelSelectUI.levelSelectTrack.position.set(renderer.width/2 - 240/2, renderer.height/2 - 280/2);
    _this.levelSelectUI.addChild(_this.levelSelectUI.levelSelectTrack);

    _this.levelSelectUI.levels = new Array();
    for (var i = 0; i < LEVELS_INMENU.length; i++) {
      var lWindow = new levelWindow(LEVELS_INMENU[i]);
      lWindow.position.set(250 * i, 0);
      _this.levelSelectUI.levelSelectTrack.addChild(lWindow);
      _this.levelSelectUI.levels.push(lWindow);
    }

    SOUNDMANAGER.addSound("example", ["G0001"]);
    SOUNDMANAGER.getSound("example").play();
  }

  this.levelselect = function(){

  }

  this.changeLevel = function(filename){
    _this.levelselectend();
    _this.filename = filename;
    state = _this.maingameinit;
  }

  this.levelselectend = function(){
    _this.levelSelectUI.destroy({children: true});
  }


  Container.call( this );
  this.init();


}

gamemanager.prototype = Object.create(Container.prototype);
