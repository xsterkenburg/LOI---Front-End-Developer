/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import  { shuffle } from "./shuffle.js";
import { Cardset } from "./cardSet.js";

new Vue({
	el: "#app",
	data: {
		timer_txt : "",
		deck: [],
		boardClass : "",
		step : 0,
		numberOfSets : 0,
		card1 : "",
		card2 : "",
		score : 0,
		tries : 0,
		timer : "",
		minutes : 0,
		seconds : 0,
		hours : 0,
		time: "",
		clickEnabled : false,
		cardSet : [],
		active : false
	},
	created () {
		fetch("cards.json")
			.then(response => response.json())
			.then(json => {
				this.deck = shuffle(json.deck);
			});
	},
  
	computed: {
	},
	methods: {
		onSelectFieldSize: function (evt) {
			console.log("Select!");
			clearInterval(this.timer);
			this.timer = setInterval(() => this.myTimer(), 1000);
			this.score = 0;
			this.tries = 0;
			this.step = 0;
			this.minutes = 0;
			this.seconds = 0;
			this.hours = 0;
			this.active = true;
			this.populateField(evt.target.value);
		},
        
		populateField: function (fieldSize) {
			console.log(Cardset(fieldSize));
			this.cardSet = Cardset(fieldSize);
        
			this.setBoardClass(fieldSize);
			this.clickEnabled = true;
        
			
		},
        
		onClickCard: function (e) {
			navigator.vibrate(100);
			if (this.clickEnabled && e.target.parentElement.id !== "field") {
				this.playSound(e.target.parentElement.getAttribute("name"));
				if (this.step === 0) {
					this.card1 = e.target;
					e.target.setAttribute("class", "uncovered");
					this.step++;
				}
				else if (this.step === 1) {
					this.clickEnabled = false;
					this.card2 = e.target;
					let doeiets = e.target.getAttribute("class");
					if (doeiets === "covered") {
        
						e.target.setAttribute("class", "uncovered");
						this.evaluateMatch();
					}
        
				}
			}
		},
        
		setBoardClass: function (fieldSize) {
			switch (fieldSize) {
			case "4":
				this.boardClass = "board4";
				break;
			case "5":
				this.boardClass = "board5";
				break;
			case "6":
				this.boardClass = "board6";
				break;
			}
		},
        
		myTimer: function () {
			this.seconds++;
			if (this.seconds === 60) {
				this.seconds = 0;
				this.minutes++;
			}
			if (this.minutes === 60) {
				this.minutes = 0;
				this.hours++;
			}
			if (this.seconds < 10 && this.minutes < 10) {
				this.timer_txt = this.hours + " : 0" + this.minutes + " : 0" + this.seconds;
			}
			else if (this.seconds < 10) {
				this.timer_txt = this.hours + " : " + this.minutes + " : 0" + this.seconds;
			}
			else if (this.minutes < 10) {
				this.timer_txt = this.hours + " : 0" + this.minutes + " : " + this.seconds;
			}
			else {
				this.timer_txt = this.hours + " : " + this.minutes + " : " + this.seconds;
			}
        
		},
        
		keepScore: function () {
			this.score++;
			this.tries++;
			this.card1.parentElement.style.visibility = "hidden";
			this.card2.parentElement.style.visibility = "hidden";
			this.timer = setInterval(this.myTimer(), 1000);
        
			if (this.score === this.cardSet.length / 2) {
				clearInterval(this.timer);
				this.active = false;
			}
			else {
				this.clickEnabled = true;
			}
		},
        
		evaluateMatch: function () {
			clearInterval(this.timer);
			this.clickEnabled = false;
			let nameCard1 = this.card1.parentElement.getAttribute("name");
			let nameCard2 = this.card2.parentElement.getAttribute("name");
			this.step = 0;
			if (nameCard1 === nameCard2) {
				setTimeout( ()=> this.keepScore(), 1000);
				navigator.vibrate(500);
			}
			else {
				setTimeout( () =>this.nextMove(), 1000);
			}
        
		},
        
		nextMove: function () {
			this.card1.setAttribute("class", "covered");
			this.card2.setAttribute("class", "covered");
			this.clickEnabled = true;
			this.tries++;
			this.timer = setInterval(() => this.myTimer(), 1000);
		},
        
		playSound: function (animal) {
			let soundFile = String("snd/" + animal + ".wav");
			let mySound = new Audio(soundFile);
			mySound.play();
		}
		
	}
});
