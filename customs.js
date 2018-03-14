/* AEZNON COMMISSION */

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
  this.prefs.analVore = false;
}

function getaShrink(attacker) {
  return {
    attackPlayer: function(defender) {
      let success = Math.random() < 0.5;

      if (success) {
        defender.flags.shrunk = true;
        return attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you find yourself shrunken down to no more than two inches tall.";
      } else {
        attacker.flags.shrunk = true;
        return attacker.description() + " pulls a strange device from his pocket and points it at you. A blinding flash envelops your vision...and as your sight returns, you see that he's shrunk himself!";
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
      return attacker.description() + " leans down and snatches you up, stuffing you into his maw.";
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
      return attacker.description() + " grinds you against the roof of his maw with his tongue.";
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
      return attacker.description() + " shuts his jaws and suckles on you.";
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
      return attacker.description() + " swallows, draining the drool from his jaws - leaving you on the precipice of his gullet.";
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
      return attacker.description() + " shuts his jaws and swallows, dragging you down into his tight throat and dumping you into a caustic stomach.";
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
        return attacker.description() + "'s paw comes crashing down on your little body, smashing you into the dirt.";
      } else {
        return "You dive away as " + attacker.description() + "'s paw slams down, narrowly missing your little body.";
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
      return attacker.description() + " looms over your stunned body. You can only watch as his toes flex, squeeze...and come down hard. The fox's paw crushes you like an insect, tearing you open and spilling your guts across the dusty trail. He grinds you a few times more for good measure, leaving a disfigured, broken mess in your place.";
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
        return defender.prefs.gore;
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

  this.text = "You approach the sandy-furred fox.";

  {
    let nodeFight = new DialogNode();
    this.addChoice("He certainly looks tasty...", nodeFight);

    nodeFight.text = "You stalk up to your prey, but he sees you coming. You're going to have to fight!";
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
