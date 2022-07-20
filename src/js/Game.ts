import * as PIXI from 'pixi.js';

class Game {
    app: PIXI.Application;
    // player: PIXI.Sprite;
    player: PIXI.extras.AnimatedSprite | null;
    initialPosition: number;
    playerPosition: number;
    counter: number;
    keys: null | 'ArrowLeft' | 'ArrowRight';
    playerspeed: number;
    standing: string[];
    goRightArr: string[];
    goLeftArr: string[];

    constructor(app: PIXI.Application){
        this.app = app;
        // this.player = PIXI.Sprite.from('../images/player.png');
        this.player = null;
        this.keys = null;
        this.initialPosition = 0;
        this.playerspeed = 5;
        this.standing = ['../images/player.png'];
        this.playerPosition = 0;
        this.counter = 0;
        this.goRightArr = [
            '../images/right_0.png',
            '../images/right_1.png',
            '../images/right_2.png',
            '../images/right_3.png',
            '../images/right_4.png',
            '../images/right_5.png',
        ];
        this.goLeftArr = [
            '../images/left_0.png',
            '../images/left_1.png',
            '../images/left_2.png',
            '../images/left_3.png',
            '../images/left_4.png',
            '../images/left_5.png',
        ];
        this.app.loader
    }

    startGame(){
        document.body.appendChild(app.view);
        this.loadSheet(this.standing);
        // this.playerMove();
        // this.player.anchor.set(0.5);
        // this.player.x = this.app.view.width / 2;
        // this.player.y = this.app.view.height - 42;
        // this.app.stage.addChild(this.player);

        // this.app.ticker.add(() => this.playerMove());
        // this.app.loader.add('player', '../images/player_0.png');

        // this.app.loader.add('player', '../images/player.png');
        // this.app.loader.load(() => this.loadSheet());


        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // this.loadSheet()
    };

    handleKeyDown(e: KeyboardEvent){
        e.preventDefault();
        if (e.repeat) return
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
            this.keys = e.key
            this.playerMove();
        };
    };

    handleKeyUp(e: KeyboardEvent){
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
            this.keys = null;
            this.loadSheet(this.standing);
        };
    };

    playerMove(){
        // if(this.keys === 'ArrowLeft' && this.player.x > 0 + this.player.width / 2){
        //     this.player.x -= this.playerspeed;
        // }else if(this.keys === 'ArrowRight' && this.player.x < this.app.view.width - this.player.width / 2){
        //     this.player.x += this.playerspeed;
        // };
        // this.app.ticker.add(() => this.playerMove());

        if(this.keys === 'ArrowLeft'){
            this.loadSheet(this.goLeftArr)
        }else if(this.keys === 'ArrowRight'){
            this.loadSheet(this.goRightArr);
        }
    };

    loadSheet(moveArray: string[]){
        this.app.loader.reset();
        this.app.loader
        .add(moveArray).load(() => this.movePlayer(moveArray));
    };

    movePlayer(moveArray: string[]){
        this.app.stage.removeChildren();
        this.player = PIXI.extras.AnimatedSprite.fromFrames(moveArray);
        this.initialPosition = (this.app.view.width / 2) - (this.player.width / 2);
        this.player.position.set(this.playerPosition, this.app.view.height - this.player.height);
        this.player.animationSpeed = 1/8;   
        this.player.play();
        this.player.loop = true;
        this.app.stage.addChild(this.player);
        this.app.ticker.add(() => this.moving())
        PIXI.utils.clearTextureCache();
    };

    moving(){
        if(this.keys){
            if(this.player){
                this.counter += 1;
                // let currentPosition = (this.app.view.width / 2) - (this.player.width / 2);
                this.playerPosition = this.initialPosition + this.counter;
                console.log(this.initialPosition, this.counter)
                this.player.position.set(this.playerPosition, this.app.view.height - this.player.height);
            }
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