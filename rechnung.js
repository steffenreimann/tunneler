//var GiBPS = 2.1;
var vals = [ 24, 15, 27, 10.4, 16.8 ];
var gesammt = 0;
var index = 0;
vals.forEach(function(GiBPS) {
	index++;
	var p30d = GiBPS * 2 * 30;
	var reserve = p30d * 0.25;
	var p30dr = p30d + reserve;
	console.log('index ', index);
	console.log(GiBPS + ' = ' + p30d);
	console.log(GiBPS + ' GiB = Mit Reserve und in TiB = ' + p30dr / 1024);
	gesammt = gesammt + p30d;
});
var gesamtTag = gesammt / 30;
var gesammtJahr = gesamtTag * 365;
console.log('Gesammt gesamt Tag  = ' + gesamtTag / 1024);
console.log('Gesammt gesamt 30Tage   = ' + gesamtTag * 30 / 1024);
console.log('Gesammt Jahr mit reserve= ' + gesammtJahr / 1024 * 1.2);

var xcm = 50;
var ycm = 30;
var xdpi = 300;
var ydpi = 300;
var bit = 24;
var xpx = xcm * xdpi / 2.54;
var ypx = ycm * ydpi / 2.54;
console.log('xcm = ' + xcm + ' cm = ' + xpx + ' px');
console.log('ycm = ' + ycm + ' cm = ' + ypx + ' px');

var pixelgesamt = xpx * ypx;
var bitprobild = pixelgesamt * bit;
console.log('pixelgesamt = ' + pixelgesamt);
console.log('bitprobild = ' + bitprobild);
var byteprobild = bitprobild / 8;
var KiBprobild = byteprobild / 1024;
var MiBprobild = KiBprobild / 1024;
console.log('MiBprobild = ' + MiBprobild);
var MiBproTag = MiBprobild * 30;
console.log('MiBproTag = ' + MiBproTag);
var MiBproWoche = MiBproTag * 7;
var GiBproWoche = MiBproWoche / 1024;
console.log('Lösung Nr.3 GiBproWoche = ' + GiBproWoche);

function mibinbyte(gib) {
	return gib * 1000 * 1000;
}

function byteingb(byte) {
	return byte / 1024 / 1024 / 1024;
}

function ibinbyte(val) {
	return val * 1.024;
}
function byteinib(val) {
	return val * 0.9765625;
}
function calc(val, from, to) {
	from = from.toLowerCase();
	to = to.toLowerCase();
	if (from.indexOf('i')) {
		val = ibinbyte(val);
	} else {
		val = byteinib(val);
	}
}

var fotos = 30000;
var groeße = 6.5;
var ges = fotos * groeße * 1.2;
console.log('fotos ges mb= ' + ges);
console.log('fotos ges gb= ', ges / 1000);
//console.log(256 * 1024 * 1024 * 1024 / 1000 / 1000 / 1000);
console.log('Lösung Nr.4', byteinib(ges) / 1024);
//console.log(1000 / 1024);
//console.log(1024 / 1000);
//console.log('1000 KiB sind kB =' + ibinbyte(1000));
//console.log('1000 kB  sind KiB =' + byteinib(1024));
//console.log(gibingb(ges));
