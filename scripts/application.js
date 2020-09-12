/**
 * @author Ethan Grantz
 * Contains functions that manipulate game progression and also the draw function and info for player interaction with game
 */
class Application {
    init() {
        /**
         * Makes the boat count selection button visible once everything is loaded
         */
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelector("#button").style.visibility = "visible";
        });

//codes from https://javascript.info/keyboard-events
        /**
         * Detects key presses and executes functions based on them
         */
        document.addEventListener("keydown", (e) => {
            if (currentStage === 0) {
                let player;
                if (currentPlayer === 1) player = p1.boatBoard;
                else player = p2.boatBoard;
                let selector = document.querySelector("#boatSelect");
                let boatChoice = parseInt(selector.options[selector.selectedIndex].value) - 1;
                if (e.code === "ArrowUp") {
                    player.moveVerti(boatChoice, -1);
                }
                if (e.code === "ArrowDown") {
                    player.moveVerti(boatChoice, 1);
                }
                if (e.code === "ArrowLeft") {
                    player.moveHori(boatChoice, -1);
                }
                if (e.code === "ArrowRight") {
                    player.moveHori(boatChoice, 1);
                }
                if (e.code === "Space") {
                    player.rotater(boatChoice);
                }
                this.drawBoard(currentPlayer);
            } else if (currentStage === 1) {
                //controls for if we're doing the shooting part of the game
            }
            //have a default value like currentStage = -1 for when there should be no controls
        });

    }

    /**
     * Initializes some important game info (plus some other stuff that will be changed later)
     */
    main() {
        let selector = document.querySelector("#boatSelect");
        let boatCount = selector.options[selector.selectedIndex].value;
        selector.style.visibility = "hidden";
        window.currentPlayer = 2;
        //stage -1: default value, no controls
        //stage 0: placing boats phase
        //stage 1: choosing where to shoot opponent phase
        //this is used so that we can make the keyboard inputs do different things in different phases of the game
        window.currentStage = -1;
        document.querySelector("#boatCount").outerHTML = "";
        window.p1 = new Player(boatCount, 1);
        window.p2 = new Player(boatCount, 2);

        //this button make the player finish their boat moving phase
        document.querySelector("#button").outerHTML = "<button id=\"button\" type=\"button\" onclick=\"application.stageInit(-1)\">Confirm</button>";

        this.stageInit(-1);
    }

    /**
     * Draws player ui in the div block with id="game" (need to add hit board functionality)
     */
    drawBoard() {
        document.querySelector("#game").innerHTML = "";
        document.querySelector("#game").style.visibility = "visible";
        let topText = "";
        for (let i = 0; i < 9; i++) {
            topText += "&nbsp&nbsp&nbsp" + String.fromCharCode(65 + i);
        }
        topText += "&nbsp&nbsp&nbsp";
        for (let i = 0; i < 9; i++) {
            topText += "&nbsp&nbsp&nbsp" + String.fromCharCode(65 + i);
        }
        topText += "<br />_|___|___|___|___|___|___|___|___|___|&nbsp_|___|___|___|___|___|___|___|___|___|<br />";
        document.querySelector("#game").innerHTML += topText;
        let b;
        if (currentPlayer === 1) b = p1.boatBoard;
        else b = p2.boatBoard;
        for (let i = 0; i < 9; i++) { //row
            document.querySelector("#game").innerHTML += (i + 1);
            //column
            //hit board
            for (let j = 0; j < 9; j++) {
                //add something for when a spot has already been guessed
                document.querySelector("#game").innerHTML += "|&nbsp&nbsp&nbsp";
            }
            document.querySelector("#game").innerHTML += "|&nbsp" + (i + 1);
            //boat board
            for (let j = 0; j < 9; j++) {
                if (b.isAHit(j, i)) {
                    let bid = b.getBoatID(j, i);
                    if (b.hasBeenHit[i][j]) {
                        document.querySelector("#game").innerHTML += "|&nbsp<span id=\"hit\">" + bid + "</span>&nbsp";
                    } else {
                        document.querySelector("#game").innerHTML += "|&nbsp" + bid + "&nbsp";
                    }
                } else {
                    document.querySelector("#game").innerHTML += "|&nbsp&nbsp&nbsp";
                }
            }
            document.querySelector("#game").innerHTML += "|<br />&nbsp|___|___|___|___|___|___|___|___|___|";
            document.querySelector("#game").innerHTML += "&nbsp&nbsp|___|___|___|___|___|___|___|___|___|<br />";
        }
    }

    /**
     * Makes changes to graphics and player controls corresponding to current game stage
     * @param {number} stage -1,0,or 1, for the various stages of the game
     */
    stageInit(stage) {
        if (stage === -1) {
            currentStage = -1;
            if (currentPlayer === 1) currentPlayer = 2;
            else currentPlayer = 1;
            document.querySelector("#game").innerHTML = "";
            document.querySelector("#playerConfirmation").innerHTML = "<h2>Player " + currentPlayer + " Turn!</h2><button onclick=\"application.stageInit(0)\">Confirm</button>";
            document.querySelector("#button").style.visibility = "hidden";
            document.querySelector("#boatSelect").style.visibility = "hidden";
        } else if (stage === 0) {
            currentStage = 0;
            document.querySelector("#playerConfirmation").innerHTML = "";
            let selector = document.querySelector("#boatSelect");
            selector.innerHTML = "";
            //I wanted to use the same <select> block for both choosing boatCount and
            //for selecting which boat to move. This loop resizes the selector if you choose fewer than 5 boats
            //This is subject to change later as it causes clutter whether I put this here or add another
            //<select> in index.html
            for (let i = 0; i < p1.boatBoard.boatCount; i++) {
                selector.innerHTML += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "</option><br />";
            }
            selector.style.visibility = "visible";
            document.querySelector("#button").style.visibility = "visible";
            this.drawBoard(currentPlayer);
        } else if (stage === 1) {
            currentStage = 1;
            document.querySelector("#playerConfirmation").innerHTML = "";
        }
    }
}
