'use strict';

export default class Greeter {
	constructor(name) {
		this.name = name;
	}
	greet() {
		return `Hi, ${this.name}`;
	}
}