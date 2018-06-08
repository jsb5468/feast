/* AEZNON BAR SCENE */

function BarOrder() {
  DialogNode.call(this);

  this.text = ["You step up to the counter. A weary jackal is leaning against the dark wooden wall, polishing a glass and leering at a drunken patron.",
  newline,
  "Then you get shrunk lmao.",
  newline,
  ];

  {
    let nodeShrink = new DialogNode();
    this.addChoice("Freeze in place", nodeShrink);
    nodeShrink.text = [
      "Too startled to move, you can only whimper and quiver as the bartender's fingers wrap around your body. They lift you up, up into the air; swirling lights fill your vision and dull your senses."
    ];

    nodeShrink.hooks.push(function() {
      update([
        "The jackal lets go, sending you tumbling into a highball glass filled with amber liquor."
      ]);
      startDialog(new BarMekuto());
    });
  }
}

function BarMekuto() {
  DialogNode.call(this);

  this.text = [
    "You gasp and break the surface of the drink, lips and eyes burning as the liquor splashes over them. The cold, slightly sticky fluid soaks your fur, filling your snout with the acrid aroma of alcohol. Struggling to see through the tears, you can dimly perceive a blue-and-black figure looming above. His bright-white teeth part to reveal a yellow maws, his gaze fixated on your thrashing body.",
    newline,
    "\"Looks delicious, Ajax,\" he coos, fingers wrapping around the glass and lifting it up into the air"
  ];
}
