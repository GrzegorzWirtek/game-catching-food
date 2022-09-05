import * as PIXI from 'pixi.js';

export class Fruit {
	#numberOfFruits: number;
	#fruitSpeed: number;

	app: PIXI.Application;
	fruit: PIXI.Sprite | null;
	fruitPositionX: number;
	fruitPositionY: number;
	fruitNewPositionX: number;

	constructor(app: PIXI.Application, fruitNewPositionX: number) {
		this.#numberOfFruits = 20;
		this.#fruitSpeed = 2;

		this.app = app;
		this.fruit = null;
		this.fruitPositionX = 0;
		this.fruitPositionY = 0;
		//the x position is taken from the argument when called in the "Game" class
		this.fruitNewPositionX = fruitNewPositionX;
	}

	startFruits() {
		this.fruit = PIXI.Sprite.from(
			`./images/fruit${Math.floor(Math.random() * this.#numberOfFruits)}.png`,
		);

		this.fruit.x = this.fruitNewPositionX;
		this.fruit.y = this.app.view.height / this.app.view.height;

		this.app.stage.addChild(this.fruit);
		//setting an index lower than texts "scores" and "lives"
		this.app.stage.setChildIndex(this.fruit, 1);
		//the ticker  runs an update loop
		this.app.ticker.add(() => this.fruitMove());
	}

	fruitMove() {
		if (this.fruit) {
			this.fruitPositionX = this.fruit.x;
			this.fruitPositionY = this.fruit.y;
			this.fruit.y += this.#fruitSpeed;
		}
	}

	removeFruit() {
		if (this.fruit) {
			this.app.stage.removeChild(this.fruit);
		}
	}
}
