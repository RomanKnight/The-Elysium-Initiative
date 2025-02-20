document.addEventListener('DOMContentLoaded', () => {
    // Add custom font
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @font-face {
            font-family: 'Havelock Titling Medium';
            src: url('havelock-titling-medium.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(fontStyle);

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
    objectsContainer.style.transformOrigin = 'center center';
    objectsContainer.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.47, 0.4, 1)';

    // create UI container (immune to transformations)
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.height = '100%';
    uiContainer.style.pointerEvents = 'none';

    // create zoom level display
    const zoomDisplay = document.createElement('div');
    zoomDisplay.className = 'ui-element';
    zoomDisplay.style.position = 'fixed';
    zoomDisplay.style.top = '20px';
    zoomDisplay.style.right = '20px';
    zoomDisplay.style.padding = '8px 12px';
    zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    zoomDisplay.style.color = 'white';
    zoomDisplay.style.borderRadius = '5px';
    zoomDisplay.style.fontFamily = 'Arial, sans-serif';
    zoomDisplay.style.fontSize = '14px';
    zoomDisplay.style.fontWeight = 'bold';

    // add Elysium logo
    const elysiumLogo = document.createElement('img');
    elysiumLogo.src = 'elysium_logo.png';
    elysiumLogo.style.position = 'fixed';
    elysiumLogo.style.bottom = '20px';
    elysiumLogo.style.left = '20px';
    elysiumLogo.style.transformOrigin = 'bottom left';
    elysiumLogo.style.scale = '0.3';

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

    // function to create planet label
    function createPlanetLabel(name, x, y) {
        const label = document.createElement('div');
        label.textContent = name;
        label.style.position = 'absolute';
        label.style.color = 'white';
        label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        label.style.padding = '4px 8px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '14px';
        label.style.fontFamily = 'Havelock Titling Medium, sans-serif';
        label.style.pointerEvents = 'none';
        label.style.left = '50%';
        label.style.top = '50%';
        label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
        label.style.transformOrigin = 'center center';
        return label;
    }

    // update transform for all objects with scale
    function updateTransform() {
        backgroundContainer.style.transform = `translate(-50%, -50%)`;
        objectsContainer.style.transform = `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.scale})`;
        
        const orbits = orbitsSvg.getElementsByTagName('circle');
        for (let orbit of orbits) {
            orbit.setAttribute('stroke-width', state.strokeWidth / state.scale);
            
            // start fading at scale 0.01, completely fade out by scale 0.1
            const opacity = Math.max(0, Math.min(1, (state.scale - 0.1) / (0.001 - 0.1)));
            orbit.style.opacity = opacity;
        }

        // In the updateTransform function, replace the current label scaling code with:
        const labels = objectsContainer.getElementsByTagName('div');
        for (let label of labels) {
            const labelOpacity = Math.max(0, Math.min(1, (state.scale - 0.6) / (0.3 - 0.6)));
            label.style.opacity = labelOpacity;
            label.style.transform = label.style.transform.replace(/scale\([^\)]+\)/, `scale(${1 / state.scale})`);
        }
        zoomDisplay.textContent = `Zoom: ${(state.scale).toFixed(5)}`;
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
        const mercuryDegrees = 150;
        const mercuryX = MERCURY_DISTANCE_PX * Math.cos(mercuryDegrees * Math.PI / 180);
        const mercuryY = MERCURY_DISTANCE_PX * Math.sin(mercuryDegrees * Math.PI / 180);
        mercuryImage.style.transform = `
            translate(${mercuryX}px, ${mercuryY}px)
            rotate(${mercuryDegrees}deg)`;

    // venus
    const venusImage = addInteractiveObject('venus.png', {
        maxWidth: `${VENUS_SIZE_PX}px`,
        maxHeight: `${VENUS_SIZE_PX}px`
        });
        const venusDegrees = 30;
        const venusX = VENUS_DISTANCE_PX * Math.cos(venusDegrees * Math.PI / 180);
        const venusY = VENUS_DISTANCE_PX * Math.sin(venusDegrees * Math.PI / 180);
        venusImage.style.transform = `
            translate(${venusX}px, ${venusY}px)
            rotate(${venusDegrees}deg)`;

    // earth
    const earthImage = addInteractiveObject('earth.png', {
        maxWidth: `${EARTH_SIZE_PX}px`,
        maxHeight: `${EARTH_SIZE_PX}px`
        });
        const earthDegrees = 0;
        const earthX = EARTH_DISTANCE_PX * Math.cos(earthDegrees * Math.PI / 180);
        const earthY = EARTH_DISTANCE_PX * Math.sin(earthDegrees * Math.PI / 180);
        earthImage.style.transform = `
            translate(${earthX}px, ${earthY}px)
            rotate(${earthDegrees}deg)`;

    // moon
    const moonImage = addInteractiveObject('moon.png', {
        maxWidth: `${MOON_SIZE_PX}px`,
        maxHeight: `${MOON_SIZE_PX}px`
        });
        const moonDegrees = earthDegrees + 0;
        const moonX = (EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * Math.cos(moonDegrees * Math.PI / 180);
        const moonY = (EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * Math.sin(moonDegrees * Math.PI / 180);
        moonImage.style.transform = `
            translate(${moonX}px, ${moonY}px)
            rotate(${moonDegrees}deg)`;

    // mars
    const marsImage = addInteractiveObject('mars.png', {
        maxWidth: `${MARS_SIZE_PX}px`,
        maxHeight: `${MARS_SIZE_PX}px`
        });
        const marsDegrees = 240;
        const marsX = MARS_DISTANCE_PX * Math.cos(marsDegrees * Math.PI / 180);
        const marsY = MARS_DISTANCE_PX * Math.sin(marsDegrees * Math.PI / 180);
        marsImage.style.transform = `
            translate(${marsX}px, ${marsY}px)
            rotate(${marsDegrees}deg)`;

    // jupiter
    const jupiterImage = addInteractiveObject('jupiter.png', {
        maxWidth: `${JUPITER_SIZE_PX}px`,
        maxHeight: `${JUPITER_SIZE_PX}px`
        });
        const jupiterDegrees = 80;
        const jupiterX = JUPITER_DISTANCE_PX * Math.cos(jupiterDegrees * Math.PI / 180);
        const jupiterY = JUPITER_DISTANCE_PX * Math.sin(jupiterDegrees * Math.PI / 180);
        jupiterImage.style.transform = `
            translate(${jupiterX}px, ${jupiterY}px)
            rotate(${jupiterDegrees}deg)`;

    // saturn
    const saturnImage = addInteractiveObject('saturn.png', {
        maxWidth: `${SATURN_SIZE_PX}px`,
        maxHeight: `${SATURN_SIZE_PX}px`
        });
        const saturnDegrees = 0;
        const saturnX = SATURN_DISTANCE_PX * Math.cos(saturnDegrees * Math.PI / 180);
        const saturnY = SATURN_DISTANCE_PX * Math.sin(saturnDegrees * Math.PI / 180);
        saturnImage.style.transform = `
            translate(${saturnX}px, ${saturnY}px)
            rotate(${saturnDegrees}deg)`;

    // uranus
    const uranusImage = addInteractiveObject('uranus.png', {
        maxWidth: `${URANUS_SIZE_PX}px`,
        maxHeight: `${URANUS_SIZE_PX}px`
        });
        const uranusDegrees = 290;
        const uranusX = URANUS_DISTANCE_PX * Math.cos(uranusDegrees * Math.PI / 180);
        const uranusY = URANUS_DISTANCE_PX * Math.sin(uranusDegrees * Math.PI / 180);
        uranusImage.style.transform = `
            translate(${uranusX}px, ${uranusY}px)
            rotate(${uranusDegrees}deg)`;

    // neptune
    const neptuneImage = addInteractiveObject('neptune.png', {
        maxWidth: `${NEPTUNE_SIZE_PX}px`,
        maxHeight: `${NEPTUNE_SIZE_PX}px`
        });
        const neptuneDegrees = 100;
        const neptuneX = NEPTUNE_DISTANCE_PX * Math.cos(neptuneDegrees * Math.PI / 180);
        const neptuneY = NEPTUNE_DISTANCE_PX * Math.sin(neptuneDegrees * Math.PI / 180);
        neptuneImage.style.transform = `
            translate(${neptuneX}px, ${neptuneY}px)
            rotate(${neptuneDegrees}deg)`;

    // pluto
    const plutoImage = addInteractiveObject('pluto.png', {
        maxWidth: `${PLUTO_SIZE_PX}px`,
        maxHeight: `${PLUTO_SIZE_PX}px`
        });
        const plutoDegrees = 200;
        const plutoX = PLUTO_DISTANCE_PX * Math.cos(plutoDegrees * Math.PI / 180);
        const plutoY = PLUTO_DISTANCE_PX * Math.sin(plutoDegrees * Math.PI / 180);
        plutoImage.style.transform = `
            translate(${plutoX}px, ${plutoY}px)
            rotate(${plutoDegrees}deg)`;

    // Create labels for each planet
    const sunLabel = createPlanetLabel('Sun', 0, 0);
    const mercuryLabel = createPlanetLabel('Mercury', mercuryX, mercuryY);
    const venusLabel = createPlanetLabel('Venus', venusX, venusY);
    const earthLabel = createPlanetLabel('Earth', earthX, earthY);
    const moonLabel = createPlanetLabel('Moon', moonX, moonY);
    const marsLabel = createPlanetLabel('Mars', marsX, marsY);
    const jupiterLabel = createPlanetLabel('Jupiter', jupiterX, jupiterY);
    const saturnLabel = createPlanetLabel('Saturn', saturnX, saturnY);
    const uranusLabel = createPlanetLabel('Uranus', uranusX, uranusY);
    const neptuneLabel = createPlanetLabel('Neptune', neptuneX, neptuneY);
    const plutoLabel = createPlanetLabel('Pluto', plutoX, plutoY);

    // Add labels to the objects container
    objectsContainer.appendChild(sunLabel);
    objectsContainer.appendChild(mercuryLabel);
    objectsContainer.appendChild(venusLabel);
    objectsContainer.appendChild(earthLabel);
    objectsContainer.appendChild(moonLabel);
    objectsContainer.appendChild(marsLabel);
    objectsContainer.appendChild(jupiterLabel);
    objectsContainer.appendChild(saturnLabel);
    objectsContainer.appendChild(uranusLabel);
    objectsContainer.appendChild(neptuneLabel);
    objectsContainer.appendChild(plutoLabel);

    // SVG container for orbits
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

    const mercuryOrbit = createOrbitCircle(MERCURY_DISTANCE_PX);
    const venusOrbit = createOrbitCircle(VENUS_DISTANCE_PX);
    const earthOrbit = createOrbitCircle(EARTH_DISTANCE_PX);
    const marsOrbit = createOrbitCircle(MARS_DISTANCE_PX);
    const jupiterOrbit = createOrbitCircle(JUPITER_DISTANCE_PX);
    const saturnOrbit = createOrbitCircle(SATURN_DISTANCE_PX);
    const uranusOrbit = createOrbitCircle(URANUS_DISTANCE_PX);
    const neptuneOrbit = createOrbitCircle(NEPTUNE_DISTANCE_PX);
    const plutoOrbit = createOrbitCircle(PLUTO_DISTANCE_PX);

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
            state.offsetX = -mercuryX * state.scale;
            state.offsetY = -mercuryY * state.scale;
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
            state.offsetX = -venusX * state.scale;
            state.offsetY = -venusY * state.scale;
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
            state.offsetX = -earthX * state.scale;
            state.offsetY = -earthY * state.scale;
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
            state.offsetX = -marsX * state.scale;
            state.offsetY = -marsY * state.scale;
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
            state.offsetX = -jupiterX * state.scale;
            state.offsetY = -jupiterY * state.scale;
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
            state.offsetX = -saturnX * state.scale;
            state.offsetY = -saturnY * state.scale;
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
            state.offsetX = -uranusX * state.scale;
            state.offsetY = -uranusY * state.scale;
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
            state.offsetX = -neptuneX * state.scale;
            state.offsetY = -neptuneY * state.scale;
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
            state.offsetX = -plutoX * state.scale;
            state.offsetY = -plutoY * state.scale;
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
    addUIElement(zoomDisplay);
    addUIElement(elysiumLogo);
});