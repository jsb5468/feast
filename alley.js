public KuroLuxray() {
  Creature.call(this, "Kuro", 20, 40, 20);

  this.hasName = true;

  this.description = function() { return "Kuro"; };

  this.attacks.push(kuroPounce(this));
  this.attacks.push(kuroSit(this));
  this.attacks.push(kuroBat(this));

  this.attacks.push(kuroLick(this));
  this.attacks.push(kuroKnead(this));
  this.attacks.push(kuroSlideSit(this));
  this.attacks.push(kuroOralVore(this));

  this.attacks.push(kuroSmother(this));
  this.attacks.push(kuroAnalVore(this));

  this.attacks.push(kuroSwallow(this));

  this.attacks.push(kuroAnalPull(this));
  this.attacks.push(kuroAnalSqueeze(this));
  this.attacks.push(kuroAnalRest(this));

  this.attacks.push(kuroDigest(this));

  this.flags.state = "chase";

  this.flags.distance = 6;

  this.playerAttacks = [];

  this.playerAttacks.push(pass);

  this.prefs.prey = false;
}

function kuroBat(attacker) {
  return {
    attackPlayer: function(defender) {
      let line = ["The Luxray leaps towards you and smacks you with his heavy paw.",newline];
      let choice = Math.random();

      if (choice < 0.4) {
        player.changeStamina(-25);
        line.push("You're knocked sideways, tossed into the wall! The impact dazes you for a moment.")
      } else if (choice < 0.75) {
        player.changeStamina(-15);
      }
    }
  }
}
