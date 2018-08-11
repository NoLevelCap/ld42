function map() {
  var _this = this;

  this.currentFloor;
  this.mapdata = new Array();
  this.xshift = 0;
  this.yshift = 0;

  this.init = function(){
    for (var i = 0; i < MapData.layers.length; i++) {
      layer = MapData.layers[i];
      tiles = layer.layers[0];
      layername = layer.name;


      if(tiles.type == "tilelayer"){
        this.mapdata[layername] = new Array();
        for (var x = 0; x < tiles.width; x++) {
          _this.mapdata[layername][x] = new Array();
          for (var y = 0; y < tiles.height; y++) {
            _this.mapdata[layername][x][y] = new mapTile(tiles.data[x+(y*MapData.width)]-1);
            _this.mapdata[layername][x][y].position.set(MapData.tilewidth*x, MapData.tileheight*y);
            _this.addChild(this.mapdata[layername][x][y]);
          }
        }
      }

    }

    _this.currentFloor = "Ground Floor";

    _this.xshift = renderer.width/2 - MapData.tilewidth/2;
    _this.yshift = renderer.height/2 - MapData.tileheight/2;
    _this.position.set(_this.xshift, _this.yshift);
  }

  this.checkCollision = function(x,y) {
    Console.log(x + "/" + y);
    Console.log(_this.mapdata[_this.currentFloor][x][y]);
    Console.log(_this.mapdata[_this.currentFloor][x][y].tileData);
    return _this.mapdata[_this.currentFloor][x][y].tileData.Solid;
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


    _this.tileData = MapTilemapData.tileproperties[tileId];
    if(_this.tileData === undefined){
      _this.tileData = new Array();
    }
  }

  Container.call( this );
  this.init();
}

mapTile.prototype = Object.create(Container.prototype);
