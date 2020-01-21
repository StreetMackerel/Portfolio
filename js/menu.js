var Pilfer = Pilfer || {};

Pilfer.menu = function(){};

//setting game configuration and loading the assets for the loading screen
Pilfer.menu.prototype = {
  preload: function() {
    this.load.image('menu', 'assets/images/menu.png');
  },
  create: function() {

    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //this.state.start('main');
  }
};