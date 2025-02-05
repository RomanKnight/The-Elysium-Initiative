document.addEventListener('DOMContentLoaded', () => {
    // Create main container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.backgroundColor = 'black';

    // Create background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.style.position = 'absolute';
    backgroundContainer.style.top = '50%';
    backgroundContainer.style.left = '50%';
    backgroundContainer.style.transform = 'translate(-50%, -50%)';
    
    // Function to update background size
    function updateBackgroundSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Make the background 150% of the largest viewport dimension
        const size = Math.max(viewportWidth, viewportHeight) * 1.5;
        backgroundContainer.style.width = `${size}px`;
        backgroundContainer.style.height = `${size}px`;
    }
    
    // Create background image
    const backgroundImg = document.createElement('img');
    backgroundImg.src = 'background.jpg';
    backgroundImg.style.width = '100%';
    backgroundImg.style.height = '100%';
    backgroundImg.style.objectFit = 'contain';
    
    // Add background image to container
    backgroundContainer.appendChild(backgroundImg);
    
    // Initial size setup
    updateBackgroundSize();
    
    // Update size when window resizes
    window.addEventListener('resize', updateBackgroundSize);

    // Create a container for rotating/zoomable objects
    const objectsContainer = document.createElement('div');
    objectsContainer.style.position = 'absolute';
    objectsContainer.style.width = '100%';
    objectsContainer.style.height = '100%';
    objectsContainer.style.display = 'flex';
    objectsContainer.style.justifyContent = 'center';
    objectsContainer.style.alignItems = 'center';

    // Create UI container (immune to transformations)
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.height = '100%';
    uiContainer.style.pointerEvents = 'none'; // Allow clicks to pass through by default

    // Add Elysium logo
    const elysiumLogo = document.createElement('img');
    elysiumLogo.src = 'elysium_logo.png';  // Replace with your image path
    elysiumLogo.style.position = 'fixed';
    elysiumLogo.style.bottom = '20px';   // Distance from bottom
    elysiumLogo.style.left = '20px';     // Distance from left
    elysiumLogo.style.transformOrigin = 'bottom left';
    elysiumLogo.style.scale = '0.3';
    elysiumLogo.style.zIndex = '1000';   // Ensure it stays on top

    // State variables
    const state = {
        rotation: 0,
        isMouseDown: false,      // Tracks if mouse button is currently pressed
        isDragging: false,       // Tracks if we're in a drag operation
        lastAngle: 0,
        rotationSpeed: 0,
        currentScale: 1,
        targetScale: 1,
        zoomVelocity: 0,
        zoomMomentum: 0,
        lastZoomTime: 0,
        offsetX: 0,
        offsetY: 0,
        isAnimating: false,
        zoomOriginX: 0,
        zoomOriginY: 0,
        isPanning: false,
        isSpacePressed: false,
        lastMouseX: 0,
        lastMouseY: 0,
        panSpeedX: 0,
        panSpeedY: 0
    };

    // Constants
    const FRICTION_FREE = 0.995;
    const ZOOM_SPEED = 0.15;
    const MIN_SCALE = 0.01;
    const MAX_SCALE = 5;
    const PAN_FRICTION = 0.95;

    // Function to add a new interactive object
    function addInteractiveObject(imgSrc, options = {}) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.maxWidth = options.maxWidth || '80%';
        img.style.maxHeight = options.maxHeight || '80%';
        img.style.objectFit = 'contain';
        img.style.position = 'absolute';

        img.onerror = () => {
            console.error(`Failed to load image: ${imgSrc}`);
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Error: Could not load image.';
            errorMsg.style.color = 'red';
            errorMsg.style.fontWeight = 'bold';
            objectsContainer.appendChild(errorMsg);
        };

        objectsContainer.appendChild(img);
        return img;
    }

    // Function to add UI element
    function addUIElement(element) {
        element.style.pointerEvents = 'auto'; // Enable interactions for this element
        uiContainer.appendChild(element);
        return element;
    }

    // Update transform for all objects
    function updateTransform() {
        backgroundContainer.style.transform = `translate(-50%, -50%) rotate(${state.rotation}deg)`;
        objectsContainer.style.transform = `translate(${state.offsetX}px, ${state.offsetY}px) rotate(${state.rotation}deg) scale(${state.currentScale})`;
    }

    // Constants for zoom physics
    const ZOOM_MOMENTUM_DECAY = 0.92;  // How quickly momentum decreases
    const ZOOM_VELOCITY_SCALE = 0.004; // How much wheel events affect velocity
    const ZOOM_MIN_VELOCITY = 0.0001;  // Minimum velocity before stopping
    const MAX_ZOOM_VELOCITY = 0.1;     // Maximum velocity cap

    // Smooth zoom animation with momentum
    function animateZoom() {
        if (!state.isAnimating) return;

        // Apply momentum to velocity
        state.zoomVelocity += state.zoomMomentum;
        state.zoomMomentum *= ZOOM_MOMENTUM_DECAY;

        // Apply velocity to scale
        const prevScale = state.currentScale;
        state.currentScale *= (1 + state.zoomVelocity);
        
        // Clamp scale within bounds
        state.currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.currentScale));
        
        // Update position to maintain zoom center
        const mouseXRelative = state.zoomOriginX - container.offsetWidth / 2;
        const mouseYRelative = state.zoomOriginY - container.offsetHeight / 2;
        const scaleRatio = state.currentScale / prevScale;
        
        state.offsetX = scaleRatio * (state.offsetX - mouseXRelative) + mouseXRelative;
        state.offsetY = scaleRatio * (state.offsetY - mouseYRelative) + mouseYRelative;

        // Apply decay to velocity
        state.zoomVelocity *= ZOOM_MOMENTUM_DECAY;

        // Stop animation if movement is minimal
        if (Math.abs(state.zoomVelocity) < ZOOM_MIN_VELOCITY && 
            Math.abs(state.zoomMomentum) < ZOOM_MIN_VELOCITY) {
            state.isAnimating = false;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            return;
        }

        updateTransform();
        requestAnimationFrame(animateZoom);
    }

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Event Listeners
    document.addEventListener('wheel', (e) => {
        e.preventDefault();

        // Update zoom origin
        state.zoomOriginX = e.clientX;
        state.zoomOriginY = e.clientY;

        // Calculate time since last wheel event for momentum
        const currentTime = performance.now();
        const timeDelta = currentTime - state.lastZoomTime;
        state.lastZoomTime = currentTime;

        // Calculate zoom direction and intensity
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        let zoomDelta = zoomDirection * ZOOM_VELOCITY_SCALE;

        // Scale zoom delta based on time between events
        if (timeDelta > 0) {
            zoomDelta *= Math.min(1, 16 / timeDelta);
        }

        // Add to momentum
        state.zoomMomentum += zoomDelta;

        // Clamp momentum to prevent excessive zooming
        state.zoomMomentum = Math.max(-MAX_ZOOM_VELOCITY, 
                            Math.min(MAX_ZOOM_VELOCITY, state.zoomMomentum));

        if (!state.isAnimating) {
            state.isAnimating = true;
            animateZoom();
        }
    }, { passive: false });

    // Add keyboard event listeners for space bar
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            state.isSpacePressed = true;
            if (state.isMouseDown) {
                // Switch to panning mode if mouse is already down
                state.isPanning = true;
                state.isDragging = true;
            }
            objectsContainer.style.cursor = 'move';
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            state.isSpacePressed = false;
            // Always stop panning when space is released
            state.isPanning = false;
            state.isDragging = false;
            // Reset any ongoing inertia
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            objectsContainer.style.cursor = 'default';
        }
    });

    // Global mousedown handler
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('.ui-element')) return;
        if (e.button !== 0) return;
        
        state.isMouseDown = true;
        state.isDragging = true;
        
        if (state.isSpacePressed) {
            state.isPanning = true;
            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
            objectsContainer.style.cursor = 'grabbing';
        } else {
            state.isPanning = false;
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = e.clientX - centerX;
            let dy = e.clientY - centerY;
            state.lastAngle = Math.atan2(dy, dx);
        }
        
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        // Only handle mouse movement if we're actively dragging
        if (!state.isDragging) return;

        if (state.isPanning) {
            // Handle panning
            const dx = e.clientX - state.lastMouseX;
            const dy = e.clientY - state.lastMouseY;

            state.offsetX += dx;
            state.offsetY += dy;

            // Set pan speed for inertia
            state.panSpeedX = dx;
            state.panSpeedY = dy;

            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
        } else {
            // Handle rotation
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            let dx = e.clientX - centerX;
            let dy = e.clientY - centerY;
            let newAngle = Math.atan2(dy, dx);

            let deltaAngle = newAngle - state.lastAngle;
            if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

            let scaleFactor = 0.25;
            state.rotation += (deltaAngle * 180) / Math.PI * scaleFactor;
            state.rotationSpeed = (deltaAngle * 180) / Math.PI * scaleFactor;

            state.lastAngle = newAngle;
        }

        updateTransform();
    });

    document.addEventListener('mouseup', (e) => {
        if (!state.isMouseDown) return;
        state.isMouseDown = false;
        
        if (state.isPanning) {
            // If space is still pressed, keep panning mode active but end the current drag
            if (state.isSpacePressed) {
                state.isDragging = false;
                objectsContainer.style.cursor = 'move';
            } else {
                // If space is not pressed, stop panning completely
                state.isPanning = false;
                state.isDragging = false;
                objectsContainer.style.cursor = 'default';
            }
        } else {
            // Handle rotation inertia
            function inertiaRotation() {
                state.rotationSpeed *= FRICTION_FREE;
                state.rotation += state.rotationSpeed;
                updateTransform();

                if (Math.abs(state.rotationSpeed) > 0.01) {
                    requestAnimationFrame(inertiaRotation);
                }
            }

            if (Math.abs(state.rotationSpeed) > 0.05) {
                inertiaRotation();
            }
            state.isDragging = false;
        }
    });

    // Append containers
    container.appendChild(backgroundContainer);
    container.appendChild(objectsContainer);
    container.appendChild(uiContainer);
    document.body.appendChild(container);

    // Add initial earth object and moon object
    const earthImage = addInteractiveObject('earth.png');
    
    // Moon is about 27% the size of Earth
    const MOON_SIZE_MULTIPLIER = 0.27;
    
    const moonImage = addInteractiveObject('moon.png', {
        maxWidth: `${80 * MOON_SIZE_MULTIPLIER}%`,  // Moon size relative to Earth
        maxHeight: `${80 * MOON_SIZE_MULTIPLIER}%`
    });
    
    // Position moon to the right of Earth
    moonImage.style.transform = `translateX(${17000}px)`; // Initial position

    // Create and add the select earth button
    function createSelectionButton(text, color, position, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'ui-element';
        button.style.position = 'absolute';
        button.style.left = '20px';
        button.style.top = position;
        button.style.padding = '10px 20px';
        button.style.backgroundColor = color;
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        // Add hover effect
        const darkenColor = (color) => {
            const r = parseInt(color.substr(1,2), 16) * 0.9;
            const g = parseInt(color.substr(3,2), 16) * 0.9;
            const b = parseInt(color.substr(5,2), 16) * 0.9;
            return `#${Math.round(r).toString(16).padStart(2,'0')}${Math.round(g).toString(16).padStart(2,'0')}${Math.round(b).toString(16).padStart(2,'0')}`;
        };
        
        const darkerColor = darkenColor(color);
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = darkerColor;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = color;
        });

        button.addEventListener('click', onClick);
        return button;
    }

    // Create Earth button
    const selectEarthButton = createSelectionButton(
        'Select Earth', 
        '#0080be', 
        '20px',
        () => {
            // Reset all transform-related state
            state.rotation = 0;
            state.currentScale = 1;
            state.offsetX = 0;
            state.offsetY = 0;
            state.rotationSpeed = 0;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            updateTransform();
        }
    );

    // Create Moon button
    const selectMoonButton = createSelectionButton(
        'Select Moon', 
        '#0080be', 
        '70px',  // Position below Earth button
        () => {
            // Calculate position to center on moon
            state.rotation = 0;
            state.currentScale = 1;
            state.offsetX = -17000;  // Negative of the moon's X translation to center it
            state.offsetY = 0;
            state.rotationSpeed = 0;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            updateTransform();
        }
    );

    addUIElement(selectEarthButton);
    addUIElement(selectMoonButton);
    addUIElement(elysiumLogo);
});