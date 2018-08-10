//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(640, 320, {resolution: 2, antialias:false});
document.body.appendChild(renderer.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

loader
  .add("img/packed/main.json")
  .add("Dialogue", "data/Dialogue.json")
  .load(setup);

//Define any variables that are used in more than one function
var Tex_Main, Dialogue, state = failed;
var SOUNDMANAGER, GAMEMANAGER;
function setup() {
  state = initTravelScreen;

  GAMEMANAGER = new gameManager();

  //SOUNDMANAGER = new SoundManager();

  Tex_Main = PIXI.loader.resources["img/packed/main.json"].textures;

  Dialogue = PIXI.loader.resources["Dialogue"].data;
  //get the stage details
  Console.log(stage);
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

function failed() {
  console.log("Error Found in State Path");
}
