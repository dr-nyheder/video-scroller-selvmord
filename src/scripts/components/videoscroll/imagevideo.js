import {create, select, normalize, clamp, linearInterpolate} from '../../utils/trix-utils';

export default class ImageVideo {
    constructor(videoSetup) {
        this.setup = videoSetup;
        let imageContainer = select('#image-container');

        this.loader = create('div', imageContainer, 'loader');
        this.progress = create('div', this.loader, 'progress');

        this.imageEl = create('img', imageContainer, 'img-tag');

        if(DEBUGGING){
            this.debugCounter = create('div', select('#outerContainer'), 'debug-counter');
        }

        this.events = create('div');

        this.images = [];

        this.loadedImages = 0;

        this.preloadThreshHold = 300;

        this.currentFrame = -1;

        for (let i = 0; i < this.setup.frameCount; ++i) {
            let im = {
                id: i,
                tag: create('img'),
                highres:'',
                load: function (s) {
                    this.tag.src = s;
                }
            };
            im.tag.refId = i;
            im.tag.addEventListener('load', this.onImageLoad.bind(this));
            this.images[i] = im;
        }

    }

    setVideoTime(time) {
        //sconsole.log('set video time', time);

        let norm = normalize(time, 0, this.setup.frameCount);
        if(DEBUGGING){
            let debugTime = linearInterpolate(norm, 0, this.setup.videoDuration);
            let pre = '';
            if(debugTime < 10) pre = '0';
            this.debugCounter.innerHTML = pre + debugTime.toFixed(2);
        }
        let newFrame = Math.round(linearInterpolate(norm, 0, this.setup.frameCount));
        if(newFrame !== this.currentFrame){
            this.currentFrame = newFrame;
            this.drawImage();
        }
    }

    drawImage() {
        //console.log('draw image');

        this.imageEl.src = this.images[clamp(this.currentFrame, 0, this.setup.frameCount - 1)].tag.src;
    }
    showHighRes(){
        this.imageEl.src = this.images[clamp(this.currentFrame, 0, this.setup.frameCount - 1)].highres;
    }
    loadImages(callback = ()=>{console.log('empty callback')}) {

        this.loadCallback = callback;
        // console.log('load images', size);
        if(this.currentFrame > -1) this.preloadThreshHold = clamp(this.currentFrame + 50, 0, this.setup.frameCount);
        //this.setCanvasSize(size);
        this.showPreloadMessage(0);

        this.loadedImages = 0;
        let file = (this.setup.videoSize === 'small') ? {
            path:this.setup.pathNames.mobilePathLowres, 
            name:this.setup.pathNames.mobileFileNameLowres,
            highresPath:this.setup.pathNames.mobilePath, 
            highresName:this.setup.pathNames.mobileFileName
        }: {
            path:this.setup.pathNames.desktopPathLowres, 
            name:this.setup.pathNames.desktopFileNameLowres,
            highresPath:this.setup.pathNames.desktopPath, 
            highresName:this.setup.pathNames.desktopFileName
        };
        // console.log('load images', size, file.path);
        for (let i = 0; i < this.setup.frameCount; ++i) {
            let pre = file.name;
            let highPre = file.highresName;
            let post = i.toString();
            let name = pre.substr(0, pre.length - post.length) + post + '.jpg';

            let highresName = highPre.substr(0, highPre.length - post.length) + post + '.jpg';
            // this.images[i].load('//www.dr.dk/tjenester/visuel/staging/drn-primeminister-scroller/' + file.path+name);
            this.images[i].highres = SCROLL_IMAGE_PATH + file.highresPath + highresName;
            this.images[i].load(SCROLL_IMAGE_PATH + file.path+name);
        }
    }

    showPreloadMessage(part) {
         //console.log('show preload', part);
         let perc = parseInt(100 * part);
         this.progress.style.width = perc+'%';

    }

    onImageLoad(ev) {
        this.loadedImages++;
        if(this.loadedImages < this.preloadThreshHold) {
            this.showPreloadMessage(this.loadedImages / this.preloadThreshHold);
        }
        if (this.loadedImages === this.preloadThreshHold) {
            this.onPreloadImagesLoaded();
        }
        if (ev.currentTarget.refId === this.currentFrame) {
            this.drawImage();
        }

    }

    onPreloadImagesLoaded() {
        this.loader.style.display = 'none';
        this.loadCallback();
        //this.events.dispatchEvent(new Event('imagesloaded'));

    }

}