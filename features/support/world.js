const { setWorldConstructor, World } = require("@cucumber/cucumber");

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
  }
}

setWorldConstructor(CustomWorld);
