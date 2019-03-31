$(document).ready(function() {
  //////////////////////////////////////////////////////////////////////////////////////New function
  //Got code for color function from https://stackoverflow.com/questions/20114469/javascript-generate-random-dark-color
  function getRandomColor() {
    var letters = "012345".split("");
    var color = "#";
    color += letters[Math.round(Math.random() * 5)];
    letters = "0123456789ABCDEF".split("");
    for (var i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  //Change page background when page loads
  colorChange();

  //////////////////////////////////////////////////////////////////////////////////////New function

  function colorChange() {
    var colors = getRandomColor();
    //Change body background to random color
    $("body").animate(
      {
        backgroundColor: colors
      },
      1500
    );
  }

//////////////////////////////////////////////////////////////////////////////////////New function

  $("#quoteButton").on("click", function(e) {
    e.preventDefault();
    //Stop box going of screen
    var p = $(".card-deck");
    var position = p.position();
    
    var min = position.left + 40;
    var max = -position.left + 40;
    //Change location of quote box x by random number
    var boxX = Math.floor(Math.random() * (max - min)) + min + "px";
    //alert(boxX)
    $(".card-deck").css("left", boxX);

    //Display quote box using bootstrap ui effect
    $("#quoteHolder")
      .stop(true, true)
      .show("clip", { direction: "vertical" }, 800)
      .animate({ opacity: 1 }, { duration: 800, queue: false });

    //Create random color;
    var color = getRandomColor();

    //$(".btn").css("border-color", color );

    $("#quoteButton, #createQuoteButton , #tweet").animate(
      {
        backgroundColor: color,
        color: "white"
      },
      1500
    );

    //Change body background to random color
    $("body").animate(
      {
        backgroundColor: color,
        color: color
      },
      1500
    );

    var dataArray = "";

    //Use json to find quotes
    $.ajax({
      url:
        "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=2&callback=",
      dataType: "json",
      success: function(data) {
        dataArray = data;

        //console.log(data);
        var noHtmlQuote = [];
        var noHTML = "";

        //Loop though all the values in the object
        data.forEach(function(val, key) {
          //Remove html tags from data
          //noHTML = dataArray[key].content.replace(/[\W_]/g, "")
          noHTML = dataArray[key].content.replace(/(<([^>]+)>)/gi, "");
          noHTML = noHTML.replace(/[  \n ]/gi, " ");
          noHtmlQuote.push(noHTML);
        });
        
        //When sending data to a web server, the data has to be a string.
        $(".card-text").html(JSON.stringify(noHtmlQuote[1]));
        $(".card-author").html(data[0].title);
        //End success section
      },
      cache: false
    }); //End ajax
  }); //End quoteButton function

  //////////////////////////////////////////////////////////////////////////////////////New function

  //Use the create quote button to create a form
  $("#createQuoteButton").on("click", function(e) {
    e.preventDefault();

    $("#hiddenQuoteForm").html(
      "<br><form  action='' method='get'><fieldset class='form-group'><input type='text' id='inputQuote' name='inputQuote' placeholder='Input your quote'></fieldset><button id='submit' class='btn btn-primary'>Submit</button></form>"
    );

    $(".jumbotron").css("padding-bottom", "5px");
  });
}); //End doc.ready

//////////////////////////////////////////////////////////////////////////////////////New function

//When the button in the create form button is pressed add the the quote box

$(document).on("click", "#submit", function(e) {
  e.preventDefault();

  var contant = $("#inputQuote").val().trim();
  $(".card-text").html(contant);
  $(".card-author").html("Me");
  $("#quoteHolder")
    .stop(true, true)
    .show("clip", { direction: "vertical" }, 800)
    .animate({ opacity: 1 }, { duration: 800, queue: false });
});

//////////////////////////////////////////////////////////////////////////////////////New function

//Used to  forward the tweet on twiter
$(document).on("click", "#tweet", function() {
  var tweetContent = $(".card-text").text().trim();
  var tweetAuthor = "," + $(".card-author").text().trim();
  //Twitter exepts a maximum of 140 letter
  var num1 = tweetAuthor.length;
  num1 = num1 + tweetContent.length;

  if (num1 < 140) {
    //Send tweet
    var forwardTweetUrl =
      "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
      tweetContent +
      tweetAuthor;

    window.open(forwardTweetUrl, "_blank");
  } else alert("You cannot input tweets with more than 140 characters");
});
