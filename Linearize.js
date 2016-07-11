var Linearize = {};
Linearize.xPoints = [];
Linearize.yPoints = [];
Linearize.loadXPoints = function (xPoints) {
    Linearize.xPoints = xPoints;
    //console.log('New xPoints: ' + Linearize.xPoints)
};
Linearize.loadYPoints = function (yPoints, label){
    console.log(yPoints[0]);
    if((label == 'T' || label == 't') && yPoints[0] < 150) {
        console.log('Assuming Temp. in deg. Celsius\n converting automatically')
        var newYPoints = [];
        for (var i = 0; i < yPoints.length; i++) newYPoints.push(273 + parseInt(yPoints[i]));
        Linearize.yPoints[label] = newYPoints;
        }
    else {
        Linearize.yPoints[label] = yPoints; 
}
};

Linearize.getValue =  function(x, yLabel)  {
    if(!Linearize.xPoints || !Linearize.yPoints[yLabel]) throw new Error('No data found');
    if(Linearize.xPoints.length != Linearize.yPoints[yLabel].length) console.log('Invalid data provided, datapoint arrays lengths uneven\n'
        + 'xPoints: ' + Linearize.xPoints.length + ' ' + yLabel + ': ' + Linearize.yPoints[yLabel].length);

    //console.log('x: ' + x + ' dataFloor: ' + dataFloor(x));
    var InX1 = Linearize.xPoints.indexOf(dataFloor(x));
    var InX2 = InX1 - 1;
    //console.log('InX1:' + InX1 + ' InX2:' + InX2);

    var LocalFitFunc = getLineFit(Linearize.xPoints[InX1], Linearize.xPoints[InX2]
        , Linearize.yPoints[yLabel][InX1], Linearize.yPoints[yLabel][InX2]);
    return LocalFitFunc(x);
};

function dataFloor (x) {
    if(x < Math.min.apply(Math, Linearize.xPoints) || x > Math.max.apply(Math, Linearize.xPoints)) console.log('Requested data for ' + x + ' that is not within xPoints');
    for(var i=0; i<Linearize.xPoints.length; i++) {
        if(x >= Linearize.xPoints[i] && x <= Linearize.xPoints[i+1]) return Linearize.xPoints[i+1];
    }
}

function getLineFit (x1, x2, y1, y2) {
    var a = (y1 - y2) /  (x1 - x2);
    var b = y1 - (a * x1);
    //console.log('Found fit a: ' + a + ' b: ' + b);
    return function(x) {
        return (a * x + b);
    }
}
module.exports = Linearize;
