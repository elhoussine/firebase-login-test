var sApp = angular.module('starter.services', ['ionic', 'firebase']);

// factory 
sApp.factory("Items", function($firebaseArray) { 
  var itemsRef = new Firebase("https://logintest103.firebaseio.com/Items");
  return $firebaseArray(itemsRef);
});

sApp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://logintest103.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]);
