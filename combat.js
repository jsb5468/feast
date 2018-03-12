"use strict";

function attack(attacker, defender, baseDamage) {
  let damage = Math.round((Math.random() * 0.5 - 0.25 + 1) * baseDamage);
  defender.health -= damage;
  return damage;
}

function isNormal(entity) {
  return entity.grappled != true;
}

function isGrappled(entity) {
  return entity.grappled == true;
}

function punchAttack(attacker) {
  return {
    name: "Punch",
    desc: "Punch a nerd",
    attack: function(defender) {
      return "You punch the " + defender.description() + " for " + attack(attacker, defender, attacker.str) + " damage";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " punches you for " + attack(attacker, defender, attacker.str) + " damage";
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ]
  };
}

function flankAttack(attacker) {
  return {
    name: "Flank",
    desc: "Be sneaky",
    attack: function(defender) {
      return "You run around the " + defender.description() + " and attack for " + attack(attacker, defender, attacker.dex) + " damage";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " runs past you, then turns and hits you for " + attack(attacker, defender, attacker.str) + " damage";
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ]
  };
}

function grapple(attacker) {
  return {
    name: "Grapple",
    desc: "Try to grab your opponent",
    attack: function(defender) {
      let success = Math.random() < 0.5;
      if (success) {
        defender.grappled = true;
        return "You charge at the " + defender.description() + ", tackling them and knocking them to the ground.";
      } else {
        return "You charge at the " + defender.description() + ", but they dodge out of the way!";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5;
      if (success) {
        defender.grappled = true;
        return "The " + attacker.description() + " lunges at you, pinning you to the floor!";
      } else {
        return "The " + attacker.description() + " tries to tackle you, but you deftly avoid them.";
      }
    },
    requirements: [
      function(attacker, defender) { return isNormal(attacker) && isNormal(defender); }
    ]
  };
}

function grappleDevour(attacker) {
  return {
    name: "Devour",
    desc: "Try to consume your grappled opponent",
    attack: function(defender) {
      let success = Math.random() < 0.25 + (1 - defender.health / defender.maxHealth) * 0.75;
      if (success) {
        attacker.stomach.feed(defender);
        defender.grappled = false;
        changeMode("explore");
        return "You open your jaws wide, stuffing the " + defender.description() + "'s head into your gullet and greedily wolfing them down. Delicious.";
      } else {
        return "Your jaws open wide, but the " + defender.description() + " manages to avoid becoming " + attacker.species + " chow.";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5 && Math.random() < 0.5;
      if(success) {
        defender.grappled = false;
        changeMode("eaten");
        return "The " + attacker.description() + " forces your head into their sloppy jaws, devouring you despite your frantic struggles. Glp.";
      } else {
        return "The " + attacker.description() + " tries to swallow you down, but you manage to resist their hunger.";
      }
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ]
  };
}

function grappleRelease(attacker) {
  return {
    name: "Release",
    desc: "Release your opponent",
    attack: function(defender) {
      defender.grappled = false;
      return "You throw the " + defender.description() + " back, dealing " + attack(attacker, defender, attacker.str*1.5) + " damage";
    }, requirements: [
      function(attacker, defender) { return isNormal(attacker) && isGrappled(defender); }
    ]
  };
}

function grappledStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to break your opponent's pin",
    attack: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5;
      if (success) {
        attacker.grappled = false;
        return "You struggle and shove the " + defender.description() + " off of you.";
      } else {
        return "You struggle, but to no avail.";
      }
    },
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5 + (1 - defender.health / defender.maxHealth)*0.5 && Math.random() < 0.5;
      if (success) {
        attacker.grappled = false;
        return "Your prey shoves you back, breaking your grapple!";
      } else {
        return "Your prey squirms, but remains pinned.";
      }
    },
    requirements: [
      function(attacker, defender) { return isGrappled(attacker) && isNormal(defender); }
    ]
  };
}

function pass(attacker) {
  return {
    name: "Pass",
    desc: "You can't do anything!",
    attack: function(defender) {
      return "You do nothing.";
    },
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " does nothing.";
    }
  };
}

function devourPlayer(attacker) {
  return {
    name: "Devours YOU!",
    desc: "You won't see this",
    conditions: [
      function(prefs) { return prefs.player.prey; }
    ],
    requirements: [
      function(attacker, defender) { return attacker.leering == true; }
    ],
    attackPlayer: function(defender) {
      changeMode("eaten");
      return "The voracious " + attacker.description() + " pins you down and devours you in seconds.";
    }
  };
}

function leer(attacker) {
  return {
    name: "Leer",
    desc: "Leer at something",
    attackPlayer: function(defender) {
      attacker.leering = true;
      return "The " + attacker.description() + " leers at you.";
    },
    requirements: [
      function(attacker, defender) { return attacker.leering != true; }
    ]
  };
}

function poke(attacker) {
  return {
    name: "Poke",
    desc: "Poke a nerd",
    attackPlayer: function(defender) {
      return "The " + attacker.description() + " pokes you on the snout for " + attack(attacker, defender, 1e12) + " damage";
    }
  };
}



function digestPlayerStomach(predator,damage=20) {
  return {
    digest: function(player) {
      attack(predator, player, damage);
      return "The " + predator.description() + "'s stomach grinds over your body, swiftly digesting you.";
    }
  };
}
