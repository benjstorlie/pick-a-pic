const space = $("#space");
const headingArea = $("#heading-area");

const yesnoPageData = JSON.parse(`{"stamp":"yesno","title":"Yes/No","heading":{"show":false,"stamp":"heading","title":"","src":""},"cardOrder":["yes","no"],"cards":{"yes":{"stamp":"yes","show":true,"title":"yes","src":"./assets/symbols/u2714-heavycheckmark.svg"},"no":{"stamp":"no","show":true,"title":"no","src":"./assets/symbols/u1F5D9-cancellationx.svg"}}}`);

window.onload = function() {

  let pageData;
  if (window.location.search == "?page=yesno") {
    pageData=yesnoPageData;
  } else {
    pageData = getPageData();
  }
  console.log(pageData);

  if (pageData.title) {
    console.log(pageData.title);
  }

  if (pageData.heading) {
    headingArea.append(displayHeading(pageData.heading));
  }

  for (i=0;i<pageData.cardOrder.length;i++) {
    if (pageData.cards[pageData.cardOrder[i]].show) {
      space.append(displayCard(pageData.cards[pageData.cardOrder[i]]));
    }
  }

}

function gotoHomePage() {
  // include some kind of saving function, just in case?
  window.location.assign("./homepage.html");
}

function displayCard(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card", and has a card object inside

  const card=$("<div>").addClass("card m-1").attr("id","card-"+cardData.stamp);
  
  if (cardData.title) {
    card.append(`
      <div class="card-header">
        <h5 class="card-title">${cardData.title}</h5>
      </div>
    `)

    // Add event handler for clicking card to speak cardData.title
    card.click(function() {
      speak(cardData.title);
    })

  }
  if (cardData.src) {
    card.append(`
      <div class="card-img-btm p-1 img-deploy-card img-div" style="background-image:url('${cardData.src}')">
    `)
  }

  return card
}

function displayHeading(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card", and has a card object inside

  const card=$("<div>").addClass("card d-flex flex-row").attr("id","heading");
  
  if (cardData.title) {
    card.append(`
      <div class="card-left-sider">
        <h5>${cardData.title}</h5>
      </div>
    `)

    // Add event handler for clicking card to speak cardData.title
    card.click(function() {
      speak(cardData.title);
    })

  }
  if (cardData.src) {
    card.append(`
      <div class="card-img-btm p-1 img-deploy-card img-div" style="background-image:url('${cardData.src}')">
    `)
  }

  return card
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

function getPageTitle() {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.title;
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

function speak(term) {
  let utterance = new SpeechSynthesisUtterance(term);
  speechSynthesis.speak(utterance);
}