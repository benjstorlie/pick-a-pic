function newPage() {
  // Create a new page "file":
  // give it a timestamp id, which will be how to locate it in localstorage
  // Open up the editor page ./editor.html?page=stamp
  // Populate the editor with one new card
  // execute saveAllPageData() to create a new space in localstorage

  let stamp = new Date().getTime();

  let newPageData = {
    stamp: stamp,
    title: '',
    heading: {show: false, stamp: stamp+1, title: '', src: ''},
    cards: {}
  };
  newPageData.cards[stamp+2] = {
    show: true,
    stamp: stamp+2,
    title: '',
    src: ''
  };
  newPageData.cardOrder=[stamp+2];

  localStorage.setItem(stamp,JSON.stringify(newPageData));

  window.location.assign("./editor.html?page="+stamp);
}