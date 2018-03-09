function pick(list) {
  return list[Math.floor(Math.random()*list.length)];
}

function Creature(name = "Creature") {
  this.name = name;
  this.health = 100;
  this.maxHealth = 100;
  this.mass = 80;
  this.stomach = Stomach();
}

function Player(name = "Player") {
  Creature.call(this, name);

  this.fullness = 100;
  this.maxFullness = 200;
}

function Anthro() {
  let species = pick(["dog","cat","lizard","deer","wolf","fox"]);

  Creature.call(this, name);
}
// vore stuff here

function Container(name = "stomach") {
  this.name = name;
  this.contents = [];
  this.digest = function() {

  };
}

function Stomach() {
  Container.call(this, "stomach");

  this.digest = function() {
    let lines = [];
    this.contents.forEach(function (prey) {
      lines.push("Something is digesting!");
    });
    return lines;
  }
}
