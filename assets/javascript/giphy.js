var baseURL = "https://api.giphy.com/v1/gifs/search?q=";
var apiKey = "dc6zaTOxFJmzC";
var inputVal = "";
var topics = ["Community", "Rick & Morty", "Atlanta", "Strawhat Pirates"];
var queryURL = "";
var imgURL = "";

/* ------------------------------------------------------------------------ */

function resetSearch () {
    $("#search-input").val("");
}

/* clicking 'submit' creates a new topic button */
function searchGiphy (event) {
    event.preventDefault();

    inputVal = $("#search-input").val().trim();

    if (inputVal.length == 0) return;

    if (topics.indexOf(inputVal) > -1) {
        resetSearch();
        return;
    }

    topics.push(inputVal);
    createButtons();
 
    resetSearch();
}

function searchKeypress (event) {
    if (event.keyCode === 13) {  
        searchGiphy(event);
    }
}

/* adding new buttons, adding new topics to the topics array, and adding a space between new buttons */

function createButtons() {
    
    $("#queries").empty();

  for (var i=0; i<topics.length; i++) {
    var newButton = $("<button>");
    newButton.addClass("query-button");
    newButton.attr("data", topics[i]);
    newButton.text(topics[i]);
    $("#queries").append(newButton).append(" ").append(" ");
  }
}
createButtons();

function resetGiphyResults () {
    $("#giphy-results").empty();
}

function showClickCallout () {
    $(".click-callout").show();
}

/* when a button is clicked, the api fetches 6 giphs and displays them as still images */

$(document).on("click", ".query-button", function(event) {
    event.preventDefault();

    showClickCallout();
    var topic = $(this).attr("data");
    var resultCount = 8;
    queryURL = baseURL + topic +"&limit=" + resultCount + "&api_key=" + apiKey;
    console.log(queryURL);
    resetGiphyResults();

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      console.log(response);

      var imgElem;
      for (var i=0; i<8; i++) {
        imgURL = response.data[i].images.fixed_width_still.url;
        gifURL = response.data[i].images.fixed_width.url;
        imgElem = $("<img>");
        imgElem.attr("src", imgURL);
        imgElem.attr("data-still", imgURL);
        imgElem.attr("data-animate", gifURL);
        imgElem.attr("data-state", "still");
        imgElem.addClass("image-result");
        $("#giphy-results").append(imgElem);
      }
    });
  });


/* if the image is clicked, the gif will animate */
$(document).on("click", ".image-result", function(event) {
    event.preventDefault();

    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }

    });