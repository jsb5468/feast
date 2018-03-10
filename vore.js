function pick(list) {
  return list[Math.floor(Math.random()*list.length)];
}

function Creature(name = "Creature") {
  this.name = name;
  this.health = 100;
  this.maxHealth = 100;
  this.mass = 80;
  this.stomach = new Stomach();
}

function Player(name = "Player") {
  Creature.call(this, name);

  this.fullness = 100;
  this.maxFullness = 200;
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

function Container(name = "stomach") {
  this.name = name;
  this.contents = [];
  this.digested = [];
  this.digest = function(time) {

  };

  this.feed = function(prey) {
    this.contents.push(prey);
  };
}

function Stomach() {
  Container.call(this, "stomach");

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
      }

      if (prey.health <= 0) {
        let digested = Math.min(prey.mass, this.digestRate * time);

        prey.mass -= digested;
      }

      if (prey.mass <= 0) {
        lines.push("Your churning guts have reduced a " + prey.description() + " to meaty chyme.");
        this.digested.push(prey);
      }

    }, this);

    this.contents.filter(function(prey) {
      return prey.mass > 0;
    });

    return lines;
  };


}
