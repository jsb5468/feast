function Object(name="Potato") {
  this.name = name;
  this.actions = [];
}

function Burger() {
  Object.call(this, "Burger");
  this.actions.push({
    "name": "Punch Burger",
    "action": function() {
      player.health += 10;
      update(["You punch the hamburger."]);
    }
  });
}

function Nerd() {
  Object.call(this, "Nerd");
  this.actions.push({
    "name": "Eat Nerd",
    "action": function() {
      startDialog(new EatDude());
    }
  });
}

function Toilet() {
  Object.call(this, "Toilet");
  this.actions.push({
    "name": "Admire toilet",
    "action": function() {
      update(["You admire the toilet."]);
    }
  });
}

function TV() {
  Object.call(this, "TV");
  this.actions.push({
    "name": "Watch TV",
    "action": function() {
      update(["Reruns, again."]);
    }
  });
}

function Phone() {
  Object.call(this, "Phone");
  this.actions.push({
    "name": "Use phone",
    "action": function() {
      startDialog(new PhoneCall());
    }
  });
}

function Bed() {
  Object.call(this, "Bed");
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
  Object.call(this, "Sofa");
  this.actions.push({
    "name": "Sit on sofa",
    "action": function(){
      startDialog(SofaSit());
    }
  })
}
