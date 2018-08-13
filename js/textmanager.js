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
    _this.rushText = false;
  }

  this.onKeyDown = function(key){
    if (_this.visible && _this.cursorPos < _this.displayText.length && !_this.rushText) {
      _this.rushText = true;
    }
    if (_this.visible && _this.cursorPos >= _this.displayText.length) {
      _this.hideText();
    }
  }

  this.onMouseClick = function() {
    if (_this.visible && _this.cursorPos < _this.displayText.length && !_this.rushText) {
      _this.rushText = true;
    }
    if (_this.visible && _this.cursorPos >= _this.displayText.length) {
      _this.hideText();
    }
  }

  this.removeEventListeners = function() {
    document.removeEventListener("keydown", _this.onKeyDown);
    document.removeEventListener("click", _this.onMouseClick);
  }

  this.queueText = function(text) {
    _this.displayText = text;
    _this.cursorPos = 0;
    _this.showText();
  }

  this.showText = function() {
    paused = true;
    _this.visible = true;
    _this.rushText = false;
  }

  this.hideText = function() {
    paused = false;
    _this.visible = false;
  }

  this.animatable = function() {
    if (_this.cursorPos < _this.displayText.length) {
      if (_this.rushText) {
        _this.cursorPos += 4;
      } else {
        _this.cursorPos += 1;
      }
    }
    var text = _this.displayText.slice(0, _this.cursorPos);
    var fontSize = 24;
    var lineLength = fontSize * 40;
    _this.text = new PIXI.Text(text, {fontFamily: "Courier", fontSize: fontSize, fill: 0xFFFFFF, align: "left", wordWrap: true, wordWrapWidth: lineLength});

    _this.removeChildren();

    /*
    CODE DOESN'T WORK
    for (var i = 0; i < _this.children.length; i++) {
      _this.children[i].destroy({children: true});
    }*/

    _this.addChild(_this.rect);
    _this.addChild(_this.text);
  }

  Container.call( this );
  this.init();

}

textmanager.prototype = Object.create(Container.prototype);
