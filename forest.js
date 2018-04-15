function ForestExplore() {
  GameObject.call(this, "Explore the Forest");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*30 * (Math.random() * 0.2 + 0.9));

      if (outcome < 0.35) {
        currentRoom.flags.exit = true;
        update(["You find a way back!"]);
      } else if (outcome < 0.5) {
        startCombat(new Wolf());
      } else if (outcome < 0.6) {
        startCombat(new AlphaWolf());
      } else {
        update(["You explore the forest for a while, but don't find anything."]);
      }
    }
  });

  this.actions.push({
    "name": "Leave",
    "action": function() {
      moveToByName("East Trail", "You leave the forest");
    },
    "conditions": [
      function(player) {
        return currentRoom.flags.exit;
      }
    ]
  });
}

function Wolf() {
  Creature.call(this, "Wolf", 10, 15, 15);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wolf"; };

  this.attacks = [];

  this.attacks.push(wolfBite(this));
  this.attacks.push(wolfHowl(this));

  this.attacks.push(wolfTackle(this));
  this.attacks.push(wolfTackleBite(this));
  this.attacks.push(wolfTackleSwallow(this));

  this.attacks.push(grappledStruggle(this));

  this.backupAttack = pass(this);

  this.struggles = [];

  this.struggles.push(new struggle(this));
  this.struggles.push(new submit(this));

  this.digests = [];

  this.digests.push(wolfDigest(this));
  this.digests.push(wolfBelch(this));

  this.flags.stage = "combat";

  this.startCombat = function(player) {
    return ["A snapping twig grabs your attention. You turn and find yourself facing a large, mangy wolf. The cur stands at least half your height at the shoulder, and it looks <i>hungry.</i>"];
  };

  this.finishCombat = function() {
    if (this.flags.stage == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.stage == "oral")
      return ["You fall limp in " + this.description("the") + "'s roiling guts, melting away to feed the mangy predator for a good, long time..."];
  };

  this.status = function(player) {
    return [];
  };
}

function AlphaWolf() {
  Creature.call(this, "Alpha Wolf", 20, 20, 20);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " alpha wolf"; };

  this.attacks = [];

  this.attacks.push(wolfBite(this));
  this.attacks.push(wolfHowl(this));

  this.attacks.push(wolfTackle(this));
  this.attacks.push(wolfTackleBite(this));
  this.attacks.push(wolfTackleSwallow(this));

  this.attacks.push(wolfSwallow(this));

  this.attacks.push(grappledStruggle(this));
  this.attacks.push(grappledReverse(this));

  this.backupAttack = pass(this);

  this.struggles = [];

  this.struggles.push(new struggle(this));
  this.struggles.push(new submit(this));

  this.digests = [];

  this.digests.push(wolfDigest(this));
  this.digests.push(wolfBelch(this));

  this.flags.stage = "combat";

  this.startCombat = function(player) {
    return ["A low growl sends a chill up your spine. You turn around slowly, coming face-to-face with a massive, snarling wolf. Nearly six feet tall at the shoulder, the beast is eyeing you up as a snack."];
  };

  this.finishCombat = function() {
    if (this.flags.stage == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.stage == "oral")
      return ["You fall limp in " + this.description("the") + "'s roiling guts, melting away to feed the mangy predator for a good, long time..."];
  };

  this.status = function(player) {
    return [];
  };
}

function wolfBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str);
      return [attacker.description("The") + " jumps at you, biting for " + damage + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wolfHowl(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.statBuffs.push(new StatBuff("str", 1.25));
      return [attacker.description("The") + " backs up and lets out a long, wailing howl.",newline,"It seems emboldened."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.25; }
  };
}


function wolfTackle(attacker) {
  return {
    attackPlayer: function(defender){
      defender.flags.grappled = true;
      return [attacker.description("The") + " leaps on top of you, pinning you to the ground!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1.25 - defender.health/defender.maxHealth; }
  };
}

function wolfTackleBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str * 1.5);
      return pickRandom([
        ["Pain shoots through your arm as " + attacker.description("the") + " bites it for " + damage + " damage!"],
        ["You struggle against " + attacker.description("the") + " as it bites your shoulder for " + damage + " damage."],
        [attacker.description("The") + "'s claws dig into your legs for " + damage + " damage."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}

function wolfTackleSwallow(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.stage = "oral";
      changeMode("eaten");
      return ["You struggle against " + attacker.description("the") + ", but it's not enough - its greedy jaws envelop your head, then your shoulders. The hungry beast swallows you down in seconds, cramming you into its hot, slimy stomach."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wolfSwallow(attacker) {
  return {
    attackPlayer: function(defender){
      let success = statCheck(attacker, defender, "dex") || defender.stamina == 0;
      if (success) {
        attacker.flags.stage = "oral";
        changeMode("eaten");
        return [attacker.description("The") + " charges, closing the gap in the blink of an eye and jamming your upper body into its massive, drool-slathered maw. <i>Glrp, glllpkh, gulp</i> - and you're in its throat, thrashing and struggling as you plunge into the greedy beast's sloppy stomach."];
      } else {
        return [attacker.description("The") + " lunges at you, racing up with jaws splayed wide open. You leap to the side, barely avoiding the greedy beast's maw as it barrels past, growling and snapping in frustration."];
      }
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wolfDigest(attacker) {
  return {
    digest: function(defender){
      let damage = attack(attacker, defender, attacker.str * 3);
      return [attacker.description("The") + "'s churning guts wear you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested by " + attacker.description("a"); }
  };
}

function wolfBelch(attacker) {
  return {
    digest: function(defender){
      defender.stamina -= 50;
      let damage = attack(attacker, defender, attacker.str * 2);
      return [attacker.description("The") + " lets out a crass <i>BELCH</i>, draining air from its snarling gut and squeezing you even tighter than before."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Reduced to a belch by " + attacker.description("a"); }
  };
}
