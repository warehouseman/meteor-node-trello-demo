Meteor.startup(function () {
  if (Meteor.settings == null) Meteor.settings = {};
  Meteor.settings.PROJECT_NAME="meteor-node-trello-demo";
});
