export class Popup {
	gameDiv: HTMLDivElement;
	button: HTMLButtonElement;
	title: HTMLElement;
	scores: HTMLElement;
	scoresSpan: HTMLElement;

	constructor() {
		this.gameDiv = document.querySelector('.game') as HTMLDivElement;
		this.button = document.querySelector('.button') as HTMLButtonElement;
		this.title = document.querySelector('.title') as HTMLElement;
		this.scores = document.querySelector('.scores') as HTMLElement;
		this.scoresSpan = document.querySelector('.scores__span') as HTMLElement;
	}

	initPopup() {
		this.title.textContent = "LET'S PLAY A GAME";
	}

	handlePopup(startGame: () => void) {
		this.button.addEventListener('click', () => {
			this.hidePopup();
			startGame();
		});
	}

	showPopup(points: number) {
		this.gameDiv.classList.add('game--visible');
		this.gameDiv.classList.remove('game--hidden');
		this.scores.classList.remove('scores--hidden');
		this.title.textContent = 'GAME OVER';
		this.scoresSpan.textContent = String(points);
		this.button.textContent = 'START NEW GAME';
	}

	hidePopup() {
		this.gameDiv.classList.remove('game--visible');
		this.gameDiv.classList.add('game--hidden');
	}
}
