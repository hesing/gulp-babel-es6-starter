var Polygon = require("./polygon");

class Square extends Polygon{
	constructor(length=5){
		super(length, length);
		this.name = "Square";
	}

	get area(){
		return this.width * this.height;
	}
}

module.exports = Square;