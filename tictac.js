var Tictac = function (player1, player2) {
    var a ;
    var validate_flag = false;
    var playerContext = new Player();

    buildBoard();
    var gamerTimer = new Timer();

    


    function resetGameSet() {
        document.getElementById('board').parentNode.removeChild(document.getElementById('overlay'));
        document.getElementById('board').parentNode.removeChild(document.getElementById('board'));
        buildBoard();
        playerContext.resetPlayerTurn();
        document.getElementById('overlay').className = 'overlay';
        document.getElementById('resetGame').onclick = resetGameSet;
        document.getElementById('startGame').onclick = startGame;
    };


    var Messages = function (type) {
        var name;
        var message;
        var id = 0;
        var msgtype = 'INFO';
        var errorHolderDiv = document.createElement('div');
        var errorSpan = document.createElement('span');
        msgtype = type;
        if (msgtype.toLowerCase() == 'INFO'.toLowerCase()) {
            errorSpan.style.color = "#3366cc";
        } else if (msgtype.toLowerCase() == 'ERROR'.toLowerCase()) {
            errorSpan.style.color = "#ee3e04";
        }

        errorSpan.style.opacity = 1;
        errorSpan.style.padding = '2px 2px 2px 2px';
        errorSpan.style.display = 'inline-block';
        errorHolderDiv.appendChild(errorSpan);

        this.setName = function (errName) {
            name = errName;
            return this;
        };

        this.setMessage = function (errMsg) {
            message = errMsg;
            errorSpan.innerHTML = msgtype.toUpperCase() + ": " + message;
            return this;
        };

        this.getMsgType = function () {
            return msgtype;
        };

        this.getName = function () {
            return name;
        };

        this.getMessage = function () {
            return message;
        };

        this.toString = function () {
            return msgtype + ": " + message;
        };

        this.addToQue = function () {
            document.getElementById('errorDiv').appendChild(errorHolderDiv);
            var timer = setInterval(function () {

                if (errorSpan.style.opacity <= 0.1) {
                    clearInterval(timer);
                    errorSpan.parentNode.removeChild(errorSpan);

                } else {
                    errorSpan.style.opacity -= errorSpan.style.opacity * 0.1;
                    errorSpan.style.filter = 'alpha(opacity=' + errorSpan.style.opacity * 100 + ")";

                }
            }, 800);
        };

        return this;
    };

    function startGame() {

        if (document.getElementById('player1textbox').value == '' || document.getElementById('player2textbox').value == '') {
            if (document.getElementById('player1textbox').value == '') {
                var playerNameMissing = new Messages('ERROR');
                playerNameMissing.setMessage('Player 1\'s Name missing').addToQue();

            }
            if (document.getElementById('player2textbox').value == '') {
                var playerNameMissing = new Messages('ERROR');
                playerNameMissing.setMessage('Player 2\'s Name missing').addToQue();

            }
            return;

        }

        playerContext.setPlayer1Name(document.getElementById('player1textbox').value);
        playerContext.setPlayer2Name(document.getElementById('player2textbox').value);
        document.getElementById('overlay').className = '';
        initGame();
        document.getElementById('startGame').onclick = startGame;
        document.getElementById('resetGame').onclick = resetGameSet;

    };

    //For initial Setup of board
    document.getElementById('resetGame').onclick = resetGameSet;
    document.getElementById('startGame').onclick = startGame;


    /*   To be implemented  stackoverflow.com- questions/9959781/remove-classname-from-element-with-javascript/9959811#9959811
    function removeClass(node,className){
        node.className=node.className.replace('\');

    };
    */
    var win = false;
    var helper = function (row, col) {
        var clicked = false;
        return function () {
            if (!clicked) {
                clicked = true;
                gamerTimer.stopTimer();
                var symbol = playerContext.getCurrentPlayerSymbol();
                this.innerHTML = symbol;
                playerContext.reduceTurns();

                a[row][col] = symbol;
                if (validate_flag) {
                    if (validate(row, col, symbol)) {
                        
                        var winMessage = new Messages('Game Over');
                        winMessage.setMessage(playerContext.getCurrentPlayerName() + ' Wins').addToQue();
                        playerContext.resetPlayerTurn();
                        document.getElementById('overlay').className = 'overlay';
                        alert(playerContext.getCurrentPlayerName()+' Wins');

                    }
                    if(!playerContext.isAnyMovesLeft()){
                        alert('No Moves Left Please Reset Game');
                    }
                }


                playerContext.nextPlayer();
                gamerTimer.initiateTimer();
            }
        };
    };


    function Timer(){
        var id ;
        var totalTime=5;
        this.initiateTimer=function(){
            id=setInterval(function(){
                document.getElementById('timerDiv').innerHTML=playerContext.getCurrentPlayerName()+':'+totalTime+" seconds left";
                totalTime--;
                if(totalTime==-1){
                    clearInterval(id);     
                    playerContext.nextPlayer();
                    document.getElementById('overlay').className = 'overlay';
                    document.getElementById('timerDiv').innerHTML='';
                    alert('Game Over! Times Up ! '+playerContext.getCurrentPlayerName()+' Wins');
                }
            }, 1000);
        };

        this.stopTimer=function(){
            clearInterval(id);            
            this.resetTimer();
        };

        this.resetTimer=function(){
            totalTime=5;
        };

    };

    function buildBoard() {
        a= [
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ];
        var gameBoard = document.createElement('div');
        
        var rows, cols;
        var rows_counter = 0;
        var col_counter = 0;
        var board = document.createElement('div');
        var body = document.getElementsByTagName('body'); //Change to a specific element by id
        board.id = 'board';
        gameBoard
        body[0].appendChild(board);
        for (; rows_counter < 3; rows_counter++) {
            rows = document.createElement('div');
            rows.id = 'row' + (rows_counter + 1);
            if (rows_counter == 0) {
                rows.className = 'pink block inactive';
            } else if (rows_counter == 1) {
                rows.className = 'blue block inactive';
            } else if (rows_counter == 2) {
                rows.className = 'green block inactive';
            }
            //rows.className='block';
            for (col_counter = 0; col_counter < 3; col_counter++) {

                cols = document.createElement('div');
                cols.className = 'boxes';

                rows.appendChild(cols);
            }
            board.appendChild(rows);
        }

        var optionsDiv = document.createElement('div');
        optionsDiv.id = 'optionsDiv';

        var resetButton = document.createElement('div');
        resetButton.className = 'gamebutton';
        //resetButton.style.float='right';
        resetButton.innerHTML = '<a id="resetGame"> Reset </a>';
        var startButton = document.createElement('div');
        startButton.className = 'gamebutton';
        // startButton.style.float='right';
        startButton.innerHTML = '<a id="startGame"> Start Game </a>';

        var player1NameInput = document.createElement('input');
        player1NameInput.type = 'text';
        player1NameInput.id = 'player1textbox';
        var player1NameSpan = document.createElement('span');
        player1NameSpan.innerHTML = 'Player X';
        var player2NameInput = document.createElement('input');
        player2NameInput.type = 'text';
        player2NameInput.id = 'player2textbox';
        var player2NameSpan = document.createElement('span');
        player2NameSpan.innerHTML = 'Player O';

        var optionsDivRow1 = document.createElement('div');

        var optionsDivRow2 = document.createElement('div');

        var optionsDivRow3 = document.createElement('div');

        var timerDiv = document.createElement('div');
        timerDiv.id='timerDiv';
        timerDiv.className='timer';

        var errorDiv = document.createElement('div');
        errorDiv.id = 'errorDiv';

        var overlayDiv = document.createElement('div');
        overlayDiv.id = 'overlay';
        overlayDiv.className = 'overlay';

        optionsDivRow1.appendChild(player1NameSpan);
        optionsDivRow1.appendChild(player1NameInput);

        optionsDivRow2.appendChild(player2NameSpan);
        optionsDivRow2.appendChild(player2NameInput);

        optionsDivRow3.appendChild(resetButton);
        optionsDivRow3.appendChild(startButton);

        optionsDiv.appendChild(optionsDivRow1);
        optionsDiv.appendChild(optionsDivRow2);
        optionsDiv.appendChild(optionsDivRow3);
        optionsDiv.appendChild(errorDiv);
        optionsDiv.appendChild(timerDiv);

        optionsDiv.style.width = rows.style.width;
        board.appendChild(optionsDiv);

        document.getElementById('board').parentNode.appendChild(overlayDiv);
        //var gamerTimer = new Timer();
        //gameTimer.initiateTimer();
        
    };

    function initGame() {
        var i, j, k = 0;

        var boxes = document.getElementsByClassName('boxes');
        for (i = 0; i < a.length; i++) {

            for (j = 0; j < a[0].length; j++) {
                boxes[k++].onclick = helper(i, j);
            }
        }

        validate_flag = true;
        gamerTimer.initiateTimer();

    };


    function isWinner(score) {
        if (score == 3) {
            return true;
        } else {
            return false;
        }
    }

    function validate(row, col, symbol) {
        //Check row for all values
        var i = 0;
        while (i < a[0].length) {
            if (a[row][i] != symbol) {
                break;
            }
            i++;
        };
        if (isWinner(i)) return true;
        //Check column for all values
        i = 0;
        while (i < a.length) {
            if (a[i][col] != symbol) {
                break;
            }
            i++;
        };
        if (isWinner(i)) return true;


        if (row == col) {
            i = 0;
            while (i < a.length) {
                if (a[i][i] != symbol) {
                    break;
                }
                i++;
            };
            if (isWinner(i)) return true;
            
        }

        if(row+col==2){
            i = 0;
            while (i < a.length) {
                if (a[i][a.length - 1 - i] != symbol) {
                    break;
                }
                i++;
            };
            if (isWinner(i)) return true;
        }
        return false;
    };

    function Player() {
        var player_symbol1 = 'X';
        var player_symbol2 = 'O';
        var player1Name, player2Name;
        var current_player = 1;
        var turns_left=9;

        this.resetPlayerTurn=function(){
            current_player=1;
            turns_left=9;
        }
        this.getCurrentPlayer = function () {
            return current_player;
        };

        this.isAnyMovesLeft=function(){
            if(turns_left==0){
                return false;
            }else{
                return true;
            }
        };

        this.getCurrentPlayerName = function () {
            if (current_player == 1) {
                return player1Name;
            } else {
                return player2Name;
            }
        };
        this.setPlayer1Name = function (player1) {
            player1Name = player1;
        };
        this.setPlayer2Name = function (player2) {
            player2Name = player2;
        };
        this.getCurrentPlayerSymbol = function () {
            if (current_player == 1) {
               
                return player_symbol1;
            } else {
               
                return player_symbol2;
            }
        };
        this.reduceTurns=function(){
            turns_left--;
        };
        this.nextPlayer=function(){
            
              if (current_player == 1) {
                current_player = 2;
            } else {
                current_player = 1;
            }
        };



    };

};

function game() {
    var game_obj = new Tictac(); //get specific element to be added to
};

window.onload = game; //Reset game