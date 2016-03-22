var map; var current; 
function loadJSON() {

    xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../data/clark/map.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            map = JSON.parse(xobj.responseText);
            for (imgName in map) {
                var img = document.createElement("img");
                var imgId = document.createAttribute("id");
                var imgSrc = document.createAttribute("src");
                imgId.value = imgName;
                imgSrc.value = "../data/clark/"+imgName+".jpg";
                img.setAttributeNode(imgId);
                img.setAttributeNode(imgSrc);
                document.getElementsByTagName("a-assets")[0].appendChild(img);
            }
            walk("init");
        }
    }
    xobj.send(null);
}

// Call to function with anonymous callback
loadJSON();

var mouseMoved = false;
var mousedown = false;
function walk(direction) {
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
            current = "479053675.664591";
        }
        if (info[1]){
            document.getElementsByTagName("a-camera")[0].setAttribute("rotation","0 "+info[1]+" 0");
        }
    }
    document.getElementsByTagName("a-sky")[0].setAttribute("src","../data/clark/"+current+".jpg");
    for (arrow in map[current]) {
        if (arrow != "rotate") {
            if (map[current][arrow] == "null") {
                document.getElementById(arrow).setAttribute("scale","0 0 0");
            } else {
                document.getElementById(arrow).setAttribute("scale","10 10 0");
            }
        } else {
            document.getElementsByTagName("a-sky")[0].setAttribute("rotation", "0 "+map[current][arrow]+" 0");
        }
    }
}
