var grid = document.getElementById("gameGrid")

var flag = false

// all sounds are royalty free from soundbible.com, clipped shorter so its more spammable at mp3cut.net
var clickSound = new sound("./sound/click.mp3")
var bombSound = new sound("./sound/Bomb.mp3")
var digSound = new sound("./sound/dig.mp3")
var flagSound = new sound("./sound/flag.mp3")
var victorySound = new sound("./sound/victory.mp3")

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function generateGame() {
    // reset values
    flag = false;
    mineArray = []
    $(".flag-text").text("clicking will reveal the grid")
    grid.innerHTML = "";
    // recreate grid
    for (var i = 0; i < 15; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 15; j++) {
            cell = row.insertCell(j);
            cell.onclick = function () { clickCell(this) };
            cell.setAttribute("mine", false)
            cell.setAttribute("adjacent", 0)
            cell.setAttribute("row", i)
            cell.setAttribute("cell", j)
            cell.classList.add("box", "border", "text-center")
        }
    }
    // place mines
    for (var t = 0; t < 20; t++) {
        let lat = Math.floor(Math.random() * 15)
        let long = Math.floor(Math.random() * 15)
        cell = grid.rows[lat].cells[long]
        if (cell.getAttribute("mine") === "true") { continue }
        cell.setAttribute("mine", true)
        // for debugging
        // cell.classList.add("purple")
        // when a mine is created it calls all 8 nearby grids
        mineCounter(lat + 1, long + 1)
        mineCounter(lat + 1, long)
        mineCounter(lat + 1, long - 1)
        mineCounter(lat - 1, long + 1)
        mineCounter(lat - 1, long)
        mineCounter(lat - 1, long - 1)
        mineCounter(lat, long + 1)
        mineCounter(lat, long - 1)
    }
}

// and incriments the correct value
function mineCounter(lat, long) {
    if (lat > 14 || lat < 0 || long > 14 || long < 0) return false
    let cell = grid.rows[lat].cells[long]
    let newVal = Number(cell.getAttribute("adjacent")) + 1
    cell.setAttribute("adjacent", newVal)
}

// click function, logic to seperate flag placement and uncovering plots/exploding mines
function clickCell(cell) {
    if (flag) {
        flagSound.play()
        // logic to find if the flag needs to be placed or removed
        let replace = false
        for (var i = 0; i < cell.classList.length; i++) {
            if (cell.classList[i] === "blue") { replace = true }
        }
        if (replace === true) {
            cell.classList.remove("blue")
        } else {
            cell.classList.add("blue")
        }
    } else {
        if (cell.getAttribute("mine") === "true") {
            digSound.play()
            bombSound.play()
            gameOver()
        } else {
            digSound.play()
            reveal(cell.getAttribute("row"), cell.getAttribute("cell"))
        }
    }
    victoryCondition()
}

function reveal(lat, long) {
    if (lat > 14 || lat < 0 || long > 14 || long < 0) return false
    let cell = grid.rows[lat].cells[long]
    if (cell.innerHTML === cell.getAttribute("adjacent")) return false

    cell.innerHTML = cell.getAttribute("adjacent")
    cell.classList.add("grey")
    if (cell.getAttribute("adjacent") === "0") {
        revealNearby(lat, long)
    }
}

// triggered if there are no adjacent mines, reveal all 8 adjacent plots
function revealNearby(lat, long) {
    var newLat = Number(lat)
    var newLong = Number(long)
    reveal(newLat + 1, newLong + 1)
    reveal(newLat + 1, newLong)
    reveal(newLat + 1, newLong - 1)
    reveal(newLat - 1, newLong + 1)
    reveal(newLat - 1, newLong)
    reveal(newLat - 1, newLong - 1)
    reveal(newLat, newLong + 1)
    reveal(newLat, newLong - 1)
}

// go through the array and highlight the mines red
function gameOver() {
    // uncover mines
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            cell = grid.rows[i].cells[j]
            if (cell.getAttribute("mine") === "true") {
                if (cell.getAttribute("blue") !== undefined) { cell.classList.remove("blue") }
                cell.classList.add("red")
            }
        }
    }
    $(".flag-text").text("Sorry, but you lost!, red squares are mines, and blue squares are incorrectly guessed flags")
}

function victoryCondition() {
    let victory = true
    // find all the mines
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            cell = grid.rows[i].cells[j]
            if (cell.getAttribute("mine") === "true") {
                let blue = false
                // find the blue class attribute
                for (var t = 0; t < cell.classList.length; t++) {
                    if (cell.classList[t] === "blue") { blue = true }
                }
                // if not lose
                if (!blue) { victory = false }
            }
        }
    }
    if (victory) {
        victorySound.play()
        $(".flag-text").text("Well done! you won")
    }
}

// user inputs

// the clickCell function is for individual cells and is hooked into each table cell as a onclick attribute

$(".start").on("click", function () {
    clickSound.play()
    generateGame()
})

$(".flag").on("click", function () {
    clickSound.play()
    if (flag === true) {
        flag = false
        $(".flag-text").text("clicking will reveal the grid")
    } else {
        flag = true
        $(".flag-text").text("clicking will flag potential mines")
    }
})