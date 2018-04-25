function KuroLuxray() {
  Creature.call(this, "Kuro", 20, 40, 20);

  this.hasName = true;

  this.description = function() { return "Kuro"; };

  this.attacks = [];

  this.attacks.push(kuroPounce(this));
  this.attacks.push(kuroSit(this));
  this.attacks.push(kuroBat(this));

  this.attacks.push(kuroLick(this));
  //this.attacks.push(kuroKnead(this));
  //this.attacks.push(kuroSlideSit(this));
  this.attacks.push(kuroOralVore(this));

  this.attacks.push(kuroSmother(this));
  this.attacks.push(kuroAnalVore(this));

  //this.attacks.push(kuroSwallow(this));

  //this.attacks.push(kuroAnalPull(this));
  //this.attacks.push(kuroAnalSqueeze(this));
  //this.attacks.push(kuroAnalRest(this));

  //this.attacks.push(kuroDigest(this));

  this.flags.state = "chase";

  this.flags.distance = 6;

  this.playerAttacks = [];

  this.playerAttacks.push(pass);

  this.prefs.prey = false;
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
    weight: function() { return 1; }
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
      }
    ],
    priority: 1,
    weight: function() { return 1; }
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
      }
    ],
    priority: 1,
    weight: function() { return 1; }
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

function kuroOralVore(attacker) {
  return {
    attackPlayer: function(defender) {
      attacker.flags.state = "oral";
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
    weight: function() { return 1 - defender.staminaPercentage(); }
  };
}

function kuroSmother(attacker) {
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

      return ["The heavy cat's weight shifts and slides...and his soft pucker takes you in. He eases himself down just an inch or two, enough to slide you entirely within...churring and swishing his tail as you're locked into his bitter, musky bowels."];
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
    weight: function() { return 1; }
  };
}

function template(attacker) {
  return {
    attackPlayer: function(defender) {

    },
    requirements: [

    ],
    priority: 1,
    weight: function() { return 1; }
  };
}
