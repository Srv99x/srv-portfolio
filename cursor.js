const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTriggers = document.querySelectorAll('a, button, .category-card, .cta-button');

    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {

        window.addEventListener('mousemove', (e) => { 
            mouseX = e.clientX; 
            mouseY = e.clientY; 

            cursorDot.style.left = mouseX + "px"; 
            cursorDot.style.top = mouseY + "px"; 
        });

        gsap.ticker.add(() => { 
            outlineX += (mouseX - outlineX) * 0.15; 
            outlineY += (mouseY - outlineY) * 0.15; 

            cursorOutline.style.left = outlineX + "px"; 
            cursorOutline.style.top = outlineY + "px"; 
        });

        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => 
                document.body.classList.add('hovering')
            );
            trigger.addEventListener('mouseleave', () => 
                document.body.classList.remove('hovering')
            );
        });
    }

} else {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';

    document.body.style.cursor = 'auto';
}
