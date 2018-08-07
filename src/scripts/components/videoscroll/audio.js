import {create, select} from '../../utils/trix-utils';

export default class Audio {
    constructor() {

        this.oContainer = select('#outerContainer');
        this.audio = create('audio', this.oContainer, 'bg-audio')


    }


    initAudio() {

        this.audio.src = 'assets/california_uber_alles.mp3';
        this.audio.autoplay = true;
        
        // For debugging peace of mind:
        this.audio.muted = true;

        this.audio.load();

        this.audio.addEventListener("canplay", (e) => {
            console.log('oncanplay!');
            this.audio.play();
            const controls = create('a', this.oContainer, 'audio-controls')
            controls.innerHTML = '';
            controls.setAttribute('id', 'toggle-audio');
            controls.setAttribute('href', '');
            controls.addEventListener("click", (e) => { this.toggleAudio(e) });
            this.controls = controls;
            this.setAudioStatus();
        }, true);

    }

    setAudioStatus() {
        if (this.audio.paused) {
            this.controls.innerHTML = '+';
        } else {
            this.controls.innerHTML = '-';
        }
    }

    toggleAudio(e) {
        e.preventDefault();
        console.log('toggle audio');
        if (this.audio.paused) {
            this.audio.play()
        } else {
            this.audio.pause()
        }
        this.setAudioStatus();
    }



}