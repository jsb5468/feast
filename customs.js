/* AEZNON GETA COMMISSION */

function Geta() {
  Creature.call(this, "Geta", 5, 15, 10);

  this.hasName = true;

  this.description = function() { return "Geta"; };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new getaShrink(this));
  this.attacks.push(new getaGrab(this));
  this.attacks.push(new getaTease(this));
  this.attacks.push(new getaSuckle(this));
  this.attacks.push(new getaSalivaSwallow(this));
  this.attacks.push(new getaSwallow(this));

  this.attacks.push(new getaStomp(this));
  this.attacks.push(new getaStompFinish(this));

  this.backupAttack = new pass(this);

  this.digests = [];

  this.digests.push(new digestPlayerStomach(this,50));
  this.struggles = [];

  this.struggles.push(new rub(this));

  this.prefs.scat = false;
  this.prefs.vore.anal = 0;
}

function getaShrink(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5;

      if (success) {
        defender.flags.shrunk = true;
        return [attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you find yourself shrunken down to no more than two inches tall."];
      } else {
        attacker.flags.shrunk = true;
        return [attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you see that he's shrunk himself!"];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isNormal(defender);
      }
    ],
    priority: 2
  };
}

function getaGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.flags.grappled = true;
      return [attacker.description() + " leans down and snatches you up, stuffing you into his maw."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.prey;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      },
    ],
    priority: 2
  };
}

function getaTease(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 25, 0);
      return [attacker.description() + " grinds you against the roof of his maw with his tongue."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSuckle(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 45, 0);
      return [attacker.description() + " shuts his jaws and suckles on you."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSalivaSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.stamina = Math.max(defender.stamina - 15, 0);
      return [attacker.description() + " swallows, draining the drool from his jaws - leaving you on the precipice of his gullet."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina > 0;
      }
    ],
    priority: 1
  };
}

function getaSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      changeMode("eaten");
      return [attacker.description() + " shuts his jaws and swallows, dragging you down into his tight throat and dumping you into a caustic stomach."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled == true && defender.stamina <= 0;
      }
    ],
    priority: 2
  };
}

function getaStomp(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex") || defender.stamina == 0;
      if (success) {
        defender.health = Math.max(-100, defender.health - 50 - Math.round(Math.random() * 25));
        defender.stamina = 0;
        return [attacker.description() + "'s paw comes crashing down on your little body, smashing you into the dirt."];
      } else {
        return ["You dive away as " + attacker.description() + "'s paw slams down, narrowly missing your little body."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      }
    ],
    priority: 2,
  };
}

function getaStompFinish(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.health = -100;
      return [attacker.description() + " looms over your stunned body. You can only watch as his toes flex, squeeze...and come down hard. The fox's paw crushes you like an insect, tearing you open and spilling your guts across the dusty trail. He grinds you a few times more for good measure, leaving a disfigured, broken mess in your place."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.shrunk == true && defender.flags.grappled != true;
      },
      function(attacker, defender) {
        return defender.stamina <= 0;
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 3,
  };
}

function GetaObj() {
  GameObject.call(this, "Geta");
  this.actions.push( {
    "name": "Approach Geta",
    "action": function() {
      startDialog(new GetaDialog());
    }
  });
}

function GetaDialog() {
  DialogNode.call(this);

  this.text = ["You approach the sandy-furred fox."];

  {
    let nodeFight = new DialogNode();
    this.addChoice("He certainly looks tasty...", nodeFight);

    nodeFight.text = ["You stalk up to your prey, but he sees you coming. You're going to have to fight!"];
    nodeFight.hooks.push( function(){
      currentFoe = new Geta();
      changeMode("combat");
    });
  }

  {
    let nodeIgnore = new DialogNode();
    this.addChoice("Leave him be", nodeIgnore);
  }
}

/* TRANCE */

function Trance() {
  Creature.call(this, "Trance", 25, 20, 25);

  this.hasName = true;

  this.description = function() { return "Trance"; };

  this.attacks.push(new punchAttack(this));
  this.attacks.push(new tranceKick(this));
  this.attacks.push(new tranceStomp(this));

  this.attacks.push(new tranceGrapple(this));
  this.attacks.push(new tranceGrappleDevour(this));
  this.attacks.push(new grappleSubdue(this));
  this.attacks.push(new tranceGrappleMaul(this));
  this.attacks.push(new tranceGrappleThroat(this));
  this.attacks.push(new tranceGrappleConsume(this));
  this.attacks.push(new tranceGrappleKill(this));

  this.attacks.push(new grappledReverse(this));
  this.attacks.push(new grappledDevour(this));

  this.backupAttack = new pass(this);

  this.digests = [];

  this.digests.push(new tranceDigest(this,50));
  this.digests.push(new tranceDigestCrush(this,75));
  this.digests.push(new tranceDigestInstakill(this,75));

  this.struggles = [];

  this.struggles.push(new struggleStay(this));
  this.struggles.push(submit(this));

  this.startCombat = function() { return ["You yelp and turn around as hot breath spills over your shoulder. A massive sergal has crept up on you...and he looks <i>hungry</i>"]; };
  this.finishDigest = function() { return ["The sergal's crushing guts reduce you to a pool of chyme..."]; };
  this.defeated = function() { changeMode("explore"); update(["The sergal winces and stumbles, grabbing a thick branch to steady himself...and snapping it in half like a twig. You decide discretion is the better part of valor and run while you can."]); };
  this.prefs.prey = false;
}

function tranceKick(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-25);
      defender.changeStamina(-50);
      return [attacker.description("The") + " leaps at you, lashing out with sharp-clawed paws and goring you for " + attack(attacker, defender, attacker.str * 3) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.vore.hard > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 0.5 * defender.prefs.vore.hard * defender.health / defender.maxHealth; }
  };
}

function tranceGrapple(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        defender.flags.grappled = true;
        return [attacker.description("The") + " lunges at you, pinning you to the floor!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return [attacker.description("The") + " tries to tackle you, but you deftly avoid them."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function tranceStomp(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-100);
      let result = [attacker.description("The") + " shoves you to the ground, planting one foot on your chest and crushing your head beneath the other, crippling you and dealing " + attack(attacker, defender, attacker.str * 5) + " damage"];
      if (defender.health <= 0) {
        result[0] += ". Your skull breaks open as his crushing weight snuffs you out like a candle, smearing your brain across the ground and splitting your jaw in half. <i>Ouch.</i>";
        defender.health = -100;
      }
      return result;
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.vore.hard > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return attacker.health * defender.prefs.vore.hard / attacker.maxHealth > 0.5 ? 0 : 3; },
    gameover: function() { return "Crushed under Trance's paw"; }
  };
}

function tranceGrappleDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return [attacker.description("The") + " tries to swallow you down, but you manage to resist their hunger."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (defender.prefs.vore.oral) * (3 - 2 * defender.health / defender.maxHealth); }
  };
}

function tranceGrappleMaul(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-25);
      defender.changeStamina(-50);
      return [attacker.description("The") + " digs into you with his claws and jaws, ripping you apart for " + attack(attacker, defender, attacker.str * 4) + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.hard * defender.health / defender.maxHealth; },
    gameover: function() { return "Mauled by Trance"; }
  };
}

function tranceGrappleConsume(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.health = -100;
      return ["The sergal sets about consuming your broken body, ripping you apart like deli meat as he sates his hunger. You are dead. Dead, dead, dead."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      },
      function(attacker, defender) {
        return defender.stamina <= 0 && defender.health <= 0;
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 3,
    weight: function(attacker, defender) { return defender.prefs.vore.hard; },
    gameover: function() { return "Ripped apart and devoured by Trance"; }
  };
}

function tranceGrappleKill(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.health = -100;
      return ["You're too tired to fight back as Trance's powerful hands grip your head, wrenching it to the side and snapping your neck like a twig - moments before his crushing jaws clamp down around your skull and crush it, killing you instantly."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      },
      function(attacker, defender) {
        return defender.stamina <= 0;
      }
    ],
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return defender.prefs.vore.hard; },
    gameover: function() { return "Ripped apart and devoured by Trance"; }
  };
}

function tranceGrappleThroat(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.health = 0;
        defender.stamina = 0;
        return ["Trance's pointed snout lunges for your throat, crushing jaws sinking in deep and ripping out your windpipe. He grins and swallows his mouthful of meat...and you fall limp."];
      } else {
        return ["The sergal lunges for your throat, but you manage to keep his terrifying jaws at bay."];
      }
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth > attacker.health / attacker.maxHealth ? 2 * defender.prefs.vore.hard : 0; },
    gameover: function() { return "Throat ripped out by Trance"; }
  };
}

function tranceDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        [predator.description("The") + "'s powerful stomach grinds over your body, swiftly digesting you."],
        ["The stomach walls clench and squeeze, smearing your squirming body in chyme and stinging acids."],
        ["Your body is crushed and churned, ground against fleshy walls to sate the sergal's hunger."]]);
    },
    priority: 1,
    weight: function() { return 1; }
  };
}

function tranceDigestCrush(predator, damage=75) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-125);
      return ["Trance's belly clenches, crushing your body between walls of ruthless muscle. Bones snap and tendons strain. The chyme floods your mouth."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 1,
    weight: function() { return defender.prefs.vore.hard / 0.5; }
  };
}

function tranceDigestInstakill(predator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["A ripple of muscle catches your head in just the right way, crushing your skull like a grape. Your lifeless body slumps in the caustic pit of slime and acid...and you melt away."];
    },
    conditions: [
      function(attacker, defender) {
        return defender.prefs.vore.hard > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.stamina <= 0 ? 5 : 0.1 * defender.prefs.vore.hard; }
  };
}

/* TALUTHUS */

function Taluthus() {
  Creature.call(this, "Taluthus", 40, 40, 60);

  this.hasName = true;

  this.description = function() { return "Taluthus"; };

  this.startCombat = function() { return ["You jump back as a hulking kitsune leaps out at you, his four massive tails swaying as he sizes you up."]; };
  this.finishDigest = function() {
    switch(this.flags.grappleType) {
      case "belly": return ["The kitsune's guts break you down..."];
      case "balls": return ["The kitsune melts you down into cum..."];
    }

    return ["The kitsune digests you..."];
  };
  this.defeated = function() { changeMode("explore"); moveToByName("Nature Trail"); update(["The kitsune growls and vanishes in a blinding flash of light. You pass out, eventually coming to in the woods."]); };

  this.prefs.prey = false;
  this.prefs.grapple = false;

  this.attacks.push(taluthusPunchAttack(this));

  this.attacks.push(taluthusGrab(this));
  this.attacks.push(taluthusGrabDevour(this));
  this.attacks.push(taluthusGrabCockVore(this));

  this.attacks.push(taluthusTailDevour(this));

  this.digests = [];

  this.digests.push(taluthusDigest(this));
  this.digests.push(taluthusTailSwallow(this));
  this.digests.push(taluthusCockSwallow(this));
  this.digests.push(taluthusBallsDigest(this));

  this.struggles = [];

  this.struggles.push(taluthusBallStruggle(this));
  this.struggles.push(taluthusBellyStruggle(this));
  this.struggles.push(taluthusTailStruggle(this));
  this.struggles.push(taluthusCockStruggle(this));
  this.struggles.push(submit(this));
}

function taluthusPunchAttack(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str);
      return ["Taluthus lunges, striking you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function taluthusGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.grappleType = "hands";
        defender.flags.grappled = true;
        return ["The kitsune snatches you up in his stocky grip, lifting you off the ground and cramming your head into his sloppy maw!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Taluthus tries to grab you, but you manage to avoid his grasp."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function taluthusGrabDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        attacker.flags.grappleType = "belly";
        changeMode("eaten");
        return ["Taluthus forces your head into his glowing throat, swallowing forcefully to pull you down to his predatory depths."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The kitsune forces your head into his gullet, but you manage to pry yourself free before peristalsis can claim you."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; },
      function(attacker, defender) { return attacker.flags.grappleType == "hands"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.oral; }
  };
}

function taluthusGrabCockVore(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = true;
        attacker.flags.grappleType = "cock";
        attacker.flags.cockSwallows = 4;
        changeMode("eaten");
        return ["Taluthus abruptly shoves you downward, enveloping your feet in his black shaft."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The kitsune tries to force you into his cock, but you keep your feet free."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; },
      function(attacker, defender) { return attacker.flags.grappleType == "hands"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.cock > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.cock; }
  };
}

function taluthusTailDevour(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.grappleType = "tail";
        attacker.flags.tailSwallows = 3;
        defender.flags.grappled = true;
        changeMode("eaten");
        return ["You yelp as one of the kitsune's massive tails snakes up, maw splitting wide open and taking you in with ease."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["You leap back as one of the kitsune's huge tails tries to make a meal of you, narrowly escaping the gaping maw."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return (7 - 6 * defender.health / defender.maxHealth) * defender.prefs.vore.tail; }
  };
}

function taluthusDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        ["Powerful stomach muscles grind at your body, swiftly digesting you."]
      ]);
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "belly"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Digested in the glowing gut of Taluthus"; }
  };
}

function taluthusBallsDigest(predator,damage=50) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      player.changeStamina(-50);
      return pickRandom([
        ["Thick, musky cum smears over your body, steadily breaking you down into seed."]
      ]);
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "balls"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Dissolved into cum by Taluthus"; }
  };
}

function taluthusTailSwallow(predator,damage=50) {
  return {
    digest: function(player) {
      let success = statHealthCheck(predator, player, "str");
      if (success) {
        predator.changeStamina(-5);
        player.changeStamina(-25);
        predator.flags.tailSwallows -= 1;

        if (predator.flags.tailSwallows == 0) {
          player.flags.grappled = false;
          predator.flags.grappleType = "belly";
          return ["A powerful swallow drags you into Taluthus' stomach. You curl up in the bioluminescent prison as it begins to <i>squeeze.</i>"];
        } else {
          return ["A powerful swallow pulls you deeper, further from the world and closer to the kitsune's greedy guts."];
        }
      } else {
        predator.changeStamina(-15);
        player.changeStamina(-25);
        return ["You brace yourself against the walls of the tail's throat, holding yourself in place as a wave of peristalsis rolls past."];
      }
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "tail"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function taluthusCockSwallow(predator) {
  return {
    digest: function(player) {
      let success = statHealthCheck(predator, player, "str");
      if (success) {
        predator.changeStamina(-5);
        player.changeStamina(-25);
        predator.flags.cockSwallows -= 1;

        if (predator.flags.cockSwallows == 0) {
          player.flags.grappled = false;
          predator.flags.grappleType = "balls";
          return ["A final clench drags you all the way into the kitsune's balls. Your body is roughly crammed into a lake of blue cum, squeezed on all sides by hot, musky flesh."];
        } else {
          return ["A powerful swallow pulls you deeper into Taluthus' shaft."];
        }
      } else {
        predator.changeStamina(-15);
        player.changeStamina(-25);
        return ["You brace yourself against the walls of the crushing shaft, holding yourself in place as he clenches."];
      }
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.grappleType == "cock"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function taluthusBellyStruggle(predator) {
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
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "belly";
      }
    ]
  };
}

function taluthusBallStruggle(predator) {
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
          "lines": ["You struggle and squirm, forcing Tal to let you out of his cock. He's not done with you yet..."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's balls, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "balls";
      }
    ]
  };
}

function taluthusTailStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      let position = "";

      switch(predator.flags.tailSwallows) {
        case 1:
          position = "You're one good swallow away from being dragged into Tal's stomach.";
          break;
        case 2:
          position = "Your bulge is perilously deep in the kitsune's tail, hanging close to the ground.";
          break;
        case 3:
          position = "You're halfway down the beast's tail, utterly smothered by heat and muscle.";
          break;
        case 4:
          position = "You're close to freedom, your paws hanging from that wretched tailmaw.";
          break;
      }

      if (escape) {
        predator.flags.tailSwallows += 1;

        if (predator.flags.tailSwallows > 4) {
          return {
            "escape": "stay",
            "lines": ["You struggle and squirm, forcing your way out from the kitsune's voracious tail."]
          };
        } else {
          return {
            "escape": "stuck",
            "lines": ["You struggle and squirm, inching closer to freedom.", newline, position]
          };
        }
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's tail, to no avail.", newline, position]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "tail" && predator.flags.tailSwallows > 0;
      }
    ]
  };
}

function taluthusCockStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = Math.random() > predator.health / predator.maxHealth && Math.random() < 0.33;
      if (player.health <= 0 || player.stamina <= 0) {
        escape = escape && Math.random() < 0.25;
      }

      let position = "";

      switch(predator.flags.cockSwallows) {
        case 1:
          position = "You're one clench away from being dragged into Tal's balls, utterly lost inside that throbbing cock.";
          break;
        case 2:
          position = "Your face is grinding against the tip of the sune's shaft.";
          break;
        case 3:
          position = "Your upper body is still hanging outside of Tal's cock.";
          break;
        case 4:
          position = "You're almost free - only your legs are trapped in that tight sune cock.";
          break;
      }

      if (escape) {
        predator.flags.tailSwallows += 1;

        if (predator.flags.tailSwallows > 4) {
          return {
            "escape": "stay",
            "lines": ["You struggle and squirm, forcing your way out from the kitsune's voracious shaft."]
          };
        } else {
          return {
            "escape": "stuck",
            "lines": ["You struggle and squirm, inching closer to freedom.", newline, position]
          };
        }
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within Tal's shaft, to no avail.", newline, position]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.grappleType == "cock" && predator.flags.cockSwallows > 0;
      }
    ]
  };
}

/* SELICIA */
function Selicia() {
  Creature.call(this, "Selicia", 25, 25, 25);

  this.hasName = true;
  this.mass = 400;

  this.description = function() { return "Selicia"; };

  this.startCombat = function() { return ["You stumble across a small cave. Stepping closer to investigate, you find yourself face-to-face with a glossy, slender dragon! Her ten-foot body is matched by a tail that's nearly as long, and she looms over you, devious blue eyes framed by curved horns."]; };
  this.finishDigest = function() {
    switch(this.flags.voreType) {
      case "stomach": return ["The dragoness's belly breaks you down..."];
      case "womb": return ["Your struggles slow, then stop, as your body is broken down to slick femcum by the dragoness's greedy womb. She quivers and groans with pent-up lust, grinding against the wall to set herself off - bringing forth a flood of hot, clingy nectar from her depths. The eruption sprays over the wall and ground, gushing in great spurts as she pants and thrusts with tail held high.",newline,"You were nothing but an orgasm..."];
    }


    return ["The dragoness digests you..."];
  };

  this.defeated = function() { player.cash += 500; changeMode("explore"); moveToByName("Nature Trail"); update(["The dragoness yelps as you land your last blow, turning tail and darting away into the forest. You duck into her cave, finding a whole <i>pile</i> of wallets. Score!"]); };

  this.prefs.scat = false;
  this.prefs.prey = false;

  this.attacks = [];

  this.attacks.push(seliciaBite(this));
  this.attacks.push(seliciaTailSlap(this));

  this.attacks.push(seliciaTailGrab(this));
  this.attacks.push(seliciaTailCrush(this));
  this.attacks.push(seliciaTailUnbirth(this));

  this.attacks.push(seliciaGrab(this));
  this.attacks.push(seliciaGrabSwallow(this));
  this.attacks.push(seliciaGrabUnbirth(this));

  this.attacks.push(grappledReverse(this));

  this.attacks.push(seliciaPin(this));
  this.attacks.push(seliciaPinUnbirth(this));
  this.attacks.push(seliciaPinGrind(this));

  this.digests = [];

  this.digests.push(seliciaStomachDigest(this));
  this.digests.push(seliciaUnbirthPull(this));
  this.digests.push(seliciaWombDigest(this));

  this.struggles = [];

  this.struggles.push(seliciaStomachStruggle(this));
  this.struggles.push(seliciaUnbirthStruggle(this));
  this.struggles.push(seliciaWombStruggle(this));
  this.struggles.push(submit(this));
}

function seliciaBite(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.str);
      return ["Selicia lunges, biting you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function seliciaTailSlap(attacker) {
  return {
    attackPlayer: function(defender) {
      let damage = attack(attacker, defender, attacker.dex * 1.5);
      return ["Selicia's tail sweeps around, slapping you for " + damage + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function seliciaTailGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-25);
        defender.flags.grappled = true;
        attacker.flags.voreType = "tail";
        return ["Selicia's thick tail whips around, curling around your body and hoisting you into the air!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia's tail whips at you. You deflect it with your arms, keeping it from coiling around your chest."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function seliciaTailCrush(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-15);
      defender.changeStamina(-50);
      attack(attacker, defender, attacker.str*2);
      defender.flags.grappled = true;
      return ["Selicia's thick tail crushes you, squeezing the air from your lungs."];
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "tail"; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Constricted by Selicia's tail"; }
  };
}

function seliciaTailUnbirth(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-25);
        attacker.flags.voreType = "unbirth";
        defender.flags.grappled = false;
        changeMode("eaten");
        return ["Your world spins as that thick dragon-tail delivers you head-first to a slick, greedy slit - cramming you in waist-deep and slowly withdrawing, leaving you behind as her latest toy."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia grinds your face against her slit, but you stay free of her greedy confines."];
      }
    },
    conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.unbirth > 0; }
    ],
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "tail"; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function seliciaGrab(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.voreType = "stomach";
        defender.flags.grappled = true;
        return ["The dragoness's jaws splay wide, glowing flesh entrancing you...and then enveloping you. She takes your upper body into her maw with ease."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia tries to snatch you up in her maw, but you manage to dive out of the way."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function seliciaGrabSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        defender.flags.grappled = false;
        changeMode("eaten");
        return ["Selicia tips her head back and swallows, dragging your body down her long throat and into her empty stomach."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The dragoness tilts back her head and swallows. You manage to resist the pull, hanging on with your legs dangling from her jaws."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.oral; }
  };
}

function seliciaGrabUnbirth(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-75);
      attacker.flags.voreType = "womb";
      changeMode("eaten");
      return ["Selicia rolls onto her back, curls up, and opens her jaws. You briefly think you're free...and then, your slide down into her nethers, dragged all the way into her womb by a massive <i>gulp</i> of greedy, overwheling muscle."];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.unbirth > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.unbirth; }
  };
}


function seliciaPin(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");
      if (success) {
        attacker.changeStamina(-15);
        defender.changeStamina(-50);
        attacker.flags.voreType = "unbirth";
        defender.flags.grappled = true;
        return ["The beast lunges, bowling you over. She leaps up, spinning about mid-air, and lands hard on your prone body, grinding her hips - and her glistening nethers - over your face."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-15);
        return ["Selicia leaps at you, forcing you to stumble backwards to avoid being crushed!"];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 7 - 6 * defender.health / defender.maxHealth; }
  };
}

function seliciaPinUnbirth(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-50);
        changeMode("eaten");
        return ["Selicia's hips slam down, forcing your head into her cooch. Rippling muscle yanks you in up to your hips, leaving your flailing legs hanging from her nethers."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["The dragoness grinds on your face, trying to force it into her snatch - but you manage to resist, for now."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "unbirth"; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.unbirth > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.unbirth; }
  };
}

function seliciaPinGrind(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, attacker.str*2);
      attacker.changeStamina(-10);
      defender.changeStamina(-25);
      return ["Selicia grinds over your pinned body, smearing you in her scent and wearing you out and dealing " + attack(attacker, defender, attacker.str*2) + "damage."];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
      function(attacker, defender) { return attacker.flags.voreType == "unbirth"; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Snuffed out by Selicia's lust"; }
  };
}


function seliciaUnbirthPull(predator) {
  return {
    digest: function(player) {
      let pull = Math.random() >= player.stamina / player.maxStamina;
      if (pull) {
        let success = statHealthCheck(predator, player, "str") || player.stamina <= 0;
        if (success) {
          predator.changeStamina(-5);
          player.changeStamina(-25);
          predator.flags.voreType = "womb";
          return ["A powerful swallow drags you into the slick, luminescent womb of Selicia. The walls clench and squeeze over your tender body, coaxing you to <i>melt.</i>"];
        } else {
          predator.changeStamina(-15);
          player.changeStamina(-25);
          return ["You grit your teeth and shove yourself back, resisting the powerful pull of the dragon's depths."];
        }
      } else {
        predator.changeStamina(-25);
        player.changeStamina(-150);
        return ["Selicia shoves her hips against the cave wall, grinding you into her nethers - then relaxing, and letting you slide back. Being used as her toy exhausts you..."];
      }

    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "unbirth"; }
    ],
    priority: 1,
    weight: function() { return 1; }
  };
}

function seliciaStomachDigest(predator) {
  return {
    digest: function(player) {
      attack(predator, player, 50);
      player.changeStamina(-20);
      return [pickRandom([
        ["Selicia's stomach clenches and grinds, dousing you in her acids."],
        ["Crass gurgles and groans overwhelm you, the gastric prison steadily wearing you down..."],
        ["You thump on the fleshy walls, eliciting a muffled <i>urrph</i> from your captor"],
        ["You squirm and writhe, distending the dragoness's sagging belly."],
        ["Your slimy confines squeeze tigether as you try to resist...and fail."]
      ])];
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "stomach"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Digested in the depths of Selicia"; }
  };
}

function seliciaWombDigest(predator) {
  return {
    digest: function(player) {
      attack(predator, player, 50);
      predator.changeStamina(-5);
      player.changeStamina(-25);

      let lines = [pickRandom([
        ["Selicia's womb-walls ripple and knead, softening your body bit-by-bit."],
        ["Your body bends at the whims of the dragoness's powerful nethers, mashed and squeezed with terrifying ease."],
        ["You groan and whimper, head spinning and skin tingling as Selicia breaks you down."],
        ["Everthing is getting heavy. You squirm and press at the walls of the dragoness's womb, causing her to moan in pleasure."],
        ["<i>Grrrrgle-glorp</i> - you're melting in the dragoness's womb."],
        ["Your prison is as loud as a full belly, grrrgle-gushes of femcum sloshing and spraying as you writhe."]
      ])];

      return lines;
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.voreType == "womb"; }
    ],
    priority: 1,
    weight: function() { return 1; },
    gameover: function() { return "Melted into femcum by Selicia"; }
  };
}

function seliciaStomachStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm out of Selicia's stomach. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = statHealthCheck(player, predator, "str");

      if (escape) {
        return {
          "escape": "stay",
          "lines": ["Your struggles force Selicia to hork you up, leaving you dazed and confused on the ground."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe, to no avail. The stomach walls squeeze tighter."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "stomach";
      }
    ]
  };
}

function seliciaWombStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to push yourself from the dragoness's womb. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = statHealthCheck(player, predator, "str");

      if (escape) {
        predator.flags.voreType = "unbirth";
        return {
          "escape": "stuck",
          "lines": ["Your struggles force the dragon to let you out of her womb...but you're still stuck in her snatch."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe within the velvety walls of Selicia's womb, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "womb";
      }
    ]
  };
}

function seliciaUnbirthStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to pull yourself free. More effective if you've hurt your predator.",
    struggle: function(player) {
      let escape = statHealthCheck(player, predator, "str");

      if (escape) {
        player.clear();
        predator.clear();
        return {
          "escape": "stay",
          "lines": ["With a mighty shove, you pop free of the dragoness's cooch - a loud, lewd <i>shllk</i> announcing your return to the world."]
        };
      } else {
        return {
          "escape": "stuck",
          "lines": ["You squirm and writhe, to no avail."]
        };
      }
    },
    requirements: [
      function(predator, player) {
        return predator.flags.voreType == "unbirth";
      }
    ]
  };
}

/* LALIM */

function LalimEncounter() {
  DialogNode.call(this);

  this.text = ["You stir from your slumber, groggy eyes blinking as your dimly-lit room comes into focus. Something feels wrong. You sit upright, freezing at a most peculiar sight - a twinkling, glittering star, hovering by your far wall. It's so pretty..."];

  let approach = new DialogNode();
  this.addChoice("Get closer to the light.", approach);
  approach.hooks.push(function() {
    startCombat(new Lalim());
  });

  {
    let light = new DialogNode();
    this.addChoice("Turn on the lights", light);
    light.text = ["You reach over to your nightstand, fumbling around for the switch to your lamp. You pause as your fingers grasp at the knob - that light is <i>so pretty</i>."];

    light.addChoice("Get closer to the light.", approach);

    {
      let lightReally = new DialogNode();
      light.addChoice("No, really, turn on the lights", lightReally);
      lightReally.text = ["You switch on the lamp. Light floods the room, revealing something most surreal. A jagged, shadowy rift has been torn in your far wall. Beyond is a vast void, speckled with stars and lit by a dim, all-pervading glow. And then, of course, there's the monster - a massive, furry beast with a maw full of fangs and a long, ornately-detailed body covered in jagged spirals of gold.",newline,"It hisses as the light floods its eyes, scuttling back and letting the portal snap shut.",newline,"So much for a restful night's sleep..."];
      lightReally.hooks.push(function() {
        advanceTimeTo(MORNING);
      });
    }
  }
}

function Lalim() {
  Creature.call(this, "Lalim", 25, 35, 25);

  this.hasName = true;

  this.description = function() { return "Lalim"; };

  this.startCombat = function() { return ["You crawl from your bed, slowly walking over to that pretty, glittery star. It's so shiny...so pefect...and framed by fangs?",newline,"You awaken from your trance with a start, face to face with a grinning maw full of teeth. A massive beast - half-emerged from a swirling portal of darkness - grips you in its forepaws and drags you into a plane of darkness!",newline,"You groan and struggle to stand up, lungs heaving and heart hammering. Alas, this is no dream - you're faced with a waking nightmare."]; };
  this.finishDigest = function() { return ["The slinky beast digests you..."];
  };

  this.defeated = function() { changeMode("explore"); update(["The beast yowls and recoils, leaving the portal back to your world unguarded. You take the opportunity and dive through; the rift winks shut behind you, leaving you alone. He's gone...for now."]); };

  this.attacks = [];

  this.attacks.push(lalimPin(this));

  this.attacks.push(lalimSwallow(this));

  this.attacks.push(lalimFeed(this));
  this.attacks.push(lalimFeedPull(this));
  this.attacks.push(lalimFeedDigest(this));

  this.backupAttack = new pass(this);

  this.digests = [];

  this.digests.push(lalimDigest(this));
  this.digests.push(lalimPull(this));

  this.struggles = [];

  this.struggles.push(lalimStruggle(this));
  this.struggles.push(submit(this));

  this.prefs.grapple = false;
  this.prefs.prey = false;
}

function lalimFeed(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.feeding = true;
      return ["Lalim darts back, abruptly ripping open a tear in his shadowy realm - jaws lunging in and snapping up some unseen victim, yanking them from the world of light into his gullet. His noisy swallows and gulps mix with muffled whimpers and cries as he gulps them down."];
    }, requirements: [
    function(attacker, defender) { return isNormal(attacker) && isNormal(defender); },
    function(attacker, defender) { return !attacker.flags.feeding && !attacker.flags.fed; }
  ],
  priority: 1,
  weight: function(attacker, defender) { return 0.5 + (5 - 5 * attacker.stamina / attacker.maxStamina); }
  };
}

function lalimFeedPull(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.fed = true;
      attacker.flags.feeding = false;
      return ["Lalim's prey sinks down his gullet, bulging out from his flexible stomach and swiftly plunging into his tail. Throbbing red light envelops the writhing meal, shrink-wrapped in Lalim's stretchy skin."];
    }, requirements: [
    function(attacker, defender) { return isNormal(attacker) && isNormal(defender); },
    function(attacker, defender) { return attacker.flags.feeding; }
  ],
  priority: 2,
  weight: function(attacker, defender) { return 1; }
  };
}

function lalimFeedDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.fed = false;
      attacker.str += 10;
      attacker.dex += 10;
      attacker.con += 10;
      attacker.health += 100;
      attacker.changeStamina(200);
      return ["You watch in horror as that writhing bulge falls limp, loses substance...and digests completely. The monster seems invigorated by its meal..."];
    }, requirements: [
    function(attacker, defender) { return isNormal(attacker) && isNormal(defender); },
    function(attacker, defender) { return attacker.flags.fed; }
  ],
  priority: 2,
  weight: function(attacker, defender) { return 1; }
  };
}

function lalimPin(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");

      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-10);
        defender.flags.grappled = true;
        return ["Lalim lunges at you, knocking you to the floor. Before you can even land, his head and neck whip past; you land roughly on his translucent neck, swiftly finding yourself bound up by his slinky body."];
      } else {
        attacker.changeStamina(-15);
        defender.changeStamina(-5);
        return ["The beast leaps at you; you barely manage to avoid his massive frame, tumbling and stumbling back to your feet as he hisses and snarls."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function lalimSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");
      if(success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-5);
        defender.flags.grappled = false;
        attacker.flags.stage = 1;
        changeMode("eaten");
        return ["Lalim's jaws descend upon your little body, scooping you up feet-first and dragging you down with a lazy <i>glrrk</i>. You scrabble helplessly at slick flesh, sinking through his see-through throat...then halting, leaving you imprisoned in a bulging throat-pouch as your predator's forelimbs squeeze and knead over you."];
      } else {
        attacker.changeStamina(-10);
        defender.changeStamina(-5);
        return ["The noodly beast squeezes and shoves, lashing at your lower body with his tongue, but you manage to keep your legs from being slurped into that ravenous maw."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); },
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 2 - defender.stamina / defender.maxStamina; }
  };
}

function lalimPull(predator) {
  return {
    digest: function(player) {
      let success = statHealthCheck(predator, player, "dex");
      if (success) {
        player.changeStamina(-5);
        predator.flags.stage += 1;

        if (predator.flags.stage == 2) {
          return ["The rippling walls convulse, sucking you deeper into Lalim's starry depths. The soothing squeezes of his clear throat-pouch turns to ha eavier pressure; the walls squeeze and churn, stronger than before...but still safe, for now."];
        } else if (predator.flags.stage == 3) {
          return ["A crushing wave of peristalsis yanks you from the dragon's belly, pulling you into the base of his tail. What was once surprisingly safe is now...unsettling. The slick walls grind and squeeze, and you could swear your skin is <i>tingling</i>"];
        } else if (predator.flags.stage == 4) {
          return ["Your arms and legs are pinned as Lalim drags you deeper. You feel as if you've been dragged down miles...and as your wriggling bulge glides down his tail, a pit of fear begins to form in your gut. The walls are resilient as iron bars, squeezing and clenching and <i>bearing down</i> with incredible force - and you have no where to go but deeper still..."];
        } else if (predator.flags.stage == 5) {
          return ["Another clench takes you to the very end - to the tip of Lalim's tail. It will all be over soon."];
        }
      } else {
        predator.changeStamina(-5);
        player.changeStamina(-5);
        return ["You brace yourself as a wave of peristalsis rolls past, holding your ground against the onslaught of flesh and muscle."];
      }
    },
    requirements: [
      function(attacker, defender) { return attacker.flags.stage < 5; }
    ],
    priority: 1,
    weight: function() { return player.stamina / player.maxStamina < (5 - predator.flags.stage) / 5 ? 3 : 0; }
  };
}

function lalimDigest(predator) {
  return {
    digest: function(player) {
      player.changeStamina(-3 * predator.flags.stage);
      if (predator.flags.stage == 1) {
        return ["Lalim's forepaws knead over your imprisoned body, squishing you about in a tube of soft flesh."];
      } else if (predator.flags.stage == 2) {
        return ["The beast's starry stomach walls undulate, quivering as he sprawls out to savor his meal."];
      } else if (predator.flags.stage == 3) {
        return ["You're feeling a little nervous. You struggle to press back on that rippling muscle that imprisons you."];
      } else if (predator.flags.stage == 4) {
        attack(predator, player, 15);
        return ["You feel yourself slowly melting - slowly fading away into the dragon's depths."];
      } else if (predator.flags.stage == 5) {
        attack(predator, player, 75);
        return ["Throbbing pain overwhelms your body as Lalim's tail crushes you."];
      }

    },
    priority: 1,
    weight: function() { return 1; }
  };
}

function lalimStruggle(predator) {
  return {
    name: "Struggle",
    desc: "Try to squirm free. Gets harder as you lose stamina. Don't get tired!",
    struggle: function(player) {

      let escape = false;

      switch(predator.flags.stage) {
        case 1:
          escape = Math.random() < 0.1 * (1 + player.stamina / player.maxStamina);
          if (escape) {
            player.clear();
            predator.clear();
            return {
              "escape": "stay",
              "lines": ["You struggle and squirm, forcing Lalim to hork you up."]
            };
          } else {
            line = "You're so close to freedom that you can taste it...and the beast denies you, gulping you back into his bulging throat";
          }
          break;
        case 2:
          escape = Math.random() < 0.35 * (1 + player.stamina / player.maxStamina);
          if (escape)
            line = "You push against slick flesh, forcing yourself back into Lalim's neck. You can see the portal to your dimly-lit bedroom again...and those kneading, squeezing paws.";
          else
            line = "You try to claw your way back up to the beast's throat...but a lazy ripple of stomach-muscle throws you back down, thumping you against the hard, shadowy ground under the beast's distended belly.";
          break;
        case 3:
          escape = Math.random() < 0.35 * (1 + player.stamina / player.maxStamina);
          if (escape)
            line = "It's hard to tell just how deep you are...but you're back in the comforting green glow, far from that dreadful tail.";
          else
            line = "The tail won't let you go - you squirm and writhe, to no avail.";
          break;
        case 4:
          escape = Math.random() < 0.2 * (1 + player.stamina / player.maxStamina);
          if (escape)
            line = "The tingling lessens as you force yourself into the base of Lalim's tail.";
          else
            line = "Your heart pounds as your struggles take you <i>nowhere</i>. Your body slowly digests in the ever-tightening tail.";
          break;
        case 5:
          escape = Math.random() < 0.1 * (1 + player.stamina / player.maxStamina);
          if (escape)
            line = "You drag yourself from certain doom, clawing your way out of the crushing, deadly tail-tip.";
          else
            line = "There is no hope of escape. You thrash and squirm, but Lalim's tail has you.";
          break;
        }

        if (escape) {
          predator.flags.stage -= 1;
        }

        return {
          "escape": "stuck",
          "lines": [line]
        };
    },
    requirements: [

    ]
  };
}

/* POOJAWA */

function PoojawaEncounter() {
  GameObject.call(this, "Poojawa");
  this.actions.push({
    name: "Poojawa",
    action: function() {
      startCombat(new Poojawa());
    }
  });
}

function Poojawa() {
  Creature.call(this, "Poojawa", 20, 40, 30);

  this.hasName = true;

  this.description = function() { return "Poojawa"; };

  this.attacks = [];

  this.attacks.push(poojawaBeckonWait(this));
  this.attacks.push(poojawaBeckonTease(this));
  this.attacks.push(poojawaBeckonStep(this));
  this.attacks.push(poojawaBeckonSaunter(this));

  this.attacks.push(poojawaBeckonCatch(this));
  this.attacks.push(poojawaBeckonCaught(this));
  this.attacks.push(poojawaBeckonTeased(this));

  this.attacks.push(poojawaCaughtLick(this));
  this.attacks.push(poojawaCaughtTailLick(this));
  this.attacks.push(poojawaCaughtGrind(this));

  //this.attacks.push(poojawaCaughtOral(this));
  //this.attacks.push(poojawaCaughtTail(this));
  this.attacks.push(poojawaCaughtUnbirth(this));

  this.attacks.push(poojawaUnbirthPull(this));
  this.attacks.push(poojawaUnbirthPush(this));
  this.attacks.push(poojawaUnbirthClench(this));
  this.attacks.push(poojawaUnbirthOrgasm(this));
  this.attacks.push(poojawaUnbirthLastPull(this));

  this.attacks.push(poojawaUnbirthedDigest(this));
  this.attacks.push(poojawaUnbirthedRoll(this));

  this.attacks.push(poojawaCaughtOral(this));

  this.attacks.push(poojawaOralPull(this));
  this.attacks.push(poojawaOralLastPull(this));

  this.attacks.push(poojawaCaughtTail(this));

  this.attacks.push(poojawaTailPull(this));
  this.attacks.push(poojawaTailLastPull(this));

  this.attacks.push(poojawaStomachDigest(this));

  this.backupAttack = new pass(this);

  this.playerAttacks = [];

  this.playerAttacks.push(poojawaPlayerBeckonForward);
  this.playerAttacks.push(poojawaPlayerBeckonStay);
  this.playerAttacks.push(poojawaPlayerBeckonBackward);
  this.playerAttacks.push(poojawaPlayerBeckonFlee);

  /*this.playerAttacks.push(poojawaPlayerCaughtOral);
  this.playerAttacks.push(poojawaPlayerCaughtTail);
  this.playerAttacks.push(poojawaPlayerCaughtUnbirth);
  this.playerAttacks.push(poojawaPlayerCaughtStruggle);*/

  //this.playerAttacks.push(poojawaPlayerUnbirthSubmit);
  //this.playerAttacks.push(poojawaPlayerUnbirthStruggle);

  this.digests = [];

  this.digests.push(new digestPlayerStomach(this,50));

  this.struggles = [];

  this.struggles.push(new rub(this));

  this.prefs.prey = false;

  this.consts = {};

  this.consts.caughtDist = 0;
  this.consts.startDist = 3;
  this.consts.escapeDist = 8;
  this.consts.maxTease = 5;

  this.flags.distance = this.consts.startDist;

  this.flags.state = "beckon";
  this.flags.tail = 0;
  this.flags.oral = 0;
  this.flags.unbirth = 1;
  this.flags.progress = 0;
  this.flags.arousal = 0;

  this.startCombat = function(player) {
    player.flags.teases = 0;
    return ["You gasp softly as a purple hand grips your shoulder - turning and stumbling back a few paces to see that sultry sabersune watching you with devious eyes. She's up to no good..."];
  };

  this.finishCombat = function() {
    switch(this.flags.state) {
      case "unbirthed":
        return ["Poojawa moans and pants, both hands <i>squeeeezing</i> her swiftly flattening lower belly...and then she reaches orgasm. She yowls, hackles standing on end - dropping onto her knees and steadying her self with one hand as her other plunges into her gushing slit.",
        newline,
        "Your former body gushes out as a torrent of slick, musky femcum, every grind of fingers coaxing out a greater spurt than the last. As impressive as her display is, most of your remains never see the light of the day - absorbed into her womb, just another victim of her endless lust..."];
      case "stomach":
        return ["Poojawa coos and grinds on her gut with both hands. You're barely conscious, lost among her sultry depths...and as she rolls over, the pressure becomes too much to bear.",
        newline,
        "You collapse, melting away and swiftly becoming a part of the sabresune's body."];
    }
  };

  this.status = function(player) {
    switch(this.flags.state) {
      case "beckon":
        if (this.flags.distance == 1) {
          return ["The sabersune is one step away from taking you - alluring scents and sensual body so very close to yours..."];
        } else if (this.flags.distance <= 3) {
          return ["You're uncomfortably close to your predator."];
        } else if (this.flags.distance <= 5) {
          return ["There's a little room between you and Poojawa now...but not enough."];
        } else {
          return ["You're almost far enough to make a break for it. Surely she couldn't catch you now...right?"];
        }
        break;
      case "caught":
        return [];
      case "unbirth":
        if (this.flags.progress == 1) {
          return ["Your head is stuffed into Poojawa's snatch. The velvety walls want the rest of you inside her...and they want you <i>now.</i>"];
        } else if (this.flags.progress == 2 ) {
          return ["She's claimed your upper body. Your head is grinding against the entrance to her hot, humid womb."];
        } else {
          return ["Only your shins and feet hang from the gorgeous predator's slit. Your head and chest are being gripped and squeezed by the sabersune's womb."];
        }
        break;
      case "unbirthed":
        return [];
      case "oral":
        if (this.flags.progress == 1) {
          return ["Poojawa's devious eyes are locked with yours...and your legs are vanishing down her gullet. She's <i>hungry.</i>"];
        } else if (this.flags.progress == 2 ) {
          return ["Ravenous hunger has taken all but your head - teasing licks working over your face as your body is gripped by the predator's tight body."];
        } else {
          return ["Everything is tight, hot, overwhelming. She has you - head in her throat, legs already in her gut. Not much left to do but...give in."];
        }
        break;
      case "tail":
        if (this.flags.progress == 1) {
          return ["Your limbs and face are clearly visible in the sabersune's bulging tail."];
        } else if (this.flags.progress == 2 ) {
          return ["You're deeper now...deeper in that hot, tight tail. Muscles squeeze and squelch over your delicious body."];
        } else {
          return ["You're just a bulge now, hanging low in a greedy tail and about to plunge into Poojawa's belly."];
        }
        break;
      case "stomach":
        return [];
    }
  };
}

/* PLAYER MOVES */

function poojawaPlayerBeckonForward(player) {
  return {
    name: "Step forward",
    desc: "Get a little closer...",
    attack: function(poojawa) {
      poojawa.flags.distance -= 1;
      return ["You swallow nervously, stepping closer to the sultry sabersune."];
    },
    requirements: [
      function(player, poojawa) {
        return poojawa.flags.state == "beckon";
      }
    ]
  };
}

function poojawaPlayerBeckonStay(player) {
  return {
    name: "Stand still",
    desc: "Just wait...",
    attack: function(poojawa) {
      return ["Your knees quiver as a blush washes over your face - and you stand still."];
    },
    requirements: [
      function(player, poojawa) {
        return poojawa.flags.state == "beckon";
      }
    ]
  };
}

function poojawaPlayerBeckonBackward(player) {
  return {
    name: "Step backward",
    desc: "Get a little further...",
    attack: function(poojawa) {
      if (player.flags.teases > 0) {
        if (Math.random() * poojawa.consts.maxTease < player.flags.teases) {
          return ["A lump forms in your throat - you're helpless, transfixed by the predatory sabersune's teases and threats."];
        }
      }
      poojawa.flags.distance += 1;
      return ["Wary for any surprises from the sabersune, you take a nervous step back."];
    },
    requirements: [
      function(player, poojawa) {
        return poojawa.flags.state == "beckon";
      }
    ]
  };
}

function poojawaPlayerBeckonFlee(player) {
  return {
    name: "Run!",
    desc: "Flee - if you've made enough distance, at least...",
    attack: function(poojawa) {
      if (poojawa.flags.distance <= 1) {
        poojawa.flags.state = "caught";
        poojawa.flags.distance = 0;
        return ["In your panic, you turn to run. Poojawa clicks her tongue and grabs you by the arm, then pulls you in close..."];
      } else if (poojawa.flags.distance <= 3) {
        poojawa.flags.state = "caught";
        poojawa.flags.distance = 0;
        return ["You turn and run...and a few seconds later, the sabersune is on top of you, effortlessly tackling you and pinning you to the floor, then pulling you aside for some...<i>private time.</i>"];
      } else if (poojawa.flags.distance <= 5) {
        poojawa.flags.state = "caught";
        poojawa.flags.distance = 0;
        return ["You turn and flee. It's a valiant effort - you manage to grab the door handle - but not enough. Poojawa grips you from behind and drags you away, whispering a <i>tsk-tsk</i> of disapproval into your ear as you're pulled out of sight."];
      } else {
        if (Math.random() < 0.25 + (poojawa.flags.distance - 5) * 0.2) {
          return ["You turn tail and run, throwing open the door and barely escaping from the sabersune's clutches. She could easily chase you down, but she just leans outside, heavy tails propping the door open - and gives you a wink."];
        } else {
          return ["You turn and flee. It's a valiant effort - you manage to grab the door handle - but not enough. Poojawa grips you from behind and drags you away, whispering a <i>tsk-tsk</i> of disapproval into your ear as you're pulled out of sight."];
        }
      }
    },
    requirements: [
      function(player, poojawa) {
        return poojawa.flags.state == "beckon";
      }
    ]
  };
}

/* POOJAWA MOVES */

function poojawaBeckonWait(poojawa) {
  return {
    attackPlayer: function(player) {
      return ["The sune does nothing - she just watches and waits, those pretty pink eyes locked with yours..."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaBeckonTease(poojawa) {
  return {
    attackPlayer: function(player) {
      player.flags.teases += 1;
      return ["Poojawa's jaws open part-way, flashing her slick fangs as she lets her tongue roll over her fingers ever-so-smoothly. \"Sweetie,\" she coos, \"you <i>know</i> you want this~\""];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.flags.teases >= poojawa.consts.maxTease ? 0 : 1 - player.flags.teases / 10; }
  };
}

function poojawaBeckonStep(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.distance -= 1;
      return ["Poojawa takes a step toward you, tails swaying behind her."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaBeckonSaunter(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.distance -= 3;
      return ["The sabersune takes a few lazy steps toward you, each one eroding several of your own anxious footsteps..."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      },
      function(poojawa, player) {
        return poojawa.flags.distance > 5;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return poojawa.flags.distance / 6; }
  };
}

function poojawaBeckonCatch(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "caught";
      return ["One last step, and the sabersune is on top of you. She grips you with both hands, pulling you in close and stuffing your muzzle into her faintly-scented bosom. You squirm and struggle, but can do little as she pulls you away from the noisy bar and into a secluded alcove.",
      newline,
      "\"Shhh, darling,\" she murmurs, clicking her tongue at your muffled protests. \"Be good.\""];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      },
      function(poojawa, player) {
        return poojawa.flags.distance == 1;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaBeckonCaught(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "caught";
      return ["You stumble forwards and into Poojawa's grasp. She grips you with both hands, pulling you in close and stuffing your muzzle into her faintly-scented bosom. You squirm and struggle, but can do little as she pulls you away from the noisy bar and into a secluded alcove.",
      newline,
      "\"Shhh, darling,\" she murmurs, clicking her tongue at your muffled protests. \"Be good.\""];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      },
      function(poojawa, player) {
        return poojawa.flags.distance <= 0;
      }
    ],
    priority: 2,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaBeckonTeased(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "caught";
      return ["You freeze up, completely transfixed by the beautiful sabersune. Her approach is slow, agonizing even - and there's nothing you can do about it. She grips you with both hands, pulling you in close and stuffing your muzzle into her faintly-scented bosom. You squirm and struggle, but can do little as she pulls you away from the noisy bar and into a secluded alcove.",
      newline,
      "\"Shhh, darling,\" she murmurs, clicking her tongue at your muffled protests. \"Be good.\""];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "beckon";
      },
      function(poojawa, player) {
        return poojawa.flags.distance > 0;
      },
      function(poojawa, player) {
        return player.flags.teases >= poojawa.consts.maxTease;
      }
    ],
    priority: 2,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaCaughtLick(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.oral += 1;
      return ["The sabersune's velvety tongue drags along your thigh, her dripping slit held firmly in your face as she tastes you over."];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.oral * (1 + poojawa.flags.oral / 3); }
  };
}

function poojawaCaughtTailLick(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.tail += 1;
      return ["Slick flesh envelops your arms as two of the sabersune's tails get a little nibby."];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.tail > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.tail * (1 + poojawa.flags.tail / 3); }
  };
}

function poojawaCaughtGrind(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.unbirth += 1;
      return ["Poojawa's hips grind down over your face, smearing you in her musky scents and sending a shiver up her spine."];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.unbirth > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.unbirth * (1 + poojawa.flags.unbirth / 3); }
  };
}

function poojawaCaughtUnbirth(poojawa) {
  return {
    attackPlayer: function(player) {
      changeBackground("eaten");
      poojawa.flags.progress = 1;
      poojawa.flags.state = "unbirth";
      return ["The sune giggles, then slams her hips down over your head. A loud, wet <i>shllllck</i> fills your ears as you're stuffed into Poojawa's nethers, a spurt of nectar splattering over the wall from the sheer <i>strength</i> of that thrust.",
      newline,
      "Your nostrils flood with her scent; you can see only dim, red depths."];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.unbirth > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      },
      function(poojawa, player) {
        return poojawa.flags.unbirth > 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.unbirth * (0.5 + Math.pow(poojawa.flags.unbirth,2) / 6); }
  };
}

function poojawaUnbirthPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.arousal += 1;
      poojawa.flags.progress += 1;
      return ["A powerful ripple of muscle drags you deeper."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirth";
      },
      function(poojawa, player) {
        return poojawa.flags.progress < 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaUnbirthClench(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.arousal += 2;
      return ["Muscular walls clench and crush in on you, grinding hard and eliciting a gasp from your captor."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirth";
      },
      function(poojawa, player) {
        return poojawa.flags.progress > 1;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaUnbirthPush(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.arousal += 4;
      poojawa.flags.progress -= 1;
      return ["Poojawa grips your ankles, yanking you part-way free and moaning in pleasure. You must feel so good..."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirth";
      },
      function(poojawa, player) {
        return poojawa.flags.progress > 1;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 0.5; }
  };
}

function poojawaUnbirthOrgasm(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "unbirthed";
      return ["Poojawa yowls in pleasure as she cums...and yanks you inside with a single, massive <i>glrpk</i> of unstoppable muscle. She flops onto her belly, panting and groaning as she rides down from that pleasurable high."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirth";
      },
      function(poojawa, player) {
        return poojawa.flags.arousal >= 10;
      }
    ],
    priority: 2,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaUnbirthLastPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "unbirthed";
      return ["One last lustful squeeze, and your body slips into the sabersune's womb. She coos and sits up, slender fingers playing over her bulging lower belly as she begins to toy with you..."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirth";
      },
      function(poojawa, player) {
        return poojawa.flags.progress >= 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaUnbirthedDigest(poojawa) {
  return {
    attackPlayer: function(player) {
      player.health -= 50;
      if (player.health > 0) {
        return pickRandom([["Poojawa murmurs with pleasure as she feels you squirm in her womb. Your body slowly softens as she takes you..."],
        ["Hot, slick flesh grinds over your body. Every clench elicits another coo of lust from your predator."],
        ]);
      }
      else {
        return pickRandom([["The heat is overwhelming - powerful lust making short work of your tender body as you start to melt into femcum."],
        ["You can't find the energy to struggle as Poojawa grinds your softening bulge against a barstool...breaking you down at a frightening pace."]
        ]);
      }
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirthed";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; },
    gameover: function() { return "Melted into femcum in Poojawa's depths"; }
  };
}

function poojawaUnbirthedRoll(poojawa) {
  return {
    attackPlayer: function(player) {
      player.health -= 75;
      return pickRandom([["Poojawa rolls over, hips thrusting at the hardwood floor and grinding you into her sensitive womb-walls."],
      ["The sabersune shifts onto her side, then flumps onto her belly. The force balls you up even tighter..."],
      ]);
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "unbirthed";
      },
      function(poojawa, player) {
        return player.health > 0;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 0.33; },
    gameover: function() { return "Melted into femcum in Poojawa's depths"; }
  };
}

function poojawaCaughtOral(poojawa) {
  return {
    attackPlayer: function(player) {
      changeBackground("eaten");
      poojawa.flags.progress = 1;
      poojawa.flags.state = "oral";
      return ["Poojawa's teasing licks and sultry breaths stop - a heartbeat before you feel your ankles slipping past her thick saber-fangs. A light gulp and a lazy <i>swallow</i> precede a disorienting slide as she drags you in front of her, her throat bulging with your thrashing lower legs!"];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.oral > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      },
      function(poojawa, player) {
        return poojawa.flags.oral > 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.oral * (0.5 +  Math.pow(poojawa.flags.oral,2) / 6); }
  };
}

function poojawaOralPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.progress += 1;
      return ["A powerful ripple of muscle drags you down the sabersune's throat."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "oral";
      },
      function(poojawa, player) {
        return poojawa.flags.progress < 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaOralLastPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "stomach";
      return ["A final swallow stuffs you into Poojawa's gurgling guts. Rippling muscle grips at your slimy body."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "oral";
      },
      function(poojawa, player) {
        return poojawa.flags.progress >= 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaCaughtTail(poojawa) {
  return {
    attackPlayer: function(player) {
      changeBackground("eaten");
      poojawa.flags.progress = 1;
      poojawa.flags.state = "tail";
      return ["Your vision goes dark, upper body smothered in flesh as one of Poojawa's ravenous tails takes you in. Your squirms do little; you are food.",
      newline,
      "A powerful gulp yanks you in deep, leaving your wriggling toes hanging from that heavy tail."];
    },
    conditions: [
      function(poojawa, player) {
        return player.prefs.vore.tail > 0;
      }
    ],
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "caught";
      },
      function(poojawa, player) {
        return poojawa.flags.tail > 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return player.prefs.vore.tail * (0.5 +  Math.pow(poojawa.flags.tail,2) / 6); }
  };
}

function poojawaTailPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.progress += 1;
      return ["A powerful ripple of muscle drags you deeper into the sabersune's tail."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "tail";
      },
      function(poojawa, player) {
        return poojawa.flags.progress < 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaTailLastPull(poojawa) {
  return {
    attackPlayer: function(player) {
      poojawa.flags.state = "stomach";
      return ["A final swallow pulls you past the sabersune's hips and into her powerful stomach...stuffing you into a tight embrace of slick, slimy muscle."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "tail";
      },
      function(poojawa, player) {
        return poojawa.flags.progress >= 3;
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}

function poojawaStomachDigest(poojawa) {
  return {
    attackPlayer: function(player) {
      player.health -= 50;
      return ["Poojawa rubs her gut as you squirm within. You're already turning soft..."];
    },
    requirements: [
      function(poojawa, player) {
        return poojawa.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(poojawa, player) { return 1; }
  };
}
