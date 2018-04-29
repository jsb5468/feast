function DenoDemo() {
  GameObject.call(this, "Deno Demo");
  this.actions.push({
    "name": "Deno Fight",
    "action": function() {
      startCombat(new Deno());
    }
  });
}
function Deno() {
  Creature.call(this, "Deno", 35, 20, 45);

  this.hasName = true;

  this.description = function() { return "Deno"; };

  this.flags.state = "combat";

  this.flags.arousal = 0;

  this.flags.cock = {};

  this.flags.grab = {};

  this.arousal = 0;

  this.addArousal = function(amount) {
    this.arousal += amount;
    this.arousal = Math.min(100,this.arousal);
    this.arousal = Math.max(0,this.arousal);
  };

  this.status = function(player) {
    let result = ["Deno arousal: " + this.arousal,newline];

    if (this.flags.state == "cock") {
      result = result.concat("Cock depth: " + this.flags.cock.depth);
    }

    return result;
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
      attacker.addArousal(15);

      return ["Deno grind"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grind";
      },
      function(attacker, defender) {
        return attacker.arousal < 70;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // begin cock vore
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "cock";
      attacker.flags.cock.depth = 0;
      return ["Deno cock vore start"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grab" ||
        attacker.flags.state == "grind";
      },
      function(attacker, defender) {
        return attacker.arousal >= 70;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // first stage cock grind
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(2);

      return ["Deno cock grind"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // first stage cock stroke
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(4);

      return ["Deno cock stroke"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // first stage cock concentrate
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(-8);
      attacker.flags.cock.depth++;

      return ["Deno cock concentrate"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
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
          defender.addArousal((defender.flags.grab.struggles > 1 ? 20 : 10));
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
        defender.addArousal(-5);
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
