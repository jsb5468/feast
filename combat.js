"use strict";

function attack(attacker, defender, baseDamage) {
  let damage = Math.round((Math.random() * 0.5 - 0.25 + 1) * baseDamage);
  defender.health -= damage;
  return damage;
}

function isNormal(entity) {
  return entity.flags.grappled != true && entity.flags.shrunk != true;
}

function isNormalSize(entity) {
  return entity.flags.shrunk != true;
}

function isGrappled(entity) {
  return entity.flags.grappled == true;
}

function doComp(attackStat, defendStat) {
  return Math.random() * attackStat > Math.random() * defendStat;
}

function statCheck(attacker, defender, stat) {
  return doComp(attacker[stat], defender[stat]);
}

function statHealthCheck(attacker, defender, stat) {
  let attackerPercent = 0.5 + 0.5 * attacker.health / attacker.maxHealth;
  let defenderPercent = 0.5 + 0.5 * defender.health / defender.maxHealth;

  if (attacker.stamina <= 0)
    attackerPercent /= 2;
  if (defender.stamina <= 0)
    defenderPercent /= 2;

  return doComp(attacker[stat] * attackerPercent, defender[stat] * defenderPercent);
}

function punchAttack(attacker) {
  return {
    name: "Punch",
    desc: "Punch a nerd",
    attack: function(defender) {

      return ["You punch " + defender.description("the") + " for " + attack(attacker, defender, attacker.str) + " damage"];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " punches you for " + attack(attacker, defender, attacker.str) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function flankAttack(attacker) {
  return {
    name: "Flank",
    desc: "Be sneaky",
    attack: function(defender) {
      return ["You run around " + defender.description("the") + " and attack for " + attack(attacker, defender, attacker.dex) + " damage"];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " runs past you, then turns and hits you for " + attack(attacker, defender, attacker.str) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function grapple(attacker, weightFactor = 1) {
  return {
    name: "Grapple",
    desc: "Try to grab your opponent",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-20);
        defender.changeStamina(-20);
        defender.flags.grappled = true;
        return ["You charge at " + defender.description("the") + ", tackling them and knocking them to the ground."];
      } else {
        attacker.changeStamina(-20);
        return ["You charge at " + defender.description("the") + ", but they dodge out of the way!"];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-20);
        defender.changeStamina(-20);
        defender.flags.grappled = true;
        return [attacker.description("The") + " lunges at you, pinning you to the floor!"];
      } else {
        return [attacker.description("The") + " tries to tackle you, but you deftly avoid them."];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); },
      function(attacker, defender) { return defender.prefs.grapple; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return weightFactor - weightFactor * defender.health / defender.maxHealth; }
  };
}

function grappleSubdue(attacker) {
  return {
    name: "Subdue",
    desc: "Try to subdue your opponent",
    attack: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-30);
      return ["You beat on " + defender.description("the") + " for " + attack(attacker, defender, attacker.str * 2) + " damage."];
    },
    attackPlayer: function(defender) {
      attacker.changeStamina(-10);
      defender.changeStamina(-30);
      return [attacker.description("The") + " beats you for " + attack(attacker, defender, attacker.str * 2) + " damage"];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && isGrappled(defender);
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.health / defender.maxHealth; }
  };
}

function grappleDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappled opponent",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.stomach.feed(defender);
        defender.flags.grappled = false;
        changeMode("explore");
        attacker.cash += defender.cash;
        return ["You open your jaws wide, stuffing " + defender.description("the") + "'s head into your gullet and greedily wolfing them down. Delicious.", newline, "You hack up their wallet with $" + defender.cash + " inside a moment later. Nice!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your jaws open wide, but " + defender.description("the") + " manages to avoid becoming " + attacker.species + " chow."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp."];
      } else {
        return [attacker.description("The") + " tries to swallow you down, but you manage to resist their hunger."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 - defender.health / defender.maxHealth; }
  };
}

function grappledDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappling opponent",
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if(success) {
        defender.flags.grappled = false;
        changeMode("eaten");
        return [attacker.description("The") + " breaks your pin and crams your upper body into their maw, swallowing you down in seconds."];
      } else {
        attacker.changeStamina(-10);
        return [attacker.description("The") + " thrashes at you in an attempt to devour you, but you avoid their jaws."];
      }
    }, requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormal(defender) && attacker.flags.shrunk != true; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
  };
}

function grappleAnalVore(attacker) {
  return {
    name: "Anal Vore",
    desc: "Try to shove your opponent up your ass.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.bowels.feed(defender);
        defender.flags.grappled = false;
        attacker.cash += defender.cash;
        changeMode("explore");
        return ["You shove " + defender.description("the") + " between your cheeks. Their head slips into your ass with a wet <i>shlk</i>, and the rest of their body follows suit. You moan and gasp, working them deeper and deeper.", newline, "You notice their wallet with $" + defender.cash + " lying on the ground. Score!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your grasp and shove " + defender.description("the") + ", but they manage to avoid becoming " + attacker.species + " chow."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true ; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.anal > 0; },
      function(attacker, defender) { return attacker.prefs.pred.anal; }
    ],
    priority: 1,
  };
}

function grappleCockVore(attacker) {
  return {
    name: "Cock Vore",
    desc: "Try to shove your opponent down your shaft.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.balls.feed(defender);
        defender.flags.grappled = false;
        attacker.cash += defender.cash;
        changeMode("explore");
        return ["You gasp with pleasure as you shove " + defender.description("the") + "'s head into your throbbing shaft, quickly pulling them down into your churning balls.", newline, "You notice their wallet with $" + defender.cash + " lying on the ground. Score!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your grasp and shove " + defender.description("the") + ", but they manage to avoid becoming " + attacker.species + " chow."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true ; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.cock > 0; },
      function(attacker, defender) { return attacker.prefs.pred.cock; }
    ],
    priority: 1,
  };
}

function grappleUnbirth(attacker) {
  return {
    name: "Unbirth",
    desc: "Try to shove your opponent into your snatch.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.womb.feed(defender);
        defender.flags.grappled = false;
        attacker.cash += defender.cash;
        changeMode("explore");
        return [defender.description("The") + " is powerless to resist as you stuff them head-first into your dripping sex. Ripples of pleasure roll up your spine as rhythmic clenches pull them deeper and deeper, eventually imprisoning your prey into your hot, tight womb.", newline, "You notice their wallet with $" + defender.cash + " lying on the ground. Score!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your grasp and shove " + defender.description("the") + ", but they manage to avoid becoming a " + attacker.species + " toy."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true ; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.unbirth > 0; },
      function(attacker, defender) { return attacker.prefs.pred.unbirth; }
    ],
    priority: 1,
  };
}

function grappleBreastVore(attacker) {
  return {
    name: "Breast Vore",
    desc: "Try to shove your opponent into your breasts.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-10);
        defender.changeStamina(-25);
        attacker.breasts.feed(defender);
        defender.flags.grappled = false;
        attacker.cash += defender.cash;
        changeMode("explore");
        return ["You grin and ram " + defender.description("the") + " against your bare chest, enveloping their head in your greedy breast! Before they can recover from the surprise, you swiftly stuff the rest of their squirming body inside.", newline, "You notice their wallet with $" + defender.cash + " lying on the ground. Score!"];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-10);
        return ["Your grasp and shove " + defender.description("the") + ", but they manage to avoid becoming " + attacker.species + " chow."];
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender) && defender.flags.shrunk != true ; }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.breast > 0; },
      function(attacker, defender) { return attacker.prefs.pred.breast; }
    ],
    priority: 1,
  };
}

function grappleRelease(attacker) {
  return {
    name: "Release",
    desc: "Release your opponent",
    attack: function(defender) {
      defender.flags.grappled = false;
        defender.changeStamina(-15);
      return ["You throw " + defender.description("the") + " back, dealing " + attack(attacker, defender, attacker.str*1.5) + " damage"];
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ],
    priority: 1,
  };
}

function grappledStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to break your opponent's pin",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-10);
        attacker.flags.grappled = false;
        return ["You struggle and shove " + defender.description("the") + " off of you."];
      } else {
        attacker.changeStamina(-10);
        defender.changeStamina(-5);
        return ["You struggle, but to no avail."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-10);
        attacker.flags.grappled = false;
        return ["Your prey shoves you back, breaking your grapple!"];
      } else {
        attacker.changeStamina(-10);
        defender.changeStamina(-5);
        return ["Your prey squirms, but remains pinned."];
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormalSize(attacker) && isNormal(defender); }
    ],
    priority: 1,
  };
}

function grappledReverse(attacker) {
  return {
    name: "Reversal",
    desc: "Try to pin your grappler. Less likely to work than struggling.",
    attack: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-15);
        attacker.flags.grappled = false;
        defender.flags.grappled = true;
        return ["You surprise " + defender.description("the") + " with a burst of strength, flipping them over and pinning them."];
      } else {
        attacker.changeStamina(-15);
        return ["You try to throw your opponent off of you, but fail."];
      }
    },
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "str");
      if (success) {
        attacker.changeStamina(-5);
        defender.changeStamina(-15);
        attacker.flags.grappled = false;
        defender.flags.grappled = true;
        return ["Your prey suddenly grabs hold and flips you over, pinning you!"];
      } else {
        attacker.changeStamina(-15);
        return ["Your prey tries to grab at you, but you keep them under  control."];
      }
    },
    conditions: [
      function(attacker, defender) { return defender.flags.grapple; }
    ],
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormalSize(attacker) && isNormal(defender); },
      function(attacker, defender) { return attacker.flags.grappled; }
    ],
    priority: 1,
  };
}

function shrunkGrapple(attacker) {
  return {
    name: "Grab",
    desc: "Grab this fun-sized snack",
    attack: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex");
      if (success) {
        defender.changeStamina(-25);
        defender.flags.grappled = true;
        return ["You snatch up " + defender.description("the")];
      } else {
        return ["You try to grab " + defender.description("the") + ", but they elude your grasp."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled != true && defender.flags.shrunk == true;
      }
    ],
    priority: 2
  };
}

function shrunkSwallow(attacker) {
  return {
    name: "Swallow",
    desc: "Swallow your prey",
    attack: function(defender) {
      defender.changeStamina(-50);
      changeMode("explore");
      attacker.stomach.feed(defender);
      return ["With a light swallow, " + defender.description("the") + " is dragged down to your sloppy guts."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled == true && defender.flags.shrunk == true;
      }
    ], conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 2
  };
}

function shrunkStomp(attacker) {
  return {
    name: "Stomp",
    desc: "Stomp on your shrunken prey",
    attack: function(defender) {
      let success = statCheck(attacker, defender, "dex") || statCheck(attacker, defender, "dex") || defender.stamina == 0;
      defender.stamina = 0;
      defender.health = Math.max(0, defender.health - 50);
      return ["Your paw comes crashing down on " + defender.description("the") + ", burying them under your heavy toes and pinning them down hard."];
    },
    requirements: [
      function(attacker, defender) {
        return isNormal(attacker) && defender.flags.grappled != true && defender.flags.shrunk == true;
      }
    ]
  };
}

function flee(attacker) {
  return {
    name: "Flee",
    desc: "Try to run away",
    attack: function(defender) {
      let success = statCheck(attacker, defender, "dex");
      if (success) {
        attacker.changeStamina(-25);
        attacker.clear();
        changeMode("explore");
        return ["You successfully run away."];
      } else {
        attacker.changeStamina(-25);
        defender.changeStamina(-25);
        return ["You can't escape!"];
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && !attacker.isGrappling; }
    ]
  };
}

function pass(attacker) {
  return {
    name: "Pass",
    desc: "You can't do anything!",
    attack: function(defender) {
      return ["You do nothing."];
    },
    attackPlayer: function(defender) {
      return [attacker.description("The") + " does nothing."];
    },
    priority: 0,
  };
}

function devourPlayer(attacker) {
  return {
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      attacker.flags.voreType = "oral";
      changeMode("eaten");
      return ["The voracious " + attacker.description() + " pins you down, his slimy maw spreading wide and engulfing your upper body with ease. He swallows and shoves you deeper, cramming your succulent frame into churning, crushing depths in seconds. A lazy, drawn-out <i>belch</i> escapes his gullet, his hunger briefly sated...and your existence now in inescapable peril."];
    }, conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.oral > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.oral; }
  };
}

function devourPlayerAnal(attacker) {
  return {
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      attacker.flags.voreType = "anal";
      changeMode("eaten");
      return ["Fen grabs you and shoves you against the wall, turning around and slamming his ass against your face. Your entire head slips into his bowels with a wet <i>shlllrp</i>; there he holds you for a long minute, clenching and squeezing on his latest toy.",newline,"After what seems an eternity, his depths begin to pull...and within seconds, you're gone, dragged up his ass and imprisoned in his intestines. He moans softly, panting and curling his toes in delight."];
    }, conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.anal > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.anal;}
  };
}

function devourPlayerSoul(attacker) {
  return {
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      attacker.flags.voreType = "oral-soul";
      changeMode("eaten");
      return [
        "Fen's gaze locks with yours, and you freeze up like a deer in headlights. A brief pulse of amber light washes through them...and he rips out your soul, sucking your essence out from your gaping mouth with terrifying ease. You watch it flow forth from your own eyes for several seconds before you're pulled out entirely, leaving your mind in a helpless, wispy cloud.",
        newline,
        "You pour into the crux's jaws like water, crammed into his throat and devoured in an instant. The rippling walls contain you as easily as they would any other prey, and before long you're plunged into a roiling hellscape of acid and slime."
      ];
    }, conditions: [
      function(attacker, defender) { return defender.prefs.prey; },
      function(attacker, defender) { return defender.prefs.vore.soul > 0; }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.soul;}
  };
}

function leer(attacker) {
  return {
    name: "Leer",
    desc: "Leer at something",
    attackPlayer: function(defender) {
      attacker.leering = true;
      defender.changeStamina(-100);
      return [attacker.description("The") + " leers at you."];
    },
    requirements: [
      function(attacker, defender) { return attacker.leering != true && attacker.flags.grappled != true; }
    ],
    priority: 1,
  };
}

function poke(attacker) {
  return {
    name: "Poke",
    desc: "Poke a nerd",
    attackPlayer: function(defender) {
      return [attacker.description("The") + " pokes you on the snout for " + attack(attacker, defender, 1e12) + " damage"];
    },
    priority: 1,
  };
}

function digestPlayerStomach(predator,damage=20) {
  return {
    digest: function(player) {
      player.changeStamina(-25);
      attack(predator, player, damage);
      return [predator.description("The") + "'s stomach grinds over your body, swiftly digesting you."];
    },
    priority: 1,
    gameover: function() { return "Digested by " + predator.description("a"); }
  };
}

function instakillPlayerStomach(predator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["The stomach walls churn, clench, and swiftly crush you into nothingness."];
    },
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.voreType == "oral";
      }
    ],
    gameover: function() { return "Crushed by Fen's stomach"; }
  };
}

function instakillPlayerStomachSoul(predator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["Your soul catches alight in the horrific depths of the crux's stomach, breaking up and melting in seconds. You're gone..."];
    },
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.voreType == "oral-soul";
      }
    ],
    gameover: function() { return "Soul dissolved by Fen's stomach"; }
  };
}

function instakillPlayerBowels(predator) {
  return {
    digest: function(player) {
      player.health = -100;
      return ["Fen's intestines clench, and clench and <i>clench</i> - and in seconds, you're gone, just another victim of the beast's ravenous body."];
    },
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.voreType == "anal";
      }
    ],
    gameover: function() { return "Absorbed into Fen's bowels"; }
  };
}

function fenPlayerBowelsSoul(predator) {
  return {
    digest: function(player) {
      predator.flags.voreType = "oral-soul";
      return ["Fen's crushing bowels obliterate your body in seconds, breaking you like a bug underfoot and ripping out your soul. Your dazed, helpless essence is drawn up into his stomach..."];
    },
    priority: 1,
    weight: function(attacker, defender) { return defender.prefs.vore.soul; },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.voreType == "anal";
      },
      function(attacker, defender) {
        return defender.prefs.vore.soul > 0;
      }
    ],
    gameover: function() { return "Absorbed into Fen's bowels"; }
  };
}
