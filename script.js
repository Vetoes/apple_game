
const ROWS = 10;
const COLS = 17;
// 5x5 배열 생성
let gridData = [];
let selectedCells = []; //선택된 셀 저장
let isDragging = false;//드래그
let startRow = null, startCol = null; // 드래그 시작 위치상태 확인
let timer; //타이머
let timeLeft = 100000; 
let isGameRunning =false;
let score = 0;

const startButton= document.getElementById("startButton");
const restartButton= document.getElementById("restartButton");
const timerDisplay= document.getElementById("timerDisplay");
const scoreDisplay= document.getElementById("scoreDisplay");
const gameOverMessage= document.getElementById("gameOverDisplay");

document.getElementById("timerDisplay").onselectstart = function () { return false; };
document.getElementById("timerDisplay").onmousedown = function () { return false; };
document.getElementById("scoreDisplay").onselectstart = function () { return false; };
document.getElementById("scoreDisplay").onmousedown = function () { return false; };

window.onload = function () {
    document.getElementById("startButton").style.display = "block"; // Show Start button on load
    document.getElementById("restartButton").style.display = "none"; // Hide Restart button on load
    document.getElementById("gameOverMessage").style.display = "none"; // Hide game over message if enabled
};

document.getElementById("startButton").addEventListener("click", function () {
    this.style.display = "none"; // Hide Start button when game starts
    document.getElementById("restartButton").style.display = "none"; // Hide Restart button initially
    document.getElementById("gameGrid").style.display = "grid"; // Show game board
    startGame();
});

// Ensure "Restart" button works properly
document.getElementById("restartButton").addEventListener("click", function () {
    this.style.display = "none"; // Hide Restart button
    document.getElementById("startButton").style.display = "none"; // Keep Start button hidden during restart
    document.getElementById("gameOverMessage").style.display = "none"; // Hide game over message if needed
    document.getElementById("gameGrid").style.display = "grid"; // Show game board
    startGame();
});

startButton.addEventListener("click",function(){
    this.style.display ="none";
    restartButton.style.display ="none";
    gameOverMessage.style.display="none";
    document.getElementById("gameGrid").style.display="grid";
    startGame();
})

restartButton.addEventListener("click",function(){
    this.style.display ="none";
    restartButton.style.display ="none";
    document.getElementById("gameGrid").style.display="grid";
    resetGame();
    startGame();
})

function startGame(){
    resetGame();
    generateGrid();
    startTimer();
}

function startTimer(){
    if(isGameRunning) return;
    isGameRunning= true;
    timeLeft = 100000;
    timer =  setInterval(()=>{
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}`;

        if(timeLeft <= 0){
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame(){
    isGameRunning = false;
    clearInterval(timer);

    alert(`game over score: ${score}`);
    //gameOverMessage.textContent=`Game Over! Final Score:${score}`;
    //gameOverMessage.style.display="block";

    document.getElementById("gameGrid").style.display = "none";
    //document.getElementById("restartButton").style.display="block";
    //startButton.style.display="block";
    restartButton.style.display="block";
}

function resetGame(){
    clearInterval(timer);
    isGameRunning =false;
    timeLeft = 100;
    score = 0;
    selectedCells = [];
    gridData = [];
    timerDisplay.textContent = "100";
    scoreDisplay.textContent = "score: 0";
    //gameOverMessage.style.display="none";
}

function generateGrid() {
    const grid = document.getElementById("gameGrid");
    grid.innerHTML = ""; // 기존 그리드 초기화
    gridData = [];
    //selectedCells = [];

    for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLS; j++) {
            let randomNum = Math.floor(Math.random() * 9) + 1; // 1~9 랜덤 숫자
            row.push(randomNum);

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = randomNum;
            cell.dataset.row =i;
            cell.dataset.col =j;

            cell.addEventListener("mousedown",startDrag);
            cell.addEventListener("mouseenter",dragOver);
            cell.addEventListener("mouseup",endDrag);
            grid.appendChild(cell);
        }
        gridData.push(row);
    }

    console.log("게임 시작, 초기 숫자 테이블:", gridData);
}

//start drag
function startDrag(event){
    isDragging = true;
    selectedCells = [];
    startRow = parseInt(event.target.dataset.row);
    startCol = parseInt(event.target.dataset.col);
    selectCell(event.target);
}

function dragOver(event){
    if(isDragging){
        let currnetRow = parseInt(event.target.dataset.row);
        let currnetCol = parseInt(event.target.dataset.col);
        if(updateSelection(startRow,startCol,currnetRow,currnetCol)){
        selectCell(event.target);
        }
    }
}

function endDrag(){
    isDragging =  false;
    checkSum();
}

// 드래그한 사각형 영역 내 모든 셀을 선택

function updateSelection(startRow, startCol, endRow, endCol) {
    let minRow = Math.min(startRow, endRow);
    let maxRow = Math.max(startRow, endRow);
    let minCol = Math.min(startCol, endCol);
    let maxCol = Math.max(startCol, endCol);

    // Reset all cells to default before applying selection
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("selected"); // Reset invalid selections
    });

    selectedCells = []; // Clear previous selections

    for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
            let cell = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
            if (cell && !cell.classList.contains("hidden")) {
                selectedCells.push(cell);
                cell.classList.add("selected"); // Correctly apply selection
            }
        }
    }
}
function selectCell(cell) {
    if (!selectedCells.includes(cell) && !cell.classList.contains("hidden")) {
    //if (!selectedCells.includes(cell) ) {
        selectedCells.push(cell);
        cell.classList.add("selected"); // Use CSS class instead of inline styles
    }
}

function checkSum() {
    let sum = 0;
    let positions = [];
    let validCells = 0; // Count only valid non-zero cells for score

    selectedCells.forEach(cell => {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        let num = parseInt(cell.textContent.trim(), 10) || 0;

        sum += num;
        positions.push(`[${row}, ${col}]`);

        if (num !== 0) {
            validCells++;
        }
    });

    console.log(`Selected cell positions: ${positions.join(", ")}`);
    console.log(`Sum of selected cells: ${sum}`);

    if (sum === 10) {
        console.log(`✅ Completed cells! Removing: ${positions.join(", ")}`);

        // Increase score only for non-zero cells
        score += validCells;
        scoreDisplay.textContent = `Score: ${score}`;

        selectedCells.forEach(cell => {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            gridData[row][col] = 0; // Mark as completed internally
            cell.textContent = ""; // Hide number
            cell.classList.add("completed-cell"); // Add CSS class for completed cells
            cell.classList.add("hidden"); // Make cell appear empty
        });
    } else {
        console.log("❌ Not a valid sum. Deselecting cells.");

        selectedCells.forEach(cell => {
            cell.classList.remove("selected");
            if (gridData[parseInt(cell.dataset.row)][parseInt(cell.dataset.col)] === 0) {
                cell.classList.add("hidden"); // Ensure 0s stay hidden
            } else {
                cell.classList.remove("hidden");
            }
        });
    }

    selectedCells = [];
}

// Update selection function to use CSS class
