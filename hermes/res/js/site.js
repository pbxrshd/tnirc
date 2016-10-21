

   var UI = (function() {
     var VIEW = ""; // RAPTORS | RAPTOR_DETAIL
     var ACTIVE_LOG_CONTROL= null;
     var LOG_ATTRS = ["weight","rodent","quail","remains","casts","feces","urates","attitude","cleaning","water","exercise","weather"];

     function init(view) {
       VIEW = view;
       switch (VIEW) {
         case "RAPTORS":
           var listHtml = "";
           (Object.keys(DATA.RAPTORS)).forEach(function(e) {
            listHtml += raptorListHtml(e);
           });
           html("#raptors-list", listHtml);
         break;
         case "RAPTOR_DETAIL":
           if (location.hash.length > 1) {
             setupRaptorDetail(location.hash.substring(1));
           }
         break;
         default:
           console.log("unknown view");
         break;
       }
     }

     function clicked(id, params) {
       switch (id) {
         case "main_menu_icon":
           showHide("#main_menu");
         break;
         case "raptor_detail":
           go("raptor-detail.html" + "#" + params);
         break;
         case "main_menu":
           go(params + ".html");
         break;
         case "log_control":
           logControlClicked(params);
         break;
         case "log_modal_header":
           logModalHeaderClicked(params);
         break;
         case "log_item":
           logItemClicked(params);
         break;

         default:
           console.log("unknown id clicked: " + id);
         break;
       }
     }
     //
     function raptorListHtml(id) {
       var html = "";
       html += "<div class=\"card";
       if ("Today" !== DATA.LOG[id].date) {
         html += " not-done";
       }
       html += "\" onclick=\"UI.clicked('raptor_detail','" + id + "')\">";
       html += "<div class=\"pic\"><img src=\"res/img/raptors/TN_" + id + ".jpg\" class=\"pic\" /></div>";
       html += "<div class=\"l1\">" + DATA.RAPTORS[id].name + "</div>";
       html += "<div class=\"l2\">Last Entry:</div>";
       html += "<div class=\"l3\">" + getDateFormatted(DATA.LOG[id].date) + "</div>";
/*
DATA = {
  "RAPTORS" : {
    "RTH" : {
      "name" : "Red-Tailed Hawk",
      "pic" : "res/img/raptors/TN_RTH.jpg"
    },
  "LOG" : {
    "RTH" : {
      "date" : "Yesterday",
  <div class="card not-done" onclick="UI.clicked('raptor_detail','AK')">
    <div class="pic"><img src="res/img/raptors/TN_AK.jpg" class="pic" /></div>
    <div class="l1">American Kestrel</div>
    <div class="l2">Last Entry:</div>
    <div class="l3">Yesterday (Wed Oct 11)</div>
  </div>
*/
       html += "</div>";
       return html;
     }
     //
     function setupRaptorDetail(id) {
       id = location.hash.substring(1);
       var raptorData = DATA.RAPTORS[id];
       html("#page_header .header-center", id);
       text("div.body-header div.title", raptorData.name);
       document.querySelector("div.body-header img.pic").src = raptorData.pic;
       var temperatures = getTemperatures();
       html("div.body-header div.temp", temperatures.high + " - " + temperatures.low + "&deg;F");
       var logData = DATA.LOG[id];
       text("div.body-header div.date", getDateFormatted(logData.date));
       LOG_ATTRS.forEach(function(attr) {
         text("#" + attr + " div.control", logData[attr]);
       });
     }
     //
     function logControlClicked(params) {
       ACTIVE_LOG_CONTROL = params;// save current control id
       hide("#page_header");
       show("#modal_header");
       text("#log_control_modal .header-sub .title1", ACTIVE_LOG_CONTROL);
       html("#log_control_modal ul", getLogControlHtml(ACTIVE_LOG_CONTROL));
       show("#log_control_modal");
     }
     //
     function logModalHeaderClicked(params) {
       if (params === "save") {
         var selectedItems = getElementsForSelector("#log_control_modal li.item-check");
         selectedItems = selectedItems.map(function(e){return text(e);});
         text("#" + ACTIVE_LOG_CONTROL + " div.control", selectedItems.join(","));
       } else {

       }
       hide("#modal_header");
       show("#page_header");
       hide("#log_control_modal");
       ACTIVE_LOG_CONTROL = null;// clear current control id
     }
     //
     function logItemClicked(params) {
       var targetRef = params.target;
       if (containsClass(targetRef, "item")) {
         var targetWasChecked = containsClass(targetRef, "item-check");
         getElementsForSelector("#log_control_modal li.item-check").forEach(function(e){removeClass(e,"item-check")});
         if (!targetWasChecked) {
          addClass(targetRef, "item-check");
         }
       }
     }
     //
     function getLogControlHtml(id) {
       var html = "";
       var data = DATA.LOG_CONTROLS[id];
       var selectedValues = text("#" + id + " div.control").split(",");
       if (id === "casts" ||
           id === "weight" ||
           id === "rodent" ||
           id === "quail" ||
           id === "remains") {
         var value = data.min;
         while (value <= data.max) {
           html += getItem(value, selectedValues);
           value++;
         }
       }
       if (id === "feces" ||
           id === "urates" ||
           id === "attitude" ||
           id === "cleaning" ||
           id === "water" ||
           id === "exercise" ||
           id === "weather") {
         var values = data.values;
         values.forEach(function(value) {
           html += getItem(value, selectedValues);
         });

       }
       return html;
       //
       function getItem(value, selectedValues) {
         value = "" + value;
         var itemHtml = "<li class=\"item";
         if (selectedValues && (selectedValues.indexOf(value) > -1)) {
           itemHtml += " item-check";
         }
         itemHtml += "\">" + value + "</li>";
         return itemHtml;
       }
     }

     return {
       init : init,
       clicked : clicked
     }
   })(); // UI




/**
 * Helper utilities
 */
//
function show(selectorOrRef, baseSelectorOrRef) {
  if (typeof(selectorOrRef) === "string") {
    getElementsForSelector(selectorOrRef, baseSelectorOrRef).forEach(function(e){e.classList.remove("hide")});
  } else {
    selectorOrRef.classList.remove("hide");
  }
}
//
function hide(selectorOrRef, baseSelectorOrRef) {
  if (typeof(selectorOrRef) === "string") {
    getElementsForSelector(selectorOrRef, baseSelectorOrRef).forEach(function(e){e.classList.add("hide")});
  } else {
    selectorOrRef.classList.add("hide");
  }
}
//
function showHide(selector) {
  (getElementsForSelector(selector)).forEach(function(e){(e.classList.contains("hide"))?show(e):hide(e);});
}
//
function containsClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    return document.querySelector(selectorOrRef).classList.contains(className);
  } else {
    return selectorOrRef.classList.contains(className);
  }
}
//
function toggleClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.toggle(className);
  } else {
    selectorOrRef.classList.toggle(className);
  }
}
//
function removeClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.remove(className);
  } else {
    selectorOrRef.classList.remove(className);
  }
}
//
function addClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.add(className);
  } else {
    selectorOrRef.classList.add(className);
  }
}
//
/*
  gets elements specified by selector
  selector is a string of the selector expression
  baseSelectorOrRef is optional
  if baseSelectorOrRef is passed in, the selection of selector is performed with baseSelectorOrRef as root
  if baseSelectorOrRef is not passed in, the selection of selector is performed with document as root
  baseSelectorOrRef can be a string of the selector expression to be used as root
  baseSelectorOrRef can be a reference to the dom element to be used as root
  returns an array of selected elements
  returns empty array on error
*/
function getElementsForSelector(selector, baseSelectorOrRef) {
  var baseRef = document;
  if (baseSelectorOrRef) {
    baseRef = (typeof(baseSelectorOrRef)==="string")?document.querySelector(baseSelectorOrRef):baseSelectorOrRef;
  }
  return [].slice.call(baseRef.querySelectorAll(selector)); // convert nodeList to array
}
//
function go(url) {
  location.replace(url);
}
//
function html(selectorOrRef, newHtml) {
  var ref = (typeof(selectorOrRef)==="string")?document.querySelector(selectorOrRef):selectorOrRef;
  if (typeof(newHtml) !== "undefined") {
    ref.innerHTML = newHtml;
  } else {
    return ref.innerHTML;
  }
}
//
function text(selectorOrRef, newText) {
  var ref = (typeof(selectorOrRef)==="string")?document.querySelector(selectorOrRef):selectorOrRef;
  if (typeof(newText) !== "undefined") {
    ref.textContent = newText;
  } else {
    return (ref.textContent).trim();
  }
}
//
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
/* Helper utilities */

/* services */
function getTemperatures() {
  return {"high": getRandomArbitrary(70,54), "low": getRandomArbitrary(50,39)};
}
//
function getDateFormatted(code) {
  var formatted = "";
  var date = new Date();
  if (code === "Yesterday") {
    date.setDate(date.getDate() - 1);
  }
  formatted += code + " ";
  formatted += ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()];
  formatted += " " + date.getDate() + " ";
  formatted += ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()];
  return formatted;
}
/* services */


var DATA = {
  "RAPTORS" : {
    "RTH" : {
      "name" : "Red-Tailed Hawk",
      "pic" : "res/img/raptors/TN_RTH.jpg"
    },
    "GHO" : {
      "name" : "Great Horned Owl",
      "pic" : "res/img/raptors/TN_GHO.jpg"
    },
    "AK" : {
      "name" : "American Kestrel",
      "pic" : "res/img/raptors/TN_AK.jpg"
    },
    "BO" : {
      "name" : "Barred Owl",
      "pic" : "res/img/raptors/TN_BO.jpg"
    },
    "WSO" : {
      "name" : "Western Screech Owl",
      "pic" : "res/img/raptors/TN_WSO.jpg"
    }
  },
  "LOG_CONTROLS" : {
    "weight" : {"min":0,"max":100},
    "rodent" : {"min":0,"max":8},
    "quail" : {"min":0,"max":4},
    "remains" : {"min":0,"max":8},
    "casts" : {"min":0,"max":8},
    //"feces" : {"values":[["normal","abnormal"]]},
    //"urates" : {"values":[["normal","abnormal"]]},
    //"attitude" : {"values":[["aware","unaware"],["responsive","unresponsive"],["quiet","vocal"],"agressive","puffed up","weak","stressed"]},
    //"cleaning" : {"values":[["did not clean","spot cleaned","deep cleaned"]]},
    //"water" : {"values":[["did not change","fresh water"]]},
    //"exercise" : {"values":[["indoor","weathered","walked","at program"]]},
    //"weather" : {"values":["sunny","windy","humid","rain","snow","ice"]}
    "feces" : {"values":["normal","abnormal"]},
    "urates" : {"values":["normal","abnormal"]},
    "attitude" : {"values":["aware","unaware","responsive","unresponsive","quiet","vocal","agressive","puffed up","weak","stressed"]},
    "cleaning" : {"values":["spot cleaned","deep cleaned"]},
    "water" : {"values":["did not change","fresh water"]},
    "exercise" : {"values":["indoor","weathered","walked","at program"]},
    "weather" : {"values":["sunny","windy","humid","rain","snow","ice"]}
  },

  "LOG" : {
    "RTH" : {
      "date" : "Yesterday",
      "weight" : "",
      "rodent" : "",
      "quail" : "",
      "remains" : "",
      "casts" : "",
      "feces" : "",
      "urates" : "",
      "attitude" : "",
      "cleaning" : "",
      "water" : "",
      "exercise" : "",
      "weather" : ""
    },
    "GHO" : {
      "date" : "Today",
      "weight" : "95",
      "rodent" : "2",
      "quail" : "1",
      "remains" : "12",
      "casts" : "2",
      "feces" : "",
      "urates" : "normal",
      "attitude" : "responsive",
      "cleaning" : "spot cleaned",
      "water" : "fresh water",
      "exercise" : "walked",
      "weather" : "sunny"
    },
    "AK" : {
      "date" : "Yesterday",
      "weight" : "",
      "rodent" : "",
      "quail" : "",
      "remains" : "",
      "casts" : "",
      "feces" : "",
      "urates" : "",
      "attitude" : "",
      "cleaning" : "",
      "water" : "",
      "exercise" : "",
      "weather" : ""
    },
    "BO" : {
      "date" : "Today",
      "weight" : "52",
      "rodent" : "2",
      "quail" : "0",
      "remains" : "5",
      "casts" : "2",
      "feces" : "normal",
      "urates" : "",
      "attitude" : "agressive",
      "cleaning" : "deep cleaned",
      "water" : "fresh water",
      "exercise" : "indoor",
      "weather" : "sunny"
    },
    "WSO" : {
      "date" : "Today",
      "weight" : "35",
      "rodent" : "1",
      "quail" : "0",
      "remains" : "2",
      "casts" : "1",
      "feces" : "abnormal",
      "urates" : "normal",
      "attitude" : "quiet",
      "cleaning" : "did not clean",
      "water" : "did not change",
      "exercise" : "weathered",
      "weather" : "sunny"
    }
  }

}






