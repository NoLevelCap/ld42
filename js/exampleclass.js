function exampleClass() {
  var _this = this;

  this.init = function(){
  }

  Container.call( this );
  this.init();


}

exampleClass.prototype = Object.create(Container.prototype);