var MapData, MapTilemapData, TilemapBaseImg, MapImg;
var CurrentMap;

function onMapLoad(loader, resources){
  MapData = resources["Map"].data;
  MapTilemapData = resources["MapTilemapData"].data;
  TilemapBaseImg = PIXI.BaseTexture.fromImage(resources["TilemapImg"].url);

  MapImg = new Array();

  var mx = 0, my = 0;
  for (var i = 0; i < MapTilemapData.tilecount; i++) {
    MapImg[i] = Texture.from(TilemapBaseImg);
    MapImg[i].frame = new PIXI.Rectangle(mx, my, MapTilemapData.tilewidth, MapTilemapData.tileheight);
    MapImg[i]._updateUvs();
    mx+= MapTilemapData.tilewidth;
    if(mx >= MapTilemapData.imagewidth){
      mx = 0;
      my += MapTilemapData.tileheight;
    }
  }

  CurrentMap = new map();
  stage.addChild(CurrentMap);
}

function loadMap(mapname){
  loader
  .add("Map", "data/maps/"+mapname+".json")
  .add("MapTilemapData", "data/maps/tilesets/"+mapname+".json")
  .add("TilemapImg", "img/maps/"+mapname+".png")
  .load(onMapLoad);
}
