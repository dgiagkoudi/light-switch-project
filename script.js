window.ondragstart = function() { return false; }
const body = document.body;
const chain = document.getElementById('chain-trigger');
const handwrittenText = document.querySelector('.handwritten');
const clickSound = new Audio('public/click.mp3');

let isDragging = false;
let startY = 0;

function handleMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    document.documentElement.style.setProperty('--cursor-x', clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', clientY + 'px');

    if (handwrittenText) {
        const rect = handwrittenText.getBoundingClientRect();
        const textX = rect.left + rect.width / 2;
        const textY = rect.top + rect.height / 2;
        const angleX = (textX - clientX) / 20;
        const angleY = (textY - clientY) / 20;
        document.documentElement.style.setProperty('--shadow-x', `${angleX}px`);
        document.documentElement.style.setProperty('--shadow-y', `${angleY}px`);
    }

    if (isDragging) {
        const deltaY = clientY - startY;
        if (deltaY > 0 && deltaY < 150) {
            chain.style.transform = `translateX(-50%) translateY(${deltaY}px)`;
        }
    }
}

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', (e) => {
    handleMove(e);
    if (isDragging) e.preventDefault();
}, { passive: false });

function startDrag(e) {
    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    chain.style.transition = 'none';
}
chain.addEventListener('mousedown', startDrag);
chain.addEventListener('touchstart', startDrag);

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const currentY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = currentY - startY;
    
    if (deltaY > 60) {
        body.classList.toggle('dark-mode');
        clickSound.currentTime = 0;
        clickSound.play();
    }

    chain.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    chain.style.transform = `translateX(-50%) translateY(0px)`;
    
    setTimeout(triggerSwing, 400);
}
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

function triggerSwing() {
    chain.classList.add('swing-animation');
    setTimeout(() => {
        chain.classList.remove('swing-animation');
    }, 800);
}