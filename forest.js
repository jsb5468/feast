function ForestExplore() {
  GameObject.call(this, "Explore the Forest");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*30 * (Math.random() * 0.2 + 0.9));

      if (outcome < 0.25) {
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

  this.description = function() { return "wolf"; };

  this.attacks = [];

  this.attacks.push(wolfBite(this));

  //this.attacks.push(wolfSwallow(this));

  this.attacks.push(wolfTackle(this));
  //this.attacks.push(wolfTackleBite(this));
  this.attacks.push(wolfTackleSwallow(this));

  this.attacks.push(wolfDigest(this));

  this.backupAttack = pass(this);

  this.flags.stage = "combat";

  this.startCombat = function(player) {
    return ["Oh no a feral wolf"];
  };

  this.finishCombat = function() {
    return ["Oops eaten"];
  };

  this.status = function(player) {
    return ["It's a wolf"];
  };
}

function wolfBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str);
      return ["The wolf jumps at you, biting for " + damage + " damage"];
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

function wolfTackle(attacker) {
  return {
    attackPlayer: function(defender){
      defender.flags.grappled = true;
      return ["The wolf leaps on top of you, pinning you to the ground!"];
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

function wolfTackleSwallow(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.stage = "oral";
      return ["You struggle against the wolf, but it's not enough - its greedy jaws envelop your head, then your shoulders. The hungry beast swallows you down in seconds, cramming you into its hot, slimy stomach."];
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

function wolfDigest(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, 25);
      return ["The wolf's churning guts wear you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.stage == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}
