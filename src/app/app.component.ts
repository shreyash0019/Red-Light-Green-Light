import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentLight: 'red' | 'green' = 'green';
  gameActive = false;
  playerStopped = false;
  gameOver = false;
  winner = false;
  consecutiveStops = 0;
  message = 'Press Start to Play Game !';
  lightInterval: any;

  @ViewChild('gameMusic') gameMusic!: ElementRef<HTMLAudioElement>;

  startGame() {
    this.resetGame(); // Reset state for a new game
    this.gameActive = true;
    this.message = 'Game started! Stop before red light!';
    this.playMusic(); // Start music when the game begins
    this.changeLightAutomatically();
  }

  changeLightAutomatically() {
    clearInterval(this.lightInterval);
    this.lightInterval = setInterval(() => {
      if (this.currentLight === 'green') {
        this.currentLight = 'red';
        this.handleRedLightChange();
      } else {
        this.currentLight = 'green';
        this.handleGreenLightChange();
      }
    }, Math.random() * 3000 + 2000); // Change every 2-5 seconds
  }

  handleGreenLightChange() {
    this.currentLight = 'green';
    this.message = 'Green light ! Keep moving !';
    this.playerStopped = false; // Reset stop status for the next round
  }

  handleRedLightChange() {
    this.currentLight = 'red';
    this.stopMusic(); // Stop music when light turns red
    this.message = 'Red light ! Stop moving !';

    // If the player has not stopped before red light, they lose
    if (!this.playerStopped) {
      this.endGame(false);
    }
  }

  playerStop() {
    if (!this.gameActive || this.gameOver || this.winner) {
      return; // Ignore input if game is not active
    }

    if (this.currentLight === 'green') {
      this.message = 'Good... You stopped before red light !!';
      this.playerStopped = true;
      this.consecutiveStops++;

      // Win condition: Player stopped 3 times in a row before red
      if (this.consecutiveStops >= 5) {
        this.endGame(true);
      }
    } else if (this.currentLight === 'red') {
      // If the light is red and player stops, it's invalid
      this.message = 'Red light! Too late to stop!';
      this.endGame(false);
    }
  }

  endGame(win: boolean) {
    clearInterval(this.lightInterval);
    this.gameActive = false;
    this.stopMusic(); // Stop music on game over

    if (win) {
      this.message = 'Congratulations, you won!';
      this.winner = true;
    } else {
      this.message = 'You got caught! Game over!';
      this.gameOver = true;
    }
  }

  resetGame() {
    this.gameActive = false;
    this.gameOver = false;
    this.winner = false;
    this.message = 'Press Start to begin!';
    this.currentLight = 'green';
    this.consecutiveStops = 0;

    this.stopMusic(); // Stop music on reset
  }

  playMusic() {
    const music = this.gameMusic.nativeElement;
    music
      .play()
      .then(() => console.log('Music playing...'))
      .catch((error) => console.error('Error playing music:', error));
  }

  stopMusic() {
    const music = this.gameMusic.nativeElement;
    music.pause();
    music.currentTime = 0; // Reset music playback
  }
}
