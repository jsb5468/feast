function pick(list) {
  return list[Math.floor(Math.random()*list.length)];
}

function Creature(name = "Creature") {
  this.name = name;
  this.health = 100;
  this.maxHealth = 100;
  this.mass = 80;
  this.bowels = new Bowels();
  this.stomach = new Stomach(this.bowels);
  this.butt = new Butt(this.bowels,this.stomach);

  this.str = 10;
  this.dex = 10;
  this.con = 10;
}

function Player(name = "Player") {
  Creature.call(this, name);

  this.fullness = function() {
    return this.stomach.fullness();
  }
}

function Anthro() {
  Creature.call(this, name);

  this.mass = 80 * (Math.random()/2 - 0.25 + 1);
  this.build = "ordinary";
  if (this.mass < 70) {
    this.build = "skinny";
  } else if (this.mass > 90) {
    this.build = "fat";
  }

  this.species = pick(["dog","cat","lizard","deer","wolf","fox"]);
  this.description = function() {
    return this.build + " " + this.species;
  };
}

function Micro() {
  Creature.call(this, name);

  this.health = 5;
  this.mass = 0.1 * (Math.random()/2 - 0.25 + 1);

  this.species = pick(["dog","cat","lizard","deer","wolf","fox"]);
  this.description = function() {
    return "micro " + this.species;
  };
}

// vore stuff here

class Container {
  constructor(name) {
    this.name = name;

    this.contents = [];
    // health/sec
    this.damageRate = 15*100/86400;

    // kg/sec
    this.digestRate = 80/8640;
  }

  digest(time) {
    let lines = [];
    this.contents.forEach(function(prey) {
      if (prey.health > 0) {
        let damage = Math.min(prey.health, this.damageRate * time);
        prey.health -= damage;
        time -= damage / this.damageRate;

        if (prey.health <= 0) {
          lines.push(this.describeKill(prey));
        }
      }

      if (prey.health <= 0) {
        let digested = Math.min(prey.mass, this.digestRate * time);

        prey.mass -= digested;

        this.fill(digested);
      }

      if (prey.mass <= 0) {
        lines.push(this.describeFinish(prey));
        this.finish(prey);
      }

    }, this);

    this.contents = this.contents.filter(function(prey) {
      return prey.mass > 0;
    });

    return lines;
  }

  feed(prey) {
    this.contents.push(prey);
  }

  fullness() {
    return this.contents.reduce((total, prey) => total + prey.mass, 0);
  }
}

class Stomach extends Container {
  constructor(bowels) {
    super();
    this.bowels = bowels;
  }

  describeKill(prey) {
    return "The " + prey.description() + "'s struggles wane as your stomach overpowers them.";
  }

  describeFinish(prey) {
    return "Your churning guts have reduced a " + prey.description() + " to meaty chyme.";
  }

  fill(amount) {
    this.bowels.add(amount);
  }

  finish(prey) {
    this.bowels.finish(prey);
  }
}

class Butt extends Container {
  constructor(bowels, stomach) {
    super();
    this.bowels = bowels;
    this.stomach = stomach;
  }

  digest(time) {
    this.contents.forEach(function (x) {
      x.timeInButt += time;
    });

    let lines = super.digest(time);

    let pushed = this.contents.filter(prey => prey.timeInButt >= 60 * 30);

    pushed.forEach(function(x) {
      this.stomach.feed(x);
      lines.push("Your winding guts squeeze the " + x.description() + " into your stomach.");
    },this);

    this.contents = this.contents.filter(prey => prey.timeInButt < 60 * 30);

    return lines;
  }

  describeKill(prey) {
    return "The " + prey.description() + " abruptly stops struggling, overpowered by your winding intestines.";
  }

  describeFinish(prey) {
    return "That delicious " + prey.description() + " didn't even make it to your stomach...now they're gone.";
  }

  feed(prey) {
    prey.timeInButt = 0;
    super.feed(prey);
  }

  fill(amount) {
    this.bowels.add(amount);
  }

  finish(prey) {
    this.bowels.finish(prey);
  }
}

function WasteContainer(name) {
  this.name = name;

  this.fullness = 0;

  this.contents = [];

  this.add = function(amount) {
    this.fullness += amount;
  };

  this.finish = function(prey) {
    this.contents.push(prey);
  };
}

function Bowels() {
  WasteContainer.call(this, "Bowels");
}
