import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  winner: any;

  constructor() { }
  currentPlayer: any;
  boxes = Array(9);
  gameOver = false;
  ngOnInit() {
    this.freshGame();
  }
  freshGame() {
    this.boxes.fill('');
    this.currentPlayer = 'x'
  }

  playerMove(i) {
    // console.log(i)
    if (this.currentPlayer == 'x' && this.boxes[i] == '') {
      this.boxes[i] = 'x';
      this.currentPlayer = 'o'
      let calcWin = this.isThereAwinner(this.boxes, 'x');
      console.log('is there a winner res: ', calcWin)
      if (calcWin == 0) {
        //
        this.computerMove(i)
      }
      else {
        this.gameResult(calcWin)
      }
    }
    else {

      // this.boxes[i] = 'o';
      // this.currentPlayer = 'x'
    }

  }
  isThereAwinner(array, i) {
    let playerName = i; // whos chance was it
    let currentGame = array // current game state
    var winner: any = 0; // 0 == playable, 1 == tie
    let pos = [ // positions to win 
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [6, 4, 2],
      [0, 4, 8]
    ]
    for (let i = 0; i < pos.length; i++) {
      // console.log(pos[i]);
      let [posA, posB, posC] = pos[i];
      // console.log(posA, posB, posC);
      if (currentGame[posA] == playerName && currentGame[posB] == playerName && currentGame[posC] == playerName) {
        winner = playerName;
        break;
      }


    }
    // console.log(winner);
    if (winner == 0 && currentGame.indexOf('') == -1) { // 
      console.log('no empty space remaining')
      winner = 1
    }
    return winner;
  }
  gameResult(winner) {
    console.log('final winner', winner)
    this.winner = winner == 1 ? 'x/o' : winner
    this.gameOver = true;
  }
  playAgain() {
    this.gameOver = false;
    this.winner = ''
    this.freshGame();
  }
  computerMove(i) {
    var chal = -1;
    var mostEffectivePlay = 0
    for (let i = 0; i <= this.boxes.length; i++) {
      if (i == this.boxes.length) {
        this.boxes[mostEffectivePlay] = 'o';

        this.currentPlayer = 'x';
        break;
      }
      if (this.boxes[i] == '') {
        mostEffectivePlay = i
        var currentGame = this.boxes.slice();
        currentGame[i] = 'o'; // let computer do this dummy turn and see if computer wins
        console.log("checking bot moves", i, currentGame);
        var canPlay = this.ifCompWinsInNextMove(currentGame, i)
        //  let canPlayer = this.ifPlayerWinsInNextMove(currentGame)
        console.log('computer canPlay this iteration ', canPlay)
        if (canPlay > 0) { // either computer can win or plyer can't win

          console.log('computer choosen move ', i)
          this.boxes[i] = 'o';
          this.currentPlayer = 'x';
          if (canPlay == 10) // then computer will win
            setTimeout(() => {
              this.gameResult('o');
            }, 200);
          break;
        }
        else if (canPlay < 0) { // if player can win make this move a mostEffectivePlay
          mostEffectivePlay = i
        }

      }
    }
  }
  ifCompWinsInNextMove(array, i) {
    let winnerRes = this.isThereAwinner(array, 'o');
    console.log('computer winner check ', winnerRes, i)
    if (winnerRes == 'o' || winnerRes == 1) {
      console.log('bot wins in this move', i)
      return 10 // this means bot wins
    }
    else if (winnerRes == 0) {
      var canPlayerWin = this.ifPlayerWinsInNextMove(array, i);
      console.log('player win result to computer', canPlayerWin, i)
      if (canPlayerWin.value) {
        return -10 // this means player wins
      }
      else
        return 11
    }
  }
  ifPlayerWinsInNextMove(array, i) {
    var playerCanWinMove = { value: false, position: i };
    for (let i = 0; i < array.length; i++) {
      if (array[i] == '') {
        var currentGame = array.slice();
        currentGame[i] = 'x'; // just like computer let us play players next move
        var canWin = this.checkPlayerWinInAMove(currentGame)
        console.log('player wins with this ' + i + ' move result', canWin)
        //  console.log('checkn player wins with this move',i,canWin)
        if (canWin) {
          playerCanWinMove.value = true;
          break;
        }

      }
    }
    return playerCanWinMove
  }
  checkPlayerWinInAMove(array) {
    let winnerRes = this.isThereAwinner(array, 'x');
    if (winnerRes == 'x' || winnerRes == 1) {
      return true
    }
    else {
      return false;
    }
  }
}
