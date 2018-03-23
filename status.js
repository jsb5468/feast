function StatBuff(stat, amount, turns) {
  this.stat = stat;
  this.amount = amount;
  this.turns = turns;
  this.alive = true;
}

StatBuff.prototype.tick = function() {
  this.turns--;
  if (this.turns == 0) {
    this.alive = false;
  }
};
