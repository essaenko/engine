export class Sound {
  public play = async ({ url, speed = 1, loop = false, volume = 1 }: { url: string, speed?: number, loop?: boolean, volume?: number }): Promise<number> => {
    const player = document.createElement('audio');
    player.src = url;
    player.loop = loop;
    player.play();
    player.playbackRate = speed;
    player.volume = volume;
    
    return new Promise((resolve) => {
      player.addEventListener('loadedmetadata', () => {
        resolve(player.duration * 1000 / speed);
      })
    })
  }
}