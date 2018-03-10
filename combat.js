"use strict";

function attack(attacker, defender, baseDamage) {
  let damage = Math.round((Math.random() * 0.5 - 0.25 + 1) * baseDamage);
  defender.health -= damage;
  return damage;
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
    }
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
    }
  };
}
