function levelWindow(levelfilename) {
  var _this = this;

  this.init = function(){
    _this.filename = levelfilename;

    var ico = Map_Icons[levelfilename + ".png"];
    if(ico === undefined){
      ico = Map_Icons["default.png"];
    }

    _this.sprite = new Sprite(ico);
    _this.addChild(_this.sprite);

    _this.text = new PIXI.Text(levelfilename, {fontFamily: "Courier", fontSize: 32, fill: 0xFFFFFF, align: "center", wordWrap: true, wordWrapWidth: 240});
    _this.text.position.set(240/2 - _this.text.width/2, 240);
    _this.addChild(_this.text);

    _this.interactive = true;
    _this.on('pointerdown', _this.selectLevel);


  }

  this.selectLevel = function(){
    GAMEMANAGER.changeLevel(_this.filename);
  }

  Container.call( this );
  this.init();


}

levelWindow.prototype = Object.create(Container.prototype);
