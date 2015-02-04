var app = angular.module("TicTacApp", ["firebase"]);

app.controller("TicTacCtrl", function($scope, $firebase){

  var ref = new Firebase("https://toucansam.firebaseio.com/ttt");
  var sync = $firebase(ref);
  $scope.remoteGameContainer = sync.$asObject();


//array of object to give board cells ownership and point values
       
// init variables
$scope.gameStatus="Game On!";
$scope.moveCounter = 0;
$scope.p1Point = 0;
$scope.p2Point = 0;
$scope.leftWinCount = 0;
$scope.rightWinCount = 0;
$scope.playFirst = "";
$scope.playSecond = "";



// Sync this object to firebase.
$scope.gameContainer = {
  boardArray: [{status:"Blank", pt:1}, {status:"Blank", pt:2},  {status:"Blank", pt:4},
        {status:"Blank", pt:8}, {status:"Blank", pt:16}, {status:"Blank", pt:32},
        {status:"Blank", pt:64},{status:"Blank", pt:128},{status:"Blank", pt:256}],
  gameStatus: $scope.gameStatus,
  moveCount: $scope.moveCounter,
  p1Pt: $scope.p1Point,
  p2Pt: $scope.p2Point,
  leftWinC: $scope.leftWinCount,
  rightWinC: $scope.rightWinCount,
  play1st: $scope.playFirst,
  play2nd: $scope.playSecond,
  notification: "",
};

$scope.clearData = function(){ $scope.gameContainer = {};} // clear Firebase data

$scope.gameStart = function(){                        // Restart game
  $scope.gameContainer.boardArray =   [{status:"Blank", pt:1}, {status:"Blank", pt:2},  {status:"Blank", pt:4},
                    {status:"Blank", pt:8}, {status:"Blank", pt:16}, {status:"Blank", pt:32},
                    {status:"Blank", pt:64},{status:"Blank", pt:128},{status:"Blank", pt:256}];
  // init variables
  $scope.gameContainer.gameStatus="Game On!";
  $scope.gameContainer.moveCount = 0;
  $scope.gameContainer.p1Pt = 0;
  $scope.gameContainer.p2Pt = 0;
  $scope.showLeft = "";
  $scope.showRight= "";
  $scope.gameContainer.leftWinC = $scope.leftWinCount;
  $scope.gameContainer.rightWinC = $scope.rightWinCount;
  
};


// Three-way binding with Firebase
$scope.remoteGameContainer.$bindTo($scope,  "gameContainer");
$scope.$watch('gameContainer', function(){
console.log('gameContainer changed!');
console.log($scope.gameStatus);
console.log($scope.gameContainer);
console.log($scope.leftWinCount);

});


var playerWon = false;
// gameplay function
$scope.playerPicks = function(thisCell){ 
                 // function playerPicks starts 
  if ((thisCell.status == "Blank") && ($scope.gameContainer.gameStatus=="Game On!")) {   // check for blank cells and game status is on.
      if (($scope.gameContainer.moveCount % 2) == 0){  
        console.log($scope.gameContainer.moveCount);           // if move counter is odd, then it's P1 move.
        thisCell.status = $scope.gameContainer.play1st;
        $scope.gameContainer.p1Pt = $scope.gameContainer.p1Pt + thisCell.pt ;         // increase P1 points.
      } else if (($scope.gameContainer.moveCount % 2) != 0){        // if move counter is even, then it's P2 move.
        console.log($scope.gameContainer.moveCount); 
        thisCell.status = $scope.gameContainer.play2nd;
        $scope.gameContainer.p2Pt = $scope.gameContainer.p2Pt + thisCell.pt ;         // increase P2 points.
      } 
      $scope.gameContainer.moveCount++ ; // Inc. move count

      var winPoint = [7,56,73,84,146,273,292,448];            // 8 possible winning points in array.

      for (var i=0; i<8; i++){                      // The Win Logic!
        if ((winPoint[i] & $scope.gameContainer.p1Pt) == winPoint[i]){        // Binary check winPoint & first player point
          console.log("p1 win. from For loop.");         // If binary of winPoint & p1Point = winPoint
          $scope.firstPlayerWin();  
          playerWon = true;                      // fire the xWin function
        }                               
        if ((winPoint[i] & $scope.gameContainer.p2Pt) == winPoint[i]){        // Binary check winPoint & second player point
          console.log("p2 win. from For loop.");          // If binary of winPoint & p2Point = winPoint
          $scope.secondPlayerWin();  
          playerWon = true;                     // fire the oWin function
        }
      }

    
    
      if (!playerWon && $scope.gameContainer.moveCount == 9) {              // Fire game-over function when max move is reached
        $scope.gameOver();
        console.log("theend!");
      }; // end if
  } 

}; // function playerPicks ends



//selects which character moves first
$scope.currentPlayer = function(who){                     // Determine left or right side play first.
  if ((who=="left") && ($scope.gameContainer.moveCount == 0)) {
    $scope.gameContainer.play1st ="W";
    $scope.gameContainer.play2nd ="B";
    console.log("yo dawg");
  } else if ((who=="right") && ($scope.gameContainer.moveCount == 0)) {
    $scope.gameContainer.play1st ="B";
    $scope.gameContainer.play2nd ="W";
    console.log("pegleg");
  }; 
};





$scope.firstPlayerWin = function(){                       // First player won
  $scope.gameContainer.gameStatus="First Player Wins!";
    if ($scope.gameContainer.play1st == "W") {
      $scope.showLeft = "Red Wins!";
      $scope.gameContainer.leftWinC = $scope.gameContainer.leftWinC + 1;
      console.log($scope.gameContainer.leftWinC);
    } else if ($scope.gameContainer.play1st == "B") {
      $scope.showRight = "Orange Wins!";
      $scope.gameContainer.rightWinC ++;
    };
};

$scope.secondPlayerWin = function(){                      // Second player won
  $scope.gameContainer.gameStatus="Second Player Wins!";
    if ($scope.gameContainer.play2nd == "W") {
      $scope.showLeft = "Red Wins!";
      $scope.gameContainer.leftWinC = $scope.gameContainer.leftWinC + 1;
    } else if ($scope.gameContainer.play2nd == "B") {
      $scope.showRight = "Orange Wins!";
      $scope.gameContainer.rightWinC ++;
    };
};

$scope.gameOver = function(){                         // Game Over function
  $scope.gameContainer.gameStatus="TIE! Game Over!";
  $scope.showLeft = "Cat's Game";
  $scope.showRight = "Cat's Game";
  console.log("tie")
};

$scope.gameRestart = function(){                        // Restart game
  $scope.gameContainer.boardArray =   [{status:"Blank", pt:1}, {status:"Blank", pt:2},  {status:"Blank", pt:4},
                    {status:"Blank", pt:8}, {status:"Blank", pt:16}, {status:"Blank", pt:32},
                    {status:"Blank", pt:64},{status:"Blank", pt:128},{status:"Blank", pt:256}];
  // init variables
  $scope.gameContainer.gameStatus="Game On!";
  $scope.gameContainer.moveCount = 0;
  $scope.gameContainer.p1Pt = 0;
  $scope.gameContainer.p2Pt = 0;
  $scope.showLeft = "";
  $scope.showRight= "";
};




});




