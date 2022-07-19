import * as PIXI from 'pixi.js'

class Game {
    app: PIXI.Application;
    player: PIXI.Sprite;
    keys: null | 'ArrowLeft' | 'ArrowRight';
    playerspeed: number;

    constructor(app: PIXI.Application){
        this.app = app;
        this.player = PIXI.Sprite.from('../images/player_0.png');
        this.keys = null;
        this.playerspeed = 5;
    }

    startGame(){
        document.body.appendChild(app.view);
        this.player.anchor.set(0.5);
        this.player.x = this.app.view.width / 2;
        this.player.y = this.app.view.height - 42;
        this.app.stage.addChild(this.player);

        this.app.ticker.add(() => this.playerMove())

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    };

    handleKeyDown(e: KeyboardEvent){
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
            this.keys = e.key
        };
    };

    handleKeyUp(e: KeyboardEvent){
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
            this.keys = null;
        };
    };

    playerMove(){
        if(this.keys === 'ArrowLeft' && this.player.x > 0 + this.player.width / 2){
            this.player.x -= this.playerspeed;
        }else if(this.keys === 'ArrowRight' && this.player.x < this.app.view.width - this.player.width / 2){
            this.player.x += this.playerspeed;
        }
    }
};

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xaaaaaa
});
window.onload = function (){
    const game = new Game(app);
    game.startGame();
}