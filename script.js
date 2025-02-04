document.addEventListener('DOMContentLoaded', () => {
    // Create container div to center the image
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.background = "black";
    container.style.background = "url('background.jpg') no-repeat center center";
    container.style.backgroundSize = "cover";

    // Create an image element
    const img = document.createElement('img');
    img.src = 'earth.png';

    // Styling for image
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    img.style.position = 'absolute';
    img.style.cursor = 'grab';

    // Rotation, Panning & Zoom Variables
    let rotation = 0;
    let isDragging = false;
    let lastAngle = 0;
    let rotationSpeed = 0;
    let isPanning = false;
    let lastMouseX = 0, lastMouseY = 0;
    let offsetX = 0, offsetY = 0;
    let panSpeedX = 0, panSpeedY = 0;
    let isSpacePressed = false;
    let currentScale = 1;
    let targetScale = 1;
    
    // Animation variables
    let isAnimating = false;
    let zoomOriginX = 0;
    let zoomOriginY = 0;

    const FRICTION_FREE = 0.995;
    const FRICTION_HOLD = 0.9;
    const PAN_FRICTION = 0.9;
    const ZOOM_SPEED = 0.15;
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 10;

    let imgRect, centerX, centerY;

    function updateImageCenter() {
        imgRect = img.getBoundingClientRect();
        centerX = imgRect.left + imgRect.width / 2;
        centerY = imgRect.top + imgRect.height / 2;
    }

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function updateTransform() {
        img.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${currentScale})`;
    }

    // Smooth zoom animation with cursor as center point
    function animateZoom() {
        if (!isAnimating) return;

        const scaleDiff = targetScale - currentScale;
        
        if (Math.abs(scaleDiff) < 0.001) {
            isAnimating = false;
            return;
        }

        const prevScale = currentScale;
        currentScale = lerp(currentScale, targetScale, ZOOM_SPEED);

        // Calculate the position relative to the container
        const mouseXRelative = zoomOriginX - container.offsetWidth / 2;
        const mouseYRelative = zoomOriginY - container.offsetHeight / 2;

        // Calculate how much the position should change based on the scale change
        const scaleRatio = currentScale / prevScale;
        
        // Update the offset to keep the mouse point fixed
        offsetX = scaleRatio * (offsetX - mouseXRelative) + mouseXRelative;
        offsetY = scaleRatio * (offsetY - mouseYRelative) + mouseYRelative;

        updateTransform();
        requestAnimationFrame(animateZoom);
    }

    // Enhanced wheel event handler with cursor-centered zooming
    document.addEventListener('wheel', (e) => {
        e.preventDefault();

        // Store the mouse position
        zoomOriginX = e.clientX;
        zoomOriginY = e.clientY;

        const zoomIntensity = 0.1;
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        const newTargetScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, 
            targetScale * (1 + (zoomDirection * zoomIntensity))));

        // Only proceed if the scale is actually changing
        if (newTargetScale !== targetScale) {
            targetScale = newTargetScale;
            
            if (!isAnimating) {
                isAnimating = true;
                animateZoom();
            }
        }
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            isSpacePressed = true;
            img.style.cursor = 'move';
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            isSpacePressed = false;
            img.style.cursor = 'grab';
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target !== img && !container.contains(e.target)) return;
        
        isDragging = true;
        updateImageCenter();

        if (isSpacePressed) {
            isPanning = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        } else {
            let dx = e.clientX - centerX;
            let dy = e.clientY - centerY;
            lastAngle = Math.atan2(dy, dx);
        }

        img.style.cursor = isSpacePressed ? 'grabbing' : 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        if (isPanning) {
            let dx = e.clientX - lastMouseX;
            let dy = e.clientY - lastMouseY;

            offsetX += dx;
            offsetY += dy;

            panSpeedX = dx * 0.5;
            panSpeedY = dy * 0.5;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        } else {
            let dx = e.clientX - centerX;
            let dy = e.clientY - centerY;
            let newAngle = Math.atan2(dy, dx);

            let deltaAngle = newAngle - lastAngle;
            if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

            let scaleFactor = 0.25;
            rotation += (deltaAngle * 180) / Math.PI * scaleFactor;
            rotationSpeed = (deltaAngle * 180) / Math.PI * scaleFactor;

            lastAngle = newAngle;
        }

        updateTransform();
    });

    const endDrag = () => {
        if (!isDragging) return;
        
        isDragging = false;
        isPanning = false;
        img.style.cursor = 'grab';

        function inertiaRotation() {
            rotationSpeed *= FRICTION_FREE;
            rotation += rotationSpeed;
            updateTransform();

            if (Math.abs(rotationSpeed) > 0.01) {
                requestAnimationFrame(inertiaRotation);
            }
        }

        if (Math.abs(rotationSpeed) > 0.05) {
            inertiaRotation();
        }

        function inertiaPanning() {
            panSpeedX *= PAN_FRICTION;
            panSpeedY *= PAN_FRICTION;

            offsetX += panSpeedX;
            offsetY += panSpeedY;

            updateTransform();

            if (Math.abs(panSpeedX) > 0.5 || Math.abs(panSpeedY) > 0.5) {
                requestAnimationFrame(inertiaPanning);
            }
        }

        if (Math.abs(panSpeedX) > 0.5 || Math.abs(panSpeedY) > 0.5) {
            inertiaPanning();
        }
    };
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);

    img.onerror = () => {
        console.error('Failed to load image. Check console for details.');
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Error: Could not load image.';
        errorMsg.style.color = 'red';
        errorMsg.style.fontWeight = 'bold';
        container.appendChild(errorMsg);
    };

    container.appendChild(img);
    document.body.appendChild(container);
});