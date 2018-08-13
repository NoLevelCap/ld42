function map() {
  var _this = this;

  this.currentFloor;
  this.floors = new Array();
  this.mapdata = new Array();
  this.objdata = new Array();
  this.triggerdata = new Array();

  this.ghosts = new Array();

  this.xshift = 0;
  this.yshift = 0;

  _this.objectShakeSprite = new Sprite();
  _this.objectShakeTimer = 0;

  this.init = function(){
    for (var i = 0; i < MapData.layers.length; i++) {
      layer = MapData.layers[i];
      layername = layer.name;

      _this.floors[layername] = new Container();

      for (var b = 0; b < layer.layers.length; b++) {
        Console.log(layername + " loading layer " + b);
        tiles = layer.layers[b];

        _this.floors[layername].ghostLayer = new Container();


        if(tiles.type == "tilelayer"){
          Console.log("Tile Group To Load... " + tiles.name);
          _this.floors[layername].tileLayer = new Container();

          _this.floors[layername].flymFlam = "bot";

          _this.mapdata[layername] = new Array();
          for (var x = 0; x < tiles.width; x++) {
            _this.mapdata[layername][x] = new Array();
            for (var y = 0; y < tiles.height; y++) {
              _this.mapdata[layername][x][y] = new mapTile(tiles.data[x+(y*MapData.width)]-1);
              _this.mapdata[layername][x][y].position.set(MapData.tilewidth*x, MapData.tileheight*y);
              _this.floors[layername].tileLayer.addChild(this.mapdata[layername][x][y]);
            }
          }

          _this.floors[layername].addChild(_this.floors[layername].tileLayer);


          Console.log("Tile Group Loaded: " + tiles.name);
        } else if(tiles.type == "objectgroup" && tiles.name == "Object Layer"){
          Console.log("Object Group To Load... " + tiles.name);
          _this.floors[layername].objectLayer = new Container();
          _this.objdata[layername] = new Array();

          for (var z = 0; z < tiles.objects.length; z++) {
            _this.objdata[layername][z] = new mapObject(tiles.objects[z].gid-1, tiles.objects[z].properties);
            _this.objdata[layername][z].position.set(tiles.objects[z].x, tiles.objects[z].y-MapData.tileheight);
            _this.floors[layername].objectLayer.addChild(_this.objdata[layername][z]);
          }

          _this.floors[layername].addChild(_this.floors[layername].objectLayer);

          Console.log("Object Group Loaded: " + tiles.name);
        } else if(tiles.type == "objectgroup" && tiles.name == "Trigger Layer"){
          Console.log("Trigger Group To Load... " + tiles.name);
          _this.triggerdata[layername] = new Array();

          for (var z = 0; z < tiles.objects.length; z++) {
            _this.triggerdata[layername][z] = new triggerObject(
              tiles.objects[z].x, tiles.objects[z].y,
              tiles.objects[z].width, tiles.objects[z].height,
              tiles.objects[z].properties, tiles.objects[z].name,
              tiles.objects[z].id, layername);
          }

          Console.log("Trigger Group Loaded: " + tiles.name);
        }

      _this.floors[layername].addChild(_this.floors[layername].ghostLayer);

      _this.floors[layername].visible = false;
      _this.addChild(_this.floors[layername]);
    }


    }

    _this.currentFloor = "Ground Floor";
    _this.floors[_this.currentFloor].visible = true;

    _this.xshift = renderer.width/2 - MapData.tilewidth/2;
    _this.yshift = renderer.height/2 - MapData.tileheight/2;
    _this.position.set(_this.xshift, _this.yshift);

    GAMEMANAGER.animatables.push(_this);

  }

  this.animatable = function() {
    if (_this.objectShakeTimer > 0) {
      _this.objectShakeTimer -= 1;
      _this.objectShakeSprite.anchor.set((Math.random() - 0.5) * 0.15, 0.0);
    } else {
      _this.objectShakeSprite.anchor.set(0.0, 0.0);
    }
    if (GAMEMANAGER.electricityTimer > 0) {
      GAMEMANAGER.electricityTimer -= 1;
      GAMEMANAGER.electricitySprite.visible = true;
      GAMEMANAGER.electricitySprite.anchor.y = 1 - GAMEMANAGER.electricitySprite.anchor.y;
      GAMEMANAGER.electricitySprite.scale.y = -GAMEMANAGER.electricitySprite.scale.y;
    } else {
      GAMEMANAGER.electricitySprite.visible = false;
    }
  }

  this.changeFloor = function(floor) {
    _this.floors[_this.currentFloor].visible = false;
    _this.currentFloor = floor;
    _this.floors[_this.currentFloor].visible = true;
  }

  this.pickUp = function(x, y) {
    var tile = _this.mapdata[_this.currentFloor][x][y];
    GAMEMANAGER.interactable = false;
    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      //console.log(screenX, screenY);
      //console.log(obj.Sprite.vertexData);

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if (obj.tileData.item) {
          SOUNDMANAGER.getSound("pickup").play();
          var name = obj.tileData.name;
          if(!(obj.objData.name === undefined)){
            name = obj.objData.name;
          }

          GAMEMANAGER.player.addItem(name);
          var sprite = new Sprite();
          sprite.texture = obj.Sprite.texture;
          sprite.width *= 2;
          sprite.height *= 2;
          sprite.x = (sprite.width * GAMEMANAGER.player.inventory.length) - 32;
          sprite.y = 636;
          GAMEMANAGER.uiContainer.addChild(sprite);
          console.log(GAMEMANAGER.player.inventory);
          GAMEMANAGER.animatables.splice(GAMEMANAGER.animatables.indexOf(obj), 1);
          _this.objdata[_this.currentFloor][i].remove();
          _this.objdata[_this.currentFloor].splice(i, 1);
        }
      }
    }
  }

  this.checkObjects = function(x,y) {
    var tile = _this.mapdata[_this.currentFloor][x][y];
    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      //console.log(screenX, screenY);
      //console.log(obj.Sprite.vertexData);

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if (obj.tileData.item) {
          GAMEMANAGER.interactable = true;
        }
        if (obj.objData.interactive && obj.objData.active) {
          GAMEMANAGER.interactable = true;
        }
      }

      for (var x = 0; x < _this.ghosts.length; x++) {
        if (obj.tileData.shake) {
//          console.log(_this.ghosts[x].mapx + ", " + _this.ghosts[x].mapy + " : " + (obj.x));
          var dist = Math.sqrt(Math.pow(_this.ghosts[x].mapx - (obj.x / tile.width), 2) + Math.pow(_this.ghosts[x].mapy - (obj.y / tile.height), 2));
          if (dist < 3.0 && Math.random() <= 0.01 && _this.objectShakeTimer <= 0) {
            _this.objectShakeSprite = obj.Sprite;
            _this.objectShakeTimer = 30;
          }
        }
      }

    }
  }

  this.openDoors = function(x, y, facing) {
    var dx = 0;
    var dy = 0;
    if (facing.includes('S')) {
      dy = 1;
    } else if (facing.includes('N')) {
      dy = -1;
    }
    if (facing.includes('E')) {
      dx = 1;
    } else if (facing.includes('W')) {
      dx = -1;
    }
    x += dx;
    y += dy;

    var tile = _this.mapdata[_this.currentFloor][x][y];
    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if(obj.tileData.solid){
          if (obj.tileData.type == "door") {
            if (GAMEMANAGER.player.checkInventory("key_" + obj.tileData.colour)) {
              SOUNDMANAGER.getSound("openDoor").play();
              GAMEMANAGER.animatables.splice(GAMEMANAGER.animatables.indexOf(obj), 1);
              _this.objdata[_this.currentFloor][i].remove();
              _this.objdata[_this.currentFloor].splice(i, 1);
            }
          }
        }
      }

    }
  }

  this.checkDoors = function(x, y, facing) {

    var dx = 0;
    var dy = 0;
    if (facing.includes('S')) {
      dy = 1;
    } else if (facing.includes('N')) {
      dy = -1;
    }
    if (facing.includes('E')) {
      dx = 1;
    } else if (facing.includes('W')) {
      dx = -1;
    }
    x += dx;
    y += dy;

    var tile = _this.mapdata[_this.currentFloor][x][y];
    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if(obj.tileData.solid){
          if (obj.tileData.type == "door") {
            if (GAMEMANAGER.player.checkInventory("key_" + obj.tileData.colour)) {
              GAMEMANAGER.interactable = true;
            }
          }
        }
      }

    }
  }

  this.checkCollision = function(x,y) {
    var tile = _this.mapdata[_this.currentFloor][x][y];

    _this.checkTriggers(tile);

    var objCollision = false;

    if(tile.tileData.solid){
      objCollision = true;
    }

    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      //console.log(screenX, screenY);
      //console.log(obj.Sprite.vertexData);

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if (obj.tileData.type == "stairs") {
          SOUNDMANAGER.getSound("stairs").play();
          _this.changeFloor(obj.objData.toFloor);
        }
        if(obj.tileData.solid){
          objCollision = true;
        }
      }

    }
    return objCollision;
  }

  this.checkTriggers = function(tile){
    for (var triggerid in _this.triggerdata[_this.currentFloor]) {
      if (_this.triggerdata[_this.currentFloor].hasOwnProperty(triggerid)) {
        var trigger = _this.triggerdata[_this.currentFloor][triggerid];



        if(trigger.objData.active && !trigger.objData.interactable){


          var screenX = tile.x + tile.width/2;
          var screenY = tile.y + tile.height/2;
          var rect = trigger.bounds;

          console.log();

          if(rect.contains(screenX, screenY)){
            console.log(trigger)
            trigger.trigger();
          }
        }
      }
    }
  }

  this.setPosition = function(x, y){
    _this.position.set(_this.xshift - (x*MapData.tilewidth), _this.yshift - (y*MapData.tileheight));
  }

  Container.call( this );
  this.init();


}

map.prototype = Object.create(Container.prototype);

function mapTile(tileId) {
  var _this = this;

  this.init = function(){
    _this.Sprite = new Sprite(MapImg[tileId]);
    _this.addChild(_this.Sprite);

    _this.cBounds =  new Rectangle(_this.Sprite);


    _this.tileData = MapTilemapData.tileproperties[tileId];
    if(_this.tileData === undefined){
      _this.tileData = new Array();
    }

    GAMEMANAGER.animatables.push(_this);

  }

  this.animatable = function() {
    if (GAMEMANAGER.overlay.active.type == "torch") {
      _this.children[0].tint = 0xFFFFFF;
    } else {
      if (_this.tileData.solid) {
        _this.children[0].tint = 0x000000;
      } else {
        _this.children[0].tint = 0x001A00;
      }
    }
  }

  Container.call( this );
  this.init();
}

mapTile.prototype = Object.create(Container.prototype);

function mapObject(gid, objData) {
  var _this = this;

  this.init = function(){
    _this.Sprite = new Sprite(MapImg[gid]);
    _this.addChild(_this.Sprite);

    _this.cBounds =  new Rectangle(_this.Sprite);

    _this.objData = objData;
    if(_this.objData === undefined){
      _this.objData = new Array();
    }

    _this.tileData = MapTilemapData.tileproperties[gid];
    if(_this.tileData === undefined){
      _this.tileData = new Array();
    }

    GAMEMANAGER.animatables.push(_this);

  }

  this.remove = function() {
    _this.destroy();
  }

  this.animatable = function() {
    if (GAMEMANAGER.overlay.active.type == "torch") {
      _this.children[0].tint = 0xFFFFFF;
    } else {
      _this.children[0].tint = 0x001D00;
    }
  }

  Container.call( this );
  this.init();


}

mapObject.prototype = Object.create(Container.prototype);

function triggerObject(x, y, width, height, objData, name, id, floor) {
  var _this = this;

  _this.triggered = false;

  this.init = function(){
    _this.x = x;
    _this.y = y;
    _this.width = width;
    _this.height = height;

    _this.currentFloor = floor;

    _this.name = name;

    _this.id = id;

    _this.bounds = new PIXI.Rectangle(x, y, width, height);


    _this.objData = objData;
    if(_this.objData === undefined){
      _this.objData = new Array();
    }

    GAMEMANAGER.animatables.push(_this);
  }

  this.trigger = function(){
    Console.log(_this.id + " Trigger: " + _this.name);

    if(_this.triggered)
      return;

    _this.triggered = true;
    Console.log(_this.id + " Trigger Success: " + _this.name);
  }

  this.triggerRun = function(){
    console.log("Trying to trigger run " + _this.objData.type);
    TRIGGERS[_this.objData.type](_this);

    if(_this.objData.interactable){
      if(!_this.objData.singular){
        _this.triggered = false;
        _this.objData.active = true;
      }
    } else {
      _this.objData.active = false;
    }
  }

  this.animatable = function(){
    if(_this.triggered){
      _this.triggerRun();
      _this.triggered = false;
    }

  }

  this.init();


}
