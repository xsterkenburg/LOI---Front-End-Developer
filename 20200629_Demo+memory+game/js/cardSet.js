import { shuffle } from "./shuffle.js";
import { Card } from "./Card.js";

let myDeck;
const allSets = [];

export function Cardset(fieldsize) {
	returnShuffledDeck(fieldsize);
	return generateCards(fieldsize);
}

fetch("cards.json")
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
		data.deck.forEach(element => {
			allSets.push(element);
		});
	});



function generateCards() {
	let gameFieldArray = [];

	myDeck.forEach(element => {
		let newCard1 = new Card();
		newCard1.name = element.card1;
		newCard1.set = element.set;

		let newCard2 = new Card();
		newCard2.name = element.card2;
		newCard2.set = element.set;

		gameFieldArray.push(newCard1);
		gameFieldArray.push(newCard2);
	});
	gameFieldArray = shuffle(gameFieldArray);
	return gameFieldArray;
}

function returnShuffledDeck(fieldsize) {
	myDeck = shuffle(allSets);
	let numberOfSets = Math.floor(Math.pow(fieldsize, 2) / 2);
	myDeck = allSets.slice(0, numberOfSets);
	generateCards();
}

