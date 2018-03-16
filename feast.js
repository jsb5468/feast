let world = null;

let currentRoom = null;
let currentDialog = null;

let currentFoe = null;

let dirButtons = [];
let actionButtons = [];

let mode = "explore";
let actions = [];
let time = 9*60*60;
let date = 1;
let newline = "&nbsp;";

let player = new Player();
let playerAttacks = [];

let struggles = [];

let killingBlow = null;

let deaths = [];
let respawnRoom;

function join(things) {
  if (things.length == 1) {
    return things[0].description("a");
  } else if (things.length == 2) {
    return things[0].description("a") + " and " + things[1].description("a");
  } else {
    let line = "";
    line = things.slice(0,-1).reduce((line, prey) => line + prey.description("a") + ", ", line);
    line += " and " + things[things.length-1].description("a");
    return line;
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pick(list, attacker, defender) {
  if (list.length == 0)
    return null;
  else {
    let sum = list.reduce((sum, choice) => choice.weight == undefined ? sum + 1 : sum + choice.weight(attacker, defender), 0);

    let target = Math.random() * sum;

    for (let i = 0; i < list.length; i++) {
      sum -= list[i].weight == undefined ? 1 : list[i].weight(attacker, defender);
      if (sum <= target) {
        return list[i];
      }
    }

    return list[list.length-1];
  }
}

function filterValid(options, attacker, defender) {
  let filtered = options.filter(option => option.conditions == undefined || option.conditions.reduce((result, test) => result && test(attacker, defender), true));
  return filtered.filter(option => option.requirements == undefined || option.requirements.reduce((result, test) => result && test(attacker, defender), true));
}

function filterPriority(options) {
  let max = options.reduce((max, option) => option.priority > max ? option.priority : max, -1000);
  return options.filter(option => option.priority == max);
}

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
      if (currentRoom.exits[i].conditions.reduce((result, test) => result && test(player.prefs), true)) {
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

  struggles = filterValid(currentFoe.struggles, currentFoe, player);
  for (let i = 0; i < struggles.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("eaten-button");
    button.innerHTML = struggles[i].name;
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

  playerAttacks = filterValid(player.attacks, player, currentFoe);

  if (playerAttacks.length == 0)
    playerAttacks = [player.backupAttack];

  for (let i = 0; i < playerAttacks.length; i++) {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("combat-button");
    button.innerHTML = playerAttacks[i].name;
    button.addEventListener("click", function() { attackClicked(i); } );
    button.addEventListener("mouseover", function() { attackHovered(i); } );
    button.addEventListener("mouseout", function() { document.getElementById("combat-desc").innerHTML = ""; } );
    li.appendChild(button);
    list.appendChild(li);
  }

  document.getElementById("stat-foe-name").innerHTML = "Name: " + currentFoe.name;
  document.getElementById("stat-foe-health").innerHTML = "Health: " + currentFoe.health + "/" + currentFoe.maxHealth;
  document.getElementById("stat-foe-stamina").innerHTML = "Stamina: " + currentFoe.stamina + "/" + currentFoe.maxStamina;
}

function updateDialog() {
  let list = document.getElementById("dialog");

  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < currentDialog.choices.length; i++) {
    let activated = currentDialog.choices[i].node.requirements == undefined || currentDialog.choices[i].node.requirements.reduce((result, test) => result && test(player, currentFoe), true);
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("dialog-button");
    button.innerHTML = currentDialog.choices[i].text;
    button.addEventListener("click", function() { dialogClicked(i); });
    if (!activated) {
      button.classList.add("disabled-button");
      button.disabled = true;
    }
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
  document.getElementById("date").innerHTML = "Day " + date;
  document.getElementById("stat-name").innerHTML = "Name: " + player.name;
  document.getElementById("stat-health").innerHTML = "Health: " + round(player.health,0) + "/" + round(player.maxHealth,0);
  document.getElementById("stat-cash").innerHTML = "Cash: $" + round(player.cash,0);
  document.getElementById("stat-stamina").innerHTML = "Stamina: " + round(player.stamina,0) + "/" + round(player.maxStamina,0);
  document.getElementById("stat-fullness").innerHTML = "Fullness: " + round(player.fullness(),0);
  if (player.prefs.scat) {
    document.getElementById("stat-bowels").innerHTML = "Bowels: " + round(player.bowels.fullness,0);
  } else {
    document.getElementById("stat-bowels").innerHTML = "";
  }
}

function advanceTime(amount) {
  time = (time + amount);

  date += Math.floor(time / 86400);

  time = time % 86400;

  player.restoreHealth(amount);
  player.restoreStamina(amount);
  update(player.stomach.digest(amount));
  update(player.butt.digest(amount));
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

function moveToByName(roomName, desc="You go places lol") {
  moveTo(world[roomName], desc);
}

function moveTo(room,desc="You go places lol") {
  actions = [];
  currentRoom = room;
  advanceTime(30);

  currentRoom.objects.forEach(function (object) {
    object.actions.forEach(function (action) {
      if (action.conditions == undefined || action.conditions.reduce((result, cond) => result && cond(player.prefs), true))
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
  world = createWorld();
  currentRoom = world["Bedroom"];
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
  player.species = settings.species;

  for (let key in settings) {
    if (settings.hasOwnProperty(key)) {
      if (key.match(/prefs/)) {
        let tokens = key.split("-");
        let pref = player.prefs;
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
  document.getElementById("foe-stats").style.display = "none";
  body.className = "";
  switch(mode) {
    case "explore":
    case "dialog":
      body.classList.add("explore");
      break;
    case "combat":
      body.classList.add("combat");
      document.getElementById("foe-stats").style.display = "block";
      break;
    case "eaten":
      body.classList.add("eaten");
      document.getElementById("foe-stats").style.display = "block";
      break;
  }

  updateDisplay();
}

function respawn(respawnRoom) {

  if (killingBlow.gameover == undefined) {
    if (player.prefs.prey) {
      deaths.push("Digested by " + currentFoe.description("a") + " at " + renderTime(time) + " on day " + date);
    } else {
      deaths.push("Defeated by " + currentFoe.description("a") + " at " + renderTime(time) + " on day " + date);
    }
  } else {
    deaths.push(killingBlow.gameover() + " at " + renderTime(time) + " on day " + date);
  }


  moveTo(respawnRoom,"You drift through space and time...");
  player.clear();
  player.stomach.contents = [];
  player.butt.contents = [];
  player.bowels.contents = [];
  player.bowels.fullness = 0;
  advanceTime(Math.floor(86400 / 2 * (Math.random() * 0.5 - 0.25 + 1)));
  changeMode("explore");
  player.health = 100;
  update(["You wake back up in your bed."]);
}

function startCombat(opponent) {
  currentFoe = opponent;
  changeMode("combat");
  update(opponent.startCombat());
}

function attackClicked(index) {
  update(playerAttacks[index].attack(currentFoe).concat([newline]));

  if (currentFoe.health <= 0) {
    currentFoe.defeated();
  } else if (mode == "combat") {
    let attack = pick(filterPriority(filterValid(currentFoe.attacks, currentFoe, player)), currentFoe, player);

    if (attack == null) {
      attack = currentFoe.backupAttack;
    }

    update(attack.attackPlayer(player).concat([newline]));

    if (player.health <= -100) {
      killingBlow = attack;
      update(["You die..."]);
      respawn(respawnRoom);
    } else if (player.health <= 0) {
      update(["You fall to the ground..."]);
      if (player.prefs.prey) {
        changeMode("eaten");
      } else {
        killingBlow = attack;
        update(["You die..."]);
        respawn(respawnRoom);
      }
    }
  }
}

function attackHovered(index) {
  document.getElementById("combat-desc").innerHTML = playerAttacks[index].desc;
}

function struggleClicked(index) {
  let struggle = struggles[index];

  let result = struggle.struggle(player);

  update(result.lines.concat([newline]));

  if (result.escape == "stay") {
    changeMode("combat");
  } else if (result.escape == "escape") {
    changeMode("explore");
  } else {
    let digest = pick(filterValid(currentFoe.digests, currentFoe, player), currentFoe, player);

    if (digest == null) {
      digest = currentFoe.backupDigest;
    }

    update(digest.digest(player).concat([newline]));

    if (player.health <= -100) {
      killingBlow = digest;
      update(currentFoe.finishDigest().concat([newline]));
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
  update(currentDialog.text);
  currentDialog.visit();
  updateDisplay();
}

function dialogClicked(index) {
  currentDialog = currentDialog.choices[index].node;
  update(currentDialog.text);
  currentDialog.visit();
  if (currentDialog.choices.length == 0 && mode == "dialog") {
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

  document.getElementById("compass-look").addEventListener("click", look, false);
}

function look() {
  update([currentRoom.description]);
}
