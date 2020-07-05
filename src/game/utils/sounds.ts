import { Game } from "core/game";
// @ts-ignore
import mainTheme1 from 'game/assets/sounds/main_theme_1.mp3';
// @ts-ignore
import mainTheme2 from 'game/assets/sounds/main_theme_2.mp3';
// @ts-ignore
import mainTheme3 from 'game/assets/sounds/main_theme_3.mp3';

let currentTrack = 0;

export const playBackgroundMusic = async (game: Game) => {
  const playlist = [
    mainTheme1,
    mainTheme2,
    mainTheme3
  ];

  const nextTrack = async () => {
    if (currentTrack !== playlist.length - 1) {
      currentTrack += 1;
    } else {
      currentTrack = 0;
    }
    
    setTimeout(nextTrack, await game.state.sound.play({
      url: playlist[currentTrack],
      volume: 0.1
    }))
  }

  setTimeout(nextTrack, await game.state.sound.play({
    url: playlist[currentTrack],
    volume: 0.1
  }))
}