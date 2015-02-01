var app=angular.module("TicTacApp", ['firebase']);

app.controller("TicTacCtrl", function($scope, $firebase){
	//Credit to Sam and Wendy for this general setup.
	//Sync the board:
	var boardRef = new Firebase("https://tic-tac-angular.firebaseio.com/board");
	var boardSync = $firebase(boardRef);
	$scope.board = boardSync.$asArray();
 	//Sync the turnNumber:
 	var turnNumRef = new Firebase("https://tic-tac-angular.firebaseio.com/turnNum");
 	var turnNumSync = $firebase(turnNumRef);
 	$scope.turnNumber = turnNumSync.$asArray();
 	//Sync up player true and false (to NOT be updated later)
 	var playerRef = new Firebase('https://tic-tac-angular.firebaseio.com/players');
 	var playerSync = $firebase(playerRef);
 	$scope.players = playerSync.$asArray();
 	//declare as false
 	$scope.players.$loaded(function(){
 		if($scope.players.length === 0){
 			$scope.players.$add({playerOne: false, playerTwo: false});
 		}
 		else {
 			$scope.players[0].playerOne = false;
 			$scope.players[0].playerTwo = false;
 			$scope.players[0].$save(0);
 		}
 	});
 	//Make a board:
    $scope.board.$loaded(function(){
    	if($scope.board.length == 0){
    		for(var i = 0; i < 9; i++){
    			$scope.board.$add({GamesIcon: "&nbsp;"});
    		}
    	}
    	else{
    		for(var i = 0; i < 9; i++){
    			$scope.board[i].GamesIcon = "&nbsp;";
    			$scope.board.$save(i);
    		}
    	}
    });
    // Make up a turn counter:
    $scope.turnNumber.$loaded(function(){
   		if($scope.turnNumber.length === 0){
   			$scope.turnNumber.$add({turnNum: 0});
   		}
   		else{
   			$scope.turnNumber[0].turnNum = 0;
   			$scope.turnNumber.$save(0);
   		}          
    });

    $scope.win1 = [0,1,2,null,null,null,null,null,null]; //check
	$scope.win2 = [null,null,null,3,4,5,null,null,null]; //check
	$scope.win3 = [null,null,null,null,null,null,6,7,8]; //check
	$scope.win4 = [0,null,null,3,null,null,6,null,null]; //check
	$scope.win5 = [null,1,null,null,4,null,null,7,null]; //check
	$scope.win6 = [null,null,2,null,null,5,null,null,8]; //check
	$scope.win7 = [0,null,null,null,4,null,null,null,8]; //check
	$scope.win8 = [null,null,2,null,4,null,6,null,null]; //check

	//defines empty varables with 8 places for the two users:
	$scope.user1 = [null,null,null,null,null,null,null,null,null];
	$scope.user2 = [null,null,null,null,null,null,null,null,null];
	// $scope.gameBoard = [];
	$scope.user1Name = "Player 1";
	$scope.user2Name = "Player 2";
	$scope.gameIcon1 = "X";
	$scope.gameIcon2 = "O";
	$scope.user1ID = 1;
	$scope.user2ID = 2;
	$scope.winner = false;



	    $scope.makeMove = function(idx){
	    	if($scope.turnNumber[0].turnNum == 0){
	    		$scope.players[0].playerOne = true;
	    	}
	    	else if(($scope.turnNumber[0].turnNum == 1) && ($scope.players[0].playerOne !== true)){
	    		$scope.players[0].playerTwo = true;
	    	}

	    	if(($scope.board[idx].GamesIcon == "&nbsp;") && ($scope.turnNumber[0].turnNum % 2 === 0) && ($scope.players[0].playerOne == true)){

		        $scope.gameIcon = ($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.gameIcon1 : $scope.gameIcon2;
		        $scope.board[idx].GamesIcon = $scope.gameIcon;
		        $scope.board.$save(idx);

		        $scope.currentUser = (($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.user1 : $scope.user2);
		        $scope.currentUser[idx] = idx;

		        $scope.currentUserName = (($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.user1Name : $scope.user2Name);
		       		console.log("new move:");
		       		console.log($scope.turnNumber.turnNum)
		       		console.log($scope.currentUserName);
		       		console.log($scope.currentUser);
		       		console.log($scope.board);
		       		console.log($scope.win1);
		       		console.log(idx);
		       		console.log($scope.turnNumber[0].turnNum);
		   
	        	
		        if(
				(($scope.win1[0] == $scope.currentUser[0]) && ($scope.win1[1] == $scope.currentUser[1]) && $scope.win1[2] == $scope.currentUser[2]) ||
				(($scope.win2[3] == $scope.currentUser[3]) && ($scope.win2[4] == $scope.currentUser[4]) && $scope.win2[5] == $scope.currentUser[5]) ||
				(($scope.win3[6] == $scope.currentUser[6]) && ($scope.win3[7] == $scope.currentUser[7]) && $scope.win3[8] == $scope.currentUser[8]) ||
				(($scope.win4[0] == $scope.currentUser[0]) && ($scope.win4[3] == $scope.currentUser[3]) && $scope.win4[6] == $scope.currentUser[6]) ||
				(($scope.win5[1] == $scope.currentUser[1]) && ($scope.win5[4] == $scope.currentUser[4]) && $scope.win5[7] == $scope.currentUser[7]) ||
				(($scope.win6[2] == $scope.currentUser[2]) && ($scope.win6[5] == $scope.currentUser[5]) && $scope.win6[8] == $scope.currentUser[8]) ||
				(($scope.win7[0] == $scope.currentUser[0]) && ($scope.win7[4] == $scope.currentUser[4]) && $scope.win7[8] == $scope.currentUser[8]) ||
				(($scope.win8[2] == $scope.currentUser[2]) && ($scope.win8[4] == $scope.currentUser[4]) && $scope.win8[6] == $scope.currentUser[6])
				) {
					console.log($scope.currentUserName + " Wins this round"); 
					alert($scope.currentUserName + " Wins this round");
					$scope.endGame();
					$scope.square = 'Z';

					
				} 
				else if ($scope.turnNumber[0].turnNum == 8){
					console.log("Tie Game");
					console.log($scope.turnNumber[0].turnNum);
					alert("It's a tie!");
				}
				else {
					console.log("No news, the game goes on");
				}

			$scope.turnNumber[0].turnNum++;
			$scope.turnNumber.$save(0);
				$scope.endGame = function(){
					$scope.turnNumber[0].turnNum=0;
					if($scope.gameIcon == "X"){
						for (var i=0; i < 9; i++){
							// $scope.board[i].GamesIcon = "xWin";
							// $scope.board.$save(i);
							$scope.user1[i] = "";
							$scope.user2[i] = "";

						}
					}
					else if($scope.gameIcon == "O"){
						for (var i=0; i < 9; i++){
							// $scope.board[i].GamesIcon = "yWin";
							// $scope.board.$save(i);
							$scope.user1[i] = "";
							$scope.user2[i] = "";

						}
					}

				}
    		//
    		}    
    		//Code goes here:
    		if(($scope.board[idx].GamesIcon == "&nbsp;") && ($scope.turnNumber[0].turnNum % 2 == 1) && $scope.players[0].playerTwo == true){

		        $scope.gameIcon = ($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.gameIcon1 : $scope.gameIcon2;
		        $scope.board[idx].GamesIcon = $scope.gameIcon;
		        $scope.board.$save(idx);

		        $scope.currentUser = (($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.user1 : $scope.user2);
		        $scope.currentUser[idx] = idx;

		        $scope.currentUserName = (($scope.turnNumber[0].turnNum % 2) === 0 ? $scope.user1Name : $scope.user2Name);
		       		console.log("new move:");
		       		console.log($scope.turnNumber.turnNum)
		       		console.log($scope.currentUserName);
		       		console.log($scope.currentUser);
		       		console.log($scope.board);
		       		console.log($scope.win1);
		       		console.log(idx);
		       		console.log($scope.turnNumber[0].turnNum);
		   
	        	
		        if(
				(($scope.win1[0] == $scope.currentUser[0]) && ($scope.win1[1] == $scope.currentUser[1]) && $scope.win1[2] == $scope.currentUser[2]) ||
				(($scope.win2[3] == $scope.currentUser[3]) && ($scope.win2[4] == $scope.currentUser[4]) && $scope.win2[5] == $scope.currentUser[5]) ||
				(($scope.win3[6] == $scope.currentUser[6]) && ($scope.win3[7] == $scope.currentUser[7]) && $scope.win3[8] == $scope.currentUser[8]) ||
				(($scope.win4[0] == $scope.currentUser[0]) && ($scope.win4[3] == $scope.currentUser[3]) && $scope.win4[6] == $scope.currentUser[6]) ||
				(($scope.win5[1] == $scope.currentUser[1]) && ($scope.win5[4] == $scope.currentUser[4]) && $scope.win5[7] == $scope.currentUser[7]) ||
				(($scope.win6[2] == $scope.currentUser[2]) && ($scope.win6[5] == $scope.currentUser[5]) && $scope.win6[8] == $scope.currentUser[8]) ||
				(($scope.win7[0] == $scope.currentUser[0]) && ($scope.win7[4] == $scope.currentUser[4]) && $scope.win7[8] == $scope.currentUser[8]) ||
				(($scope.win8[2] == $scope.currentUser[2]) && ($scope.win8[4] == $scope.currentUser[4]) && $scope.win8[6] == $scope.currentUser[6])
				) {
					console.log($scope.currentUserName + " Wins this round"); 
					alert($scope.currentUserName + " Wins this round");
					$scope.endGame();
					$scope.square = 'Z';

					
				} 
				else if ($scope.turnNumber[0].turnNum == 8){
					console.log("Tie Game");
					console.log($scope.turnNumber[0].turnNum);
					alert("It's a tie!");
				}
				else {
					console.log("No news, the game goes on");
				}

			$scope.turnNumber[0].turnNum++;
			$scope.turnNumber.$save(0);
				$scope.endGame = function(){
					$scope.turnNumber[0].turnNum=0;
					if($scope.gameIcon == "X"){
						for (var i=0; i < 9; i++){
							// $scope.board[i].GamesIcon = "xWin";
							// $scope.board.$save(i);
							$scope.user1[i] = "";
							$scope.user2[i] = "";

						}
					}
					else if($scope.gameIcon == "O"){
						for (var i=0; i < 9; i++){
							// $scope.board[i].GamesIcon = "yWin";
							// $scope.board.$save(i);
							$scope.user1[i] = "";
							$scope.user2[i] = "";

						}
					}

				}
    		//
    		}    
 	   };
    }
);
//===================================
// functionality needed: tie condition:
// If the gameboard is full, declare tie and run endGame function.
// reset button:
// This can work by resetting user arrays and the board to all null.
// Make an endGame function:
// //do an ng-hide?
//===================================
