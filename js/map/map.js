function map() {
  var _this = this;

  this.mapdata = new Array();

  this.init = function(){
    for (var i = 0; i < MapData.layers.length; i++) {
      layer = MapData.layers[i];
      layername = layer.name;

      if(layer.type == "tilelayer"){
        this.mapdata[layername] = new Array();
        for (var x = 0; x < MapData.width; x++) {
          _this.mapdata[layername][x] = new Array();
          for (var y = 0; y < MapData.height; y++) {
            _this.mapdata[layername][x][y] = new Sprite(MapImg[layer.data[x+(y*MapData.width)]-1]);
            _this.mapdata[layername][x][y].position.set(MapData.tilewidth*x, MapData.tileheight*y);
            _this.addChild(this.mapdata[layername][x][y]);
          }
        }
      }

    }
  }

  Container.call( this );
  this.init();


}

map.prototype = Object.create(Container.prototype);

function mapTile() {
  var _this = this;

  this.init = function(){
  }

  Container.call( this );
  this.init();


}

mapTile.prototype = Object.create(Container.prototype);
