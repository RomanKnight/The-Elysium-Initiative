document.addEventListener('DOMContentLoaded', () => {
    // Create container div to center the image
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.position = 'relative';
    container.style.background = 'black';

    // Create an image element
    const img = document.createElement('img');
    img.src = 'image.jpg';

    // Styling for image
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    img.style.position = 'absolute';
    img.style.cursor = 'grab';

    // Rotation variables
    let rotation = 0;
    let isDragging = false;
    let lastAngle = 0;
    let rotationSpeed = 0;
    const FRICTION_FREE = 0.995; // Normal friction (when free spinning)
    const FRICTION_HOLD = 0.9;   // Stronger friction (when holding mouse)
    let currentScale = 1;
    
    // Center of image for proper rotation calculations
    let imgRect, centerX, centerY;
    
    // Function to update image center coordinates
    function updateImageCenter() {
        imgRect = img.getBoundingClientRect();
        centerX = imgRect.left + imgRect.width / 2;
        centerY = imgRect.top + imgRect.height / 2;
    }

    // Smooth zoom functionality
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const zoomIntensity = 0.002;
        const minScale = 0.1;
        currentScale = Math.max(minScale, currentScale * (1 - e.deltaY * zoomIntensity));
        
        img.style.transform = `rotate(${rotation}deg) scale(${currentScale})`;
        img.dataset.scale = currentScale;
    }, { passive: false });

    // Mouse down event (start slowing down)
    document.addEventListener('mousedown', (e) => {
        if (e.target !== img && !container.contains(e.target)) return;
        
        isDragging = true;
        updateImageCenter();
        
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        lastAngle = Math.atan2(dy, dx);
        
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });

    // Mouse move event (update rotation)
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        let newAngle = Math.atan2(dy, dx);
        
        let deltaAngle = newAngle - lastAngle;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

        rotation += (deltaAngle * 180) / Math.PI;
        rotationSpeed = (deltaAngle * 180) / Math.PI;
        
        img.style.transform = `rotate(${rotation}deg) scale(${currentScale})`;
        
        lastAngle = newAngle;
    });

    // Mouse up event (apply inertia)
    const endDrag = () => {
        if (!isDragging) return;
        
        isDragging = false;
        img.style.cursor = 'grab';

        function inertiaAnimation() {
            rotationSpeed *= isDragging ? FRICTION_HOLD : FRICTION_FREE;
            rotation += rotationSpeed;
            img.style.transform = `rotate(${rotation}deg) scale(${currentScale})`;

            if (Math.abs(rotationSpeed) > 0.01) {
                requestAnimationFrame(inertiaAnimation);
            }
        }

        if (Math.abs(rotationSpeed) > 0.05) {
            inertiaAnimation();
        }
    };
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);
    
    // Error handling
    img.onerror = () => {
        console.error('Failed to load image. Check console for details.');
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Error: Could not load image.';
        errorMsg.style.color = 'red';
        errorMsg.style.fontWeight = 'bold';
        container.appendChild(errorMsg);
    };

    // Add image to container and container to body
    container.appendChild(img);
    document.body.appendChild(container);
});
