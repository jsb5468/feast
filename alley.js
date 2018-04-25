function KuroLuxray() {
  Creature.call(this, "Kuro", 25, 30, 25);

  this.hasName = true;

  this.description = function() { return "Kuro"; };

  this.attacks = [];

  this.attacks.push(kuroPounce(this));
  this.attacks.push(kuroSit(this));
  this.attacks.push(kuroBat(this));

  this.attacks.push(kuroLick(this));
  this.attacks.push(kuroKnead(this));
  this.attacks.push(kuroOralVore(this));

  this.attacks.push(kuroAnalSmother(this));
  this.attacks.push(kuroAnalVore(this));

  this.attacks.push(kuroOralSuckle(this));
  this.attacks.push(kuroOralSwallow(this));

  this.attacks.push(kuroAnalPull(this));
  this.attacks.push(kuroAnalSqueeze(this));
  this.attacks.push(kuroAnalIngest(this));

  this.attacks.push(kuroStomachDigest(this));

  this.flags.state = "chase";

  this.flags.distance = 6;

  this.playerAttacks = [];

  this.playerAttacks.push(kuroPlayerRun);
  this.playerAttacks.push(kuroPlayerEscape);
  this.playerAttacks.push(kuroPlayerPawStruggle);
  this.playerAttacks.push(kuroPlayerAssStruggle);
  this.playerAttacks.push(kuroPlayerOralStruggle);
  this.playerAttacks.push(kuroPlayerAnalStruggle);
  this.playerAttacks.push(kuroPlayerStomachStruggleUp);
  this.playerAttacks.push(kuroPlayerStomachStruggleDown);

  this.playerAttacks.push(pass);

  this.prefs.prey = false;

  this.startCombat = function(player) {
    player.flags.teases = 0;
    return ["Vertigo abruptly overwhelms you. Stumbling and grasping for something to steady yourself with, you eventually find yourself lying on the floor...and only a few inches tall. You scramble to your feet, ears perking at the sound of footfalls. Alas, it is not a chance of rescue - rather, it's a massive black-and-yellow cat, skulking from the shadows and licking his lips."];
  };

  this.finishCombat = function() {
    switch(this.flags.state) {
      case "stomach":
        return ["You pass out in the Luxray's gut, gradually melting away..."];
    }
  };
}

function kuroBat(attacker) {
  return {
    attackPlayer: function(defender) {
      let line = "The Luxray leaps towards you and smacks you with his heavy paw. ";
      let choice = Math.random();

      if (choice < 0.4) {
        player.changeStamina(-25);
        line += "You're knocked sideways, tossed into the wall! The impact dazes you for a moment.";
      } else if (choice < 0.75) {
        player.changeStamina(-15);
        let distance = Math.round(Math.random()*2+1);
        attacker.flags.distance += distance;
        line += "You tumble backwards, tossed between the lion's legs and thrown backward " + (distance == 1 ? "a foot" : "two feet") + ".";
      } else {
        player.changeStamina(-15);
        attacker.flags.distance -= 1;
        line += "He bats you from behind, sending you tumbling a foot forward.";
      }

      return [line];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "chase";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroPounce(attacker) {
  return {
    attackPlayer: function(defender) {
      let result = statHealthCheck(attacker, defender, "dex");

      if (result) {
        attacker.flags.state = "paws";
        return ["A scrape of claws on concrete precedes the looming shadow of the lion. You turn and gasp in surprise, trying to dive out of the way as he comes hurtling down towards you - but it's too late. Kuro lands hard on his forepaws, pinning you to the cold, damp pavement and smothering your body in those weighty toes."];
      } else {
        return ["You hear the Luxray's claws scrape on the pavement as he pounces. It's just enough of a warning for you to dive out of the way. Heavy paws thump down on the ground, narrowly missing your body as you roll and get back to your feet."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "chase";
      },
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroSit(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = statHealthCheck(attacker, defender, "dex");

      if (success) {
        attacker.flags.state = "sit";
        return ["You gasp as the Luxray saunters over you, his regal body blotting out the light from above. It seems like he's just...walking past? You slow and stop, gazing upward as his black-and-yellow body walks by - chest, then belly, then his half-erect shaft, and then...<i>WHUMP</i>. His hind legs bend as his hips slam down on your body, pinning you up against his heavy ass. A hot, musk-tinged pucker grinds over your snout as he lets out a satisfied <i>purr.</i>"];
      } else {
        return ["You gasp as the Luxray saunters right onto you - tongue lolling from his parted jaws, eyes briefly making contact with yours - before his head becomes obscured by his regal chest and belly. For a brief moment, you think he's just letting you go...and then you realize what's about to happen, lunging to the side a heartbeat before his hips slam down on the ground. A delighted purr is cut short as he looks to the side and sees you stumbling to your feet; the Luxray rises back up and snarls. He really does want you..."];
      }

    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "chase";
      },
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.anal > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroLick(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.changeStamina(-25);

      return ["The big cat's hot, pink tongue drags over your body as he savors your little squirmy body."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "paws";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage(); }
  };
}

function kuroKnead(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.changeStamina(-45);

      return ["Heavy paws knead over your body, smothering you against the pavement."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "paws";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage(); }
  };
}

function kuroOralVore(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.state = "oral";
      attacker.flags.oralstage = 1;
      return ["Pinned and helpless, you can do little but squirm as the big cat's jaws lower to envelop you...hot, slimy tongue curling under your pinned body, cradling you in muscle and easing you into that powerful maw. He suckles on you for a long minute, sloshing you from side to side - savoring your fear, no doubt."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "paws";
      },
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.oral > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 2 - 1 * defender.staminaPercentage(); }
  };
}

function kuroOralSuckle(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.changeStamina(-35);

      return ["Hot, wet flesh grinds over your body as Kuro slurps and sucks on your bite-sized frame."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "oral";
      },
      function(attacker, defender) {
        return attacker.flags.oralstage == 1;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage() * 1.25; }
  };
}

function kuroOralSwallow(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.oralstage++;

      if (attacker.flags.oralstage == 2) {
        return ["The Luxray flicks back his head, tossing you against the roof of that slimy, humid maw...and then letting you slide right down into his tight throat. A powerful <i>glk</i> of muscle grasps your body and sucks you down deep, your struggles forming faint bulges in the big cat's bared neck."];
      } else if (attacker.flags.oralstage == 3) {
        attacker.flags.state = "stomach";
        return ["One final swallow tugs you down into Kuro's tight, sloppy stomach."];
      }
    },
    requirements: [
        function(attacker, defender) {
          return attacker.flags.state == "oral";
        }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 2/3; }
  };
}

function kuroAnalSmother(attacker) {
  return {
    attackPlayer: function(defender) {
      defender.changeStamina(-45);

      return ["Kuro's ass grinds over your pinned body, knocking the wind from your lungs"];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "sit";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return defender.staminaPercentage(); }
  };
}

function kuroAnalVore(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.state = "anal";
      attacker.flags.analstage = 1;

      return ["The heavy cat's weight shifts and slides...and his soft pucker takes you in. He eases himself down just an inch or two, enough to slide your upper body within...churring and swishing his tail as you're locked into his bitter, musky bowels. He clenches firmly, sealing that donut around your hips and easing you further inside."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "sit";
      },
      function(attacker, defender) {
        return defender.prefs.prey && defender.prefs.vore.anal > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 2 - defender.staminaPercentage(); }
  };
}

function kuroAnalPull(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.analstage++;

      if (attacker.flags.analstage == 2) {
        return ["A slow, unstoppable squeeze drags you deeper into the Luxray's bowels."];
      } else if (attacker.flags.analstage == 3) {
        return ["The fleshy walls grow tighter as you're clenched up against the big cat's small intestine."];
      } else if (attacker.flags.analstage == 4) {
        return ["A wet <i>shlllck</i> fills your ears as you're sucked into tighter, mazelike guts, pressed and squeezed on from every direction..."];
      } else if (attacker.flags.analstage == 5) {
        return ["You're dragged so very deep, disoriented and lost in a haze of musk and humidity. The walls ripple and clench with a slow, steady rhythm."];
      } else if (attacker.flags.analstage == 6) {
        attacker.flags.state = "stomach";
        return ["Kuro's guts clench hard, squeezing you headfirst into his gurgling stomach and smothering you in sloppy flesh."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "anal";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroAnalSqueeze(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 15);
      defender.changeStamina(-25);

      return pickRandom([
        ["Muscular walls clench and squeeze your little body, wearing you down."],
        ["A long, drawn-out squeeze grips your body, smearing your face against those musky, meaty walls."],
        ["Your body is bent and squeezed by unrelenting force."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "anal";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroAnalIngest(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.analstage = 6;
      attacker.flags.state = "stomach";

      return ["Exhauted and beaten, you dimly feel yourself being dragged all the way into the cat's gut...sucked so very deep in one smooth, satisfying clench."];
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "anal";
      },
      function(attacker, defender) {
        return defender.health <= 0 || defender.stamina <= 0;
      }
    ],
    priority: 2,
    weight: function(attacker, defender) { return 1; }
  };
}
function kuroStomachDigest(attacker) {
  return {
    attackPlayer: function(defender) {
      attack(attacker, defender, 33);
      return pickRandom([
        ["Powerful muscle grinds and squeezes your body, wearing you down in the depths of the Luxray."],
        ["You moan and whimper, smothered and squashed in a pit of flesh and frothy slime."],
        ["The Luxray's stomach gurgles and bubbles as it melts you down."],
        ["Hot flesh clenches all around, grinding your body into the acidic slime."],
        ["A soft <i>burp</i> spills from the cat's jaws as he digests you down."],
        ["Deep, thrumming purrs and thick, slimy sloshes are all you can hear in the Luxray's deepest depths..."]
      ]);
    },
    requirements: [
      function(attacker, defender) {
        return attacker.flags.state == "stomach";
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; },
    gameover: function() { return "Shrunk down and digested by Kuro"; }
  };
}

function kuroPlayerRun(attacker) {
  return {
    name: "Run",
    desc: "Run away!",
    attack: function(defender) {
      defender.flags.distance -= 1;

      let line = pickRandom([
        ["You run towards the entrance of the alley, trying not to think about what'll happen if you trip..."],
        ["Your tiny footsteps echo off the canyonlike walls of the alley."],
        ["You sprint towards the relative safety of the street, panting and gasping as the cat's heavy footfalls keep pace behind you."]
      ]);

      let distance = "";

      if (defender.flags.distance > 5) {
        distance = "You still have a long way to go.";
      } else if (defender.flags.distance > 3) {
        distance = "You're getting closer to freedom.";
      } else if (defender.flags.distance > 1) {
        distance = "You're only a dozen feet away now.";
      } else if (defender.flags.distance == 1) {
        distance = "Just a few more steps and you're free!";
      } else {
        distance = "You're out of the alley! Now you just need to turn the corner...";
      }

      return line.concat(newline,distance);
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "chase";
      },
      function(attacker, defender) {
        return defender.flags.distance > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroPlayerEscape(attacker) {
  return {
    name: "Escape",
    desc: "Get away from the alley!",
    attack: function(defender) {
      changeMode("explore");
      moveToByName("North Street","");
      advanceTime(60 * 60 * 6 * (Math.random() + 0.2));
      attacker.health = attacker.maxHealth * 0.2;
      attacker.stamina = attacker.maxStamina * 0.2;
      return ["You turn the corner and flee, leaving the predatory cat behind. You stumble along for a few minutes before collapsing under a bench and passing out. When you awaken, you're back to normal size - and a little bit woozy feeling."];
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "chase";
      },
      function(attacker, defender) {
        return defender.flags.distance <= 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroPlayerPawStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Squirm under the Luxray's toes",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.state = "chase";
        return ["You squirm out from beneath the Luxray's crushing paws!"];
      } else {
        return ["You squirm and writhe...but get nowhere, pinned hard against the pavement."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "paws";
      }, function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroPlayerAssStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Squirm under the Luxray's ass",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.state = "chase";
        return ["You push and thrust and squeeze...and free yourself! The cat takes a moment to notice you've escaped, and you're back in a sprint by the time he's raised himself back up."];
      } else {
        return ["You push and shove and writhe...and do nothing but pleasure Kuro, smearing your face in his bitter pucker."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "sit";
      }, function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}

function kuroPlayerOralStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Try to escape the Luxray's gullet...",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.oralstage--;

        if (defender.flags.oralstage == 0) {
          defender.flags.state = "paws";
          return ["You strain and struggle to push open those massive jaws...and succeed! Your soaking-wet body tumbles to the ground as you force the cat to spit you own.",newline,"The cat promptly stomps on you."];
        } else if (defender.flags.oralstage == 1 ) {
          return ["Your struggles bear fruit, and you manage to drag yourself back up the cat's throat, much to his surprise."];
        }
      } else {
        return ["You struggle and grind against slick flesh...to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "oral";
      }, function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}


function kuroPlayerAnalStruggle(attacker) {
  return {
    name: "Struggle",
    desc: "Writhe in the Luxray's ass",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.analstage--;

        if (defender.flags.analstage == 0) {
          defender.flags.state = "sit";
          return ["You give one last mighty heave, pushing yourself out from Kuro's pucker and falling to the ground.",newline,"A moment later, his ass lands hard on you, pinning you hard."];
        } else if (defender.flags.analstage == 1) {
          return ["You're so very close now. You squirm and press, shoving your lower body back out of the Luxray's ass."];
        } else if (defender.flags.analstage == 2) {
          return ["You push yourself against arching walls of muscle, workign you way out of the Luxray's bowels bit-by-bit. You pray you're going the right direction..."];
        } else if (defender.flags.analstage == 3) {
          return ["You slide from Kuro's small intestine. At least you have more room to breathe now."];
        } else if (defender.flags.analstage == 4) {
          return ["The cat's guts are tangled and winding. You blindly squirm and struggle, making slow, steady progress against those waves of peristalsis."];
        } else if (defender.flags.analstage == 5) {
          return ["You drag yourself away from the upper half of the cat's small intestine...but there's so very <i>far</i> to go."];
        }
      } else {
        return ["You struggle and grind against slick muscle...to no avail."];
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "anal";
      }, function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}


function kuroPlayerStomachStruggleUp(attacker) {
  return {
    name: "Struggle up!",
    desc: "Try to escape before you're digested by pushing into Kuro's throat.",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.state = "oral";
        defender.flags.oralstage = 2;
        return ["You grip the tight sphincter at the top of the cat's stomach and pull with all your might...and pry it open! You shove your head and shoulders in, pulling the rest of your body into the cat's ripppling throat as it tries to pack you back down."];
      } else {
        return pickRandom([
          ["You shove both hands into the tight ring of muscle locking you in that wretched stomach and pull...and get nowhere."],
          ["You're too busy being mashed up by crushing peristalsis to struggle."],
          ["You try to find your footing to push into the cat's throat. A lazy roll and <i>belch</i> throws you into the chyme."]
        ]);
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "stomach";
      },
      function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      },
      function(attacker, defender) {
        return attacker.prefs.vore.oral > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}


function kuroPlayerStomachStruggleDown(attacker) {
  return {
    name: "Struggle down!",
    desc: "Try to escape before you're digested by pushing into Kuro's bowels.",
    attack: function(defender) {
      let result = statHealthCheck(attacker, defender, "str");

      if (result) {
        defender.flags.state = "anal";
        defender.flags.analstage = 4;
        return ["You grip the tight sphincter at the bottom of the cat's stomach and pull with all your might...and pry it open! Your entire body plunges in in an instant, and you're now sealed into the cat's intestines. Was this really such a good idea...?"];
      } else {
        return pickRandom([
          ["You shove both hands into the tight ring of muscle locking you in that wretched stomach and pull...and get nowhere."],
          ["You're too busy being mashed up by crushing peristalsis to struggle."],
          ["You try to find your footing to push into the cat's guts. A lazy roll and <i>belch</i> throws you into the chyme."]
        ]);
      }
    },
    requirements: [
      function(attacker, defender) {
        return defender.flags.state == "stomach";
      }, function(attacker, defender) {
        return attacker.health > 0 && attacker.stamina > 0;
      },
      function(attacker, defender) {
        return attacker.prefs.vore.anal > 0;
      }
    ],
    priority: 1,
    weight: function(attacker, defender) { return 1; }
  };
}
