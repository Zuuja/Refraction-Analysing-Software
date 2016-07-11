var Line = require('./Linearize.js');
var fs = require('fs');
var inPath = process.argv[2];
var outPath = process.argv[3];
var loggingFrequency = process.argv[5] == undefined ? 100 : process.argv[4];
var stringData = fs.readFileSync(inPath).toString().trim();

var RowArrays = stringData.split('\n');

var MinHeight = 1;	//meters
var C = 0.002695781;	//refractive constant: STP in air
var StartAngles = [10, 20, 30, 40, 50, 60, 70, 80, 90]; //set angles which you want to check

var StartHeight = process.argv[4];

function toRad(deg) {
    return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}

if(RowArrays[0].length < 2) console.log('Insufficient data error');

var XArray = [];

var YLabels = ['P', 'T'];
var YArrays = {};
YLabels.forEach(function(el){
    YArrays[el] = [];
});

RowArrays.forEach(function(el) {
    var SingleRowArr = el.split(' ');
    XArray.push(parseInt(SingleRowArr[0]));
    for(var i=1;i<SingleRowArr.length;i++) {
        YArrays[YLabels[i-1]].push(parseInt(SingleRowArr[i]));
    }
});

Line.loadXPoints(XArray);
Line.loadYPoints(YArrays[YLabels[0]], YLabels[0]);
Line.loadYPoints(YArrays[YLabels[1]], YLabels[1]);

function linearDistance(Angle) {
    return MinHeight * Math.tan(Angle);
}
function n(height) { //dispersion coefficient, n = C * P / T
    return C * Line.getValue(height, 'P') / Line.getValue(height, 'T');
}
function updateAngle(oldAngle, height) {
    return Math.asin((n(height) / n(height - MinHeight)) * Math.sin(oldAngle)); //beta = arcsin (n[k]/n[k+1]) * sin(alpha)
}

function DataUnit(Angle, Height, Distance, Coef) {
    return {
        Angle: Angle,
        Height: Height,
        ChangeInDistance: Distance,
        LocalNCoef: Coef
    }
}
function Step (Data) {
    results.push(Data);
    return new DataUnit(updateAngle(Data.Angle, Data.Height), Data.Height - MinHeight, linearDistance(Data.Angle), n(Data.Height));
}

var data;
var results = [];

function SimulateAndWrite(WritePathModifier, StartingAngle) {
    results = [];
     var data = new DataUnit(toRad(StartingAngle), StartHeight, 0, n(StartHeight));
     var TotalTicks = 0;
     while (data.Height > 10) {
        if (TotalTicks > 1000000) { console.log('TOTAL TICKS EXCEEDED'); break;}
        data = Step(data);
        TotalTicks++;
    }

Step(data);
var TotalDistance = 0;

fs.writeFileSync(WritePathModifier + outPath, '');
fs.appendFileSync(WritePathModifier + outPath, '#Height, Distance, Angle, N\n')
results.forEach(function(el, index) {
        TotalDistance+= el.ChangeInDistance
        if(index%loggingFrequency == 0) {
            fs.appendFileSync(WritePathModifier + outPath, el.Height + ' ' + TotalDistance + ' ' + el.Angle + ' ' + el.LocalNCoef + '\n');
        }
    });
}

StartAngles.forEach(function(el, index, arr) {
	SimulateAndWrite(el.toString(), el)
})
