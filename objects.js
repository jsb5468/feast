"use strict";

function GameObject(name="Potato") {
  this.name = name;
  this.actions = [];
}

function Burger() {
  GameObject.call(this, "Burger");
  this.actions.push({
    "name": "Punch Burger",
    "action": function() {
      player.health += 10;
      update(["You punch the hamburger."]);
    }
  });
}

function Nerd() {
  GameObject.call(this, "Nerd");
  this.actions.push({
    "name": "Eat Nerd",
    "action": function() {
      startDialog(new EatDude());
    }
  });
}

function Toilet() {
  GameObject.call(this, "Toilet");
  this.actions.push({
    "name": "Admire toilet",
    "action": function() {
      update(["You admire the toilet."]);
    }
  });
}

function TV() {
  GameObject.call(this, "TV");
  this.actions.push({
    "name": "Watch TV",
    "action": function() {
      update(["Reruns, again."]);
    }
  });
}

function Phone() {
  GameObject.call(this, "Phone");
  this.actions.push({
    "name": "Use phone",
    "action": function() {
      startDialog(new PhoneCall());
    }
  });
}

function Bed() {
  GameObject.call(this, "Bed");
  this.actions.push({
    "name": "Sleep",
    "action": function() {
      update(["You take a nap."]);
      advanceTime(2700);
      updateDisplay();
    }
  });
}

function Sofa() {
  GameObject.call(this, "Sofa");
  this.actions.push({
    "name": "Sit on sofa",
    "action": function(){
      startDialog(SofaSit());
    }
  });
}

function NatureTrailExercise() {
  GameObject.call(this, "Exercise");
  this.actions.push({
    "name": "Exercise",
    "action": function() {
      startDialog(new NatureExercise());
    }
  });
}
