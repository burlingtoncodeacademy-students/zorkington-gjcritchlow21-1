/*---------Boiler Plate Code------------*/

const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);
//ask function that returns
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/*----------------Functions------------------*/

// function to steralize words
function cleanWords(dirtyWord) {
  let steralize = dirtyWord.toString().trim().toLowerCase();
  return steralize;
}

// function for health gain while eating food
function healthGain(food) {
  // if statement for eating a roast
  if (player.inventory.includes(food) && food === "roast") {
    player.inventory.splice(player.inventory.indexOf(food), 1);
    player.currentHealth = 7;
    console.log("You restored all your health\n");
  }
  // if statement for eating a snickers
  else if (player.inventory.includes(food) && food === "snickers") {
    player.inventory.splice(player.inventory.indexOf(food), 1);
    player.currentHealth = player.currentHealth + 4;
    console.log(
      "You gained 5 points of health, but time is still running out!\n"
    );
  }
  //if statement for eating garlic
  else if (player.inventory.includes(food) && food === "garlic") {
    player.inventory.splice(player.inventory.indexOf(food), 1);
    player.currentHealth = player.currentHealth + 1;
    console.log("You have gained 1 point of health, but at what cost?\n");
  }
  //if statement for eating candycorn
  else if (player.inventory.includes(food) && food === "candycorn") {
    player.inventory.splice(player.inventory.indexOf(food), 1);
    player.currentHealth = player.currentHealth + 1;
    console.log(
      "You pop in some of the original candycorn, circa 1922. Although your integrity is questioned, you gain 1 point of health\n"
    );
  }
  //console log for something other then these foods
  else {
    console.log("You cant eat that!\n");
  }
}

// function to pick up objects
function takeStuff(thingIWant) {
  let canITakeIt = itemLookUp[thingIWant];
  //seeing if the object even exists in the game
  if (!canITakeIt) {
    console.log("I'm not sure that exists here. Want to try something else?\n");
  }
  //if the object does exist and it can be taken.
  else if (
    canITakeIt.takeable === true &&
    player.location.inv.includes(thingIWant)
  ) {
    player.location.inv.splice(player.location.inv.indexOf(thingIWant), 1);
    player.inventory.push(thingIWant);
    console.log("You have now picked up " + thingIWant);
  }
  //if the object cant be taken
  else {
    console.log("This is not yours to take!\n");
  }
}

//function to put objects down
function dropStuff(trash) {
  if (player.inventory.includes(trash)) {
    player.inventory.splice(player.inventory.indexOf(trash), 1);
    player.location.inv.push(trash);
    console.log("You have now dropped " + trash);
  } else {
    console.log("You can't drop what you don't have!\n");
  }
}

//function to look at things
function examine(thingToSee) {
  let lookAt = itemLookUp[thingToSee];
  if (player.location.inv.includes(thingToSee)) {
    console.log(lookAt.desc);
  } else {
    console.log("I'm not sure what you're trying to do\n");
  }
}

//function for health loss
function healthLoss() {
  if (player.currentHealth >= 0) {
    player.currentHealth = player.currentHealth - 1;
    //when player health hits 5, send a message saying you need food
    if (player.currentHealth === 5) {
      console.log(
        "Your starting to feel a bit hungry, Maybe you should get some food\n"
      );
    }
    // when the player health hits 3, it constantly reminds the player it needs food
    if (player.currentHealth <= 3 && player.currentHealth > 0) {
      console.log(
        "Your stomach growls and you start to feel a bit woozey. Food is a necessity\n"
      );
    }
    // player ded
    if (player.currentHealth === 0) {
      console.log(
        "You have starved to death, you are now one of us. better luck next time.\n"
      );
      process.exit();
    }
  }
}

//function for moving from room to room and to encorporate health loss per room as well as using a key to unlock doors
function enterState(newState) {
  let validTransitions = houseRooms[currentState].canChangeTo;
  // looking to see if the new room is a valid place to move and if it is locked.
  if (
    validTransitions.includes(newState) &&
    roomLookUp[newState].locked === true
  ) {
    // if it is locked, and they have a key, they can pass through the door
    if (player.inventory.includes("key")) {
      outside.locked = false;
      currentState = newState;
      let stateForTable = roomLookUp[currentState];
      //description for the rooms
      console.log(stateForTable.desc);
      //player health loss for each room moved
      healthLoss();
      console.log("Player's current health is: " + player.currentHealth);
    }
    //if player doesnt have a key, they cant pass through a locked door
    else {
      console.log(
        "The door before you is locked. Maybe you should find a key.\n"
      );
    }
  }
  //if the room exists and the door is not locked
  else if (
    validTransitions.includes(newState) &&
    roomLookUp[newState].locked === false
  ) {
    //reassign current state to new state
    currentState = newState;
    //varaible to grab room descr
    let stateForTable = roomLookUp[currentState];
    //tools to defeat the boss
    let tools = ["stake", "garlic"];


    //if statement for vampire boss fight COME BACK TO THIS

    //if check to make sure player has the tools to defeat the boss or dies
    if (currentState === "basement" && !player.inventory.includes(tools)) {
      console.log(
        "You reach the bottom of the stairs to the basement and before you can reach for a light, there is a CRASH! All of the sudden, out of the shadows emerges a large dark figure and before you can even process what is infront of you. It reaches out, grabs you by the shoulders and pulls you close\nYou feel a slight prick, but it's too late, you can feel the blood begin to quickly leave your body as the vampire begins his meal.\nYou were missing some key things to help you fend of this monster and have died, forever trapped as a soul in this house.\n"
      );
      process.exit();
    }


    
    //console log the room descriptions
    console.log(stateForTable.desc);
    //player health loss for each room they move
    healthLoss();
    console.log("Player's current health is: " + player.currentHealth);
  }
  //if the room change is invalid
  else {
    console.log(
      "That doesn't seem to be a place I know about. Care to try again?"
    );
  }
  //change player location
  player.location = roomLookUp[currentState];
}

/*---------------------------------Player----------------------------------------*/

//the player object
const player = {
  inventory: [],
  currentHealth: 7,
  location: null,
};

/*----------------------Rooms-----------------------*/

//class for creating all of the rooms
class Room {
  constructor(name, desc, inv) {
    this.name = name;
    this.desc = desc;
    this.inv = inv;
    this.locked = false;
  }
}

//room definitions
let outside = new Room("Outside", "THis is the outside you can move", [], true);

const foyer = new Room(
  "Foyer",
  "You stand in the middle of a small room with peeling, yellowed wallpaper. The door to outside is to one side and to the other, sits a door that leads into what looks like the lounge.\n",
  []
);

const lounge = new Room(
  "Lounge",
  "Entering the lounge, you see furniture draped in sheets that are covered in dust and mold. The air is thick and stagnant and the little light that shines through the film on the windows casts a brown tint throughout the room. There is a dusty table in front of the couch and on it sits an old newspaper, yellowed by time. On one side of the room is a flight of stairs going down to the basement. The opposite side has a hallway. To the far side of the room is a door that leads to the Kitchen. Behind you is the door back to the Foyer.\n",
  ["newspaper"]
);

const kitchen = new Room(
  "Kitchen",
  "The kitchen is filthy. The countertop against the wall in front of you is covered in a brown sticky film. In the middle of the floor there is a broom broken into a few pieces, one of the pieces looks like it would make a good stake. Six cabinets sit underneath the countertop but only two have doors, in the others you can see there's some garlic and what looks to be an empty bag of candycorn. Above the countertop sit another four cabinets all with doors intact. A refrigerator sits against one wall and appears to be running. The oven against the opposite wall also seems to be in working as well. The smell of a roast fills the air. You seem put off by it but also quite curious. The door to the lounge is behind you.\n",
  ["roast", "garlic", "stake", "candycorn"]
);

const hallway = new Room(
  "Hallway",
  "Leaving the lounge, you turn and see a small hallway with a filthy window at the end. There are two doors on either side of the hallway, one looks like the Master Bedchamber and the other looks to be a little girls bedroom.\n",
  []
);

const bedchamber = new Room(
  "Bedchamber",
  "Once you enter the master bedroom, you see a huge king-sized bed. On each side sits an end table, each with a lamp. Above the lamps on both sides of the bed are two framed pictures, one of a man in his early 30s in a black suit that looks dated. The other picture features a woman in her late 20's in a shimmering gold dress with black trim that seems to match with the era of the other picture. Against one wall sits a long dresser with two columns of four drawers. On top the dresser sits a pristine, silver jewelry box with pearl trim that appears untouched by time, next to it sits a key. On the opposite wall is a large vanity with cracked mirror. The drawers sit half open with what appears to be nothing in them. The door back into the hallway remains open.\n",
  ["key", "snickers"]
);

const bedroom = new Room(
  "Bedroom",
  "This room has a dingy pale pink wallpaper that is almost peeling off. In the middle of the room is a small metal framed bed and with a stained mattress and small pillow. Against the east wall is a small dresser with three drawers. To the west wall sits rocking horse that is continuously rocking. The way back into the hallway is behind you\n",
  ["doorknob"]
);

const basement = new Room(
  "Basement",
  "The dark and dreery basement smells of dirt and mold. The flight of stairs back up to the lounge remains illuminated by the light coming in throught the windows. The dingy light shows cobblestone walls and a dirt floor, huddled in the corner is a black figure that looks at you menacingly. Maybe you should leave\n",
  []
);

outside.locked = true;

/* ----------------------------------Items-------------------------------------------*/

//class for creating items
class Item {
  constructor(name, desc, takeable) {
    this.name = name;
    this.desc = desc;
    this.takeable = takeable;
  }
}

//item descriptions
const newspaper = new Item(
  "News Paper",
  'An old, deteriorating newspaper is sitting on the table. As you peer over it you can see the date, it\'s from 1890, You are able to read the headline. It says: "Mercy Brown and Family found dead! Neighbors believe it to be the work of the undead!" You chuckle at the thought of people believing things like this.\n',
  false
);

const key = new Item(
  "Key",
  "An old brass key, you think this is important\n",
  true
);

const doorknob = new Item("Door Knob", "An ornate doorknob\n", true);

const garlic = new Item(
  "Garlic",
  "A bulb of garlic that looks strangely fresh\n",
  true
);

const stake = new Item(
  "stake",
  "A wooden stake, it looks like it might have once been a broom handle\n",
  true
);

const candyCorn = new Item(
  "CandyCorn",
  "A bag of old candycorn, It looks like there's one piece left in it.\n",
  true
);

const roast = new Item(
  "Roast",
  "A roast that has been sitting in the oven, it still is hot. Strangely it smells good.\n",
  true
);

const snickersBar = new Item(
  "Snickers",
  "A Snickers sitting in an unopened wrapper.\n",
  true
);

const tbCure = new Item(
  "The Cure to Tuberculosis",
  "A strange vial that looks like medicine, reading the label you see it's a cure for Tuberculosis\n",
  true
);

/* ------------------------------Look up Tables----------------------------------*/

//look up table for rooms
let roomLookUp = {
  outside: outside,
  foyer: foyer,
  lounge: lounge,
  kitchen: kitchen,
  hallway: hallway,
  bedchamber: bedchamber,
  bedroom: bedroom,
  basement: basement,
};

//look up table for items
let itemLookUp = {
  newspaper: newspaper,
  key: key,
  doorknob: doorknob,
  garlic: garlic,
  stake: stake,
  candycorn: candyCorn,
  roast: roast,
  snickers: snickersBar,
  "tb cure": tbCure,
};

//look up table for actions
const actions = {
  move: ["move", "go", "walk", "run", "enter"],
  consume: ["eat", "consume"],
  grab: ["grab", "take"],
  examine: ["examine", "read"],
  drop: ["drop", "throw", "leave"],
};

/*---------------State Changes---------------*/

//table for what rooms connect to eachother
let houseRooms = {
  outside: { canChangeTo: ["foyer"] },
  foyer: { canChangeTo: ["lounge", "outside"] },
  lounge: { canChangeTo: ["foyer", "kitchen", "hallway", "basement"] },
  kitchen: { canChangeTo: ["lounge"] },
  hallway: { canChangeTo: ["bedchamber", "bedroom", "lounge"] },
  bedchamber: { canChangeTo: ["hallway"] },
  bedroom: { canChangeTo: ["hallway"] },
  basement: { canChangeTo: ["lounge"] },
};

//starting room for player
let currentState = "foyer";

/*----------------------------------Story--------------------------------------------*/

//intro prompt for if you want to play the game.
async function intro() {
  const introMessage = `Welcome Risk Seeker! You are about to embark on a scary adventure! Please word your actions in a [Action] followed by [Item/Room] format. If you would like to look at your inventory you can do this by typing [C] at any time. You can also check on a rooms inventory by typing the letter [I] at any time. Please refer to rooms by their name, and cheaters will be punished to the full extent of my abilities.`;

  let startPrompt = await ask(
    introMessage + "\n" + "Do you understand? Yes or No \n>_"
  );
  let cleanStart = cleanWords(startPrompt);
  console.log(cleanStart);
  if (cleanStart === "yes") {
    start();
  } else {
    // you really shouldnt be saying no here but that's your choice.
    console.log("Probably best to try a different game then. Good Bye.");
    process.exit();
  }
}

intro();
// start of the actual game.
async function start() {
  const welcomeMessage = `You heard about a haunted house in the next town over. Curiosity got the best of you so you decided to go check it out on your day off. As you arrive you see a rundown, two story house. You notice the windows are covered in filth and no longer allow the light through. The overgrowth of plant life indicates that nobody has lived here for years. You approach a creepy red door that's stained with dirt and mold. As you reach for the handle you notice that it appears to be heavily used, even to this day. You think nothing of it. As you walk through the door, a chill runs down your spine. Before you realize it the door has closed behind you with an audible *click*. You start to panic. In front of you appears the ghost of a little girl. Her skin is pale and her dress that was once blue is now stained and tattered. Her jet black hair covers her face. As she raises her head slowly you notice her lifeless eyes looking at you and you hear her say "I love making new friends. Did you come here to play with me? If not you better find a way out fast!" She slowly fades out of sight. You're in the front entrance. There's the door to go back outside behind you and a door into what looks like a lounge in front of you. 
  
  What would you like to do?`;

  console.log(welcomeMessage);
  // setting player into the start of the game and setting location to foyer
  player.location = foyer;
  //a loop to constantly let player have a prompt to input information
  while (player.currentHealth > 0 && player.location !== outside) {
    // user input, sanitizaiton, and splitting things into arrays and variables linked to each stage
    let dirtyInput = await ask(">_");
    let cleanInput = cleanWords(dirtyInput);
    let cleanArray = cleanInput.split(" ");
    let command = cleanArray[0];
    let activity = cleanArray[cleanArray.length - 1];
    // allow user to look at inventory
    if (cleanInput === "i") {
      if (player.location.inv.length === 0) {
        console.log("There is nothing here...");
      } else {
        player.location.inv.forEach(function (obj) {
          console.log(obj);
        });
      }
    }
    //allow user to look at player inventory
    else if (cleanInput === "c") {
      if (player.inventory.length === 0) {
        console.log("Your current health is: " + player.currentHealth);
        console.log(
          "You don't seem to be carrying anything. Would you like to pick something up?"
        );
      } else {
        console.log("Your current health is: " + player.currentHealth);
        player.inventory.forEach(function (obj) {
          console.log(obj);
        });
      }
    }
    //cheat codes that backfire because cheaters look for the easy way out.
    else if (cleanInput === "xyzzy") {
      console.log("Cheaters never prosper.");
      process.exit();
    }
    //if statements using every action you can do
    else if (actions.move.includes(command)) {
      enterState(activity);
    } else if (actions.grab.includes(command)) {
      takeStuff(activity);
    } else if (actions.drop.includes(command)) {
      dropStuff(activity);
    } else if (actions.consume.includes(command)) {
      healthGain(activity);
    } else if (actions.examine.includes(command)) {
      examine(activity);
    }
    //safety clause in case input doesnt match commands
    else {
      console.log(
        "I'm not too sure how to do " + cleanInput + ". Care to try again?"
      );
    }
  }
  process.exit();
}
