function overlay() {
  var _this = this;


  this.init = function(){
    _this.text = new PIXI.Text(GAMEMANAGER.cameraTimer, {fontFamily: "Courier", fontSize: 32, fill: 0xFFFFFF, align: "right"});
    _this.text.text = GAMEMANAGER.cameraTimer + " MBs remaining";
    _this.text.x = 600;
    _this.text.y = 50;

    _this.cameraobj = new _this.camera();
    _this.torchobj = new _this.torch();

    _this.active = _this.cameraobj;
    _this.inactive = _this.torchobj;

    GAMEMANAGER.animatables.push(_this);

    _this.switch();
  }

  this.torch = function(){
    var _inThis = this;

    this.init = function(){
      _inThis.overlay = new Container();
      _this.addChild(_inThis.overlay);

      _inThis.mask = new Graphics();
      _inThis.overlay.addChild(_inThis.mask);



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

      var objectsOnFloor = GAMEMANAGER.Map.objdata[GAMEMANAGER.Map.currentFloor];

      _inThis.mask.clear();
      _inThis.mask.beginFill(0xFF, 0.1);
      _inThis.mask.drawCircle(GAMEMANAGER.player.position.x,GAMEMANAGER.player.position.y, 150);
      for (var i = 0; i < objectsOnFloor.length; i++) {
        var obj = objectsOnFloor[i];

        var screenX = obj.x + obj.width/2 + GAMEMANAGER.Map.position.x;
        var screenY = obj.y + obj.height/2 + GAMEMANAGER.Map.position.y;

        var torch = obj.objData.torch;
        if(torch === undefined){
          torch = obj.tileData.torch;
        }


        if(!(torch === undefined)){
          var diff = 2;
          var ran = 0;

          if(obj.objData.tran === undefined){
            ran = obj.objData.tran = Math.random()*10000;
          } else {
            ran = obj.objData.tran;
          }

          var amount = torch*(10-diff) + Math.abs(torch*diff*Math.sin((Date.now()+ran)/1000));
          _inThis.mask.drawCircle(screenX,screenY, amount);
        }
      }
      _inThis.mask.endFill();
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

      _inThis.debugGraphics = new Graphics();
      _this.addChild(_inThis.debugGraphics);

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
