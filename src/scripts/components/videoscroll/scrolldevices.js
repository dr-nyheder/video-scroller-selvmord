
export default class ScrollDevices{

	constructor(){
	}
	static scrollrate(){
		let windowsdefaultscrollrate = 800,
		explorerscrollrate = 700,
		iOsScrollrate = 350,
		macscrollrate = 200,
		androidscrollrate = 250,
		scrollrate = windowsdefaultscrollrate;

		let ua = navigator.userAgent.toLowerCase();

		let isWinChrome = (ua.indexOf('chrome') > -1 && ua.indexOf('windows') > -1);

		let isAndroid = ua.indexOf("android") > -1;

		let isMac = ua.indexOf("mac os x") > -1;

		let isiPhone = ua.indexOf('iphone') > -1;

		let isIE = (navigator.appName === 'Microsoft Internet Explorer' || !!(ua.match(/Trident/) || ua.match(/rv:11/)));


		if (isMac) scrollrate = macscrollrate;
		if (isiPhone) scrollrate = iOsScrollrate;
		if (isAndroid) scrollrate = androidscrollrate;
		if (isIE) scrollrate = explorerscrollrate;

		return scrollrate;
	}
}