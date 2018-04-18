function MountainExplore() {
  GameObject.call(this, "Explore");

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*15);

      if (outcome < 0.25) {
        startCombat(new MountainWyrm());
      } else {
        update(["You wander around for a bit, but haven't found your way out yet."]);
      }
    }
  });
}

function MountainWyrm() {
  Creature.call(this, "Wyrm", 25, 15, 35);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wyrm"; };

  this.attacks = [];

  this.flags.state = "combat";

  this.attacks.push(wyrmBite(this));
  /*this.attacks.push(wyrmTail(this));
  this.attacks.push(wyrmRoar(this));

  this.attacks.push(wyrmPounce(this));

  this.attacks.push(wyrmGrind(this));
  this.attacks.push(wyrmCockVore(this));

  this.attacks.push(wyrmCockSwallow(this));
  this.attacks.push(wyrmCockCrush(this));

  this.attacks.push(wyrmCockDigest(this));

  this.attacks.push(grappledStruggle(this));*/

  this.startCombat = function(player) {
    return ["A shadow falls over you; a heartbeat later, a hound-sized wyrm swoops down, landing with a heavy <i>thump</i> on the rocky ground. He hisses and snarls at you, rearing up in an attempt to intimidate you..and showing off his throbbing shaft."];
  };

  this.finishCombat = function() {
    if (this.flags.stage == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.stage == "balls")
      return ["You fall limp in " + this.description("the") + "'s balls."];
  };
}

function wyrmBite(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str);
      return [attacker.description("The") + " rushes up and bites you for " + damage + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + defender.health/defender.maxHealth; }
  };
}
