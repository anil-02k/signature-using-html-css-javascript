const colorPicker = document.getElementById("colorPicker");
const backgroundPicker = document.getElementById("backgroundPicker");
const canvas = document.getElementById("signatureCanvas");
const clearButton = document.querySelector(".clear");
const saveButton = document.querySelector(".save");
const fontPicker = document.getElementById("brushSize");
const ctx = canvas.getContext('2d');

const drawOption = document.getElementById("drawOption");
const uploadOption = document.getElementById("uploadOption");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isDrawMode = true; // Flag to track if draw mode is enabled

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect(); // Get the canvas position relative to the viewport
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function draw(e) {
    if (!isDrawing || !isDrawMode) return;

    const { x, y } = getMousePos(e); // Adjust mouse position

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = fontPicker.value;
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

canvas.addEventListener('mousedown', (e) => {
    if (isDrawMode) {
        const { x, y } = getMousePos(e);
        isDrawing = true;
        [lastX, lastY] = [x, y];
    }
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

canvas.addEventListener('touchstart', (e) => {
    if (!isDrawMode) return;
    const touch = e.touches[0];
    const { x, y } = getMousePos(touch);
    isDrawing = true;
    [lastX, lastY] = [x, y];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default behavior for touch events
    if (!isDrawMode) return;
    const touch = e.touches[0];
    const { x, y } = getMousePos(touch);
    draw({ clientX: touch.clientX, clientY: touch.clientY, offsetX: x, offsetY: y });
}, { passive: false });

canvas.addEventListener('touchend', () => isDrawing = false);

colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});

backgroundPicker.addEventListener('change', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before changing background
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

fontPicker.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL();
    link.click();
});

uploadOption.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (e) {
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        img.src = URL.createObjectURL(e.target.files[0]);
    };
    input.click();
});

drawOption.addEventListener('click', () => {
    isDrawMode = !isDrawMode; // Toggle draw mode

    if (isDrawMode) {
        drawOption.innerHTML = '<i class="fa-solid fa-paintbrush" style="margin-right: 6px;"></i>Stop Drawing';
        drawOption.style.backgroundColor = "#e74c3c"; // Indicate drawing mode is active
    } else {
        drawOption.innerHTML = '<i class="fa-solid fa-paintbrush" style="margin-right: 6px;"></i>Draw';
        drawOption.style.backgroundColor = "#0e7be8"; // Revert to the default state
    }
});
