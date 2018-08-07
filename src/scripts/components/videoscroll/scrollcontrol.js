import {create, select, normalize, clamp, easeOutIn} from '../../utils/trix-utils';
import ScrollDevices from './scrolldevices';

import ScrollMagic from 'scrollmagic';
import { setTimeout, clearTimeout } from 'timers';

export default class ScrollControl{
	constructor(){
	}
	setupScroll(video, scenes){
		this.video = video;
		this.scenes = scenes;
		this.videoBreakpoint = 500,

		this.savedWidth = window.innerWidth;



		let oContainer = select('#outerContainer');
		const sContainer = select('#videoScrollContainer');

		const controller = new ScrollMagic.Controller({
			container: oContainer,
			refreshInterval: 0
		});

		let scrollrate = ScrollDevices.scrollrate();
		this.scrollduration = this.video.setup.videoDuration * scrollrate;

		for (let i = 0, l = scenes.length; i < l; i++) {

			let element = scenes[i];
			element.style.display = 'block';
			let sceneTime = parseFloat(element.dataset.time) * scrollrate
			let sceneDuration = parseFloat(element.dataset.duration) * scrollrate;
			let sceneStart = sceneTime - ( sceneDuration / 2 );
			// console.log(sceneTime, sceneDuration, sceneStart);
			//let sceneEnd = sceneTime + ( sceneDuration / 2 );

			let sc = new ScrollMagic.Scene({
				duration: sceneDuration,
				offset: sceneStart,

			})
			.on('progress', (e) => {
				animateText(e, element);

			})
			.addTo(controller);
		}

		let animateText = (e, el)=>{
			let maxMove = 30;
			let fadeInStop = 0.2;
			let fadeOutStart = 0.8;
			let opacity = 1;

			if(this.video.setup.videoSize == 'small') maxMove = 40;
			if(el.classList.contains('header-scene')){
				maxMove = 18;
				fadeInStop = 0;
			};

			let position = easeOutIn(e.progress, 0, maxMove, 1);

			if(e.progress<fadeInStop) opacity = normalize(e.progress, 0, fadeInStop);
			if(e.progress>fadeOutStart) opacity = normalize(e.progress, 1, fadeOutStart);
			
			el.style.transform = 'translateY('+-position+'vw)';
			el.style.opacity = opacity.toFixed(3);

		}

		let scrollTimeout = null;
		let counter = new ScrollMagic.Scene({
			duration: this.scrollduration
		}).addTo(controller);
		
		counter.on('update', (ev) => {
			this.setTime(ev.scrollPos);
			if(scrollTimeout !== null) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(()=>{
				// console.log('scrolling stopped');
				this.video.showHighRes();
				// controller.scrollTo(ev.scrollPos + 100);
			}, 150)

		});

		let indicator = create('div', sContainer);
		indicator.style.position = 'absolute';
		indicator.style.height = (window.innerHeight * 0.5) + 'px';
		indicator.style.width = '10px';
		indicator.style.right = '0%';
		indicator.style.top = this.scrollduration + (window.innerHeight * 0.5) + 'px';

	}
	setTime(pos) {
		if (isNaN(pos)) pos = 0;
		let norm = normalize(pos, 0, this.scrollduration);
		let scrollTime = (this.video.setup.frameCount * norm);
		this.video.setVideoTime(scrollTime);
	}

}