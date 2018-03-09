let currentRoom = null;

function updateDisplay() {
  document.getElementById("location").innerHTML = currentRoom.name;
}

function move(direction) {
  let target = currentRoom.exits[direction];
  if (target == null) {
    alert("Tried to move to an empty room!");
    return;
  } else {
    currentRoom = target;
    update(["You move to " + currentRoom.name]);
    updateDisplay();
  }

}

window.addEventListener('load', function(event) {
  loadCompass();
  currentRoom = createWorld();
  updateDisplay();
});

function update(lines=[]) {
  let log = document.getElementById("log");
  for (let i=0; i<lines.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = lines[i];
    log.appendChild(div);
  }
}

function loadCompass() {
  document.getElementById("compass-north-west").addEventListener("click", function() {
    move(NORTH_WEST);
  });
  document.getElementById("compass-north").addEventListener("click", function() {
    move(NORTH);
  });
  document.getElementById("compass-north-east").addEventListener("click", function() {
    move(NORTH_EAST);
  });
  document.getElementById("compass-west").addEventListener("click", function() {
    move(WEST);
  });
  document.getElementById("compass-east").addEventListener("click", function() {
    move(EAST);
  });
  document.getElementById("compass-south-west").addEventListener("click", function() {
    move(SOUTH_WEST);
  });
  document.getElementById("compass-south").addEventListener("click", function() {
    move(SOUTH);
  });
  document.getElementById("compass-south-east").addEventListener("click", function() {
    move(SOUTH_EAST);
  });
}
