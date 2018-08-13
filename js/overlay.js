function overlay() {
  var _this = this;


  this.init = function(){
    _this.text = new PIXI.Text(GAMEMANAGER.cameraTimer, {fontFamily: "Courier", fontSize: 32, fill: 0xFFFFFF, align: "right"});
    _this.text.text = GAMEMANAGER.cameraTimer + " MBs remaining";
    _this.text.x = 600;
    _this.text.y = 50;

    _this.active = new _this.camera();
    _this.inactive = new _this.torch();

    GAMEMANAGER.animatables.push(_this);

    _this.switch();
  }

  this.torch = function(){
    var _inThis = this;

    this.init = function(){
      _inThis.overlay = new Container();
      _this.addChild(_inThis.overlay);

      _inThis.mask = new Graphics();
      _inThis.mask.beginFill(0xFF);
      _inThis.mask.drawCircle(GAMEMANAGER.player.position.x,GAMEMANAGER.player.position.y, 150);
      _inThis.mask.endFill();

    }

    this.show = function(){
      GAMEMANAGER.gameContainer.mask = _inThis.mask;
      _inThis.overlay.visible = true;
    }

    this.hide = function(){
      GAMEMANAGER.gameContainer.mask = undefined;
      _inThis.overlay.visible = false;
    }

    this.process = function() {
      GAMEMANAGER.memoryText.text = GAMEMANAGER.cameraTimer + " MBs remaining";
    }

    _inThis.type = "torch";

    this.init();
  }

  this.camera = function(){
    var _inThis = this;

    this.init = function(){

      _inThis.sprite = new Sprite(Tex_Main["videoOverlay.png"]);
      _inThis.sprite.width = 960;
      _inThis.sprite.height = 720;

      _inThis.overlay = new Container();
      _this.addChild(_inThis.overlay);

      _inThis.mask = new Sprite(Tex_Main["cameraMask.png"]);
      _inThis.mask.pivot.set(_inThis.mask.width/2, _inThis.mask.height);
      _inThis.mask.position.set(GAMEMANAGER.player.position.x,GAMEMANAGER.player.position.y);
      _inThis.mask.rotation = GAMEMANAGER.player.playerRotate;
      _inThis.overlay.addChild(_inThis.mask);
      _inThis.overlay.addChild(_inThis.sprite);


    }

    this.show = function(){
      console.log("Camera Mask");
      GAMEMANAGER.gameContainer.mask = _inThis.mask;
      _inThis.overlay.visible = true;
    }

    this.hide = function(){
      GAMEMANAGER.gameContainer.mask = undefined;
      _inThis.overlay.visible = false;
    }

    this.process = function(){
      var d = new Date();
      var tempSec = d.getSeconds();
      if (tempSec != GAMEMANAGER.currentTime && !paused) {
        GAMEMANAGER.cameraTimer -= 1;
        GAMEMANAGER.currentTime = tempSec;
        GAMEMANAGER.memoryText.text = GAMEMANAGER.cameraTimer + " MBs remaining";
        if (GAMEMANAGER.cameraTimer <= 0) {
          GAMEMANAGER.setGameOver(true);
          GAMEMANAGER.overlay.switch();
        }
      }
      _inThis.mask.rotation = GAMEMANAGER.player.playerRotate;
    }

    _inThis.type = "camera";

    this.init();
  }

  this.switch = function(){
    _this.active.hide();
    var temp = _this.active;
    _this.active = _this.inactive;
    _this.active.show();
    _this.inactive = temp;
  }

  this.animatable = function(){
    _this.active.process();
  }

  Container.call( this );
  this.init();

}

overlay.prototype = Object.create(Container.prototype);
