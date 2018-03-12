
let currentRoom = null;
let currentDialog = null;

let dirButtons = [];
let actionButtons = [];

let mode = "explore";
let actions = [];
let time = 9*60*60;
let newline = "&nbsp;";

let player = new Player();

let respawnRoom;

let prefs = {
  player: {
    prey: true
  }
};

function round(number, digits) {
  return Math.round(number * Math.pow(10,digits)) / Math.pow(10,digits);
}

function updateExploreCompass() {
  for (let i = 0; i < dirButtons.length; i++) {
    let button = dirButtons[i];
    button.classList.remove("active-button");
    button.classList.remove("inactive-button");
    button.classList.remove("disabled-button");
    if (currentRoom.exits[i] == null) {
      button.disabled = true;
      button.classList.add("inactive-button");
      button.innerHTML = "";
    } else {
      if (currentRoom.exits[i].conditions.reduce((result, test) => result && test(prefs), true)) {
        button.disabled = false;
        button.classList.add("active-button");
        button.innerHTML = currentRoom.exits[i].name;
      } else {
        button.disabled = true;
        button.classList.add("disabled-button");
        button.innerHTML = currentRoom.exits[i].name;
      }
    }
  }
}
function updateExploreActions() {
  for (let i = 0; i < actionButtons.length; i++) {
    if (i < actions.length) {
      actionButtons[i].disabled = false;
      actionButtons[i].innerHTML = actions[i].name;
      actionButtons[i].classList.remove("inactive-button");
      actionButtons[i].classList.add("active-button");
    }
    else {
      actionButtons[i].disabled = true;
      actionButtons[i].innerHTML = "";
      actionButtons[i].classList.remove("active-button");
      actionButtons[i].classList.add("inactive-button");
    }
  }
}

function updateExplore() {
  updateExploreCompass();
  updateExploreActions();
}

function updateEaten() {
  let list = document.getElementById("eaten");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < currentFoe.struggles.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("eaten-button");
    button.innerHTML = currentFoe.struggles[i].name;
    button.addEventListener("click", function() { struggleClicked(i); } );
    button.addEventListener("mouseover", function() { struggleHovered(i); } );
    button.addEventListener("mouseout", function() { document.getElementById("eaten-desc").innerHTML = ""; } );
    li.appendChild(button);
    list.appendChild(li);
  }

}
function updateCombat() {
  let list = document.getElementById("combat");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < player.attacks.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("combat-button");
    button.innerHTML = player.attacks[i].name;
    button.addEventListener("click", function() { attackClicked(i); } );
    button.addEventListener("mouseover", function() { attackHovered(i); } );
    button.addEventListener("mouseout", function() { document.getElementById("combat-desc").innerHTML = ""; } );
    li.appendChild(button);
    list.appendChild(li);
  }
}

function updateDialog() {
  let list = document.getElementById("dialog");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < currentDialog.choices.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("dialog-button");
    button.innerHTML = currentDialog.choices[i].text;
    button.addEventListener("click", function() { dialogClicked(i); });
    li.appendChild(button);
    list.appendChild(li);
  }
}

function updateDisplay() {

  document.querySelectorAll(".selector").forEach(function (x) {
    x.style.display = "none";
  });
  switch(mode) {
    case "explore":
      document.getElementById("selector-explore").style.display = "flex";
      updateExplore();
      break;
    case "combat":
      document.getElementById("selector-combat").style.display = "flex";
      updateCombat();
      break;
    case "dialog":
      document.getElementById("selector-dialog").style.display = "flex";
      updateDialog();
      break;
    case "eaten":
      document.getElementById("selector-eaten").style.display = "flex";
      updateEaten();
      break;
  }

  document.getElementById("time").innerHTML = "Time: " + renderTime(time);
  document.getElementById("stat-name").innerHTML = "Name: " + player.name;
  document.getElementById("stat-health").innerHTML = "Health: " + round(player.health,0) + "/" + round(player.maxHealth,0);
  document.getElementById("stat-fullness").innerHTML = "Fullness: " + round(player.fullness(),0);
}

function advanceTime(amount) {
  time = (time + amount) % 86400;
  player.health = Math.min(amount * player.maxHealth / 86400 * 12 + player.health, player.maxHealth);
  update(player.stomach.digest(amount));
}

function renderTime(time) {
  let suffix = (time < 43200) ? "AM" : "PM";
  let hour = Math.floor((time % 43200) / 3600);
  if (hour == 0)
    hour = 12;
  let minute = Math.floor(time / 60) % 60;
  if (minute < 9)
    minute = "0" + minute;

  return hour + ":" + minute + " " + suffix;
}

function move(direction) {
  let target = currentRoom.exits[direction];
  if (target == null) {
    alert("Tried to move to an empty room!");
    return;
  }

  moveTo(target,currentRoom.exitDescs[direction]);
}

function moveTo(room,desc="You go places lol") {
  actions = [];
  currentRoom = room;
  advanceTime(30);

  currentRoom.objects.forEach(function (object) {
    object.actions.forEach(function (action) {
      actions.push(action);
    });
  });

  update([desc,newline]);

  currentRoom.visit();
}

window.addEventListener('load', function(event) {
  document.getElementById("start-button").addEventListener("click", start, false);
});

function start() {
  applySettings(generateSettings());
  document.getElementById("create").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadActions();
  loadCompass();
  loadDialog();
  currentRoom = createWorld();
  respawnRoom = currentRoom;
  moveTo(currentRoom);
  updateDisplay();
}

// copied from Stroll LUL

function generateSettings() {
  let form = document.forms.namedItem("character-form");
  let settings = {};
  for (let i=0; i<form.length; i++) {
    let value = form[i].value == "" ? form[i].placeholder : form[i].value;
    if (form[i].type == "text")
      if (form[i].value == "")
        settings[form[i].name] = form[i].placeholder;
      else
        settings[form[i].name] = value;
    else if (form[i].type == "number")
      settings[form[i].name] = parseFloat(value);
    else if (form[i].type == "checkbox") {
      settings[form[i].name] = form[i].checked;
    } else if (form[i].type == "radio") {
      let name = form[i].name;
      if (form[i].checked)
        settings[name] = form[i].value;
    } else if (form[i].type == "select-one") {
      settings[form[i].name] = form[i][form[i].selectedIndex].value;
    }
  }

  return settings;
}

function applySettings(settings) {
  player.name = settings.name;

  for (let key in settings) {
    if (settings.hasOwnProperty(key)) {
      if (key.match(/prefs/)) {
        let tokens = key.split("-");
        let pref = prefs;
        pref = tokens.slice(1,-1).reduce((pref, key) => pref[key], pref);
        pref[tokens.slice(-1)[0]] = settings[key];
      }
    }
  }
}

function saveSettings() {
  window.localStorage.setItem("settings", JSON.stringify(generateSettings()));
}

function retrieveSettings() {
  return JSON.parse(window.localStorage.getItem("settings"));
}
function update(lines=[]) {
  let log = document.getElementById("log");
  for (let i=0; i<lines.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = lines[i];
    log.appendChild(div);
  }

  log.scrollTop = log.scrollHeight;
  updateDisplay();
}

function changeMode(newMode) {
  mode = newMode;
  let body = document.querySelector("body");
  body.className = "";
  switch(mode) {
    case "explore":
    case "dialog":
      body.classList.add("explore");
      break;
    case "combat":
      body.classList.add("combat");
      break;
    case "eaten":
      body.classList.add("eaten");
      break;
  }

  updateDisplay();
}

function respawn(respawnRoom) {
  moveTo(respawnRoom,"You drift through space and time...");
  advanceTime(86400/2);
  changeMode("explore");
  player.health = 100;
  update(["You wake back up in your bed."]);
}

function startCombat(opponent) {
  changeMode("combat");
  currentFoe = opponent;
  update(["Oh shit it's a " + opponent.description()]);
}

function attackClicked(index) {
  update([player.attacks[index].attack(currentFoe)]);

  if (currentFoe.health <= 0) {
    update(["The " + currentFoe.description() + " falls to the ground!"]);
    startDialog(new FallenFoe(currentFoe));
  } else {
    let attacks = currentFoe.attacks.filter(attack => attack.conditions == undefined || attack.conditions.reduce((result, test) => result && test(prefs), true));
    attacks = attacks.filter(attack => attack.requirements == undefined || attack.requirements.reduce((result, test) => result && test(currentFoe, player), true));

    let attack = pick(attacks);

    if (attack == null) {
      attack = currentFoe.backupAttack;
    }

    update([attack.attackPlayer(player)]);

    if (player.health <= 0) {
      update(["You fall to the ground..."]);
      if (prefs.player.prey) {
        changeMode("eaten");
      } else {
        respawn(respawnRoom);
      }
    }
  }
}

function attackHovered(index) {
  document.getElementById("combat-desc").innerHTML = player.attacks[index].desc;
}

function struggleClicked(index) {
  let struggle = currentFoe.struggles[index];

  let result = struggle.struggle(player);

  update([result.lines]);

  if (result.escape) {
    changeMode("explore");
  } else {
    let digests = currentFoe.digests.filter(digest => digest.conditions == undefined || digest.conditions.reduce((result, test) => result && test(prefs), true));
    digests = digests.filter(digest => digest.requirements == undefined || digest.requirements.reduce((result, test) => result && test(currentFoe, player), true));

    let digest = pick(digests);

    if (digest == null) {
      digest = currentFoe.backupDigest;
    }

    update([digest.digest(player)]);

    if (player.health <= -100) {
      update(["You digest in the depths of the " + currentFoe.description()]);
      respawn(respawnRoom);
    }
  }
}

function struggleHovered(index) {
  document.getElementById("eaten-desc").innerHTML = currentFoe.struggles[index].desc;
}

function startDialog(dialog) {
  currentDialog = dialog;
  changeMode("dialog");
  update([currentDialog.text]);
  currentDialog.visit();
  updateDisplay();
}

function dialogClicked(index) {
  currentDialog = currentDialog.choices[index].node;
  update([currentDialog.text]);
  currentDialog.visit();
  if (currentDialog.choices.length == 0) {
    changeMode("explore");
    updateDisplay();
  }
}

function loadDialog() {
  dialogButtons = Array.from( document.querySelectorAll(".dialog-button"));
  for (let i = 0; i < dialogButtons.length; i++) {
    dialogButtons[i].addEventListener("click", function() { dialogClicked(i); });
  }
}

function actionClicked(index) {
  actions[index].action();
}

function loadActions() {
  actionButtons = Array.from( document.querySelectorAll(".action-button"));
  for (let i = 0; i < actionButtons.length; i++) {
    actionButtons[i].addEventListener("click", function() { actionClicked(i); });
  }
}

function loadCompass() {
  dirButtons[NORTH_WEST] = document.getElementById("compass-north-west");
  dirButtons[NORTH_WEST].addEventListener("click", function() {
    move(NORTH_WEST);
  });
  dirButtons[NORTH] = document.getElementById("compass-north");
  dirButtons[NORTH].addEventListener("click", function() {
    move(NORTH);
  });
  dirButtons[NORTH_EAST] = document.getElementById("compass-north-east");
  dirButtons[NORTH_EAST].addEventListener("click", function() {
    move(NORTH_EAST);
  });
  dirButtons[WEST] = document.getElementById("compass-west");
  dirButtons[WEST].addEventListener("click", function() {
    move(WEST);
  });
  dirButtons[EAST] = document.getElementById("compass-east");
  dirButtons[EAST].addEventListener("click", function() {
    move(EAST);
  });
  dirButtons[SOUTH_WEST] = document.getElementById("compass-south-west");
  dirButtons[SOUTH_WEST].addEventListener("click", function() {
    move(SOUTH_WEST);
  });
  dirButtons[SOUTH] = document.getElementById("compass-south");
  dirButtons[SOUTH].addEventListener("click", function() {
    move(SOUTH);
  });
  dirButtons[SOUTH_EAST] = document.getElementById("compass-south-east");
  dirButtons[SOUTH_EAST].addEventListener("click", function() {
    move(SOUTH_EAST);
  });
}
