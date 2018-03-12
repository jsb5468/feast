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
  }
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
