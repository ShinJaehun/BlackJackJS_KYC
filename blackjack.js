var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; // A, 2 -> 11 + 2 // A, 2 + K -> 1 + 2 + 10

var hidden;
var deck;

var canHit = true; // allows the player to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // A-C -> K-C, A-D -> K-D....
        }
    }
    console.log(deck);
}

function shuffleDeck(){
    // 이게 꽤 중요한 알고리즘!
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck)
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    console.log(hidden);
    // console.log(dealerSum);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    // console.log(dealerSum); // hidden이 있기 때문에 당연히...

    for(let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    // console.log(yourSum); // hidden이 있기 때문에 당연히...

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { // A, J, K -> 1 + 10 + 10, A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

    console.log(yourSum);
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    
    let message = "";

    // if (yourSum > 21) {
    //     message = "You Lose!";
    // } else if (dealerSum > 21) {
    //     message = "You Win!";
    // } else if (yourSum == dealerSum) {     // both you and dealer <= 21
    //     message = "Tie!";
    // } else if (yourSum > dealerSum) {
    //     message = "You Win!";
    // } else if (yourSum < dealerSum) {
    //     message = "You Lose!";
    // }

    // 이게 판정이 애매해서
    // 다른 블랙잭 예제를 찾아서 판정을 적용시켰음! 
    // https://github.com/jacquelynmarcella/blackjack/blob/master/js/game-win-logic.js

    if (dealerSum == 21) {
        if (yourSum == 21) {
            message = "Tie!";
        } else {
            message = "You Lose!";
        }
    } else if (dealerSum > 21) {
        if (yourSum <= 21) {
            message = "You Win!";
        } else {
            message = "Tie!";
        }
    } else if (dealerSum < 21) {
        if (yourSum == 21) {
            message = "You Win!";
        } else if (yourSum < 21 && yourSum > dealerSum) {
            message = "You Win!";
        } else {
            message = "You Lose!"
        }
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { // A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    // console.log(playerSum);

    return playerSum;
}