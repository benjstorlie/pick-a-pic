window.onload = function() {

  // Go through local storage and populate the pages card deck with the user's saved pages
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
        if (item.hasOwnProperty('stamp') && key === item.stamp) {
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

  let cardHtml = `
    <div class="card page-card">
      <img class="card-img-top img-page-card w-100" src="./assets/images/img-sample.png">
      <div class="card-footer">
        <h5 class="card-title">
          ${pageData.title}
        </h5>
      </div>
    </div>
  `;

  

}

function addFooterButtons() {
  // Add all the buttons in the footers of the page cards
  // It might be good to define each button and it's function separately
  // Need to have some way to get the page's stamp
  

  $(".card-footer").append(`
  <div class="btn-group w-100" role="group">
    <button class="btn btn-success disabled"><img src="./assets/symbols/u25B6-blackrightpointingarrow.svg" class="btn-symbol"></button>
    <button class="btn btn-primary" onclick="newPage()"><img src="./assets/symbols/u270F-pencil.svg" class="btn-symbol"></button>
  </div>
  `);

}

function newPage(pageData=undefined) {
  // Create a new page "file":
  // give it a timestamp id, which will be how to locate it in localstorage
  // Open up the editor page ./editor.html?page=stamp
  // Populate the editor with one new card
  // execute saveAllPageData() to create a new space in localstorage

  let stamp = new Date().getTime();

  console.log(pageData);

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
    console.log(pageData);
  } else {
    pageData.stamp = stamp;
  }

  localStorage.setItem(stamp,JSON.stringify(pageData));

  window.location.assign("./editor.html?page="+stamp);
}

const yesnoPageData = JSON.parse(`{"stamp":"yesno","title":"Yes/No","heading":{"show":false,"stamp":"heading","title":"","src":""},"cardOrder":["yes","no"],"cards":{"yes":{"stamp":"yes","show":true,"title":"yes","src":"./assets/symbols/u2714-heavycheckmark.svg"},"no":{"stamp":"no","show":true,"title":"no","src":"./assets/symbols/u1F5D9-cancellationx.svg"}}}`);

function newYesNo() {
  newPage(yesnoPageData);
}

function newBlankPage() {
  newPage();
}

