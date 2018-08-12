function textmanager() {
  var _this = this;

  _this.displayText = "";
  _this.cursorPos = 0;
  _this.text = new PIXI.Text();

  this.init = function(){
    GAMEMANAGER.animatables.push(_this);
    document.addEventListener('keydown', _this.onKeyDown);
    document.addEventListener("click", _this.onMouseClick);
    _this.rect = new PIXI.Graphics();
    _this.rect.beginFill(0x222222);
    _this.rect.drawRect(0, 0, 960, 100);
  }

  this.onKeyDown = function(key){
    if (_this.visible && _this.cursorPos >= _this.displayText.length) {
      _this.hideText();
    }
  }

  this.onMouseClick = function() {
    if (_this.visible && _this.cursorPos >= _this.displayText.length) {
      _this.hideText();
    }
  }

  this.queueText = function(text) {
    _this.displayText = text;
    _this.cursorPos = 0;
  }

  this.showText = function() {
    paused = true;
    _this.visible = true;
  }

  this.hideText = function() {
    paused = false;
    _this.visible = false;
  }

  this.animatable = function() {
    if (_this.cursorPos < _this.displayText.length) {
      _this.cursorPos += 1;
    }
    var text = _this.displayText.slice(0, _this.cursorPos);
    var fontSize = 24;
    var lineLength = fontSize * 40;
    _this.text = new PIXI.Text(text, {fontFamily: "Courier", fontSize: fontSize, fill: 0xFFFFFF, align: "left", wordWrap: true, wordWrapWidth: lineLength});
    _this.removeChildren();
    _this.addChild(_this.rect);
    _this.addChild(_this.text);
  }

  Container.call( this );
  this.init();

}

textmanager.prototype = Object.create(Container.prototype);
