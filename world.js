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
    "desc": "A bedroom",
    "conn": [
      {
        "name": "Bathroom",
        "dir": EAST
      },
      {
        "name": "Living Room",
        "dir": NORTH
      }
    ]
  },
  {
    "name": "Bathroom",
    "desc": "The bathroom",
    "conn": [

    ]
  },
  {
    "name": "Living Room",
    "desc": "A bare living room",
    "conn": [
      {
        "name": "Street",
        "dir": NORTH
      }
    ]
  },
  {
    "name": "Street",
    "desc": "It's a street",
    "conn": [
      {
        "name": "Alley",
        "dir": WEST
      }
    ]
  },
  {
    "name": "Alley",
    "desc": "A suspicious alley",
    "conn": [

    ]
  }
]

function Location(name="Nowhere",desc="Nada") {
  this.name = name;
  this.description = desc;
  this.exits = [null,null,null,null,null,null,null,null];
}

function opposite(direction) {
  return (direction + 4) % 8;
}

function connectLocations(loc1,loc2,loc1Exit) {
  if (loc1.exits[loc1Exit] != null) {
    alert(loc1.name + " is already connected to " + loc1.exits[loc1Exit].name);
    return;
  } else if (loc2.exits[opposite(loc1Exit)] != null) {
    alert(loc2.name + " is already connected to " + loc2.exits[opposite(loc1Exit)].name);
    return;
  } else {
    if (loc1Exit >= 0 && loc1Exit <= 7) {
      loc1.exits[loc1Exit] = loc2;
      loc2.exits[opposite(loc1Exit)] = loc1;
    }
  }
}

function createWorld() {
  for (let i = 0; i < locationsSrc.length; i++) {
    let src = locationsSrc[i];
    let location = new Location(src.name,src.desc);
    locations[src.name] = location;
  }

  for (let i = 0; i < locationsSrc.length; i++) {
    let src = locationsSrc[i];
    let from = locations[src.name];
    for (let j = 0; j < src.conn.length; j++) {
      let to = locations[src.conn[j].name];
      connectLocations(from, to, src.conn[j].dir);
    }
  }

  return locations[startLocation];
}
