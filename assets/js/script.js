let pexelAPI = "SCqQHONMYkyRGofaJ7drvkznyjeDEyOhCuiy8qalGaJUISc0INFHfVqn";
// Click, drag, resize from https://codepen.io/jkasun/pen/QrLjXP

let picDiv = 0;

window.onload = function() {
    initDragElement();
    initResizeElement();
};
function initDragElement() {
var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;


var elmnt = null;
var currentZIndex = 100; //TODO reset z index when a threshold is passed

var popups = document.getElementsByClassName("popup");
for (var i = 0; i < popups.length; i++) {
    var popup = popups[i];
    var header = getHeader(popup);
    console.log(header);
    popup.onmousedown = function() {
    this.style.zIndex = "" + ++currentZIndex;
    };

    if (header) {
    header.parentPopup = popup;
    header.onmousedown = dragMouseDown;
    }
}

function dragMouseDown(e) {
    elmnt = this.parentPopup;
    elmnt.style.zIndex = "" + ++currentZIndex;

    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    if (!elmnt) {
    return;
    }

    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
}

function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}

function getHeader(element) {
    var headerItems = element.getElementsByClassName("popup-header");
    console.log(headerItems);
    if (headerItems.length === 1) {
      return headerItems[0];
    }

    return null;
  }
}

function initResizeElement() {
    var popups = $(".popup");
    var element = null; 
    var startX, startY, startWidth, startHeight;

    for (var i = 0; i < popups.length; i++) {
        var p = popups[i];

        var right = document.createElement("div");
        right.className = "resizer-right";
        p.appendChild(right);
        right.addEventListener("mousedown", initDrag, false);
        right.parentPopup = p;

        var bottom = document.createElement("div");
        bottom.className = "resizer-bottom";
        p.appendChild(bottom);
        bottom.addEventListener("mousedown", initDrag, false);
        bottom.parentPopup = p;

        var both = document.createElement("div");
        both.className = "resizer-both";
        p.appendChild(both);
        both.addEventListener("mousedown", initDrag, false);
        both.parentPopup = p;
    }

    function initDrag(e) {
        element = this.parentPopup;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(
        document.defaultView.getComputedStyle(element).width,
        10
        );
        startHeight = parseInt(
        document.defaultView.getComputedStyle(element).height,
        10
        );
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);
    }

    function doDrag(e) {
        element.style.width = startWidth + e.clientX - startX + "px";
        element.style.height = startHeight + e.clientY - startY + "px";
    }

    function stopDrag() {
        document.documentElement.removeEventListener("mousemove", doDrag, false);
        document.documentElement.removeEventListener("mouseup", stopDrag, false);
    }
}

function selectPicture(term, photo) {
    $(`#${term}-text`).html(`<img width="200px" src="${photo}"/><br/>`);
}

  function deletecard(divtodelete) {
    let speechBtn = document.getElementById('speechBtn');
    console.log(divtodelete)
    $(`#${divtodelete}`).remove();
   let deletediv =  $(`#${divtodelete}`);
   deletediv.remove()
   console.log(deletediv)
  // Check if speechBtn is defined before calling methods on it
  if (speechBtn) {
    speechBtn.style.display = 'none';
    recognition.stop();
  }

localStorage.removeItem(divtodelete);

}
   
  
function fetchPicture(term) {
    console.log(term);
    let apiURL = "https://api.pexels.com/v1/search?query=" + term + "&size=small&per_page=10";
    fetch(apiURL, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Pexels/JavaScript",
            Authorization: pexelAPI,
        },
    })
    .then(response => {
        return response.json();
    })
    .then(response => {
        console.log(response);
        let picturesHTML = '';
        console.log(response.photos);
        for (let i = 0; i < response.photos.length; i++) {
            picturesHTML += `<img width="200px" src="${response.photos[i].src.medium}"/><br/>`;
            picturesHTML += `<i>Image by: ${response.photos[i].photographer}</i><br/>`;
            picturesHTML += `<a class="btn" onclick="selectPicture('${term}', '${response.photos[i].src.medium}'); return false;">Select Picture</a><br/>`;
        }           
        $('#space').append(`<div class="rounded popup">
            <h5 class="popup-header modal-header--sticky">${term.toUpperCase()} <a class="speak" onclick="speak('${term}'); return false;">🔊</a></h5>
            <div id="${term}-text">
                ${picturesHTML}
            </div>
        </div>`);

        console.log($('.dropdown-menu').children);
        $('.dropdown-menu').append(`<li class="m-1"><a class="dropdown-item" href="#">${term.toUpperCase()}</a></li>`);
        /* Good time to save to localStorage HTML for the elements being created. */
        initDragElement();
        initResizeElement();
        saveState();
        return picturesHTML;
    })

}

function speak(term) {
    let utterance = new SpeechSynthesisUtterance(term);
    speechSynthesis.speak(utterance);
}

function createNew() {
    $(document).ready(function() {
        let searchItem = $('#search').val();
        if (searchItem !== '') {
            fetchPicture(searchItem);
        }
    })
}