var kostenproBlattPapier = 4.5 / 500 * 100;
console.log('kostenproBlattPapier = ' + kostenproBlattPapier);
var kostenproPatrone = 21;
var patronenReichweite = 550;
var kostenprogedrucktesBlatt = 21 / 550 * 100;
console.log('kostenprogedrucktesBlatt = ', kostenprogedrucktesBlatt + kostenproBlattPapier);

/* 
Elektrische Leistung P = Watt W oder VA
Stromstärke I = Ampere A
Menge der elektrischen Ladung 
Energie W = watt



Energie W = Ladung * Spannung
W = Q * U 

Leistung P = Energie E / Zeit T
P = W / T 

Leistung = Spannung * Strom
P = U * I

Ampere A = Leistung P / Spannung U
A = P / U 

W (VA) = Anzahl (Server o. Netzteile) * Watt 

Ah = Anzahl Q * Ah 

Wh = Ah gesamt * U

t = Wh / W

*/

var wattgesamt = 10 * 750;
var watth = 8 * 200 * 12;
console.log('watth = ', wattgesamt);
console.log('watth = ' + watth);
console.log('watth = ' + watth / wattgesamt);

var wg = 10 * 850;
var wh = 12 * 250 * 12;
console.log('gesamt zeit = ', wh / wg);
console.log('gesamt zeit = ', wh / wg - wh / wg * 0.25);
var g = wh / wg - wh / wg * 0.25;
const n = new Date(0, 0);
n.setMinutes(Math.round(g * 60));
console.log('Stunden = ' + n.getHours() + ' Minuten = ' + n.getMinutes());
