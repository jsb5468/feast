function Deno() {
  Creature.call(this, "Deno", 35, 20, 45);

  this.hasName = true;

  this.description = function() { return "Deno"; };

  this.flags.state = "combat";

  this.flags.arousal = 0;

  this.flags.cock = {};

  this.flags.cock.depth = 0;

  this.flags.grab = {};

  this.arousal = function(amount) {
    this.flags.arousal += amount;
    this.flags.arousal = Math.max(100,this.flags.arousal);
    this.flags.arousal = Math.min(0,this.flags.arousal);
  };

  this.status = function(player) {
    return ["Deno arousal: " + this.flags.arousal];
  };

  this.attacks = [];

  let attacker = this;

  // grab during combat
  this.attacks.push({
    // grab the player in combat
    attackPlayer: function(defender) {
      attacker.flags.state = "grab";
      attacker.flags.grab.struggles = 0;
      attacker.flags.grab.submits = 0;
      return ["Deno grab"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // grab hold
  this.attacks.push({
    attackPlayer: function(defender) {
      return ["Deno hold"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grab";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // grinding
  this.attacks.push({
    attackPlayer: function(defender) {
      return ["Deno grind"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grind";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  /** PLAYER ATTACKS **/

  this.playerAttacks = [];

  // Normal punch move
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Punch",
      desc: "Punch a nerd",
      attack: function(defender) {

        return ["You punch " + defender.description("the") + " for " + attack(attacker, defender, attacker.str) + " damage"];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "combat";
        }
      ]
    };
  });

  // Normal pass move
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Pass",
      desc: "Do nothing",
      attack: function(defender) {
        return ["You do nothing"];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "combat";
        }
      ]
    };
  });

  // Grab struggle
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle under the dragon!",
      attack: function(defender) {
        if (statHealthCheck(attacker, defender, "str")) {
          defender.flags.state = "combat";
          return ["You struggle out from beneath the massive beast!"];
        } else {
          defender.flags.grab.struggles++;
          defender.arousal((defender.flags.grab.struggles > 1 ? 20 : 10));
          if (defender.flags.grab.struggles == 1) {
            return [
              "You struggle, but it's useless. The dragon is too heavy.",
              newline,
              "\"Oooh,\" rumbles Deno, \"a fighter, are you? This will be fun...\""
            ];
          } else {
            return [
              "Your continued struggles are..useless.",
              newline,
              "\"Keep struggling,\" rumbles the dragon, \"I'm enjoying this.\""
            ];
          }
        }
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "grab";
        }
      ]
    };
  });

  // Grab submit
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Submit",
      desc: "Just lie there.",
      attack: function(defender) {
        defender.flags.grab.submits++;
        defender.arousal(-5);
        if (defender.flags.grab.submits == 1) {
          return [
            "You lie still, putting up no resistance to the overpowering beast.",
            newline,
            "\"<i>Oh, you're not very fun</i>,\" sneers the dragon."
          ];
        } else if (defender.flags.grab.submits == 2) {
          return [
            "The dragon seems exasperated by your submission..",
            newline,
            "\"You won't even struggle a <i>little?</i>,\" he growls."
          ];
        } else if (defender.flags.grab.submits == 3) {
          defender.flags.state = "grind";
          return [
            "Deno abruptly flops over you, crushing you into the coarse, gritty ground and beginning to thrust his hips into your smothered body!"
          ];
        }
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "grab";
        }
      ]
    };
  });
}
