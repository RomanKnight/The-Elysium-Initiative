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
        const size = Math.max(viewportWidth, viewportHeight) * 1;
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

    // create a container for objects
    const objectsContainer = document.createElement('div');
    objectsContainer.style.position = 'absolute';
    objectsContainer.style.width = '100%';
    objectsContainer.style.height = '100%';
    objectsContainer.style.display = 'flex';
    objectsContainer.style.justifyContent = 'center';
    objectsContainer.style.alignItems = 'center';
    objectsContainer.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.47, 0.4, 1)'; // smooth transition

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
    elysiumLogo.style.bottom = '20px';
    elysiumLogo.style.left = '20px';
    elysiumLogo.style.transformOrigin = 'bottom left';
    elysiumLogo.style.scale = '0.3';
    elysiumLogo.style.zIndex = '1000';

    // state variables
    const state = {
        isMouseDown: false,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        scale: 1,
        targetScale: 1,
        strokeWidth: 2
    };

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
        element.style.pointerEvents = 'auto';
        uiContainer.appendChild(element);
        return element;
    }

    // update transform for all objects with scale
    function updateTransform() {
        backgroundContainer.style.transform = `translate(-50%, -50%)`;
        objectsContainer.style.transform = `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.scale})`;
        
        const orbits = orbitsSvg.getElementsByTagName('circle');
        for (let orbit of orbits) {
            orbit.setAttribute('stroke-width', state.strokeWidth / state.scale);
            
            // start fading at scale 4, completely fade out by scale 8
            const opacity = Math.max(0, Math.min(1, (0.5 - state.scale) / 0.1));
            orbit.style.opacity = opacity;
        }
    }

    // zoom handling function
    function handleZoom(e) {
        e.preventDefault();
    
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        // calculate position relative to center
        const containerCenterX = rect.width / 2;
        const containerCenterY = rect.height / 2;
    
        // calculate point to zoom around
        const pointX = (mouseX - containerCenterX - state.offsetX) / state.scale;
        const pointY = (mouseY - containerCenterY - state.offsetY) / state.scale;
    
        // calculate new scale
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(state.scale * delta, 0.00005), 150);
    
        // calculate new offsets to maintain zoom point
        state.offsetX = mouseX - containerCenterX - (pointX * newScale);
        state.offsetY = mouseY - containerCenterY - (pointY * newScale);
        
        // update scale
        state.scale = newScale;
        state.targetScale = newScale;
    
        // update transform immediately
        updateTransform();
    }
    container.addEventListener('wheel', handleZoom, { passive: false });

    // global mousedown handler
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('.ui-element')) return;
        if (e.button !== 0) return;
        
        state.isMouseDown = true;
        state.isDragging = true;
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
        objectsContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;

        const dx = e.clientX - state.lastMouseX;
        const dy = e.clientY - state.lastMouseY;

        state.offsetX += dx;
        state.offsetY += dy;

        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;

        updateTransform();
    });

    document.addEventListener('mouseup', (e) => {
        if (!state.isMouseDown) return;
        state.isMouseDown = false;
        state.isDragging = false;
        objectsContainer.style.cursor = 'default';
    });

    // append containers
    container.appendChild(backgroundContainer);
    container.appendChild(objectsContainer);
    container.appendChild(uiContainer);
    document.body.appendChild(container);

    // celestial scale constants
    const KM_TO_PIXELS = 1/1000;

    // zeroes added in some places to resize for smoothing (planets scales are not accurate)
    const SUN_DIAMETER = 1392000;
    const MERCURY_DIAMETER = 48780; // added a zero
    const VENUS_DIAMETER = 121040; // added a zero
    const EARTH_DIAMETER = 127420; // added a zero
    const MOON_DIAMETER = 34740; // added a zero
    const MARS_DIAMETER = 67790; // added a zero
    const JUPITER_DIAMETER = 142984;
    const SATURN_DIAMETER = 120536;
    const URANUS_DIAMETER = 511180; // added a zero
    const NEPTUNE_DIAMETER = 492440; // added a zero
    const PLUTO_DIAMETER = 2377000; // added three zeroes
    const SUN_SIZE_PX = SUN_DIAMETER * KM_TO_PIXELS;
    const MERCURY_SIZE_PX = MERCURY_DIAMETER * KM_TO_PIXELS;
    const VENUS_SIZE_PX = VENUS_DIAMETER * KM_TO_PIXELS;
    const EARTH_SIZE_PX = EARTH_DIAMETER * KM_TO_PIXELS;
    const MOON_SIZE_PX = MOON_DIAMETER * KM_TO_PIXELS;
    const MARS_SIZE_PX = MARS_DIAMETER * KM_TO_PIXELS;
    const JUPITER_SIZE_PX = JUPITER_DIAMETER * KM_TO_PIXELS;
    const SATURN_SIZE_PX = SATURN_DIAMETER * KM_TO_PIXELS;
    const URANUS_SIZE_PX = URANUS_DIAMETER * KM_TO_PIXELS;
    const NEPTUNE_SIZE_PX = NEPTUNE_DIAMETER * KM_TO_PIXELS;
    const PLUTO_SIZE_PX = PLUTO_DIAMETER * KM_TO_PIXELS;

    const MERCURY_SUN_DISTANCE = 57900000;
    const VENUS_SUN_DISTANCE = 108000000;
    const EARTH_SUN_DISTANCE = 147600000;
    const EARTH_MOON_DISTANCE = 3844000; // added a zero
    const MARS_SUN_DISTANCE = 229000000;
    const JUPITER_SUN_DISTANCE = 778000000;
    const SATURN_SUN_DISTANCE = 1427000000;
    const URANUS_SUN_DISTANCE = 2871000000;
    const NEPTUNE_SUN_DISTANCE = 4497000000;
    const PLUTO_SUN_DISTANCE = 5913000000;
    const MERCURY_DISTANCE_PX = MERCURY_SUN_DISTANCE * KM_TO_PIXELS;
    const VENUS_DISTANCE_PX = VENUS_SUN_DISTANCE * KM_TO_PIXELS;
    const EARTH_DISTANCE_PX = EARTH_SUN_DISTANCE * KM_TO_PIXELS;
    const MOON_DISTANCE_PX = EARTH_MOON_DISTANCE * KM_TO_PIXELS;
    const MARS_DISTANCE_PX = MARS_SUN_DISTANCE * KM_TO_PIXELS;
    const JUPITER_DISTANCE_PX = JUPITER_SUN_DISTANCE * KM_TO_PIXELS;
    const SATURN_DISTANCE_PX = SATURN_SUN_DISTANCE * KM_TO_PIXELS;
    const URANUS_DISTANCE_PX = URANUS_SUN_DISTANCE * KM_TO_PIXELS;
    const NEPTUNE_DISTANCE_PX = NEPTUNE_SUN_DISTANCE * KM_TO_PIXELS;
    const PLUTO_DISTANCE_PX = PLUTO_SUN_DISTANCE * KM_TO_PIXELS;

    // sun
    const sunImage = addInteractiveObject('sun.png', {
        maxWidth: `${SUN_SIZE_PX}px`,
        maxHeight: `${SUN_SIZE_PX}px`
    });

    // mercury
    const mercuryImage = addInteractiveObject('mercury.png', {
        maxWidth: `${MERCURY_SIZE_PX}px`,
        maxHeight: `${MERCURY_SIZE_PX}px`
    });
    mercuryImage.style.transform = `translateX(${MERCURY_DISTANCE_PX}px)`;

    // venus
    const venusImage = addInteractiveObject('venus.png', {
        maxWidth: `${VENUS_SIZE_PX}px`,
        maxHeight: `${VENUS_SIZE_PX}px`
    });
    venusImage.style.transform = `translateX(${VENUS_DISTANCE_PX}px)`;
    
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

    // mars
    const marsImage = addInteractiveObject('mars.png', {
        maxWidth: `${MARS_SIZE_PX}px`,
        maxHeight: `${MARS_SIZE_PX}px`
    });
    marsImage.style.transform = `translateX(${MARS_DISTANCE_PX}px)`;

    // jupiter
    const jupiterImage = addInteractiveObject('jupiter.png', {
        maxWidth: `${JUPITER_SIZE_PX}px`,
        maxHeight: `${JUPITER_SIZE_PX}px`
    });
    jupiterImage.style.transform = `translateX(${JUPITER_DISTANCE_PX}px)`;

    // saturn
    const saturnImage = addInteractiveObject('saturn.png', {
        maxWidth: `${SATURN_SIZE_PX}px`,
        maxHeight: `${SATURN_SIZE_PX}px`
    });
    saturnImage.style.transform = `translateX(${SATURN_DISTANCE_PX}px)`;

    // uranus
    const uranusImage = addInteractiveObject('uranus.png', {
        maxWidth: `${URANUS_SIZE_PX}px`,
        maxHeight: `${URANUS_SIZE_PX}px`
    });
    uranusImage.style.transform = `translateX(${URANUS_DISTANCE_PX}px)`;

    // neptune
    const neptuneImage = addInteractiveObject('neptune.png', {
        maxWidth: `${NEPTUNE_SIZE_PX}px`,
        maxHeight: `${NEPTUNE_SIZE_PX}px`
    });
    neptuneImage.style.transform = `translateX(${NEPTUNE_DISTANCE_PX}px)`;

    // pluto
    const plutoImage = addInteractiveObject('pluto.png', {
        maxWidth: `${PLUTO_SIZE_PX}px`,
        maxHeight: `${PLUTO_SIZE_PX}px`
    });
    plutoImage.style.transform = `translateX(${PLUTO_DISTANCE_PX}px)`;

    // Create SVG container for orbits
    const orbitsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    orbitsSvg.style.position = 'absolute';
    orbitsSvg.style.width = '100%';
    orbitsSvg.style.height = '100%';
    orbitsSvg.style.pointerEvents = 'none';
    orbitsSvg.style.overflow = 'visible';
    orbitsSvg.style.zIndex = '-1';
    objectsContainer.appendChild(orbitsSvg);

    // function to create orbit circle
    function createOrbitCircle(radius) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)');
        circle.setAttribute('stroke-width', state.strokeWidth);
        circle.style.transition = 'opacity 0.3s ease';
        return circle;
    }

    // Add orbit circles for each planet
    const mercuryOrbit = createOrbitCircle(MERCURY_DISTANCE_PX);
    const venusOrbit = createOrbitCircle(VENUS_DISTANCE_PX);
    const earthOrbit = createOrbitCircle(EARTH_DISTANCE_PX);
    const marsOrbit = createOrbitCircle(MARS_DISTANCE_PX);
    const jupiterOrbit = createOrbitCircle(JUPITER_DISTANCE_PX);
    const saturnOrbit = createOrbitCircle(SATURN_DISTANCE_PX);
    const uranusOrbit = createOrbitCircle(URANUS_DISTANCE_PX);
    const neptuneOrbit = createOrbitCircle(NEPTUNE_DISTANCE_PX);
    const plutoOrbit = createOrbitCircle(PLUTO_DISTANCE_PX);

    // Add all orbits to the SVG
    orbitsSvg.appendChild(mercuryOrbit);
    orbitsSvg.appendChild(venusOrbit);
    orbitsSvg.appendChild(earthOrbit);
    orbitsSvg.appendChild(marsOrbit);
    orbitsSvg.appendChild(jupiterOrbit);
    orbitsSvg.appendChild(saturnOrbit);
    orbitsSvg.appendChild(uranusOrbit);
    orbitsSvg.appendChild(neptuneOrbit);
    orbitsSvg.appendChild(plutoOrbit);

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

        button.addEventListener('click', () => {
            // Reset scale when selecting a new object
            state.scale = 1;
            state.targetScale = 1;
            onClick();
        });
        return button;
    }

    // sun button
    const selectSunButton = createSelectionButton(
        'Sun', 
        '#0080be', 
        '20px',
        () => {
            state.scale = 0.8;
            state.offsetX = 0;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // mercury button
    const selectMercuryButton = createSelectionButton(
        'Mercury', 
        '#0080be', 
        '70px',
        () => {
            state.scale = 9;
            state.offsetX = -MERCURY_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // venus button
    const selectVenusButton = createSelectionButton(
        'Venus', 
        '#0080be', 
        '120px',
        () => {
            state.scale = 5;
            state.offsetX = -VENUS_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );
    
    // earth button
    const selectEarthButton = createSelectionButton(
        'Earth', 
        '#0080be', 
        '170px',
        () => {
            state.scale = 5.5;
            state.offsetX = -EARTH_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // moon button
    const selectMoonButton = createSelectionButton(
        'Moon', 
        '#0080be', 
        '220px',
        () => {
            state.scale = 13;
            state.offsetX = -(EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * state.scale;
            state.offsetY;
            updateTransform();
        }
    );

    // mars button
    const selectMarsButton = createSelectionButton(
        'Mars', 
        '#0080be', 
        '270px',
        () => {
            state.scale = 10;
            state.offsetX = -MARS_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // jupiter button
    const selectJupiterButton = createSelectionButton(
        'Jupiter', 
        '#0080be', 
        '320px',
        () => {
            state.scale = 7;
            state.offsetX = -JUPITER_DISTANCE_PX * state.scale;
            updateTransform();
        }
    );

    // saturn button
    const selectSaturnButton = createSelectionButton(
        'Saturn', 
        '#0080be', 
        '370px',
        () => {
            state.scale = 10;
            state.offsetX = -SATURN_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // uranus button
    const selectUranusButton = createSelectionButton(
        'Uranus', 
        '#0080be', 
        '420px',
        () => {
            state.scale = 1.2;
            state.offsetX = -URANUS_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // neptune button
    const selectNeptuneButton = createSelectionButton(
        'Neptune', 
        '#0080be', 
        '470px',
        () => {
            state.scale = 1.2;
            state.offsetX = -NEPTUNE_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    // pluto button
    const selectPlutoButton = createSelectionButton(
        'Pluto', 
        '#0080be', 
        '520px',
        () => {
            state.scale = 0.15;
            state.offsetX = -PLUTO_DISTANCE_PX * state.scale;
            state.offsetY = 0;
            updateTransform();
        }
    );

    addUIElement(selectSunButton);
    addUIElement(selectMercuryButton);
    addUIElement(selectVenusButton);
    addUIElement(selectEarthButton);
    addUIElement(selectMoonButton);
    addUIElement(selectMarsButton);
    addUIElement(selectJupiterButton);
    addUIElement(selectSaturnButton);
    addUIElement(selectUranusButton);
    addUIElement(selectNeptuneButton);
    addUIElement(selectPlutoButton);
    addUIElement(elysiumLogo);
});