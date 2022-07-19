import * as PIXI from 'pixi.js'

class Game {
    app: PIXI.Application
    constructor(app: PIXI.Application){
        this.app = app;
    }

    startGame(){
        console.log('this is startGame', this.app)
    }
}

const app = new PIXI.Application();
window.onload = function (){
    const game = new Game(app);
    game.startGame()
}