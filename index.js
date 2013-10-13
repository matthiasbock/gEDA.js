
$('body').onload = function() {
    var svg = document.getElementById('svg2');
    var ic0 = new HexInverter14();
    var e = svg.getElementById('text3883-4');
    ic0.terminals[1].SVGElement = e;
    console.log(e);
    log = function() { console.log('mouse over 1A'); };
    ic0.terminals[1].onmouseover = log;
};
