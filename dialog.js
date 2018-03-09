"use strict";

function DialogNode() {
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

function EatDude() {
  DialogNode.call(this);

  this.text = "You approach the nerd.";

  let eatHim = new DialogNode();

  eatHim.text = "You eat the nerd. Burp.";
  eatHim.hooks.push(function() { player.health += 100 } );

  let dontEatHim = new DialogNode();
  dontEatHim.text = "You don't eat the nerd.";

  this.addChoice("Eat him lol",eatHim);
  this.addChoice("Actually don't",dontEatHim);
}
