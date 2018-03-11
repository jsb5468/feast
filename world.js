"use strict";

/*jshint browser: true*/
/*jshint devel: true*/

let NORTH = 0;
let NORTH_EAST = 1;
let EAST = 2;
let SOUTH_EAST = 3;
let SOUTH = 4;
let SOUTH_WEST = 5;
let WEST = 6;
let NORTH_WEST = 7;

let startLocation = "Bedroom";

let locations = {};

let locationsSrc = [
  {
    "name": "Bedroom",
    "desc": "A bedroom. It has a bed in it.",
    "conn": [
      {
        "name": "Bathroom",
        "dir": EAST,
        "desc": "You step into your bathroom."
      },
      {
        "name": "Living Room",
        "dir": NORTH,
        "desc": "You walk into the living room."
      }
    ],
    "objs": [
      Bed
    ],
  },
  {
    "name": "Bathroom",
    "desc": "Your modest bathroom.",
    "conn": [
      {
        "name": "Bedroom",
        "dir": WEST,
        "desc": "You walk back into your bedroom."
      }
    ],
    "objs": [
      Toilet
    ]
  },
  {
    "name": "Living Room",
    "desc": "A bare living room",
    "conn": [
      {
        "name": "North Street",
        "dir": WEST,
        "desc": "You step outside."
      },
      {
        "name": "Bedroom",
        "dir": SOUTH,
        "desc": "You walk into your bedroom."
      }
    ],
    "objs": [
      TV,
      Phone
    ]
  },
  {
    "name": "North Street",
    "desc": "It's a street",
    "conn": [
      {
        "name": "Alley",
        "dir": WEST,
        "desc": "You wander into the dark alley"
      },
      {
        "name": "Living Room",
        "dir": EAST,
        "desc": "You step back into your apartment"
      },
      {
        "name": "Crossroads",
        "dir": SOUTH,
        "desc": "You walk south"
      },
      {
        "name": "DANGER ZONE",
        "dir": NORTH,
        "desc": "You walk into the DANGER ZONE"
      }
    ],
    "objs": [
      Nerd
    ]
  },
  {
    "name": "Alley",
    "desc": "A suspicious alley",
    "conn": [
      {
        "name": "North Street",
        "dir": EAST,
        "desc": "You hurry back into the open street."
      },
      {
        "name": "Seedy Bar",
        "dir": NORTH,
        "desc": "You step into the bar."
      }
    ]
  },
  {
    "name": "Seedy Bar",
    "desc": "God this place is seedy",
    "conn": [
      {
        "name": "Alley",
        "dir": SOUTH,
        "desc": "You step out of the bar"
      }
    ]
  },
  {
    "name": "Crossroads",
    "desc": "Where the roads cross",
    "conn": [
      {
        "name": "North Street",
        "dir": NORTH,
        "desc": "You walk north"
      },
      {
        "name": "South Street",
        "dir": SOUTH,
        "desc": "You walk south"
      }
    ]
  },
  {
    "name": "South Street",
    "desc": "This street is in the south",
    "conn": [
      {
        "name": "Crossroads",
        "dir": NORTH,
        "desc": "You walk to the crossroads"
      }
    ]
  },
  {
    "name": "DANGER ZONE",
    "desc": "THE DANGER ZONE",
    "conn": [
      {
        "name": "North Street",
        "dir": SOUTH,
        "desc": "You walk out of the DANGER ZONE"
      },
      {
        "name": "SUPER DANGER ZONE",
        "dir": NORTH,
        "desc": "Getting eaten is fun!",
      }
    ],
    "hooks": [
      function() {
        startCombat(new Anthro());
      }
    ]
  },
  {
    "name": "SUPER DANGER ZONE",
    "desc": "Very dangerous",
    "conn": [
      {
        "name": "DANGER ZONE",
        "dir": SOUTH,
        "desc": "You hurriedly leave the SUPER DANGER ZONE"
      }
    ],
    "hooks": [
      function() {
        startCombat(new Fen());
      }
    ],
    "conditions": [
      function(prefs) { return prefs.player.prey; }
    ]
  }
];

function Location(name="Nowhere",desc="Nada") {
  this.name = name;
  this.description = desc;
  this.exits = [null,null,null,null,null,null,null,null];
  this.exitDescs = [null,null,null,null,null,null,null,null];
  this.objects = [];
  this.hooks = [];
  this.conditions = [];

  this.visit = function() {
    this.hooks.forEach(function (x) {
      x();
    });
  };
}

function opposite(direction) {
  return (direction + 4) % 8;
}

function connectLocations(loc1,loc2,dir,desc) {
  if (loc1.exits[dir] != null) {
    alert(loc1.name + " is already connected to " + loc1.exits[dir].name);
    return;
  } else {
    if (dir >= 0 && dir <= 7) {
      loc1.exits[dir] = loc2;
      loc1.exitDescs[dir] = desc;
    } else {
      alert("Invalid direction given when linking " + loc1.name + " and " + loc2.name + ": " + dir);
    }
  }
}

function createWorld() {
  for (let i = 0; i < locationsSrc.length; i++) {
    let src = locationsSrc[i];
    let location = new Location(src.name,src.desc);
    locations[src.name] = location;
    if (src.objs != undefined) {
      src.objs.forEach(function (obj) {
        location.objects.push(new obj());
      });
    }
    if (src.hooks != undefined) {
      src.hooks.forEach(function (hook) {
        location.hooks.push(hook);
      });
    }
    if (src.conditions != undefined) {
      src.conditions.forEach(function (cond) {
        location.conditions.push(cond);
      });
    }

  }

  for (let i = 0; i < locationsSrc.length; i++) {
    let src = locationsSrc[i];
    let from = locations[src.name];
    for (let j = 0; j < src.conn.length; j++) {
      let to = locations[src.conn[j].name];
      connectLocations(from, to, src.conn[j].dir, src.conn[j].desc);
    }
  }

  return locations[startLocation];
}
