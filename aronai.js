
function ArokhaTest() {
  GameObject.call(this, "Arokha Test");

  this.actions.push({
    "name": "Arokha Test",
    "action": function() {
      startCombat(new Arokha());
    }
  });
}

function Arokha() {
  Creature.call(this, "Arokha", 15, 30, 25);

  this.hasName = true;

  this.description = function() { return "Arokha"; };

  this.attacks = [];

  this.flags.state = "combat";

  let attacker = this;

  this.attacks.push({
      attackPlayer: function(defender){
        defender.health = -100;
        return ["Arokha eats you. burp."];
      },
      requirements: [
        function(attacker, defender) {
          return attacker.flags.state == "combat";
        }
      ],
      priority: 1,
      weight: function(attacker, defender) { return 1 }
    });

  this.backupAttack = new pass(this);

  this.playerAttacks = [];

  this.playerAttacks.push(pass);
}
