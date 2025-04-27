RPG Maker MV Cheat Menu Plugin
==============================

This is the forked version of https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin. The difference in this version is the addition of event-related functionality.
The controls are all input via the number keys \[0\]\-\[9\] (not the NUMPAD) (other keys may be used as well now) or the mouse.

Open the Menu by pressing the \[1\] Key.  
Move menu to different positions with \` (key with tilde ~)  
Scroll between cheats with \[2\] and \[3\] Keys.  
Any \[#\] indicates a number key to press to cause an action, if you don't want to click.  

The menu can also be interacted with by clicking (everything except opening the menu can be done with the mouse).  
Clicking is done with left click and clickable elements will be highlighted red on hover over.

Available Cheats Are
--------------------

* God Mode for any Actor (infinite hp and mp, skills shouldn't cost anything)
* Set Enemy/Party HP to 0 hp or 1 hp, Party Full Recover (HP, MP, Status)
* Toggle No Clip
* Edit Exp
* Edit Stats
* Edit Gold
* Edit Items, Weapons, Armor
* Change player movement speed
* Clear Status/States Effects
* Edit Variables/Switches
* Save/Recall Location and Teleport
  * Be careful not to skip game events
  * If you teleport off the map lower X,Y and teleport again to fix it.
* Open javascript console/developer tools with F8
  * With this you can edit game Variables and Switches (at your own risk) in the $gameVariables and $gameSwitches, as well as other advanced stuff
* Open Switch/Variable Debug Menu from playtest Mode with F9
  * Better/easier method for editing the Switches and Variables than using the console, slower if you want to edit variables by large amounts
* Review what's in the event and step through it
* Highlight all events, e.g. show hidden events

Downloads
---------

Download or Clone from above repository link or click the link below

Download: [GitHub](https://github.com/last1melody/RPG-Maker-MV-Cheat-Menu-Plugin/archive/master.zip)

I've tested this to work with Cursed Armor and 魔王イリスの逆襲[RJ176175] (both are NSFW)

 
Install
-------

* Unpack Game if needed (if you have a single large Game.exe with no /www folder, etc.).
  * You can use EnigmaVBUnpacker tool by [Kao](https://lifeinhex.com/) (most new games do not require this anymore)
* Copy and Paste this contents of Cheat_Menu folder into folder with Game.exe
* Patch your www/js/plugins.js  
  * Backup your www/js/plugins.js file
  * Patch
      * Run MVPluginPatcher.exe  
        or
      * Manually Add the following to your plugins.js file, ensure you follow proper JavaScript formating for the $plugins array and include a , at end of the line before where you add this (recommended to add the bottom of plugins.js file)
        * {"name":"Cheat_Menu","status":true,"description":"","parameters":{}}
 * Delete MVPluginPatcher.exe and plugins_patch.txt

If the www/js/plugins.js is read only, remove that in the properties or the patch with fail. 

Some games might have have altered the plugin loading mechanism (for example using a single composite plugin to save space). In this case you should open the GameFolder/www/js/main.js and insert the code as shown below in order to get any extra plugins to load.

```javascript
//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

// Insert the code below, change plugin name if loading something besides Cheat_Menu
PluginManager._path= 'js/plugins/'; 
PluginManager.loadScript('Cheat_Menu.js');
// End Insert

window.onload = function() {
    SceneManager.run(Scene_Boot);
};

```
 
Uninstall
---------

* Delete www/js/plugins/Cheat_Menu.js and www/js/plugins/Cheat_Menu.css
* Remove plugin entry from www/js/plugins.js
  * Be sure to remove the comma from new last entry if this plugin was last in the list
  * Ideally you can just restore you backup of plugins.js
* Delete MVPluginPatcher.exe and plugins_patch.txt if you haven't already

Other RPG Maker MV Links
----------------
Original ULMF thread for this plugin: [thread](http://www.ulmf.org/bbs/showthread.php?t=28982)

I might also suggest Libellule's text hook for untranslated games: [thread](http://www.ulmf.org/bbs/showthread.php?t=29359)  
It has a packaged version of my Cheat Menu, just note it is outdated at the moment so if you install my plugin with his patcher just overwrite with the /www folder downloaded from the most recent version here.

Froggus has a save editor that works with a bunch of versions of RPG maker games including MV: [thread](http://www.ulmf.org/bbs/showthread.php?t=28936)
