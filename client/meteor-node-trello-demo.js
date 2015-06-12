if (Meteor.isClient) {


  Meteor.startup(function () {

      Meteor.call("trelloProxy_setKey", function (err, keyTrello) {
        console.log("Developer key :: " + keyTrello);
        Trello.setKey(keyTrello);
      });

      Meteor.call("trelloProxy_get", "/1/members/me", function (err, userName) {
        console.log(userName);
        Session.set('acctTrelloUser', userName);
      });
  });

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter') ;
    },
    valTrello: function () {
      if (null == Session.get('acctTrelloUser')) return "???" ;
      return Session.get('acctTrelloUser').username ;
    }

  });

  Template.hello.events({
    'click .countUp': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      Meteor.call("trelloProxy_get", "/1/members/me", function (err, userName) {
        console.log(userName);
        Session.set('acctTrelloUser', userName);
      });

    },
    'click .connect': function () {
        Trello.authorize({
            type: "popup",
            success: onAuthorize,
            name : Meteor.settings.PROJECT_NAME,
            expiration : "never",
            scope: { write: true, read: true }
        });

    },
    'click .disconnect': function () {
        logout();
    }
  });


  var onAuthorize = function() {
      console.log( "Authorization Token ::  " + Trello.token());
      updateLoggedIn();
      $("#output").empty();
      
      Trello.members.get("me", function(member) {
          console.log(" full ? " + member.fullName);
          console.log(member);
          $("#fullName").text(member.fullName);
      
          var $cards= $("<div>")
              .text("Loading Cards...")
              .appendTo("#output");

          // Output a list of all of the cards that the member 
          // is assigned to
          Trello.get("members/me/cards", function(cards) {
              $cards.empty();
              $("<div>").text("These cards are assigned to you. Click one to add a comment to it").appendTo($cards);
              
              $.each(cards, function(ix, card) {
                  $("<a>")
                  .addClass("card")
                  .text(card.name)
                  .appendTo($cards)
                  .click(function(){
                      Trello.post("cards/" + card.id + "/actions/comments", { text: "Hello from Meteor Trello demo!" })
                  })
              });  
          });
      });

  };

  var updateLoggedIn = function() {
      var isLoggedIn = Trello.authorized();
      $("#loggedout").toggle(!isLoggedIn);
      $("#loggedin").toggle(isLoggedIn);        
  };
      
  var logout = function() {
      Trello.deauthorize();
      updateLoggedIn();
  };
/*                            
  Trello.authorize({
      interactive:false,
      success: onAuthorize
  });
*/
}
