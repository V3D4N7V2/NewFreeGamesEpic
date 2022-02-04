// ==UserScript==
// @name        Epic AutoOpenLinks
// @namespace   V3D4N7V2
// @match       https://www.epicgames.com/store/en-US/*
// @exclude     https://www.epicgames.com/store/en-US/p/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @version     1.0
// @author      V3D4N7V2
// @description Userscript to automatically open links on Epic Games Store for unclaimed free games so that you dont have to remember.
// @run-at document-idle
// ==/UserScript==
let wait = 5;
let wait_max = 5;
let visited = [];
let arrayOfKeys = GM_listValues();
if (arrayOfKeys.length == 0) GM_setValue("visitedSites", JSON.stringify(visited));
else visited = JSON.parse(GM_getValue("visitedSites", JSON.stringify(visited)));
let gameTiles = [];
let i = 0;
function checkNotVisited(value) {
  if  (value.getElementsByTagName("a").length == 0) {
    return false;
  }
  return value.innerText.toLowerCase().includes("free") && !visited.includes(value.getElementsByTagName("a")[0].href);
}

function opener() {
  var list = [];
  list = list.concat(Array.from(document.getElementsByClassName("css-5auk98")));
  list = list.concat(Array.from(document.getElementsByClassName("css-lrwy1y")));
  list = list.concat(Array.from(document.getElementsByClassName("css-1ukp34s")));
  list = list.concat(Array.from(document.getElementsByClassName("css-1phf4sm")));
  list = list.concat(Array.from(document.getElementsByClassName("css-bjn8wh")));
  list = list.concat(Array.from(document.getElementsByClassName("css-ipat9m")));
  list = list.concat(Array.from(document.getElementsByClassName("css-ukk7l6")));
  list = list.filter(checkNotVisited);
  i = 0;
  var myVar = setInterval(function() {
    if (i == list.length) {
      GM_setValue("visitedSites", JSON.stringify(visited));
      clearInterval(myVar);
      console.log("done");
      return;
    } else if (typeof(win) == "undefined" || win.closed) {
      if (list[i].getElementsByTagName("a").length > 0 && list[i].innerText.toLowerCase().includes("free")) {
        win = window.open(list[i].getElementsByTagName("a")[0].href);
        visited.push(list[i].getElementsByTagName("a")[0].href);
      } else if (list[i].innerText.toLowerCase().includes("free")) win = window.open(list[i].href);
      i = i + 1;console.log("iteration inner block");
    }
    console.log("iteration done");
  }, 500);
}
let targets = ["css-5auk98", "css-lrwy1y", "css-1ukp34s", "css-1phf4sm", "css-bjn8wh", "css-ipat9m", "css-1d3w5wq"
              ];
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (targets.includes(mutation.target.className)) {
      wait = wait_max;
    }
    if (mutation.target.tagname == "A") {
      wait = wait_max;
    }
  })
})
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
})
var openerInterval = setInterval(openerLauncher, 1000);

function openerLauncher() {
  if (wait--) return;
  clearInterval(openerInterval);
  opener();
}