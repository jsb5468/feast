"use strict";

let NORTH = 0;
let NORTH_EAST = 1;
let EAST = 2;
let SOUTH_EAST = 3;
let SOUTH = 4;
let SOUTH_WEST = 5;
let WEST = 6;
let NORTH_WEST = 7;

/*jshint browser: true*/
/*jshint devel: true*/

function Location(name="Nowhere") {
  this.name = name;
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
  let bedroom = new Location("Bedroom");
  let bathroom = new Location("Bathroom");
  let livingroom = new Location("Living Room");

  connectLocations(bedroom,bathroom,EAST);
  connectLocations(bedroom,livingroom,NORTH);

  return bedroom;
}
