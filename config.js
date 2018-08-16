let config = {
    stagingFolder:'/Volumes/staging/',
    deployFolder:'/Volumes/netdoks/Holmbladsgaderuten/',
    local: {
        DEBUGGING:true,
        ASSETS_PATH:JSON.stringify('assets/'),
        SCROLL_IMAGE_PATH:JSON.stringify('http://localhost:8888/mobil-web/video-scroller-selvmord/grafik/')
    },
    staging: {
        DEBUGGING:true,
        ASSETS_PATH:JSON.stringify('https://www.dr.dk/tjenester/visuel/staging/video-scroller-selvmord/assets/'),
        SCROLL_IMAGE_PATH:JSON.stringify('https://www.dr.dk/tjenester/visuel/scroll-video/selvmord/')
        // SCROLL_IMAGE_PATH:JSON.stringify('https://downol.dr.dk/download/nyheder/2018/mord-scroller/images/')
    },
    deploy: {
        DEBUGGING:false,
        ASSETS_PATH:JSON.stringify('https://www.dr.dk/tjenester/netdoks/Holmbladsgaderuten/video-scroller-selvmord/assets/'),
        SCROLL_IMAGE_PATH:JSON.stringify('https://www.dr.dk/tjenester/visuel/scroll-video/selvmord/')
        // SCROLL_IMAGE_PATH:JSON.stringify('https://downol.dr.dk/download/nyheder/2018/mord-scroller/images/')
    }
}
module.exports = config;