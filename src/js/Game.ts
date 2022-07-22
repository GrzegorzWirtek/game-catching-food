import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { Fruit } from './Fruit';
import { Text } from './Text';
import { Popup } from './Popup';

class Game {
	#points: number;
	#lives: number;
	#minFruitDelay: number;
	#fruitDelayVariable: number;

	app: PIXI.Application;
	popup: Popup;
	player: Player;
	#fruitsArr: Fruit[];
	#text: Text;

	#newFruitSetTimeout: NodeJS.Timeout | null;
	checkPositionInterval: NodeJS.Timeout | null;

	constructor(app: PIXI.Application) {
		this.#points = 0;
		this.#lives = 10;
		//minimal delay to allow the board to move from left to right
		this.#minFruitDelay = 2900;
		//variable to randomize the delay of generating a new fruit, from min to max
		this.#fruitDelayVariable = 1600;

		this.app = app;
		this.popup = new Popup();
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

		this.popup.initPopup();
		this.popup.handlePopup(this.startGame.bind(this));

		this.player.startPlayer();
		this.#text.generateText();
	}

	startGame() {
		this.checkPosition();
		this.generateFuit(200, 1000);
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
		this.generateFruitDelay(prevXPosition);
	}

	//generate random delay, based on the drawn position x new fruit
	generateFruitDelay(prevXPosition: number) {
		//draw item x of the next fruit
		const newXPosition =
			Math.floor(Math.random() * (this.app.view.width - 70) + 70) - 40;
		//determining the distance x of the new fruit from the previous one
		const gap = Math.abs(prevXPosition - newXPosition);
		//creation of a parameter for delay
		const param = ((100 / this.app.view.width) * gap) / 100;
		//minimal delay, allowing the player to get from the previous position to the position of the new fruit
		const minDelay = this.#minFruitDelay * param;
		//maximum delay (decreases by 10 with each function call)
		const maxDelay = minDelay + this.#fruitDelayVariable;
		//delay draw in the min-max range
		const delay = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);

		//passing the position of the new fruit and delay to the function that creates the new fruit
		this.generateFuit(newXPosition, delay);

		//reducing the variable affecting maxDelay
		if (this.#fruitDelayVariable > 0) {
			this.#fruitDelayVariable -= 10;
		}
	}

	//checking the position of the fruit and the player
	checkPosition() {
		this.checkPositionInterval = setInterval(() => {
			if (this.#fruitsArr.length) {
				this.#fruitsArr.forEach((fruitItem, index) => {
					//if the fruit misses the player, subtract a life
					if (fruitItem.fruitPositionY > this.app.view.height - 10) {
						this.deleteFruit(fruitItem, index);
						this.removeLive();
						//if the fruit is caught, add a point
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

	//shecking if there are any lives left, called each time a life is subtracted
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

		this.popup.showPopup(this.#points);

		this.#points = 0;
		this.#lives = 10;
		this.#minFruitDelay = 2900;
		this.#fruitDelayVariable = 1600;

		this.#text.uploadText('point', this.#points);
		this.#text.uploadText('lives', this.#lives);
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
