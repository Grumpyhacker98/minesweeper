var grid = document.getElementById("gameGrid")

var flag = false

function generateGame() {
    flag = false;
    $("#flag-text").text("clicking will reveal the grid")
    grid.innerHTML = "";
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
    for (var t = 0; t < 20; t++) {
        let lat = Math.floor(Math.random() * 15)
        let long = Math.floor(Math.random() * 15)
        cell = grid.rows[lat].cells[long]
        cell.setAttribute("mine", true)
        addAdjacent(lat, long)
    }
}

// when a mine is created it calls all 8 nearby grids
function addAdjacent(lat, long) {
    mineCounter(lat + 1, long + 1)
    mineCounter(lat + 1, long)
    mineCounter(lat + 1, long - 1)
    mineCounter(lat - 1, long + 1)
    mineCounter(lat - 1, long)
    mineCounter(lat - 1, long - 1)
    mineCounter(lat, long + 1)
    mineCounter(lat, long - 1)
}
// and incriments the correct value
function mineCounter(lat, long) {
    if (lat > 14 || lat < 0 || long > 14 || long < 0) return false
    let cell = grid.rows[lat].cells[long]
    let newVal = Number(cell.getAttribute("adjacent")) + 1
    cell.setAttribute("adjacent", newVal)
}

// click function, if its not a mine, uncover
function clickCell(cell) {
    if (flag) {
        let replace = false
        for (var i = 0; i < cell.classList.length; i++) {
            if (cell.classList[i] === "blue") {
                replace = true
            }
        }
        if (replace === true) {
            cell.classList.remove("blue")
        } else {
            cell.classList.add("blue")
        }
    } else {
        if (cell.getAttribute("mine") === "true") {
            gameOver()
        } else {
            reveal(cell.getAttribute("row"), cell.getAttribute("cell"))
        }
    }
    victoryCondition()
}

function reveal(lat, long) {
    if (lat > 14 || lat < 0 || long > 14 || long < 0) return false
    let cell = grid.rows[lat].cells[long]
    if (cell.innerHTML === cell.getAttribute("adjacent")) { return false }
    cell.innerHTML = cell.getAttribute("adjacent")
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
    $("#flag-text").text("Sorry, but you lost!, red squares are mines, and blue squares are incorrectly guessed flags")
}

function victoryCondition() {
    // search through the entire grid and find the mines
    let victory = true
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            cell = grid.rows[i].cells[j]
            // if the mine isnt blue turn victory condition false
            if (cell.getAttribute("mine") === "true") {
                let blue = false
                for (var t = 0; t < cell.classList.length; t++) {
                    if (cell.classList[t] === "blue") { blue = true }
                }
                if (!blue) { victory = false }
            }
        }
    }
    if (victory) {
        $("#flag-text").text("Well done! you won")
    }
}

$("#start").on("click", function () {
    generateGame()
})

$("#flag").on("click", function () {
    if (flag === true) {
        flag = false
        $("#flag-text").text("clicking will reveal the grid")
    } else {
        flag = true
        $("#flag-text").text("clicking will flag potential mines")
    }
})