var cApp = angular.module('starter.controllers', ['ionic', 'firebase']);

// irebase app ref 
var myFirebaseRef = new Firebase("https://logintest103.firebaseio.com/");

// setting uid to null initially 

var checkAuth = function ($scope, $state) { 
  var authData = myFirebaseRef.getAuth(); 

  // checking if user is logged in 
  if (authData) { 
    console.log("user detected");
    console.log("User: " + authData.uid + " is logged in with: " + authData.provider);
    $scope.uid = authData.uid;
  } else { 
    console.log("NO User Detected!");

    // redirecting user to login page 
    $state.go('login');
  }

}


// sign up controller 
cApp.controller('SignupCtrl', function($scope) { 

  // storing signup credenttials in object 
  $scope.signupData = {};

  // sign up function 
  $scope.signup = function () { 
    // calling createUser function from firebase lib
    myFirebaseRef.createUser({
      // passing sign up credentials
      email: $scope.signupData.email, 
      password: $scope.signupData.password

    }, function(error, userData) { 
      // after the createUser has been called 

      if (error) { 
        // there is an error
        console.log("Login signing up: ", error);

      } else { 
        // sign up successful with userData
        console.log("Sign up successfull with user id: ", userData.uid);

        // redirect to home pgae
      }
    }
    );
  };
});



// login controller 
cApp.controller('LoginCtrl', function($scope, $rootScope, $ionicPopup, $state, Items) { 

  // storing login data 
  $scope.loginData = {}; 

  // creatng a callback to handle the result of Authertication process
  function authHandler(error, authData) { 
  	if (error) { 
      // error while loggin in 
      console.log("error while loggin in: ", error); 

    } else { 
      // login successfull
      console.log("authenticated succcessfully with payload: ", authData);

      // saving user id so we save items to his id later
      $rootScope.uid = authData.uid;

      console.log("User Id Stored is: ", $rootScope.uid)

      // reditredt user to home page
      $state.go('home');

    }
  }


  // login function 
  $scope.login = function () { 

    // authing the user with username and password
    myFirebaseRef.authWithPassword({

      // passing in login data 
      email: $scope.loginData.email, 
      password: $scope.loginData.password

      // the auth handler gets executed
    }, authHandler);

  };


  // injecting items factory as a dependency 
  $scope.items = Items;
  

  // function that adds item to firebase Databse. !! note the Items Factory !! 
  $scope.addItem = function() {

    // this prompts the user to enter name item
    var name = prompt("What do you need to buy?");

    // if the user entered a value
    if (name) {

      // the real code for adding the item
      // first we call the dependency 
      // then we call $add which is prefefined in $firebaseArray that we userd in the factory 
      // the add the details, note that you can as much details as you want. 
      $scope.items.$add({
      	"name": name, 
      	"uid": $scope.uid
      });
    }
  };

  // retreive items testing

  $scope.getItems = function () { 
  	console.log("get items button clicked");

    // reference to database named Items 
    var ref = new Firebase("https://logintest103.firebaseio.com/Items");

    // the query 
    // !! child means the property !! 
    // on is triggering the query
    ref.orderByChild("uid").equalTo($scope.uid).on("child_added", function(snapshot) { 
    	console.log(snapshot.key());
    });
  };

  // testing another way to save objects

    // I will create databes called phones
    var ref2 = new Firebase("https://logintest103.firebaseio.com/");
    var usersRef = ref2.child("phones"); 

    $scope.anotherAdd = function () { 

   // adding phones individialy
   usersRef.child("iPhone 6").set({
    // here is the json data
    // just fill it with properities and its values 
    model: "Plus", 
    storage: "16GB", 
    resolution: "retina"
  });

   usersRef.child("Samsugn S5").set({ 
   	model: "Normal",
   	storage: "32GB", 
   	resolution: "Shitty"
   });

 };

// justing adding form to the previous technique 
$scope.newPhone = {};

$scope.addPhone = function () { 
  // refereance to database location 
  usersRef.child($scope.newPhone.name).set({ 
  	model: $scope.newPhone.model, 
  	storage: $scope.newPhone.storage, 
  	resolution: $scope.newPhone.resolution,
  	uid: $scope.uid

  });

  console.log("Phone added successfully!");
};


// function to get phones with current user id 
$scope.getPhone = function () { 
  // ref to data location 
  var phonesRef = new Firebase("https://logintest103.firebaseio.com/phones"); 

  // query 
  phonesRef.orderByChild("uid").equalTo($scope.uid).on("child_added", function(snapshot) { 
    // do something with the snapshots 
    // enum throught the snapshots 
    console.log(snapshot.key());
    // snapshots.forEach(function(data) { 

    //   // do something with this particular snapshot
    //   console.log("Item retrieved is: ", data.key());
    // });
});
};  
});



// add item modal controller
cApp.controller('ModalCtrl', function($scope, $rootScope) { 
	// here we will be creating meals and saving them 

	// I will create databes called meals if not already created. 
  var mealsRef = myFirebaseRef.child("Meals"); 

  $scope.newMeal = {};

    // function that adds the meal object 
    $scope.addMeal = function () { 
    	// referance to database location 
    	mealsRef.child($scope.newMeal.name).set({
        name: $scope.newMeal.name,
        price: $scope.newMeal.price, 
        uid: $rootScope.uid
      });

    	// console buggin 
    	console.log("successfull added yaw!");

    	// closing modal 
    	$scope.closeModal();
    };

  });






// home page controller 
cApp.controller('HomeCtrl', function($scope, $ionicModal, $rootScope) { 


  // function to logout user
  $scope.logout = function () { 
    myFirebaseRef.unauth();
  };

  $scope.allMeals = [];


		// getting meals from database
		$scope.getMeals = function () { 
        $scope.allMeals = [];

			var mealsRef = new Firebase("https://logintest103.firebaseio.com/Meals"); 

      mealsRef.on("child_added", function(snapshot) {
        var newPost = snapshot.val();
        // console.log("Name: " + newPost.name);
        // console.log("Price: " + newPost.price);

          $scope.allMeals.push({
            name: newPost.name, 
            price: newPost.price
          })
      });
};

    
    // testing 
    $scope.testfunc = function () { 
      checkAuth();

    };
   



		// showing the modal to add item 
		$ionicModal.fromTemplateUrl('templates/addItem.html', {
      scope: $scope, 
      animation: 'slide-in-up'
    }).then(function(modal) { 
     $scope.modal = modal;
   });


    $scope.addItem = function () { 
     $scope.modal.show();
     $scope
   };

   $scope.closeModal = function() { 
     $scope.modal.hide();
   };

		// clean up modal when done with it 
		$scope.$on('$destroy', function() { 
			$scope.modal.remove();
		});

		// execute action on hide modal 
		$scope.$on('modal.hidden', function() { 
			// execute action
			// console.log("modal hidden!");
		});

		// execute action on removal of modal 
		$scope.$on('modal.remove', function () { 
			// execute action
			console.log("modal destroyed!");
		});


		// calling getmeals function
		$scope.getMeals(); 

  });