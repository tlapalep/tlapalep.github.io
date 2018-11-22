/*
 * Representa el estado del juego
 * @parámetro old [Estado]: estado anterior a iniciar un nuevo estado
 */
var State = function(old) {

    /*
     * public : el jugador que tiene el turno
     */
    this.turn = "";

    /*
     * public : el número de movimientos de la IA
     */
    this.oMovesCount = 0;

    /*
     * public : el resultado del juego en ESTE estado
     */
    this.result = "still running";

    /*
     * public : la configuración del tablero en ESTE estado
     */
    this.board = [];

    /* Iniciar contrucción del objeto */
    if(typeof old !== "undefined") {
        // si el estado es constuido utilizando una copia de otro estado
        var len = old.board.length;
        this.board = new Array(len);
        for(var itr = 0 ; itr < len ; itr++) {
            this.board[itr] = old.board[itr];
        }

        this.oMovesCount = old.oMovesCount;
        this.result = old.result;
        this.turn = old.turn;
    }
    /* Finaliza construcción del objeto */

    /*
     * public : avanza el turno
     */
    this.advanceTurn = function() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    this.emptyCells = function() {
        var indxs = [];
        for(var itr = 0; itr < 9 ; itr++) {
            if(this.board[itr] === "E") {
                indxs.push(itr);
            }
        }
        return indxs;
    }


    this.isTerminal = function() {
        var B = this.board;

        //revisa filas
        for(var i = 0; i <= 6; i = i + 3) {
            if(B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //revisa columnas
        for(var i = 0; i <= 2 ; i++) {
            if(B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //revisa diagonales
        for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2*j]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        var available = this.emptyCells();
        if(available.length == 0) {
            //el juego es empate
            this.result = "draw"; //actualiza el estado del resultado
            return true;
        }
        else {
            return false;
        }
    };

};

var Game = function(autoPlayer) {
    this.ai = autoPlayer;

    this.currentState = new State();

    this.currentState.board = ["E", "E", "E",
                               "E", "E", "E",
                               "E", "E", "E"];

    this.currentState.turn = "X";

    this.status = "beginning";

    this.advanceTo = function(_state) {
        this.currentState = _state;
        if(_state.isTerminal()) {
            this.status = "ended";

            if(_state.result === "X-won")
                ui.switchViewTo("won");
            else if(_state.result === "O-won")
                ui.switchViewTo("lost");
            else
                ui.switchViewTo("draw");
        }
        else {

            if(this.currentState.turn === "X") {
                ui.switchViewTo("human");
            }
            else {
                ui.switchViewTo("robot");
                this.ai.notify("O");
            }
        }
    };

    /*
     * Iniciar el juego
     */
    this.start = function() {
        if(this.status = "beginning") {
            //invoke advanceTo with the initial state
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }

};
Game.score = function(_state) {
    if(_state.result === "X-won"){
        return 10 - _state.oMovesCount;
    }
    else if(_state.result === "O-won") {
        return - 10 + _state.oMovesCount;
    }
    else {
        return 0;
    }
}
