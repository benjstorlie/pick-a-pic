function newPage(pageData={}) {
  // Create a new page "file":
  // give it a timestamp id, which will be how to locate it in localstorage
  // Open up the editor page ./editor.html?page=stamp
  // Populate the editor with one new card
  // execute saveAllPageData() to create a new space in localstorage

  let stamp = new Date().getTime();

  if (pageData === {}) {
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

const yesnoPageData = JSON.parse(`{"stamp":"yesno","title":"Yes/No","heading":{"show":false,"stamp":"heading","title":"","src":""},"cardOrder":["yes","no"],"cards":{"yes":{"stamp":"yes","show":true,"title":"yes","src":"./assets/symbols/u2714-heavycheckmark.svg"},"no":{"stamp":"no","show":true,"title":"no","src":"./assets/symbols/u1F5D9-cancellationx.svg"}}}`);

function newYesNo() {
  newPage(yesnoPageData);
}