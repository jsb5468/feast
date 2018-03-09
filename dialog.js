"use strict";

function DialogNode {
  this.text = "Foo bar baz.";
  this.hooks = [];

  this.visit = function() {
    for (let i=0; i<this.hooks.length; i++)
      this.hooks[i]();
    return this.text;
  }

  this.choices = [];

  this.addChoice = function(text,node) {
    this.choices.push({"text": text, "node": node});
  }
}
