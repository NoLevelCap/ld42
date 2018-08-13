var MapData, MapTilemapData, TilemapBaseImg, MapImg, CurrentMapName, PreLoaded;

function onMapLoad(loader, resources){
  MapData = JSON.parse(JSON.stringify(resources[CurrentMapName].data));

  if(PreLoaded){
    MapTilemapData = JSON.parse(JSON.stringify(resources[CurrentMapName+"MapTilemapData"].data));

    GAMEMANAGER.Map = new map();
    GAMEMANAGER.gameContainer.addChild(GAMEMANAGER.Map);

    state = GAMEMANAGER.onMapLoad;
    return;
  }

  var url = window.location.href + MapData.tilesets[0].source;
  var filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));

  loader
    .add(CurrentMapName+"MapTilemapData", "data/maps/tilesets/"+filename+".json")
    .add(CurrentMapName+"TilemapImg", "img/maps/"+filename+".png")
    .load(onTileSetLoad);
}

function onTileSetLoad(loader, resources){
  MapTilemapData = JSON.parse(JSON.stringify(resources[CurrentMapName+"MapTilemapData"].data));
  TilemapBaseImg = PIXI.BaseTexture.fromImage(resources[CurrentMapName+"TilemapImg"].url);

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
  CurrentMapName = mapname;

  MapData = new Array();
  MapTilemapData = new Array();

  if(PIXI.loader.resources[mapname] === undefined){
    loader
    .add(mapname, "data/maps/"+mapname+".json")
    .load(onMapLoad);
  } else {
    PreLoaded = true;
    onMapLoad(PIXI.loader, PIXI.loader.resources);
  }


}
