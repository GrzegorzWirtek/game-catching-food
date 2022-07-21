import * as PIXI from 'pixi.js';

export class Text {
	app: PIXI.Application;
	pointText: PIXI.Text | null;
	livesText: PIXI.Text | null;
	points: number;
	lives: number;

	constructor(app: PIXI.Application, points: number, lives: number) {
		this.app = app;
		this.pointText = null;
		this.livesText = null;
		this.points = points;
		this.lives = lives;
	}

	generateText() {
		const textStyle = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 30,
		});
		this.pointText = new PIXI.Text(`Points: ${this.points}`, textStyle);
		this.pointText.x = 20;
		this.pointText.y = 20;
		this.livesText = new PIXI.Text(`Lives: ${this.lives}`, textStyle);
		this.livesText.x = this.app.screen.width - 20 - this.livesText.width;
		this.livesText.y = 20;
		this.app.stage.addChild(this.pointText);
		this.app.stage.addChild(this.livesText);
	}

	uploadText(witchValue: string, value: number) {
		if (this.pointText && witchValue === 'point') {
			this.pointText.text = `Points: ${value}`;
		}
		if (this.livesText && witchValue === 'live') {
			this.livesText.text = `Lives: ${value}`;
		}
	}
}
