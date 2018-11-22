/*
 * EL objeto de la GUI encapsula todos los métodos y atributos
 */
var ui = {};

//Mantener visible el estado inicial de los controles
ui.intialControlsVisible = true;

//holds the setInterval handle for the robot flickering
ui.robotFlickeringHandle = 0;

//mantiene la vista actual visible
ui.currentView = "";


/*
 * switchs the view on the UI depending on who's turn it switchs
 * @param turn [String]: the player to switch the view to
 */
ui.switchViewTo = function(turn) {

    //helper function for async calling
    function _switch(_turn) {
        ui.currentView = "#" + _turn;
        $(ui.currentView).fadeIn("fast");
    }

    if(ui.intialControlsVisible) {
        //if the game is just starting
        ui.intialControlsVisible = false;

        $('.intial').fadeOut({
            duration : "slow",
            done : function() {
                _switch(turn);
            }
        });
    }
    else {
        //if the game is in an intermediate state
        $(ui.currentView).fadeOut({
            duration: "fast",
            done: function() {
                _switch(turn);
            }
        });
    }
};

/*
 * places X or O in the specifed place in the board
 * Genera X u O en el lugar especificado del tablero
 */
ui.insertAt = function(indx, symbol) {
    var board = $('.cell');
    var targetCell = $(board[indx]);

    if(!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color : symbol == "X" ? "#000" : "#000"
        });
        targetCell.addClass('occupied');
    }
}
