var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Texture = PIXI.Texture,
    Extras = PIXI.extras,
    Polygon = PIXI.Polygon,
    debug = new Debug(true),
    Filter = PIXI.filters;
    Debug = debug,
    sharedticker = PIXI.ticker.shared,
    Console = console,
    DEG2RAD = 0.01745329251;
    paused = false;
    gameover = false;

/*WebFontConfig = {
  custom: {
    families: ["Permanent Marker"],
  },
  active: function() {
  }
};

(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();*/

function Debug(db){
  this.debug = db;
  if (db) {
    console.log("THIS GAME IS IN DEBUG MODE ++ CHECK ON AILIASES.JS TO CORRECT");
  }
  this.log = function(string){
    if(this.debug){
      console.log(string);
    }
  }
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function sign (x1, y1, x2, y2, x3, y3)
{
    return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
}

function PointInTriangle (px, py, x1, y1, x2, y2, x3, y3)
{
    var b1, b2, b3;

    b1 = sign(px, py, x1, y1, x2, y2) < 0.0;
    b2 = sign(px, py, x2, y2, x3, y3) < 0.0;
    b3 = sign(px, py, x3, y3, x1, y1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}
