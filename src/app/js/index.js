'use strict';

import Greeter from './greeter';

class FormalGreeter extends Greeter {
  constructor(name) {
		super(name);
  }
  formalGreet() {
		return `Good, day, ${this.name}, it is a pleasure meeting you`;
  }
}

var greeter = new FormalGreeter('Chris');

window.veryImportantValue = true;

document.querySelector('#greet').textContent = greeter.greet();
document.querySelector('#formalGreet').textContent = greeter.formalGreet();