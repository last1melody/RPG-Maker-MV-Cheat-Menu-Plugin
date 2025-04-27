

/////////////////////////////////////////////////
// Cheat Menu Plugin Class
/////////////////////////////////////////////////
// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu == "undefined") { Cheat_Menu = {}; }

Cheat_Menu.initialized = false;
Cheat_Menu.cheat_menu_open = false;
Cheat_Menu.overlay_openable = false;
Cheat_Menu.position = 1;
Cheat_Menu.menu_update_timer = null;

Cheat_Menu.cheat_selected = 0;
Cheat_Menu.cheat_selected_actor = 1;
Cheat_Menu.amounts = [1, 10, 100, 1000, 10000, 100000, 1000000];
Cheat_Menu.amount_index = 0;
Cheat_Menu.stat_selection = 0;
Cheat_Menu.item_selection = 1;
Cheat_Menu.weapon_selection = 1;
Cheat_Menu.armor_selection = 1;
Cheat_Menu.move_amounts = [0.5, 1, 1.5, 2];
Cheat_Menu.move_amount_index = 1;

Cheat_Menu.variable_selection = 1;
Cheat_Menu.switch_selection = 1;

Cheat_Menu.saved_positions = [{m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}];

Cheat_Menu.teleport_location = {m: 1, x: 0, y: 0};

Cheat_Menu.speed = null;
Cheat_Menu.speed_unlocked = true;
Cheat_Menu.speed_initialized = false;


/////////////////////////////////////////////////
// Initial values for reseting on new game/load
/////////////////////////////////////////////////

// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu.initial_values == "undefined") { Cheat_Menu.initial_values = {}; }


// All values below are the inital values for a new saved game
//	upon loading a saved game these values will be loaded from the
//	save game if possible overwriting the below values
//	Because of this all of these variables should be non recursive
Cheat_Menu.initial_values.position = 1;
Cheat_Menu.initial_values.cheat_selected = 0;
Cheat_Menu.initial_values.cheat_selected_actor = 1;
Cheat_Menu.initial_values.amount_index = 0;
Cheat_Menu.initial_values.stat_selection = 0;
Cheat_Menu.initial_values.item_selection = 1;
Cheat_Menu.initial_values.weapon_selection = 1;
Cheat_Menu.initial_values.armor_selection = 1;
Cheat_Menu.initial_values.move_amount_index = 1;
Cheat_Menu.initial_values.variable_selection = 1;
Cheat_Menu.initial_values.switch_selection = 1;
Cheat_Menu.initial_values.saved_positions = [{m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}];
Cheat_Menu.initial_values.teleport_location = {m: 1, x: 0, y: 0};
Cheat_Menu.initial_values.speed = null;
Cheat_Menu.initial_values.speed_unlocked = true;

/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

// enable god mode for an actor
Cheat_Menu.god_mode = function(actor) {
	if (actor instanceof Game_Actor && !(actor.god_mode)) {
		actor.god_mode = true;

		actor.gainHP_bkup = actor.gainHp;
		actor.gainHp = function(value) {
			value = this.mhp;
			this.gainHP_bkup(value);
		};

		actor.setHp_bkup = actor.setHp;
		actor.setHp = function(hp) {
			hp = this.mhp;
			this.setHp_bkup(hp);
		};

		actor.gainMp_bkup = actor.gainMp;
		actor.gainMp = function (value) {
			value = this.mmp;
			this.gainMp_bkup(value);
		};

		actor.setMp_bkup = actor.setMp;
		actor.setMp = function(mp) {
			mp = this.mmp;
			this.setMp_bkup(mp);
		};

		actor.gainTp_bkup = actor.gainTp;
		actor.gainTp = function (value) {
			value = this.maxTp();
			this.gainTp_bkup(value);
		};

		actor.setTp_bkup = actor.setTp;
		actor.setTp = function(tp) {
			tp = this.maxTp();
			this.setTp_bkup(tp);
		};

		actor.paySkillCost_bkup = actor.paySkillCost;
		actor.paySkillCost = function (skill) {
			// do nothing
		};

		actor.god_mode_interval = setInterval(function() {
			actor.gainHp(actor.mhp);
			actor.gainMp(actor.mmp);
			actor.gainTp(actor.maxTp());
		}, 100);
	}
};


// disable god mode for an actor
Cheat_Menu.god_mode_off = function(actor) {
	if (actor instanceof Game_Actor && actor.god_mode) {
		actor.god_mode = false;

		actor.gainHp = actor.gainHP_bkup;
		actor.setHp = actor.setHp_bkup;
		actor.gainMp = actor.gainMp_bkup;
		actor.setMp = actor.setMp_bkup;
		actor.gainTp = actor.gainTp_bkup;
		actor.setTp = actor.setTp_bkup;
		actor.paySkillCost = actor.paySkillCost_bkup;

		clearInterval(actor.god_mode_interval);
	}
};

// set all party hp
Cheat_Menu.set_party_hp = function(hp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setHp(hp);
		}
	}
};

// set all party mp
Cheat_Menu.set_party_mp = function(mp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setMp(mp);
		}
	}
};

// set all party tp
Cheat_Menu.set_party_tp = function(tp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setTp(tp);
		}
	}
};

// party full recover hp
Cheat_Menu.recover_party_hp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setHp(members[i].mhp);
		}
	}
};

// party full recover mp
Cheat_Menu.recover_party_mp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setMp(members[i].mmp);
		}
	}
};

// party max tp
Cheat_Menu.recover_party_tp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setTp(members[i].maxTp());
		}
	}
};

// set all enemies hp
Cheat_Menu.set_enemy_hp = function(hp, alive) {
	var members = $gameTroop.members();
	for (var i = 0; i < members.length; i++) {
		if (members[i]) {
			if ((alive && members[i]._hp != 0) || !alive) {
				members[i].setHp(hp);
			}
		}
	}
};

// increase exp
Cheat_Menu.give_exp = function(actor, amount) {
	if (actor instanceof Game_Actor) {
		actor.gainExp(amount);
	}
};

// increase stat bonus
Cheat_Menu.give_stat = function(actor, stat_index, amount) {
	if (actor instanceof Game_Actor) {
		if (actor._paramPlus[stat_index] != undefined) {
			actor.addParam(stat_index, amount);
		}
	}
};

// increase gold
Cheat_Menu.give_gold = function(amount) {
	$gameParty.gainGold(amount);
};

// increase item count for party of item, by id
Cheat_Menu.give_item = function(item_id, amount) {
	if ($dataItems[item_id] != undefined) {
		$gameParty.gainItem($dataItems[item_id], amount);
	}
};

// increase weapon count for party of item, by id
Cheat_Menu.give_weapon = function(weapon_id, amount) {
	if ($dataWeapons[weapon_id] != undefined) {
		$gameParty.gainItem($dataWeapons[weapon_id], amount);
	}
};

// increase armor count for party of item, by id
Cheat_Menu.give_armor = function(armor_id, amount) {
	if ($dataArmors[armor_id] != undefined) {
		$gameParty.gainItem($dataArmors[armor_id], amount);
	}
};

// initialize speed hook for locking
Cheat_Menu.initialize_speed_lock = function() {
	if (!Cheat_Menu.speed_initialized) {
		Cheat_Menu.speed = $gamePlayer._moveSpeed;
		Object.defineProperty($gamePlayer, "_moveSpeed", {
			get: function() {return Cheat_Menu.speed;},
			set: function(newVal) {if(Cheat_Menu.speed_unlocked) {Cheat_Menu.speed = newVal;}}
		});
		Cheat_Menu.speed_initialized = true;
	}
};

// change player movement speed
Cheat_Menu.change_player_speed = function(amount) {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed += amount;
};

// toggle locking of player speed
Cheat_Menu.toggle_lock_player_speed = function(amount) {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed_unlocked = !Cheat_Menu.speed_unlocked;
};


// clear active states on an actor
Cheat_Menu.clear_actor_states = function(actor) {
	if (actor instanceof Game_Actor) {
		if (actor._states != undefined && actor._states.length > 0) {
			actor.clearStates();
		}
	}
};

// clear active states on party
Cheat_Menu.clear_party_states = function() {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		Cheat_Menu.clear_actor_states(members[i]);
	}
};

// change game variable value, by id
Cheat_Menu.set_variable = function(variable_id, value) {
	if ($dataSystem.variables[variable_id] != undefined) {
		var new_value = $gameVariables.value(variable_id) + value;
		$gameVariables.setValue(variable_id, new_value);
	}
};

// toggle game switch value, by id
Cheat_Menu.toggle_switch = function(switch_id) {
	if ($dataSystem.switches[switch_id] != undefined) {
		$gameSwitches.setValue(switch_id, !$gameSwitches.value(switch_id));
	}
};

// Change location by map id, and x, y position
Cheat_Menu.teleport = function(map_id, x_pos, y_pos) {
	$gamePlayer.reserveTransfer(map_id, x_pos, y_pos, $gamePlayer.direction(), 0);
	$gamePlayer.setPosition(x_pos, y_pos);
};

/////////////////////////////////////////////////
// Cheat Menu overlay
/////////////////////////////////////////////////

// HTML elements and some CSS for positioning
//	other css in in CSS file attached
Cheat_Menu.overlay_box = document.createElement('div');
Cheat_Menu.overlay_box.id = "cheat_menu";
Cheat_Menu.overlay_box.style.left = "5px";
Cheat_Menu.overlay_box.style.top = "5px";
Cheat_Menu.overlay_box.style.right = "";
Cheat_Menu.overlay_box.style.bottom = "";

Cheat_Menu.overlay = document.createElement('table');
Cheat_Menu.overlay.id = "cheat_menu_text";
Cheat_Menu.overlay.style.left = "5px";
Cheat_Menu.overlay.style.top = "5px";
Cheat_Menu.overlay.style.right = "";
Cheat_Menu.overlay.style.bottom = "";


// Attach other css for styling
Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);


// keep menu in correct location
Cheat_Menu.position_menu = function(event) {
	//middle of screen
	if (Cheat_Menu.position == 0) {
		Cheat_Menu.overlay_box.style.left = "" + (window.innerWidth / 2) + "px";
		Cheat_Menu.overlay_box.style.top = "" + (window.innerHeight / 2) + "px";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "-110px";
		Cheat_Menu.overlay_box.style.marginTop = "-50px";

		Cheat_Menu.overlay.style.left = "" + (window.innerWidth / 2) + "px";
		Cheat_Menu.overlay.style.top = "" + (window.innerHeight / 2) + "px";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "-110px";
		Cheat_Menu.overlay.style.marginTop = "-50px";
	}
	// top left corner
	else if (Cheat_Menu.position == 1) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "5px";
		Cheat_Menu.overlay.style.top = "5px";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// top right corner
	else if (Cheat_Menu.position == 2) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "";
		Cheat_Menu.overlay.style.top = "5px";
		Cheat_Menu.overlay.style.right = "-15px";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// bottom right corner
	else if (Cheat_Menu.position == 3) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "5px";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "";
		Cheat_Menu.overlay.style.top = "";
		Cheat_Menu.overlay.style.right = "-15px";
		Cheat_Menu.overlay.style.bottom = "5px";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// bottom left corner
	else if (Cheat_Menu.position == 4) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "5px";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "5px";
		Cheat_Menu.overlay.style.top = "";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "5px";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	
	// adjust background box size to match contents
	var height = 20;
	for (var i = 0; i < Cheat_Menu.overlay.children.length; i++) {
		height += Cheat_Menu.overlay.children[i].scrollHeight;
	}
	Cheat_Menu.overlay_box.style.height = "" + height + "px";
};

/////////////////////////////////////////////////
// Menu item types
/////////////////////////////////////////////////

// insert row with buttons to scroll left and right for some context
//	appears as:
//	<-[key1] text [key2]->
//	scrolling is handled by scroll_left_handler and scroll_right_handler functions
//	text: string 
//	key1,key2: key mapping
//	scroll_handler: single function that handles the left and right scroll arguments should be (direction, event)
Cheat_Menu.append_scroll_selector = function(text, key1, key2, scroll_handler) {
	var scroll_selector = Cheat_Menu.overlay.insertRow();
	scroll_selector.className = "scroll_selector_row";

	var scroll_left_button = scroll_selector.insertCell();
	scroll_left_button.className = "scroll_selector_buttons cheat_menu_cell";

	
	var scroll_text = scroll_selector.insertCell();
	scroll_text.className = "cheat_menu_cell";

	var scroll_right_button = scroll_selector.insertCell();
	scroll_right_button.className = "scroll_selector_buttons cheat_menu_cell";
	
	scroll_left_button.innerHTML = "←[" + key1 + "]";
	scroll_text.innerHTML = text;
	scroll_right_button.innerHTML =  "[" + key2 + "]→";

	scroll_left_button.addEventListener('mousedown', scroll_handler.bind(null, "left"));
	scroll_right_button.addEventListener('mousedown', scroll_handler.bind(null, "right"));

	Cheat_Menu.key_listeners[key1] = scroll_handler.bind(null, "left");
	Cheat_Menu.key_listeners[key2] = scroll_handler.bind(null, "right");
};

// Insert a title row
//	A row in the menu that is just text
//	title: string
Cheat_Menu.append_title = function(title) {
	var title_row = Cheat_Menu.overlay.insertRow();
	var temp = title_row.insertCell()
	temp.className = "cheat_menu_cell_title";
	var title_text = title_row.insertCell();
	title_text.className = "cheat_menu_cell_title";
	temp = title_row.insertCell()
	temp.className = "cheat_menu_cell_title";
	title_text.innerHTML = title;
};

// Insert a desciption row
//	A row in the menu that is just text (smaller than title)
//	text: string
Cheat_Menu.append_description = function(text) {
	var title_row = Cheat_Menu.overlay.insertRow();
	var temp = title_row.insertCell()
	temp.className = "cheat_menu_cell";
	var title_text = title_row.insertCell();
	title_text.className = "cheat_menu_cell";
	temp = title_row.insertCell()
	temp.className = "cheat_menu_cell";
	title_text.innerHTML = text;
};

// Append a cheat with some handler to activate
//	Appears as:
//	cheat text	status text[key]
//	cheat_text: string
//	status_text: string 
//	key: key mapping
//	click_handler: function
Cheat_Menu.append_cheat = function(cheat_text, status_text, key, click_handler) {
	var cheat_row = Cheat_Menu.overlay.insertRow();

	var cheat_title = cheat_row.insertCell();
	cheat_title.className = "cheat_menu_cell"
	var temp = cheat_row.insertCell()
	temp.className = "cheat_menu_cell";
	var cheat = cheat_row.insertCell();
	cheat.className = "cheat_menu_buttons cheat_menu_cell";

	cheat_title.innerHTML = cheat_text;
	cheat.innerHTML = status_text + "[" + key + "]";

	cheat.addEventListener('mousedown', click_handler);
	Cheat_Menu.key_listeners[key] = click_handler;
};

/////////////////////////////////////////////////////////////
// Various functions to settup each page of the cheat menu
/////////////////////////////////////////////////////////////


// Left and right scrollers for handling switching between menus
Cheat_Menu.scroll_cheat = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.cheat_selected--;
		if (Cheat_Menu.cheat_selected < 0) {
			Cheat_Menu.cheat_selected = Cheat_Menu.menus.length - 1;
		}
	}
	else {
		Cheat_Menu.cheat_selected++;
		if (Cheat_Menu.cheat_selected > Cheat_Menu.menus.length - 1) {
			Cheat_Menu.cheat_selected = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Menu title with scroll options to go between menu, should be first
//	append on each menu
Cheat_Menu.append_cheat_title = function(cheat_name) {
	Cheat_Menu.append_title("Cheat");
	Cheat_Menu.append_scroll_selector(cheat_name, 2, 3, Cheat_Menu.scroll_cheat);
};

// Left and right scrollers for handling switching selected actors
Cheat_Menu.scroll_actor = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.cheat_selected_actor--;
		if (Cheat_Menu.cheat_selected_actor < 0) {
			Cheat_Menu.cheat_selected_actor = $gameActors._data.length - 1;
		}
	}
	else {
		Cheat_Menu.cheat_selected_actor++;
		if (Cheat_Menu.cheat_selected_actor >= $gameActors._data.length) {
			Cheat_Menu.cheat_selected_actor = 0;
		}
	}
	
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Append actor selection to the menu
Cheat_Menu.append_actor_selection = function(key1, key2) {
	Cheat_Menu.append_title("Actor");

	var actor_name;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._name) {
		actor_name = "<font color='#0088ff'>" + $gameActors._data[Cheat_Menu.cheat_selected_actor]._name + "</font>";
	}
	else {
		actor_name = "<font color='#ff0000'>NULL</font>";
	}

	Cheat_Menu.append_scroll_selector(actor_name, key1, key2, Cheat_Menu.scroll_actor);
};

// Hanler for the god_mode cheat
Cheat_Menu.god_mode_toggle = function(event) {
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
		if (!($gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode)) {
			Cheat_Menu.god_mode($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(1);
		}
		else {
			Cheat_Menu.god_mode_off($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(2);
		}
		Cheat_Menu.update_menu();
	}
};

// Append the god_mode cheat to the menu
Cheat_Menu.append_godmode_status = function() {
	var status_text;
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, 6, Cheat_Menu.god_mode_toggle);
};

// handler for the enemy hp to 0 cheat alive only
Cheat_Menu.enemy_hp_cheat_1 = function() {
	Cheat_Menu.set_enemy_hp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 1 cheat alive only
Cheat_Menu.enemy_hp_cheat_2 = function() {
	Cheat_Menu.set_enemy_hp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 0 cheat all
Cheat_Menu.enemy_hp_cheat_3 = function() {
	Cheat_Menu.set_enemy_hp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 1 cheat all
Cheat_Menu.enemy_hp_cheat_4 = function() {
	Cheat_Menu.set_enemy_hp(1, false);
	SoundManager.playSystemSound(1);
};

// Append the enemy hp cheats to the menu
Cheat_Menu.append_enemy_cheats = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", key1, Cheat_Menu.enemy_hp_cheat_1);
	Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", key2, Cheat_Menu.enemy_hp_cheat_2);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", key3, Cheat_Menu.enemy_hp_cheat_3);
	Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", key4, Cheat_Menu.enemy_hp_cheat_4);
};

// handler for the party hp cheat to 0 alive only
Cheat_Menu.party_hp_cheat_1 = function() {
	Cheat_Menu.set_party_hp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 1 alive only
Cheat_Menu.party_hp_cheat_2 = function() {
	Cheat_Menu.set_party_hp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to full alive only
Cheat_Menu.party_hp_cheat_3 = function() {
	Cheat_Menu.recover_party_hp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 0 all
Cheat_Menu.party_hp_cheat_4 = function() {
	Cheat_Menu.set_party_hp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 1 all
Cheat_Menu.party_hp_cheat_5 = function() {
	Cheat_Menu.set_party_hp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat full all
Cheat_Menu.party_hp_cheat_6 = function() {
	Cheat_Menu.recover_party_hp(false);
	SoundManager.playSystemSound(1);
};


// append the party hp cheats
Cheat_Menu.append_hp_cheats = function(key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party HP to 0", "Activate", key1, Cheat_Menu.party_hp_cheat_1);
	Cheat_Menu.append_cheat("Party HP to 1", "Activate", key2, Cheat_Menu.party_hp_cheat_2);
	Cheat_Menu.append_cheat("Party Full HP", "Activate", key3, Cheat_Menu.party_hp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party HP to 0", "Activate", key4, Cheat_Menu.party_hp_cheat_4);
	Cheat_Menu.append_cheat("Party HP to 1", "Activate", key5, Cheat_Menu.party_hp_cheat_5);
	Cheat_Menu.append_cheat("Party Full HP", "Activate", key6, Cheat_Menu.party_hp_cheat_6);
};

// handler for the party mp cheat to 0 alive only
Cheat_Menu.party_mp_cheat_1 = function() {
	Cheat_Menu.set_party_mp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 1 alive only
Cheat_Menu.party_mp_cheat_2 = function() {
	Cheat_Menu.set_party_mp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to full alive only
Cheat_Menu.party_mp_cheat_3 = function() {
	Cheat_Menu.recover_party_mp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 0 all
Cheat_Menu.party_mp_cheat_4 = function() {
	Cheat_Menu.set_party_mp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 1 all
Cheat_Menu.party_mp_cheat_5 = function() {
	Cheat_Menu.set_party_mp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat full all
Cheat_Menu.party_mp_cheat_6 = function() {
	Cheat_Menu.recover_party_mp(false);
	SoundManager.playSystemSound(1);
};


// append the party mp cheats
Cheat_Menu.append_mp_cheats = function(key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party MP to 0", "Activate", key1, Cheat_Menu.party_mp_cheat_1);
	Cheat_Menu.append_cheat("Party MP to 1", "Activate", key2, Cheat_Menu.party_mp_cheat_2);
	Cheat_Menu.append_cheat("Party Full MP", "Activate", key3, Cheat_Menu.party_mp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party MP to 0", "Activate", key4, Cheat_Menu.party_mp_cheat_4);
	Cheat_Menu.append_cheat("Party MP to 1", "Activate", key5, Cheat_Menu.party_mp_cheat_5);
	Cheat_Menu.append_cheat("Party Full MP", "Activate", key6, Cheat_Menu.party_mp_cheat_6);
};

// handler for the party tp cheat to 0 alive only
Cheat_Menu.party_tp_cheat_1 = function() {
	Cheat_Menu.set_party_tp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 1 alive only
Cheat_Menu.party_tp_cheat_2 = function() {
	Cheat_Menu.set_party_tp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to full alive only
Cheat_Menu.party_tp_cheat_3 = function() {
	Cheat_Menu.recover_party_tp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 0 all
Cheat_Menu.party_tp_cheat_4 = function() {
	Cheat_Menu.set_party_tp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 1 all
Cheat_Menu.party_tp_cheat_5 = function() {
	Cheat_Menu.set_party_tp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat full all
Cheat_Menu.party_tp_cheat_6 = function() {
	Cheat_Menu.recover_party_tp(false);
	SoundManager.playSystemSound(1);
};


// append the party tp cheats
Cheat_Menu.append_tp_cheats = function(key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party TP to 0", "Activate", key1, Cheat_Menu.party_tp_cheat_1);
	Cheat_Menu.append_cheat("Party TP to 1", "Activate", key2, Cheat_Menu.party_tp_cheat_2);
	Cheat_Menu.append_cheat("Party Full TP", "Activate", key3, Cheat_Menu.party_tp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party TP to 0", "Activate", key4, Cheat_Menu.party_tp_cheat_4);
	Cheat_Menu.append_cheat("Party TP to 1", "Activate", key5, Cheat_Menu.party_tp_cheat_5);
	Cheat_Menu.append_cheat("Party Full TP", "Activate", key6, Cheat_Menu.party_tp_cheat_6);
};

// handler for the toggle no clip cheat
Cheat_Menu.toggle_no_clip_status = function(event) {
	$gamePlayer._through = !($gamePlayer._through);
	Cheat_Menu.update_menu();
	if ($gamePlayer._through) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
};

// appen the no clip cheat
Cheat_Menu.append_no_clip_status = function(key1) {
	var status_text;
	if ($gamePlayer._through) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, key1, Cheat_Menu.toggle_no_clip_status);
};

// Left and right scrollers for handling switching amount to modify numerical cheats
Cheat_Menu.scroll_amount = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.amount_index--;
		if (Cheat_Menu.amount_index < 0) {
			Cheat_Menu.amount_index = 0;
		}
		SoundManager.playSystemSound(2);
	}
	else {
		Cheat_Menu.amount_index++;
		if (Cheat_Menu.amount_index >= Cheat_Menu.amounts.length) {
			Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
		}
		SoundManager.playSystemSound(1);
	}
	
	Cheat_Menu.update_menu();
};

// append the amount selection to the menu
Cheat_Menu.append_amount_selection = function(key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.amounts[Cheat_Menu.amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.scroll_amount);
};

// Left and right scrollers for handling switching amount to modify for the movement cheat
Cheat_Menu.scroll_move_amount = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.move_amount_index--;
		if (Cheat_Menu.move_amount_index < 0) {
			Cheat_Menu.move_amount_index = 0;
		}
		SoundManager.playSystemSound(2);
	}
	else {
		Cheat_Menu.move_amount_index++;
		if (Cheat_Menu.move_amount_index >= Cheat_Menu.move_amounts.length) {
			Cheat_Menu.move_amount_index = Cheat_Menu.move_amounts.length - 1;
		}
		SoundManager.playSystemSound(1);
	}
	
	Cheat_Menu.update_menu();
};

// append the movement speed amount to the menu
Cheat_Menu.append_move_amount_selection = function(key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.scroll_move_amount);
};

// handlers for the exp cheat
Cheat_Menu.apply_current_exp = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], amount);
	Cheat_Menu.update_menu();
};

// append the exp cheat to the menu
Cheat_Menu.append_exp_cheat = function(key1, key2) {
	var current_exp = "NULL";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
		current_exp = $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp();
	}
	Cheat_Menu.append_title("EXP");
	Cheat_Menu.append_scroll_selector(current_exp, key1, key2, Cheat_Menu.apply_current_exp);
};

// Left and right scrollers for handling switching between stats for the selected character
Cheat_Menu.scroll_stat = function(direction, event) {
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (direction == "left") {
			Cheat_Menu.stat_selection--;
			if (Cheat_Menu.stat_selection < 0) {
				Cheat_Menu.stat_selection = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length - 1;
			}
		}
		else {
			Cheat_Menu.stat_selection++;
			if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
				Cheat_Menu.stat_selection = 0;
			}
		}
	}
	else {
		Cheat_Menu.stat_selection = 0;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the stat cheat
Cheat_Menu.apply_current_stat = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection , amount);
	Cheat_Menu.update_menu();
};


// append the stat selection to the menu
Cheat_Menu.append_stat_selection = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Stat");

	var stat_string = "";

	var stat_string = "";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
			Cheat_Menu.stat_selection = 0;
		}
		stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
	}

	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_stat);
	var current_value = "NULL";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		current_value = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection];
	}
	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.apply_current_stat);
};

// handlers for the gold cheat
Cheat_Menu.apply_current_gold = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_gold(amount);
	Cheat_Menu.update_menu();
};

// append the gold cheat to the menu
Cheat_Menu.append_gold_status = function(key1, key2) {
	Cheat_Menu.append_title("Gold");
	Cheat_Menu.append_scroll_selector($gameParty._gold, key1, key2, Cheat_Menu.apply_current_gold);
};

// handler for the movement speed cheat
Cheat_Menu.apply_speed_change = function(direction, event) {
	var amount = Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.change_player_speed(amount);
	Cheat_Menu.update_menu();
};

Cheat_Menu.apply_speed_lock_toggle = function() {
	Cheat_Menu.toggle_lock_player_speed();
	if (Cheat_Menu.speed_unlocked) {
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
};

// append the movement speed to the menu
Cheat_Menu.append_speed_status = function(key1, key2, key3) {
	Cheat_Menu.append_title("Current Speed");
	Cheat_Menu.append_scroll_selector($gamePlayer._moveSpeed, key1, key2, Cheat_Menu.apply_speed_change);
	var status_text;
	if (!Cheat_Menu.speed_unlocked) {
		status_text = "<font color='#00ff00'>false</font>";
	}
	else {
		status_text = "<font color='#ff0000'>true</font>";
	}
	Cheat_Menu.append_cheat("Speed Unlocked", status_text, key3, Cheat_Menu.apply_speed_lock_toggle);
};

// Left and right scrollers for handling switching between items selected
Cheat_Menu.scroll_item = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.item_selection--;
		if (Cheat_Menu.item_selection < 0) {
			Cheat_Menu.item_selection = $dataItems.length - 1;
		}
	}
	else {
		Cheat_Menu.item_selection++;
		if (Cheat_Menu.item_selection >= $dataItems.length) {
			Cheat_Menu.item_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the item cheat
Cheat_Menu.apply_current_item = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_item(Cheat_Menu.item_selection, amount);
	Cheat_Menu.update_menu();
};

// append the item cheat to the menu
Cheat_Menu.append_item_selection = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Item");
	var current_item = "";
	if ($dataItems[Cheat_Menu.item_selection] && $dataItems[Cheat_Menu.item_selection].name && $dataItems[Cheat_Menu.item_selection].name.length > 0) {
		current_item = $dataItems[Cheat_Menu.item_selection].name;
	}
	else {
		current_item = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_item, key1, key2, Cheat_Menu.scroll_item);
	var current_item_amount = 0;
	if ($gameParty._items[Cheat_Menu.item_selection] != undefined) {
		current_item_amount = $gameParty._items[Cheat_Menu.item_selection];
	}
	Cheat_Menu.append_scroll_selector(current_item_amount, key3, key4, Cheat_Menu.apply_current_item);
};

// Left and right scrollers for handling switching between weapon selected
Cheat_Menu.scroll_weapon = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.weapon_selection--;
		if (Cheat_Menu.weapon_selection < 0) {
			Cheat_Menu.weapon_selection = $dataWeapons.length - 1;
		}
	}
	else {
		Cheat_Menu.weapon_selection++;
		if (Cheat_Menu.weapon_selection >= $dataWeapons.length) {
			Cheat_Menu.weapon_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	
	Cheat_Menu.update_menu();
};

// handlers for the weapon cheat
Cheat_Menu.apply_current_weapon = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, amount);
	Cheat_Menu.update_menu();
};

// append the weapon cheat to the menu
Cheat_Menu.append_weapon_selection = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Weapon");
	var current_weapon = "";
	if ($dataWeapons[Cheat_Menu.weapon_selection] && $dataWeapons[Cheat_Menu.weapon_selection].name && $dataWeapons[Cheat_Menu.weapon_selection].name.length > 0) {
		current_weapon = $dataWeapons[Cheat_Menu.weapon_selection].name;
	}
	else {
		current_weapon = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_weapon, key1, key2, Cheat_Menu.scroll_weapon);
	var current_weapon_amount = 0;
	if ($gameParty._weapons[Cheat_Menu.weapon_selection] != undefined) {
		current_weapon_amount = $gameParty._weapons[Cheat_Menu.weapon_selection];
	}
	Cheat_Menu.append_scroll_selector(current_weapon_amount, key3, key4, Cheat_Menu.apply_current_weapon);
};

// Left and right scrollers for handling switching between armor selected
Cheat_Menu.scroll_armor = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.armor_selection--;
		if (Cheat_Menu.armor_selection < 0) {
			Cheat_Menu.armor_selection = $dataArmors.length - 1;
		}
	}
	else {
		Cheat_Menu.armor_selection++;
		if (Cheat_Menu.armor_selection >= $dataArmors.length) {
			Cheat_Menu.armor_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	
	Cheat_Menu.update_menu();
};

// handler for the armor cheat
Cheat_Menu.apply_current_armor = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_armor(Cheat_Menu.armor_selection, amount);
	Cheat_Menu.update_menu();
};

// append the armor cheat to the menu
Cheat_Menu.append_armor_selection = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Armor");
	var current_armor = "";
	if ($dataArmors[Cheat_Menu.armor_selection] && $dataArmors[Cheat_Menu.armor_selection].name && $dataArmors[Cheat_Menu.armor_selection].name.length > 0) {
		current_armor = $dataArmors[Cheat_Menu.armor_selection].name;
	}
	else {
		current_armor = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_armor, key1, key2, Cheat_Menu.scroll_armor);
	var current_armor_amount = 0;
	if ($gameParty._armors[Cheat_Menu.armor_selection] != undefined) {
		current_armor_amount = $gameParty._armors[Cheat_Menu.armor_selection];
	}
	Cheat_Menu.append_scroll_selector(current_armor_amount, key3, key4, Cheat_Menu.apply_current_armor);
};

// handler for the clear actor state cheat
Cheat_Menu.clear_current_actor_states = function() {
	Cheat_Menu.clear_actor_states($gameActors._data[Cheat_Menu.cheat_selected_actor]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// handler for the party state clear cheat
Cheat_Menu.party_clear_states_cheat = function() {
	Cheat_Menu.clear_party_states();
	SoundManager.playSystemSound(1);
};

// append the party hp cheats
Cheat_Menu.append_party_state = function(key1) {
	Cheat_Menu.append_cheat("Clear Party States", "Activate", key1, Cheat_Menu.party_clear_states_cheat);
};

// append the clear actor state cheat to the menu
Cheat_Menu.append_current_state = function(key1) {
	Cheat_Menu.append_title("Current State");
	var number_states = 0;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length >= 0) {
		number_states = $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length;
	}
	else {
		number_states = null;
	}

	Cheat_Menu.append_cheat("Number Effects:", number_states, key1, Cheat_Menu.clear_current_actor_states);
};

// Left and right scrollers for handling switching between selected variable
Cheat_Menu.scroll_variable = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.variable_selection--;
		if (Cheat_Menu.variable_selection < 0) {
			Cheat_Menu.variable_selection = $dataSystem.variables.length - 1;
		}
	}
	else {
		Cheat_Menu.variable_selection++;
		if (Cheat_Menu.variable_selection >= $dataSystem.variables.length) {
			Cheat_Menu.variable_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the setting the current variable
Cheat_Menu.apply_current_variable = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.set_variable(Cheat_Menu.variable_selection, amount);
	Cheat_Menu.update_menu();
};

// append the variable cheat to the menu
Cheat_Menu.append_variable_selection = function(key1, key2, key3, key4) {
	Cheat_Menu.append_title("Variable");
	var current_variable = "";
	if ($dataSystem.variables[Cheat_Menu.variable_selection] && $dataSystem.variables[Cheat_Menu.variable_selection].length > 0) {
		current_variable = $dataSystem.variables[Cheat_Menu.variable_selection];
	}
	else {
		current_variable = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_variable, key1, key2, Cheat_Menu.scroll_variable);
	var current_variable_value = 'NULL';
	if ($gameVariables.value(Cheat_Menu.variable_selection) != undefined) {
		current_variable_value = $gameVariables.value(Cheat_Menu.variable_selection);
	}
	Cheat_Menu.append_scroll_selector(current_variable_value, key3, key4, Cheat_Menu.apply_current_variable);
};

// Left and right scrollers for handling switching between selected switch
Cheat_Menu.scroll_switch = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.switch_selection--;
		if (Cheat_Menu.switch_selection < 0) {
			Cheat_Menu.switch_selection = $dataSystem.switches.length - 1;
		}
	}
	else {
		Cheat_Menu.switch_selection++;
		if (Cheat_Menu.switch_selection >= $dataSystem.switches.length) {
			Cheat_Menu.switch_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handler for the toggling the current switch
Cheat_Menu.toggle_current_switch = function(event) {
	Cheat_Menu.toggle_switch(Cheat_Menu.switch_selection);
	if ($gameSwitches.value(Cheat_Menu.switch_selection)) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
	Cheat_Menu.update_menu();
};

// append the switch cheat to the menu
Cheat_Menu.append_switch_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Switch");
	var current_switch = "";
	if ($dataSystem.switches[Cheat_Menu.switch_selection] && $dataSystem.switches[Cheat_Menu.switch_selection].length > 0) {
		current_switch = $dataSystem.switches[Cheat_Menu.switch_selection];
	}
	else {
		current_switch = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_switch, key1, key2, Cheat_Menu.scroll_switch);
	var current_switch_value = 'NULL';
	if ($gameSwitches.value(Cheat_Menu.switch_selection) != undefined) {
		current_switch_value = $gameSwitches.value(Cheat_Menu.switch_selection);
	}
	Cheat_Menu.append_cheat("Status:", current_switch_value, key3, Cheat_Menu.toggle_current_switch);
};

// handler for saving positions
Cheat_Menu.save_position = function(pos_num, event) {
	Cheat_Menu.saved_positions[pos_num].m = $gameMap.mapId();
	Cheat_Menu.saved_positions[pos_num].x = $gamePlayer.x;
	Cheat_Menu.saved_positions[pos_num].y = $gamePlayer.y;

	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// handler for loading/recalling positions
Cheat_Menu.recall_position = function(pos_num, event) {
	if (Cheat_Menu.saved_positions[pos_num].m != -1) {
		Cheat_Menu.teleport(Cheat_Menu.saved_positions[pos_num].m, Cheat_Menu.saved_positions[pos_num].x, Cheat_Menu.saved_positions[pos_num].y);
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
	Cheat_Menu.update_menu();
};

// append the save/recall cheat to the menu
Cheat_Menu.append_save_recall = function (key1, key2, key3, key4, key5, key6) {
	
	Cheat_Menu.append_title("Current Position: ");

	if ($dataMapInfos[$gameMap.mapId()] && $dataMapInfos[$gameMap.mapId()].name) {
		var current_map = "" + $gameMap.mapId() + ": " + $dataMapInfos[$gameMap.mapId()].name;
		Cheat_Menu.append_description(current_map);

		var map_pos = "(" + $gamePlayer.x + ", " + $gamePlayer.y + ")";
		Cheat_Menu.append_description(map_pos);
	}
	else {
		Cheat_Menu.append_description("NULL");
	}

	var cur_key = 1;
	for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
		Cheat_Menu.append_title("Position " + (i+1));

		var map_text;
		var pos_text;
		if (Cheat_Menu.saved_positions[i].m != -1) {
			map_text = "" + Cheat_Menu.saved_positions[i].m + ": ";
			if($dataMapInfos[Cheat_Menu.saved_positions[i].m].name) {
				map_text += $dataMapInfos[Cheat_Menu.saved_positions[i].m].name;
			}
			else {
				map_text += "NULL";
			}
			pos_text = "(" + Cheat_Menu.saved_positions[i].x + ", " + Cheat_Menu.saved_positions[i].y + ")";
		} 
		else {
			map_text = "NULL";
			pos_text = "NULL"
		}

		Cheat_Menu.append_cheat("Save:", map_text, eval("key" + cur_key), Cheat_Menu.save_position.bind(null, i));
		cur_key++;

		Cheat_Menu.append_cheat("Recall:", pos_text, eval("key" + cur_key), Cheat_Menu.recall_position.bind(null, i));
		cur_key++;
	}
};

// Left and right scrollers for handling switching between target teleport map
Cheat_Menu.scroll_map_teleport_selection = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.m--;
		if (Cheat_Menu.teleport_location.m < 1) {
			Cheat_Menu.teleport_location.m = $dataMapInfos.length - 1;
		}
	}
	else {
		Cheat_Menu.teleport_location.m++;
		if (Cheat_Menu.teleport_location.m >= $dataMapInfos.length) {
			Cheat_Menu.teleport_location.m = 1;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Left and right scrollers for handling switching between target teleport x coord
Cheat_Menu.scroll_x_teleport_selection = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.x--;
		if (Cheat_Menu.teleport_location.x < 0) {
			Cheat_Menu.teleport_location.x = 255;
		}
	}
	else {
		Cheat_Menu.teleport_location.x++;
		if (Cheat_Menu.teleport_location.x > 255) {
			Cheat_Menu.teleport_location.x = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Left and right scrollers for handling switching between target teleport y coord
Cheat_Menu.scroll_y_teleport_selection = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.y--;
		if (Cheat_Menu.teleport_location.y < 0) {
			Cheat_Menu.teleport_location.y = 255;
		}
	}
	else {
		Cheat_Menu.teleport_location.y++;
		if (Cheat_Menu.teleport_location.y > 255) {
			Cheat_Menu.teleport_location.y = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handler for teleporting to targed map and location
Cheat_Menu.teleport_current_location = function(event) {
	Cheat_Menu.teleport(Cheat_Menu.teleport_location.m, Cheat_Menu.teleport_location.x, Cheat_Menu.teleport_location.y);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// append the teleport cheat to the menu
Cheat_Menu.append_teleport = function (key1, key2, key3, key4, key5, key6, key7) {
	var current_map = "" + Cheat_Menu.teleport_location.m + ": ";

	if ($dataMapInfos[Cheat_Menu.teleport_location.m] && $dataMapInfos[Cheat_Menu.teleport_location.m].name) {
		current_map += $dataMapInfos[Cheat_Menu.teleport_location.m].name;
	}
	else {
		current_map += "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_map, key1, key2, Cheat_Menu.scroll_map_teleport_selection);

	Cheat_Menu.append_scroll_selector("X: " + Cheat_Menu.teleport_location.x, key3, key4, Cheat_Menu.scroll_x_teleport_selection);

	Cheat_Menu.append_scroll_selector("Y: " + Cheat_Menu.teleport_location.y, key5, key6, Cheat_Menu.scroll_y_teleport_selection);

	Cheat_Menu.append_cheat("Teleport", "Activate", key7, Cheat_Menu.teleport_current_location);
};


//////////////////////////////////////////////////////////////////////////////////
// Final Functions for building each Menu and function list for updating the menu
//////////////////////////////////////////////////////////////////////////////////
// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu.menus == "undefined") { Cheat_Menu.menus = []; }

// One menu added for each cheat/page of the Cheat_Menu
//	appended in reverse order at the front so they will
//	appear first no matter the plugin load order for any
//	extension plugins

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Teleport");
	Cheat_Menu.append_teleport(4, 5, 6, 7, 8, 9, 0);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Save and Recall");
	Cheat_Menu.append_save_recall(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Switches");
	Cheat_Menu.append_switch_selection(4, 5, 6);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Variables");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_variable_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Clear States");
	Cheat_Menu.append_party_state(4);
	Cheat_Menu.append_actor_selection(5, 6);
	Cheat_Menu.append_current_state(7);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Speed");
	Cheat_Menu.append_move_amount_selection(4, 5);
	Cheat_Menu.append_speed_status(6, 7, 8);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Armors");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_armor_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Weapons");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_weapon_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Items");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_item_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Gold");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_gold_status(6, 7);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Stats");
	Cheat_Menu.append_actor_selection(4, 5);
	Cheat_Menu.append_amount_selection(6, 7);
	Cheat_Menu.append_stat_selection(8, 9, 0, '-');
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Give Exp");
	Cheat_Menu.append_actor_selection(4, 5);
	Cheat_Menu.append_amount_selection(6, 7);
	Cheat_Menu.append_exp_cheat(8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Party TP");

	Cheat_Menu.append_tp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Party MP");

	Cheat_Menu.append_mp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Party HP");

	Cheat_Menu.append_hp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("Enemy HP");

	Cheat_Menu.append_enemy_cheats(4, 5, 6, 7);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("No Clip");

	Cheat_Menu.append_no_clip_status(4);
});

Cheat_Menu.menus.splice(0, 0, function() {
	Cheat_Menu.append_cheat_title("God Mode");
	Cheat_Menu.append_actor_selection(4, 5);

	Cheat_Menu.append_godmode_status();
});


// update whats being displayed in menu
Cheat_Menu.update_menu = function() {
	// clear menu
	Cheat_Menu.overlay.innerHTML = "";
	// clear key listeners
	Cheat_Menu.key_listeners = {};

	Cheat_Menu.menus[Cheat_Menu.cheat_selected]();

	Cheat_Menu.position_menu();
};

// listener to reposition menu
window.addEventListener("resize", Cheat_Menu.position_menu);


// prevent clicking from passing through
Cheat_Menu.overlay.addEventListener("mousedown", function(event) {
	event.stopPropagation();
});



/////////////////////////////////////////////////
// Cheat Menu Key Listener
/////////////////////////////////////////////////

// Key codes
if (typeof Cheat_Menu.keyCodes == "undefined") { Cheat_Menu.keyCodes = {}; }

Cheat_Menu.keyCodes.KEYCODE_0 = {keyCode: 48, key_listener: 0};
Cheat_Menu.keyCodes.KEYCODE_1 = {keyCode: 49, key_listener: 1};
Cheat_Menu.keyCodes.KEYCODE_2 = {keyCode: 50, key_listener: 2};
Cheat_Menu.keyCodes.KEYCODE_3 = {keyCode: 51, key_listener: 3};
Cheat_Menu.keyCodes.KEYCODE_4 = {keyCode: 52, key_listener: 4};
Cheat_Menu.keyCodes.KEYCODE_5 = {keyCode: 53, key_listener: 5};
Cheat_Menu.keyCodes.KEYCODE_6 = {keyCode: 54, key_listener: 6};
Cheat_Menu.keyCodes.KEYCODE_7 = {keyCode: 55, key_listener: 7};
Cheat_Menu.keyCodes.KEYCODE_8 = {keyCode: 56, key_listener: 8};
Cheat_Menu.keyCodes.KEYCODE_9 = {keyCode: 57, key_listener: 9};
Cheat_Menu.keyCodes.KEYCODE_MINUS = {keyCode: 189, key_listener: '-'};
Cheat_Menu.keyCodes.KEYCODE_EQUAL = {keyCode: 187, key_listener: '='};

Cheat_Menu.keyCodes.KEYCODE_TILDE = {keyCode: 192, key_listener: '`'};

Cheat_Menu.key_listeners = {};

window.addEventListener("keydown", function(event) {
	if (!event.ctrlKey && !event.altKey && (event.keyCode === 119) && $gameTemp && !$gameTemp.isPlaytest()) {
		// open debug menu
		event.stopPropagation();
		event.preventDefault();
		require('nw.gui').Window.get().showDevTools();
	}
	else if (!event.altKey && !event.ctrlKey && !event.shiftKey && (event.keyCode === 120) && $gameTemp && !$gameTemp.isPlaytest()) {
		// trick the game into thinking its a playtest so it will open the switch/variable debug menu
		$gameTemp._isPlaytest = true;
		setTimeout(function() {
			// back to not being playtest
			$gameTemp._isPlaytest = false;
		}, 100);
	}
	else if (Cheat_Menu.overlay_openable && !event.altKey && !event.ctrlKey && !event.shiftKey) {
		// open and close menu
		if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_1.keyCode) {
			if (!Cheat_Menu.initialized) {
				for (var i = 0; i < $gameActors._data.length; i++) {
					if($gameActors._data[i]) {
						$gameActors._data[i].god_mode = false;
						if ($gameActors._data[i].god_mode_interval) {
							clearInterval($gameActors._data[i].god_mode_interval);
						}
					}
				}
				
				// reset to inital values
				for (var name in Cheat_Menu.initial_values) {
					Cheat_Menu[name] = Cheat_Menu.initial_values[name];
				}
				// load saved values if they exist
				if ($gameSystem.Cheat_Menu) {
					for (var name in $gameSystem.Cheat_Menu) {
						Cheat_Menu[name] = $gameSystem.Cheat_Menu[name];
					}
				}

				// if speed is locked then initialize it so effect is active
				if (Cheat_Menu.speed_unlocked == false) {
					Cheat_Menu.initialize_speed_lock();
				}

				// only do this once per load or new game
				Cheat_Menu.initialized = true;
			}

			// open menu
			if (!Cheat_Menu.cheat_menu_open) {
				Cheat_Menu.cheat_menu_open = true;
				document.body.appendChild(Cheat_Menu.overlay_box);
				document.body.appendChild(Cheat_Menu.overlay);
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(1);
			}
			// close menu
			else {
				Cheat_Menu.cheat_menu_open = false;
				Cheat_Menu.overlay_box.remove();
				Cheat_Menu.overlay.remove();
				SoundManager.playSystemSound(2);
			}
		}

		// navigate and activate cheats
		else if (Cheat_Menu.cheat_menu_open) {
			// move menu position
			if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_TILDE.keyCode) {
				Cheat_Menu.position++;
				if (Cheat_Menu.position > 4) {
					Cheat_Menu.position = 0;
				}
				Cheat_Menu.update_menu();
			}

			else {
				for (var keyCode in Cheat_Menu.keyCodes) {
					if (Cheat_Menu.key_listeners[Cheat_Menu.keyCodes[keyCode].key_listener] && event.keyCode == Cheat_Menu.keyCodes[keyCode].keyCode) {
						Cheat_Menu.key_listeners[Cheat_Menu.keyCodes[keyCode].key_listener](event);
					}
				}
			}
		}
	}
});



/////////////////////////////////////////////////
// Load Hook
/////////////////////////////////////////////////

// close the menu and set for initialization on first open
//	timer to provide periodic updates if the menu is open
Cheat_Menu.initialize = function() {
	Cheat_Menu.overlay_openable = true;
	Cheat_Menu.initialized = false;
	Cheat_Menu.cheat_menu_open = false;
	Cheat_Menu.speed_initialized = false;
	Cheat_Menu.overlay_box.remove();
	Cheat_Menu.overlay.remove();


	// periodic update
	clearInterval(Cheat_Menu.menu_update_timer);
	Cheat_Menu.menu_update_timer = setInterval(function() {
		if (Cheat_Menu.cheat_menu_open) {
			Cheat_Menu.update_menu();
		}
	}, 1000);
};

// add hook for loading a game
DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function(savefileId) {
	Cheat_Menu.initialize();

	return DataManager.default_loadGame(savefileId);
};

// add hook for new game
DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
	Cheat_Menu.initialize();

	DataManager.default_setupNewGame();
};

// add hook for saving values (just added into $gameSystem to be saved)
DataManager.default_saveGame = DataManager.saveGame;
DataManager.saveGame = function(savefileId) {
	// save values that are in intial values
	$gameSystem.Cheat_Menu = {};
	for (var name in Cheat_Menu.initial_values) {
		$gameSystem.Cheat_Menu[name] = Cheat_Menu[name];
	}

	return DataManager.default_saveGame(savefileId);
};

/////////////////////////////////////////////////
// 	Extra features
/////////////////////////////////////////////////

// Create a sprite to highlight events
function EventHighlightSprite() {
    this.initialize.apply(this, arguments);
}

EventHighlightSprite.prototype = Object.create(Sprite.prototype);
EventHighlightSprite.prototype.constructor = EventHighlightSprite;

EventHighlightSprite.prototype.initialize = function(event) {
    Sprite.prototype.initialize.call(this);
    this._event = event;
    this.bitmap = new Bitmap(24, 24); // Small square for the "!"
    this.bitmap.drawText("!", 0, 0, 24, 24, "center"); // Draw the "!"
    this.anchor.x = 0.5; // Center horizontally
    this.anchor.y = 1; // Anchor at the bottom (so it sits above the event)
    this.z = 9; // Ensure it appears above most sprites
};

EventHighlightSprite.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._event) {
        this.x = this._event.screenX(); // Match the event’s x-position
        this.y = this._event.screenY() - 24; // Place it above the event
    }
};

// Alias Scene_Map.prototype.createSpriteset to add highlights
var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function() {
    _Scene_Map_createSpriteset.call(this);
    this._eventHighlights = []; // Array to store highlight sprites
    if (Cheat_Menu.showEventHighlights) {
        this.addEventHighlights(); // Add highlights if enabled
    }
};

// Function to add highlights to all active events
Scene_Map.prototype.addEventHighlights = function() {
    var events = $gameMap.events(); // Get all events on the map
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event && event._pageIndex >= 0) { // Check if the event is active
            var highlight = new EventHighlightSprite(event);
            this._spriteset._tilemap.addChild(highlight); // Add to the map
            this._eventHighlights.push(highlight);
        }
    }
};

// Function to remove all event highlights
Scene_Map.prototype.removeEventHighlights = function() {
    for (var i = 0; i < this._eventHighlights.length; i++) {
        this._spriteset._tilemap.removeChild(this._eventHighlights[i]);
    }
    this._eventHighlights = []; // Clear the array
};

// Alias Scene_Map.prototype.update to handle toggling
var _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if (Cheat_Menu.showEventHighlights && this._eventHighlights.length === 0) {
        this.addEventHighlights(); // Add highlights if toggled on
    } else if (!Cheat_Menu.showEventHighlights && this._eventHighlights.length > 0) {
        this.removeEventHighlights(); // Remove highlights if toggled off
    }
};

// Add a new menu option for toggling event highlights
Cheat_Menu.menus.splice(0, 0, function() {
    Cheat_Menu.append_cheat_title("Event Highlights");
    var statusText = Cheat_Menu.showEventHighlights ? "<font color='#00ff00'>On</font>" : "<font color='#ff0000'>Off</font>";
    Cheat_Menu.append_cheat("Show Highlights", statusText, 4, Cheat_Menu.toggleEventHighlights);
});

// Handler for toggling event highlights
Cheat_Menu.toggleEventHighlights = function() {
    Cheat_Menu.showEventHighlights = !Cheat_Menu.showEventHighlights;
    SoundManager.playSystemSound(Cheat_Menu.showEventHighlights ? 1 : 2); // Play sound effect
    Cheat_Menu.update_menu(); // Refresh the menu display
};

// Initialize the toggle variable
/// Insert at the top of the menu list

// --- Global Variables for Persistence and Locking ---
let lockedEventId = null;  // Store the ID of the locked event.  Null = no lock.
let recordedVars = [];    // Store recorded variables.  Persistent across menu calls.
let recordMode = false;   // Track if we're in record mode
let resultLogs = [];      // Store the result logs

Cheat_Menu.menus.splice(0, 0, function() {
    // Add the menu title
    Cheat_Menu.append_cheat_title("Event Debugger");

    // Helper function to get the currently active event
    function getActiveEvent() {
        if ($gameMap && $gameMap._interpreter && $gameMap._interpreter.isRunning()) {
            return $gameMap.event($gameMap._interpreter._eventId);
        }
        return null;
    }

    // Function to get either active or locked event, prioritizing the locked one.
    function getTargetEvent() {
        if (lockedEventId !== null) {
            let lockedEvent = $gameMap.event(lockedEventId);
            if (lockedEvent) {
                return lockedEvent;
            } else {
                // Clear the lock if the event no longer exists.
                lockedEventId = null;
                console.warn("Locked event ID", lockedEventId, "no longer exists. Lock released.");
            }
        }
        return getActiveEvent(); // Fallback to the currently running event.
    }


    // --- Helper Functions ---
	// Function to append a message to the result logs and update the menu
	function appendToResultLog(message) {
		resultLogs.push(message);
		//Cheat_Menu.refresh(); // Refresh the menu to show the updated logs
	}

    function logEventCommand(command, indent = "") {
        let logStr = indent + "Code: " + command.code;
        if (command.parameters && command.parameters.length > 0) {
            logStr += ", Params: " + JSON.stringify(command.parameters);
        }
        appendToResultLog(logStr);
        // Consider additional details for common commands:
        switch (command.code) {
            case 101: // Show Text
				appendToResultLog(indent + "  Text: " + command.parameters[0]);
                break;
            case 102: // Show Choices
				appendToResultLog(indent + "  Choices: " + command.parameters[0].join(", "));
                break;
            case 111: // Conditional Branch
				appendToResultLog(indent + "  Condition Type: " + command.parameters[0]);
                if (command.parameters[0] === 0) { // Variable check
                     // Check for common comparison operators
                     let op = [' ==', ' >=', ' <=', ' >', ' <', ' !='][command.parameters[2]] || 'Unknown Comparison';

                     appendToResultLog(indent + "  Var Condition: Variable " + command.parameters[1] + op + command.parameters[3]);

                 } else if (command.parameters[0] === 12) { // Script
					appendToResultLog(indent + "  Script Condition: " + command.parameters[1] );
                 }
                break;
            case 122: // Control Variables
				appendToResultLog(indent + `  Control Variables: Var(s) ${command.parameters[0]} to ${command.parameters[1]} =  Operation ${command.parameters[2]} with ${command.parameters[3]}`);
                break;
                case 201: //Transfer Player
                appendToResultLog(indent + `  Transfer Player`);
                break;
                case 205: //Set Move Route
                appendToResultLog(indent + ` Set Move Route`);
                break;
            case 301: // Input Number
				appendToResultLog(indent + "  Input Number: Variable ID " + command.parameters[0] + ", Digits: " + command.parameters[1]);
                break;
              case 355: // Script
              case 655: //Script continued
			  	appendToResultLog(indent + " Script Call:" + command.parameters[0]);
                break;
        }
    }

    function logEventPage(page, pageIndex) {
        appendToResultLog("Event Page: " + (pageIndex + 1));
        if(page.conditions){
            appendToResultLog("Page Conditions:" + JSON.stringify(page.conditions,null,2))
        }

        if (page.list && page.list.length > 0) {
            page.list.forEach(function(command, index) {
                logEventCommand(command, "  ");
            });
        } else {
            appendToResultLog("  (Empty Page)");
        }
    }

    // Function to find references to a variable within an event's commands.
     function findVariableReferences(event, varId) {
        let references = [];
        if (!event || !event.event() || !event.event().pages) return references;

        event.event().pages.forEach((page, pageIndex) => {
            page.list.forEach((command, commandIndex) => {
                if (command.parameters) {
                    // Check for Control Variables (code 122) and Input Number (code 301)
                    if (command.code === 122 && (command.parameters[0] <= varId && varId <= command.parameters[1])) {
                         references.push({page: pageIndex + 1, commandIndex: commandIndex, type: "Control Variables", command: command});
                    } else if (command.code === 301 && command.parameters[0] === varId) {
                        references.push({page: pageIndex + 1, commandIndex: commandIndex, type: "Input Number", command: command});
                    } else if (command.code === 111 && command.parameters[0] === 0 && command.parameters[1] === varId ) { //Conditional Branch
                        references.push({page: pageIndex + 1, commandIndex: commandIndex, type: "Conditional Branch", command: command});
                    }
              // Check for usage within script calls (code 355 and 655)
                    else if((command.code === 355 || command.code === 655) && command.parameters.length >0 && typeof command.parameters[0] === "string") {

                        if(command.parameters[0].includes(`$gameVariables.value(${varId})`) || command.parameters[0].includes(`$gameVariables._data[${varId}]`)){
                            references.push({page: pageIndex + 1, commandIndex: commandIndex, type: "Script Call (Read)", command: command});
                        }
                        //Check for set Value
                        if(command.parameters[0].includes(`$gameVariables.setValue(${varId},`)){
                            references.push({page: pageIndex + 1, commandIndex: commandIndex, type: "Script Call (Write)", command: command});
                        }
                    }
                }
            });
        });

        return references;
    }



    // --- Menu Construction ---
    let targetEvent = getTargetEvent();

    if (targetEvent) {
        let eventName = targetEvent.event().name || "Event " + targetEvent._eventId;
        Cheat_Menu.append_description("Target Event: " + eventName + (lockedEventId !== null ? " (LOCKED)" : ""));

        // --- Lock/Unlock Event ---
        Cheat_Menu.append_cheat("Lock/Unlock Event", "Activate", "L", function() {
            if (lockedEventId === targetEvent._eventId) {
                lockedEventId = null; // Unlock
                appendToResultLog("Event lock released.");
            } else {
                lockedEventId = targetEvent._eventId; // Lock current event
                appendToResultLog("Event " + targetEvent._eventId + " locked.");
            }
            // Refresh the menu to reflect lock state
            //Cheat_Menu.update_menu();

        });



        // --- Record/Stop Recording Variables ---
        Cheat_Menu.append_cheat("Toggle Record Variables", "Activate", "R", function() {
           recordMode = !recordMode;
            if(recordMode){
                recordedVars = $gameVariables._data.slice();
                 Cheat_Menu.append_description("Variable recording started.");
            } else {
                Cheat_Menu.append_description("Variable recording stopped.");
            }
            //Cheat_Menu.update_menu();
        });

        // --- Check Changed Variables ---
        Cheat_Menu.append_cheat("Check Changed Variables", "Activate", "C", function() {
            if (!recordMode && recordedVars.length >0) {
                let changedVars = [];
                for (let i = 1; i < recordedVars.length; i++) {  // Start from 1 to skip common event variables.
                    if (recordedVars[i] !== $gameVariables._data[i]) {

                        //Find who changed it
                        let references = findVariableReferences(targetEvent, i);
                        let refStr = "";

                        if(references.length > 0) {
                            references.forEach(ref=>{
                                refStr+= `(Page ${ref.page}, Cmd ${ref.commandIndex}, Type: ${ref.type})`;
                            });
                        } else {
                            refStr = "No direct references found in this event.";
                        }

                        changedVars.push(`Var ${i}: ${recordedVars[i]} -> ${$gameVariables._data[i]}. ${refStr}`);
                    }
                }
                if (changedVars.length > 0) {
                    appendToResultLog("Changed Variables (Since last record/start):");
                    changedVars.forEach(function(change) {
                        appendToResultLog("  - " + change);
                    });
                } else {
                    appendToResultLog("No variables changed (Since last record/start).");
                }
            } else if (recordMode) {

                appendToResultLog("Stop recording to compare.");

            }
             else {
                appendToResultLog("No variables recorded.  Start recording first.");
            }
        });


        // --- Inspect Event Commands ---
                // Inspect Event Conditions and Commands
        Cheat_Menu.append_cheat("Inspect Event Pages", "Activate", "I", function() {
            let eventData = targetEvent.event();
            if (eventData && eventData.pages) {
                eventData.pages.forEach(function(page, index) {
                    logEventPage(page, index);
                });
            } else {
                appendToResultLog("No event pages found.");
            }
        });

        // --- Find Variable References ---
        Cheat_Menu.append_cheat("Find Variable References", "Enter Variable ID", "V", function(varIdStr) {
             let varId = parseInt(varIdStr);
              if (isNaN(varId)) {
					appendToResultLog("Invalid variable ID.");
                 return;
             }

            let references = findVariableReferences(targetEvent, varId);

             if (references.length > 0) {
				appendToResultLog("References to Variable " + varId + ":");
                    references.forEach(ref => {
                        appendToResultLog(`- Page ${ref.page}, Command ${ref.commandIndex}, Type: ${ref.type}`);

                        // Display relevant information based on the command type

                        logEventCommand(ref.command, "  ");
                    });
                } else {
					appendToResultLog("No references to Variable " + varId + " found in this event.");
             }
        });


        // --- Step Through Event (Basic) ---
        Cheat_Menu.append_cheat("Step Through Event (Basic)", "Activate", "S", function() {
            if ($gameMap._interpreter.isRunning() && $gameMap._interpreter._list) {
                let currentCommandIndex = $gameMap._interpreter._index;
                let currentCommand = $gameMap._interpreter._list[currentCommandIndex];

                appendToResultLog(`Current Command Index: ${currentCommandIndex}`);
                logEventCommand(currentCommand);

                // Advance to the next command, skipping comments and labels
                let nextIndex = currentCommandIndex + 1;
                while (nextIndex < $gameMap._interpreter._list.length) {
                    let nextCommand = $gameMap._interpreter._list[nextIndex];
                    if (nextCommand.code !== 0 && nextCommand.code !== 118) { // 0 = empty, 118 = label
                        break;
                    }
                    nextIndex++;
                }

                if (nextIndex < $gameMap._interpreter._list.length) {
                     $gameMap._interpreter._index = nextIndex;
					appendToResultLog(`Next Command Index: ${nextIndex}`);
                } else{
					appendToResultLog(`End of Event`);
                }
            } else {
                appendToResultLog("Event interpreter not running or no command list.");
            }
              //Cheat_Menu.update_menu(); //Keep Open
        });


    } else {
        Cheat_Menu.append_description("No active or locked event found.");
        // Clear the lock if there's no active event (e.g., event ended)
        if (lockedEventId !== null) {
            appendToResultLog("Clearing event lock (no active event).");
             lockedEventId = null;

        }

    }

	// --- Clear Result Logs ---
	Cheat_Menu.append_cheat("Clear Result Logs", "Activate", "X", function() {
		resultLogs = [];
	});

	resultLogs.forEach(log => {
        Cheat_Menu.append_description(log);
    });
});

