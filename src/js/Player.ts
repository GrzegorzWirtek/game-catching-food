import * as PIXI from 'pixi.js';

export class Player {
	app: PIXI.Application;
	playerPosition: number;
	playerCellSize: number;
	#animationSpeed: number;
	#movementSpeed: number;
	right: PIXI.Texture[] | null;
	left: PIXI.Texture[] | null;
	#player: PIXI.extras.AnimatedSprite | null;
	#keys: null | 'ArrowLeft' | 'ArrowRight';

	#playerSheet:
		| { right: PIXI.Texture[]; left: PIXI.Texture[]; static: PIXI.Texture[] }
		| { right: null; left: null; static: null };

	constructor(app: PIXI.Application) {
		this.app = app;
		this.playerPosition = 0;
		this.playerCellSize = 84;
		this.#animationSpeed = 0.25;
		this.#movementSpeed = 2.5;
		this.app = app;
		this.right = null;
		this.left = null;
		this.#playerSheet = { right: null, left: null, static: null };
		this.#player = null;
		this.#keys = null;
	}

	startPlayer() {
		this.app.loader.add('player', '../images/player.png');
		this.app.loader.load(() => this.onLoadingDone());

		window.addEventListener('keydown', (e) => this.handleKeyDown(e));
		window.addEventListener('keyup', (e) => this.handleKeyUp(e));
	}

	onLoadingDone() {
		this.createPlayerSheet();
		this.createPlayer();

		//the ticker  runs an update loop
		this.app.ticker.add(() => this.gameLoop());
	}

	createPlayerSheet() {
		let sheet = PIXI.BaseTexture.from(this.app.loader.resources['player'].url);
		let w = this.playerCellSize;
		let h = this.playerCellSize;

		//movement to the left with sprite
		this.#playerSheet.left = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 2 * h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 2 * h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 2 * h, w, h)),
		];

		//movement to the right with sprite
		this.#playerSheet.right = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(7 * w, h, w, h)),
			new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 2 * h, w, h)),
		];

		//static player position
		this.#playerSheet.static = [
			new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h)),
		];
	}

	createPlayer() {
		if (this.#playerSheet.static) {
			this.#player = new PIXI.extras.AnimatedSprite(this.#playerSheet.static);
			this.#player.anchor.set(0.5);
			this.#player.animationSpeed = this.#animationSpeed;
			this.#player.loop = true;
			this.#player.x = this.app.view.width / 2;
			this.#player.y = this.app.view.height - this.#player.height / 2;
			this.app.stage.addChild(this.#player);
		}
	}

	gameLoop() {
		if (this.#player) {
			this.playerPosition = Math.floor(this.#player.x);
		}
		//handling the "arrow left" event - motion animation
		if (this.#playerSheet.right && this.#keys === 'ArrowRight') {
			if (this.#player) {
				if (!this.#player.playing) {
					this.#player.textures = this.#playerSheet.right;
					this.#player.play();
				}
				//movement only within the range of the board
				if (
					this.playerPosition <
					this.app.view.width - this.#player.width / 2
				) {
					this.#player.x += this.#movementSpeed;
				}
			}
			//handling the "arrow left" event
		} else if (this.#playerSheet.left && this.#keys === 'ArrowLeft') {
			if (this.#player) {
				if (!this.#player.playing) {
					this.#player.textures = this.#playerSheet.left;
					this.#player.play();
				}
				//movement only within the range of the board
				if (this.playerPosition > 0 + this.#player.width / 2) {
					this.#player.x -= this.#movementSpeed;
				}
			}
			//player behavior in the absence of movement
		} else {
			if (this.#playerSheet.static && this.#player) {
				this.#player.textures = this.#playerSheet.static;
			}
		}
	}

	handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			this.#keys = e.key;
		}
	}

	handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			this.#keys = null;
		}
	}
}
