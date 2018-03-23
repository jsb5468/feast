"use strict";

function Creature(name = "Creature", str = 10, dex = 10, con = 10) {
  this.name = name;

  this.mass = 80;
  this.bowels = new Bowels();
  this.stomach = new Stomach(this, this.bowels);
  this.butt = new Butt(this, this.bowels, this.stomach);
  this.attacks = [];

  this.baseStr = str;
  this.baseDex = dex;
  this.baseCon = con;

  this.statBuffs = [];

  this.statMultiplier = function(stat) {
    let multiplier = 1;

    return this.statBuffs.reduce((multiplier, effect) => (effect.stat == stat) ? multiplier * effect.amount : multiplier, multiplier);
  };

  Object.defineProperty(this, "str", {
    get: function() {
      return this.baseStr * this.statMultiplier("str");
    },
    set: function(val) {
      this.baseStr = val;
    }
  });
  Object.defineProperty(this, "dex", {
    get: function() {
      return this.baseDex * this.statMultiplier("dex");
    },
    set: function(val) {
      this.baseDex = val;
    }
  });
  Object.defineProperty(this, "con", {
    get: function() {
      return this.baseCon * this.statMultiplier("con");
    },
    set: function(val) {
      this.baseCon = val;
    }
  });

  this.hasName = false;

  Object.defineProperty(this, "maxHealth", {
    get: function() {
      return this.str * 5 + this.con * 10;
    }
  });
  this.health = this.maxHealth;
  Object.defineProperty(this, "maxStamina", {
    get: function() {
      return this.dex * 5 + this.con * 10;
    }
  });
  this.stamina = this.maxStamina;

  // fraction of max health per second
  this.healthRate = 1 / 86400 * 4;
  this.staminaRate = 1 / 86400 * 6;

  this.restoreHealth = function(time) {
    this.health = Math.min(this.maxHealth, this.health + this.maxHealth * time * this.healthRate);
  };

  this.restoreStamina = function(time) {
    this.stamina = Math.min(this.maxStamina, this.stamina + this.maxStamina * time * this.staminaRate);
  };

  this.flags = {};

  this.clear = function() {
    this.flags = {};
  };

  this.prefs = {
    prey: true,
    scat: true,
    grapple: true,
    vore: {
      oral: 1,
      anal: 1,
      cock: 1,
      unbirth: 1,
      hard: 1
    }
  };

  this.cash = Math.floor(Math.random() * 10 + 5);

  this.text = {};

  this.startCombat = function() {
    return [this.description("A") + " appears. It's a fight!"];
  };

  this.finishCombat = function() {
    return [this.description("The") + " scoops up your limp body and gulps you down."];
  };

  this.finishDigest = function() {
    return [this.description("The") + " digests you..."];
  };

  this.defeated = function() {
    startDialog(new FallenFoe(this));
  };

  this.changeStamina = function(amount) {
    this.stamina += amount;
    this.stamina = Math.min(this.maxStamina, this.stamina);
    this.stamina = Math.max(0, this.stamina);
  };

  this.tickEffects = function() {
    this.statBuffs.forEach(function(x) {
      x.tick();
    });

    this.statBuffs.filter(function(x) {
      return x.alive;
    });
  };
}

function Player(name = "Player") {
  Creature.call(this, name, 15, 15, 15);

  this.fullness = function() {
    return this.stomach.fullness() + this.butt.fullness();
  };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new flankAttack(this));

  this.attacks.push(new grapple(this));
  this.attacks.push(new grappleSubdue(this));
  this.attacks.push(new grappleDevour(this));
  this.attacks.push(new grappleAnalVore(this));
  this.attacks.push(new grappleRelease(this));

  this.attacks.push(new grappledStruggle(this));
  this.attacks.push(new grappledReverse(this));

  this.attacks.push(new shrunkGrapple(this));
  this.attacks.push(new shrunkSwallow(this));
  this.attacks.push(new shrunkStomp(this));

  this.attacks.push(new pass(this));
  this.attacks.push(new flee(this));

  this.backupAttack = new pass(this);

  this.cash = 100;
}

function Anthro(name = "Anthro") {
  this.build = pickRandom(["skinny", "fat", "muscular", "sickly", "ordinary"]);

  switch (this.build) {
    case "skinny":
      Creature.call(this, name, 8, 12, 8);
      this.mass *= (Math.random() * 0.2 + 0.7);
      break;
    case "fat":
      Creature.call(this, name, 10, 7, 15);
      this.mass *= (Math.random() * 0.4 + 1.1);
      break;
    case "muscular":
      Creature.call(this, name, 13, 11, 13);
      this.mass *= (Math.random() * 0.1 + 1.1);
      break;
    case "sickly":
      Creature.call(this, name, 6, 8, 6);
      this.mass *= (Math.random() * 0.2 + 0.6);
      break;
    case "ordinary":
      Creature.call(this, name, 10, 10, 10);
      break;

  }

  this.species = pickRandom(["dog", "cat", "lizard", "deer", "wolf", "fox"]);

  // todo better lol

  this.description = function(prefix = "") {
    if (this.build == "")
      if (prefix == "")
        return this.species;
      else
        return prefix + " " + this.species;
    else
    if (prefix == "")
      return this.build + " " + this.species;
    else
      return prefix + " " + this.build + " " + this.species;
  };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new flankAttack(this));

  this.attacks.push(new grapple(this));
  this.attacks.push(new grappleDevour(this));

  this.attacks.push(new grappledStruggle(this));
  this.attacks.push(new grappledReverse(this));

  this.backupAttack = new pass(this);

  this.struggles = [];

  this.struggles.push(new plead(this));
  this.struggles.push(new struggle(this));
  this.struggles.push(new submit(this));

  this.digests = [];

  this.digests.push(new digestPlayerStomach(this, 20));

  this.backupDigest = new digestPlayerStomach(this, 20);
}

function Fen() {
  Creature.call(this, name, 1000000, 1099900, 1000000);

  this.build = "loomy";
  this.species = "crux";

  this.description = function(prefix) {
    return "Fen";
  };

  this.attacks = [];

  this.attacks.push(new devourPlayer(this));
  this.attacks.push(new devourPlayerAnal(this));
  this.attacks.push(new leer(this));
  this.backupAttack = new poke(this);

  this.struggles = [];

  this.struggles.push(new rub(this));

  this.digests = [];

  this.digests.push(new instakillPlayerStomach(this));
  this.digests.push(new instakillPlayerBowels(this));

  this.backupDigest = new digestPlayerStomach(this, 50);
}

function Micro() {
  Creature.call(this, name);

  this.health = 5;
  this.mass = 0.1 * (Math.random() / 2 - 0.25 + 1);

  this.species = pick(["dog", "cat", "lizard", "deer", "wolf", "fox"]);
  this.description = function(prefix = "") {
    if (prefix == "")
      return "micro " + this.species;
    else
      return prefix + " micro " + this.species;
  };
}

// vore stuff here

function Container(owner) {
  this.owner = owner;
  this.contents = [];
  // health/sec
  this.damageRate = 15 * 100 / 86400;
  // health percent/sec
  this.damageRatePercent = 1 / 86400;

  // kg/sec
  this.digestRate = 80 / 8640;
}

Container.prototype = {
  digest: function(time) {
    let lines = [];
    this.contents.forEach(function(prey) {
      if (prey.health > 0) {
        let damage = Math.min(prey.health, this.damageRate * time + this.damageRatePercent * prey.maxHealth * time);
        prey.health -= damage;
        time -= damage / (this.damageRate + this.damageRatePercent * prey.maxHealth);

        if (prey.health + damage > 50 && prey.health <= 50) {
          lines.push(this.describeDamage(prey));
        }

        if (prey.health <= 0) {
          lines.push(this.describeKill(prey));
        }
      }

      if (prey.health <= 0) {
        let digested = Math.min(prey.mass, this.digestRate * time);

        prey.mass -= digested;

        this.owner.changeStamina(digested * 10);

        this.fill(digested);
      }

      if (prey.mass <= 0) {
        lines.push(this.describeFinish(prey));
        this.finish(prey);
      }

      this.contents = this.contents.filter(function(prey) {
        return prey.mass > 0;
      });

    }, this);

    return lines;
  },

  feed: function(prey) {
    this.contents.push(prey);
  },

  fullness: function() {
    return this.contents.reduce((total, prey) => total + prey.mass, 0);
  }
};

function Stomach(owner, bowels) {
  Container.call(this, owner);

  this.bowels = bowels;

  this.describeDamage = function(prey) {
    return "Your guts gurgle and churn, slowly wearing down " + prey.description("the") + " trapped within.";
  };

  this.describeKill = function(prey) {
    return prey.description("The") + "'s struggles wane as your stomach overpowers them.";
  };

  this.describeFinish = function(prey) {
    return "Your churning guts have reduced " + prey.description("a") + " to meaty chyme.";
  };

  this.fill = function(amount) {
    this.bowels.add(amount);
  };

  this.finish = function(prey) {
    this.bowels.finish(prey);
  };
}

Stomach.prototype = Object.create(Container.prototype);

function Butt(owner, bowels, stomach) {
  Container.call(this, owner);

  this.bowels = bowels;
  this.stomach = stomach;

  this.digest = function(time) {
    this.contents.forEach(function(x) {
      x.timeInButt += time;
    });

    let lines = Container.prototype.digest.call(this, time);

    let pushed = this.contents.filter(prey => prey.timeInButt >= 60 * 30);

    pushed.forEach(function(x) {
      this.stomach.feed(x);
      lines.push("Your winding guts squeeze " + x.description("the") + " into your stomach.");
    }, this);

    this.contents = this.contents.filter(prey => prey.timeInButt < 60 * 30);

    return lines;
  };

  this.describeDamage = function(prey) {
    return "Your bowels gurgle and squeeze, working to wear down " + prey.description("the") + " trapped in those musky confines.";
  };

  this.describeKill = function(prey) {
    return prey.description("The") + " abruptly stops struggling, overpowered by your winding intestines.";
  };

  this.describeFinish = function(prey) {
    return "That delicious " + prey.description() + " didn't even make it to your stomach...now they're gone.";
  };

  this.feed = function(prey) {
    prey.timeInButt = 0;
    Container.prototype.feed(prey);
  };

  this.fill = function(amount) {
    this.bowels.add(amount);
  };

  this.finish = function(prey) {
    this.bowels.finish(prey);
  };
}

Butt.prototype = Object.create(Container.prototype);

function WasteContainer(name) {
  this.name = name;

  this.fullness = 0;

  this.contents = [];

  this.add = function(amount) {
    this.fullness += amount;
  };

  this.finish = function(prey) {
    if (prey.prefs.scat)
      this.contents.push(prey);
  };
}

function Bowels() {
  WasteContainer.call(this, "Bowels");
}

// PLAYER PREY

function plead(predator) {
  return {
    name: "Plead",
    desc: "Ask very, very nicely for the predator to let you go. More effective if you haven't hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() < predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "escape",
          "lines": ["You plead for " + predator.description("the") + " to let you free, and they begrudingly agree, horking you up and leaving you shivering on the ground"]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You plead with " + predator.description("the") + " to let you go, but they refuse."]
        };
      }
    }
  };
}

function struggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "escape",
          "lines": ["You struggle and squirm, forcing " + predator.description("the") + " to hork you up. They groan and stumble away, exhausted by your efforts."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within " + predator.description("the") + " to no avail."]
        };
      }
    }
  };
}

function struggleStay(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "stay",
          "lines": ["You struggle and squirm, forcing " + predator.description("the") + " to hork you up. They're not done with you yet..."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within " + predator.description("the") + " to no avail."]
        };
      }
    }
  };
}


function rub(predator) {
  return {
    name: "Rub",
    desc: "Rub rub rub",
    struggle: function(player) {
      return {
        "escape": "stuck",
        "lines": ["You rub the crushing walls. At least " + predator.description("the") + " is getting something out of this."]
      };
    }
  };
}

function submit(predator) {
  return {
    name: "Submit",
    desc: "Do nothing",
    struggle: function(player) {
      return {
        "escape": "stuck",
        "lines": ["You do nothing."]
      };
    }
  };
}
