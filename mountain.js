function MountainExplore() {
  GameObject.call(this, "Explore");

  this.actions.push({
    "name": "Wyvern male",
    "action": function() {
      startCombat(new MountainWyrm());
    }
  });

  this.actions.push({
    "name": "Wyvern female",
    "action": function() {
      startCombat(new MountainWyvern());
    }
  });

  this.actions.push({
    "name": "Explore",
    "action": function() {
      let outcome = Math.random();
      advanceTime(60*15);

      if (outcome < 0.25) {
        startCombat(new MountainWyrm());
      } else if (outcome < 0.5) {
        startCombat(new MountainWyvern());
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
  this.flags.roars = 0;

  this.flags.cockDepth = 0;

  this.attacks.push(wyrmBite(this));
  this.attacks.push(wyrmTail(this));
  this.attacks.push(wyrmRoar(this));

  this.attacks.push(wyrmPounce(this));

  this.attacks.push(wyrmGrind(this));
  this.attacks.push(wyrmOralVore(this));
  this.attacks.push(wyrmCockVore(this));

  this.attacks.push(wyrmOralSwallow(this));

  this.attacks.push(wyrmStomachDigest(this));

  this.attacks.push(wyrmCockSwallow(this));
  this.attacks.push(wyrmCockCrush(this));
  this.attacks.push(wyrmCockIngest(this));

  this.attacks.push(wyrmBallsDigest(this));

  this.playerAttacks = [];

  this.playerAttacks.push(punchAttack);
  this.playerAttacks.push(flankAttack);

  this.playerAttacks.push(wyrmOralStruggle);
  this.playerAttacks.push(wyrmStomachStruggle);
  this.playerAttacks.push(wyrmCockStruggle);
  this.playerAttacks.push(wyrmBallStruggle);

  this.playerAttacks.push(pass);
  this.playerAttacks.push(flee);

  this.startCombat = function(player) {
    return ["A shadow falls over you; a heartbeat later, a hound-sized wyrm swoops down, landing with a heavy <i>thump</i> on the rocky ground. He hisses and snarls at you, rearing up in an attempt to intimidate you..and showing off his throbbing shaft."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.state == "cock")
      return ["You expire in the dragon's shaft, crushed to death by the wyrm's lust."];
    else if (this.flags.state == "stomach")
      return ["You give one last heave...and digest."];
    else if (this.flags.state == "balls")
      return ["The wyrm's thick, clingy cum proves too much for your body to bear. Slowly, surely, your struggles begin to fade - melting muscles dwindling your strength away to nothing. Deep, satisfied growls reverberate through your captor's massive seed-soaked prison...the last thing you perceive before everything goes dark.",
      newline,
      "Your body takes several hours to melt, breaking down and dissolving into a lake of hot, churning cum. The weight is enough to pin the greedy beast to the ground, and there he lays - panting, groaning, already forgetting the struggle he made to consume you and digest you alive. All the beast cared about now was chasing that <i>release.</i>",
      newline,
      "The bubble-churn of flesh and bone becoming seed finally ends, and the scaly predator lets out a triumphant roar. He shifts onto his back, curling up to raise his snout to the tip of his foot-long shaft. Draconic jaws part and a slick tongue slithers out...and he begins to lick. Every stroke of wet muscle sends a jolt of ecstasy up his spine. All too eager to release its pent-up flood, his cock throbs and twitches, engoring with blood and spurting out gobs of precum with each quick, forceful <i>slurp</i>. His lust builds for a half-minute, and then...",
      newline,
      "The first shot of acum arcs through the air. A gallon of rich, clingy wyrm seed splatters against a cliff face, raining down on the dusty ground. The next lands squarely in the wyrm's jaws, gushing down his throat and stuffing his belly with what was once <i>you</i>...and coating the rest of his body, too. He roars and thrashes, every orasmic clench of muscle spraying pint after pint of his cum. The display drags on for an entire minute, slowly reducing in intensity - and then comes the finale, as a bulge rushes up his cock and erupts into the world. Your skull rockets from that predatory cock, bouncing off the wall and clattering to the ground amidst an ankle-deep pool of cum."];
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

function wyrmTail(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.dex);
      return [attacker.description("The") + " lashes at you with his tail, dealing " + damage + " damage."];
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

function wyrmRoar(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.roars += 1;
      attacker.statBuffs.push(new StatBuff("str", 1.25));
      attacker.statBuffs.push(new StatBuff("con", 1.25));
      return [attacker.description("The") + " lets out an earsplitting roar. It looks even angrier now."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      },
      function(attacker, defender) {
        return attacker.flags.roars < 2;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.25 + attacker.flags.roars / 2; }
  };
}

function wyrmPounce(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "dex")) {
        attacker.flags.state = "grapple";
        defender.flags.grappled = true;
        return ["The wyrm dives out of sight, vanishing behind an outcropping of jagged rock. You cautiously approach, peeking around the corner. You see nothing - and then, suddenly, the beast pounces from behind, driving you to the ground!"];
      } else {
        return ["The wyrm leaps out of sight, vanishing behind a jagged outcropping of rock. You creep up and peer around the corner, seeing nothing. A scrabble of claws on rock draws your attention, and you manage to duck as the beast comes careening in, leaping too high and slamming into the wall instead! Sneaky bastard..."];
      }
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
    weight: function(attacker, defender) {
      return 2.5 - 1.25 * defender.healthPercentage();
    }
  };
}

function wyrmGrind(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.str / 3);
      defender.changeStamina(-35);
      return ["You squirm as the wyrm grinds his throbbing red shaft along your body, painting your chest and face with hot, musky fluids."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage(); }
  };
}

function wyrmOralVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "oral";
        attacker.flags.oralDepth = 1;
        defender.changeStamina(-25);
        return ["Gasping for breath, you can only watch as the wyrm's jaws splay wide - strands of drool lashing out like bolts of lightning - and force over your head."];
      } else {
        return ["The wyrm's jaws splay wide, lunging in and trying to wrap around your head, but you manage to punch the beast in the snout and force him to back off."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.oral > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {return (1 - 0.5 * defender.staminaPercentage()) * defender.prefs.vore.oral; }
  };
}

function wyrmOralSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.oralDepth += 1;
      if (attacker.flags.oralDepth == 4) {
        attacker.flags.state = "stomach";
        return ["The beast gulps one last time, pulling your whole body into his roiling guts."];
      } else if (attacker.flags.oralDepth == 3) {
        return ["Hot, slimy flesh smothers your legs as they're dragged down. Trapped and teased, smothered and squeezed - you're one swallow away from being sealed away for good."];
      } else if (attacker.flags.oralDepth == 2) {
        return ["A powerful swallow claims your belly and hips. Your head pops into the wyrm's burning-hot belly, shoved into the slimy, fleshy prison with ease."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}


function wyrmCockVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "cock";
        attacker.flags.cockDepth = 1;
        defender.changeStamina(-25);
        return ["A gasp escapes your lips as the wyrm's turgid cock thrusts forward, sealing over your head! The hot, slick flesh clenches tightly as the beast growls in pleasure, thrusting and humping on your flailing body."];
      } else {
        return ["The wyrm's hot shaft thrusts forward, briefly enveloping your head in musky flesh. It finds no purchase, though, and you manage to push yourself free."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.cock > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.cock; }
  };
}

function wyrmCockSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.cockDepth += 1;
      if (attacker.flags.cockDepth == 5) {
        attacker.flags.state = "balls";
        return ["A final clench of cock-flesh sucks you down into the wyrm's massive, sloshing balls."];
      } else if (attacker.flags.cockDepth == 4) {
        return ["The outside world is distant now - even your toes are enveloped, and your upper body is submerged in cum."];
      } else if (attacker.flags.cockDepth == 3) {
        return ["Your head is shoved deeper into a thick layer of the wyrm's seed, his powerful cock impossible to resist."];
      } else if (attacker.flags.cockDepth == 2) {
        return ["A powerful <i>glrkph</i> stuffs your head into the wyrm's balls - you're quite a bit larger than it, with your lower body still free...but it's not stopping the horny beast."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyrmCockIngest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.cockDepth = 5;
      attacker.flags.state = "balls";
      return ["Exhausted and weak, you can do little to resist as a long, smooth swallow sucks you all the way into the wyrm's swollen balls."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return defender.health <= 0 || defender.stamina <= 0;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyrmCockCrush(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str * attacker.flags.cockDepth);

      return ["The wyrm's cock throbs and clenches, crushing the life from your body!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.13; },
    gameover: function() { return "Crushed to death in the cock of " + attacker.description("a"); }
  };
}

function wyrmStomachDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 25);
      return ["The wyrm's swollen gut gurgles, swiftly melting you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested in the stomach of " + attacker.description("a"); }
  };
}

function wyrmBallsDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 25);
      return ["The wyrm's overstuffed balls churn, swiftly melting you down into dragon seed."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to seed and sprayed out by " + attacker.description("a"); }
  };
}

function wyrmOralStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to escape the wyrm's throat!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.oralDepth -= 1;
        if (defender.flags.oralDepth == 2) {
          return ["You grunt and shove, forcing your legs out of the beast's jaws."];
        } else if (defender.flags.oralDepth == 1) {
          return ["Your struggles bear fruit, pushing your hips and belly out into the cool mountain air."];
        } else if (defender.flags.oralDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to escape! Your eyes struggle to focus as your head slides from the wyrm's gullet, leaving you vulnerable for a moment - but the beast is no metter off than you, hacking and coughing as you rise to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "oral"; }
    ],
    priority: 1,
  };
}

function wyrmStomachStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyrm's guts!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "oral";
        defender.flags.oralDepth = 2;
        return ["You struggle and squirm, forcing yourself back into the wyrm's hot throat. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but it's of no use."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "stomach"; }
    ],
    priority: 1,
  };
}


function wyrmCockStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyrm's cock!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.cockDepth -= 1;
        if (defender.flags.cockDepth == 3) {
          return ["You summon up all your strength and push yourself back from the brink, choking on cum and struggling for your life."];
        } else if (defender.flags.cockDepth == 2) {
          return ["You shove yourself further back - still perilously deep in the wyrm's turgid cock, but now halfway free."];
        } else if (defender.flags.cockDepth == 1) {
          return ["A mighty shove leaves you with only your head ensnared in that hungry shaft. The wyrm growls and snarls, clearly upset at the thought of his prey escaping!"];
        } else if (defender.flags.cockDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to free yourself! A spray of musky precum lashes the rocks as your head pops loose. You rise up onto your foot, ready to continue the fight."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "cock"; }
    ],
    priority: 1,
  };
}

function wyrmBallStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyrm's balls!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "cock";
        defender.flags.cockDepth = 3;
        return ["You struggle and squirm, forcing yourself back into the wyrm's throbbing cock. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "balls"; }
    ],
    priority: 1,
  };
}

function MountainWyvern() {
  Creature.call(this, "Wyvern", 25, 15, 35);

  this.hasName = false;

  this.description = function(prefix) { return prefix + " wyvern"; };

  this.attacks = [];

  this.flags.state = "combat";
  this.flags.roars = 0;

  this.flags.cockDepth = 0;

  this.attacks.push(wyvernBite(this));
  this.attacks.push(wyvernTail(this));
  this.attacks.push(wyvernRoar(this));

  this.attacks.push(wyvernPounce(this));

  this.attacks.push(wyvernOralVore(this));
  this.attacks.push(wyvernUnbirth(this));
  this.attacks.push(wyvernBreastVore(this));

  this.attacks.push(wyvernOralSwallow(this));

  this.attacks.push(wyvernStomachDigest(this));

  this.attacks.push(wyvernBreastSwallow(this));
  this.attacks.push(wyvernBreastIngest(this));

  this.attacks.push(wyvernUnbirthSwallow(this));
  this.attacks.push(wyvernUnbirthCrush(this));

  this.attacks.push(wyvernWombDigest(this));

  this.playerAttacks = [];

  this.playerAttacks.push(punchAttack);
  this.playerAttacks.push(flankAttack);

  this.playerAttacks.push(wyvernOralStruggle);
  this.playerAttacks.push(wyvernStomachStruggle);
  this.playerAttacks.push(wyvernUnbirthStruggle);
  this.playerAttacks.push(wyvernWombStruggle);
  this.playerAttacks.push(wyvernBreastStruggle);

  this.playerAttacks.push(pass);
  this.playerAttacks.push(flee);

  this.startCombat = function(player) {
    return ["Your exploration is abruptly interrupted as you stumble into a female wyvern. She hisses and rears up, glistening slit framed by her scaly underbelly above and - most surprisingly - a pair of modestly-sized breasts below."];
  };

  this.finishCombat = function() {
    if (this.flags.state == "combat")
      return [this.description("The") + " knocks you to the ground. You bash your head on a rock and black out."];
    else if (this.flags.state == "unbirth")
      return ["You expire in the dragon's cooch, crushed to death by the wyvern's lust."];
    else if (this.flags.state == "breasts")
      return ["You fall limp in " + this.description("the") + "'s breast."];
    else if (this.flags.state == "womb")
      return ["You expire in the dragon's womb, dissolved by her juices."];
    else if (this.flags.state == "stomach")
      return ["You give one last heave...and digest."];
  };
}

function wyvernBite(attacker) {
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

function wyvernTail(attacker) {
  return {
    attackPlayer: function(defender){
      let damage = attack(attacker, defender, attacker.dex);
      return [attacker.description("The") + " lashes at you with her tail, dealing " + damage + " damage."];
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

function wyvernRoar(attacker) {
  return {
    attackPlayer: function(defender){
      attacker.flags.roars += 1;
      attacker.statBuffs.push(new StatBuff("str", 1.25));
      attacker.statBuffs.push(new StatBuff("con", 1.25));
      return [attacker.description("The") + " lets out an earsplitting roar. It looks even angrier now."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return !attacker.flags.grappled && !defender.flags.grappled;
      },
      function(attacker, defender) {
        return attacker.flags.roars < 2;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.25 + attacker.flags.roars / 2; }
  };
}

function wyvernPounce(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "dex")) {
        attacker.flags.state = "grapple";
        defender.flags.grappled = true;
        return ["The wyvern dives out of sight, vanishing behind an outcropping of jagged rock. You cautiously approach, peeking around the corner. You see nothing - and then, suddenly, the beast pounces from behind, driving you to the ground!"];
      } else {
        return ["The wyvern leaps out of sight, vanishing behind a jagged outcropping of rock. You creep up and peer around the corner, seeing nothing. A scrabble of claws on rock draws your attention, and you manage to duck as the beast comes careening in, leaping too high and slamming into the wall instead! Sneaky bastard..."];
      }
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
    weight: function(attacker, defender) {
      return 2.5 - 2 * defender.healthPercentage();
    }
  };
}

function wyvernOralVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "oral";
        attacker.flags.oralDepth = 1;
        defender.changeStamina(-25);
        return ["Gasping for breath, you can only watch as the wyvern's jaws splay wide - strands of drool lashing out like bolts of lightning - and force over your head."];
      } else {
        return ["The wyvern's jaws splay wide, lunging in and trying to wrap around your head, but you manage to punch the beast in the snout and force him to back off."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.oral > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) {return (1 - 0.5 * defender.staminaPercentage()) * defender.prefs.vore.oral; }
  };
}

function wyvernOralSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.oralDepth += 1;
      if (attacker.flags.oralDepth == 4) {
        attacker.flags.state = "stomach";
        return ["The greedy wyvern swallows hard, cramming your entire body into her overstuffed belly."];
      } else if (attacker.flags.oralDepth == 3) {
        return ["Deep growls thrum in the wyvern's throat as she takes in your legs."];
      } else if (attacker.flags.oralDepth == 2) {
        return ["Pulsing muscle drags you deeper, sucking your hips into the wyvern's throat as your upper body slides into her stomach."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernUnbirth(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "unbirth";
        attacker.flags.unbirthDepth = 1;
        defender.changeStamina(-25);
        return ["A lustful thrust from the wyvern shoves her hips down over your face. You gasp as it makes impact...and takes you in, shoving your head into her powerful snatch."];
      } else {
        return ["The wyvern growls and shoves her hips against your snout. Her glistening slit smears over your snout, glazing you in her juices."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.unbirth > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.unbirth; }
  };
}

function wyvernUnbirthSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.unbirthDepth += 1;
      if (attacker.flags.unbirthDepth == 5) {
        attacker.flags.state = "womb";
        attacker.flags.wombTurns = 0;
        return ["A drawn-out yowl of pleasure reaches your ears - you've been entirely consumed, stuffed into a hot, musky womb and drenched in digestive juices. You'd better escape soon..."];
      } else if (attacker.flags.unbirthDepth == 4) {
        return ["Muscular walls drag you deeper still. Your're nearly gone from the world."];
      } else if (attacker.flags.unbirthDepth == 3) {
        return ["The wyvern's cervix spreads around your belly, your legs left hanging from the overstuffed beast's nethers."];
      } else if (attacker.flags.unbirthDepth == 2) {
        return ["Deeper you slip, shoulders gliding into the wyvern's maternal prison."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "unbirth";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernUnbirthCrush(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str * attacker.flags.unbirthDepth);

      return ["The wyvern's cooch throbs and clenches, crushing the life from your body!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "unbirth";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.13; },
    gameover: function() { return "Crushed to death in the cooch of " + attacker.description("a"); }
  };
}

function wyvernStomachDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 25);
      return ["The wyvern's swollen gut gurgles, swiftly melting you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Digested in the stomach of " + attacker.description("a"); }
  };
}

function wyvernWombDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.wombTurns += 1;
      attack(attacker, defender, 20 * attacker.flags.wombTurns);
      return ["The wyvern's overstuffed womb churns, swiftly melting you down."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "womb";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to femcum and sprayed out by " + attacker.description("a"); }
  };
}

function wyvernBreastVore(attacker) {
  return {
    attackPlayer: function(defender){
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "breasts";
        attacker.flags.breastDepth = 1;
        defender.changeStamina(-25);
        return ["The wyvern grinds her heavy breasts over your pinned body...and a nipple spreads around your head like a rubber band."];
      } else {
        return ["The lustful wyvern forces her breasts into your face, smearing your snout in milk and marking you in faint musky scents."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grapple";
      },
      function(attacker, defender) {
        return defender.prefs.vore.breast > 0;
      },
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (2 - defender.staminaPercentage()) * defender.prefs.vore.breast; }
  };
}

function wyvernBreastSwallow(attacker) {
  return {
    attackPlayer: function(defender) {

      attack(attacker, defender, attacker.con / 4 * attacker.flags.breastDepth);

      attacker.flags.breastDepth += 1;
      if (attacker.flags.breastDepth >= 6) {
        return["Lost entirely within overstuffed breast, you can only whimper and squirm as it melts you down to creamy milk."];
      } else if (attacker.flags.breastDepth == 5) {
        return ["You're so very deep - and so very close to your demise. You cough and gag, choking on the wyvern's milk as she moans and splays out on the cave floor, leaking the creamy fluid and thrashing with pleasure."];
      } else if (attacker.flags.breastDepth == 4) {
        return ["Your ankles slip inside the wyvern's breast - she has you now. Your thrashes do little to dissuade her from taking you deeper still."];
      } else if (attacker.flags.breastDepth == 3) {
        return ["You're almost gone from the world, legs dangling from the wyvern's incredibly engorged breast. It stretches seemingly without limit as you're dragged in..."];
      } else if (attacker.flags.breastDepth == 2) {
        return ["<i>Shlllrrp-GLRK.</i> A powerful clench sucks in your entire torso, forcing a spurt of milk through your gritted teeth as your predator's breast swells to incredible size!"];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "breasts";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Melted down to milk and squeezed out by " + attacker.description("a"); }
  };
}

function wyvernBreastIngest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.breastDepth = 5;
      return ["Your strength has dwindled, and the wyvern knows. She moans and clenches, sucking you all the way into her milky breasts."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "breasts";
      },
      function(attacker, defender) {
        return defender.health <= attacker.str / 4 * attacker.flags.breastDepth;
      },
      function(attacker, defender) {
        return attacker.flags.breastDepth < 5;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  };
}

function wyvernOralStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to escape the wyvern's throat!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.oralDepth -= 1;
        if (defender.flags.oralDepth == 2) {
          return ["You grunt and shove, forcing your legs out of the beast's jaws."];
        } else if (defender.flags.oralDepth == 1) {
          return ["Your struggles bear fruit, pushing your hips and belly out into the cool mountain air."];
        } else if (defender.flags.oralDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to escape! Your eyes struggle to focus as your head slides from the wyvern's gullet, leaving you vulnerable for a moment - but the beast is no metter off than you, hacking and coughing as you rise to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "oral"; }
    ],
    priority: 1,
  };
}

function wyvernStomachStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyvern's guts!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "oral";
        defender.flags.oralDepth = 2;
        return ["You struggle and squirm, forcing yourself back into the wyvern's hot throat. He's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but it's of no use."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "stomach"; }
    ],
    priority: 1,
  };
}

function wyvernUnbirthStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyvern's cooch!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.unbirthDepth -= 1;
        if (defender.flags.unbirthDepth == 3) {
          return ["Your struggles pull you back from the very brink of doom...but you're still mostly within the wyvern, and still so very close to becoming hers."];
        } else if (defender.flags.unbirthDepth == 2) {
          return ["You push back, surging with vigor (and a desire to not become an orgasm). Your hips pops out from the wyvern's snatch!"];
        } else if (defender.flags.unbirthDepth == 1) {
          return ["You grit your teeth and pry yourself from those perilous depths, freeing all but your head."];
        } else if (defender.flags.unbirthDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["You manage to free yourself! Soaked in femjuice and dazed by the wyvern's constricting snatch, certainly, but very much alive.",newline,"For now."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "unbirth"; }
    ],
    priority: 1,
  };
}

function wyvernWombStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to free yourself from the wyvern's womb!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.flags.state = "unbirth";
        defender.flags.unbirthDepth = 3;
        return ["You struggle and squirm, forcing yourself back into the wyvern's throbbing snatch. She's not letting you go just yet..."];
      } else {
        attacker.changeStamina(-10);
        return ["You struggle, but to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "womb"; }
    ],
    priority: 1,
  };
}

function wyvernBreastStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself from the wyvern's breast!",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.flags.breastDepth -= 1;
        if (defender.flags.breastDepth == 4) {
          return ["Your struggle just enough to escape death, still utterly lost in the wyvern's sloshing breast."];
        } else if (defender.flags.breastDepth == 3) {
          return ["Your struggles bear fruit - your legs slip free, and you don't feel quite as...<i>doomed</i>."];
        } else if (defender.flags.breastDepth == 2) {
          return ["With a great heave, you shove your hips free. The wyvern's nipple clenches hard around your belly, holding you fast."];
        } else if (defender.flags.breastDepth == 1) {
          return ["Pushing blindly against slick, hot walls, you gradually extract your torso from the engorged beast's breast."];
        } else if (defender.flags.breastDepth == 0) {
          defender.flags.state = "combat";
          attacker.flags.grappled = false;
          return ["With a splatter of milk and a low gasp from the wyvern, you break free! You fall to the ground, panting and gasping as you struggle back to your feet."];
        }
      } else {
        attacker.changeStamina(-25);
        return ["You struggle, but it's of no use..."];
      }
    },
    requirements: [
      function(attacker, defender) { return defender.flags.state == "breasts"; },
      function(attacker, defender) { return defender.flags.breastDepth < 6; }
    ],
    priority: 1,
  };
}
