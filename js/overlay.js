function overlay() {
  var _this = this;



  this.init = function(){
    _this.inactive = new _this.torch();
    _this.active = new _this.camera();

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
      _inThis.mask.drawCircle(GAMEMANAGER.player.position.x,GAMEMANAGER.player.position.y, 200);
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

    this.process = function(){
    }

    this.init();
  }

  this.camera = function(){
    var _inThis = this;

    this.init = function(){
      _inThis.overlay = new Container();
      _this.addChild(_inThis.overlay);

      _inThis.mask = new Sprite(Tex_Main["cameraMask.png"]);
      _inThis.mask.pivot.set(_inThis.mask.width/2, _inThis.mask.height);
      _inThis.mask.position.set(GAMEMANAGER.player.position.x,GAMEMANAGER.player.position.y);
      _inThis.mask.rotation = GAMEMANAGER.player.rotation;
      _inThis.overlay.addChild(_inThis.mask);
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
      _inThis.mask.rotation = GAMEMANAGER.player.rotation;
    }

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