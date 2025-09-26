class MemoryGame {
    cards;
    flippedCards;
    score;
    bestScore;
    gameBoard;
    timer;
    timerInterval;
    cardCount;
    constructor(gameBoardId) {
        this.cards = [];
        this.flippedCards = [];
        this.score = 0;
        this.timer = 120;
        this.timerInterval = null;
        this.cardCount = 8;
        this.bestScore = localStorage.getItem('bestScore')
            ? parseInt(localStorage.getItem('bestScore'))
            : 0;
        this.gameBoard = document.getElementById(gameBoardId);
        this.initializeGame();
    }
    initializeGame() {
        document
            .getElementById('easy-btn')
            .addEventListener('click', () => this.changeLevel('easy'));
        document
            .getElementById('medium-btn')
            .addEventListener('click', () => this.changeLevel('medium'));
        document
            .getElementById('hard-btn')
            .addEventListener('click', () => this.changeLevel('hard'));
        this.updateGameBoardLayout(this.cardCount);
        this.cards = this.createCards();
        this.renderBoardGame();
        this.resetTimer();
        this.startTimer();
    }
    createCards() {
        const values = [
            '🙂',
            '😀',
            '🙃',
            '😎',
            '😇',
            '😍',
            '😋',
            '🤩',
            '🥳',
            '😜',
            '🤔',
            '😅',
            '🤭',
            '😏',
            '🤫',
            '😜',
            '😐',
            '🥺',
            '🤠',
            '😺',
        ];
        const pairs = this.cardCount / 2;
        const selectedValues = values.slice(0, pairs);
        let cards = [];
        selectedValues.forEach((value, index) => {
            cards.push({ id: index * 2, value, isFlipped: false, matched: false });
            cards.push({
                id: index * 2 + 1,
                value,
                isFlipped: false,
                matched: false,
            });
        });
        return this.shuffle(cards);
    }
    shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
    renderBoardGame() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset['id'] = card.id.toString();
            cardElement.addEventListener('click', () => this.flipCard(card));
            const backElement = document.createElement('div');
            backElement.classList.add('card-back');
            backElement.classList.toggle('flipped', card.isFlipped || card.matched);
            backElement.textContent = '?';
            const frontElement = document.createElement('div');
            frontElement.classList.add('card-front');
            frontElement.classList.toggle('flipped', card.isFlipped || card.matched);
            frontElement.textContent = card.value;
            cardElement.append(backElement, frontElement);
            this.gameBoard.appendChild(cardElement);
        });
        this.updateScore();
    }
    flipCard(card) {
        if (this.flippedCards.length === 2 || card.isFlipped || card.matched) {
            return;
        }
        card.isFlipped = true;
        this.renderBoardGame();
        this.flippedCards.push(card);
        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }
    changeLevel(level) {
        switch (level) {
            case 'easy':
                this.cardCount = 8;
                this.updateGameBoardLayout(this.cardCount);
                break;
            case 'medium':
                this.cardCount = 18;
                this.updateGameBoardLayout(this.cardCount);
                break;
            case 'hard':
                this.cardCount = 32;
                this.updateGameBoardLayout(this.cardCount);
                break;
        }
        this.resetGame();
    }
    async checkForMatch() {
        const [card1, card2] = this.flippedCards;
        if (card1.value === card2.value) {
            card1.matched = true;
            card2.matched = true;
            this.score++;
            this.checkWin();
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            card1.isFlipped = false;
            card2.isFlipped = false;
            this.renderBoardGame();
        }
        this.flippedCards = [];
        this.updateScore();
    }
    updateScore() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('best-score').textContent = `Best Score: ${this.bestScore}`;
    }
    startTimer() {
        this.timerInterval = window.setInterval(() => {
            this.timer--;
            this.updateTimer();
            this.checkTimer();
        }, 1000);
    }
    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timer = 120;
        this.updateTimer();
    }
    updateTimer() {
        const timerEl = document.getElementById('timer');
        if (timerEl)
            timerEl.textContent = `Time: ${this.timer}s`;
    }
    checkTimer() {
        if (this.timer <= 0) {
            if (this.timerInterval)
                clearInterval(this.timerInterval);
            setTimeout(() => {
                alert(`Time's up! Your score: ${this.score}`);
            }, 500);
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScore', this.bestScore.toString());
            }
            this.resetGame();
        }
    }
    updateGameBoardLayout(cardCount) {
        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
            gameBoard.classList.remove('grid-8', 'grid-18', 'grid-32');
            if (cardCount === 8) {
                gameBoard.classList.add('grid-8');
            }
            else if (cardCount === 18) {
                gameBoard.classList.add('grid-18');
            }
            else if (cardCount === 32) {
                gameBoard.classList.add('grid-32');
            }
        }
    }
    checkWin() {
        if (this.cards.every((card) => card.matched)) {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScore', this.bestScore.toString());
            }
            if (this.timerInterval)
                clearInterval(this.timerInterval);
            setTimeout(() => {
                alert(`You win! Your score: ${this.score} | Time: ${this.timer}s`);
                this.resetGame();
            }, 500);
        }
    }
    resetGame() {
        this.score = 0;
        this.flippedCards = [];
        this.initializeGame();
    }
}
window.onload = () => {
    new MemoryGame('game-board');
};
export {};
