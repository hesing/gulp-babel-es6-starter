'use strict';

var utils = require('./utils');
var iso = require('../../portable');
var Polygon = require('./components/polygon');
var Square = require("./components/Square");

console.log(iso.validateId('USER_sdfwe23'));
console.log('Client side code started');

// utils.count();
var p = new Polygon(10,20);
var s1 = new Square(10, 10); 
var s2 = new Square();

console.log(p.getName());
console.log(s1.getName() + "Area is: "+ s1.area);
console.log(s2.getName() + "Area is: "+ s2.area);
