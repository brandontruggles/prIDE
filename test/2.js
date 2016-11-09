
function rtu(q) {
//var rtu = (function (q) {
//function rtu(q) {
	//var q = [];
	this.q = q;

	this.enq = function (e) {
		q.push(e);
	};

	this.deq = function () {
		q.splice(0, 1);
	};

	this.getq = function () {
		return q;
	}

	//return {enq: enq, deq: deq, getq: getq};
//})(q);
}

var r = [5, 6];
var rtu = new rtu(r);

rtu.enq(1);
rtu.enq(2);
rtu.enq(3);
rtu.deq();

var x = rtu.getq();

console.log(x);

