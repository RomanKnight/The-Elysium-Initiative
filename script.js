document.addEventListener('DOMContentLoaded', () => {
    const ambientSound = new Audio('ambience.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0;
    ambientSound.play();

    // functions
    function loadChartJsScript(callback) {
        // First, destroy any existing chart
        const existingChart = document.getElementById('ironValueChart');
        if (existingChart) {
            const chartInstance = Chart.getChart(existingChart);
            if (chartInstance) {
                chartInstance.destroy();
            }
        }
    
        // Then check if Chart.js is already loaded
        if (typeof Chart === 'undefined') {
            const chartScript = document.createElement('script');
            chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
            chartScript.onload = callback;
            document.head.appendChild(chartScript);
        } else {
            callback();
        }
    }
    function createHoverSound() {
        const sound = new Audio('hover.mp3');
        sound.volume = 0.25;
        return sound;
    }
    function createClickSound() {
        const sound = new Audio('click.mp3');
        sound.volume = 0.2;
        return sound;
    }
    function playHoverSound() {
        const sound = createHoverSound();
        sound.play();
    }
    function playClickSound() {
        const sound = createClickSound();
        sound.play();
    }
    function closeAllPages() {
        document.querySelectorAll('div[id$="-page"]').forEach(page => page.remove());
        container.style.display = 'flex';
    }

    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @font-face {
            font-family: 'Havelock Titling Medium';
            src: url('havelock_titling_medium.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Havelock Titling Bold';
            src: url('havelock_titling_bold.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Source Code Pro';
            src: url('source_code_pro.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(fontStyle);

    // menu style
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
        .menu-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            z-index: 1000;
        }
        .menu-item {
            color: rgba(200, 200, 200);
            padding: 0 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 18px;
            position: relative;
        }
        .menu-item:hover {
            color: rgb(255, 255, 255)
        }
        .dropdown {
            position: absolute;
            top: 80px;
            background-color: rgba(0, 0, 0, 0.5);
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }
        .menu-item:hover .dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(20px);
        }
        .dropdown-item {
            color: rgb(200, 200, 200);
            padding: 15px 20px;
            cursor: pointer;
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 18px;
            position: relative;
            opacity: 0;
            transform: translateX(-10px);
        }
        .dropdown-item:hover {
            color: rgb(255, 255, 255);
        }
        .menu-item:hover .dropdown-item {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .menu-item:hover .dropdown-item:nth-child(1) { transition-delay: 0.05s; }
        .menu-item:hover .dropdown-item:nth-child(2) { transition-delay: 0.1s; }
        .menu-item:hover .dropdown-item:nth-child(3) { transition-delay: 0.15s; }
        .menu-item:hover .dropdown-item:nth-child(4) { transition-delay: 0.2s; }
        .menu-item:hover .dropdown-item:nth-child(5) { transition-delay: 0.25s; }
        .menu-item:hover .dropdown-item:nth-child(6) { transition-delay: 0.3s; }
        .menu-item:hover .dropdown-item:nth-child(7) { transition-delay: 0.35s; }
        .menu-item:hover .dropdown-item:nth-child(8) { transition-delay: 0.4s; }
        .menu-item:hover .dropdown-item:nth-child(9) { transition-delay: 0.45s; }
        .menu-item:hover .dropdown-item:nth-child(10) { transition-delay: 0.5s; }
        .menu-item:hover .dropdown-item:nth-child(11) { transition-delay: 0.55s; }

        .dropdown-item::after {
            content: '';
            position: absolute;
            bottom: 10px;
            left: 20px;
            width: 0;
            height: 2px;
            background-color: rgb(255, 255, 255);
            transition: width 0.3s ease;
            transform-origin: left;
        }
        .dropdown-item:hover::after {
            width: var(--underline-width);
        }
        
        .control-indicator {
            position: fixed;
            bottom: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-family: 'Source Code Pro', sans-serif;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 2000;
        }
        .control-indicator img {
            width: auto;
            height: 60px;
            margin-left: -7px;
        }
    `;
    document.head.appendChild(menuStyle);

    // nested dropdown style (for moons)
    const nestedMenuStyle = document.createElement('style');
    nestedMenuStyle.textContent = `
        .dropdown-item {
            position: relative;
        }
        
        .nested-dropdown {
            position: absolute;
            left: 100%;
            top: 0;
            background-color: rgba(0, 0, 0, 0.5);
            min-width: 150px;
            opacity: 0;
            visibility: hidden;
            transform: translateX(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }
        
        .dropdown-item:hover .nested-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
        }
        
        .nested-dropdown-item {
            color: rgb(200, 200, 200);
            padding: 15px 20px;
            cursor: pointer;
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 18px;
            position: relative;
            opacity: 0;
            transform: translateX(-10px);
        }
        
        .nested-dropdown-item:hover {
            color: rgb(255, 255, 255);
        }
        
        .dropdown-item:hover .nested-dropdown-item {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }
        
        .nested-dropdown-item::after {
            content: '';
            position: absolute;
            bottom: 10px;
            left: 20px;
            width: 0;
            height: 2px;
            background-color: rgb(255, 255, 255);
            transition: width 0.3s ease;
            transform-origin: left;
        }
        
        .nested-dropdown-item:hover::after {
            width: var(--underline-width);
        }
        
        /* Add arrow indicator for items with nested dropdowns */
        .has-nested-dropdown::before {
            content: '›';
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }
    `;
    document.head.appendChild(nestedMenuStyle);

    // sidebar style
    const sidebarStyle = document.createElement('style');
    sidebarStyle.textContent = `
        .info-sidebar {
            position: fixed;
            right: -400px;
            top: 100px;
            width: 400px;
            height: calc(100vh - 100px);
            background-color: rgba(0, 0, 0, 0.5);
            transition: right 0.3s ease-in-out;
            z-index: 1001;
            color: white;
            font-family: 'Source Code Pro', sans-serif;
            overflow-y: auto;
        }
        .info-sidebar.active {
            right: 0;
        }
        .sidebar-content {
            padding: 2rem;
        }
        .sidebar-header {
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: white;
        }
        .sidebar-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
            color: white;
            font-size: 1.5rem;
            background: none;
            border: none;
            padding: 0.5rem;
            transition: transform 0.2s ease;
        }
        .sidebar-close:hover {
            transform: scale(1.1);
        }
        .planet-stat {
            margin-bottom: 1rem;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        .stat-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        .stat-value {
            color: white;
            font-size: 1.1rem;
        }
        .planet-description {
            line-height: 1.6;
            margin: 1.5rem 0;
            color: rgba(255, 255, 255, 0.9);
        }
    `;
    document.head.appendChild(sidebarStyle);

    // main container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.backgroundColor = 'black';

    // background container
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
    
    // background image
    const backgroundImg = document.createElement('img');
    backgroundImg.src = 'background.jpg';
    backgroundImg.style.width = '100%';
    backgroundImg.style.height = '100%';
    backgroundImg.style.objectFit = 'contain';
    backgroundContainer.appendChild(backgroundImg);
    
    // initial size setup
    updateBackgroundSize();
    
    // update size when window resizes
    window.addEventListener('resize', updateBackgroundSize);

    // objects container
    const objectsContainer = document.createElement('div');
    objectsContainer.style.position = 'absolute';
    objectsContainer.style.width = '100%';
    objectsContainer.style.height = '100%';
    objectsContainer.style.display = 'flex';
    objectsContainer.style.justifyContent = 'center';
    objectsContainer.style.alignItems = 'center';
    objectsContainer.style.transformOrigin = 'center center';
    objectsContainer.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.47, 0.4, 1)';

    // UI container (immune to transformations)
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.height = '100%';
    uiContainer.style.pointerEvents = 'none';

    // zoom level display
    const zoomDisplay = document.createElement('div');
    zoomDisplay.className = 'ui-element';
    zoomDisplay.style.position = 'fixed';
    zoomDisplay.style.bottom = '20px';
    zoomDisplay.style.left = '20px';
    zoomDisplay.style.padding = '8px 12px';
    zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    zoomDisplay.style.color = 'white';
    zoomDisplay.style.borderRadius = '5px';
    zoomDisplay.style.fontFamily = 'Source Code Pro, sans-serif';
    zoomDisplay.style.fontSize = '14px';
    zoomDisplay.style.fontWeight = 'bold';
    zoomDisplay.style.zIndex = '2000'

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
        planetOrbitWidth: 2.5,
        moonOrbitWidth: 2
    };

    // label fade thresholds
    const labelFadeThresholds = {
        'Sun': { start: 0.01, end: 0.1 },
        'Mercury': { start: 0.1, end: 1 },
        'Venus': { start: 0.05, end: 0.5 },
        'Earth': { start: 0.05, end: 0.5 },
        'Moon': { farStart: 0.018, farEnd: 0.03,closeStart: 0.5, closeEnd: 1 },
        'Mars': { start: 0.1, end: 1 },
        'Phobos': { farStart: 0.15, farEnd: 0.3, closeStart: 5, closeEnd: 10 },
        'Deimos': { farStart: 0.15, farEnd: 0.3, closeStart: 5, closeEnd: 10 },
        'Jupiter': { start: 0.01, end: 0.1 },
        'Ganymede': { farStart: 0.001, farEnd: 0.01, closeStart: 0.25, closeEnd: 1 },
        'Io': { farStart: 0.001, farEnd: 0.01, closeStart: 0.5, closeEnd: 1.5 },
        'Europa': { farStart: 0.001, farEnd: 0.01, closeStart: 0.1, closeEnd: 1 },
        'Callisto': { farStart: 0.001, farEnd: 0.01, closeStart: 0.25, closeEnd: 1 },
        'Saturn': { start: 0.015, end: 0.15 },
        'Titan': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Rhea': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Iapetus': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Dione': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Enceladus': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Mimas': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },    
        'Uranus': { start: 0.01, end: 0.1 },
        'Neptune': { start: 0.01, end: 0.1 },
        'Pluto': { start: 0.01, end: 0.02 }
    };

    // orbit fade thresholds for planets
    const orbitFadeThresholdsPlanets = {
        'Mercury': { start: 0.005, end: 0.01 },
        'Venus': { start: 0.005, end: 0.01 },
        'Earth': { start: 0.005, end: 0.01 },
        'Mars': { start: 0.005, end: 0.01 },
        'Jupiter': { start: 0.001, end: 0.005 },
        'Saturn': { start: 0.001, end: 0.005 },
        'Uranus': { start: 0.001, end: 0.005 },
        'Neptune': { start: 0.001, end: 0.005 },
        'Pluto': { start: 0.001, end: 0.005 },
    };

    // orbit fade thresholds for moons
    const orbitFadeThresholdsMoons = {
        'Moon': { farStart: 0.005, farEnd: 0.035, closeStart: 0.7, closeEnd: 1 },
        'Phobos': { farStart: 0.15, farEnd: 0.3, closeStart: 1.5, closeEnd: 2 },
        'Deimos': { farStart: 0.15, farEnd: 0.3, closeStart: 1.5, closeEnd: 2 },
        'Ganymede': { farStart: 0.001, farEnd: 0.01, closeStart: 0.1, closeEnd: 0.3 },
        'Io': { farStart: 0.001, farEnd: 0.01, closeStart: 0.1, closeEnd: 0.3 },
        'Europa': { farStart: 0.001, farEnd: 0.01, closeStart: 0.1, closeEnd: 0.3 },
        'Callisto': { farStart: 0.001, farEnd: 0.01, closeStart: 0.1, closeEnd: 0.3 },
        'Titan': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Rhea': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Iapetus': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Dione': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Enceladus': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
        'Mimas': { farStart: 0.005, farEnd: 0.03, closeStart: 0.5, closeEnd: 1.5 },
    };

    // function to add a new interactive object
    function addInteractiveObject(imgSrc, options = {}) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.maxWidth = options.maxWidth || '80%';
        img.style.maxHeight = options.maxHeight || '80%';
        img.style.objectFit = 'contain';
        img.style.position = 'absolute';
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
        label.dataset.planetName = name;
        label.style.position = 'absolute';
        label.style.color = 'white';
        label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        label.style.padding = '4px 8px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '14px';
        label.style.fontFamily = 'Havelock Titling Medium, sans-serif';
        label.style.pointerEvents = 'auto';
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
        
        // handle regular planet orbits
        const planetOrbits = Array.from(orbitsSvg.getElementsByTagName('circle'))
        .filter(orbit => !orbit.classList.contains('moon-orbit'));
        for (let orbit of planetOrbits) {
            orbit.setAttribute('stroke-width', state.planetOrbitWidth / state.scale);
            
            if (orbit.dataset.planetName && orbitFadeThresholdsPlanets[orbit.dataset.planetName]) {
                const { start, end } = orbitFadeThresholdsPlanets[orbit.dataset.planetName];
                const opacity = Math.max(0, Math.min(1, (state.scale - end) / (start - end)));
                orbit.style.opacity = opacity;
            } else {
                orbit.style.opacity = 1;
            }
        }
        
        // handle moon orbits
        const moonOrbits = Array.from(orbitsSvg.getElementsByClassName('moon-orbit'));
        for (let moonOrbit of moonOrbits) {
            const moonName = moonOrbit.dataset.moonName;
            
            if (moonName === 'Moon') {
                moonOrbit.style.transform = `translate(${earthX}px, ${earthY}px)`;
            } else if (moonName === 'Phobos' || moonName === 'Deimos') {
                moonOrbit.style.transform = `translate(${marsX}px, ${marsY}px)`;
            }
            moonOrbit.setAttribute('stroke-width', state.moonOrbitWidth / state.scale);
            
            const thresholds = orbitFadeThresholdsMoons[moonName];
            if (thresholds) {
                const { farStart, farEnd, closeStart, closeEnd } = thresholds;
                let farOpacity = Math.max(0, Math.min(1, (state.scale - farStart) / (farEnd - farStart)));
                let closeOpacity = Math.max(0, Math.min(1, (closeEnd - state.scale) / (closeEnd - closeStart)));
                let moonOrbitOpacity = Math.min(farOpacity, closeOpacity);
                moonOrbit.style.opacity = moonOrbitOpacity;
            } else {
                moonOrbit.style.opacity = 1;
            }
        }
      
        // update the labels section in updateTransform:
        const labels = objectsContainer.getElementsByTagName('div');
        for (let label of labels) {
            const planetName = label.dataset.planetName;
            if (planetName && labelFadeThresholds[planetName]) {
                if (
                    planetName === 'Moon' || 
                    planetName === 'Phobos' || 
                    planetName === 'Deimos' ||
                    planetName === 'Ganymede' ||
                    planetName === 'Io' ||
                    planetName === 'Europa' ||
                    planetName === 'Callisto' ||
                    planetName === 'Titan' ||
                    planetName === 'Rhea' ||
                    planetName === 'Iapetus' ||
                    planetName === 'Dione' ||
                    planetName === 'Enceladus' ||
                    planetName === 'Mimas'
                ) {
                    const { farStart, farEnd, closeStart, closeEnd } = labelFadeThresholds[planetName];
                    let farOpacity = Math.max(0, Math.min(1, (state.scale - farStart) / (farEnd - farStart)));
                    let closeOpacity = Math.max(0, Math.min(1, (closeEnd - state.scale) / (closeEnd - closeStart)));
                    let moonLabelOpacity = Math.min(farOpacity, closeOpacity);
                    label.style.opacity = moonLabelOpacity;
                } else {
                    const { start, end } = labelFadeThresholds[planetName];
                    const labelOpacity = Math.max(0, Math.min(1, (state.scale - end) / (start - end)));
                    label.style.opacity = labelOpacity;
                }
            }
            label.style.transform = label.style.transform.replace(/scale\([^\)]+\)/, `scale(${1 / state.scale})`);
        }
        zoomDisplay.textContent = `Magnification: ${(state.scale).toFixed(5)}`;
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
    
        // calculate zoom point
        const pointX = (mouseX - containerCenterX - state.offsetX) / state.scale;
        const pointY = (mouseY - containerCenterY - state.offsetY) / state.scale;
        
        // calculate new scale
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(state.scale * delta, 0.00006), 100);
    
        // calculate new offsets to maintain zoom point
        state.offsetX = mouseX - containerCenterX - (pointX * newScale);
        state.offsetY = mouseY - containerCenterY - (pointY * newScale);
        
        // update scale
        state.scale = newScale;
        state.targetScale = newScale;

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

    container.appendChild(backgroundContainer);
    container.appendChild(objectsContainer);
    container.appendChild(uiContainer);
    document.body.appendChild(container);

    // menu bar
    const menuBar = document.createElement('div');
    menuBar.className = 'menu-bar';

    // menu items
    const menuItems = [
        {
            title: 'The Elysium Initiative',
            dropdown: [],
            isImage: true
        },
        {
            title: 'Navigation',
            action: () => {
                playClickSound();
                closeAllPages();
                container.style.display = 'flex';
            },
            dropdown: [
                { name: 'Sun', action: () => {
                    closeAllPages();
                    state.scale = 0.8;
                    state.offsetX = 0;
                    state.offsetY = 0;
                    updateTransform();
                    showPlanetInfo('Sun');
                }},
                { name: 'Mercury', action: () => {
                    closeAllPages();
                    state.scale = 9;
                    state.offsetX = -mercuryX * state.scale;
                    state.offsetY = -mercuryY * state.scale;
                    updateTransform();
                    showPlanetInfo('Mercury');
                }},
                { name: 'Venus', action: () => {
                    closeAllPages();
                    state.scale = 5;
                    state.offsetX = -venusX * state.scale;
                    state.offsetY = -venusY * state.scale;
                    updateTransform();
                    showPlanetInfo('Venus');
                }},
                { name: 'Earth', action: () => {
                    closeAllPages();
                    state.scale = 5.5;
                    state.offsetX = -earthX * state.scale;
                    state.offsetY = -earthY * state.scale;
                    updateTransform();
                    showPlanetInfo('Earth');
                },
                    nestedDropdown: [
                        { 
                            name: 'Moon', 
                            action: () => {
                                closeAllPages();
                                state.scale = 13;
                                state.offsetX = -(EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * state.scale;
                                state.offsetY = 0;
                                updateTransform();
                                showPlanetInfo('Moon');
                            }}
                        ]
                },
                { name: 'Mars', action: () => {
                    closeAllPages();
                    state.scale = 10;
                    state.offsetX = -marsX * state.scale;
                    state.offsetY = -marsY * state.scale;
                    updateTransform();
                    showPlanetInfo('Mars');
                },
                    nestedDropdown: [
                        { 
                            name: 'Phobos',
                            action: () => {
                                closeAllPages();
                                state.scale = 100;
                                state.offsetX = -phobosX * state.scale;
                                state.offsetY = -phobosY * state.scale;
                                updateTransform();
                                showPlanetInfo('Phobos');
                            } 
                        },
                        { 
                            name: 'Deimos', 
                            action: () => {
                                closeAllPages();
                                state.scale = 100;
                                state.offsetX = -deimosX * state.scale;
                                state.offsetY = -deimosY * state.scale;
                                updateTransform();
                                showPlanetInfo('Deimos');
                            }}
                        ]
                },
                { name: 'Jupiter', action: () => {
                    closeAllPages();
                    state.scale = 0.6;
                    state.offsetX = -jupiterX * state.scale;
                    state.offsetY = -jupiterY * state.scale;
                    updateTransform();
                    showPlanetInfo('Jupiter');
                },
                    nestedDropdown: [
                        { 
                            name: 'Ganymede', 
                            action: () => {
                                closeAllPages();
                                state.scale = 9;
                                state.offsetX = -ganymedeX * state.scale;
                                state.offsetY = -ganymedeY * state.scale;
                                updateTransform();
                                showPlanetInfo('Ganymede');
                            }
                        },
                        { 
                            name: 'Io', 
                            action: () => {
                                closeAllPages();
                                state.scale = 10;
                                state.offsetX = -ioX * state.scale;
                                state.offsetY = -ioY * state.scale;
                                updateTransform();
                                showPlanetInfo('Io');
                            }
                        },
                        { 
                            name: 'Europa', 
                            action: () => {
                                closeAllPages();
                                state.scale = 5.5;
                                state.offsetX = -europaX * state.scale;
                                state.offsetY = -europaY * state.scale;
                                updateTransform();
                                showPlanetInfo('Europa');
                            }
                        },
                        { 
                            name: 'Callisto', 
                            action: () => {
                                closeAllPages();
                                state.scale = 9;
                                state.offsetX = -callistoX * state.scale;
                                state.offsetY = -callistoY * state.scale;
                                updateTransform();
                                showPlanetInfo('Callisto');
                            }}
                        ]
                },                
                {
                    name: 'Saturn', 
                    action: () => {
                        closeAllPages();
                        state.scale = 1;
                        state.offsetX = -saturnX * state.scale;
                        state.offsetY = -saturnY * state.scale;
                        updateTransform();
                        showPlanetInfo('Saturn');
                    },
                        nestedDropdown: [
                            { name: 'Titan', action: () => {
                                closeAllPages();
                                state.scale = 6;
                                state.offsetX = -titanX * state.scale;
                                state.offsetY = -titanY * state.scale;
                                updateTransform();
                                showPlanetInfo('Titan');
                            }},
                            { name: 'Rhea', action: () => {
                                closeAllPages();
                                state.scale = 2.5;
                                state.offsetX = -rheaX * state.scale;
                                state.offsetY = -rheaY * state.scale;
                                updateTransform();
                                showPlanetInfo('Rhea');
                            }},
                            { name: 'Iapetus', action: () => {
                                closeAllPages();
                                state.scale = 3.25;
                                state.offsetX = -iapetusX * state.scale;
                                state.offsetY = -iapetusY * state.scale;
                                updateTransform();
                                showPlanetInfo('Iapetus');
                            }},
                            { name: 'Dione', action: () => {
                                closeAllPages();
                                state.scale = 3;
                                state.offsetX = -dioneX * state.scale;
                                state.offsetY = -dioneY * state.scale;
                                updateTransform();
                                showPlanetInfo('Dione');
                            }},
                            { name: 'Enceladus', action: () => {
                                closeAllPages();
                                state.scale = 8;
                                state.offsetX = -enceladusX * state.scale;
                                state.offsetY = -enceladusY * state.scale;
                                updateTransform();
                                showPlanetInfo('Enceladus');
                            }},
                            { name: 'Mimas', action: () => {
                                closeAllPages();
                                state.scale = 8;
                                state.offsetX = -mimasX * state.scale;
                                state.offsetY = -mimasY * state.scale;
                                updateTransform();
                                showPlanetInfo('Mimas');
                            }}
                        ]
                },                
                { name: 'Uranus', action: () => {
                    closeAllPages();
                    state.scale = 1.2;
                    state.offsetX = -uranusX * state.scale;
                    state.offsetY = -uranusY * state.scale;
                    updateTransform();
                    showPlanetInfo('Uranus');
                }},
                { name: 'Neptune', action: () => {
                    closeAllPages();
                    state.scale = 1.2;
                    state.offsetX = -neptuneX * state.scale;
                    state.offsetY = -neptuneY * state.scale;
                    updateTransform();
                    showPlanetInfo('Neptune');
                }},
                { name: 'Pluto', action: () => {
                    closeAllPages();
                    state.scale = 0.15;
                    state.offsetX = -plutoX * state.scale;
                    state.offsetY = -plutoY * state.scale;
                    updateTransform();
                    showPlanetInfo('Pluto');
                }}
            ]
        },
        {
            title: 'Prospecting',
            dropdown: [
                { 
                    name: 'Index',
                    action: () => {
                        closeAllPages();
                        sidebar.classList.remove('active');
                        container.style.display = 'none';

                        // page switch fix (remove existing index page)
                        const existingPage = document.getElementById('index-page');
                        if (existingPage) {
                            existingPage.remove();
                        }

                        const indexPage = document.createElement('div');
                        indexPage.id = 'index-page';
                        indexPage.style.minHeight = '100vh';
                        indexPage.style.height = '100%';
                        indexPage.style.backgroundColor = 'black';
                        indexPage.style.color = 'white';
                        indexPage.style.padding = '120px 2rem 2rem 2rem';
                        indexPage.style.display = 'flex';
                        indexPage.style.justifyContent = 'center';
                        indexPage.style.position = 'fixed';
                        indexPage.style.top = '0';
                        indexPage.style.left = '0';
                        indexPage.style.right = '0';
                        indexPage.style.bottom = '0';
                        indexPage.style.width = '100%';
                        indexPage.style.overflowY = 'scroll';

                        const content = document.createElement('div');
                        content.style.maxWidth = '1600px';
                        content.style.width = '100%';
                        content.style.marginBottom = '65rem';

                        const title = document.createElement('h1');
                        title.textContent = "Resource Index";
                        title.style.textAlign = 'center';
                        title.style.fontSize = '5rem';
                        title.style.marginBottom = '2rem';
                        title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        title.style.color = 'white';
                        
                        const resourceSection = document.createElement('div');
                        resourceSection.style.marginBottom = '3rem';

                        const chartContainer = document.createElement('div');
                        chartContainer.id = 'resource-chart-container';
                        chartContainer.style.width = '100%';
                        chartContainer.style.height = '600px';
                        chartContainer.style.backgroundColor = 'rgba(30, 30, 30, 0.7)';
                        chartContainer.style.borderRadius = '8px';
                        chartContainer.style.padding = '20px';
                        chartContainer.style.position = 'relative';
                        chartContainer.style.marginBottom = '2rem';

                        const buttonContainer = document.createElement('div');
                        buttonContainer.style.display = 'flex';
                        buttonContainer.style.justifyContent = 'center';
                        buttonContainer.style.gap = '15px';
                        buttonContainer.style.marginBottom = '20px';

                        const resources = [
                            { name: 'Iron', color: 'rgb(183, 65, 14)' },
                            { name: 'Silicon', color: 'rgb(31, 117, 24)' },
                            { name: 'Magnesium', color: 'rgb(155, 89, 182)' },
                            { name: 'Sulfur', color: 'rgb(241, 196, 15)' },
                            { name: 'Nickel', color: 'rgb(127, 140, 141)' },
                            { name: 'Calcium', color: 'rgb(236, 240, 241)' },
                            { name: 'Aluminum', color: 'rgb(30, 139, 134)' },
                            { name: 'Carbon', color: 'rgb(13, 76, 192)' },
                            { name: 'Platinum', color: 'rgb(84, 178, 255)' },
                        ];

                        resources.forEach(resource => {
                            const button = document.createElement('button');
                            button.textContent = resource.name;
                            button.style.padding = '8px 16px';
                            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            button.style.color = 'white';
                            button.style.border = 'none';
                            button.style.borderRadius = '4px';
                            button.style.cursor = 'pointer';
                            button.style.fontFamily = 'Source Code Pro, sans-serif';
                            button.style.transition = 'transform 0.2s, opacity 0.2s';
                            
                            button.onmouseover = () => {
                                playHoverSound();
                                button.style.opacity = '0.8';
                                button.style.transform = 'scale(1.05)';
                            };
                            button.onmouseout = () => {
                                button.style.opacity = '1';
                                button.style.transform = 'scale(1)';
                            };
                            
                            button.onclick = () => {
                                playClickSound();
                                updateChart(resource.name);
                            };
                            
                            buttonContainer.appendChild(button);
                        });
                        resourceSection.appendChild(buttonContainer);
                        resourceSection.appendChild(chartContainer);
                        content.appendChild(title);
                        content.appendChild(resourceSection);

                        const canvas = document.createElement('canvas');
                        canvas.id = 'resourceValueChart';
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        chartContainer.appendChild(canvas);

                        const tooltip = document.createElement('div');
                        tooltip.style.position = 'absolute';
                        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        tooltip.style.color = 'white';
                        tooltip.style.padding = '10px';
                        tooltip.style.borderRadius = '4px';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.opacity = '0';
                        tooltip.style.transition = 'opacity 0.2s';
                        tooltip.style.fontFamily = 'Source Code Pro, sans-serif';
                        tooltip.style.fontSize = '14px';
                        tooltip.style.zIndex = '10';
                        chartContainer.appendChild(tooltip);

                        let currentChart = null;
                        let currentResource = 'Iron';

                        // generate resource data
                        function generateResourceData(resourceName) {
                            const years = [];
                            const values = [];
                            
                            // starting from year 2150
                            for (let i = 0; i <= 30; i++) {
                                years.push(2100 + i);
                                
                                let baseValue = 100;
                                
                                // resource chart maths
                                switch(resourceName) {
                                    case 'Iron':
                                        baseValue += i * 15;
                                        baseValue += Math.sin(i * 1.5) * 50;
                                        if (i === 12) baseValue += 120;
                                        if (i === 18) baseValue -= 100;
                                        break;

                                    case 'Silicon':
                                        baseValue += i * 18;
                                        baseValue += Math.sin(i * 1.6) * 45;
                                        if (i === 11) baseValue += 110;
                                        if (i === 17) baseValue -= 90;
                                        break;

                                    case 'Magnesium':
                                        baseValue += i * 12;
                                        baseValue += Math.sin(i * 1.3) * 55;
                                        if (i === 13) baseValue += 130;
                                        if (i === 19) baseValue -= 110;
                                        break;

                                    case 'Sulfur':
                                        baseValue += i * 20;
                                        baseValue += Math.sin(i * 1.7) * 40;
                                        if (i === 10) baseValue += 100;
                                        if (i === 16) baseValue -= 80;
                                        break;

                                    case 'Nickel':
                                        baseValue += i * 16;
                                        baseValue += Math.sin(i * 1.4) * 60;
                                        if (i === 14) baseValue += 140;
                                        if (i === 20) baseValue -= 120;
                                        break;

                                    case 'Calcium':
                                        baseValue += i * 14;
                                        baseValue += Math.sin(i * 1.2) * 65;
                                        if (i === 13) baseValue += 125;
                                        if (i === 19) baseValue -= 105;
                                        break;

                                    case 'Aluminum':
                                        baseValue += i * 17;
                                        baseValue += Math.sin(i * 1.8) * 48;
                                        if (i === 11) baseValue += 115;
                                        if (i === 17) baseValue -= 95;
                                        break;

                                    case 'Carbon':
                                        baseValue += i * 22;
                                        baseValue += Math.sin(i * 1.9) * 42;
                                        if (i === 10) baseValue += 105;
                                        if (i === 16) baseValue -= 85;
                                        break;

                                    case 'Platinum':
                                        baseValue += i * 25;
                                        baseValue += Math.sin(i * 2.0) * 70;
                                        if (i === 9) baseValue += 150;
                                        if (i === 15) baseValue -= 130;
                                        break;
                                }
                                
                                values.push(Math.max(20, Math.round(baseValue)));
                            }
                            
                            return { years, values };
                        }

                        // make the chart
                        function createResourceChart(resourceName) {
                            const ctx = document.getElementById('resourceValueChart').getContext('2d');
                            const { years, values } = generateResourceData(resourceName);
                            
                            const resourceColor = resources.find(r => r.name === resourceName).color;
                            
                            // delete any existing chart
                            if (currentChart) {
                                currentChart.destroy();
                            }
                            
                            currentChart = new Chart(ctx, {
                                type: 'line',
                                data: {
                                    labels: years,
                                    datasets: [{
                                        label: `${resourceName} Index Value by Ton Recycled (TR)`,
                                        data: values,
                                        backgroundColor: `${resourceColor.replace('rgb', 'rgba').replace(')', ', 0.2)')}`,
                                        borderColor: resourceColor,
                                        borderWidth: 3,
                                        pointBackgroundColor: resourceColor,
                                        pointRadius: 5,
                                        pointHoverRadius: 8,
                                        fill: true,
                                        tension: 0
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Year',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                font: {
                                                    family: 'Source Code Pro',
                                                    size: 16
                                                }
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.1)'
                                            },
                                            ticks: {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                font: {
                                                    family: 'Source Code Pro',
                                                    size: 12
                                                }
                                            }
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Value Index (TR)',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                font: {
                                                    family: 'Source Code Pro',
                                                    size: 16
                                                }
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.1)'
                                            },
                                            ticks: {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                font: {
                                                    family: 'Source Code Pro',
                                                    size: 12
                                                }
                                            }
                                        }
                                    },
                                    plugins: {
                                        tooltip: {
                                            enabled: false,
                                            external: function(context) {
                                                if (context.tooltip.opacity === 0) {
                                                    tooltip.style.opacity = '0';
                                                    return;
                                                }
                                                
                                                const chartContainer = document.getElementById('resource-chart-container');
                                                const containerRect = chartContainer.getBoundingClientRect();
                                                const position = context.chart.canvas.getBoundingClientRect();
                                                
                                                tooltip.style.opacity = '1';
                                                
                                                const tooltipX = position.left + context.tooltip.caretX - containerRect.left + window.scrollX;
                                                const tooltipY = position.top + context.tooltip.caretY - containerRect.top + window.scrollY;
                                                
                                                const offsetX = 10;
                                                const offsetY = -20;
                                                
                                                tooltip.style.left = `${tooltipX + offsetX}px`;
                                                tooltip.style.top = `${tooltipY + offsetY}px`;
                                                
                                                tooltip.innerHTML = '';
                                                
                                                const dataIndex = context.tooltip.dataPoints[0].dataIndex;
                                                const value = values[dataIndex];
                                                const year = years[dataIndex];
                                                
                                                tooltip.innerHTML = `
                                                    <div style="display: flex; margin-bottom: 5px;">
                                                        <span style="color: rgba(255, 255, 255, 0.7); margin-right: 8px;">Year:</span>
                                                        <span style="font-weight: bold;">${year}</span>
                                                    </div>
                                                    <div style="display: flex;">
                                                        <span style="color: rgba(255, 255, 255, 0.7); margin-right: 8px;">Value:</span>
                                                        <span style="color: ${resourceColor}; font-weight: bold;">${value}</span>
                                                    </div>
                                                `;
                                            }
                                        },
                                        legend: {
                                            labels: {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                font: {
                                                    family: 'Source Code Pro',
                                                    size: 14
                                                }
                                            }
                                        }
                                    },
                                    interaction: {
                                        mode: 'index',
                                        intersect: false
                                    },
                                    animation: {
                                        duration: 1500,
                                        easing: 'easeOutQuart'
                                    }
                                }
                            });
                            
                            return currentChart;
                        }

                        function updateChart(resourceName) {
                            currentResource = resourceName;
                            createResourceChart(resourceName);
                        }

                        indexPage.appendChild(content);

                        loadChartJsScript(() => {
                            requestAnimationFrame(() => {
                                createResourceChart('Iron');
                                updateEvents('Iron');
                                console.log('Chart created');
                            });
                        });

                        document.body.appendChild(indexPage);
                    }
                },
                { 
                    name: 'Extraction',
                    action: () => {
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                        
                        const extractionPage = document.createElement('div');
                        extractionPage.id = 'extraction-page';
                        extractionPage.style.minHeight = '100vh';
                        extractionPage.style.height = '100%';
                        extractionPage.style.backgroundColor = 'black';
                        extractionPage.style.color = 'white';
                        extractionPage.style.padding = '120px 2rem 2rem 2rem';
                        extractionPage.style.display = 'flex';
                        extractionPage.style.justifyContent = 'center';
                        extractionPage.style.position = 'fixed';
                        extractionPage.style.top = '0';
                        extractionPage.style.left = '0';
                        extractionPage.style.right = '0';
                        extractionPage.style.bottom = '0';
                        extractionPage.style.overflowY = 'scroll';
                
                        const content = document.createElement('div');
                        content.style.maxWidth = '1060px';
                        content.style.width = '100%';
                        
                        const title = document.createElement('h1');
                        title.textContent = "Extraction Operations";
                        title.style.fontSize = '2.5rem';
                        title.style.marginBottom = '2rem';
                        title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        title.style.color = 'white';
                
                        const text = document.createElement('p');
                        text.style.fontSize = '1.25rem';
                        text.style.marginBottom = '2rem';
                        text.style.lineHeight = '1.75';
                        text.style.fontFamily = 'Source Code Pro, sans-serif';
                        text.style.color = 'rgb(209, 213, 219)';
                        text.textContent = "[Placeholder]";
                
                        content.appendChild(title);
                        content.appendChild(text);
                        extractionPage.appendChild(content);
                        document.body.appendChild(extractionPage);
                    }
                }
            ]
        },
        {
            title: 'Travel',
            dropdown: [
                { 
                    name: 'Getaways',
                    action: () => {
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                        
                        const getawaysPage = document.createElement('div');
                        getawaysPage.id = 'getaways-page';
                        getawaysPage.style.minHeight = '100vh';
                        getawaysPage.style.height = '100%';
                        getawaysPage.style.backgroundColor = 'black';
                        getawaysPage.style.color = 'white';
                        getawaysPage.style.padding = '120px 2rem 2rem 2rem';
                        getawaysPage.style.display = 'flex';
                        getawaysPage.style.justifyContent = 'center';
                        getawaysPage.style.position = 'fixed';
                        getawaysPage.style.top = '0';
                        getawaysPage.style.left = '0';
                        getawaysPage.style.right = '0';
                        getawaysPage.style.bottom = '0';
                        getawaysPage.style.overflowY = 'scroll';
                
                        const content = document.createElement('div');
                        content.style.maxWidth = '1060px';
                        content.style.width = '100%';
                        
                        const title = document.createElement('h1');
                        title.textContent = "Luxury Getaways";
                        title.style.fontSize = '2.5rem';
                        title.style.marginBottom = '2rem';
                        title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        title.style.color = 'white';
                
                        const text = document.createElement('p');
                        text.style.fontSize = '1.25rem';
                        text.style.marginBottom = '2rem';
                        text.style.lineHeight = '1.75';
                        text.style.fontFamily = 'Source Code Pro, sans-serif';
                        text.style.color = 'rgb(209, 213, 219)';
                        text.textContent = "[Placeholder]";
                
                        content.appendChild(title);
                        content.appendChild(text);
                        getawaysPage.appendChild(content);
                        document.body.appendChild(getawaysPage);
                    }
                },
                { 
                    name: 'Expeditions',
                    action: () => {
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                        
                        const expeditionsPage = document.createElement('div');
                        expeditionsPage.id = 'expeditions-page';
                        expeditionsPage.style.minHeight = '100vh';
                        expeditionsPage.style.height = '100%';
                        expeditionsPage.style.backgroundColor = 'black';
                        expeditionsPage.style.color = 'white';
                        expeditionsPage.style.padding = '120px 2rem 2rem 2rem';
                        expeditionsPage.style.display = 'flex';
                        expeditionsPage.style.justifyContent = 'center';
                        expeditionsPage.style.position = 'fixed';
                        expeditionsPage.style.top = '0';
                        expeditionsPage.style.left = '0';
                        expeditionsPage.style.right = '0';
                        expeditionsPage.style.bottom = '0';
                        expeditionsPage.style.overflowY = 'scroll';
                
                        const content = document.createElement('div');
                        content.style.maxWidth = '1060px';
                        content.style.width = '100%';
                        
                        const title = document.createElement('h1');
                        title.textContent = "Research Expeditions";
                        title.style.fontSize = '2.5rem';
                        title.style.marginBottom = '2rem';
                        title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        title.style.color = 'white';
                
                        const text = document.createElement('p');
                        text.style.fontSize = '1.25rem';
                        text.style.marginBottom = '2rem';
                        text.style.lineHeight = '1.75';
                        text.style.fontFamily = 'Source Code Pro, sans-serif';
                        text.style.color = 'rgb(209, 213, 219)';
                        text.textContent = "[Placeholder]";
                
                        content.appendChild(title);
                        content.appendChild(text);
                        expeditionsPage.appendChild(content);
                        document.body.appendChild(expeditionsPage);
                    }
                },
                { 
                    name: 'Charters',
                    action: () => {
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                        
                        const chartersPage = document.createElement('div');
                        chartersPage.id = 'charters-page';
                        chartersPage.style.minHeight = '100vh';
                        chartersPage.style.height = '100%';
                        chartersPage.style.backgroundColor = 'black';
                        chartersPage.style.color = 'white';
                        chartersPage.style.padding = '120px 2rem 2rem 2rem';
                        chartersPage.style.display = 'flex';
                        chartersPage.style.justifyContent = 'center';
                        chartersPage.style.position = 'fixed';
                        chartersPage.style.top = '0';
                        chartersPage.style.left = '0';
                        chartersPage.style.right = '0';
                        chartersPage.style.bottom = '0';
                        chartersPage.style.overflowY = 'scroll';
                
                        const content = document.createElement('div');
                        content.style.maxWidth = '1060px';
                        content.style.width = '100%';
                        
                        const title = document.createElement('h1');
                        title.textContent = "Private Charters";
                        title.style.fontSize = '2.5rem';
                        title.style.marginBottom = '2rem';
                        title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        title.style.color = 'white';
                
                        const text = document.createElement('p');
                        text.style.fontSize = '1.25rem';
                        text.style.marginBottom = '2rem';
                        text.style.lineHeight = '1.75';
                        text.style.fontFamily = 'Source Code Pro, sans-serif';
                        text.style.color = 'rgb(209, 213, 219)';
                        text.textContent = "[Placeholder]";
                
                        content.appendChild(title);
                        content.appendChild(text);
                        chartersPage.appendChild(content);
                        document.body.appendChild(chartersPage);
                    }
                }
            ]
        },
        {
            title: 'About',
            action: () => {
                sidebar.classList.remove('active');
                container.style.display = 'none';
        
                const aboutPage = document.createElement('div');
                aboutPage.id = 'about-page';
                aboutPage.style.minHeight = '100vh';
                aboutPage.style.height = '100%';
                aboutPage.style.backgroundColor = 'black';
                aboutPage.style.color = 'white';
                aboutPage.style.padding = '120px 2rem 2rem 2rem';
                aboutPage.style.display = 'flex';
                aboutPage.style.justifyContent = 'center';
                aboutPage.style.position = 'fixed';
                aboutPage.style.top = '0';
                aboutPage.style.left = '0';
                aboutPage.style.right = '0';
                aboutPage.style.bottom = '0';
                aboutPage.style.overflowY = 'scroll';
        
                const content = document.createElement('div');
                content.style.maxWidth = '1060px';
                content.style.width = '100%';
        
                const logo = document.createElement('img');
                logo.src = 'elysium_logo.png';
                logo.style.width = '600px';
                logo.style.height = 'auto';
                logo.style.objectFit = 'contain';
                logo.style.display = 'block';
                logo.style.margin = '0 auto 2rem auto';

                const title = document.createElement('h1');
                title.textContent = "Prosperity Without Limits ™";
                title.style.fontSize = '2.5rem';
                title.style.marginTop = '4rem';
                title.style.marginBottom = '2rem';
                title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                title.style.color = 'white';
                title.style.textAlign = "center";
        
                const missionText = document.createElement('p');
                missionText.style.fontSize = '1.25rem';
                missionText.style.marginBottom = '2rem';
                missionText.style.lineHeight = '1.75';
                missionText.style.fontFamily = 'Source Code Pro, sans-serif';
                missionText.style.color = 'rgb(209, 213, 219)';
                missionText.style.whiteSpace = 'pre-wrap'
                missionText.textContent = "     As the galaxy's premiere prospecting and colonization agency, \
The Elysium Initiative is relentlessly committed to fueling humanity's golden age. Through long-distance \
planetary assessment, efficient extraction, and material reclamation, we ensure that every world is \
utilized to its fullest, delivering unparalleled returns for our stakeholders.\
\n\n     With cutting-edge automation, quantum-powered logistics, and interstellar expansion strategies, \
we transform planets into profit centers. Our mission is not just to create sustainable growth, but to \
blaze a new path for those who dare to dream beyond Earth's constraints. As pioneers of the post-\
terrestrial economy, we provide exclusive investment opportunities and luxury retreats for our partners, \
all while spearheading the most ambitious resource development initiative in human history.";
                
                const title2 = document.createElement('h2');
                title2.textContent = "The universe is infinite. We make it valuable.";
                title2.style.fontSize = '1.5rem';
                title2.style.marginTop = '4rem';
                title2.style.marginBottom = '2rem';
                title2.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                title2.style.color = 'white';
                title2.style.textAlign = "center";
                title2.style.paddingBottom = '300px'
        
                content.appendChild(logo);
                content.appendChild(title);
                content.appendChild(missionText);
                content.appendChild(title2);
        
                aboutPage.appendChild(content);
                document.body.appendChild(aboutPage);
            }
        }
    ];

    // menu structure
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        if (!item.isImage){
            menuItem.addEventListener('mouseenter', playHoverSound);
        }
        
        if (item.isImage) {
            const logoImg = document.createElement('img');
            logoImg.src = 'elysium_logomark.png';
            logoImg.style.height = '60px';
            logoImg.style.objectFit = 'contain';
            logoImg.style.marginTop = '0px';
            logoImg.style.marginBottom = '15px';
            menuItem.appendChild(logoImg);
        } else {
            menuItem.textContent = item.title;
            if (item.action && !item.dropdown) {
                menuItem.addEventListener('click', () => {
                    playClickSound();
                    item.action();
                });
            } else if (item.action) {
                menuItem.addEventListener('click', item.action);
            }
        }
    
        if (item.dropdown && item.dropdown.length > 0) {
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown';
    
            item.dropdown.forEach(dropdownItem => {
                const dropdownElement = document.createElement('div');
                dropdownElement.className = 'dropdown-item';
                if (dropdownItem.nestedDropdown) {
                    dropdownElement.classList.add('has-nested-dropdown');
                }
                
                dropdownElement.textContent = dropdownItem.name;
                dropdownElement.style.setProperty('--underline-width', `${dropdownItem.name.length + 1}ch`);
                dropdownElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    playClickSound();
                    if (dropdownItem.action) {
                        // Prevent event from propagating if there's a nested dropdown
                        if (dropdownItem.nestedDropdown) {
                            e.stopPropagation();
                        }
                        dropdownItem.action();
                    }
                });
                dropdownElement.addEventListener('mouseenter', playHoverSound);
                
                // Create nested dropdown if it exists
                if (dropdownItem.nestedDropdown && dropdownItem.nestedDropdown.length > 0) {
                    const nestedDropdown = document.createElement('div');
                    nestedDropdown.className = 'nested-dropdown';
                    
                    dropdownItem.nestedDropdown.forEach(nestedItem => {
                        const nestedElement = document.createElement('div');
                        nestedElement.className = 'nested-dropdown-item';
                        nestedElement.textContent = nestedItem.name;
                        nestedElement.style.setProperty('--underline-width', `${nestedItem.name.length + 1}ch`);
                        
                        nestedElement.addEventListener('click', (e) => {
                            e.stopPropagation();
                            playClickSound();
                            if (nestedItem.action) {
                                nestedItem.action();
                            }
                        });
                        nestedElement.addEventListener('mouseenter', playHoverSound);
                        
                        nestedDropdown.appendChild(nestedElement);
                    });
                    
                    dropdownElement.appendChild(nestedDropdown);
                }
                
                dropdown.appendChild(dropdownElement);
            });
    
            menuItem.appendChild(dropdown);
        }
    
        menuBar.appendChild(menuItem);
    });
    document.body.appendChild(menuBar);

    // planet info and data
    const planetInfo = {
        Sun: {
            description: "Lone star of Sol. Yellow dwarf, Type G2V Main-sequence.",
            stats: {
                "Distance from Earth": "1 AU",
                "Extraction": "Solar",
                "Mass": "1.989 × 10^30 kg",
                "Diameter": "1,392,700 km",
                "Composition": "74% - Hydrogen<br>24% - Helium<br>2% - Other",
                "Surface Temperature": "5,772 K"
            }
        },
        Mercury: {
            description: "Small, metal-core planet. Extreme temperature variation.",
            stats: {
                "Distance from Earth": "0.52-1.48 AU",
                "Valuation": "$4-5 quintillion",
                "Extraction": "Mining automata",
                "Mass": "3.301 × 10^23 kg",
                "Diameter": "4879 km",
                "Composition": "70% - Iron<br>15% - Oxygen<br>6% - Silicon<br>3% - Sulfur<br>2% - Nickel<br>4% - Other",
                "Surface Temperature": "100-700 K"
            }
        },
        Venus: {
            description: "Greenhouse world. Sulfuric acid cloud cover",
            stats: {
                "Distance from Earth": "0.28-1.72 AU",
                "Valuation": "$200-$235 quintillion",
                "Extraction": "Mining automata, atmospheric skimming",
                "Mass": "4.868 x 10^24 kg",
                "Diameter": "21,103 km",
                "Atmospheric Composition": "96.5% - Carbon Dioxide<br>3.5% - Nitrogen<br><0.01% - Other",
                "Planet Composition": "30% - Iron<br>25% - Silicon<br>20% - Oxygen<br>15% - Magnesium<br>4% - Nickel<br>6% - Other",
                "Surface Temperature": "737 K"
            }
        },
        Earth: {
            description: "Former home of the human race. Harvested and abandoned.",
            stats: {
                "Valuation": "N/A",
                "Extraction": "Completed",
                "Mass": "5.972 x 10^24 kg",
                "Diameter": "12,742 km",
                "Atmospheric Composition": "78% - Nitrogen<br>21% - Oxygen<br>0.9% - Argon<br>0.1% - Other",
                "Planet Composition": "35% - Iron<br>30% - Oxygen<br>15% - Silicon<br>13% - Magnesium<br>2.4% - Nickel<br>4.6% - Other",
                "Surface Temperature": "288 K"
            }
        },
        Moon: {
            description: "Earth's only natural satellite. Tidally locked.",
            stats: {
                "Distance from Earth": "384,400 km",
                "Valuation": "$60 quintillion ",
                "Extraction": "Mining automata",
                "Mass": "7.346 x 10^22 kg",
                "Diameter": "3475 km",
                "Composition": "42% - Oxygen<br>19% - Silicon<br>14% - Magnesium<br>13% - Iron<br>8% - Calcium<br>4% - Other",
                "Surface Temperature": "250 K"
            }
        },
        Mars: {
            description: "Cold desert planet. Red, iron-rich surface",
            stats: {
                "Distance from Earth": "0.52-2.52 AU",
                "Valuation": "$2-3 sextillion",
                "Extraction": "Mining automata, atmospheric skimming",
                "Mass": "6.417 x 10^23 kg",
                "Diameter": "6779 km",
                "Atmospheric Composition": "95% - Carbon Dioxide<br>2.7% - Nitrogen<br>1.6% - Argon<br>0.1% - Oxygen<br>0.6% - Other",
                "Planet Composition": "29.5% - Oxygen<br>27% - Iron<br>17% - Silicon<br>16% - Magnesium<br>3% - Sulfur<br>7.5% - Other",
                "Surface Temperature": "210 K"
            }
        },
        Phobos: {
            description: "Larger, inmost of Mars' two moons. Heavily cratered.",
            stats: {
                "Distance from Mars": "6,000 km",
                "Valuation": "$45 trillion",
                "Extraction": "Mining automata",
                "Mass": "1.0659 × 10^16 kg",
                "Diameter": "22.2 km",
                "Composition": "38% - Silicon<br>21% - Iron<br>17% - Magnesium<br>14% - Oxygen<br>5% - Calcium<br>5% - Other",
                "Surface Temperature": "241 K"
            }
        },
        Deimos: {
            description: "Smaller, outer moon of Mars. Relatively smooth surface.",
            stats: {
                "Distance from Mars": "23,460 km",
                "Valuation": "$28 trillion",
                "Extraction": "Mining automata",
                "Mass": "1.4762 × 10^15 kg",
                "Diameter": "12.4 km",
                "Composition": "40% - Silicon<br>18% - Iron<br>16% - Magnesium<br>15% - Oxygen<br>5% - Sulfur<br>6% - Other",
                "Surface Temperature": "233 K"
            }
        },
        Jupiter: {
            description: "Massive gas giant. Raging, turbulent atmosphere.",
            stats: {
                "Distance from Earth": "4.20-6.22 AU",
                "Valuation": "$1-2 octillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "1.898 x 10^27 kg",
                "Diameter": "139,820 km",
                "Composition": "89% - Hydrogen<br>10% - Helium<br>1% - Other",
                "Surface Temperature": "134 K"
            }
        },
        Ganymede: {
            description: "Largest moon in the solar system. Subsurface ocean.",
            stats: {
                "Distance from Jupiter": "1,070,000 km",
                "Valuation": "$40–50 quintillion",
                "Extraction": "Mining automata",
                "Mass": "1.4819 × 10^23 kg",
                "Diameter": "5262 km",
                "Composition": "40% - Water Ice<br>20% - Oxygen<br>15% - Silicon<br>10% - Magnesium<br>10% - Iron<br>5% - Other",
                "Surface Temperature": "110 K"
            }
        },
        Io: {
            description: "Volcanically active and geologically dynamic.",
            stats: {
                "Distance from Jupiter": "421,700 km",
                "Valuation": "$35–45 quintillion",
                "Extraction": "Mining automata",
                "Mass": "8.9319 × 10^22 kg",
                "Diameter": "3643 km",
                "Composition": "35% - Sulfur Compounds<br>30% - Silicate Rock<br>15% - Oxygen<br>10% - Iron<br>10% - Other",
                "Surface Temperature": "130 K"
            }
        },
        Europa: {
            description: "Extremely smooth, icy moon. Subsurface ocean.",
            stats: {
                "Distance from Jupiter": "670,900 km",
                "Valuation": "$30–40 quintillion",
                "Extraction": "Mining automata",
                "Mass": "4.7998 × 10^22 kg",
                "Diameter": "3122 km",
                "Composition": "55% - Water Ice<br>20% - Silicate Rock<br>10% - Oxygen<br>5% - Magnesium<br>10% - Other",
                "Surface Temperature": "102 K"
            }
        },
        Callisto: {
            description: "Heavily cratered. One of the oldest surfaces in the system.",
            stats: {
                "Distance from Jupiter": "1,882,700 km",
                "Valuation": "$25–35 quintillion",
                "Extraction": "Mining automata",
                "Mass": "1.0759 × 10^23 kg",
                "Diameter": "4820 km",
                "Composition": "45% - Water Ice<br>25% - Silicate Rock<br>10% - Oxygen<br>10% - Magnesium<br>5% - Iron<br>5% - Other",
                "Surface Temperature": "133 K"
            }
        },    
        Saturn: {
            description: "Second-largest gas giant. Rings of ice and rock.",
            stats: {
                "Distance from Earth": "8.58-10.62 AU",
                "Valuation": "$300-600 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "5.683 x 10^26 kg",
                "Diameter": "116,500 km",
                "Composition": "94% - Hydrogen<br>5% - Helium<br>1% - Other",
                "Surface Temperature": "134 K"
            }
        },
        Titan: {
            description: "Largest moon of Saturn with a thick, hazy atmosphere and liquid hydrocarbon lakes.",
            stats: {
                "Distance from Saturn": "1,222,000 km",
                "Valuation": "$150 quintillion",
                "Extraction": "Potential ice and organic mining",
                "Mass": "1.3452 × 10^23 kg",
                "Diameter": "5150 km",
                "Composition": "65% - Oxygen<br>6% - Hydrogen<br>9.5% - Silicon<br>7% - Magnesium<br>6.5% - Iron<br>4% - Calcium<br>2% - Other",
                "Surface Temperature": "94 K"
            }
        },
        Rhea: {
            description: "An icy, heavily cratered moon with a rugged surface.",
            stats: {
                "Distance from Saturn": "527,000 km",
                "Valuation": "$20 quintillion",
                "Extraction": "Mining automata",
                "Mass": "2.306 × 10^21 kg",
                "Diameter": "1528 km",
                "Composition": "79% - Oxygen<br>9% - Hydrogen<br>4% - Silicon<br>3% - Magnesium<br>3% - Iron<br>2% - Calcium<br>1% - Other",
                "Surface Temperature": "107 K"
            }
        },
        Iapetus: {
            description: "A uniquely two-toned moon known for its dark and bright hemispheres.",
            stats: {
                "Distance from Saturn": "3,560,000 km",
                "Valuation": "$15 quintillion",
                "Extraction": "Mining automata",
                "Mass": "1.805 × 10^21 kg",
                "Diameter": "1469 km",
                "Composition": "84% - Oxygen<br>10% - Hydrogen<br>2% - Silicon<br>1% - Magnesium<br>1% - Iron<br>1% - Calcium<br>1% - Other",
                "Surface Temperature": "130 K"
            }
        },
        Dione: {
            description: "An icy moon with a mix of heavily cratered regions and smoother plains.",
            stats: {
                "Distance from Saturn": "377,000 km",
                "Valuation": "$10 quintillion",
                "Extraction": "Mining automata",
                "Mass": "1.095 × 10^21 kg",
                "Diameter": "1122 km",
                "Composition": "70% - Oxygen<br>7% - Hydrogen<br>8% - Silicon<br>6% - Magnesium<br>5% - Iron<br>3% - Calcium<br>2% - Other",
                "Surface Temperature": "102 K"
            }
        },
        Enceladus: {
            description: "A small, reflective moon famous for its water-ice geysers and subsurface ocean.",
            stats: {
                "Distance from Saturn": "238,000 km",
                "Valuation": "$8 quintillion",
                "Extraction": "Mining automata, water extraction",
                "Mass": "1.08 × 10^20 kg",
                "Diameter": "504 km",
                "Composition": "75% - Oxygen<br>8% - Hydrogen<br>6% - Silicon<br>4% - Magnesium<br>4% - Iron<br>2% - Calcium<br>1% - Other",
                "Surface Temperature": "75 K"
            }
        },
        Mimas: {
            description: "A small, cratered moon often compared to the Death Star due to its giant impact crater.",
            stats: {
                "Distance from Saturn": "185,000 km",
                "Valuation": "$5 quintillion",
                "Extraction": "Mining automata",
                "Mass": "3.749 × 10^19 kg",
                "Diameter": "396 km",
                "Composition": "82% - Oxygen<br>9% - Hydrogen<br>3% - Silicon<br>2% - Magnesium<br>2% - Iron<br>1% - Calcium<br>1% - Other",
                "Surface Temperature": "70 K"
            }
        }, 
        Uranus: {
            description: "Icy blue, with faint rings. Dramatically tilted axis.",
            stats: {
                "Distance from Earth": "18.36-20.06 AU",
                "Valuation": "$600-900 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "8.681 x 10^25 kg",
                "Diameter": "50,724 km",
                "Composition": "83% - Hydrogen<br>15% - Helium<br>1% - Oxygen<br>1% - Other",
                "Surface Temperature": "76 K"
            }
        },
        Neptune: {
            description: "Deep blue, frigid atmosphere. Supersonic winds.",
            stats: {
                "Distance from Earth": "28.80-30.07 AU",
                "Valuation": "$500-600 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "1.024 x 10^26 kg",
                "Diameter": "49,244 km",
                "Composition": "80% - Hydrogen<br>19% - Helium<br>1% - Other",
                "Surface Temperature": "72 K"
            }
        },
        Pluto: {
            description: "Distant dwarf planet. Nitrogen ice.",
            stats: {
                "Distance from Earth": "29.65-49.30 AU",
                "Valuation": "$70-80 quintillion",
                "Extraction": "Mining automata",
                "Mass": "1.309 x 10^22 kg",
                "Diameter": "2376 km",
                "Composition": "50% - Nitrogen<br>30% - Oxygen<br>10% - Carbon<br>3% - Hydrogen<br>2% - Silicon<br>5% - Other",
                "Surface Temperature": "44 K"
            }
        }
    };

    // create sidebar element
    const sidebar = document.createElement('div');
    sidebar.className = 'info-sidebar';
    document.body.appendChild(sidebar);

    // function to show planet info
    function showPlanetInfo(planetName) {
        const info = planetInfo[planetName];
        if (!info) return;

        const economicSymbols = {
            'Sun': '3',
            'Mercury': '1',
            'Venus': '2',
            'Earth': '0',
            'Moon': '1',
            'Mars': '2',
            'Deimos': '1',
            'Phobos': '1',
            'Jupiter': '3',
            'Europa': '1',
            'Ganymede': '1',
            'Io': '1',
            'Callisto': '1',
            'Saturn': '2',
            'Titan': '1',
            'Rhea': '1',
            'Iapetus': '1',
            'Dione': '1',
            'Enceladus': '1',
            'Mimas': '1',
            'Uranus': '2',
            'Neptune': '2',
            'Pluto': '1'
        };

        const dollarCount = parseInt(economicSymbols[planetName]) || 0;
        const whiteDollars = '$'.repeat(dollarCount);
        const grayDollars = '$'.repeat(3 - dollarCount);

        sidebar.innerHTML = `
            <div class="sidebar-content">
                <button class="sidebar-close">&times;</button>
                <h2 class="sidebar-header">
                    ${planetName}
                    <div style="font-family: Source Code Pro; font-size: 60px; margin-top: 5px;">
                        <span style="color: rgb(255, 255, 255);">${whiteDollars}</span><span style="color: rgb(95, 95, 95);">${grayDollars}</span>
                    </div>
                </h2>
                <p class="planet-description">${info.description}</p>
                ${Object.entries(info.stats).map(([label, value]) => `
                    <div class="planet-stat">
                        <div class="stat-label">${label}</div>
                        <div class="stat-value">${value}</div>
                    </div>
                `).join('')}
            </div>
        `;

        const closeButton = sidebar.querySelector('.sidebar-close');
        closeButton.addEventListener('click', () => {
            const closeSound = new Audio('close.mp3');
            closeSound.volume = 0.4;
            closeSound.play();
            sidebar.classList.remove('active');
        });

        sidebar.classList.add('active');
    }

    // celestial scale constants
    const KM_TO_PIXELS = 1/1000;

    // zeroes added in some places to resize for smoothing
    // (planet scales are not all accurate)
    const SUN_DIAMETER = 1392000;
    const MERCURY_DIAMETER = 48780; // added a zero
    const VENUS_DIAMETER = 121040; // added a zero
    const EARTH_DIAMETER = 127420; // added a zero
    const MOON_DIAMETER = 34740; // added a zero
    const MARS_DIAMETER = 67790; // added a zero
    const PHOBOS_DIAMETER = 2200; // added two zeroes
    const DEIMOS_DIAMETER = 1200; // added two zeroes
    const JUPITER_DIAMETER = 1429840; // added a zero
    const GANYMEDE_DIAMETER = 52620; // added a zero
    const IO_DIAMETER = 36430; // added a zero
    const EUROPA_DIAMETER = 31220*3; // added a zero and times 3
    const CALLISTO_DIAMETER = 48200; // added a zero
    const SATURN_DIAMETER = 1205360; // added a zero
    const TITAN_DIAMETER = 51500*2; // added a zero and times 2
    const RHEA_DIAMETER = 152800; // added two zeros
    const IAPETUS_DIAMETER = 146900; // added two zeros
    const DIONE_DIAMETER = 112200; // added two zeros
    const ENCELADUS_DIAMETER = 50400; // added two zeros
    const MIMAS_DIAMETER = 39600; // added two zeros
    const URANUS_DIAMETER = 511180; // added a zero
    const NEPTUNE_DIAMETER = 492440; // added a zero
    const PLUTO_DIAMETER = 2377000; // added three zeroes
    const SUN_SIZE_PX = SUN_DIAMETER * KM_TO_PIXELS;
    const MERCURY_SIZE_PX = MERCURY_DIAMETER * KM_TO_PIXELS;
    const VENUS_SIZE_PX = VENUS_DIAMETER * KM_TO_PIXELS;
    const EARTH_SIZE_PX = EARTH_DIAMETER * KM_TO_PIXELS;
    const MOON_SIZE_PX = MOON_DIAMETER * KM_TO_PIXELS;
    const MARS_SIZE_PX = MARS_DIAMETER * KM_TO_PIXELS;
    const PHOBOS_SIZE_PX = PHOBOS_DIAMETER * KM_TO_PIXELS;
    const DEIMOS_SIZE_PX = DEIMOS_DIAMETER * KM_TO_PIXELS;
    const JUPITER_SIZE_PX = JUPITER_DIAMETER * KM_TO_PIXELS;
    const GANYMEDE_SIZE_PX = GANYMEDE_DIAMETER * KM_TO_PIXELS;
    const IO_SIZE_PX = IO_DIAMETER * KM_TO_PIXELS;
    const EUROPA_SIZE_PX = EUROPA_DIAMETER * KM_TO_PIXELS;
    const CALLISTO_SIZE_PX = CALLISTO_DIAMETER * KM_TO_PIXELS;
    const SATURN_SIZE_PX = SATURN_DIAMETER * KM_TO_PIXELS;
    const TITAN_SIZE_PX = TITAN_DIAMETER * KM_TO_PIXELS;
    const RHEA_SIZE_PX = RHEA_DIAMETER * KM_TO_PIXELS;
    const IAPETUS_SIZE_PX = IAPETUS_DIAMETER * KM_TO_PIXELS;
    const DIONE_SIZE_PX = DIONE_DIAMETER * KM_TO_PIXELS;
    const ENCELADUS_SIZE_PX = ENCELADUS_DIAMETER * KM_TO_PIXELS;
    const MIMAS_SIZE_PX = MIMAS_DIAMETER * KM_TO_PIXELS;
    const URANUS_SIZE_PX = URANUS_DIAMETER * KM_TO_PIXELS;
    const NEPTUNE_SIZE_PX = NEPTUNE_DIAMETER * KM_TO_PIXELS;
    const PLUTO_SIZE_PX = PLUTO_DIAMETER * KM_TO_PIXELS;

    const MERCURY_SUN_DISTANCE = 57900000;
    const VENUS_SUN_DISTANCE = 108000000;
    const EARTH_SUN_DISTANCE = 147600000;
    const EARTH_MOON_DISTANCE = 3844000; // added a zero
    const MARS_SUN_DISTANCE = 229000000;
    const MARS_PHOBOS_DISTANCE = 60000; // added a zero
    const MARS_DEIMOS_DISTANCE = 234630; // added a zero
    const JUPITER_SUN_DISTANCE = 778000000;
    const JUPITER_GANYMEDE_DISTANCE = 10700000; // added a zero
    const JUPITER_IO_DISTANCE = 4217000; // added a zero
    const JUPITER_EUROPA_DISTANCE = 6709000; // added a zero
    const JUPITER_CALLISTO_DISTANCE = 18827000; // added a zero
    const SATURN_SUN_DISTANCE = 1427000000;
    const SATURN_TITAN_DISTANCE = 12220000; // added a zero
    const SATURN_RHEA_DISTANCE = 5270000; // added a zero
    const SATURN_IAPETUS_DISTANCE = 35600000; // added a zero
    const SATURN_DIONE_DISTANCE = 3770000; // added a zero
    const SATURN_ENCELADUS_DISTANCE = 2380000; // added a zero
    const SATURN_MIMAS_DISTANCE = 1850000; // added a zero
    const URANUS_SUN_DISTANCE = 2871000000;
    const NEPTUNE_SUN_DISTANCE = 4497000000;
    const PLUTO_SUN_DISTANCE = 5913000000;
    const MERCURY_DISTANCE_PX = MERCURY_SUN_DISTANCE * KM_TO_PIXELS;
    const VENUS_DISTANCE_PX = VENUS_SUN_DISTANCE * KM_TO_PIXELS;
    const EARTH_DISTANCE_PX = EARTH_SUN_DISTANCE * KM_TO_PIXELS;
    const MOON_DISTANCE_PX = EARTH_MOON_DISTANCE * KM_TO_PIXELS;
    const MARS_DISTANCE_PX = MARS_SUN_DISTANCE * KM_TO_PIXELS;
    const PHOBOS_DISTANCE_PX = MARS_PHOBOS_DISTANCE * KM_TO_PIXELS;
    const DEIMOS_DISTANCE_PX = MARS_DEIMOS_DISTANCE * KM_TO_PIXELS;
    const JUPITER_DISTANCE_PX = JUPITER_SUN_DISTANCE * KM_TO_PIXELS;
    const GANYMEDE_DISTANCE_PX = JUPITER_GANYMEDE_DISTANCE * KM_TO_PIXELS;
    const IO_DISTANCE_PX = JUPITER_IO_DISTANCE * KM_TO_PIXELS;
    const EUROPA_DISTANCE_PX = JUPITER_EUROPA_DISTANCE * KM_TO_PIXELS;
    const CALLISTO_DISTANCE_PX = JUPITER_CALLISTO_DISTANCE * KM_TO_PIXELS;
    const SATURN_DISTANCE_PX = SATURN_SUN_DISTANCE * KM_TO_PIXELS;
    const TITAN_DISTANCE_PX = SATURN_TITAN_DISTANCE * KM_TO_PIXELS;
    const RHEA_DISTANCE_PX = SATURN_RHEA_DISTANCE * KM_TO_PIXELS;
    const IAPETUS_DISTANCE_PX = SATURN_IAPETUS_DISTANCE * KM_TO_PIXELS;
    const DIONE_DISTANCE_PX = SATURN_DIONE_DISTANCE * KM_TO_PIXELS;
    const ENCELADUS_DISTANCE_PX = SATURN_ENCELADUS_DISTANCE * KM_TO_PIXELS;
    const MIMAS_DISTANCE_PX = SATURN_MIMAS_DISTANCE * KM_TO_PIXELS;
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
    
    // phobos
    const phobosImage = addInteractiveObject('phobos.png', {
        maxWidth: `${PHOBOS_SIZE_PX}px`,
        maxHeight: `${PHOBOS_SIZE_PX}px`
        });
        const phobosDegrees = marsDegrees + 45;
        const phobosX = marsX + (PHOBOS_DISTANCE_PX * Math.cos(phobosDegrees * Math.PI / 180));
        const phobosY = marsY + (PHOBOS_DISTANCE_PX * Math.sin(phobosDegrees * Math.PI / 180));
        phobosImage.style.transform = `
        translate(${phobosX}px, ${phobosY}px)
        rotate(${phobosDegrees}deg)
        rotateZ(0deg)`;

    // deimos
    const deimosImage = addInteractiveObject('deimos.png', {
        maxWidth: `${DEIMOS_SIZE_PX}px`,
        maxHeight: `${DEIMOS_SIZE_PX}px`
        });
        const deimosDegrees = marsDegrees + 135;
        const deimosX = marsX + (DEIMOS_DISTANCE_PX * Math.cos(deimosDegrees * Math.PI / 180));
        const deimosY = marsY + (DEIMOS_DISTANCE_PX * Math.sin(deimosDegrees * Math.PI / 180));
        deimosImage.style.transform = `
            translate(${deimosX}px, ${deimosY}px)
            rotate(${deimosDegrees}deg)
            rotateZ(180deg)`;

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

    // ganymede
    const ganymedeDegrees = 30; // arbitrary angle
    const ganymedeX = jupiterX + (GANYMEDE_DISTANCE_PX * Math.cos(ganymedeDegrees * Math.PI / 180));
    const ganymedeY = jupiterY + (GANYMEDE_DISTANCE_PX * Math.sin(ganymedeDegrees * Math.PI / 180));
    const ganymedeImage = addInteractiveObject('ganymede.png', {
        maxWidth: `${GANYMEDE_SIZE_PX}px`,
        maxHeight: `${GANYMEDE_SIZE_PX}px`
    });
    ganymedeImage.style.transform = `
        translate(${ganymedeX}px, ${ganymedeY}px)
        rotate(${ganymedeDegrees}deg)
        rotateZ(50deg)`;

    // io
    const ioDegrees = 90;
    const ioX = jupiterX + (IO_DISTANCE_PX * Math.cos(ioDegrees * Math.PI / 180));
    const ioY = jupiterY + (IO_DISTANCE_PX * Math.sin(ioDegrees * Math.PI / 180));
    const ioImage = addInteractiveObject('io.png', {
        maxWidth: `${IO_SIZE_PX}px`,
        maxHeight: `${IO_SIZE_PX}px`
    });
    ioImage.style.transform = `
        translate(${ioX}px, ${ioY}px)
        rotate(${ioDegrees}deg)
        rotateZ(0deg)`;

    // europa
    const europaDegrees = 150;
    const europaX = jupiterX + (EUROPA_DISTANCE_PX * Math.cos(europaDegrees * Math.PI / 180));
    const europaY = jupiterY + (EUROPA_DISTANCE_PX * Math.sin(europaDegrees * Math.PI / 180));
    const europaImage = addInteractiveObject('europa.png', {
        maxWidth: `${EUROPA_SIZE_PX}px`,
        maxHeight: `${EUROPA_SIZE_PX}px`
    });
    europaImage.style.transform = `
        translate(${europaX}px, ${europaY}px)
        rotate(${europaDegrees}deg)
        rotateZ(-65deg)`;

    // callisto
    const callistoDegrees = 210;
    const callistoX = jupiterX + (CALLISTO_DISTANCE_PX * Math.cos(callistoDegrees * Math.PI / 180));
    const callistoY = jupiterY + (CALLISTO_DISTANCE_PX * Math.sin(callistoDegrees * Math.PI / 180));
    const callistoImage = addInteractiveObject('callisto.png', {
        maxWidth: `${CALLISTO_SIZE_PX}px`,
        maxHeight: `${CALLISTO_SIZE_PX}px`
    });
    callistoImage.style.transform = `
        translate(${callistoX}px, ${callistoY}px)
        rotate(${callistoDegrees}deg)
        rotateZ(-120deg)`;

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
    
    // titan
    const titanDegrees = 45;
    const titanX = saturnX + (TITAN_DISTANCE_PX * Math.cos(titanDegrees * Math.PI / 180));
    const titanY = saturnY + (TITAN_DISTANCE_PX * Math.sin(titanDegrees * Math.PI / 180));
    const titanImage = addInteractiveObject('titan.png', {
        maxWidth: `${TITAN_SIZE_PX}px`,
        maxHeight: `${TITAN_SIZE_PX}px`
    });
    titanImage.style.transform = `
        translate(${titanX}px, ${titanY}px)
        rotate(${titanDegrees}deg)
        rotateZ(-45deg)`;

    // rhea
    const rheaDegrees = 90;
    const rheaX = saturnX + (RHEA_DISTANCE_PX * Math.cos(rheaDegrees * Math.PI / 180));
    const rheaY = saturnY + (RHEA_DISTANCE_PX * Math.sin(rheaDegrees * Math.PI / 180));
    const rheaImage = addInteractiveObject('rhea.png', {
        maxWidth: `${RHEA_SIZE_PX}px`,
        maxHeight: `${RHEA_SIZE_PX}px`
    });
    rheaImage.style.transform = `
        translate(${rheaX}px, ${rheaY}px)
        rotate(${rheaDegrees}deg)
        rotateZ(-90deg)`;

    // iapetus
    const iapetusDegrees = 135;
    const iapetusX = saturnX + (IAPETUS_DISTANCE_PX * Math.cos(iapetusDegrees * Math.PI / 180));
    const iapetusY = saturnY + (IAPETUS_DISTANCE_PX * Math.sin(iapetusDegrees * Math.PI / 180));
    const iapetusImage = addInteractiveObject('iapetus.png', {
        maxWidth: `${IAPETUS_SIZE_PX}px`,
        maxHeight: `${IAPETUS_SIZE_PX}px`
    });
    iapetusImage.style.transform = `
        translate(${iapetusX}px, ${iapetusY}px)
        rotate(${iapetusDegrees}deg)
        rotateZ(-135deg)`;

    // dione
    const dioneDegrees = 180;
    const dioneX = saturnX + (DIONE_DISTANCE_PX * Math.cos(dioneDegrees * Math.PI / 180));
    const dioneY = saturnY + (DIONE_DISTANCE_PX * Math.sin(dioneDegrees * Math.PI / 180));
    const dioneImage = addInteractiveObject('dione.png', {
        maxWidth: `${DIONE_SIZE_PX}px`,
        maxHeight: `${DIONE_SIZE_PX}px`
    });
    dioneImage.style.transform = `
        translate(${dioneX}px, ${dioneY}px)
        rotate(${dioneDegrees}deg)
        rotateZ(180deg)`;

    // enceladus
    const enceladusDegrees = 225;
    const enceladusX = saturnX + (ENCELADUS_DISTANCE_PX * Math.cos(enceladusDegrees * Math.PI / 180));
    const enceladusY = saturnY + (ENCELADUS_DISTANCE_PX * Math.sin(enceladusDegrees * Math.PI / 180));
    const enceladusImage = addInteractiveObject('enceladus.png', {
        maxWidth: `${ENCELADUS_SIZE_PX}px`,
        maxHeight: `${ENCELADUS_SIZE_PX}px`
    });
    enceladusImage.style.transform = `
        translate(${enceladusX}px, ${enceladusY}px)
        rotate(${enceladusDegrees}deg)
        rotateZ(-225deg)`;

    // mimas
    const mimasDegrees = 270;
    const mimasX = saturnX + (MIMAS_DISTANCE_PX * Math.cos(mimasDegrees * Math.PI / 180));
    const mimasY = saturnY + (MIMAS_DISTANCE_PX * Math.sin(mimasDegrees * Math.PI / 180));
    const mimasImage = addInteractiveObject('mimas.png', {
        maxWidth: `${MIMAS_SIZE_PX}px`,
        maxHeight: `${MIMAS_SIZE_PX}px`
    });
    mimasImage.style.transform = `
        translate(${mimasX}px, ${mimasY}px)
        rotate(${mimasDegrees}deg)
        rotateZ(90deg)`;

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

    // configure planet labels
    function configurePlanetLabel(label, planetName) {
        label.style.cursor = 'pointer';
        label.addEventListener('click', (e) => {
            // can't click label if opacity = 0
            if (parseFloat(label.style.opacity) <= 0) {
                e.stopPropagation();
                return;
            }
            e.stopPropagation();
            let navigationItem = null;
            navigationItem = menuItems[1].dropdown.find(item => item.name === planetName);
            if (!navigationItem) {
                for (const item of menuItems[1].dropdown) {
                    if (item.nestedDropdown) {
                        const nestedItem = item.nestedDropdown.find(nested => nested.name === planetName);
                        if (nestedItem) {
                            navigationItem = nestedItem;
                            break;
                        }
                    }
                }
            }
            
            if (navigationItem && navigationItem.action) {
                navigationItem.action();
            }
            showPlanetInfo(planetName);
            playClickSound();
        });
        return label;
    }

    // planet labels
    const sunLabel = configurePlanetLabel(createPlanetLabel('Sun', 0, 0), 'Sun');
    const mercuryLabel = configurePlanetLabel(createPlanetLabel('Mercury', mercuryX, mercuryY), 'Mercury');
    const venusLabel = configurePlanetLabel(createPlanetLabel('Venus', venusX, venusY), 'Venus');
    const earthLabel = configurePlanetLabel(createPlanetLabel('Earth', earthX, earthY), 'Earth');
    const moonLabel = configurePlanetLabel(createPlanetLabel('Moon', moonX, moonY), 'Moon');
    const marsLabel = configurePlanetLabel(createPlanetLabel('Mars', marsX, marsY), 'Mars');
    const phobosLabel = configurePlanetLabel(createPlanetLabel('Phobos', phobosX, phobosY), 'Phobos');
    const deimosLabel = configurePlanetLabel(createPlanetLabel('Deimos', deimosX, deimosY), 'Deimos');
    const jupiterLabel = configurePlanetLabel(createPlanetLabel('Jupiter', jupiterX, jupiterY), 'Jupiter');
    const ganymedeLabel = configurePlanetLabel(createPlanetLabel('Ganymede', ganymedeX, ganymedeY), 'Ganymede');
    const ioLabel = configurePlanetLabel(createPlanetLabel('Io', ioX, ioY), 'Io');
    const europaLabel = configurePlanetLabel(createPlanetLabel('Europa', europaX, europaY), 'Europa');
    const callistoLabel = configurePlanetLabel(createPlanetLabel('Callisto', callistoX, callistoY), 'Callisto');
    const saturnLabel = configurePlanetLabel(createPlanetLabel('Saturn', saturnX, saturnY), 'Saturn');
    const titanLabel = configurePlanetLabel(createPlanetLabel('Titan', titanX, titanY), 'Titan');
    const rheaLabel = configurePlanetLabel(createPlanetLabel('Rhea', rheaX, rheaY), 'Rhea');
    const iapetusLabel = configurePlanetLabel(createPlanetLabel('Iapetus', iapetusX, iapetusY), 'Iapetus');
    const dioneLabel = configurePlanetLabel(createPlanetLabel('Dione', dioneX, dioneY), 'Dione');
    const enceladusLabel = configurePlanetLabel(createPlanetLabel('Enceladus', enceladusX, enceladusY), 'Enceladus');
    const mimasLabel = configurePlanetLabel(createPlanetLabel('Mimas', mimasX, mimasY), 'Mimas');
    const uranusLabel = configurePlanetLabel(createPlanetLabel('Uranus', uranusX, uranusY), 'Uranus');
    const neptuneLabel = configurePlanetLabel(createPlanetLabel('Neptune', neptuneX, neptuneY), 'Neptune');
    const plutoLabel = configurePlanetLabel(createPlanetLabel('Pluto', plutoX, plutoY), 'Pluto');

    objectsContainer.appendChild(sunLabel);
    objectsContainer.appendChild(mercuryLabel);
    objectsContainer.appendChild(venusLabel);
    objectsContainer.appendChild(moonLabel);
    objectsContainer.appendChild(earthLabel);
    objectsContainer.appendChild(phobosLabel); // moons here are ordered before their
    objectsContainer.appendChild(deimosLabel); // planets for label overlap reasons
    objectsContainer.appendChild(marsLabel);
    objectsContainer.appendChild(ganymedeLabel);
    objectsContainer.appendChild(ioLabel);
    objectsContainer.appendChild(europaLabel);
    objectsContainer.appendChild(callistoLabel);
    objectsContainer.appendChild(jupiterLabel);
    objectsContainer.appendChild(titanLabel);
    objectsContainer.appendChild(rheaLabel);
    objectsContainer.appendChild(iapetusLabel);
    objectsContainer.appendChild(dioneLabel);
    objectsContainer.appendChild(enceladusLabel);
    objectsContainer.appendChild(mimasLabel);
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
    function createOrbitCircle(radius, color = 'rgba(255, 255, 255, 0.5)') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', state.planetOrbitWidth);
        circle.style.transition = 'opacity 0.3s ease';
        return circle;
    }

    // planet orbits
    const mercuryOrbit = createOrbitCircle(MERCURY_DISTANCE_PX, 'rgba(255, 140, 86, 0.5)');
    mercuryOrbit.dataset.planetName = 'Mercury';
    const venusOrbit = createOrbitCircle(VENUS_DISTANCE_PX, 'rgba(255, 217, 0, 0.5)');
    venusOrbit.dataset.planetName = 'Venus';
    const earthOrbit = createOrbitCircle(EARTH_DISTANCE_PX, 'rgba(0, 255, 55, 0.5)');
    earthOrbit.dataset.planetName = 'Earth';
    const marsOrbit = createOrbitCircle(MARS_DISTANCE_PX, 'rgba(255, 72, 0, 0.5)');
    marsOrbit.dataset.planetName = 'Mars';
    const jupiterOrbit = createOrbitCircle(JUPITER_DISTANCE_PX, 'rgba(255, 166, 0, 0.5)');
    jupiterOrbit.dataset.planetName = 'Jupiter';
    const saturnOrbit = createOrbitCircle(SATURN_DISTANCE_PX, 'rgba(255, 230, 0, 0.5)');
    saturnOrbit.dataset.planetName = 'Saturn';
    const uranusOrbit = createOrbitCircle(URANUS_DISTANCE_PX, 'rgba(0, 225, 255, 0.5)');
    uranusOrbit.dataset.planetName = 'Uranus';
    const neptuneOrbit = createOrbitCircle(NEPTUNE_DISTANCE_PX, 'rgba(0, 89, 255, 0.5)');
    neptuneOrbit.dataset.planetName = 'Neptune';
    const plutoOrbit = createOrbitCircle(PLUTO_DISTANCE_PX, 'rgba(138, 87, 255, 0.5)');
    plutoOrbit.dataset.planetName = 'Pluto';

    orbitsSvg.appendChild(mercuryOrbit);
    orbitsSvg.appendChild(venusOrbit);
    orbitsSvg.appendChild(earthOrbit);
    orbitsSvg.appendChild(marsOrbit);
    orbitsSvg.appendChild(jupiterOrbit);
    orbitsSvg.appendChild(saturnOrbit);
    orbitsSvg.appendChild(uranusOrbit);
    orbitsSvg.appendChild(neptuneOrbit);
    orbitsSvg.appendChild(plutoOrbit);

    // moon orbits
    const moons = [
        {   name: 'Moon',
            parent: 'Earth',
            parentX: earthX,
            parentY: earthY,
            distance: MOON_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'},
        {   name: 'Phobos',
            parent: 'Mars',
            parentX: marsX,
            parentY: marsY,
            distance: PHOBOS_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'},
        {   name: 'Deimos',
            parent: 'Mars',
            parentX: marsX,
            parentY: marsY,
            distance: DEIMOS_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'},
        {   name: 'Ganymede',
            parent: 'Jupiter',
            parentX: jupiterX,
            parentY: jupiterY,
            distance: GANYMEDE_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Io',
            parent: 'Jupiter',
            parentX: jupiterX,
            parentY: jupiterY,
            distance: IO_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Europa',
            parent: 'Jupiter',
            parentX: jupiterX,
            parentY: jupiterY,
            distance: EUROPA_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Callisto',
            parent: 'Jupiter',
            parentX: jupiterX,
            parentY: jupiterY,
            distance: CALLISTO_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Titan',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: TITAN_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Rhea',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: RHEA_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Iapetus',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: IAPETUS_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Dione',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: DIONE_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Enceladus',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: ENCELADUS_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
        {   name: 'Mimas',
            parent: 'Saturn',
            parentX: saturnX,
            parentY: saturnY,
            distance: MIMAS_DISTANCE_PX,
            orbitColor: 'rgba(200, 200, 200, 0.8)'
        },
    ];

    function createMoonOrbits() {
        moons.forEach(moon => {
          const moonOrbit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          moonOrbit.setAttribute('cx', '50%');
          moonOrbit.setAttribute('cy', '50%');
          moonOrbit.setAttribute('r', moon.distance);
          moonOrbit.setAttribute('fill', 'none');
          moonOrbit.setAttribute('stroke', moon.orbitColor);
          moonOrbit.setAttribute('stroke-width', '1');
          moonOrbit.style.transition = 'opacity 0.3s ease';
          moonOrbit.dataset.moonName = moon.name;
          moonOrbit.dataset.parentName = moon.parent;
          moonOrbit.classList.add('moon-orbit');
          moonOrbit.style.transform = `translate(${moon.parentX}px, ${moon.parentY}px)`;
          orbitsSvg.appendChild(moonOrbit);
        });
    }
      createMoonOrbits();

    // click handlers for planets
    [
        { element: sunImage, name: 'Sun' },
        { element: mercuryImage, name: 'Mercury' },
        { element: venusImage, name: 'Venus' },
        { element: earthImage, name: 'Earth' },
        { element: marsImage, name: 'Mars' },
        { element: jupiterImage, name: 'Jupiter' },
        { element: saturnImage, name: 'Saturn' },
        { element: uranusImage, name: 'Neptune' },
        { element: neptuneImage, name: 'Neptune' },
        { element: plutoImage, name: 'Pluto' }
    ].forEach(planet => {
        planet.element.style.cursor = 'pointer';
        planet.element.addEventListener('click', (e) => {
            e.stopPropagation();
            const navigationItem = menuItems[1].dropdown.find(item => item.name === planet.name);
            if (navigationItem && navigationItem.action) {
                navigationItem.action();
            }
            showPlanetInfo(planet.name);
            playClickSound();
        });
    });

    // click handlers for moons
    [
        { element: moonImage, name: 'Moon', parent: 'Earth' },
        { element: phobosImage, name: 'Phobos', parent: 'Mars' },
        { element: deimosImage, name: 'Deimos', parent: 'Mars' },
        { element: ganymedeImage, name: 'Ganymede', parent: 'Jupiter' },
        { element: ioImage, name: 'Io', parent: 'Jupiter' },
        { element: europaImage, name: 'Europa', parent: 'Jupiter' },
        { element: callistoImage, name: 'Callisto', parent: 'Jupiter' },
        { element: titanImage, name: 'Titan', parent: 'Saturn' },
        { element: rheaImage, name: 'Rhea', parent: 'Saturn' },
        { element: iapetusImage, name: 'Iapetus', parent: 'Saturn' },
        { element: dioneImage, name: 'Dione', parent: 'Saturn' },
        { element: enceladusImage, name: 'Enceladus', parent: 'Saturn' },
        { element: mimasImage, name: 'Mimas', parent: 'Saturn' },
    ].forEach(moon => {
        moon.element.style.cursor = 'pointer';
        moon.element.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentDropdownItem = menuItems[1].dropdown.find(item => item.name === moon.parent);
            if (parentDropdownItem && parentDropdownItem.nestedDropdown) {
                const moonItem = parentDropdownItem.nestedDropdown.find(item => item.name === moon.name);
                if (moonItem && moonItem.action) {
                    moonItem.action();
                }
            }
            showPlanetInfo(moon.name);
            playClickSound();
        });
    });

    // zoom indicator
    const zoomIndicator = document.createElement('div');
    zoomIndicator.className = 'control-indicator ui-element';
    zoomIndicator.style.left = '20px';
    zoomIndicator.style.bottom = '142px';
    zoomIndicator.style.width = '100px';
    
    const zoomIcon = document.createElement('img');
    zoomIcon.src = 'scroll_icon.png';
    zoomIcon.alt = 'Zoom';
    
    const zoomText = document.createElement('span');
    zoomText.textContent = 'Zoom';
    zoomText.style.marginLeft = '-3px';
    
    zoomIndicator.appendChild(zoomIcon);
    zoomIndicator.appendChild(zoomText);

    // pan indicator
    const panIndicator = document.createElement('div');
    panIndicator.className = 'control-indicator ui-element';
    panIndicator.style.left = '20px';
    panIndicator.style.bottom = '60px';
    panIndicator.style.width = '100px';
    
    const panIcon = document.createElement('img');
    panIcon.src = 'pan_icon.png';
    panIcon.alt = 'Pan';
    
    const panText = document.createElement('span');
    panText.textContent = 'Pan';
    panText.style.marginLeft = '0px';
    
    panIndicator.appendChild(panIcon);
    panIndicator.appendChild(panText);

    addUIElement(zoomDisplay);
    addUIElement(zoomIndicator);
    addUIElement(panIndicator);
});