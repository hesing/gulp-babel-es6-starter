class Polygon{
	constructor(width, height){
		this.name = "Polygon";
		this.width = width;
		this.height = height;
	}

	getName(){
		return "I am "+ this.name;
	}
}

module.exports = Polygon;