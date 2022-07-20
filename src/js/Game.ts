import * as PIXI from 'pixi.js';

class Game {
	playerCellSize: number;
	animationSpeed: number;
	movementSpeed: number;
	playerPosition: number;
	app: PIXI.Application;
	player: PIXI.extras.AnimatedSprite | null;
	keys: null | 'ArrowLeft' | 'ArrowRight';
	playerSheet:
		| { right: PIXI.Texture[]; left: PIXI.Texture[]; static: PIXI.Texture[] }
		| { right: null; left: null; static: null };

	constructor(app: PIXI.Application) {
		this.playerCellSize = 84;
		this.animationSpeed = 0.23;
		this.movementSpeed = 1.8;
		this.playerPosition = 0;
		this.app = app;
		this.playerSheet = { right: null, left: null, static: null };
		this.player = null;
		this.keys = null;
	}

	startGame() {
		document.body.appendChild(this.app.view);
		this.app.loader.add('player', '../images/player.png');
		app.loader.load(() => this.onLoadingDone());

		window.addEventListener('keydown', (e) => this.handleKeyDown(e));
		window.addEventListener('keyup', (e) => this.handleKeyUp(e));
	}

	onLoadingDone() {
		this.createPlayerSheet();
		this.createPlayer();

		this.app.ticker.add(() => this.gameLoop());
	}

	createPlayerSheet() {
		let sheet = PIXI.BaseTexture.from(this.app.loader.resources['player'].url);
		let w = this.playerCellSize;
		let h = this.playerCellSize;

		this.playerSheet.left = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 2 * h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 2 * h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 2 * h, w, h)),
		];

		this.playerSheet.right = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(7 * w, h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 2 * h, w, h)),
		];

		this.playerSheet.static = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h)),
		];
	}

	createPlayer() {
		if (this.playerSheet.static) {
			this.player = new PIXI.extras.AnimatedSprite(this.playerSheet.static);
			this.player.anchor.set(0.5);
			this.player.animationSpeed = this.animationSpeed;
			this.player.loop = true;
			this.player.x = this.app.view.width / 2;
			this.player.y = this.app.view.height - this.player.height / 2;
			this.app.stage.addChild(this.player);
		}
	}

	gameLoop() {
		if (this.player) {
			this.playerPosition = Math.floor(this.player.x);
		}
		if (this.playerSheet.right && this.keys === 'ArrowRight') {
			if (this.player) {
				if (!this.player.playing) {
					this.player.textures = this.playerSheet.right;
					this.player.play();
				}
				if (this.playerPosition < this.app.view.width - this.player.width / 2) {
					this.player.x += this.movementSpeed;
				}
			}
		} else if (this.playerSheet.right && this.keys === 'ArrowLeft') {
			if (this.player) {
				if (!this.player.playing) {
					this.player.textures = this.playerSheet.left;
					this.player.play();
				}
				if (this.playerPosition > 0 + this.player.width / 2) {
					this.player.x -= this.movementSpeed;
				}
			}
		} else {
			if (this.playerSheet.static && this.player) {
				this.player.textures = this.playerSheet.static;
			}
		}
	}

	handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			this.keys = e.key;
		}
	}

	handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			this.keys = null;
		}
	}
}

const app = new PIXI.Application({
	width: 800,
	height: 600,
	backgroundColor: 0xaaaaaa,
});
window.onload = function () {
	const game = new Game(app);
	game.startGame();
};
