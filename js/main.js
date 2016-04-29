var map;
var current;
var folderName;

function loadJSON(inputName, startImg) {

    folderName = inputName;
    xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../data/' + folderName + '/map.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            map = JSON.parse(xobj.responseText);
            for (imgName in map) {
                var img = document.createElement("img");
                img.setAttribute("id",imgName);
                img.setAttribute("src","../data/"+folderName+"/"+imgName+".jpg");
                document.getElementsByTagName("a-assets")[0].appendChild(img);
            }
            walk("init", startImg);
        }
    }
    xobj.send(null);
}

var mouseMoved = false;
var mousedown = false;
function walk(direction, startImg) {
    // handle drag without click
    document.querySelector('html').addEventListener('mousedown', function () {
        mousedown = true;
    });
    document.querySelector('html').addEventListener('mousemove', function () {
        if (mousedown) {
            mouseMoved = true;
        } else {
            mouseMoved = false;
        }
    });
    document.querySelector('html').addEventListener('mouseup', function () {
        window.setTimeout(function() {
            mousedown = false;
            mouseMoved = false;
        });
    });

    var info = window.location.search.substring(1).split("&");
    if (direction != "init") {
        if (!mouseMoved) {
            current = map[current][direction];
        }
    } else {

        if (info[0]) {
            current = info[0];
        } else {
            current = startImg;
        }
        if (info[1]){
            document.getElementsByTagName("a-camera")[0].setAttribute("rotation","0 "+info[1]+" 0");
        }
    }
    for (arrow in map[current]) {
        if (arrow != "rotate") {
            if (map[current][arrow] == "null" || map[current][arrow] == "") {
                document.getElementById(arrow).setAttribute("scale","0 0 0");
            } else {
                document.getElementById(arrow).setAttribute("scale","10 10 0");
            }
        } else {
            document.getElementsByTagName("a-sky")[0].setAttribute("src","../data/"+folderName+"/"+current+".jpg");
            document.getElementsByTagName("a-sky")[0].setAttribute("rotation", "0 "+map[current][arrow]+" 0");
        }
    }
}
