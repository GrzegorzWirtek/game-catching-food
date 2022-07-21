import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { Fruit } from './Fruit';
import { Text } from './Text';

class Game {
	#points: number;
	#lives: number;
	#minFruitDelay: number;
	#maxFruitDelay: number;

	app: PIXI.Application;
	player: Player;
	#fruitsArr: Fruit[];
	#text: Text;

	#newFruitSetTimeout: NodeJS.Timeout | null;
	checkPositionInterval: NodeJS.Timeout | null;

	constructor(app: PIXI.Application) {
		this.#points = 0;
		this.#lives = 10;
		this.#minFruitDelay = 2900;
		this.#maxFruitDelay = 4000;

		this.app = app;
		this.player = new Player(this.app);
		this.#text = new Text(this.app, this.#points, this.#lives);
		this.#fruitsArr = [];

		this.#newFruitSetTimeout = null;
		this.checkPositionInterval = null;
	}

	initGame() {
		document.body.appendChild(this.app.view);
		this.app.renderer.view.style.position = 'absolute';
		this.app.renderer.view.style.left = '50%';
		this.app.renderer.view.style.top = '50%';
		this.app.renderer.view.style.transform = 'translate(-50%, -50%)';

		this.player.startPlayer();
		this.#text.generateText();

		this.startGame();
	}

	startGame() {
		this.checkPosition();
		this.generateFuit(200, 500);
	}

	generateFuit(prevXPosition: number, delay: number) {
		this.#newFruitSetTimeout = setTimeout(() => {
			this.createFruit(prevXPosition);
		}, delay);
	}

	createFruit(prevXPosition: number) {
		const fruit = new Fruit(this.app, prevXPosition);
		fruit.startFruits();
		this.#fruitsArr.push(fruit);
		this.generateNewFruitDelay(prevXPosition);
	}

	generateNewFruitDelay(prevXPosition: number) {
		const newXPosition =
			Math.floor(Math.random() * (this.app.view.width - 70) + 70) - 40;
		const gap = Math.abs(prevXPosition - newXPosition);
		const param = ((100 / this.app.view.width) * gap) / 100;
		const minDelay = this.#minFruitDelay * param;
		const delay = Math.floor(
			Math.random() * (this.#maxFruitDelay - minDelay) + minDelay,
		);

		this.generateFuit(newXPosition, delay);
	}

	checkPosition() {
		this.checkPositionInterval = setInterval(() => {
			console.log('check point inter');
			if (this.#fruitsArr.length) {
				this.#fruitsArr.forEach((fruitItem, index) => {
					if (fruitItem.fruitPositionY > this.app.view.height - 10) {
						this.deleteFruit(fruitItem, index);
						this.removeLive();
					} else if (
						fruitItem.fruitPositionY >=
							this.app.view.height - this.player.playerCellSize &&
						fruitItem.fruitPositionX + 20 >= this.player.playerPosition &&
						fruitItem.fruitPositionX <= this.player.playerPosition + 20
					) {
						this.deleteFruit(fruitItem, index);
						this.addPoint();
					}
				});
			}
		}, 5);
	}

	deleteFruit(fruitItem: Fruit, index: number) {
		fruitItem.removeFruit();
		delete this.#fruitsArr[index];
		this.#fruitsArr.splice(index, 1);
	}

	addPoint() {
		this.#points++;
		this.#text.uploadText('point', this.#points);
	}

	removeLive() {
		this.#lives--;
		this.checkIsGameOver();
		this.#text.uploadText('live', this.#lives);
	}

	checkIsGameOver() {
		if (this.#lives < 1) {
			this.stopGame();
		}
	}

	stopGame() {
		this.#fruitsArr.forEach((fruitItem, index) =>
			this.deleteFruit(fruitItem, index),
		);
		if (this.checkPositionInterval) {
			clearInterval(this.checkPositionInterval);
		}
		if (this.#newFruitSetTimeout) {
			clearTimeout(this.#newFruitSetTimeout);
		}
		this.#fruitsArr.forEach((fruitItem, index) =>
			this.deleteFruit(fruitItem, index),
		);
		this.#fruitsArr = [];
	}
}

const app = new PIXI.Application({
	width: 400,
	height: 600,
	backgroundColor: 0xaaaaaa,
});

window.onload = function () {
	const game = new Game(app);
	game.initGame();
};
