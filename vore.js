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
}

function Player(name = "Player") {
  Creature.call(this, name);

  this.fullness = function() {
    return this.stomach.fullness();
  }
}

function Anthro() {
  this.mass = 80 * (Math.random()/2 - 0.25 + 1);
  this.build = "ordinary";
  if (this.mass < 70) {
    this.build = "skinny";
  } else if (this.mass > 90) {
    this.build = "fat";
  }

  this.species = pick(["dog","cat","lizard","deer","wolf","fox"]);

  Creature.call(this, name);

  this.description = function() {
    return this.build + " " + this.species;
  };
}

// vore stuff here

function Container(name) {
  this.name = name;
  this.contents = [];
  // health/sec
  this.damageRate = 15*100/86400;

  // kg/sec
  this.digestRate = 80/8640;

  this.digest = function(time) {
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
  };

  this.feed = function(prey) {
    this.contents.push(prey);
  };

  this.fullness = function() {
    return this.contents.reduce((total, prey) => total + prey.mass, 0);
  }
}

function Stomach(bowels) {
  Container.call(this, "stomach");

  this.describeKill = function(prey) {
    return "The " + prey.description() + "'s struggles wane as your stomach overpowers them.";
  }

  this.describeFinish = function(prey) {
    return "Your churning guts have reduced a " + prey.description() + " to meaty chyme.";
  };

  this.fill = function(amount) {
    bowels.add(amount);
  };

  this.finish = function(prey) {
    bowels.finish(prey);
  };
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
