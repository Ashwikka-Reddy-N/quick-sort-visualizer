let array = [];
let delay = 50;
let treeText = "";

function generateArray() {
    let size = parseInt(document.getElementById("size").value);

    if (isNaN(size) || size < 5 || size > 100) {
        alert("Enter size between 5 and 100");
        return;
    }

    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }

    renderArray();
}

function useInput() {
    const input = document.getElementById("inputArray").value;
    const values = input.split(",").map(Number);

    if (values.some(isNaN)) {
        alert("Invalid input!");
        return;
    }

    array = values;
    renderArray();
}

function renderArray() {
    const container = document.getElementById("array");
    container.innerHTML = "";

    let max = Math.max(...array);

    array.forEach(val => {
        const bar = document.createElement("div");
        bar.style.height = (val / max) * 300 + "px";
        bar.classList.add("bar");
        container.appendChild(bar);
    });
}

function updateBars(bars) {
    let max = Math.max(...array);
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = (array[i] / max) * 300 + "px";
    }
}

function highlight(lineId) {
    document.querySelectorAll(".pseudo span").forEach(l => {
        l.classList.remove("active-line");
    });
    document.getElementById(lineId).classList.add("active-line");
}

function updateRecursion(low, high, depth) {
    document.getElementById("range").innerText =
        `Sorting range: [${low} - ${high}]`;
    document.getElementById("depth").innerText =
        `Depth: ${depth}`;
}

function updateTree(low, high, depth) {
    let indent = "  ".repeat(depth);
    let subArray = array.slice(low, high + 1);

    treeText += `${indent}[${low}-${high}] → [${subArray.join(", ")}]\n`;
    document.getElementById("treeView").innerText = treeText;
}

function highlightRange(low, high) {
    let bars = document.querySelectorAll(".bar");

    bars.forEach((bar, i) => {
        if (i >= low && i <= high) {
            bar.style.opacity = "1";
        } else {
            bar.style.opacity = "0.3";
        }
    });
}

async function startSort() {
    treeText = "";
    await quickSort(0, array.length - 1, 0);
}

async function quickSort(low, high, depth) {

    highlight("l1");
    updateRecursion(low, high, depth);
    updateTree(low, high, depth);
    highlightRange(low, high);

    await sleep(delay);

    if (low < high) {

        highlight("l2");
        await sleep(delay);

        highlight("l3");
        let pi = await partition(low, high);

        highlight("l4");
        await quickSort(low, pi - 1, depth + 1);

        highlight("l5");
        await quickSort(pi + 1, high, depth + 1);
    }
}

async function partition(low, high) {
    let bars = document.querySelectorAll(".bar");
    let pivot = array[high];

    bars[high].classList.add("pivot");

    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].classList.add("active");

        await sleep(delay);

        if (array[j] < pivot) {
            i++;
            swap(i, j);
            updateBars(bars);
        }

        bars[j].classList.remove("active");
    }

    swap(i + 1, high);
    updateBars(bars);

    bars[i + 1].classList.add("sorted");

    return i + 1;
}

function swap(i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    document.getElementById("swapSound").play();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray();
