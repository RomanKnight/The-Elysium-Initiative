document.addEventListener('DOMContentLoaded', () => {
    // create main container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.backgroundColor = 'black';

    // create background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.style.position = 'absolute';
    backgroundContainer.style.top = '50%';
    backgroundContainer.style.left = '50%';
    backgroundContainer.style.transform = 'translate(-50%, -50%)';
    
    // function to update background size
    function updateBackgroundSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // make background 150% of the viewing dimensions
        const size = Math.max(viewportWidth, viewportHeight) * 1.5;
        backgroundContainer.style.width = `${size}px`;
        backgroundContainer.style.height = `${size}px`;
    }
    
    // create background image
    const backgroundImg = document.createElement('img');
    backgroundImg.src = 'background.jpg';
    backgroundImg.style.width = '100%';
    backgroundImg.style.height = '100%';
    backgroundImg.style.objectFit = 'contain';
    
    // add background image to container
    backgroundContainer.appendChild(backgroundImg);
    
    // initial size setup
    updateBackgroundSize();
    
    // update size when window resizes
    window.addEventListener('resize', updateBackgroundSize);

    // create a container for zoomable objects
    const objectsContainer = document.createElement('div');
    objectsContainer.style.position = 'absolute';
    objectsContainer.style.width = '100%';
    objectsContainer.style.height = '100%';
    objectsContainer.style.display = 'flex';
    objectsContainer.style.justifyContent = 'center';
    objectsContainer.style.alignItems = 'center';

    // create UI container (immune to transformations)
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.height = '100%';
    uiContainer.style.pointerEvents = 'none';

    // add Elysium logo
    const elysiumLogo = document.createElement('img');
    elysiumLogo.src = 'elysium_logo.png';
    elysiumLogo.style.position = 'fixed';
    elysiumLogo.style.bottom = '20px';   // distance from bottom
    elysiumLogo.style.left = '20px';     // distance from left
    elysiumLogo.style.transformOrigin = 'bottom left';
    elysiumLogo.style.scale = '0.3';
    elysiumLogo.style.zIndex = '1000';   // ensure it stays on top

    // state variables
    const state = {
        isMouseDown: false,
        isDragging: false,
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

    // constants for zoom scale
    const MIN_SCALE = 0.0001;
    const MAX_SCALE = 2500;

    // function to add a new interactive object
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

    // function to add UI element
    function addUIElement(element) {
        element.style.pointerEvents = 'auto'; // enable interactions for this element
        uiContainer.appendChild(element);
        return element;
    }

    // update transform for all objects
    function updateTransform() {
        backgroundContainer.style.transform = `translate(-50%, -50%)`;
        objectsContainer.style.transform = `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.currentScale})`;
    }

    // constants for zoom physics
    const ZOOM_MOMENTUM_DECAY = 0.92;  // how quickly momentum decreases
    const ZOOM_VELOCITY_SCALE = 0.004; // how much wheel events affect velocity
    const ZOOM_MIN_VELOCITY = 0.0001;  // minimum velocity before stopping
    const MAX_ZOOM_VELOCITY = 0.1;     // maximum velocity cap

    // smooth zoom animation with momentum
    function animateZoom() {
        if (!state.isAnimating) return;

        // apply momentum to velocity
        state.zoomVelocity += state.zoomMomentum;
        state.zoomMomentum *= ZOOM_MOMENTUM_DECAY;

        // apply velocity to scale
        const prevScale = state.currentScale;
        state.currentScale *= (1 + state.zoomVelocity);
        
        // clamp scale within bounds
        state.currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.currentScale));
        
        // update position to maintain zoom center
        const mouseXRelative = state.zoomOriginX - container.offsetWidth / 2;
        const mouseYRelative = state.zoomOriginY - container.offsetHeight / 2;
        const scaleRatio = state.currentScale / prevScale;
        
        state.offsetX = scaleRatio * (state.offsetX - mouseXRelative) + mouseXRelative;
        state.offsetY = scaleRatio * (state.offsetY - mouseYRelative) + mouseYRelative;

        // apply decay to velocity
        state.zoomVelocity *= ZOOM_MOMENTUM_DECAY;

        // stop animation if movement is minimal
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

    // event listeners
    document.addEventListener('wheel', (e) => {
        e.preventDefault();

        // update zoom origin
        state.zoomOriginX = e.clientX;
        state.zoomOriginY = e.clientY;

        // calculate time since last wheel event for momentum
        const currentTime = performance.now();
        const timeDelta = currentTime - state.lastZoomTime;
        state.lastZoomTime = currentTime;

        // calculate zoom direction and intensity
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        let zoomDelta = zoomDirection * ZOOM_VELOCITY_SCALE;

        // scale zoom delta based on time between events
        if (timeDelta > 0) {
            zoomDelta *= Math.min(1, 16 / timeDelta);
        }

        // add to momentum
        state.zoomMomentum += zoomDelta;

        // clamp momentum to prevent excessive zooming
        state.zoomMomentum = Math.max(-MAX_ZOOM_VELOCITY, 
                            Math.min(MAX_ZOOM_VELOCITY, state.zoomMomentum));

        if (!state.isAnimating) {
            state.isAnimating = true;
            animateZoom();
        }
    }, { passive: false });

    // add keyboard event listeners for space bar
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            state.isSpacePressed = true;
            if (state.isMouseDown) {
                // switch to panning mode if mouse is already down
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
            // always stop panning when space is released
            state.isPanning = false;
            state.isDragging = false;
            // reset any ongoing inertia
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            objectsContainer.style.cursor = 'default';
        }
    });

    // global mousedown handler
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
        }
        
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        // only handle mouse movement if we're actively dragging
        if (!state.isDragging) return;

        if (state.isPanning) {
            // handle panning
            const dx = e.clientX - state.lastMouseX;
            const dy = e.clientY - state.lastMouseY;

            state.offsetX += dx;
            state.offsetY += dy;

            // set pan speed for inertia
            state.panSpeedX = dx;
            state.panSpeedY = dy;

            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
        }

        updateTransform();
    });

    document.addEventListener('mouseup', (e) => {
        if (!state.isMouseDown) return;
        state.isMouseDown = false;
        
        if (state.isPanning) {
            // if space is still pressed, keep panning mode active but end the current drag
            if (state.isSpacePressed) {
                state.isDragging = false;
                objectsContainer.style.cursor = 'move';
            } else {
                // if space is not pressed, stop panning completely
                state.isPanning = false;
                state.isDragging = false;
                objectsContainer.style.cursor = 'default';
            }
        }
    });

    // append containers
    container.appendChild(backgroundContainer);
    container.appendChild(objectsContainer);
    container.appendChild(uiContainer);
    document.body.appendChild(container);

    // celestial scale constants
    const KM_TO_PIXELS = 1/1000;

    const SUN_DIAMETER = 1392000;
    const EARTH_DIAMETER = 12742;
    const MOON_DIAMETER = 3474;
    const SUN_SIZE_PX = SUN_DIAMETER * KM_TO_PIXELS;
    const EARTH_SIZE_PX = EARTH_DIAMETER * KM_TO_PIXELS;
    const MOON_SIZE_PX = MOON_DIAMETER * KM_TO_PIXELS;

    const EARTH_SUN_DISTANCE = 147600000;
    const EARTH_MOON_DISTANCE = 384400;
    const EARTH_DISTANCE_PX = EARTH_SUN_DISTANCE * KM_TO_PIXELS;
    const MOON_DISTANCE_PX = EARTH_MOON_DISTANCE * KM_TO_PIXELS;

    // sun
    const sunImage = addInteractiveObject('sun.png', {
        maxWidth: `${SUN_SIZE_PX}px`,
        maxHeight: `${SUN_SIZE_PX}px`
    });
    
    // earth
    const earthImage = addInteractiveObject('earth.png', {
        maxWidth: `${EARTH_SIZE_PX}px`,
        maxHeight: `${EARTH_SIZE_PX}px`
    });
    earthImage.style.transform = `translateX(${EARTH_DISTANCE_PX}px)`;

    // moon
    const moonImage = addInteractiveObject('moon.png', {
        maxWidth: `${MOON_SIZE_PX}px`,
        maxHeight: `${MOON_SIZE_PX}px`
    });
    moonImage.style.transform = `translateX(${EARTH_DISTANCE_PX + MOON_DISTANCE_PX}px)`;

    // adding planet selection button
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

        // hover effect
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

    // sun button
    const selectSunButton = createSelectionButton(
        'Sun', 
        '#0080be', 
        '20px',
        () => {
            state.currentScale = 1.7;
            state.offsetX = 0;
            state.offsetY = 0;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            updateTransform();
        }
    );
    
    // earth button
    const selectEarthButton = createSelectionButton(
        'Earth', 
        '#0080be', 
        '70px',
        () => {
            state.currentScale = 80;
            state.offsetX = -EARTH_DISTANCE_PX * state.currentScale;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            updateTransform();
        }
    );

    // moon button
    const selectMoonButton = createSelectionButton(
        'Moon', 
        '#0080be', 
        '120px',
        () => {
            state.currentScale = 250;
            state.offsetX = -(EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * state.currentScale;
            state.zoomVelocity = 0;
            state.zoomMomentum = 0;
            state.panSpeedX = 0;
            state.panSpeedY = 0;
            updateTransform();
        }
    );

    addUIElement(selectSunButton);
    addUIElement(selectEarthButton);
    addUIElement(selectMoonButton);
    addUIElement(elysiumLogo);
});