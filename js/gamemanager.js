function gamemanager() {
  var _this = this;

  this.filename = 'test2';

  this.init = function(){
    _this.animatables = new Array();

    _this.levelSelectNum = 0;
  }

  this.maingameinit = function(){
    state = _this.maingameloading;

    _this.gameContainer = new Container();

    _this.gameContainer.crt = new Filter.CRTFilter({
      seed: Math.random()*1000
    });
    _this.gameContainer.glitch = new Filter.GlitchFilter({
      fillMode: 3,
      seed: Math.random()*1000,
      slices: 2,
      offset: -10
    });

    _this.gameContainer.bloom = new Filter.AdjustmentFilter({
      gamma: 1.1,
      saturation: 0.9,
      contrast: 1.3,
      brightness: 0.9
    });

    /*_this.gameContainer.glow = new Filter.GlowFilter({
      innerStrength: 1,
      outerStrength: 2,
      distance: 15,
      color: 0x4df543
    });*/

    _this.gameContainer.blur = new Filter.BlurFilter(0.1, 1);

    stage.addChild(_this.gameContainer);

    _this.uiContainer = new Container();

    _this.uiContainer.crt = new Filter.CRTFilter({
      seed: Math.random()*1000
    });
    _this.uiContainer.glitch = new Filter.GlitchFilter({
      fillMode: "CLAMP",
      seed: Math.random()*1000,
      slices: 2,
      offset: -10
    });

    _this.uiContainer.bloom = new Filter.AdjustmentFilter({
      gamma: 1.8
    });

    _this.uiContainer.filters = [
      //_this.uiContainer.bloom,
      //_this.uiContainer.glitch,
      //_this.uiContainer.crt
    ];

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

    _this.cameraTimer = 80;

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

    _this.electricitySprite = new Sprite(Tex_Main["electricity1.png"]);
    _this.electricitySprite.width = 960;
    _this.electricitySprite.height = 720;
    _this.electricitySprite.visible = false;
    _this.electricityTimer = 0;
    _this.uiContainer.addChild(_this.electricitySprite);

  }

  this.maingameloading = function(){

  }

  this.maingame = function(){

    _this.gameContainer.crt.time += 0.5;
    if(_this.gameContainer.crt.time % 50 == 0){
      if(_this.gameContainer.glitch.slices > 0){
        _this.gameContainer.glitch.slices = 0;
      } else {
        _this.gameContainer.glitch.slices = Math.floor(Math.random()*4);
      }
    }

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
    _this.player.removeEventListeners();
    _this.textmanager.removeEventListeners();
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

    _this.levelSelectUI.under = new Container();
    _this.levelSelectUI.under.crt = new Filter.CRTFilter({
      seed: Math.random()*1000
    });
    _this.levelSelectUI.under.glitch = new Filter.GlitchFilter({
      fillMode: 3,
      seed: Math.random()*1000,
      slices: 2,
      offset: -10
    });

    _this.levelSelectUI.under.bloom = new Filter.AdjustmentFilter({
      gamma: 1.8
    });
    _this.levelSelectUI.under.filters = [
      _this.levelSelectUI.under.bloom,
      _this.levelSelectUI.under.glitch,
      _this.levelSelectUI.under.crt
    ];

    _this.levelSelectUI.addChild(_this.levelSelectUI.under);


    _this.levelSelectUI.levelSelectTrack = new Container();
    _this.levelSelectUI.levelSelectTrack.position.set(renderer.width/2 - 240/2, renderer.height/2 - 280/2 + 100);
    _this.levelSelectUI.under.addChild(_this.levelSelectUI.levelSelectTrack);



    _this.levelSelectUI.levels = new Array();
    for (var i = 0; i < LEVELS_INMENU.length; i++) {
      var lWindow = new levelWindow(LEVELS_INMENU[i]);
      lWindow.position.set(250 * i - (250 * _this.levelSelectNum), 0);
      _this.levelSelectUI.levelSelectTrack.addChild(lWindow);
      _this.levelSelectUI.levels.push(lWindow);
    }


    _this.levelSelectUI.rightButton = new Sprite(Tex_Main["arrow.png"])
    _this.levelSelectUI.rightButton.position.set(renderer.width/2 - 240/2 + 450, renderer.height/2 - 280/2 + 160);
    _this.levelSelectUI.rightButton.interactive = true;
    _this.levelSelectUI.rightButton.buttonMode = true;
    _this.levelSelectUI.rightButton.on("pointerdown", (event) => {
      _this.levelSelectUI.levelSelectTrack.position.set(_this.levelSelectUI.levelSelectTrack.position.x - 250, _this.levelSelectUI.levelSelectTrack.position.y);
    });
    _this.levelSelectUI.under.addChild(_this.levelSelectUI.rightButton);

    _this.levelSelectUI.leftButton = new Sprite(Tex_Main["arrow.png"])
    _this.levelSelectUI.leftButton.scale.x = -1
    _this.levelSelectUI.leftButton.position.set(150, renderer.height/2 - 280/2 + 160);
    _this.levelSelectUI.leftButton.interactive = true;
    _this.levelSelectUI.leftButton.buttonMode = true;
    _this.levelSelectUI.leftButton.on("pointerdown", (event) => {
      _this.levelSelectUI.levelSelectTrack.position.set(_this.levelSelectUI.levelSelectTrack.position.x + 250, _this.levelSelectUI.levelSelectTrack.position.y);
    });
    _this.levelSelectUI.under.addChild(_this.levelSelectUI.leftButton);


    _this.levelSelectUI.logo = new Sprite(Tex_Main["haunttv.png"]);
    _this.levelSelectUI.logo.position.set(520, 80);
    _this.levelSelectUI.under.addChild(_this.levelSelectUI.logo);

    _this.levelSelectUI.screen = new Sprite(Tex_Main["tv.png"]);
    _this.levelSelectUI.addChild(_this.levelSelectUI.screen);

    SOUNDMANAGER.addSound("example", ["G0001"]);
    SOUNDMANAGER.addSound("pickup", ["G0002"]);
    SOUNDMANAGER.addSound("openDoor", ["G0003"]);
    SOUNDMANAGER.addSound("ghostAppear", ["G0004"]);
    SOUNDMANAGER.addSound("spark", ["G0005"]);
    SOUNDMANAGER.addSound("click", ["G0006"]);
    SOUNDMANAGER.addSound("stairs", ["G0007"]);
  }

  this.levelselect = function(){
    _this.levelSelectUI.under.crt.time += 0.5;
    if(_this.levelSelectUI.under.crt.time % 50 == 0){
      if(_this.levelSelectUI.under.glitch.slices > 0){
        _this.levelSelectUI.under.glitch.slices = 0;
      } else {
        _this.levelSelectUI.under.glitch.slices = Math.floor(Math.random()*4);
      }
    }
  }

  this.changeLevel = function(filename){
    _this.levelselectend();
    _this.filename = filename;
    state = _this.maingameinit;
  }

  this.levelselectend = function(){
    _this.levelSelectUI.destroy({children: true});
  }

  this.endLevel = function() {
    _this.endmaingame();
    _this.levelSelectNum++;
    _this.levelselectinit();
  }

  Container.call( this );
  this.init();


}

gamemanager.prototype = Object.create(Container.prototype);
