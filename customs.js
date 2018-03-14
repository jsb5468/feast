/* AEZNON COMMISSION */

function Geta() {
  Creature.call(this, "Geta", 5, 15, 10);

  this.hasName = true;
  
  this.description = function() { return "Geta" };
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
