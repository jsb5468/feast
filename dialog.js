"use strict";

function DialogNode() {
  this.text = "Foo bar baz.";
  this.hooks = [];

  this.visit = function() {
    for (let i=0; i<this.hooks.length; i++)
      this.hooks[i]();
  };

  this.choices = [];

  this.addChoice = function(text,node,tests=[]) {
    this.choices.push({"text": text, "node": node, "tests": []});
  };
}

function EatDude() {
  DialogNode.call(this);

  let nerd = new Anthro();

  this.text = "You approach the " + nerd.description();

  let eatHim = new DialogNode();

  eatHim.text = "You eat the nerd. Burp.";
  eatHim.hooks.push(function() { player.stomach.feed(nerd); });

  let dontEatHim = new DialogNode();
  dontEatHim.text = "You don't eat the nerd.";

  this.addChoice("Eat him lol",eatHim);
  this.addChoice("Actually don't",dontEatHim);
}

function PhoneCall() {
  DialogNode.call(this);

  this.text = "You pick up the phone. Who do you want to call?";

  {
    let nodeFen = new DialogNode();
    this.addChoice("Fen",nodeFen);
    nodeFen.text = "You dial Fen's number. Milliseconds later, he kicks open your front door and dabs on you, then runs away.";
  }

  {
    let nodeNerd = new DialogNode();
    this.addChoice("Some nerd",nodeNerd);
    nodeNerd.text = "You dial some nerd. He shows up at your front door.";
    nodeNerd.hooks.push(function() { startDialog(new EatDude()); });
  }

  {
    let nodeCrash = new DialogNode();
    this.addChoice("Crash the game",nodeCrash);
    nodeCrash.text = "Oh no oops";
    nodeCrash.hooks.push(function() { potato() });
  }
}
