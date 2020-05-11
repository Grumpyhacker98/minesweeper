var grid = document.getElementById("gameGrid")

// create game
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
        cell.classList.add("p-3", "border")
    }
}
for (var t = 0; t < 20; t++) {
    let lat = Math.floor(Math.random() * 15)
    let long = Math.floor(Math.random() * 15)
    cell = grid.rows[lat].cells[long]
    cell.setAttribute("mine", true)
    // cell.classList.add("red")
    add(lat, long)
}

// when a mine is created it calls all 8 nearby grids
function add(lat, long) {
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

// click function, if its not a mine, uncover plots based on if plots have adjacent mines
function clickCell(cell) {
    if (cell.getAttribute("mine") === "true") {
        console.log("you lose")
    } else {
        if (cell.getAttribute("adjacent") === 0) {
            // reveal 9 plots
            revealNearby(cell.getAttribute("row"), cell.getAttribute("cell"))
        } else {
            // reveal 1 plot
            reveal(cell.getAttribute("row"), cell.getAttribute("cell"))
        }
    }
}

// if there are no adjacent mines this triggers reveal for all 8 adjacent plots
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

function reveal(lat, long) {
    if (lat > 14 || lat < 0 || long > 14 || long < 0) return false
    let cell = grid.rows[lat].cells[long]
    if (cell.innerHTML === cell.getAttribute("adjacent")) { return false }
    cell.innerHTML = cell.getAttribute("adjacent")
    if (cell.getAttribute("adjacent") === "0") {
        revealNearby(lat,long)
    } 
}

// go through the array and highlight the mines red
function uncoverMines() {
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            cell = grid.rows[i].cells[j]
            if (cell.getAttribute("mine") === "true") {
                cell.classList.add("red")
            }
        }
    }
}

console.log(grid)

// $("#start").on("click",generateGame())