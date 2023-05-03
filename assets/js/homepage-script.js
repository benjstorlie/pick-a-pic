window.onload = function() {

  // Go through local storage and populate the pages card deck with the user's saved pages

  populatePageList();
  addFooterButtons();
  $("#card-yesno .btn-edit").addClass("disabled").attr( "aria-disabled","true");
  $("#card-yesno .btn-delete").addClass("disabled").attr( "aria-disabled","true");
  $("#card-sample .btn-edit").addClass("disabled").attr( "aria-disabled","true");
  $("#card-sample .btn-delete").addClass("disabled").attr( "aria-disabled","true");
}

function populatePageList() {
  // Go through local storage and populate the pages card deck with the user's saved pages


  // **
  // The following for..in loop is modified from code I copied from ChatGPT after I told it exactly what I wanted to do -- that is, making sure the object in local storage is of the correct format.
  // For my stored objects, I added a property, stamp, which is equal to its key.  I thought that might be simplest.  Maybe there's a better way to check.
  // I need to research .hasOwnProperty() and try..catch, since I haven't used them before and only seen them in passing.
  // **

  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.hasOwnProperty('stamp') && (key == item.stamp)) {
          // The item is in the correct format
          // Add a new Page Card using the parsed pageData
          addPageCard(item);
        }
      } catch (e) {
        // The item is not a valid JSON string
        // Ignore it and continue with the next item
        continue;
      }
    }
  }
  
}

function addPageCard(pageData) {
  // Format and add to the page list element a new page card, using the information in pageData
  // Make sure to add "data-stamp = ${pageData.stamp}" in useful places.

  let title;
  if (!pageData.title) {
    title="Untitled";
  } else {
    title=pageData.title;
  }
  console.log(pageData.stamp);
  const pageCard = $("<div>").addClass("card page-card m-1 main-card").attr("data-stamp",pageData.stamp)
    .html(`
      <div class="img-page-card img-div" style="height: 100%; width: 100%;isplay: flex; align-self: center; text-align: center; border: blue solid 4px; height: 20vh; width: 28vw; max-width: fit-content;">
      <div class="card-footer" style="text-align: center; border: purple solid 4px;">
        <h5 class="card-title" style="font-size: 2.5vw; border: green solid;">
          ${title}
        </h5>
      </div>
  `);
  // Does the image still want the bootstrap class= "card-img-top"?

  // This gets an image src for the page-card using its cards' images
  pageCard.find(".img-page-card").css("background-image","url('"+ pageCardImgSrc(pageData)+"')");
  
  $("#pages-list").append(pageCard);
}

function pageCardImgSrc(pageData) {
  // This function returns an image src for the page-card of the page with the given pageData.
  // It is called in addPageCard(): `pageCard.find(".img-card").attr(pageCardImgSrc(pageData));`
  // If there is a heading image, that will be the page-card's image
  // Otherwise it will pick one of the images from the cards
  // If there aren't any of those, it will return a sample image.

  if (pageData.heading.src) {
    return pageData.heading.src
  }

  const cardsObject = pageData.cards;

  // This gives an array of all the image sources of the shown cards in the page
  // The array will be empty if there are no images
  const imageSources = 
    Object.keys(cardsObject).map(key => {
      if (cardsObject[key].show && cardsObject[key].src) {
        return cardsObject[key].src
      }
    })
    .filter(Boolean)
  ;

  if (imageSources.length) {
    return imageSources[0];
  }

  return "./assets/images/img-sample.png"

}

function addFooterButtons() {
  // Add all the buttons in the footers of the page cards
  // It might be good to define each button and it's function separately
  // Need to have some way to get the page's stamp
  
  let buttonGroup = $('<div>').addClass("btn-group w-100").attr("role","group");

  let deployBtn = footerButton("btn-success btn-deploy","25B6",deployPage)
  let editBtn = footerButton("btn-primary btn-edit","270F",editPage);
  let copyBtn = footerButton("btn-warning btn-copy","1F4CB",copyPage );
  let deleteBtn = footerButton("btn-danger btn-delete", "1F5D1",deletePage);

  buttonGroup.append(deployBtn).append(editBtn).append(copyBtn).append(deleteBtn);

  $(".card-footer").append(buttonGroup);
}

// ** Footer button functions

function footerButton(btnClass,unicodeCode,fun) {
  // return a jquery button with some features
  return $("<button>")
    .addClass("btn btn-sm "+btnClass)
    .append(emoji(unicodeCode))
    .click(fun);
}

function deployPage(event) {

  const stamp = $(event.target).closest(".card").data("stamp");
  window.location.assign("./deploy.html?page="+stamp)
}

function editPage(event) {
  
  const stamp = $(event.target).closest(".card").data("stamp");
  window.location.assign("./editor.html?page="+stamp)
}

function copyPage(event) {

  const stamp = $(event.target).closest(".card").data("stamp");
  const pageData = JSON.parse(localStorage.getItem(stamp));
  newPage(pageData);

}

function deletePage(event) {

  // ** make warning

  const pageCard = $(event.target).closest(".card")
  const stamp = pageCard.data("stamp");
  localStorage.removeItem(stamp);
  pageCard.remove();

}

function newPage(pageData=undefined) {
  // Create a new page "file":
  // give it a timestamp id, which will be how to locate it in localstorage
  // Open up the editor page ./editor.html?page=stamp
  // Populate the editor with one new card
  // execute saveAllPageData() to create a new space in localstorage

  let stamp = new Date().getTime();

  if (!pageData) {
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
  } else {
    pageData.stamp = stamp;
  }

  localStorage.setItem(stamp,JSON.stringify(pageData));

  window.location.assign("./editor.html?page="+stamp);
}

const yesnoPageData = JSON.parse(`{"stamp":"yesno","title":"Yes/No","heading":{"show":false,"stamp":"heading","title":"","src":""},"cardOrder":["yes","no"],"cards":{"yes":{"stamp":"yes","show":true,"title":"yes","src":"https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee346d8221f87806d2b1eee0438431a/svgs/FirefoxEmoji/u2714-heavycheckmark.svg"},"no":{"stamp":"no","show":true,"title":"no","src":"https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee346d8221f87806d2b1eee0438431a/svgs/FirefoxEmoji/u1F5D9-cancellationx.svg"}}}`);

function newYesNo() {
  newPage(yesnoPageData);
}

function newBlankPage() {
  newPage();
}

function emoji(unicodeCode,attributes='') {
  // returns the html text for an emoji in an <i> tag with class .btn-symbol
  // include more attributes with the optional second parameter


    return `<i class="btn-symbol" role='icon' `+attributes+`>&#x`+unicodeCode+`;</i>`
} 