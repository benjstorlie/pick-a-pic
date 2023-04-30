const space = $("#space");


window.onload = function() {

  let pageData = getPageData();
  console.log(pageData);

  displayCardsAndAttachModals();

  function displayCardsAndAttachModals() {
    if (!pageData.cardOrder.length) {
      $("#space").append(displayCard());
    } else {
      for (i=0;i<pageData.cardOrder.length;i++) {
        space.append(displayCard(pageData.cards[pageData.cardOrder[i]]));
        attachModal(pageData.cardOrder[i]);
      }
    }
  }

}

function gotoHomePage() {
  // include some kind of saving function, just in case?
  window.location.assign("./homepage.html");
}

function deploy() {
  // include some kind of saving function, just in case?
  window.location.assign("./deploy.html"+window.location.search);
}

function displayCard(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card", and has a card object inside

  const card=$("<div>").addClass("card h-100").attr("id","card-"+cardData.stamp);
  card.html(`
      <div class="card-header">
      <form id="form-${cardData.stamp}">
      <input type="text" class="form-control" placeholder="add title" id="input-${cardData.stamp}">
      </form>
    </div>
      <img id="img-${cardData.stamp}" role="button" class="btn" data-toggle="modal" data-target="#modal-${cardData.stamp}">
  `)

  if (cardData.title) {
    card.find("input").val() = cardData.title;
  }

  card.find("form").submit(function(event) {
    event.preventDefault();
    setCardTitle( $(event.target).find("input").val());
  })



  let image=card.find("img");
  image.click(function() {
    $('#modal-'+cardData.stamp).modal('show');
  })

  if (!cardData.src) {
    image.attr("src", "./assets/symbols/u2795-heavyplussign.svg");
  } else {
    image.attr("src", cardData.src);
  }

  return card
}

// Create a function to attach a modal to the document
function attachModal(stamp) {
  // Create the modal HTML elements
  var modalHtml = `
    <div class="modal fade" id="modal-${stamp}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Add Image</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
            <input type="text" class="form-control" id="search-input-${stamp}" placeholder="search">
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="saveImgBtn-${stamp}">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append the modal to the body of the document
  $("#window-container").append(modalHtml);

  // The close buttons on the modals aren't working right now.  Maybe a problem with popper.js?  Either way, I just added it manually here.
  $("#modal-"+stamp+" button[data-dismiss='modal']").click(function() {
      $("#modal-"+stamp).modal("hide");
    }
  )

  // Attach a click event handler to the save button.  function also closes the modal
  $("#saveImgBtn-"+stamp).click({stamp:stamp},saveNewImg);
}

function newCard() {
  // Add a new blank card into the localstorage pageData
  // Use displayCard and attachModal to update the html

  let stamp = new Date().getTime();
  let cardData = {
    show: true,
    stamp: stamp,
    title: '',
    src: ''
  };
}


// **** functions for saving and getting from local storage ****


function getCurrentPageStamp() {
  // Gets the stamp of the current page from the url search parameters
  // So far, there's just one search parameter, "page"

  return window.location.search.slice(6);
}

function savePageData() {

  // Get page stamp from the url search parameters
  const stamp = getCurrentPageStamp();

  // See if there's a page title

  // See if there's a heading
    // If so, get its title and img src
  // Go through all the cards and get their title and img src

  // key = page stamp
  // {title: page title,
  // heading: {stamp: stamp, title: title, src: src}},
  // cards: {{carddata},{carddata},{carddata}}
  // }
}

function getPageData() {
  // return current page's data as an object
  return JSON.parse(localStorage.getItem(getCurrentPageStamp()));
}

function setPageData(object) {

  const stamp = getCurrentPageStamp();
  localStorage.setItem(stamp,JSON.stringify(object));
}

function getCardTitle(stamp) {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.cards[stamp].title;
}

function setCardTitle(titleString) {
  let pageData = getPageData();
  pageData.cards[stamp].title = titleString;
  setPageData(pageData);
}

function getImgSrc(stamp) {
  // from local storage, get the img src of a specific card
  const pageData = getPageData();
  return pageData.cards[stamp].src;
}

function setImgSrc(stamp,src) {
  // from local storage, get the img src of a specific card
  let pageData = getPageData();
  pageData.cards[stamp].src = src;
  setPageData(pageData);
}


function saveNewImg(event) {
  // get new img src from user input
  // **TODO** How are we getting the new image's src?
  // this also closes the modal

  let src = "./assets/images/img-sample.png";
  
  // set new img src in local storage
  setImgSrc(event.stamp,src);
  
  // close the modal
  $("#modal-"+event.stamp).modal("hide");
}