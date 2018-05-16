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

  this.flags.balls = {};

  this.flags.finisher = 0;

  this.flags.walk = 0;

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
      attacker.flags.cock.struggles = 0;
      attacker.flags.cock.rubs = 0;
      attacker.flags.cock.submits = 0;

      if (attacker.flags.state == "grab") {
        attacker.flags.state = "cock";
        attacker.flags.cock.depth = 0;
        return ["Deno cock vore start"];
      } else if (attacker.flags.state == "maw") {
        attacker.flags.state = "cock";
        attacker.flags.cock.depth = 3;
        return ["Deno cock vore start - in halfway!"];
      }
      else if (attacker.flags.state == "grind") {
        attacker.flags.state = "cock";
        attacker.flags.cock.depth = 7;
        return ["Deno cock vore start - in deep!"];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "grab" ||
        attacker.flags.state == "grind" ||
        attacker.flags.state == "maw";
      },
      function(attacker, defender) {
        return attacker.arousal >= 70;
      }
    ],
    priority: 2,
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
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth <= 7;
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
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth <= 7;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + attacker.flags.cock.rubs; }
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
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth <= 7;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1 + attacker.flags.cock.submits; }
  });

  // second stage cock grind
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(2);

      return ["Deno cock grind deep"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth > 7;
      },
      function(attacker, defender) {
        return attacker.flags.cock.last == "rub" ||
        attacker.flags.cock.last == "submit";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return attacker.flags.cock.last == "rub" ? 2 : 1; }
  });

  // second stage cock struggle response
  this.attacks.push({
    attackPlayer: function(defender) {
      if (attacker.flags.cock.struggles >= 3) {
        attacker.flags.cock.struggles = 0;
        attacker.flags.cock.depth++;
        return ["Deno grabs and massages you down."];
      } else if (attacker.flags.cock.struggles >= 2) {
        return ["Deno tenses and focuses."];
      } else {
        return ["Deno shivers."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth > 7;
      },
      function(attacker, defender) {
        return attacker.flags.cock.last == "struggle";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // second stage cock concentrate
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(-8);
      attacker.flags.cock.depth++;

      return ["Deno cock concentrate deep"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth > 7;
      },
      function(attacker, defender) {
        return attacker.flags.cock.last == "rub" ||
        attacker.flags.cock.last == "submit";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return attacker.flags.cock.last == "submit" ? 2 : 1; }
  });


  // pull into balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "balls-relax";

      return ["Deno pulls you into his balls."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.flags.cock.depth >= 14;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // rest in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(-10);
      attack(attacker, defender, attacker.arousal / 5);

      return ["Deno relaxes, letting you stew in his balls."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls-relax";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // end rest
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "balls";
      attacker.addArousal(-10);
      attack(attacker, defender, attacker.arousal / 5);

      return ["Deno seems done relaxing..."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls-relax";
      },
      function(attacker, defender) {
        return attacker.arousal <= 10;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // concentrate in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(-10);
      attack(attacker, defender, attacker.arousal / 5);

      return ["Deno concentrates."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // stroke in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(10);
      attack(attacker, defender, attacker.arousal / 5);

      return ["Deno strokes."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      },
      function(attacker, defender) {
        return attacker.arousal < 70;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // stroke up to 60
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      attack(attacker, defender, attacker.arousal / 5);

      if (attacker.arousal >= 60) {
        attacker.flags.balls.focus = "";
      }

      return ["Deno strokes!"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      },
      function(attacker, defender) {
        return attacker.flags.balls.focus == "stroke";
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // grind in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(10);
      attack(attacker, defender, attacker.arousal / 5);

      return ["Deno grinds."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      },
      function(attacker, defender) {
        return attacker.arousal < 70;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // grind up to 60
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      attack(attacker, defender, attacker.arousal / 5);

      if (attacker.arousal >= 60) {
        attacker.flags.balls.focus = "";
      }

      return ["Deno grinds against the ground up to 60."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      },
      function(attacker, defender) {
        return attacker.flags.balls.focus == "grind";
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // tense in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      attack(attacker, defender, attacker.arousal / 5);
      return ["Deno tenses up."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // walk
  this.attacks.push({
    attackPlayer: function(defender) {
      attack(attacker, defender, attacker.arousal / 15);
      ++attacker.flags.walk;
        attacker.addArousal(-10);
      return ["Deno walks."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "walking";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // finish walk
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "mounted";
      return ["Deno stops his walk."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "walking";
      },
      function(attacker, defender) {
        return attacker.flags.walk >= 20;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // mount thrust 0
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      return ["Deno grinds"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal < 20;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount thrust 1
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      return ["Deno thrusts"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 20 && attacker.flags.arousal < 40;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount thrust 2
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      return ["Deno thrusts harder"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 40 && attacker.flags.arousal < 60;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount thrust 3
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(5);
      return ["Deno thrusts very hard"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 60 && attacker.flags.arousal < 80;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount concentrate
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.arousal -= 10;
      return ["Deno pauses and concentrates"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 80 && attacker.flags.arousal < 100;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount orgasm
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "mounted";
      return ["Deno orgasms."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "mounted";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 100;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount post-orgasm crush
  this.attacks.push({
    attackPlayer: function(defender) {
      attack(attacker, defender, 33);
      return ["You struggle in the tight chamber."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stuffed";
      },
      function(attacker, defender) {
        return attacker.flags.arousal >= 100;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });


  // mount fatal orgasm
  this.attacks.push({
    attackPlayer: function(defender) {
      defender.health = -100;
      return ["You melt and shoot out of Deno."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stuffed";
      },
      function(attacker, defender) {
        return defender.flags.health <= 0;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });


  // finish in balls
  this.attacks.push({
    attackPlayer: function(defender) {
      ++attacker.flags.finisher;

      if (attacker.flags.finisher == 3) {
        defender.health = -100;
        return ["Deno finishes you off"];
      } else {
        return ["Deno is finishing you off: " + attacker.flags.finisher];
      }

    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "balls";
      },
      function(attacker, defender) {
        return defender.health <= 0;
      }
    ],
    priority: 3,
    weight: function(attacker, defender) { return 1; }
  });


  // cock release
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(-100);

      attacker.flags.state = "combat";

      attacker.flags.cock.depth++;

      return ["Deno cock orgasm"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "cock";
      },
      function(attacker, defender) {
        return attacker.arousal >= 100;
      }
    ],
    priority: 3,
    weight: function(attacker, defender) { return 1; }
  });


  // vortex oral vore
  this.attacks.push({
    attackPlayer: function(defender) {
      if (statHealthCheck(attacker, defender, "str")) {
        attacker.flags.state = "stomach";
        return ["Deno vortex: Deno wins, swallowed."];
      } else {
        attacker.flags.state = "maw";
        return ["Deno vortex: Deno loses, in maw."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "combat";
      },
      function(attacker, defender) {
        return defender.prefs.vore.oral > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // grind in stomach
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.addArousal(10);
      return ["Deno grinds in stomach."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // cough up from stomach
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "maw";
      return ["Deno coughs up."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      },
      function(attacker, defender) {
        return attacker.arousal >= 70;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  });

  // chew in maw
  this.attacks.push({
    attackPlayer: function(defender) {
      attack(attacker, defender, attacker.str);
      return ["Deno chews."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "maw";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  });

  // swallow in maw
  this.attacks.push({
    attackPlayer: function(defender) {
      attacker.flags.state = "stomach";
      return ["Deno swallows."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "maw";
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

  // Cock vore, struggle
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle in Deno's throbbing shaft!",
      attack: function(defender) {
        defender.addArousal(2);
        defender.flags.cock.last = "struggle";
        if (defender.flags.cock.depth > 7)
          defender.flags.cock.struggles++;
        else
          defender.flags.cock.struggles = 0;
        if (statHealthCheck(attacker, defender, "str")) {
          defender.flags.cock.depth--;
          return ["You struggle in Deno's shaft."];
        } else {
          defender.flags.cock.depth++;
          return ["You slip deeper into Deno's shaft."];
        }
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "cock";
        }
      ]
    };
  });

  // Cock vore, rub
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rub",
      desc: "Rub the clenching walls.",
      attack: function(defender) {
        defender.addArousal(5);
        defender.flags.cock.depth++;
        defender.flags.cock.rubs++;
        defender.flags.cock.last = "rub";
        return ["You rub at the walls of Deno's shaft as it tugs you deeper."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "cock";
        }
      ]
    };
  });

  // Cock vore, submit
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Submit",
      desc: "Surrender to the dragon's greedy shaft.",
      attack: function(defender) {
        defender.flags.cock.depth++;
        defender.flags.cock.submits++;
        defender.flags.cock.last = "submit";
        return ["You fall limp as Deno's shaft tugs you deeper."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "cock";
        }
      ]
    };
  });

  // Struggle in balls while resting
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle in Deno's throbbing balls!",
      attack: function(defender) {
        defender.addArousal(5);
        if (statHealthCheck(attacker, defender, "str") && statHealthCheck(attacker, defender, "str")) {
          defender.flags.state = "cock";
          defender.flags.cock.depth = 13;
          defender.flags.cock.struggles = 0;
          defender.flags.cock.rubs = 0;
          defender.flags.cock.submits = 0;
          return ["Your struggles propel you back into the dragon's shaft!"];
        } else {
          return ["You struggle against the walls..without much effect."];
        }

      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls-relax";
        }
      ]
    };
  });

  // Rub in balls while resting
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rub",
      desc: "Rub the clenching walls.",
      attack: function(defender) {
        defender.addArousal(7);
        return ["You rub at the walls of Deno's balls."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls-relax";
        }
      ]
    };
  });

  // Rest in balls while resting
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rest",
      desc: "Regain your strength.",
      attack: function(defender) {
        player.changeStamina(player.maxStamina/5);
        return ["You cease your struggles for a moment, regaining stamina."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls-relax";
        }
      ]
    };
  });

  // Struggle in balls
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle in Deno's throbbing balls!",
      attack: function(defender) {
        defender.addArousal(2);
        if (defender.flags.balls.focus == "grind") {
          return ["It's too chaotic to struggle!"];
        }
        else if (statHealthCheck(attacker, defender, "str") && statHealthCheck(attacker, defender, "str")) {
          defender.flags.state = "cock";
          defender.flags.cock.depth = 13;
          defender.flags.cock.struggles = 0;
          defender.flags.cock.rubs = 0;
          defender.flags.cock.submits = 0;
          return ["Your struggles propel you back into the dragon's shaft!"];
        } else {
          return ["You struggle against the walls..without much effect."];
        }

      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls";
        }
      ]
    };
  });

  // Rub in balls
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rub",
      desc: "Rub the clenching walls.",
      attack: function(defender) {
        defender.addArousal(5);
          if (defender.flags.balls.action != "rub") {
            defender.flags.balls.streak = 0;
            defender.flags.balls.action = "rub";
          }
        defender.flags.balls.streak++;

        if (defender.flags.balls.streak >= Math.floor(Math.random() * 3 + 3)) {
          defender.flags.balls.focus = "grind";
        }

        return ["You rub at the walls of Deno's balls."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls";
        }
      ]
    };
  });

  // Rest in balls
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rest",
      desc: "Regain your strength.",
      attack: function(defender) {
        if (defender.flags.balls.action != "rest") {
          defender.flags.balls.streak = 0;
          defender.flags.balls.action = "rest";
        }
        defender.flags.balls.streak++;

        if (defender.flags.balls.streak >= 10 && defender.flags.arousal < 50) {
          defender.flags.state = "walking";
          return ["The dragon starts walking"];
        }
        else if (defender.flags.balls.streak >= Math.floor(Math.random() * 3 + 3)) {
          defender.flags.balls.focus = "stroke";
        }

        player.changeStamina(player.maxStamina/5);
        return ["You cease your struggles for a moment, regaining stamina."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "balls";
        }
      ]
    };
  });

  // Struggle in balls while walking
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle in Deno's throbbing balls!",
      attack: function(defender) {
        defender.addArousal(2);
        if (statHealthCheck(attacker, defender, "str") && statHealthCheck(attacker, defender, "str")) {
          defender.flags.state = "cock";
          defender.flags.cock.depth = 13;
          defender.flags.cock.struggles = 0;
          defender.flags.cock.rubs = 0;
          defender.flags.cock.submits = 0;
          return ["Your struggles propel you back into the dragon's shaft!"];
        } else {
          return ["You struggle against the walls..without much effect."];
        }
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "walking";
        }
      ]
    };
  });

  // Rub in balls while walking
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rub",
      desc: "Rub the clenching walls.",
      attack: function(defender) {
        defender.addArousal(5);

        return ["You rub at the walls of Deno's balls."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "walking";
        }
      ]
    };
  });

  // Rest in balls while walking
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rest",
      desc: "Regain your strength.",
      attack: function(defender) {
        player.changeStamina(player.maxStamina/5);
        return ["You cease your struggles for a moment, regaining stamina."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "walking";
        }
      ]
    };
  });

  // Struggle in balls while mounted
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Struggle",
      desc: "Struggle in Deno's throbbing balls!",
      attack: function(defender) {
        defender.addArousal(2);
        if (statHealthCheck(attacker, defender, "str") && statHealthCheck(attacker, defender, "str")) {
          defender.flags.state = "cock";
          defender.flags.cock.depth = 13;
          defender.flags.cock.struggles = 0;
          defender.flags.cock.rubs = 0;
          defender.flags.cock.submits = 0;
          return ["Your struggles propel you back into the dragon's shaft!"];
        } else {
          return ["You struggle against the walls..without much effect."];
        }
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "mounted";
        }
      ]
    };
  });

  // Rub in balls while mounted
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rub",
      desc: "Rub the clenching walls.",
      attack: function(defender) {
        defender.addArousal(5);

        return ["You rub at the walls of Deno's balls."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "mounted";
        }
      ]
    };
  });

  // Rest in balls while mounted
  this.playerAttacks.push(
    function(attacker) {
    return {
      name: "Rest",
      desc: "Regain your strength.",
      attack: function(defender) {
        player.changeStamina(player.maxStamina/5);
        return ["You cease your struggles for a moment, regaining stamina."];
      },
      requirements: [
        function(attacker, defender) {
          return defender.flags.state == "mounted";
        }
      ]
    };
  });
}
