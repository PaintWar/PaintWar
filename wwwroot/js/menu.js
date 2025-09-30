import joinLobby from "./lobby.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/menuHub").withAutomaticReconnect().build();

const playerNameInput = document.getElementById("playerNameInput");
const lobbyIdInput = document.getElementById("lobbyIdInput");
const playerNameButton = document.getElementById("playerNameButton");
const joinLobbyButton = document.getElementById("joinLobbyButton");
const newLobbyButton = document.getElementById("newLobbyButton");

playerNameButton.disabled = true;
joinLobbyButton.disabled = true;
newLobbyButton.disabled = true;

connection.start().then(function () {
    playerNameButton.disabled = false;
    joinLobbyButton.disabled = false;
    newLobbyButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

if (localStorage.getItem("UUID") == null) {
    localStorage.setItem("UUID", crypto.randomUUID());
}

if (localStorage.getItem("playerName") == null) {
    localStorage.setItem("playerName", generateNewName());
}

playerNameInput.value = localStorage.getItem("playerName");

function generateNewName() {
    // https://www.yourdictionary.com/articles/list-adjectives
    const adjectiveList = [ "Adorable", "Adventurous", "Aggressive", "Agreeable", "Alert", "Alive", "Amused", "Angry", "Annoyed", "Annoying", "Anxious", "Arrogant", "Ashamed", "Attractive", "Average", "Awful", "Bad", "Beautiful", "Better", "Bewildered", "Black", "Bloody", "Blue", "Blue-eyed", "Blushing", "Bored", "Brainy", "Brave", "Breakable", "Bright", "Busy", "Calm", "Careful", "Cautious", "Charming", "Cheerful", "Clean", "Clear", "Clever", "Cloudy", "Clumsy", "Colorful", "Combative", "Comfortable", "Concerned", "Condemned", "Confused", "Cooperative", "Courageous", "Crazy", "Creepy", "Crowded", "Cruel", "Curious", "Cute", "Dangerous", "Dark", "Dead", "Defeated", "Defiant", "Delightful", "Depressed", "Determined", "Different", "Difficult", "Disgusted", "Distinct", "Disturbed", "Dizzy", "Doubtful", "Drab", "Dull", "Eager", "Easy", "Elated", "Elegant", "Embarrassed", "Enchanting", "Encouraging", "Energetic", "Enthusiastic", "Envious", "Evil", "Excited", "Expensive", "Exuberant", "Fair", "Faithful", "Famous", "Fancy", "Fantastic", "Fierce", "Filthy", "Fine", "Foolish", "Fragile", "Frail", "Frantic", "Friendly", "Frightened", "Funny", "Gentle", "Gifted", "Glamorous", "Gleaming", "Glorious", "Good", "Gorgeous", "Graceful", "Grieving", "Grotesque", "Grumpy", "Handsome", "Happy", "Healthy", "Helpful", "Helpless", "Hilarious", "Homeless", "Homely", "Horrible", "Hungry", "Hurt", "Ill", "Important", "Impossible", "Inexpensive", "Innocent", "Inquisitive", "Itchy", "Jealous", "Jittery", "Jolly", "Joyous", "Kind", "Lazy", "Light", "Lively", "Lonely", "Long", "Lovely", "Lucky", "Magnificent", "Misty", "Modern", "Motionless", "Muddy", "Mushy", "Mysterious", "Nasty", "Naughty", "Nervous", "Nice", "Nutty", "Obedient", "Obnoxious", "Odd", "Old-fashioned", "Open", "Outrageous", "Outstanding", "Panicky", "Perfect", "Plain", "Pleasant", "Poised", "Poor", "Powerful", "Precious", "Prickly", "Proud", "Putrid", "Puzzled", "Quaint", "Real", "Relieved", "Repulsive", "Rich", "Scary", "Selfish", "Shiny", "Shy", "Silly", "Sleepy", "Smiling", "Smoggy", "Sore", "Sparkling", "Splendid", "Spotless", "Stormy", "Strange", "Stupid", "Successful", "Super", "Talented", "Tame", "Tasty", "Tender", "Tense", "Terrible", "Thankful", "Thoughtful", "Thoughtless", "Tired", "Tough", "Troubled", "Ugliest", "Ugly", "Uninterested", "Unsightly", "Unusual", "Upset", "Uptight", "Vast", "Victorious", "Vivacious", "Wandering", "Weary", "Wicked", "Wide-eyed", "Wild", "Witty", "Worried", "Worrisome", "Wrong", "Zany", "Zealous" ];
    // https://leverageedu.com/explore/learn-english/list-of-singular-and-plural-words
    const nounList = [ "Aircraft", "Analysis", "Appendix", "Apple", "Axis", "Baby", "Bacterium", "Banana", "Basis", "Beach", "Bench", "Book", "Box", "Boy", "Branch", "Brush", "Bus", "Cactus", "Car", "Cat", "Chair", "Child", "Child", "Church", "Class", "Company", "Country", "Crisis", "Criterion", "Cup", "Curriculum", "Day", "Deer", "Diagnosis", "Dish", "Dog", "Elf", "Family", "Fish", "Fish", "Foot", "Foot", "Fungus", "Goose", "Half", "Hero", "Hoof", "Leaf", "Library", "Life", "Loaf", "Louse", "Mango", "Medium", "Memorandum", "Monkey", "Moose", "Mouse", "Mouse", "Nucleus", "Oasis", "Octopus", "Ox", "Parenthesis", "Party", "Pen", "Pencil", "Penny", "Person", "Person", "Phenomenon", "Plate", "Potato", "Radius", "Roof", "Scarf", "Self", "Sheep", "Spoon", "Story", "Student", "Syllabus", "Table", "Teacher", "Thesis", "Tooth", "Tooth", "Toy", "Tree", "Watch" ];

    return adjectiveList.sort(() => 0.5 - Math.random())[0] + nounList.sort(() => 0.5 - Math.random())[0];
}

function setName() {
    const name = playerNameInput.value.trim();
    localStorage.setItem("playerName", name);
    playerNameInput.value = name;
}

playerNameButton.addEventListener("click", e => {
    setName();
    e.preventDefault();
});

playerNameInput.addEventListener("keypress", e => {
	if (e.key == "Enter") {
        setName();
        e.preventDefault();
	}
});

playerNameInput.addEventListener("focus", () => {
    playerNameInput.select();
})

function joinLobbyRequest() {
    const lobbyId = lobbyIdInput.value.trim();
    connection.invoke("JoinLobby", lobbyId, localStorage.getItem("UUID"), localStorage.getItem("playerName")).catch(function (err) {
        return console.error(err.toString());
    });
}

joinLobbyButton.addEventListener("click", e => {
    joinLobbyRequest();
    e.preventDefault();
});

lobbyIdInput.addEventListener("focus", () => {
    lobbyIdInput.select();
})

lobbyIdInput.addEventListener("keypress", e => {
	if (e.key == "Enter") {
		joinLobbyRequest();
        e.preventDefault();
	}
});

newLobbyButton.addEventListener("click", function (e) {
    connection.invoke("NewLobby", localStorage.getItem("UUID"), localStorage.getItem("playerName")).catch(function (err) {
        return console.error(err.toString());
    });
    e.preventDefault();
});

connection.on("JoinLobby", function (id) {
    joinLobby(id);
});

connection.on("JoinFailedNonExistentLobby", function () {
    console.log("Failed to join lobby, no such lobby");
});

connection.on("JoinFailedMatchInProgress", function () {
    console.log("Failed to join lobby, match already started");
});

connection.on("JoinFailedLobbyFull", function () {
    console.log("Failed to join lobby, lobby is full");
});