function SoundManager(){
  var _this = this;

  this.sounds = new Array();
  this.library;

  this.init = function(){
    _this.library = PIXI.loader.resources["Library"].data;
  }

  this.onLoadLibrary = function(loader, resources){

  }

  this.preload = function(ids){

  }

  this.addSound = function(name, ids){

    var sources = new Array();

    for (var i = 0; i < ids.length; i++) {
      sources.push("sound/" + _this.library[ids[i]].filepath);
    }


    _this.sounds[name] = new Howl({
       src: sources
    });

  }

  this.getSound = function(name){
    return _this.sounds[name];
  }



  this.init();
}
