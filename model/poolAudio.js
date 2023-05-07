export class AudioPool {
    constructor(audioFile, poolSize) {
      this.audioFile = audioFile;
      this.poolSize = poolSize;
      this.audioSources = [];
      this.currentIndex = 0;
  
      for (let i = 0; i < poolSize; i++) {
        let audio = new Audio(audioFile);
        this.audioSources.push(audio);
      }
    }
  
    play() {
      let audio = this.audioSources[this.currentIndex];
      audio.currentTime = 0;
      audio.play();
      this.currentIndex = (this.currentIndex + 1) % this.poolSize;
    }
  }
  