export default class Configs{
	contructor(){

	}
	static content(){
		return {
			'selvmord': {
				frameCount: 513,
				frameRate: 15,
				file: 'mord.json',
				pathNames:{
					mobilePath:'selvmord-mobil/',
					mobileFileName:'selvmord-mobil-00000',
					desktopPath:'selvmord-desktop/',
					desktopFileName:'selvmord-desktop-00000',
					mobilePathLowres:'selvmord-mobil-low/',
					mobileFileNameLowres:'selvmord-mobil-low-00000',
					desktopPathLowres:'selvmord-desktop-low/',
					desktopFileNameLowres:'selvmord-desktop-low-00000'
				}
			}
		}
	}
}