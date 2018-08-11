var MapData, MapTilemapData, TilemapBaseImg, MapImg;

function onMapLoad(loader, resources){
  MapData = resources["Map"].data;

  var url = window.location.href + MapData.tilesets[0].source;
  var filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.')-1);

  loader
    .add("MapTilemapData", "data/maps/tilesets/"+filename+".json")
    .add("TilemapImg", "img/maps/"+filename+".png")
    .load(onTileSetLoad);
}

function onTileSetLoad(loader, resources){
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

  GAMEMANAGER.Map = new map();
  GAMEMANAGER.gameContainer.addChild(GAMEMANAGER.Map);

  state = GAMEMANAGER.onMapLoad;
}

function loadMap(mapname){
  loader
  .add("Map", "data/maps/"+mapname+".json")
  .load(onMapLoad);
}
