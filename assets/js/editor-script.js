let pexelAPI = "SCqQHONMYkyRGofaJ7drvkznyjeDEyOhCuiy8qalGaJUISc0INFHfVqn";

const space = $("#space");
const headingArea = $("#heading-area");


window.onload = function() {

  let pageData = getPageData();
  console.log(pageData);

  if (!pageData) {
    pageData=newPage(getCurrentPageStamp());
  }

  displayCardsAndAttachModals(pageData);
  if (pageData.title) {
    $("#page-title-input").val(pageData.title);
  }
  $("#page-title-form").submit(function(event) {
    event.preventDefault();
    setPageTitle($("#page-title-input").val());
  })
}

function displayCardsAndAttachModals(pageData) {
  // Create all the generated html

  headingArea.append(displayHeading(pageData.heading));
  headingArea.append(headingButton(pageData.heading.show));
  attachModal("heading");

  if (!pageData.cardOrder.length) {
    space.append(displayCard());
  } else {
    for (i=0;i<pageData.cardOrder.length;i++) {
      const cardData= pageData.cards[pageData.cardOrder[i]];
      space.append(displayCard(cardData));
      attachModal(pageData.cardOrder[i]);
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

function displayCard(cardData={}) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card" (in the current layout setup)

  if (cardData === {}) {
    newCard();
    return
  }

  let stamp = cardData.stamp;

  const card=$("<div>").addClass("card m-1").attr("id","card-"+stamp).attr("data-stamp",stamp);
  card.html(`
      <div class="card-header d-flex flex-row">
        <form id="form-${stamp}" data-stamp="${stamp}" class="flex-grow-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn btn-secondary btn-speech">
                ${emoji("1F4AC")}
              </button>
            </div>
            <input type="text" class="form-control" placeholder="add title" id="input-${stamp}" data-stamp="${stamp}">
          </div>
        </form>
        <button id="delete-${stamp}" data-stamp="${stamp}" type="button" class="close" aria-label="Delete">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
      <button id="img-${stamp}" data-stamp="${stamp}" role="button" class="btn btn-outline-primary img-card img-div" data-toggle="modal" data-target="#modal-${stamp}">
  `)

  if (cardData.title) {
    card.find("input").val(cardData.title);
  }

  card.find("form").submit(function(event) {
    event.preventDefault();
    setCardTitle(stamp, $(this).find("input").val());
  });


  // Add speech button
  card.find(".btn-speech").click(function() {
    speak($("#input-"+stamp).val() );
  });

  let image=card.find(".img-card");
  image.click(function() {
    preShowModal(stamp);
    $('#modal-'+stamp).modal('show');
  });

  if (!cardData.src) {
    image.html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"));
  } else {
    image.css("background-image","url('"+ cardData.src +"')");
  }

  const deleteButton = card.find("#delete-"+stamp);
  deleteButton.click(function() {hideCard(stamp)});

  if (!cardData.show) {
    card.addClass("d-none");
  }

  return card
}

function displayHeading(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card" (in the current layout setup)

  const card=$("<div>").addClass("card my-1 d-flex flex-row").attr("id","heading");
  card.html(`
      <div class="card-left-sider">
        <form id="form-heading">
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn btn-secondary btn-speech">
                ${emoji("1F4AC")}
              </button>
            </div>
            <input type="text" class="form-control" placeholder="add heading or question!" id="input-heading">
          </div>
        </form>
      </div>
        <button id="img-heading" role="button" class="btn btn-outline-primary img-heading img-div" data-toggle="modal" data-target="#modal-heading">
      <button id="delete-heading" type="button" class="close" aria-label="Delete">
        <span aria-hidden="true">&times;</span>
      </button>
  `)

  if (cardData.title) {
    card.find("input").val(cardData.title);
  }

  card.find("form").submit(function(event) {
    event.preventDefault();
    setHeadingTitle($(this).find("input").val());
  });


  // Add speech button next to the title input
  // This also executes whenever you submit the form?  I think that's fine, though.
  card.find(".btn-speech").click(function() {
    speak($("#input-heading").val() );
  });

  // Clicking the image brings up the modal where you can search and choose an image.
  let image=card.find("#img-heading");
  image.click(function() {
    $('#modal-heading').modal('show');
  });

  // If an image wasn't already chosen, put a sample image there.
  if (!cardData.src) {
    image.html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"));
  } else {
    image.css("background-image","url('"+ cardData.src +"')");
  }

  const deleteButton = card.find("#delete-heading");
  deleteButton.click(hideHeading);

  // Does the page actually have a heading or not?
  if (!cardData.show) {
    card.addClass("d-none");
    card.removeClass("d-flex");
  }

  return card
}

function headingButton(show=true) {
  // This button can be clicked to add a heading.  It removes class="d-none" from the heading already in the html, and updates pageData.heading.show.  Then it sets its own display to none.
  // The heading card will have a delete button to do the reverse.

  const button = $("<button>").text("Add heading or question!").addClass("btn btn-warning btn-lg").click(showHeading).attr("id","heading-btn");
  if (show) {
    button.addClass("d-none");
  }
  return button;
}

// Create a function to attach a modal to the document
function attachModal(stamp) {
  // Create the modal HTML elements
  var modalHtml = `
    <div class="modal fade" id="modal-${stamp}" data-stamp="${stamp}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header flex-wrap sticky-top">
            <h4 class="modal-title">Add Image</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="w-100"></div>
            <form id="modal-form-${stamp}" data-stamp="${stamp}" class="d-block">
            <input type="text" class="form-control" id="search-input-${stamp}" data-stamp="${stamp}" placeholder="search">
            </form>
          </div>
          <div id="modal-body-${stamp}" class="modal-body overflow-auto" data-stamp="${stamp}">

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="saveImgBtn-${stamp}" data-stamp="${stamp}">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append the modal to the body of the document
  $("#window-container").append(modalHtml);

  // attach submit event handler
  $("#modal-form-"+stamp).submit(showSearchResults);

  // The close buttons on the modals aren't working right now.  Maybe a problem with popper.js?  Either way, I just added it manually here.
  $("#modal-"+stamp+" button[data-dismiss='modal']").click(function() {
      $("#modal-"+stamp).modal("hide");
    }
  )

  $("#saveImgBtn-"+stamp).click(saveNewImg);

}

function setSaveBtnData(event) {
  // Add the newImg's src to the modal save button as its data-src attribute
  // (Note: this does not change the html, just the data set with jquery)

  console.log(event.detail);

  let newImg = $(event.target);
  let src = newImg.attr("src");
  let stamp = newImg.data("stamp");

  // This shows which image is currently selected
  $('#modal-body-'+stamp+' .img-search-results').removeClass('active');
  newImg.addClass('active');

  // Saving both the html "data-src" attribute and the jquery data set.
  const saveImgBtn = $("#saveImgBtn-"+stamp)
  saveImgBtn.attr("data-src",src);
  saveImgBtn.data("src",src);

  // If the image was double clicked, trigger the save button to click.
  if (event.detail > 1) {
    saveImgBtn.click();
  }

}

function saveNewImg(event) {
  // $(event.target) is the save button, or maybe the new image itself if it is double clicked if I can ever get that to work.
  // get new img src from user input
  // this also closes the modal

  let btn = $(event.target);
  let src = btn.data("src");
  console.log(src)
  let stamp = btn.data("stamp");
  
  // set new img src in local storage

  setImgSrc(stamp,src);
  console.log(stamp+": "+src)

  
  // close the modal
  $("#modal-"+stamp).modal("hide");

  // re-set the image in the card
  $("#img-"+stamp).empty().css("background-image","url('"+ src +"')");
}

function showSearchResults(event) {
  // This gets called when the modal input is submitted
  event.preventDefault();
  const form=$(this);
  const term=form.find("input").val();
  const stamp=form.data("stamp");
  $("#modal-body-"+stamp).empty();

  fetchPicture(term,stamp);
}

function preShowModal(stamp) {
  // If something hasn't already been searched for, and the image has a title, go ahead and search for that by default, otherwise do nothing.

  const modalInput = $("#modal-"+stamp).find("input");
  if (!modalInput.val()) {
    const cardInputVal = $("#card-"+stamp).find("input").val();
    if (cardInputVal) {
      modalInput.val(cardInputVal);
      fetchPicture(cardInputVal,stamp);
    }
  }
}

function fetchPicture(term,stamp) {
  if (!term) {return}

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
          picturesHTML += `<img class="btn img-search-results" src="${response.photos[i].src.medium}" data-src=="${response.photos[i].src.medium}" data-stamp="${stamp}"><br/>`;
          picturesHTML += `<i>Image by: ${response.photos[i].photographer}</i><br/>`;
      }           
      $("#modal-body-"+stamp).html(picturesHTML);
      $("#modal-body-"+stamp+" .img-search-results").click(setSaveBtnData);
  })

}


function newCard() {
  // If there is already a hidden card, show that one, otherwise,
  // Add a new blank card into the localstorage pageData
  // Use displayCard and attachModal to update the html

  // get the stamp of the first hidden card, from its data-stamp="stamp"
  // It will be undefined if there are no hidden cards, so the function will move on.
  let firstHiddenStamp = $('#space .d-none:first').data("stamp");
  if (firstHiddenStamp) {
    showCard(firstHiddenStamp);
    return
  }

  let stamp = new Date().getTime();
  let cardData = {
    show: true,
    stamp: stamp,
    title: '',
    src: ''
  };

  setNewCard(cardData);

  space.append(displayCard(cardData));
  attachModal(stamp);
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

function setPageData(pageData) {

  const stamp = getCurrentPageStamp();
  console.log(pageData);
  localStorage.setItem(stamp,JSON.stringify(pageData));
}

function setNewCard(cardData) {
  const pageData = getPageData();
  pageData.cardOrder.push(cardData.stamp);
  pageData.cards[cardData.stamp] = cardData;
  setPageData(pageData);
}

function hideHeading() {
  const pageData = getPageData();
  pageData.heading.show=false;
  setPageData(pageData);

  $("#heading-btn").removeClass("d-none");
  $("#heading").addClass("d-none");
  $("#heading").removeClass("d-flex");
  
}

function showHeading() {
  const pageData = getPageData();
  pageData.heading.show=true;
  setPageData(pageData);

  $("#heading").addClass("d-flex");
  $("#heading").removeClass("d-none");
  $("#heading-btn").addClass("d-none");
}

function hideCard(stamp) {
  const pageData = getPageData();
  pageData.cards[stamp].show=false;
  setPageData(pageData);

  $("#card-"+stamp).addClass("d-none");
}

function showCard(stamp) {
  const pageData = getPageData();
  pageData.cards[stamp].show=true;
  setPageData(pageData);

  $("#card-"+stamp).removeClass("d-none");
}

function getCardTitle(stamp) {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.cards[stamp].title;
}

function setCardTitle(stamp,titleString) {
  let pageData = getPageData();
  pageData.cards[stamp].title = titleString;
  console.log(pageData.cards[stamp].title);
  setPageData(pageData);
}

function getPageTitle() {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.title;
}

function setPageTitle(titleString) {
  let pageData = getPageData();
  pageData.title = titleString;
  console.log(pageData.title);
  setPageData(pageData);
}

function setHeadingTitle(titleString) {
  let pageData = getPageData();
  pageData.heading.title = titleString;
  console.log(pageData.heading.title);
  setPageData(pageData);
}

function getImgSrc(stamp) {
  // from local storage, get the img src of a specific card
  const pageData = getPageData();
  if (stamp=="heading") {
    pageData.heading.src;
  } else {
    return pageData.cards[stamp].src;
  }
}

function setImgSrc(stamp,src) {
  // from local storage, get the img src of a specific card
  let pageData = getPageData();
  if (stamp=="heading") {
    pageData.heading.src = src;
  } else {
    pageData.cards[stamp].src = src;
  }
  setPageData(pageData);
}

function speak(term) {
  let utterance = new SpeechSynthesisUtterance(term);
  speechSynthesis.speak(utterance);
}

function newPage(currentPageStamp='') {
  // Called either if window.location.search is empty, or it doesn't bring up anything in local storage.
  // Create a new page "file":
  // give it a timestamp id, which will be how to locate it in localstorage
  // Open up the editor page ./editor.html?page=stamp
  // Populate the editor with one new card
  // execute saveAllPageData() to create a new space in localstorage

  let stamp;
  let pageData

  if (!currentPageStamp) {
    stamp = new Date().getTime();
  } else {
    stamp = currentPageStamp;
  }

  console.log(pageData);


  pageData = {
    stamp: stamp,
    title: '',
    heading: {show: false, stamp: "heading", title: '', src: ''},
    cards: {}
  };
  pageData.cards[stamp+2] = {
    show: true,
    stamp: stamp+2,
    title: '',
    src: ''
  };
  pageData.cardOrder=[stamp+2];
  console.log(pageData);


  localStorage.setItem(stamp,JSON.stringify(pageData));

  if (!currentPageStamp) {
    window.location.assign("./editor.html?page="+stamp);
  } else {
    return pageData;
  }
}

function emoji(unicodeCode,attributes='') {
  // returns the html text for an emoji in an <i> tag with class .btn-symbol
  // include more attributes with the optional second parameter


    return `<i class="btn-symbol" role='icon' `+attributes+`>&#x`+unicodeCode+`;</i>`
} 