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


  }

  this.changeFloor = function(floor) {
    _this.floors[_this.currentFloor].visible = false;
    _this.currentFloor = floor;
    _this.floors[_this.currentFloor].visible = true;
  }

  this.checkCollision = function(x,y) {
    var tile = _this.mapdata[_this.currentFloor][x][y];

    _this.checkTriggers(tile);

    if(tile.tileData.solid){
      return true;
    }

    var objCollision = false;

    for (var i = 0; i < _this.objdata[_this.currentFloor].length; i++) {
      var obj = _this.objdata[_this.currentFloor][i];

      var screenX = tile.x + tile.width/2 + _this.position.x;
      var screenY = tile.y + tile.height/2 + _this.position.y;

      //console.log(screenX, screenY);
      //console.log(obj.Sprite.vertexData);

      if(obj.Sprite.containsPoint(new PIXI.Point(screenX, screenY))){
        if (obj.tileData.item) {
          GAMEMANAGER.player.addItem(obj.tileData.name);
          console.log(GAMEMANAGER.player.inventory);
          _this.objdata[_this.currentFloor][i].remove();
          _this.objdata[_this.currentFloor].splice(i, 1);
        }
        if (obj.tileData.type == "stairs") {
          _this.changeFloor(obj.objData.toFloor);
        }
        if(obj.tileData.solid){
          objCollision = true;
          if (obj.tileData.type == "door") {
            if (GAMEMANAGER.player.checkInventory("key_" + obj.tileData.colour)) {
              objCollision = false;
            }
          }
        }
      }

    }
    return objCollision;
  }

  this.checkTriggers = function(tile){
    for (var triggerid in _this.triggerdata[_this.currentFloor]) {
      if (_this.triggerdata[_this.currentFloor].hasOwnProperty(triggerid)) {
        var trigger = _this.triggerdata[_this.currentFloor][triggerid];

        if(!trigger.objData.inactive){
          var screenX = tile.x + tile.width/2;
          var screenY = tile.y + tile.height/2;
          var rect = trigger.bounds;

          if(rect.contains(screenX, screenY)){
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
  }

  this.remove = function() {
    _this.destroy();
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
    if(_this.triggered)
      return;

    _this.triggered = true;
    Console.log(_this.id + " Trigger: " + _this.name);
  }

  this.triggerRun = function(){
    TRIGGERS[_this.objData.type](_this);
  }

  this.animatable = function(){
    if(_this.triggered){
      _this.triggerRun();
      _this.triggered = false;
    }

  }

  this.init();


}
