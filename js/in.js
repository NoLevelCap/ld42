/**/


//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(960, 720, {resolution: 1, antialias:false});
document.body.appendChild(renderer.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;


loader
  .add("img/packed.json")
  .add("img/mapicons.json")
  .add("Library", "sound/library.json")
  .load(setup);

//Define any variables that are used in more than one function
var Tex_Main, Map_Icons, state = failed, TRIGGERS;
var SOUNDMANAGER, GAMEMANAGER;
function setup() {

  //SOUNDMANAGER = new SoundManager();

  Tex_Main = PIXI.loader.resources["img/packed.json"].textures;
  Map_Icons = PIXI.loader.resources["img/mapicons.json"].textures;

  SOUNDMANAGER = new SoundManager();

  GAMEMANAGER = new gamemanager();
  //state = GAMEMANAGER.maingameinit;
  state = GAMEMANAGER.levelselectinit;

  TRIGGERS = new triggerCode();

  //Start the game loop
  gameLoop();
}

function gameLoop(){
  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  //Update the current game state:
  state();
  //Render the stage
  renderer.render(stage);
}

function temp() {
}

function failed() {
  console.log("Error Found in State Path");
  state = temp;
}
