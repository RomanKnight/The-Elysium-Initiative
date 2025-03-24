document.addEventListener('DOMContentLoaded', () => {
    const ambientSound = new Audio('ambience.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0;
    ambientSound.play();

    // functions
    function loadChartJsScript(callback) {
        const existingChart = document.getElementById('ironValueChart');
        if (existingChart) {
            const chartInstance = Chart.getChart(existingChart);
            if (chartInstance) {
                chartInstance.destroy();
            }
        }
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
        sound.volume = 0.2;
        return sound;
    }
    function createHoverSound2() {
        const sound = new Audio('hover_2.mp3');
        sound.volume = 0.25;
        return sound;
    }
    function createHoverSound3() {
        const sound = new Audio('hover_3.mp3');
        sound.volume = 0.4;
        return sound;
    }
    function createClickSound() {
        const sound = new Audio('click.mp3');
        sound.volume = 0.15;
        return sound;
    }
    function createCloseSound() {
        const sound = new Audio('close.mp3');
        sound.volume = 0.2;
        return sound;
    }
    function playHoverSound() {
        const sound = createHoverSound();
        sound.play();
    }
    function playHoverSound2() {
        const sound = createHoverSound2();
        sound.play();
    }
    function playHoverSound3() {
        const sound = createHoverSound3();
        sound.play();
    }
    function playClickSound() {
        const sound = createClickSound();
        sound.play();
    }
    function playCloseSound() {
        const sound = createCloseSound();
        sound.play();
    }
    function closeAllPages() {
        document.querySelectorAll('div[id$="-page"]').forEach(page => page.remove());
        container.style.display = 'flex';
    }

    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @font-face {
            font-family: 'Havelock Titling Light';
            src: url('havelock_titling_light.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
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
            padding: 8px 35px;
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
            height: 100px;
            margin-left: -30px;
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

    // animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
                                
        @keyframes glowPulse {
            0% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
            50% { box-shadow: 0 0 15px rgba(0, 128, 255, 0.8); }
            100% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
        }
    `;
    document.head.appendChild(style);

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
        zoomDisplay.textContent = `Magnification: ${(state.scale*1000).toFixed(2)}`;
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
            title: 'System',
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
                
                        const indexPage = document.createElement('div');
                        indexPage.id = 'index-page';
                        indexPage.style.minHeight = '100vh';
                        indexPage.style.height = '100%';
                        indexPage.style.backgroundColor = 'black';
                        indexPage.style.color = 'white';
                        indexPage.style.padding = '120px 0rem 2rem 0rem'; // DON'T CHANGE THIRD VALUE TO 0, IT MAKES THE SCROLL BAR DISAPPEAR (for some fucking reason)
                        indexPage.style.display = 'flex';
                        indexPage.style.justifyContent = 'center';
                        indexPage.style.position = 'fixed';
                        indexPage.style.top = '0';
                        indexPage.style.left = '0';
                        indexPage.style.right = '0';
                        indexPage.style.bottom = '0';
                        indexPage.style.width = '100%';
                        indexPage.style.overflowY = 'auto';
                
                        const content = document.createElement('div');
                        content.style.maxWidth = '1600px';
                        content.style.width = '100%';
                
                        const indexTitle = document.createElement('h1');
                        indexTitle.textContent = "RESOURCE MARKET INDEX";
                        indexTitle.style.textAlign = 'center';
                        indexTitle.style.fontSize = '4rem';
                        indexTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        indexTitle.style.color = 'white';
                        indexTitle.style.textAlign = 'center';
                        indexTitle.style.maxWidth = '1000px';
                        indexTitle.style.margin = '3rem auto 2rem auto';

                        const indexDivider = document.createElement('div');
                        indexDivider.style.width = '160px';
                        indexDivider.style.height = '4px';
                        indexDivider.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                        indexDivider.style.margin = '2rem auto 3rem auto';

                        const indexSubtitle = document.createElement('div');
                        indexSubtitle.textContent = 'View the current market index for the most common resources across the galaxy.';
                        indexSubtitle.style.fontSize = '1rem';
                        indexSubtitle.style.fontFamily = 'Source Code Pro, sans-serif';
                        indexSubtitle.style.color = 'rgb(209, 213, 219)';
                        indexSubtitle.style.textAlign = 'center';
                        indexSubtitle.style.maxWidth = '600px';
                        indexSubtitle.style.margin = '3rem auto 1.5rem auto';
                        
                        const resourceSection = document.createElement('div');
                        resourceSection.style.marginBottom = '3rem';
                
                        const chartContainer = document.createElement('div');
                        chartContainer.id = 'resource-chart-container';
                        chartContainer.style.width = '100%';
                        chartContainer.style.height = '600px';
                        chartContainer.style.backgroundColor = 'rgba(0, 128, 255, 0.07)';
                        chartContainer.style.borderRadius = '8px';
                        chartContainer.style.border = '2px solid rgba(0, 128, 255, 0.4)';
                        chartContainer.style.boxShadow = '0 0 15px rgba(0, 128, 255, 0.4)';
                        chartContainer.style.padding = '20px';
                        chartContainer.style.position = 'relative';
                        chartContainer.style.marginBottom = '2rem';
                        chartContainer.style.margin = '0 auto 2rem auto';
                        chartContainer.style.maxWidth = '1500px';
                
                        const buttonContainer = document.createElement('div');
                        buttonContainer.style.display = 'flex';
                        buttonContainer.style.justifyContent = 'center';
                        buttonContainer.style.gap = '30px';
                        buttonContainer.style.margin = '3rem auto 2.5rem auto';
                
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

                        // selected resource
                        let selectedResource = 'Iron';

                        resources.forEach(resource => {
                            const button = document.createElement('button');
                            button.textContent = resource.name;
                            button.dataset.resource = resource.name;
                            button.style.fontSize = '16px';
                            button.style.padding = '8px 32px';
                            button.style.backgroundColor = resource.name === selectedResource ? 'rgba(0, 128, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';
                            button.style.color = 'white';
                            button.style.border = 'none';
                            button.style.borderRadius = '4px';
                            button.style.cursor = 'pointer';
                            button.style.fontFamily = 'Source Code Pro, sans-serif';
                            button.style.transition = 'transform 0.2s, opacity 0.2s';
                            
                            button.onmouseover = () => {
                                if (resource.name !== selectedResource) {
                                    playHoverSound2();
                                    button.style.opacity = '0.8';
                                    button.style.transform = 'scale(1.05)';
                                }
                            };
                            button.onmouseout = () => {
                                if (resource.name !== selectedResource) {
                                    button.style.opacity = '1';
                                    button.style.transform = 'scale(1)';
                                }
                            };
                            
                            button.onclick = () => {
                                playHoverSound3();
                                
                                selectedResource = resource.name;
                                
                                document.querySelectorAll('[data-resource]').forEach(btn => {
                                    if (btn.dataset.resource === selectedResource) {
                                        btn.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                    } else {
                                        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    }
                                });
                                
                                updateChart(resource.name);
                            };
                            
                            buttonContainer.appendChild(button);
                        });
                        resourceSection.appendChild(buttonContainer);
                        resourceSection.appendChild(chartContainer);
                        content.appendChild(indexTitle);
                        content.appendChild(indexDivider);
                        content.appendChild(indexSubtitle);
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
                
                        // resource index chart math
                        function generateResourceData(resourceName) {
                            const years = [];
                            const values = [];
                            
                            // starting from year 2100
                            for (let i = 0; i <= 100; i++) {
                                years.push(2100 + i);
                                
                                let baseValue = 100;
                                
                                // resource chart maths
                                switch(resourceName) {
                                    case 'Iron':
                                        baseValue += (i - 50) * 2;
                                        baseValue *= Math.pow(1.08, i/10);
                                        baseValue += Math.sin(i * 0.1) * (baseValue * 0.2);
                                        baseValue += Math.sin(i * 0.8) * (baseValue * 0.05);
                                        baseValue += Math.sin(i * 1.6) * (baseValue * 0.03);
                                        if (i % 15 === 0) baseValue *= 0.8;
                                        if (i % 7 === 0 && i % 15 !== 0) baseValue *= 0.9;
                                        if (i % 15 === 1) baseValue *= 1.15;
                                        if (i % 7 === 1 && i % 15 !== 1) baseValue *= 1.08;
                                        if (i >= 25 && i <= 30) baseValue *= 1.12;
                                        if (i === 31) baseValue *= 0.7;
                                        if (i >= 60 && i <= 67) baseValue *= 1.14;
                                        if (i === 68) baseValue *= 0.65;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Silicon':
                                        baseValue += (i * 1.2 - 50) * 3;
                                        baseValue *= Math.pow(1.065, i/10);
                                        baseValue += Math.sin(i * 0.09) * (baseValue * 0.22);
                                        baseValue += Math.sin(i * 0.75) * (baseValue * 0.06);
                                        baseValue += Math.sin(i * 1.5) * (baseValue * 0.04);
                                        if (i % 14 === 0) baseValue *= 0.78;
                                        if (i % 6 === 0 && i % 14 !== 0) baseValue *= 0.92;
                                        if (i % 14 === 1) baseValue *= 1.17;
                                        if (i % 6 === 1 && i % 14 !== 1) baseValue *= 1.1;
                                        if (i >= 23 && i <= 28) baseValue *= 1.14;
                                        if (i === 30) baseValue *= 0.75;
                                        if (i >= 58 && i <= 65) baseValue *= 1.16;
                                        if (i === 67) baseValue *= 0.7;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Magnesium':
                                        baseValue += (i * 0.9 - 50) * 3;
                                        baseValue *= Math.pow(1.095, i/10);
                                        baseValue += Math.sin(i * 0.11) * (baseValue * 0.18);
                                        baseValue += Math.sin(i * 0.9) * (baseValue * 0.04);
                                        baseValue += Math.sin(i * 1.7) * (baseValue * 0.05);
                                        if (i % 13 === 0) baseValue *= 0.82;
                                        if (i % 8 === 0 && i % 13 !== 0) baseValue *= 0.87;
                                        if (i % 13 === 1) baseValue *= 1.2;
                                        if (i % 8 === 1 && i % 13 !== 1) baseValue *= 1.06;
                                        if (i >= 26 && i <= 32) baseValue *= 1.1;
                                        if (i === 34) baseValue *= 0.8;
                                        if (i >= 62 && i <= 69) baseValue *= 1.12;
                                        if (i === 71) baseValue *= 0.75;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Sulfur':
                                        baseValue += i * 1.1 - 50;
                                        baseValue *= Math.pow(1.07, i/10);
                                        baseValue += Math.sin(i * 0.12) * (baseValue * 0.24);
                                        baseValue += Math.sin(i * 0.7) * (baseValue * 0.07);
                                        baseValue += Math.sin(i * 1.9) * (baseValue * 0.02);
                                        if (i % 16 === 0) baseValue *= 0.85;
                                        if (i % 5 === 0 && i % 16 !== 0) baseValue *= 0.94;
                                        if (i % 16 === 1) baseValue *= 1.13;
                                        if (i % 5 === 1 && i % 16 !== 1) baseValue *= 1.12;
                                        if (i >= 24 && i <= 29) baseValue *= 1.16;
                                        if (i === 29) baseValue *= 0.65;
                                        if (i >= 64 && i <= 71) baseValue *= 1.18;
                                        if (i === 73) baseValue *= 0.6;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Nickel':
                                        baseValue += (i * 1.3) * 4;
                                        baseValue *= Math.pow(1.09, i/10);
                                        baseValue += Math.sin(i * 0.08) * (baseValue * 0.21);
                                        baseValue += Math.sin(i * 0.85) * (baseValue * 0.05);
                                        baseValue += Math.sin(i * 1.8) * (baseValue * 0.03);
                                        if (i % 17 === 0) baseValue *= 0.75;
                                        if (i % 9 === 0 && i % 17 !== 0) baseValue *= 0.89;
                                        if (i % 17 === 1) baseValue *= 1.19;
                                        if (i % 9 === 1 && i % 17 !== 1) baseValue *= 1.09;
                                        if (i >= 27 && i <= 31) baseValue *= 1.15;
                                        if (i === 33) baseValue *= 0.68;
                                        if (i >= 60 && i <= 68) baseValue *= 1.17;
                                        if (i === 69) baseValue *= 0.63;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Calcium':
                                        baseValue += i * 0.8 - 50;
                                        baseValue *= Math.pow(1.085, i/10);
                                        baseValue += Math.sin(i * 0.1) * (baseValue * 0.19);
                                        baseValue += Math.sin(i * 0.8) * (baseValue * 0.06);
                                        baseValue += Math.sin(i * 1.7) * (baseValue * 0.04);
                                        if (i % 14 === 0) baseValue *= 0.82;
                                        if (i % 7 === 0 && i % 14 !== 0) baseValue *= 0.91;
                                        if (i % 14 === 1) baseValue *= 1.16;
                                        if (i % 7 === 1 && i % 14 !== 1) baseValue *= 1.07;
                                        if (i >= 25 && i <= 31) baseValue *= 1.11;
                                        if (i === 32) baseValue *= 0.72;
                                        if (i >= 61 && i <= 66) baseValue *= 1.15;
                                        if (i === 68) baseValue *= 0.67;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Aluminum':
                                        baseValue += (i * 1.15 - 50) * 2;
                                        baseValue *= Math.pow(1.075, i/10);
                                        baseValue += Math.sin(i * 0.11) * (baseValue * 0.23);
                                        baseValue += Math.sin(i * 0.85) * (baseValue * 0.05);
                                        baseValue += Math.sin(i * 1.8) * (baseValue * 0.035);
                                        if (i % 15 === 0) baseValue *= 0.79;
                                        if (i % 8 === 0 && i % 15 !== 0) baseValue *= 0.9;
                                        if (i % 15 === 1) baseValue *= 1.17;
                                        if (i % 8 === 1 && i % 15 !== 1) baseValue *= 1.09;
                                        if (i >= 24 && i <= 30) baseValue *= 1.13;
                                        if (i === 31) baseValue *= 0.73;
                                        if (i >= 59 && i <= 66) baseValue *= 1.16;
                                        if (i === 67) baseValue *= 0.66;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Carbon':
                                        baseValue += (i * 1.05) * 4;
                                        baseValue *= Math.pow(1.1, i/10);
                                        baseValue += Math.sin(i * 0.09) * (baseValue * 0.22);
                                        baseValue += Math.sin(i * 0.8) * (baseValue * 0.045);
                                        baseValue += Math.sin(i * 1.6) * (baseValue * 0.04);
                                        if (i % 16 === 0) baseValue *= 0.77;
                                        if (i % 6 === 0 && i % 16 !== 0) baseValue *= 0.93;
                                        if (i % 16 === 1) baseValue *= 1.18;
                                        if (i % 6 === 1 && i % 16 !== 1) baseValue *= 1.11;
                                        if (i >= 26 && i <= 31) baseValue *= 1.14;
                                        if (i === 33) baseValue *= 0.69;
                                        if (i >= 62 && i <= 69) baseValue *= 1.15;
                                        if (i === 70) baseValue *= 0.64;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
                                        break;
                
                                    case 'Platinum':
                                        baseValue += (i * 1.4) * 6;
                                        baseValue *= Math.pow(1.1, i/10);
                                        baseValue += Math.sin(i * 0.12) * (baseValue * 0.25);
                                        baseValue += Math.sin(i * 0.9) * (baseValue * 0.07);
                                        baseValue += Math.sin(i * 1.9) * (baseValue * 0.05);
                                        if (i % 13 === 0) baseValue *= 0.85;
                                        if (i % 5 === 0 && i % 13 !== 0) baseValue *= 0.92;
                                        if (i % 13 === 1) baseValue *= 1.15;
                                        if (i % 5 === 1 && i % 13 !== 1) baseValue *= 1.08;
                                        if (i >= 23 && i <= 28) baseValue *= 1.12;
                                        if (i === 29) baseValue *= 0.82;
                                        if (i >= 58 && i <= 64) baseValue *= 1.14;
                                        if (i === 65) baseValue *= 0.8;
                                        baseValue = Math.max(baseValue, 10);
                                        baseValue = Math.round(baseValue * 100) / 100;
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
                                        label: `${resourceName} value in Solar Credit Standard™ (SCS™) per ton recycled`,
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
                                                text: 'Value Index (SCS™)',
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
                                                        <span style="color: ${resourceColor}; font-weight: bold;">${value} SCS™</span>
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
                
                        // resource table data
                        const resourcesTableData = [
                            {
                                material: "Iron",
                                category: "Metal",
                                value: 2,
                                applications: "Structural components, machinery, power transmission, electromagnetic shielding, terraforming equipment"
                            },
                            {
                                material: "Silicon",
                                category: "Metalloid",
                                value: 3,
                                applications: "Computing substrates, photovoltaics, quantum processors, artificial intelligence cores, construction materials"
                            },
                            {
                                material: "Magnesium",
                                category: "Metal",
                                value: 3,
                                applications: "Lightweight alloys, energy storage, biological systems, radiation shielding, atmospheric processors"
                            },
                            {
                                material: "Sulfur",
                                category: "Nonmetal",
                                value: 1,
                                applications: "Chemical synthesis, power cells, atmosphere regulation, biological applications, preservatives"
                            },
                            {
                                material: "Nickel",
                                category: "Metal",
                                value: 4,
                                applications: "High-temperature alloys, battery technology, catalysts, advanced propulsion components, corrosion resistance"
                            },
                            {
                                material: "Calcium",
                                category: "Metal",
                                value: 1,
                                applications: "Biological systems, construction materials, signal processing, water purification, nutrient synthesis"
                            },
                            {
                                material: "Aluminum",
                                category: "Metal",
                                value: 2,
                                applications: "Aerospace structures, radiation reflection, heat dissipation, lightweight transportation, habitat construction"
                            },
                            {
                                material: "Carbon",
                                category: "Nonmetal",
                                value: 4,
                                applications: "Nanotubes, diamond computing, graphene structures, life support systems, carbon sequestration"
                            },
                            {
                                material: "Platinum",
                                category: "Metal",
                                value: 6,
                                applications: "Quantum circuit fabrication, advanced catalysts, neural interfaces, molecular manipulation, fusion control systems"
                            }
                        ];
                
                        // resource info table
                        const resourceTableSection = document.createElement('div');
                        resourceTableSection.style.marginTop = '4rem';
                        resourceTableSection.style.marginBottom = '6rem';
                        resourceTableSection.style.padding = '2rem';
                        resourceTableSection.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        resourceTableSection.style.borderRadius = '8px';
                        resourceTableSection.style.maxWidth = '1000px';
                        resourceTableSection.style.margin = '4rem auto 6rem auto';
                
                        const resourceTableTitle = document.createElement('h2');
                        resourceTableTitle.textContent = "RESOURCE APPLICATIONS";
                        resourceTableTitle.style.fontSize = '1.75rem';
                        resourceTableTitle.style.marginBottom = '2rem';
                        resourceTableTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        resourceTableTitle.style.color = 'white';
                        resourceTableTitle.style.textAlign = 'center';
                
                        const resourceTableText = document.createElement('p');
                        resourceTableText.style.fontSize = '1.1rem';
                        resourceTableText.style.marginBottom = '3rem';
                        resourceTableText.style.lineHeight = '1.75';
                        resourceTableText.style.fontFamily = 'Source Code Pro, sans-serif';
                        resourceTableText.style.color = 'rgb(209, 213, 219)';
                        resourceTableText.style.textAlign = 'center';
                        resourceTableText.textContent = "The Elysium Initiative's resource valuation depends upon factors such as rarity, abundance, and utility. The following data provides further context to the above market figures.";
                
                        const resourcesTableContainer = document.createElement('div');
                        resourcesTableContainer.style.width = '100%';
                        resourcesTableContainer.style.overflowX = 'auto';
                
                        const table = document.createElement('table');
                        table.style.width = '100%';
                        table.style.borderCollapse = 'separate';
                        table.style.borderSpacing = '0';
                        table.style.fontFamily = 'Source Code Pro, sans-serif';
                
                        const thead = document.createElement('thead');
                        thead.style.backgroundColor = 'rgba(66, 66, 66, 0.7)';
                        thead.style.color = 'white';
                
                        const headerRow = document.createElement('tr');
                
                        const headers = ["Material", "Category", "Relative Value", "Primary Applications"];
                
                        headers.forEach(headerText => {
                            const header = document.createElement('th');
                            header.textContent = headerText;
                            header.style.padding = '1rem';
                            header.style.textAlign = 'left';
                            header.style.fontWeight = 'bold';
                            
                            if (headerText === "Relative Value") {
                                header.style.textAlign = 'center';
                            }
                            
                            headerRow.appendChild(header);
                        });
                
                        thead.appendChild(headerRow);
                        table.appendChild(thead);
                
                        const tbody = document.createElement('tbody');
                
                        resourcesTableData.forEach((resource, index) => {
                            const row = document.createElement('tr');
                            row.style.backgroundColor = index % 2 === 0 ? 'rgba(16, 16, 16, 0.4)' : 'rgba(16, 16, 16, 0.6)';
                            row.style.transition = 'background-color 0.3s ease';
                            
                            row.addEventListener('mouseenter', () => {
                                playHoverSound2();
                                row.style.backgroundColor = 'rgba(0, 128, 255, 0.15)';
                            });
                            
                            row.addEventListener('mouseleave', () => {
                                row.style.backgroundColor = index % 2 === 0 ? 'rgba(16, 16, 16, 0.4)' : 'rgba(16, 16, 16, 0.6)';
                            });
                            
                            // material cells
                            const materialCell = document.createElement('td');
                            materialCell.textContent = resource.material;
                            materialCell.style.padding = '1rem';
                            materialCell.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                            materialCell.style.fontWeight = 'bold';
                            materialCell.style.color = 'white';
                            
                            // category cells
                            const categoryCell = document.createElement('td');
                            categoryCell.textContent = resource.category;
                            categoryCell.style.padding = '1rem';
                            categoryCell.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                            categoryCell.style.color = 'rgb(209, 213, 219)';
                            
                            // value cells
                            const valueCell = document.createElement('td');
                            valueCell.style.padding = '1rem';
                            valueCell.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                            valueCell.style.textAlign = 'center';
                            
                            const starsContainer = document.createElement('div');
                            starsContainer.style.display = 'flex';
                            starsContainer.style.justifyContent = 'center';
                            starsContainer.style.gap = '4px';
                            
                            for (let i = 0; i < 6; i++) {
                                const star = document.createElement('span');
                                if (i < resource.value) {
                                    star.innerHTML = '★';
                                    star.style.color = 'rgba(0, 128, 255, 0.9)';
                                } else {
                                    star.innerHTML = '☆';
                                    star.style.color = 'rgba(0, 128, 255, 0.3)';
                                }
                                starsContainer.appendChild(star);
                            }
                            valueCell.appendChild(starsContainer);
                            
                            // applications cells
                            const applicationsCell = document.createElement('td');
                            applicationsCell.textContent = resource.applications;
                            applicationsCell.style.padding = '1rem';
                            applicationsCell.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                            applicationsCell.style.color = 'rgb(209, 213, 219)';
                            applicationsCell.style.maxWidth = '500px';
                            applicationsCell.style.whiteSpace = 'normal';
                            applicationsCell.style.wordBreak = 'break-word';
                            applicationsCell.style.lineHeight = '1.4';
                            
                            row.appendChild(materialCell);
                            row.appendChild(categoryCell);
                            row.appendChild(valueCell);
                            row.appendChild(applicationsCell);
                            
                            tbody.appendChild(row);
                        });

                        table.appendChild(tbody);
                        resourcesTableContainer.appendChild(table);
                        resourceTableSection.appendChild(resourceTableTitle);
                        resourceTableSection.appendChild(resourceTableText);
                        resourceTableSection.appendChild(resourcesTableContainer);

                        content.appendChild(resourceTableSection);
                        indexPage.appendChild(content);

                        loadChartJsScript(() => {
                            requestAnimationFrame(() => {
                                createResourceChart('Iron');
                                updateEvents('Iron');
                                console.log('Chart created');
                            });
                        });

                        // footer
                        const footer = document.createElement('div');
                        footer.style.textAlign = 'center';
                        footer.style.paddingBottom = '2rem';
                        footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                        footer.style.paddingTop = '2rem';
                        footer.style.maxWidth = '700px';
                        footer.style.margin = '4rem auto 0rem auto';
                        
                        const footerText = document.createElement('p');
                        footerText.textContent = "© 2202 The Elysium Initiative. All rights reserved across the spacetime continuum.";
                        footerText.style.fontSize = '0.9rem';
                        footerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        footerText.style.color = 'rgba(209, 213, 219, 0.6)';
                        footerText.style.marginBottom = '200px';

                        content.appendChild(footer);
                        footer.appendChild(footerText);

                        document.body.appendChild(indexPage);
                    }
                },
                { 
                    name: 'Catalog',
                    action: () => {
                        closeAllPages();
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                    
                        const catalogPage = document.createElement('div');
                        catalogPage.id = 'extraction-page';
                        catalogPage.style.minHeight = '100vh';
                        catalogPage.style.height = '100%';
                        catalogPage.style.backgroundColor = 'black';
                        catalogPage.style.color = 'white';
                        catalogPage.style.padding = '120px 0 2rem 0';
                        catalogPage.style.display = 'flex';
                        catalogPage.style.justifyContent = 'center';
                        catalogPage.style.position = 'fixed';
                        catalogPage.style.top = '0';
                        catalogPage.style.left = '0';
                        catalogPage.style.right = '0';
                        catalogPage.style.bottom = '0';
                        catalogPage.style.overflowY = 'auto';
                    
                        const content = document.createElement('div');
                        content.style.maxWidth = '1060px';
                        content.style.width = '100%';

                        const techSection = document.createElement('div');
                        techSection.style.maxWidth = '1000px';
                        techSection.style.margin = '0 auto 5rem auto';

                        const techTitle = document.createElement('h2');
                        techTitle.textContent = "TECHNOLOGIES CATALOG";
                        techTitle.style.fontSize = '4rem';
                        techTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        techTitle.style.color = 'white';
                        techTitle.style.textAlign = 'center';
                        techTitle.style.margin = '3rem auto 2rem auto';

                        const techDivider = document.createElement('div');
                        techDivider.style.width = '160px';
                        techDivider.style.height = '4px';
                        techDivider.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                        techDivider.style.margin = '2rem auto 3rem auto';

                        const techSubtitle = document.createElement('div');
                        techSubtitle.textContent = 'Browse our incredible selection of planetary mining, energy production, and material transport solutions.';
                        techSubtitle.style.fontSize = '1rem';
                        techSubtitle.style.fontFamily = 'Source Code Pro, sans-serif';
                        techSubtitle.style.color = 'rgb(209, 213, 219)';
                        techSubtitle.style.textAlign = 'center';
                        techSubtitle.style.maxWidth = '800px';
                        techSubtitle.style.margin = '3rem auto 3.5rem auto';

                        const descriptionText = document.createElement('p');
                        descriptionText.style.fontSize = '1.2rem';
                        descriptionText.style.lineHeight = '1.8';
                        descriptionText.style.marginBottom = '3rem';
                        descriptionText.style.fontFamily = 'Source Code Pro, sans-serif';
                        descriptionText.style.color = 'rgb(209, 213, 219)';
                        descriptionText.style.textAlign = 'center';
                        descriptionText.style.maxWidth = '800px';
                        descriptionText.style.margin = '0 auto 0 auto';
                        descriptionText.style.padding = '2rem';
                        descriptionText.style.backgroundColor = 'rgba(0, 28, 55, 0.5)';
                        descriptionText.style.borderRadius = '12px';
                        descriptionText.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                        descriptionText.style.whiteSpace = 'pre-wrap';
                        descriptionText.textContent = 'The Elysium Initiative offers comprehensive solutions for all cataloged technologies. Extraction \
yields may vary based on celestial body composition and local constants. Secured financing solutions are available for qualified stakeholders. \
For detailed specifications, personalized quotes, or further information, contact us here:';

                        const buttonContainer = document.createElement('div');
                        buttonContainer.style.textAlign = 'center';
                        buttonContainer.style.marginTop = '2rem';
                        buttonContainer.style.marginBottom = '5rem';

                        const requestQuoteButton = document.createElement('button');
                        requestQuoteButton.textContent = "Request a quote";
                        requestQuoteButton.style.padding = '1rem 2.5rem';
                        requestQuoteButton.style.fontSize = '1.3rem';
                        requestQuoteButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        requestQuoteButton.style.backgroundColor = 'rgba(0, 128, 255, 0.9)';
                        requestQuoteButton.style.color = 'white';
                        requestQuoteButton.style.border = 'none';
                        requestQuoteButton.style.borderRadius = '4px';
                        requestQuoteButton.style.cursor = 'pointer';
                        requestQuoteButton.style.transition = 'all 0.3s ease';
                        requestQuoteButton.style.margin = '0.5rem auto 3rem auto';

                        requestQuoteButton.addEventListener('mouseenter', () => {
                            playHoverSound();
                            requestQuoteButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                            requestQuoteButton.style.transform = 'scale(1.05)';
                        });

                        requestQuoteButton.addEventListener('mouseleave', () => {
                            requestQuoteButton.style.backgroundColor = 'rgba(0, 128, 255, 0.9)';
                            requestQuoteButton.style.transform = 'scale(1)';
                        });

                        requestQuoteButton.addEventListener('click', () => {
                            playClickSound();
                            const overlay = document.createElement('div');
                            overlay.style.position = 'fixed';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                            overlay.style.backdropFilter = 'blur(8px)';
                            overlay.style.zIndex = '1000';
                            overlay.style.display = 'flex';
                            overlay.style.justifyContent = 'center';
                            overlay.style.alignItems = 'center';
                            
                            const popup = document.createElement('div');
                            popup.style.backgroundColor = 'rgba(10, 15, 30, 0.95)';
                            popup.style.border = '2px solid rgba(0, 128, 255, 0.7)';
                            popup.style.borderRadius = '12px';
                            popup.style.padding = '40px';
                            popup.style.width = '90%';
                            popup.style.maxWidth = '500px';
                            popup.style.position = 'relative';
                            popup.style.boxShadow = '0 0 30px rgba(0, 128, 255, 0.5)';
                            popup.style.animation = 'popupFadeIn 0.3s ease-out forwards';
                            
                            const closeButton = document.createElement('button');
                            closeButton.innerHTML = '&times;';
                            closeButton.style.position = 'absolute';
                            closeButton.style.top = '15px';
                            closeButton.style.right = '15px';
                            closeButton.style.backgroundColor = 'transparent';
                            closeButton.style.border = 'none';
                            closeButton.style.color = 'rgba(0, 128, 255, 0.9)';
                            closeButton.style.fontSize = '28px';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.lineHeight = '40px';
                            closeButton.style.padding = '0';
                            closeButton.style.borderRadius = '50%';
                            closeButton.style.transition = 'all 0.2s ease';
                            
                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
                                closeButton.style.transform = 'scale(1.1)';
                            });
                            
                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.backgroundColor = 'transparent';
                                closeButton.style.transform = 'scale(1)';
                            });
                            
                            closeButton.addEventListener('click', () => {
                                playCloseSound();
                                overlay.style.opacity = '0';
                                popup.style.transform = 'scale(0.9)';
                                popup.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(overlay);
                                }, 300);
                            });
                            
                            const popupTitle = document.createElement('h2');
                            popupTitle.textContent = 'Information Portal';
                            popupTitle.style.color = 'white';
                            popupTitle.style.fontSize = '2rem';
                            popupTitle.style.textAlign = 'center';
                            popupTitle.style.marginBottom = '20px';
                            popupTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            
                            const quoteIcon = document.createElement('div');
                            quoteIcon.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            `;
                            quoteIcon.style.display = 'flex';
                            quoteIcon.style.justifyContent = 'center';
                            quoteIcon.style.marginBottom = '20px';
                            
                            const messageText = document.createElement('p');
                            messageText.textContent = 'To request a personalized quote or further information regarding mining solutions, please contact us at:';
                            messageText.style.color = 'rgb(209, 213, 219)';
                            messageText.style.fontSize = '1.1rem';
                            messageText.style.textAlign = 'center';
                            messageText.style.lineHeight = '1.6';
                            messageText.style.marginBottom = '20px';
                            messageText.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            const emailAddress = document.createElement('div');
                            emailAddress.textContent = 'support@elysiuminitiative.com';
                            emailAddress.style.color = 'rgba(0, 128, 255, 0.9)';
                            emailAddress.style.fontSize = '1.2rem';
                            emailAddress.style.fontWeight = 'bold';
                            emailAddress.style.textAlign = 'center';
                            emailAddress.style.padding = '15px';
                            emailAddress.style.margin = '0 auto 25px auto';
                            emailAddress.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
                            emailAddress.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                            emailAddress.style.borderRadius = '6px';
                            emailAddress.style.maxWidth = '350px';
                            emailAddress.style.fontFamily = 'Source Code Pro, monospace';
                            emailAddress.style.animation = 'glowPulse 4s infinite';
                            
                            const disclaimerText = document.createElement('p');
                            disclaimerText.textContent = 'By submitting a quote inquiry, you acknowledge The Elysium Initiative\'s right to neural \
                data collection and waive all claims to anonymity upon acceptance.';
                            disclaimerText.style.color = 'rgba(209, 213, 219, 0.6)';
                            disclaimerText.style.fontSize = '0.8rem';
                            disclaimerText.style.textAlign = 'center';
                            disclaimerText.style.marginTop = '20px';
                            disclaimerText.style.fontStyle = 'italic';
                            disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            popup.appendChild(closeButton);
                            popup.appendChild(popupTitle);
                            popup.appendChild(quoteIcon);
                            popup.appendChild(messageText);
                            popup.appendChild(emailAddress);
                            popup.appendChild(disclaimerText);
                            overlay.appendChild(popup);
                            document.body.appendChild(overlay);
                        });

                        buttonContainer.appendChild(requestQuoteButton);

                        const techGrid = document.createElement('div');
                        techGrid.style.display = 'grid';
                        techGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                        techGrid.style.gap = '2rem';
                        techGrid.style.width = '100%';
                        techGrid.style.maxWidth = '1000px';
                        techGrid.style.margin = '0 0 2rem 0';
                        techGrid.style.transition = 'all 0.5s ease';

                        const techMediaQuery = window.matchMedia('(max-width: 768px)');
                        function handleTechScreenChange(e) {
                            if (e.matches) {
                                techGrid.style.gridTemplateColumns = '1fr';
                            } else {
                                techGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                            }
                        }
                        handleTechScreenChange(techMediaQuery);
                        techMediaQuery.addEventListener('change', handleTechScreenChange);

                        const technologies = [
                            {
                                id: 'aero-skimmers',
                                title: 'Aero Skimmers',
                                target: 'Planetary Atmospheres',
                                description: 'Consumes and compacts planetary atmospheres. Utilizes advanced chemical processes for minimum energy consumption.',
                                details: [
                                    'Deployment: Self-assembling aerial automata capable of processing thousands of cubic kilometers per day',
                                    'Efficiency: 97.5% capture rate with zero waste byproducts',
                                    'Applications: Produces breathable air for habitation, fuel for fusion reactors, and raw elements for manufacturing',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'aero_skimmers.jpg'
                            },
                            {
                                id: 'mining-swarms',
                                title: 'Mining Swarms',
                                target: 'Planetary Surfaces',
                                description: 'Self-replicating hexapod machines that consume terrain and package desired materials. Each unit functions both as harvester and processor.',
                                details: [
                                    'Deployment: Starter units reproduce using planetary materials, growing to millions of units in a matter of weeks',
                                    'Efficiency: 98.9% extraction purity thanks to precision material sifting',
                                    'Applications: Surface/subsurface material processing, terraforming, and construction prep',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'mining_swarm.jpg'
                            },
                            {
                                id: 'hydro-siphons',
                                title: 'Hydro Siphons',
                                target: 'Liquid Resources',
                                description: 'Large-mouthed extraction tubes that consume, purify, and transport liquid resources across vast distances.',
                                details: [
                                    'Deployment: Central processing hub with telescoping collection tubes',
                                    'Efficiency: Complete molecular filtration enabling 99.98% separation of valuable compounds',
                                    'Applications: Water extraction, nutrient harvesting, and recovery of rare minerals',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'hydro_siphon.jpg'
                            },
                            {
                                id: 'frost-maws',
                                title: 'Frost Maws',
                                target: 'Ice Formations',
                                description: 'Thermally-augmented excavation systems with serrated jaws that fracture and process cryogenic deposits.',
                                details: [
                                    'Deployment: Thermal regulation unit with expanding titanium-carbide jaws',
                                    'Efficiency: 99.95% recovery of frozen materials with negligible sublimation',
                                    'Applications: Ice excavation and gas extraction',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'frost_maw.jpg'
                            },
                            {
                                id: 'mantle-bores',
                                title: 'Mantle Bores',
                                target: 'Planetary Mantles',
                                description: 'Planetary drilling systems that create self-stabilizing tunnels through molten planet interiors.',
                                details: [
                                    'Deployment: Central bore with radial reinforcements that can penetrate to depths of up to 6,000 km',
                                    'Efficiency: 94% purity in selected extraction',
                                    'Applications: Rare earth elements, precious metals, and high-pressure mineral formations',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'mantle_bore.jpg'
                            },
                            {
                                id: 'core-shredders',
                                title: 'Core Shredders',
                                target: 'Planetary Cores',
                                description: 'Micro-singularity containment systems that safely dismantle planetary cores by manipulating gravitational forces.',
                                details: [
                                    'Deployment: Clusters of anti-matter charges placed at strategic points to initiate gravitational collapse',
                                    'Efficiency: 81.6% recovery of heavy elements via event-horizon manipulation',
                                    'Applications: Bulk extraction of iron, nickel, and other heavy metals, as well as exotic materials created through singularity events',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'core_shredder.jpg'
                            },
                            {
                                id: 'vortex-converters',
                                title: 'Vortex Converters',
                                target: 'Gas Giants',
                                description: 'Massive energy-matter conversion arrays that transform gaseous elements into stable solid forms.',
                                details: [
                                    'Deployment: Opposing orbital facilities generate a controlled gravitational vortex',
                                    'Efficiency: 99.91% conversion rate from gaseous to solid state with minimal energy loss',
                                    'Applications: Planet-scale gas compacting and rare gas collection',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'vortex_converter.jpg'
                            },
                            {
                                id: 'quantum-nexus',
                                title: 'Quantum Nexus',
                                target: 'Material Transport',
                                description: 'Revolutionary matter-energy conversion network that enables transport of resources across interstellar distances.',
                                details: [
                                    'Deployment: Paired quantum entanglement nodes placed at extraction sites and delivery destinations',
                                    'Efficiency: 99.9999% transmission accuracy with zero material loss during transport',
                                    'Applications: Immediate resource delivery to manufacturing centers throughout space (Note: not suitable for living organisms)',
                                ],
                                color: 'rgba(27, 72, 170, 0.8)',
                                image: 'quantum_nexus.jpg'
                            }
                        ];

                        let expandedCardId = null;

                        technologies.forEach(tech => {
                            const card = document.createElement('div');
                            card.id = tech.id;
                            card.className = 'tech-card';
                            card.style.backgroundColor = 'rgba(16, 16, 16, 0.6)';
                            card.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                            card.style.borderRadius = '8px';
                            card.style.overflow = 'hidden';
                            card.style.transition = 'all 0.5s ease-in-out';
                            card.style.cursor = 'pointer';
                            card.style.position = 'relative';
                            card.style.gridColumn = 'span 1';
                            card.style.maxHeight = '260px';
                            
                            const cardCollapsed = document.createElement('div');
                            cardCollapsed.className = 'card-collapsed';
                            cardCollapsed.style.display = 'flex';
                            cardCollapsed.style.flexDirection = 'column';
                            cardCollapsed.style.height = '260px';
                            cardCollapsed.style.padding = '0';
                            cardCollapsed.style.position = 'relative';
                            
                            // card image container
                            const imageContainer = document.createElement('div');
                            imageContainer.style.position = 'relative';
                            imageContainer.style.width = '100%';
                            imageContainer.style.height = '150px';
                            imageContainer.style.overflow = 'hidden';
                            
                            // card image
                            const cardImage = document.createElement('img');
                            cardImage.src = tech.image;
                            cardImage.style.width = '100%';
                            cardImage.style.height = '100%';
                            cardImage.style.objectFit = 'cover';
                            cardImage.style.transition = 'transform 0.5s ease';
                            imageContainer.appendChild(cardImage);
                            
                            // image overlay gradient
                            const imageOverlay = document.createElement('div');
                            imageOverlay.style.position = 'absolute';
                            imageOverlay.style.top = '0';
                            imageOverlay.style.left = '0';
                            imageOverlay.style.width = '100%';
                            imageOverlay.style.height = '100%';
                            imageOverlay.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))`;
                            imageContainer.appendChild(imageOverlay);
                            
                            // target badge
                            const targetBadge = document.createElement('div');
                            targetBadge.textContent = tech.target;
                            targetBadge.style.position = 'absolute';
                            targetBadge.style.top = '10px';
                            targetBadge.style.right = '10px';
                            targetBadge.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            targetBadge.style.color = 'white';
                            targetBadge.style.padding = '5px 10px';
                            targetBadge.style.borderRadius = '4px';
                            targetBadge.style.fontSize = '0.7rem';
                            targetBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            targetBadge.style.fontWeight = 'bold';
                            targetBadge.style.zIndex = '2';
                            imageContainer.appendChild(targetBadge);
                            
                            cardCollapsed.appendChild(imageContainer);
                            
                            // content container
                            const contentContainer = document.createElement('div');
                            contentContainer.style.padding = '15px 20px';
                            contentContainer.style.flex = '1';
                            contentContainer.style.display = 'flex';
                            contentContainer.style.flexDirection = 'column';
                            contentContainer.style.justifyContent = 'space-between';
                            contentContainer.style.position = 'relative';
                            contentContainer.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4))';
                            
                            const title = document.createElement('h3');
                            title.textContent = tech.title;
                            title.style.color = 'white';
                            title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            title.style.fontSize = '1.4rem';
                            title.style.margin = '0 0 8px 0';
                            title.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
                            contentContainer.appendChild(title);
                            
                            // short preview description
                            const preview = document.createElement('p');
                            // truncate description if it's over 80 characters
                            const truncatedDescription = tech.description.length > 80 ? 
                                                        tech.description.substring(0, 80) + '...' :
                                                        tech.description;
                            preview.textContent = truncatedDescription;
                            preview.style.fontSize = '0.9rem';
                            preview.style.color = 'rgba(255, 255, 255, 0.8)';
                            preview.style.margin = '0';
                            preview.style.fontFamily = 'Source Code Pro, sans-serif';
                            contentContainer.appendChild(preview);
                            
                            // click to expand
                            const expandPrompt = document.createElement('div');
                            expandPrompt.textContent = 'Click to expand';
                            expandPrompt.style.color = 'rgba(0, 128, 255, 0.9)';
                            expandPrompt.style.fontSize = '0.8rem';
                            expandPrompt.style.fontStyle = 'italic';
                            expandPrompt.style.marginTop = '10px';
                            expandPrompt.style.fontFamily = 'Source Code Pro, sans-serif';
                            contentContainer.appendChild(expandPrompt);
                            
                            cardCollapsed.appendChild(contentContainer);
                            
                            const cardExpanded = document.createElement('div');
                            cardExpanded.className = 'card-expanded';
                            cardExpanded.style.padding = '2rem';
                            cardExpanded.style.display = 'none';
                            cardExpanded.style.position = 'relative';
                            cardExpanded.style.backgroundImage = `url('${tech.image}')`;
                            cardExpanded.style.backgroundSize = 'cover';
                            cardExpanded.style.backgroundPosition = 'center';
                            
                            // add overlay for readability
                            const expandedOverlay = document.createElement('div');
                            expandedOverlay.style.position = 'absolute';
                            expandedOverlay.style.top = '0';
                            expandedOverlay.style.left = '0';
                            expandedOverlay.style.width = '100%';
                            expandedOverlay.style.height = '100%';
                            expandedOverlay.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 1) 100%)';
                            expandedOverlay.style.zIndex = '1';
                            cardExpanded.appendChild(expandedOverlay);
                            
                            // content wrapper to sit above the overlay
                            const contentWrapper = document.createElement('div');
                            contentWrapper.style.position = 'relative';
                            contentWrapper.style.zIndex = '2';
                            
                            const expandedHeader = document.createElement('div');
                            expandedHeader.style.display = 'flex';
                            expandedHeader.style.justifyContent = 'space-between';
                            expandedHeader.style.alignItems = 'center';
                            expandedHeader.style.marginBottom = '1.5rem';
                            
                            const expandedTitle = document.createElement('h3');
                            expandedTitle.textContent = tech.title;
                            expandedTitle.style.color = 'white';
                            expandedTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            expandedTitle.style.fontSize = '1.5rem';
                            expandedTitle.style.margin = '0';
                            expandedHeader.appendChild(expandedTitle);
                            
                            const closeButton = document.createElement('button');
                            closeButton.innerHTML = '&times;';
                            closeButton.style.background = 'transparent';
                            closeButton.style.border = 'none';
                            closeButton.style.color = 'white';
                            closeButton.style.fontSize = '1.5rem';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.borderRadius = '50%';
                            closeButton.style.display = 'flex';
                            closeButton.style.justifyContent = 'center';
                            closeButton.style.alignItems = 'center';
                            closeButton.style.transition = 'background 0.3s ease';
                            
                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.background = 'rgba(0, 128, 255, 0.8)';
                            });
                            
                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.background = 'transparent';
                            });
                            
                            closeButton.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playCloseSound();
                                collapseCard(card);
                            });
                            
                            expandedHeader.appendChild(closeButton);
                            contentWrapper.appendChild(expandedHeader);
                            
                            const targetInfo = document.createElement('div');
                            targetInfo.style.display = 'flex';
                            targetInfo.style.alignItems = 'center';
                            targetInfo.style.marginBottom = '1.5rem';
                            targetInfo.style.padding = '1rem';
                            targetInfo.style.borderRadius = '6px';
                            targetInfo.style.backgroundColor = 'rgba(0, 128, 255, 0.3)';
                            targetInfo.style.border = '1px solid rgba(0, 128, 255, 0.2)';
                            
                            const targetLabel = document.createElement('div');
                            targetLabel.textContent = 'TARGET:';
                            targetLabel.style.fontFamily = 'Source Code Pro, sans-serif';
                            targetLabel.style.fontWeight = 'bold';
                            targetLabel.style.fontSize = '0.9rem';
                            targetLabel.style.color = 'rgb(106, 180, 255)';
                            targetLabel.style.marginRight = '1rem';
                            targetInfo.appendChild(targetLabel);
                            
                            const targetValue = document.createElement('div');
                            targetValue.textContent = tech.target;
                            targetValue.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            targetValue.style.fontWeight = 'bold';
                            targetValue.style.fontSize = '1.1rem';
                            targetValue.style.color = 'white';
                            targetInfo.appendChild(targetValue);
                            
                            contentWrapper.appendChild(targetInfo);
                            
                            const description = document.createElement('p');
                            description.textContent = tech.description;
                            description.style.color = 'rgb(200, 200, 200)';
                            description.style.fontFamily = 'Source Code Pro, sans-serif';
                            description.style.lineHeight = '1.6';
                            description.style.marginBottom = '2rem';
                            contentWrapper.appendChild(description);
                            
                            const detailsContainer = document.createElement('div');
                            detailsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                            detailsContainer.style.padding = '1.5rem';
                            detailsContainer.style.borderRadius = '8px';
                            detailsContainer.style.marginBottom = '1rem';
                            
                            const detailsTitle = document.createElement('h4');
                            detailsTitle.textContent = 'TECHNICAL SPECIFICATIONS';
                            detailsTitle.style.color = 'white';
                            detailsTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            detailsTitle.style.fontSize = '1rem';
                            detailsTitle.style.marginTop = '0';
                            detailsTitle.style.marginBottom = '1rem';
                            detailsContainer.appendChild(detailsTitle);
                            
                            const detailsList = document.createElement('ul');
                            detailsList.style.padding = '0 0 0 1.5rem';
                            detailsList.style.margin = '0';
                            
                            tech.details.forEach(detail => {
                                const detailItem = document.createElement('li');
                                detailItem.textContent = detail;
                                detailItem.style.color = 'rgb(180, 180, 180)';
                                detailItem.style.fontFamily = 'Source Code Pro, sans-serif';
                                detailItem.style.marginBottom = '0.75rem';
                                detailItem.style.lineHeight = '1.5';
                                detailsList.appendChild(detailItem);
                            });
                            
                            detailsContainer.appendChild(detailsList);
                            contentWrapper.appendChild(detailsContainer);
                            
                            // spec readout
                            const specReadout = document.createElement('div');
                            specReadout.style.display = 'flex';
                            specReadout.style.justifyContent = 'space-between';
                            specReadout.style.marginTop = '1.5rem';
                            specReadout.style.marginBottom = '0.5rem';
                            
                            // spec indicators - static values unique to each tech
                            let specIndicators;
                            
                            switch(tech.id) {
                                case 'aero-skimmers':
                                    specIndicators = [
                                        { label: 'POWER', value: 75 },
                                        { label: 'EFFICIENCY', value: 97 },
                                        { label: 'DURABILITY', value: 82 }
                                    ];
                                    break;
                                case 'mining-swarms':
                                    specIndicators = [
                                        { label: 'POWER', value: 83 },
                                        { label: 'EFFICIENCY', value: 89 },
                                        { label: 'DURABILITY', value: 79 }
                                    ];
                                    break;
                                case 'hydro-siphons':
                                    specIndicators = [
                                        { label: 'POWER', value: 90 },
                                        { label: 'EFFICIENCY', value: 92 },
                                        { label: 'DURABILITY', value: 85 }
                                    ];
                                    break;
                                case 'frost-maws':
                                    specIndicators = [
                                        { label: 'POWER', value: 93 },
                                        { label: 'EFFICIENCY', value: 78 },
                                        { label: 'DURABILITY', value: 84 }
                                    ];
                                    break;
                                case 'mantle-bores':
                                    specIndicators = [
                                        { label: 'POWER', value: 95 },
                                        { label: 'EFFICIENCY', value: 87 },
                                        { label: 'DURABILITY', value: 94 }
                                    ];
                                    break;
                                case 'core-shredders':
                                    specIndicators = [
                                        { label: 'POWER', value: 99 },
                                        { label: 'EFFICIENCY', value: 82 },
                                        { label: 'DURABILITY', value: 88 }
                                    ];
                                    break;
                                case 'vortex-converters':
                                    specIndicators = [
                                        { label: 'POWER', value: 100 },
                                        { label: 'EFFICIENCY', value: 90 },
                                        { label: 'DURABILITY', value: 83 }
                                    ];
                                    break;
                                case 'quantum-nexus':
                                    specIndicators = [
                                        { label: 'POWER', value: 92 },
                                        { label: 'EFFICIENCY', value: 100 },
                                        { label: 'DURABILITY', value: 97 }
                                    ];
                                    break;
                                default:
                                    specIndicators = [
                                        { label: 'POWER', value: 85 },
                                        { label: 'EFFICIENCY', value: 85 },
                                        { label: 'DURABILITY', value: 85 }
                                    ];
                            }
                            
                            specIndicators.forEach(spec => {
                                const specItem = document.createElement('div');
                                specItem.style.flex = '1';
                                specItem.style.padding = '0 10px';
                                specItem.style.textAlign = 'center';
                                
                                const specLabel = document.createElement('div');
                                specLabel.textContent = spec.label;
                                specLabel.style.color = 'rgba(200, 200, 200, 0.8)';
                                specLabel.style.fontSize = '0.8rem';
                                specLabel.style.fontFamily = 'Source Code Pro, sans-serif';
                                specLabel.style.marginBottom = '5px';
                                specItem.appendChild(specLabel);
                                
                                const specBarContainer = document.createElement('div');
                                specBarContainer.style.width = '100%';
                                specBarContainer.style.height = '4px';
                                specBarContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                specBarContainer.style.borderRadius = '2px';
                                specBarContainer.style.overflow = 'hidden';
                                specBarContainer.style.marginBottom = '5px';
                                
                                const specBar = document.createElement('div');
                                specBar.style.width = '0%';
                                specBar.style.height = '100%';
                                specBar.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                specBar.style.borderRadius = '2px';
                                specBarContainer.appendChild(specBar);
                                specItem.appendChild(specBarContainer);
                                
                                const specValue = document.createElement('div');
                                specValue.textContent = '0%';
                                specValue.style.color = 'rgba(0, 128, 255, 0.9)';
                                specValue.style.fontSize = '1rem';
                                specValue.style.fontFamily = 'Source Code Pro, sans-serif';
                                specValue.style.fontWeight = 'bold';
                                specItem.appendChild(specValue);
                                
                                specReadout.appendChild(specItem);
                                
                                specBar.style.transition = "none";
                                specBar.style.width = `${spec.value}%`;
                                specValue.textContent = `${Math.floor(spec.value)}%`;
                            });
                            
                            contentWrapper.appendChild(specReadout);
                            cardExpanded.appendChild(contentWrapper);
                            
                            card.appendChild(cardCollapsed);
                            card.appendChild(cardExpanded);
                            
                            // hover effects for collapsed card
                            card.addEventListener('mouseenter', () => {
                                if (expandedCardId !== card.id) {
                                    playHoverSound3();
                                    cardImage.style.transform = 'scale(1.1)';
                                }
                            });
                            
                            card.addEventListener('mouseleave', () => {
                                if (expandedCardId !== card.id) {
                                    cardImage.style.transform = 'scale(1)';
                                }
                            });
                            
                            card.addEventListener('click', () => {
                                if (expandedCardId !== card.id) {
                                    playClickSound();
                                    expandCard(card);
                                }
                            });
                            
                            techGrid.appendChild(card);
                        });
                        
                        // function to expand cards
                        function expandCard(card) {
                            // if another card is already expanded, collapse it first
                            if (expandedCardId) {
                                const previousCard = document.getElementById(expandedCardId);
                                collapseCard(previousCard, false);
                            }
                            expandedCardId = card.id;
                            
                            // expand card
                            card.style.gridColumn = 'span 2';
                            card.style.maxHeight = '900px';
                            card.style.zIndex = '2';
                            card.style.boxShadow = '0 10px 30px rgba(0, 0, 128, 0.3)';
                            
                            //show expanded content
                            const cardCollapsed = card.querySelector('.card-collapsed');
                            const cardExpanded = card.querySelector('.card-expanded');
                            
                            cardCollapsed.style.display = 'none';
                            cardExpanded.style.display = 'block';
                            
                            // scroll to the card
                            setTimeout(() => {
                                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                        }
                        
                        // function to collapse cards
                        function collapseCard(card, playSound = true) {
                            expandedCardId = null;
                            
                            // collapse card
                            card.style.gridColumn = 'span 1';
                            card.style.maxHeight = '260px';
                            card.style.zIndex = '1';
                            card.style.boxShadow = 'none';
                            
                            // hide content
                            const cardCollapsed = card.querySelector('.card-collapsed');
                            const cardExpanded = card.querySelector('.card-expanded');
                            
                            cardCollapsed.style.display = 'flex';
                            cardExpanded.style.display = 'none';
                        }

                        techSection.appendChild(techTitle);
                        techSection.appendChild(techDivider);
                        techSection.appendChild(techSubtitle);
                        techSection.appendChild(techGrid);
                        techSection.appendChild(descriptionText);
                        techSection.appendChild(buttonContainer);

                        content.appendChild(techSection);
                        
                        // efficiency metrics
                        const metricsSection = document.createElement('div');
                        metricsSection.style.marginBottom = '6rem';
                        
                        const metricsTitle = document.createElement('h2');
                        metricsTitle.textContent = "EXTRACTION EFFICIENCY METRICS";
                        metricsTitle.style.fontSize = '1.75rem';
                        metricsTitle.style.marginBottom = '3rem';
                        metricsTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        metricsTitle.style.color = 'white';
                        metricsTitle.style.textAlign = 'center';
                        
                        const metricsGrid = document.createElement('div');
                        metricsGrid.style.display = 'grid';
                        metricsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                        metricsGrid.style.gap = '2rem';
                        
                        const metricsMediaQuery = window.matchMedia('(max-width: 768px)');
                        
                        function handleMetricsScreenChange(e) {
                            if (e.matches) {
                                metricsGrid.style.gridTemplateColumns = '1fr';
                            } else {
                                metricsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                            }
                        }
                        
                        handleMetricsScreenChange(metricsMediaQuery);
                        metricsMediaQuery.addEventListener('change', handleMetricsScreenChange);
                        
                        const metrics = [
                            {
                                value: "99.97%",
                                label: "Resource Recovery Rate",
                                description: "Our extraction operations achieve near-perfect recovery rates across all material types."
                            },
                            {
                                value: "6.3×10²³",
                                label: "Tons Harvested",
                                description: "Total raw resources extracted and processed for stakeholder benefit to date."
                            },
                            {
                                value: "7.3×10⁶",
                                label: "Celestial Bodies Cataloged",
                                description: "Total number of planets, moons, and asteroids fully logged since operations began."
                            },
                            {
                                value: "3-4%",
                                label: "Operational Overhead",
                                description: "Industry-leading efficiency ratio of operational costs to resource value."
                            },
                            {
                                value: "18 Days",
                                label: "Break-even Point",
                                description: "Total number of planets, moons, and asteroids fully harvested since operations began."
                            },
                            {
                                value: ">30%",
                                label: "Average ROI",
                                description: "Typical return on investment for stakeholders and mining operations."
                            },
                        ];
                        
                        metrics.forEach(metric => {
                            const metricCard = document.createElement('div');
                            metricCard.style.backgroundColor = 'rgba(16, 16, 16, 0.6)';
                            metricCard.style.border = '1px solid rgba(0, 128, 255, 0.2)';
                            metricCard.style.borderRadius = '8px';
                            metricCard.style.padding = '2rem';
                            metricCard.style.display = 'flex';
                            metricCard.style.flexDirection = 'column';
                            metricCard.style.alignItems = 'center';
                            metricCard.style.textAlign = 'center';
                            metricCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                            
                            metricCard.addEventListener('mouseenter', () => {
                                playHoverSound3();
                                metricCard.style.transform = 'translateY(-10px)';
                                metricCard.style.boxShadow = '0 15px 30px rgba(0, 128, 255, 0.2)';
                            });
                            
                            metricCard.addEventListener('mouseleave', () => {
                                metricCard.style.transform = 'translateY(0)';
                                metricCard.style.boxShadow = 'none';
                            });
                            
                            const metricValue = document.createElement('h3');
                            metricValue.textContent = metric.value;
                            metricValue.style.fontSize = '2.5rem';
                            metricValue.style.marginBottom = '0.5rem';
                            metricValue.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            metricValue.style.color = 'rgba(0, 128, 255, 0.9)';
                            
                            const metricLabel = document.createElement('h4');
                            metricLabel.textContent = metric.label;
                            metricLabel.style.fontSize = '1.1rem';
                            metricLabel.style.marginBottom = '1rem';
                            metricLabel.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            metricLabel.style.color = 'white';
                            
                            const metricDesc = document.createElement('p');
                            metricDesc.textContent = metric.description;
                            metricDesc.style.fontSize = '0.9rem';
                            metricDesc.style.lineHeight = '1.6';
                            metricDesc.style.fontFamily = 'Source Code Pro, sans-serif';
                            metricDesc.style.color = 'rgb(209, 213, 219)';
                            
                            metricCard.appendChild(metricValue);
                            metricCard.appendChild(metricLabel);
                            metricCard.appendChild(metricDesc);
                            
                            metricsGrid.appendChild(metricCard);
                        });
                        
                        metricsSection.appendChild(metricsTitle);
                        metricsSection.appendChild(metricsGrid);

                        const disclaimerText = document.createElement('p');
                        disclaimerText.innerHTML = '<img src="warning.png" style="height: 1.8rem; vertical-align: middle; margin-right: 12px; \
position: relative; top: -3px; opacity: 0.6;"><span style="font-size: 1.6rem; font-weight: bold; font-style:normal;">LIABILITY NOTICE:</span>\n\n \
The Elysium Initiative assumes no liability for laceration, dismemberment, spaghettification, or other bodily injury resulting from misuse \
of provided equipment.';
                        disclaimerText.style.whiteSpace = 'pre-wrap'
                        disclaimerText.style.color = 'rgba(255, 255, 255, 0.6)';
                        disclaimerText.style.fontSize = '1.2rem';
                        disclaimerText.style.textAlign = 'center';
                        disclaimerText.style.marginTop = '20px';
                        disclaimerText.style.fontStyle = 'italic';
                        disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        disclaimerText.style.backgroundColor = 'rgba(51, 51, 51, 0.1)';
                        disclaimerText.style.padding = '2rem';
                        disclaimerText.style.borderRadius = '8px';
                        disclaimerText.style.border = '2px solid rgba(255, 50, 50, 0.2)';
                        disclaimerText.style.maxWidth = '800px';
                        disclaimerText.style.margin = '3rem auto';
                        
                        // footer
                        const footer = document.createElement('div');
                        footer.style.textAlign = 'center';
                        footer.style.paddingBottom = '2rem';
                        footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                        footer.style.paddingTop = '2rem';
                        footer.style.maxWidth = '700px';
                        footer.style.margin = '4rem auto 0rem auto';
                        
                        const footerText = document.createElement('p');
                        footerText.textContent = "© 2202 The Elysium Initiative. All rights reserved across the spacetime continuum.";
                        footerText.style.fontSize = '0.9rem';
                        footerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        footerText.style.color = 'rgba(209, 213, 219, 0.6)';
                        footerText.style.marginBottom = '200px';
                        
                        footer.appendChild(footerText);
                        
                        content.appendChild(metricsSection);
                        content.appendChild(disclaimerText);
                        content.appendChild(footer);
                        
                        catalogPage.appendChild(content);
                        document.body.appendChild(catalogPage);
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
                        closeAllPages();
                        sidebar.classList.remove('active');
                        container.style.display = 'none';
                        
                        const getawaysPage = document.createElement('div');
                        getawaysPage.id = 'getaways-page';
                        getawaysPage.style.minHeight = '100vh';
                        getawaysPage.style.height = '100%';
                        getawaysPage.style.backgroundColor = 'black';
                        getawaysPage.style.color = 'white';
                        getawaysPage.style.padding = '120px 0 2rem 0';
                        getawaysPage.style.display = 'flex';
                        getawaysPage.style.flexDirection = 'column';
                        getawaysPage.style.justifyContent = 'flex-start';
                        getawaysPage.style.position = 'fixed';
                        getawaysPage.style.top = '0';
                        getawaysPage.style.left = '0';
                        getawaysPage.style.right = '0';
                        getawaysPage.style.bottom = '0';
                        getawaysPage.style.overflowY = 'auto';
                        
                        // destination section
                        const destinationSection = document.createElement('div');
                        destinationSection.id = 'destination-section';
                        
                        const destinationHeader = document.createElement('div');
                        destinationHeader.style.maxWidth = '1400px';
                        destinationHeader.style.margin = '0 auto 2rem auto';

                        const destinationTitle = document.createElement('h2');
                        destinationTitle.textContent = 'EXTRAORDINARY DESTINATIONS';
                        destinationTitle.style.fontSize = '4rem';
                        destinationTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        destinationTitle.style.color = 'white';
                        destinationTitle.style.textAlign = 'center';
                        destinationTitle.style.maxWidth = '1000px';
                        destinationTitle.style.margin = '3rem auto 2rem auto';
                        
                        const destinationDivider = document.createElement('div');
                        destinationDivider.style.width = '160px';
                        destinationDivider.style.height = '4px';
                        destinationDivider.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                        destinationDivider.style.margin = '2rem auto 2rem auto';

                        const destinationSubtitle = document.createElement('div');
                        destinationSubtitle.textContent = 'Book your next vacation at one of our stunning synthetic planets, made entirely of recycled material surplus.';
                        destinationSubtitle.style.fontSize = '1rem';
                        destinationSubtitle.style.fontFamily = 'Source Code Pro, sans-serif';
                        destinationSubtitle.style.color = 'rgb(209, 213, 219)';
                        destinationSubtitle.style.textAlign = 'center';
                        destinationSubtitle.style.maxWidth = '700px';
                        destinationSubtitle.style.margin = '3rem auto 1.5rem auto';
                        
                        destinationHeader.appendChild(destinationTitle);
                        destinationHeader.appendChild(destinationDivider);
                        destinationHeader.appendChild(destinationSubtitle);
                        
                        // category filter
                        const filterContainer = document.createElement('div');
                        filterContainer.style.display = 'flex';
                        filterContainer.style.justifyContent = 'center';
                        filterContainer.style.margin = '3rem auto 0 auto';
                        filterContainer.style.flexWrap = 'wrap';
                        filterContainer.style.gap = '1rem';
                        
                        const filterCategories = [
                            { id: 'all', name: 'ALL DESTINATIONS' },
                            { id: 'adventure', name: 'ADVENTURE TOURS' },
                            { id: 'dream', name: 'DREAM WORLDS' },
                            { id: 'elite', name: 'ELITE COLLECTION' }
                        ];
                        
                        let activeFilter = 'all';
                        
                        filterCategories.forEach(category => {
                            const filterButton = document.createElement('button');
                            filterButton.textContent = category.name;
                            filterButton.dataset.category = category.id;
                            filterButton.style.padding = '0.75rem 1.5rem';
                            filterButton.style.fontSize = '0.9rem';
                            filterButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            filterButton.style.backgroundColor = category.id === 'all' ? 'rgba(0, 128, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';
                            filterButton.style.color = 'white';
                            filterButton.style.border = 'none';
                            filterButton.style.borderRadius = '4px';
                            filterButton.style.cursor = 'pointer';
                            filterButton.style.transition = 'all 0.3s ease';
                            filterButton.style.margin = '0.5rem';
                            
                            filterButton.addEventListener('mouseenter', () => {
                                if (filterButton.dataset.category !== activeFilter) {
                                    playHoverSound2();
                                    filterButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                }
                            });
                            
                            filterButton.addEventListener('mouseleave', () => {
                                if (filterButton.dataset.category !== activeFilter) {
                                    filterButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }
                            });
                            
                            filterButton.addEventListener('click', () => {
                                if (filterButton.dataset.category !== activeFilter) {
                                    playHoverSound3();
                                    
                                    // update active filter
                                    document.querySelectorAll('[data-category]').forEach(btn => {
                                        if (btn.dataset.category === filterButton.dataset.category) {
                                            btn.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                        } else {
                                            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                        }
                                    });
                                    
                                    activeFilter = filterButton.dataset.category;
                                    
                                    // filter destinations
                                    const destinations = document.querySelectorAll('.destination-card');
                                    destinations.forEach(card => {
                                        if (activeFilter === 'all' || card.dataset.categories.includes(activeFilter)) {
                                            card.style.display = 'block';
                                        } else {
                                            card.style.display = 'none';
                                        }
                                    });
                                }
                            });
                            
                            filterContainer.appendChild(filterButton);
                        });
                        
                        destinationHeader.appendChild(filterContainer);
                        destinationSection.appendChild(destinationHeader);
                        
                        // destinations grid
                        const destinationsGrid = document.createElement('div');
                        destinationsGrid.style.display = 'grid';
                        destinationsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
                        destinationsGrid.style.gap = '2rem';
                        destinationsGrid.style.maxWidth = '1200px';
                        destinationsGrid.style.margin = '0 auto';
                        
                        // destination data
                        const destinations = [
                            {
                                name: "Elysium Prime",
                                description: "Experience the pinnacle of luxury space tourism at Elysium Prime, our flagship \
synthetic planet. Enjoy a perfect year-round climate, stunning crystalline coastlines, and an endless number of parks, resorts, \
and casinos on this masterpiece of indulgence.",
                                image: "elysium_prime.jpg",
                                price: 1900000,
                                rating: 5,
                                categories: ["elite"],
                                features: [
                                    "White-sand beaches",
                                    "Shoreline villas",
                                    "Five-star restaurants",
                                    "Award-winning resorts and casinos",
                                    "Ultra-luxury shopping districts",
                                    "Worldwide hover transport",
                                    "Freedom from insects, pests, and irritants",
                                    "Wellness centers open day-round",
                                    "Immersive tourist experiences",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Neochroma",
                                description: "Step into a vibrant, neon world and year-round nightlife with Neochroma. Perfect \
for thrill-seekers, partygoers, and festival enthusiasts, this is a planet that never sleeps.",
                                image: "neochroma.jpg",
                                price: 750000,
                                rating: 4.8,
                                categories: ["dream"],
                                features: [
                                    "Eternal night, illuminated by fluorescent cloud cover",
                                    "Neon-lit megacities",
                                    "Diverse entertainment districts",
                                    "Party cruises",
                                    "Neverending music festivals",
                                    "Bioluminescent wildlife",
                                    "Virtual reality arenas",
                                    "Ultra-modern accommodations",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Cerula Polaris",
                                description: "Cerula Polaris is an escape to ultimate serenity. Tour our sprawling snowy forests, \
climb the tallest mountain peaks, or soak up the auroras on this stunning arctic world.",
                                image: "cerula_polaris.jpg",
                                price: 680000,
                                rating: 4.7,
                                categories: ["dream"],
                                features: [
                                    "Sightseeing tours",
                                    "Crystalline caverns",
                                    "Glass observation domes",
                                    "Luxury thermal spas",
                                    "Authentic chalet lodges",
                                    "Guided glacier expeditions",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Syluna",
                                description: "Experience the ethereal beauty of Syluna. With its swirling skies and sprawling landscapes, \
this dreamlike paradise offers a perfect balance of tranquility and visual wonder for the discerning traveler.",
                                image: "syluna.jpg",
                                price: 840000,
                                rating: 4.6,
                                categories: ["dream"],
                                features: [
                                    "Floating observation platforms",
                                    "Gravity-defying cloud villas",
                                    "Resonance chamber concerts",
                                    "Dream-enhancement spas",
                                    "Meditative sky gardens",
                                    "Panoramic celestial viewing domes",
                                    "Gourmet cuisine",
                                    "Climate-controlled suites",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Edenvale",
                                description: "Find your adventure in the lush rainforests of Edenvale, a world teeming with exotic \
wildlife and vibrant foliage. From towering canopies to secluded groves, this paradise offers authentic wilderness expeditions for those \
with an unrelenting thirst for discovery.",
                                image: "edenvale.jpg",
                                price: 1500000,
                                rating: 5,
                                categories: ["adventure", "elite"],
                                features: [
                                    "Guided expeditions",
                                    "Canopy walkway networks",
                                    "Luxury treehouse accommodations",
                                    "Waterfall rappelling adventures",
                                    "Bioluminescent night tours",
                                    "Immersive wildlife encounters",
                                    "Exotic rainforest cuisine",
                                    "Private river cruises",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Umbra Solace",
                                description: "Discover the mysterious beauty of Umbra Solace, a world kissed by eternal twilight. The \
hauntingly beautiful world of Umbra Solace offers a rare escape for those seeking solitude, reflection, and respite from the stress of 23rd \
century existence.",
                                image: "umbra_solace.jpg",
                                price: 590000,
                                rating: 4.5,
                                categories: ["dream"],
                                features: [
                                    "Silent meditation chambers",
                                    "Classic and contemporary art galleries",
                                    "Starlight dining experiences",
                                    "Sensory deprivation chambers",
                                    "Custom isolation retreats",
                                    "Twilight photography shoots",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Halios Deep",
                                description: "Venture into the mesmerizing depths of Halios Deep, a world whose shroud of darkness is broken \
only by bioluminescent life. Perfect for courageous explorers drawn to the mysteries beneath the waves, this is a truly awe-inspiring journey \
into the unknown.",
                                image: "halios_deep.jpg",
                                price: 1600000,
                                rating: 5,
                                categories: ["adventure", "elite"],
                                features: [
                                    "Transparent habitation domes",
                                    "Deep sea exploration submarines",
                                    "Enchanting bioluminescent wildlife",
                                    "Oceanic cuisine",
                                    "Pressure-adaptive luxury suites",
                                    "Glowing marine life sanctuaries",
                                    "Exclusive deep ocean research expeditions",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Seraph Vesa",
                                description: "The serene haven of Seraph Vesa provides a moving experience of spiritual renewal, \
catering to those in pursuit of peace and introspection. Open your mind and feel lifted beyond corporeal existence.",
                                image: "seraph_vesa.jpg",
                                price: 480000,
                                rating: 4.4,
                                categories: ["dream"],
                                features: [
                                    "Antigravity meditation gardens",
                                    "Celestial music pavilions",
                                    "Aerial dance platforms",
                                    "Personalized spiritual experiences",
                                    "Vapor bath rejuvenation centers",
                                    "Light therapy sanctuaries",
                                    "And more!"
                                ]
                            },
                            {
                                name: "Pyraxis",
                                description: "Embrace the primal power of Pyraxis, a world ablaze with molten rock and obsidian \
marbling. This volcanic planet offers a plethora of extreme experiences for adventurers, thrill-seekers, and adrenaline junkies.",
                                image: "pyraxis.jpg",
                                price: 620000,
                                rating: 4.7,
                                categories: ["dream"],
                                features: [
                                    "Thermal-resistant observation suites",
                                    "Lava field expeditions",
                                    "Heat-resistant expedition gear",
                                    "Extreme sport centers",
                                    "Geothermal spa treatments",
                                    "Igneous art galleries",
                                    "Volcanic island retreats",
                                    "And more!"
                                ]
                            }
                        ];
                        
                        // create destination cards
                        destinations.forEach(dest => {
                            const card = document.createElement('div');
                            card.className = 'destination-card';
                            card.dataset.categories = JSON.stringify(dest.categories);
                            card.style.backgroundColor = 'rgba(5, 15, 30, 0.8)';
                            card.style.borderRadius = '8px';
                            card.style.overflow = 'hidden';
                            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                            card.style.transition = 'box-shadow 0.3s ease';
                            card.style.cursor = 'pointer';
                            card.style.position = 'relative';
                            card.style.transform = 'translateY(0)';

                            card.addEventListener('mouseenter', () => {
                                playHoverSound3();
                                card.style.transform = 'translateY(-10px)';
                                card.style.boxShadow = '0 20px 50px rgba(0, 128, 255, 0.2)';
                            });

                            card.addEventListener('mouseleave', () => {
                                card.style.transform = 'translateY(0)';
                                card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                            });

                            card.addEventListener('click', (e) => {
                                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                                    return;
                                }
                                playClickSound();
                                showDestinationDetails(dest);
                            });
                            
                            // image container with gradient overlay
                            const imageContainer = document.createElement('div');
                            imageContainer.style.position = 'relative';
                            imageContainer.style.height = '220px';
                            imageContainer.style.overflow = 'hidden';
                            
                            const image = document.createElement('img');
                            image.src = dest.image;
                            image.alt = dest.name;
                            image.style.width = '100%';
                            image.style.height = '100%';
                            image.style.objectFit = 'cover';
                            image.style.transition = 'transform 0.5s ease';
                            
                            card.addEventListener('mouseenter', () => {
                                image.style.transform = 'scale(1.1)';
                            });
                            
                            card.addEventListener('mouseleave', () => {
                                image.style.transform = 'scale(1)';
                            });
                            
                            const overlay = document.createElement('div');
                            overlay.style.position = 'absolute';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)';
                            
                            // badge for elite destinations
                            if (dest.categories.includes('elite')) {
                                const eliteBadge = document.createElement('div');
                                eliteBadge.textContent = 'ELITE';
                                eliteBadge.style.position = 'absolute';
                                eliteBadge.style.top = '1rem';
                                eliteBadge.style.right = '1rem';
                                eliteBadge.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
                                eliteBadge.style.color = '#000';
                                eliteBadge.style.padding = '0.3rem 0.8rem';
                                eliteBadge.style.fontSize = '0.8rem';
                                eliteBadge.style.fontWeight = 'bold';
                                eliteBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                eliteBadge.style.borderRadius = '4px';
                                eliteBadge.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                                eliteBadge.style.zIndex = '5';
                                imageContainer.appendChild(eliteBadge);
                            }
                            
                            imageContainer.appendChild(image);
                            imageContainer.appendChild(overlay);
                            card.appendChild(imageContainer);
                            
                            // card content
                            const content = document.createElement('div');
                            content.style.padding = '1.5rem';
                            
                            // title and rating
                            const titleRow = document.createElement('div');
                            titleRow.style.display = 'flex';
                            titleRow.style.justifyContent = 'space-between';
                            titleRow.style.alignItems = 'center';
                            titleRow.style.marginBottom = '0.5rem';
                            
                            const title = document.createElement('h3');
                            title.textContent = dest.name;
                            title.style.margin = '0';
                            title.style.fontSize = '1.4rem';
                            title.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            title.style.color = 'white';
                            
                            const ratingContainer = document.createElement('div');
                            ratingContainer.style.display = 'flex';
                            ratingContainer.style.alignItems = 'center';
                            
                            // generate stars based on rating
                            const fullStars = Math.floor(dest.rating);
                            const hasHalfStar = dest.rating % 1 >= 0.5;
                            
                            for (let i = 0; i < 5; i++) {
                                const star = document.createElement('span');
                                if (i < fullStars) {
                                    star.innerHTML = '★'; // full star
                                    star.style.color = 'rgba(255, 215, 0, 0.9)';
                                } else if (i === fullStars && hasHalfStar) {
                                    star.innerHTML = '★'; // half star
                                    star.style.color = 'rgba(255, 215, 0, 0.5)';
                                } else {
                                    star.innerHTML = '★'; // empty star
                                    star.style.color = 'rgba(255, 255, 255, 0.2)';
                                }
                                star.style.fontSize = '1rem';
                                ratingContainer.appendChild(star);
                            }
                            
                            titleRow.appendChild(title);
                            titleRow.appendChild(ratingContainer);
                            content.appendChild(titleRow);
                            
                            // description
                            const description = document.createElement('p');
                            // truncate description if it's over 80 characters
                            const truncatedDescription = dest.description.length > 80 ? 
                                                        dest.description.substring(0, 80) + '...' : 
                                                        dest.description;
                            description.textContent = truncatedDescription;
                            description.style.margin = '0 0 1.5rem 0';
                            description.style.fontSize = '0.9rem';
                            description.style.lineHeight = '1.5';
                            description.style.color = 'rgba(255, 255, 255, 0.7)';
                            description.style.fontFamily = 'Source Code Pro, sans-serif';
                            content.appendChild(description);
                            
                            // price and button row
                            const actionRow = document.createElement('div');
                            actionRow.style.display = 'flex';
                            actionRow.style.justifyContent = 'space-between';
                            actionRow.style.alignItems = 'center';
                            
                            const price = document.createElement('div');
                            price.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold; color: white;">${dest.price.toLocaleString()}</span> <span style="color: rgba(255, 255, 255, 0.5); font-size: 0.8rem;">SCS™/week</span>`;
                            price.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            const viewButton = document.createElement('button');
                            viewButton.textContent = 'VIEW';
                            viewButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            viewButton.style.color = 'white';
                            viewButton.style.border = 'none';
                            viewButton.style.borderRadius = '4px';
                            viewButton.style.padding = '0.5rem 1.5rem';
                            viewButton.style.fontSize = '0.9rem';
                            viewButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            viewButton.style.cursor = 'pointer';
                            viewButton.style.transition = 'all 0.3s ease';
                            
                            viewButton.addEventListener('mouseenter', (e) => {
                                e.stopPropagation();
                                playHoverSound2();
                                viewButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                                viewButton.style.transform = 'scale(1.05)';
                            });
                            
                            viewButton.addEventListener('mouseleave', (e) => {
                                e.stopPropagation();
                                viewButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                viewButton.style.transform = 'scale(1)';
                            });
                            
                            viewButton.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playClickSound();
                                showDestinationDetails(dest);
                            });
                            
                            actionRow.appendChild(price);
                            actionRow.appendChild(viewButton);
                            content.appendChild(actionRow);
                            
                            card.appendChild(content);
                            destinationsGrid.appendChild(card);
                        });
                        
                        destinationSection.appendChild(destinationsGrid);
                        getawaysPage.appendChild(destinationSection);
                        
                        // featured experience section
                        const featuredSection = document.createElement('div');
                        featuredSection.style.position = 'relative';
                        featuredSection.style.padding = '8rem 2rem';
                        
                        // featured overlay
                        const featuredOverlay = document.createElement('div');
                        featuredOverlay.style.position = 'absolute';
                        featuredOverlay.style.top = '0';
                        featuredOverlay.style.left = '0';
                        featuredOverlay.style.width = '100%';
                        featuredOverlay.style.height = '100%';
                        featuredOverlay.style.backgroundColor = 'transparent';
                        featuredOverlay.style.zIndex = '1';
                        
                        const featuredContent = document.createElement('div');
                        featuredContent.style.position = 'relative';
                        featuredContent.style.zIndex = '2';
                        featuredContent.style.maxWidth = '800px';
                        featuredContent.style.margin = '0 auto';
                        featuredContent.style.textAlign = 'center';
                        
                        const featuredLabel = document.createElement('div');
                        featuredLabel.textContent = 'FEATURED EXPERIENCE';
                        featuredLabel.style.color = 'rgba(0, 128, 255, 0.9)';
                        featuredLabel.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        featuredLabel.style.fontSize = '1.75rem';
                        featuredLabel.style.marginBottom = '1rem';
                        featuredLabel.style.letterSpacing = '2px';
                        
                        const featuredTitle = document.createElement('h2');
                        featuredTitle.textContent = 'ELYSIUM PRIME';
                        featuredTitle.style.color = 'white';
                        featuredTitle.style.fontFamily = 'Havelock Titling Bold, sans-serif';
                        featuredTitle.style.fontSize = '3rem';
                        featuredTitle.style.marginBottom = '2rem';
                        featuredTitle.style.textShadow = '0 0 20px rgba(0, 128, 255, 0.4)';
                        
                        const featuredDescription = document.createElement('p');
                        featuredDescription.textContent = 'Our most beautiful synthetic planet to date, Elysium Prime is the pinnacle of 23rd century astroengineering. Relax on pristine beaches, explore lush parks, and enjoy the finest in luxury accommodations on this one-of-a-kind world.';
                        featuredDescription.style.color = 'rgba(255, 255, 255, 0.9)';
                        featuredDescription.style.fontFamily = 'Source Code Pro, sans-serif';
                        featuredDescription.style.fontSize = '1.2rem';
                        featuredDescription.style.lineHeight = '1.8';
                        featuredDescription.style.marginBottom = '3rem';
                        
                        const featuredButton = document.createElement('button');
                        featuredButton.textContent = 'BOOK TODAY';
                        featuredButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                        featuredButton.style.color = 'white';
                        featuredButton.style.border = 'none';
                        featuredButton.style.borderRadius = '4px';
                        featuredButton.style.padding = '1rem 2.5rem';
                        featuredButton.style.fontSize = '1.2rem';
                        featuredButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        featuredButton.style.cursor = 'pointer';
                        featuredButton.style.transition = 'all 0.3s ease';
                        featuredButton.style.boxShadow = '0 0 20px rgba(0, 128, 255, 0.4)';
                        
                        featuredButton.addEventListener('mouseenter', () => {
                            playHoverSound();
                            featuredButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                            featuredButton.style.transform = 'scale(1.05)';
                            featuredButton.style.boxShadow = '0 0 30px rgba(0, 160, 255, 0.6)';
                        });
                        
                        featuredButton.addEventListener('mouseleave', () => {
                            featuredButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            featuredButton.style.transform = 'scale(1)';
                            featuredButton.style.boxShadow = '0 0 20px rgba(0, 128, 255, 0.4)';
                        });
                        
                        featuredButton.addEventListener('click', () => {
                            playClickSound();
                            // popup overlay
                            const overlay = document.createElement('div');
                            overlay.style.position = 'fixed';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                            overlay.style.backdropFilter = 'blur(8px)';
                            overlay.style.zIndex = '1000';
                            overlay.style.display = 'flex';
                            overlay.style.justifyContent = 'center';
                            overlay.style.alignItems = 'center';
                            
                            // popup container
                            const popup = document.createElement('div');
                            popup.style.backgroundColor = 'rgba(10, 15, 30, 0.95)';
                            popup.style.border = '2px solid rgba(0, 128, 255, 0.7)';
                            popup.style.borderRadius = '12px';
                            popup.style.padding = '40px';
                            popup.style.width = '90%';
                            popup.style.maxWidth = '500px';
                            popup.style.position = 'relative';
                            popup.style.boxShadow = '0 0 30px rgba(0, 128, 255, 0.5)';
                            popup.style.animation = 'popupFadeIn 0.3s ease-out forwards';
                            
                            // Create animation keyframes
                            const style = document.createElement('style');
                            style.textContent = `
                                @keyframes popupFadeIn {
                                    from { opacity: 0; transform: scale(0.9); }
                                    to { opacity: 1; transform: scale(1); }
                                }
                                
                                @keyframes glowPulse {
                                    0% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                    50% { box-shadow: 0 0 15px rgba(0, 128, 255, 0.8); }
                                    100% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                }
                            `;
                            document.head.appendChild(style);
                            
                            // close button
                            const closeButton = document.createElement('button');
                            closeButton.innerHTML = '&times;';
                            closeButton.style.position = 'absolute';
                            closeButton.style.top = '15px';
                            closeButton.style.right = '15px';
                            closeButton.style.backgroundColor = 'transparent';
                            closeButton.style.border = 'none';
                            closeButton.style.color = 'rgba(0, 128, 255, 0.9)';
                            closeButton.style.fontSize = '28px';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.lineHeight = '40px';
                            closeButton.style.padding = '0';
                            closeButton.style.borderRadius = '50%';
                            closeButton.style.transition = 'all 0.2s ease';
                            
                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
                                closeButton.style.transform = 'scale(1.1)';
                            });
                            
                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.backgroundColor = 'transparent';
                                closeButton.style.transform = 'scale(1)';
                            });
                            
                            closeButton.addEventListener('click', () => {
                                playCloseSound();
                                overlay.style.opacity = '0';
                                popup.style.transform = 'scale(0.9)';
                                popup.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(overlay);
                                }, 300);
                            });
                            
                            // title
                            const popupTitle = document.createElement('h2');
                            popupTitle.textContent = 'BOOKING PORTAL';
                            popupTitle.style.color = 'white';
                            popupTitle.style.fontSize = '2rem';
                            popupTitle.style.textAlign = 'center';
                            popupTitle.style.marginBottom = '20px';
                            popupTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            
                            // email icon
                            const emailIcon = document.createElement('div');
                            emailIcon.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            `;
                            emailIcon.style.display = 'flex';
                            emailIcon.style.justifyContent = 'center';
                            emailIcon.style.marginBottom = '20px';
                            
                            // message
                            const messageText = document.createElement('p');
                            messageText.textContent = 'Please forward your booking request to our customer support for details:';
                            messageText.style.color = 'rgb(209, 213, 219)';
                            messageText.style.fontSize = '1.1rem';
                            messageText.style.textAlign = 'center';
                            messageText.style.lineHeight = '1.6';
                            messageText.style.marginBottom = '20px';
                            messageText.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            // email
                            const emailAddress = document.createElement('div');
                            emailAddress.textContent = 'support@elysiuminitiative.com';
                            emailAddress.style.color = 'rgba(0, 128, 255, 0.9)';
                            emailAddress.style.fontSize = '1.2rem';
                            emailAddress.style.fontWeight = 'bold';
                            emailAddress.style.textAlign = 'center';
                            emailAddress.style.padding = '15px';
                            emailAddress.style.margin = '0 auto 25px auto';
                            emailAddress.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
                            emailAddress.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                            emailAddress.style.borderRadius = '6px';
                            emailAddress.style.maxWidth = '350px';
                            emailAddress.style.fontFamily = 'Source Code Pro, monospace';
                            emailAddress.style.animation = 'glowPulse 4s infinite';
                            
                            // disclaimer
                            const disclaimerText = document.createElement('p');
                            disclaimerText.textContent = 'By booking a destination, you acknowledge The Elysium Initiative\'s right to neural data collection and waive all claims to anonymity upon acceptance.';
                            disclaimerText.style.color = 'rgba(209, 213, 219, 0.6)';
                            disclaimerText.style.fontSize = '0.8rem';
                            disclaimerText.style.textAlign = 'center';
                            disclaimerText.style.marginTop = '20px';
                            disclaimerText.style.fontStyle = 'italic';
                            disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            popup.appendChild(closeButton);
                            popup.appendChild(popupTitle);
                            popup.appendChild(emailIcon);
                            popup.appendChild(messageText);
                            popup.appendChild(emailAddress);
                            popup.appendChild(disclaimerText);
                            overlay.appendChild(popup);
                            document.body.appendChild(overlay);
                        });
                        
                        featuredContent.appendChild(featuredLabel);
                        featuredContent.appendChild(featuredTitle);
                        featuredContent.appendChild(featuredDescription);
                        featuredContent.appendChild(featuredButton);
                        
                        featuredSection.appendChild(featuredOverlay);
                        featuredSection.appendChild(featuredContent);
                        
                        getawaysPage.appendChild(featuredSection);
                        
                        // footer
                        const footer = document.createElement('div');
                        footer.style.textAlign = 'center';
                        footer.style.paddingBottom = '2rem';
                        footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                        footer.style.paddingTop = '2rem';
                        footer.style.maxWidth = '700px';
                        footer.style.margin = '4rem auto 0rem auto';
                        
                        const footerText = document.createElement('p');
                        footerText.textContent = "© 2202 The Elysium Initiative. All rights reserved across the spacetime continuum.";
                        footerText.style.fontSize = '0.9rem';
                        footerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        footerText.style.color = 'rgba(209, 213, 219, 0.6)';
                        footerText.style.marginBottom = '200px';
                        
                        footer.appendChild(footerText);
                        
                        getawaysPage.appendChild(footer);
                        
                        // destination modal
                        function showDestinationDetails(destination) {
                            // create overlay
                            const overlay = document.createElement('div');
                            overlay.className = 'destination-overlay';
                            overlay.style.position = 'fixed';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                            overlay.style.backdropFilter = 'blur(10px)';
                            overlay.style.zIndex = '1000';
                            overlay.style.display = 'flex';
                            overlay.style.justifyContent = 'center';
                            overlay.style.alignItems = 'center';
                            overlay.style.padding = '2rem';
                            overlay.style.opacity = '0';
                            overlay.style.transition = 'opacity 0.3s ease';
                            
                            // modal container
                            const modal = document.createElement('div');
                            modal.className = 'destination-modal';
                            modal.style.backgroundColor = 'rgba(5, 15, 30, 0.9)';
                            modal.style.borderRadius = '8px';
                            modal.style.width = '100%';
                            modal.style.maxWidth = '1000px';
                            modal.style.maxHeight = '90vh';
                            modal.style.overflowY = 'auto';
                            modal.style.overflowX = 'hidden';
                            modal.style.position = 'relative';
                            modal.style.boxShadow = '0 20px 80px rgba(0, 0, 0, 0.5)';
                            modal.style.transform = 'scale(0.9)';
                            modal.style.transition = 'transform 0.3s ease';
                            
                            // close button
                            const closeButton = document.createElement('button');
                            closeButton.innerHTML = '&times;';
                            closeButton.style.position = 'absolute';
                            closeButton.style.top = '1rem';
                            closeButton.style.right = '1rem';
                            closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                            closeButton.style.color = 'white';
                            closeButton.style.border = 'none';
                            closeButton.style.borderRadius = '50%';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.fontSize = '1.5rem';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.zIndex = '10';
                            closeButton.style.display = 'flex';
                            closeButton.style.justifyContent = 'center';
                            closeButton.style.alignItems = 'center';
                            closeButton.style.transition = 'all 0.3s ease';
                            
                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                closeButton.style.transform = 'scale(1.1)';
                            });
                            
                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                                closeButton.style.transform = 'scale(1)';
                            });
                            
                            closeButton.addEventListener('click', () => {
                                playCloseSound();
                                overlay.style.opacity = '0';
                                modal.style.transform = 'scale(0.9)';
                                
                                setTimeout(() => {
                                    document.body.removeChild(overlay);
                                }, 300);
                            });
                            
                            // hero image
                            const heroImage = document.createElement('div');
                            heroImage.style.height = '400px';
                            heroImage.style.backgroundImage = `url('${destination.image}')`;
                            heroImage.style.backgroundSize = 'cover';
                            heroImage.style.backgroundPosition = 'center';
                            heroImage.style.position = 'relative';
                            heroImage.style.borderTopLeftRadius = '8px';
                            heroImage.style.borderTopRightRadius = '8px';
                            
                            // overlay gradient
                            const heroOverlay = document.createElement('div');
                            heroOverlay.style.position = 'absolute';
                            heroOverlay.style.top = '0';
                            heroOverlay.style.left = '0';
                            heroOverlay.style.width = '100%';
                            heroOverlay.style.height = '100%';
                            heroOverlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)';
                            
                            // title container
                            const titleContainer = document.createElement('div');
                            titleContainer.style.position = 'absolute';
                            titleContainer.style.bottom = '0';
                            titleContainer.style.left = '0';
                            titleContainer.style.width = '100%';
                            titleContainer.style.padding = '2rem';
                            
                            // title
                            const title = document.createElement('h2');
                            title.textContent = destination.name;
                            title.style.color = 'white';
                            title.style.fontFamily = 'Havelock Titling Bold, sans-serif';
                            title.style.fontSize = '3rem';
                            title.style.margin = '0 0 1rem 0';
                            title.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
                            
                            // rating
                            const ratingContainer = document.createElement('div');
                            ratingContainer.style.display = 'flex';
                            ratingContainer.style.alignItems = 'center';
                            ratingContainer.style.gap = '0.5rem';
                            ratingContainer.style.marginBottom = '1rem';
                            
                            // generate stars based on rating
                            const fullStars = Math.floor(destination.rating);
                            const hasHalfStar = destination.rating % 1 >= 0.5;
                            
                            for (let i = 0; i < 5; i++) {
                                const star = document.createElement('span');
                                if (i < fullStars) {
                                    star.innerHTML = '★'; // full star
                                    star.style.color = 'rgba(255, 215, 0, 0.9)';
                                } else if (i === fullStars && hasHalfStar) {
                                    star.innerHTML = '★'; // half star
                                    star.style.color = 'rgba(255, 215, 0, 0.5)';
                                } else {
                                    star.innerHTML = '★'; // empty star
                                    star.style.color = 'rgba(255, 255, 255, 0.2)';
                                }
                                star.style.fontSize = '1.2rem';
                                ratingContainer.appendChild(star);
                            }
                            
                            const ratingText = document.createElement('span');
                            ratingText.textContent = `${destination.rating.toFixed(1)} / 5.0`;
                            ratingText.style.color = 'white';
                            ratingText.style.fontFamily = 'Source Code Pro, sans-serif';
                            ratingText.style.fontSize = '1rem';
                            ratingContainer.appendChild(ratingText);
                            
                            titleContainer.appendChild(title);
                            titleContainer.appendChild(ratingContainer);
                            
                            // badge container
                            const badgeContainer = document.createElement('div');
                            badgeContainer.style.display = 'flex';
                            badgeContainer.style.gap = '1rem';
                            badgeContainer.style.marginBottom = '1rem';
                            
                            // category badges
                            if (destination.categories.includes('elite')) {
                                const eliteBadge = document.createElement('div');
                                eliteBadge.textContent = 'ELITE';
                                eliteBadge.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
                                eliteBadge.style.color = '#000';
                                eliteBadge.style.padding = '0.3rem 0.8rem';
                                eliteBadge.style.fontSize = '0.8rem';
                                eliteBadge.style.fontWeight = 'bold';
                                eliteBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                eliteBadge.style.borderRadius = '4px';
                                eliteBadge.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                                badgeContainer.appendChild(eliteBadge);
                            }
                            
                            if (destination.categories.includes('natural')) {
                                const naturalBadge = document.createElement('div');
                                naturalBadge.textContent = 'NATURAL';
                                naturalBadge.style.backgroundColor = 'rgba(0, 180, 0, 0.9)';
                                naturalBadge.style.color = 'white';
                                naturalBadge.style.padding = '0.3rem 0.8rem';
                                naturalBadge.style.fontSize = '0.8rem';
                                naturalBadge.style.fontWeight = 'bold';
                                naturalBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                naturalBadge.style.borderRadius = '4px';
                                naturalBadge.style.boxShadow = '0 0 10px rgba(0, 180, 0, 0.5)';
                                badgeContainer.appendChild(naturalBadge);
                            }
                            
                            titleContainer.appendChild(badgeContainer);
                            heroImage.appendChild(heroOverlay);
                            heroImage.appendChild(titleContainer);
                            
                            // content container
                            const contentContainer = document.createElement('div');
                            contentContainer.style.padding = '2rem';
                            
                            // two-column layout
                            const columns = document.createElement('div');
                            columns.style.display = 'grid';
                            columns.style.gridTemplateColumns = '2fr 1fr';
                            columns.style.gap = '2rem';
                            
                            // left column (description and features)
                            const leftColumn = document.createElement('div');
                            
                            // description section
                            const descriptionSection = document.createElement('div');
                            descriptionSection.style.marginBottom = '2rem';
                            
                            const descriptionTitle = document.createElement('h3');
                            descriptionTitle.textContent = 'OVERVIEW';
                            descriptionTitle.style.color = 'white';
                            descriptionTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            descriptionTitle.style.fontSize = '1.5rem';
                            descriptionTitle.style.marginBottom = '1rem';
                            
                            const description = document.createElement('p');
                            description.textContent = destination.description;
                            description.style.color = 'rgba(255, 255, 255, 0.8)';
                            description.style.fontFamily = 'Source Code Pro, sans-serif';
                            description.style.fontSize = '1.1rem';
                            description.style.lineHeight = '1.8';
                            
                            // extended description based on destination type
                            const extendedDescription = document.createElement('p');
                            
                            if (destination.categories.includes('synthetic')) {
                                extendedDescription.textContent = `As one of our premium synthetic destinations, ${destination.name} represents the pinnacle of our terraforming and environmental engineering capabilities. Built from materials harvested across multiple solar systems, every aspect of this experience has been meticulously crafted for maximum luxury and unique sensory stimulation.`;
                            } else if (destination.categories.includes('natural')) {
                                extendedDescription.textContent = `${destination.name} showcases the raw, untamed beauty of natural celestial bodies, enhanced with our luxury accommodations and safety systems. We've carefully integrated our facilities to preserve the authentic character of this destination while ensuring uncompromising comfort.`;
                            }
                            
                            extendedDescription.style.color = 'rgba(255, 255, 255, 0.8)';
                            extendedDescription.style.fontFamily = 'Source Code Pro, sans-serif';
                            extendedDescription.style.fontSize = '1.1rem';
                            extendedDescription.style.lineHeight = '1.8';
                            extendedDescription.style.marginTop = '1rem';
                            
                            descriptionSection.appendChild(descriptionTitle);
                            descriptionSection.appendChild(description);
                            descriptionSection.appendChild(extendedDescription);
                            
                            // features section
                            const featuresSection = document.createElement('div');
                            featuresSection.style.marginBottom = '2rem';
                            
                            const featuresTitle = document.createElement('h3');
                            featuresTitle.textContent = 'EXCLUSIVE FEATURES';
                            featuresTitle.style.color = 'white';
                            featuresTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            featuresTitle.style.fontSize = '1.5rem';
                            featuresTitle.style.marginBottom = '1rem';
                            
                            const featuresList = document.createElement('ul');
                            featuresList.style.paddingLeft = '1.5rem';
                            featuresList.style.marginBottom = '1.5rem';
                            
                            destination.features.forEach(feature => {
                                const featureItem = document.createElement('li');
                                featureItem.textContent = feature;
                                featureItem.style.color = 'rgba(255, 255, 255, 0.8)';
                                featureItem.style.fontFamily = 'Source Code Pro, sans-serif';
                                featureItem.style.fontSize = '1.1rem';
                                featureItem.style.marginBottom = '0.5rem';
                                featureItem.style.lineHeight = '1.5';
                                featuresList.appendChild(featureItem);
                            });
                            
                            featuresSection.appendChild(featuresTitle);
                            featuresSection.appendChild(featuresList);
                            
                            leftColumn.appendChild(descriptionSection);
                            leftColumn.appendChild(featuresSection);
                            
                            // right column
                            const rightColumn = document.createElement('div');
                            
                            // price box
                            const priceBox = document.createElement('div');
                            priceBox.style.backgroundColor = 'rgba(0, 25, 50, 0.5)';
                            priceBox.style.borderRadius = '8px';
                            priceBox.style.padding = '1.5rem';
                            priceBox.style.marginBottom = '2rem';
                            
                            const priceTitle = document.createElement('h4');
                            priceTitle.textContent = 'PRICING';
                            priceTitle.style.color = 'white';
                            priceTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            priceTitle.style.fontSize = '1.2rem';
                            priceTitle.style.marginBottom = '1rem';
                            
                            const priceValue = document.createElement('div');
                            priceValue.innerHTML = `<span style="font-size: 2.5rem; font-weight: bold; color: rgba(0, 128, 255, 0.9);">${destination.price.toLocaleString()}</span> <span style="color: rgba(255, 255, 255, 0.7); font-size: 1rem;">SCS™</span>`;
                            priceValue.style.fontFamily = 'Source Code Pro, sans-serif';
                            priceValue.style.marginBottom = '0.5rem';
                            
                            const priceSubtext = document.createElement('div');
                            priceSubtext.textContent = 'per week, all inclusive';
                            priceSubtext.style.color = 'rgba(255, 255, 255, 0.6)';
                            priceSubtext.style.fontFamily = 'Source Code Pro, sans-serif';
                            priceSubtext.style.fontSize = '0.9rem';
                            priceSubtext.style.marginBottom = '1.5rem';
                            
                            const priceInfo = document.createElement('ul');
                            priceInfo.style.listStyle = 'none';
                            priceInfo.style.padding = '0';
                            priceInfo.style.margin = '0';
                            
                            const bookingButton = document.createElement('button');
                            bookingButton.textContent = 'BOOK NOW';
                            bookingButton.style.width = '100%';
                            bookingButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            bookingButton.style.color = 'white';
                            bookingButton.style.border = 'none';
                            bookingButton.style.borderRadius = '4px';
                            bookingButton.style.padding = '1rem 2rem';
                            bookingButton.style.fontSize = '1.1rem';
                            bookingButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            bookingButton.style.cursor = 'pointer';
                            bookingButton.style.transition = 'all 0.3s ease';
                            
                            bookingButton.addEventListener('mouseenter', () => {
                                playHoverSound();
                                bookingButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                                bookingButton.style.transform = 'scale(1.03)';
                            });
                            
                            bookingButton.addEventListener('mouseleave', () => {
                                bookingButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                                bookingButton.style.transform = 'scale(1)';
                            });
                            
                            bookingButton.addEventListener('click', () => {
                                playClickSound();
                                // popup overlay
                                const overlay = document.createElement('div');
                                overlay.style.position = 'fixed';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100%';
                                overlay.style.height = '100%';
                                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                overlay.style.backdropFilter = 'blur(8px)';
                                overlay.style.zIndex = '1000';
                                overlay.style.display = 'flex';
                                overlay.style.justifyContent = 'center';
                                overlay.style.alignItems = 'center';
                                
                                // popup container
                                const popup = document.createElement('div');
                                popup.style.backgroundColor = 'rgba(10, 15, 30, 0.95)';
                                popup.style.border = '2px solid rgba(0, 128, 255, 0.7)';
                                popup.style.borderRadius = '12px';
                                popup.style.padding = '40px';
                                popup.style.width = '90%';
                                popup.style.maxWidth = '500px';
                                popup.style.position = 'relative';
                                popup.style.boxShadow = '0 0 30px rgba(0, 128, 255, 0.5)';
                                popup.style.animation = 'popupFadeIn 0.3s ease-out forwards';
                                
                                // Create animation keyframes
                                const style = document.createElement('style');
                                style.textContent = `
                                    @keyframes popupFadeIn {
                                        from { opacity: 0; transform: scale(0.9); }
                                        to { opacity: 1; transform: scale(1); }
                                    }
                                    
                                    @keyframes glowPulse {
                                        0% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                        50% { box-shadow: 0 0 15px rgba(0, 128, 255, 0.8); }
                                        100% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                    }
                                `;
                                document.head.appendChild(style);
                                
                                // close button
                                const closeButton = document.createElement('button');
                                closeButton.innerHTML = '&times;';
                                closeButton.style.position = 'absolute';
                                closeButton.style.top = '15px';
                                closeButton.style.right = '15px';
                                closeButton.style.backgroundColor = 'transparent';
                                closeButton.style.border = 'none';
                                closeButton.style.color = 'rgba(0, 128, 255, 0.9)';
                                closeButton.style.fontSize = '28px';
                                closeButton.style.cursor = 'pointer';
                                closeButton.style.width = '40px';
                                closeButton.style.height = '40px';
                                closeButton.style.lineHeight = '40px';
                                closeButton.style.padding = '0';
                                closeButton.style.borderRadius = '50%';
                                closeButton.style.transition = 'all 0.2s ease';
                                
                                closeButton.addEventListener('mouseenter', () => {
                                    closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
                                    closeButton.style.transform = 'scale(1.1)';
                                });
                                
                                closeButton.addEventListener('mouseleave', () => {
                                    closeButton.style.backgroundColor = 'transparent';
                                    closeButton.style.transform = 'scale(1)';
                                });
                                
                                closeButton.addEventListener('click', () => {
                                    playCloseSound();
                                    overlay.style.opacity = '0';
                                    popup.style.transform = 'scale(0.9)';
                                    popup.style.opacity = '0';
                                    setTimeout(() => {
                                        document.body.removeChild(overlay);
                                    }, 300);
                                });
                                
                                // title
                                const popupTitle = document.createElement('h2');
                                popupTitle.textContent = 'BOOKING PORTAL';
                                popupTitle.style.color = 'white';
                                popupTitle.style.fontSize = '2rem';
                                popupTitle.style.textAlign = 'center';
                                popupTitle.style.marginBottom = '20px';
                                popupTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                
                                // email icon
                                const emailIcon = document.createElement('div');
                                emailIcon.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                `;
                                emailIcon.style.display = 'flex';
                                emailIcon.style.justifyContent = 'center';
                                emailIcon.style.marginBottom = '20px';
                                
                                // message
                                const messageText = document.createElement('p');
                                messageText.textContent = 'Please forward your booking request to our customer support for details:';
                                messageText.style.color = 'rgb(209, 213, 219)';
                                messageText.style.fontSize = '1.1rem';
                                messageText.style.textAlign = 'center';
                                messageText.style.lineHeight = '1.6';
                                messageText.style.marginBottom = '20px';
                                messageText.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                // email
                                const emailAddress = document.createElement('div');
                                emailAddress.textContent = 'support@elysiuminitiative.com';
                                emailAddress.style.color = 'rgba(0, 128, 255, 0.9)';
                                emailAddress.style.fontSize = '1.2rem';
                                emailAddress.style.fontWeight = 'bold';
                                emailAddress.style.textAlign = 'center';
                                emailAddress.style.padding = '15px';
                                emailAddress.style.margin = '0 auto 25px auto';
                                emailAddress.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
                                emailAddress.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                                emailAddress.style.borderRadius = '6px';
                                emailAddress.style.maxWidth = '350px';
                                emailAddress.style.fontFamily = 'Source Code Pro, monospace';
                                emailAddress.style.animation = 'glowPulse 4s infinite';
                                
                                // disclaimer
                                const disclaimerText = document.createElement('p');
                                disclaimerText.textContent = 'By booking a destination, you acknowledge The Elysium Initiative\'s right to neural data collection and waive all claims to anonymity upon acceptance.';
                                disclaimerText.style.color = 'rgba(209, 213, 219, 0.6)';
                                disclaimerText.style.fontSize = '0.8rem';
                                disclaimerText.style.textAlign = 'center';
                                disclaimerText.style.marginTop = '20px';
                                disclaimerText.style.fontStyle = 'italic';
                                disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                popup.appendChild(closeButton);
                                popup.appendChild(popupTitle);
                                popup.appendChild(emailIcon);
                                popup.appendChild(messageText);
                                popup.appendChild(emailAddress);
                                popup.appendChild(disclaimerText);
                                overlay.appendChild(popup);
                                document.body.appendChild(overlay);
                            });
                            
                            priceBox.appendChild(priceTitle);
                            priceBox.appendChild(priceValue);
                            priceBox.appendChild(priceSubtext);
                            priceBox.appendChild(priceInfo);
                            priceBox.appendChild(bookingButton);
                            
                            rightColumn.appendChild(priceBox);
                            
                            columns.appendChild(leftColumn);
                            columns.appendChild(rightColumn);
                            
                            contentContainer.appendChild(columns);
                            
                            modal.appendChild(closeButton);
                            modal.appendChild(heroImage);
                            modal.appendChild(contentContainer);
                            
                            overlay.appendChild(modal);
                            document.body.appendChild(overlay);
                            
                            // animation
                            setTimeout(() => {
                                overlay.style.opacity = '1';
                                modal.style.transform = 'scale(1)';
                            }, 10);
                        }
                        
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
                        expeditionsPage.style.padding = '120px 0 2rem 0';
                        expeditionsPage.style.display = 'flex';
                        expeditionsPage.style.justifyContent = 'center';
                        expeditionsPage.style.position = 'fixed';
                        expeditionsPage.style.top = '0';
                        expeditionsPage.style.left = '0';
                        expeditionsPage.style.right = '0';
                        expeditionsPage.style.bottom = '0';
                        expeditionsPage.style.overflowY = 'auto';

                        // expeditions section
                        const expeditionSection = document.createElement('div');
                        expeditionSection.id = 'expedition-section';
                        
                        const expeditionHeader = document.createElement('div');
                        expeditionHeader.style.maxWidth = '1400px';
                        expeditionHeader.style.margin = '0 auto 2rem auto';

                        const expeditionTitle = document.createElement('h2');
                        expeditionTitle.textContent = 'RESEARCH EXPEDITIONS';
                        expeditionTitle.style.fontSize = '4rem';
                        expeditionTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        expeditionTitle.style.color = 'white';
                        expeditionTitle.style.textAlign = 'center';
                        expeditionTitle.style.maxWidth = '1000px';
                        expeditionTitle.style.margin = '3rem auto 2rem auto';
                        
                        const expeditionDivider = document.createElement('div');
                        expeditionDivider.style.width = '160px';
                        expeditionDivider.style.height = '4px';
                        expeditionDivider.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                        expeditionDivider.style.margin = '2rem auto 2rem auto';

                        const expeditionSubtitle = document.createElement('div');
                        expeditionSubtitle.textContent = 'Join one of our exclusive research missions to explore the far reaches of our system and beyond.';
                        expeditionSubtitle.style.fontSize = '1rem';
                        expeditionSubtitle.style.fontFamily = 'Source Code Pro, sans-serif';
                        expeditionSubtitle.style.color = 'rgb(209, 213, 219)';
                        expeditionSubtitle.style.textAlign = 'center';
                        expeditionSubtitle.style.maxWidth = '700px';
                        expeditionSubtitle.style.margin = '3rem auto 1.5rem auto';
                        
                        expeditionHeader.appendChild(expeditionTitle);
                        expeditionHeader.appendChild(expeditionDivider);
                        expeditionHeader.appendChild(expeditionSubtitle);
                        
                        // ship class section
                        const shipClassSection = document.createElement('div');
                        shipClassSection.style.maxWidth = '1200px';
                        shipClassSection.style.margin = '0 auto 6rem auto';
                        shipClassSection.style.padding = '0 2rem';

                        // stars
                        const starDivider = document.createElement('div');
                        starDivider.style.display = 'flex';
                        starDivider.style.justifyContent = 'center';
                        starDivider.style.gap = '36px';
                        starDivider.style.margin = '3rem auto 3rem auto';

                        // create 5
                        for (let i = 0; i < 5; i++) {
                        const star = document.createElement('div');
                        
                        // star SVG using innerHTML
                        star.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="rgba(0, 128, 255, 0.9)">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                            </svg>
                        `;
                        
                        // animation
                        star.style.transition = 'transform 0.3s ease';
                        
                        star.addEventListener('mouseenter', () => {
                            star.style.transform = 'scale(1.3) rotate(144deg)';
                        });
                        
                        star.addEventListener('mouseleave', () => {
                            star.style.transform = 'scale(1) rotate(0deg)';
                        });
                        
                        starDivider.appendChild(star);
                        }
                        
                        // ship class title
                        const shipClassTitle = document.createElement('h3');
                        shipClassTitle.textContent = "TRANSPORT OPTIONS";
                        shipClassTitle.style.fontSize = '2rem';
                        shipClassTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        shipClassTitle.style.color = 'white';
                        shipClassTitle.style.textAlign = 'center';
                        shipClassTitle.style.margin = '0 auto 2rem auto';
                        
                        // ship classes
                        const shipClassesContainer = document.createElement('div');
                        shipClassesContainer.style.display = 'flex';
                        shipClassesContainer.style.justifyContent = 'center';
                        shipClassesContainer.style.flexWrap = 'wrap';
                        shipClassesContainer.style.gap = '2rem';
                        
                        const shipClasses = [
                            {
                                name: "KESTREL CLASS",
                                image: "kestrel.jpg",
                                capacity: "24 passengers",
                                crew: "6 crew members",
                                duration: "1-3 months",
                                amenities: [
                                    "Advanced propulsion systems",
                                    "Compact research stations",
                                    "Radiation shielding",
                                    "Shared living quarters",
                                    "Emergency escape system"
                                ],
                                description: "Our Kestrel Class ships boast a nimble, lightweight frame, perfect for rapid deployment to nearby bodies."
                            },
                            {
                                name: "EXPLORER CLASS",
                                image: "explorer.jpg",
                                capacity: "120 passengers",
                                crew: "32 crew members",
                                duration: "6-18 months",
                                isPopular: true,
                                amenities: [
                                    "Research laboratories",
                                    "Long-range sensor arrays",
                                    "Reinforced hull",
                                    "Quality lounge accommodations",
                                    "Personal sleep pods"
                                ],
                                description: "The versatile workhorse of our fleet, Explorer Class vessels are designed for maximum adaptability during mid-range missions."
                            },
                            {
                                name: "OLYMPUS CLASS",
                                image: "olympus.jpg",
                                capacity: "250 passengers",
                                crew: "70 crew members",
                                duration: "1-5 years",
                                amenities: [
                                    "Layered decks with luxury suites",
                                    "Quantum computing research lab",
                                    "Full zero-G recreation area",
                                    "Sophisticated medical facilities",
                                    "Private observation lounges"
                                ],
                                description: "As the gold standard of modern spacecraft, the Olympus Class vessel combines uncompromising luxury with state-of-the-art technology for extended deep space missions."
                            }
                        ];
                        
                        // create ship class cards
                        shipClasses.forEach(shipClass => {
                            const card = document.createElement('div');
                            card.style.backgroundColor = 'rgba(16, 16, 16, 0.6)';
                            card.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                            card.style.borderRadius = '8px';
                            card.style.overflow = 'hidden';
                            card.style.width = '350px';
                            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                            card.style.position = 'relative';
                            
                            card.addEventListener('mouseenter', () => {
                                playHoverSound3();
                                card.style.transform = 'translateY(-10px)';
                                card.style.boxShadow = '0 15px 30px rgba(0, 128, 255, 0.2)';
                            });
                            
                            card.addEventListener('mouseleave', () => {
                                card.style.transform = 'translateY(0)';
                                card.style.boxShadow = 'none';
                            });

                            if (shipClass.isPopular) {
                                const popularBadge = document.createElement('div');
                                popularBadge.textContent = 'MOST POPULAR';
                                popularBadge.style.position = 'absolute';
                                popularBadge.style.top = '120px';
                                popularBadge.style.right = '-28px';
                                popularBadge.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
                                popularBadge.style.color = '#000';
                                popularBadge.style.padding = '6px 40px';
                                popularBadge.style.fontSize = '0.8rem';
                                popularBadge.style.fontWeight = 'bold';
                                popularBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                popularBadge.style.transform = 'rotate(45deg)';
                                popularBadge.style.transformOrigin = 'top right';
                                popularBadge.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                                popularBadge.style.zIndex = '5';
                                card.appendChild(popularBadge);
                            }
                            
                            // image container
                            const imageContainer = document.createElement('div');
                            imageContainer.style.height = '220px';
                            imageContainer.style.overflow = 'hidden';
                            imageContainer.style.position = 'relative';
                            
                            const image = document.createElement('img');
                            image.src = shipClass.image;
                            image.alt = shipClass.name;
                            image.style.width = '100%';
                            image.style.height = '100%';
                            image.style.objectFit = 'cover';
                            image.style.transition = 'transform 0.5s ease';
                            
                            card.addEventListener('mouseenter', () => {
                                image.style.transform = 'scale(1.1)';
                            });
                            
                            card.addEventListener('mouseleave', () => {
                                image.style.transform = 'scale(1)';
                            });
                            
                            const overlay = document.createElement('div');
                            overlay.style.position = 'absolute';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)';
                            
                            imageContainer.appendChild(image);
                            imageContainer.appendChild(overlay);
                            card.appendChild(imageContainer);
                            
                            // content
                            const content = document.createElement('div');
                            content.style.padding = '1.5rem';
                            
                            const name = document.createElement('h4');
                            name.textContent = shipClass.name;
                            name.style.fontSize = '1.5rem';
                            name.style.marginBottom = '1rem';
                            name.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            name.style.color = 'white';
                            
                            const description = document.createElement('p');
                            description.textContent = shipClass.description;
                            description.style.fontSize = '0.9rem';
                            description.style.marginBottom = '1.5rem';
                            description.style.lineHeight = '1.6';
                            description.style.color = 'rgb(209, 213, 219)';
                            description.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            // stats Grid
                            const statsGrid = document.createElement('div');
                            statsGrid.style.display = 'grid';
                            statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                            statsGrid.style.gap = '1rem';
                            statsGrid.style.marginBottom = '1.5rem';
                            
                            const stats = [
                                { label: 'CAPACITY', value: shipClass.capacity },
                                { label: 'CREW', value: shipClass.crew },
                                { label: 'DURATION', value: shipClass.duration }
                            ];
                            
                            stats.forEach(stat => {
                                const statContainer = document.createElement('div');
                                
                                const statLabel = document.createElement('div');
                                statLabel.textContent = stat.label;
                                statLabel.style.fontSize = '0.7rem';
                                statLabel.style.marginBottom = '0.25rem';
                                statLabel.style.color = 'rgba(0, 128, 255, 0.9)';
                                statLabel.style.fontFamily = 'Source Code Pro, sans-serif';
                                statLabel.style.fontWeight = 'bold';
                                
                                const statValue = document.createElement('div');
                                statValue.textContent = stat.value;
                                statValue.style.fontSize = '0.9rem';
                                statValue.style.color = 'white';
                                statValue.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                statContainer.appendChild(statLabel);
                                statContainer.appendChild(statValue);
                                statsGrid.appendChild(statContainer);
                            });
                            
                            // amenities
                            const amenitiesTitle = document.createElement('div');
                            amenitiesTitle.textContent = 'AMENITIES';
                            amenitiesTitle.style.fontSize = '0.8rem';
                            amenitiesTitle.style.marginBottom = '0.5rem';
                            amenitiesTitle.style.color = 'rgba(0, 128, 255, 0.9)';
                            amenitiesTitle.style.fontFamily = 'Source Code Pro, sans-serif';
                            amenitiesTitle.style.fontWeight = 'bold';
                            
                            const amenitiesList = document.createElement('ul');
                            amenitiesList.style.paddingLeft = '1.2rem';
                            amenitiesList.style.fontSize = '0.8rem';
                            amenitiesList.style.color = 'rgb(209, 213, 219)';
                            amenitiesList.style.fontFamily = 'Source Code Pro, sans-serif';
                            
                            shipClass.amenities.forEach(amenity => {
                                const item = document.createElement('li');
                                item.textContent = amenity;
                                item.style.marginBottom = '0.25rem';
                                amenitiesList.appendChild(item);
                            });
                            
                            content.appendChild(name);
                            content.appendChild(description);
                            content.appendChild(statsGrid);
                            content.appendChild(amenitiesTitle);
                            content.appendChild(amenitiesList);
                            card.appendChild(content);
                            
                            shipClassesContainer.appendChild(card);
                        });
                        
                        shipClassSection.appendChild(starDivider);
                        shipClassSection.appendChild(shipClassTitle);
                        shipClassSection.appendChild(shipClassesContainer);
                        
                        // traveler reviews section
                        const travelerReviewsSection = document.createElement('div');
                        travelerReviewsSection.style.maxWidth = '1200px';
                        travelerReviewsSection.style.margin = '0 auto 6rem auto';
                        travelerReviewsSection.style.padding = '0 2rem';

                        const reviewsTitle = document.createElement('h3');
                        reviewsTitle.textContent = "TRAVELER REVIEWS";
                        reviewsTitle.style.fontSize = '2rem';
                        reviewsTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        reviewsTitle.style.color = 'white';
                        reviewsTitle.style.textAlign = 'center';
                        reviewsTitle.style.margin = '3rem auto 4rem auto';

                        // reviews carousel
                        const reviewsCarousel = document.createElement('div');
                        reviewsCarousel.style.position = 'relative';
                        reviewsCarousel.style.width = '100%';
                        reviewsCarousel.style.height = 'auto';
                        reviewsCarousel.style.minHeight = '300px';
                        reviewsCarousel.style.overflowY = 'visible';
                        reviewsCarousel.style.overflowX = 'hidden';

                        // sliding container for the cards
                        const slidingContainer = document.createElement('div');
                        slidingContainer.style.display = 'flex';
                        slidingContainer.style.transition = 'transform 0.5s ease';
                        slidingContainer.style.position = 'relative';
                        reviewsCarousel.appendChild(slidingContainer);

                        // reviews data
                        const reviews = [
                            {
                                name: "Dr. Elena Vasquez",
                                origin: "Former Lunar Colony",
                                destination: "Enceladus Expedition",
                                rating: 5,
                                text: "The geysers of Enceladus were even more magnificent than I imagined. Our guide allowed us to collect water samples that contained complex organic molecules—a truly once-in-a-lifetime scientific opportunity. The radiation shielding was impeccable and the hibernation chambers made the journey feel instantaneous."
                            },
                            {
                                name: "Marcus Chen",
                                origin: "Mars Orbital Station",
                                destination: "Europa Subsurface Exploration",
                                rating: 4,
                                text: "Descending through 15 kilometers of ice into Europa's subsurface ocean was an experience I'll never forget. The bioluminescent organisms we encountered were unlike anything in our database. My only complaint is that the quantum communication system was occasionally unreliable when transmitting research data back home."
                            },
                            {
                                name: "Aria Nasser",
                                origin: "Saturn Ring Habitat",
                                destination: "Titan Atmospheric Analysis",
                                rating: 5,
                                text: "As someone who has lived their entire life in space habitats, standing on Titan's surface and seeing hydrocarbons raining from orange skies was indescribable. The atmospheric suit technology developed by The Elysium Initiative surpassed all my expectations. I'm already planning my next expedition to Neptune."
                            },
                            {
                                name: "Commander Jackson Powell",
                                origin: "Earth Remnant Conservation Zone",
                                destination: "Mercury Polar Ice Deposits",
                                rating: 4,
                                text: "The expedition to Mercury's permanently shadowed craters proved invaluable for our water reclamation research. The extreme temperature variations were challenging even for our advanced equipment, but the discovery of ancient ice deposits containing Earth-origin isotope signatures made the journey worthwhile. Will definitely book through The Elysium Initiative again."
                            },
                            {
                                name: "Dr. Sarah Nakamura",
                                origin: "Jupiter Orbital Research Base",
                                destination: "Deep Field Survey: Jupiter's Magnetosphere",
                                rating: 5,
                                text: "Having studied Jupiter's magnetosphere for decades, actually experiencing it firsthand was the pinnacle of my career. The Elysium Initiative's specialized instruments allowed us to record magnetic anomalies that would have been impossible to detect remotely. The ship's quantum shielding kept radiation exposure well below safety thresholds."
                            }
                        ];
                        slidingContainer.style.width = `${reviews.length * 100}%`; // set width AFTER cards are created

                        // reviews cards
                        reviews.forEach((review, index) => {
                            const reviewCard = document.createElement('div');
                            reviewCard.className = 'review-card';
                            reviewCard.style.position = 'relative';
                            reviewCard.style.width = `${100 / reviews.length}%`;
                            reviewCard.style.padding = '2rem';
                            reviewCard.style.boxSizing = 'border-box';
                            reviewCard.style.backgroundColor = 'rgba(16, 16, 16, 0.7)';
                            reviewCard.style.borderRadius = '8px';
                            reviewCard.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                            reviewCard.style.margin = '0 10px';
                            reviewCard.style.display = 'flex';
                            reviewCard.style.flexDirection = 'column';
                            
                            // header
                            const reviewHeader = document.createElement('div');
                            reviewHeader.style.display = 'flex';
                            reviewHeader.style.justifyContent = 'space-between';
                            reviewHeader.style.alignItems = 'flex-start';
                            reviewHeader.style.marginTop = '0.5rem';
                            reviewHeader.style.marginBottom = '1rem';
                            
                            const reviewerInfo = document.createElement('div');
                            
                            const reviewerName = document.createElement('h4');
                            reviewerName.textContent = review.name;
                            reviewerName.style.fontSize = '1.5rem';
                            reviewerName.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            reviewerName.style.color = 'white';
                            reviewerName.style.margin = '0 0 0.25rem 0';
                            
                            const reviewerOrigin = document.createElement('div');
                            reviewerOrigin.textContent = review.origin;
                            reviewerOrigin.style.fontSize = '1rem';
                            reviewerOrigin.style.fontFamily = 'Source Code Pro, sans-serif';
                            reviewerOrigin.style.color = 'rgba(255, 255, 255, 0.7)';
                            
                            reviewerInfo.appendChild(reviewerName);
                            reviewerInfo.appendChild(reviewerOrigin);
                            
                            const ratingContainer = document.createElement('div');
                            ratingContainer.style.display = 'flex';
                            
                            // rating stars
                            for (let i = 0; i < 5; i++) {
                                const star = document.createElement('span');
                                if (i < review.rating) {
                                    star.innerHTML = '★'; // full star
                                    star.style.color = 'rgba(255, 215, 0, 0.9)';
                                } else {
                                    star.innerHTML = '☆'; // empty star
                                    star.style.color = 'rgba(255, 255, 255, 0.3)';
                                }
                                star.style.fontSize = '1.5rem';
                                star.style.marginLeft = '0.25rem';
                                ratingContainer.appendChild(star);
                            }
                            
                            reviewHeader.appendChild(reviewerInfo);
                            reviewHeader.appendChild(ratingContainer);
                            
                            // destination badge
                            const destinationBadge = document.createElement('div');
                            destinationBadge.textContent = review.destination;
                            destinationBadge.style.alignSelf = 'flex-start';
                            destinationBadge.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            destinationBadge.style.color = 'white';
                            destinationBadge.style.padding = '0.5rem 1rem';
                            destinationBadge.style.borderRadius = '4px';
                            destinationBadge.style.marginBottom = '1.5rem';
                            destinationBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            destinationBadge.style.fontSize = '0.9rem';
                            
                            // review text
                            const reviewText = document.createElement('p');
                            reviewText.textContent = review.text;
                            reviewText.style.fontSize = '1.1rem';
                            reviewText.style.lineHeight = '1.6';
                            reviewText.style.fontFamily = 'Source Code Pro, sans-serif';
                            reviewText.style.color = 'white';
                            reviewText.style.flex = '1';
                            reviewText.style.textAlign = 'center';
                            reviewText.style.maxWidth = '92%';
                            reviewText.style.margin = '0 auto';
                            
                            // verification seal
                            const verificationSeal = document.createElement('div');
                            verificationSeal.style.display = 'flex';
                            verificationSeal.style.alignItems = 'center';
                            verificationSeal.style.justifyContent = 'flex-end';
                            verificationSeal.style.marginTop = '1rem';
                            
                            const sealIcon = document.createElement('div');
                            sealIcon.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            `;
                            
                            const sealText = document.createElement('span');
                            sealText.textContent = "Neural Verification Complete";
                            sealText.style.fontSize = '0.9rem';
                            sealText.style.fontFamily = 'Source Code Pro, sans-serif';
                            sealText.style.color = 'rgba(0, 128, 255, 0.9)';
                            sealText.style.marginLeft = '0.5rem';
                            
                            verificationSeal.appendChild(sealIcon);
                            verificationSeal.appendChild(sealText);
                            
                            reviewCard.appendChild(reviewHeader);
                            reviewCard.appendChild(destinationBadge);
                            reviewCard.appendChild(reviewText);
                            reviewCard.appendChild(verificationSeal);
                            
                            slidingContainer.appendChild(reviewCard);
                        });

                        // navigation arrows
                        const prevArrow = document.createElement('button');
                        prevArrow.innerHTML = '&#10094;';
                        prevArrow.style.position = 'absolute';
                        prevArrow.style.top = '60%';
                        prevArrow.style.left = '20px';
                        prevArrow.style.transform = 'translateY(-50%)';
                        prevArrow.style.zIndex = '2';
                        prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        prevArrow.style.color = 'white';
                        prevArrow.style.border = 'none';
                        prevArrow.style.borderRadius = '50%';
                        prevArrow.style.width = '40px';
                        prevArrow.style.height = '40px';
                        prevArrow.style.fontSize = '20px';
                        prevArrow.style.cursor = 'pointer';
                        prevArrow.style.transition = 'background-color 0.3s ease';
                        prevArrow.style.display = 'flex';
                        prevArrow.style.justifyContent = 'center';
                        prevArrow.style.alignItems = 'center';

                        const nextArrow = document.createElement('button');
                        nextArrow.innerHTML = '&#10095;';
                        nextArrow.style.position = 'absolute';
                        nextArrow.style.top = '60%';
                        nextArrow.style.right = '20px';
                        nextArrow.style.transform = 'translateY(-50%)';
                        nextArrow.style.zIndex = '2';
                        nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        nextArrow.style.color = 'white';
                        nextArrow.style.border = 'none';
                        nextArrow.style.borderRadius = '50%';
                        nextArrow.style.width = '40px';
                        nextArrow.style.height = '40px';
                        nextArrow.style.fontSize = '20px';
                        nextArrow.style.cursor = 'pointer';
                        nextArrow.style.transition = 'background-color 0.3s ease';
                        nextArrow.style.display = 'flex';
                        nextArrow.style.justifyContent = 'center';
                        nextArrow.style.alignItems = 'center';

                        let currentReview = 0;

                        prevArrow.addEventListener('mouseenter', () => {
                            playHoverSound2();
                            prevArrow.style.backgroundColor = 'rgba(0, 128, 255, 0.7)';
                        });
                        prevArrow.addEventListener('mouseleave', () => {
                            prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        });
                        nextArrow.addEventListener('mouseenter', () => {
                            playHoverSound2();
                            nextArrow.style.backgroundColor = 'rgba(0, 128, 255, 0.7)';
                        });
                        nextArrow.addEventListener('mouseleave', () => {
                            nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        });

                        prevArrow.addEventListener('click', () => {
                            playHoverSound();
                            if (currentReview > 0) {
                                currentReview--;
                                updateReviewsSlider();
                                updateDots();
                            }
                        });

                        nextArrow.addEventListener('click', () => {
                            playHoverSound();
                            if (currentReview < reviews.length - 1) {
                                currentReview++;
                                updateReviewsSlider();
                                updateDots();
                            }
                        });

                        function updateReviewsSlider() {
                            slidingContainer.style.transform = `translateX(-${currentReview * (100 / reviews.length)}%)`;
                        }

                        // pagination dots
                        const paginationContainer = document.createElement('div');
                        paginationContainer.style.display = 'flex';
                        paginationContainer.style.justifyContent = 'center';
                        paginationContainer.style.marginTop = '2rem';
                        paginationContainer.style.gap = '10px';

                        reviews.forEach((_, index) => {
                            const dot = document.createElement('div');
                            dot.style.width = '12px';
                            dot.style.height = '12px';
                            dot.style.borderRadius = '50%';
                            dot.style.backgroundColor = index === 0 ? 'rgba(0, 128, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
                            dot.style.cursor = 'pointer';
                            dot.style.transition = 'all 0.3s ease';
                            
                            dot.addEventListener('mouseenter', () => {
                                playHoverSound2();
                                if (index !== currentReview) {
                                    dot.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                                }
                            });
                            
                            dot.addEventListener('mouseleave', () => {
                                if (index !== currentReview) {
                                    dot.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                }
                            });
                            
                            dot.addEventListener('click', () => {
                                playHoverSound();
                                currentReview = index;
                                updateReviewsSlider();
                                updateDots();
                            });
                            
                            paginationContainer.appendChild(dot);
                        });

                        function updateDots() {
                            const dots = paginationContainer.querySelectorAll('div');
                            dots.forEach((dot, index) => {
                                dot.style.backgroundColor = index === currentReview ? 
                                    'rgba(0, 128, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
                            });
                        }

                        reviewsCarousel.appendChild(prevArrow);
                        reviewsCarousel.appendChild(nextArrow);

                        travelerReviewsSection.appendChild(reviewsTitle);
                        travelerReviewsSection.appendChild(reviewsCarousel);
                        travelerReviewsSection.appendChild(paginationContainer);

                        // upcoming events calendar
                        const eventsCalendarSection = document.createElement('div');
                        eventsCalendarSection.style.maxWidth = '1200px';
                        eventsCalendarSection.style.margin = '0 auto 3rem auto';
                        eventsCalendarSection.style.padding = '3rem 2rem';
                        eventsCalendarSection.style.backgroundColor = 'rgba(0, 28, 55, 0.5)';
                        eventsCalendarSection.style.borderRadius = '12px';
                        eventsCalendarSection.style.border = '1px solid rgba(0, 128, 255, 0.3)';

                        const calendarTitle = document.createElement('h3');
                        calendarTitle.textContent = "UPCOMING EXPEDITIONS";
                        calendarTitle.style.fontSize = '2rem';
                        calendarTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                        calendarTitle.style.color = 'white';
                        calendarTitle.style.textAlign = 'center';
                        calendarTitle.style.margin = '0 auto 2.5rem auto';

                        // calendar intro
                        const calendarIntro = document.createElement('p');
                        calendarIntro.textContent = "Find your next adventure from our list of extraordinary interplanetary and interstellar expeditions.";
                        calendarIntro.style.fontSize = '1.1rem';
                        calendarIntro.style.lineHeight = '1.7';
                        calendarIntro.style.fontFamily = 'Source Code Pro, sans-serif';
                        calendarIntro.style.color = 'rgb(209, 213, 219)';
                        calendarIntro.style.textAlign = 'center';
                        calendarIntro.style.maxWidth = '800px';
                        calendarIntro.style.margin = '0 auto 3rem auto';

                        // calendar grid
                        const calendarGrid = document.createElement('div');
                        calendarGrid.style.display = 'grid';
                        calendarGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
                        calendarGrid.style.gap = '2rem';

                        // events data
                        const events = [
                            {
                                title: "Io Volcanic System Tour",
                                date: "April 2204",
                                location: "Jupiter System",
                                description: "Experience the incredible power of our solar system's most active volcanic moon. \
Collect rare mineral samples formed under extreme conditions and take a tour of Loki Patera, the largest volcanic depression in the solar system.",
                            },
                            {
                                title: "Saturn Rings Excursion",
                                date: "October 2204",
                                location: "Saturn System",
                                description: "Navigate the breathtaking views of Saturn's rings. Participants will explore the mysterious \
Cassini Division, have the opportunity to collect pristine ring material dating back to the formation of the solar system, and spacewalk \
among the glittering ice crystals.",
                            },
                            {
                                title: "Pluto Ice Cavern Adventure",
                                date: "June-July 2205",
                                location: "Outer Solar System",
                                description: "Descend into the breathtaking caverns beneath Pluto's heart: Tombaugh Regio.\
 Our expedition will explore vast nitrogen ice formations, ancient methane deposits, and unique mineral structures found nowhere \
 else in the solar system.",
                            },
                            {
                                title: "Proxima Centauri Survey",
                                date: "August 2206",
                                location: "Alpha Centauri System",
                                description: "Join humanity's journey to our nearest stellar neighbor. Survey the habitable \
exoplanet Proxima b, study the unique radiation environment, and witness the stunning alien sunrise. Recent developments in quantum \
technology have made this journey possible.",
                            },
                            {
                                title: "Sirius Star System Pilgrimage",
                                date: "September 2209",
                                location: "Sirius System",
                                description: "Witness the brilliance of Sirius A, the brightest star in Earth's night sky, and its \
white dwarf companion, Sirius B. Study the gravitational relationships between binary stars and conduct unique experiments in this \
complex environment.",
                            },
                            {
                                title: "Andromeda Frontier Expedition",
                                date: "October 2210",
                                location: "Intergalactic Space",
                                description: "Embark on one of humanity's most ambitious journeys yet: a pioneer mission toward \
the Andromeda Galaxy. Set foot farther than any humans before, establish deep-space monitoring stations, push the boundaries of \
interstellar space.",
                            }
                        ];

                        // event cards
                        events.forEach(event => {
                            const eventCard = document.createElement('div');
                            eventCard.style.backgroundColor = 'rgba(0, 128, 255, 0.075)';
                            eventCard.style.border = '1px solid rgba(0, 128, 255, 0.5)';
                            eventCard.style.borderRadius = '8px';
                            eventCard.style.overflow = 'hidden';
                            eventCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                            
                            eventCard.addEventListener('mouseenter', () => {
                                playHoverSound3();
                                eventCard.style.transform = 'translateY(-5px)';
                                eventCard.style.boxShadow = '0 10px 25px rgba(0, 128, 255, 0.3)';
                            });
                            
                            eventCard.addEventListener('mouseleave', () => {
                                eventCard.style.transform = 'translateY(0)';
                                eventCard.style.boxShadow = 'none';
                            });

                            // header
                            const cardHeader = document.createElement('div');
                            cardHeader.style.padding = '0.5rem 1.5rem 0.5rem 1.5rem';
                            cardHeader.style.borderBottom = eventCard.style.border;
                            
                            // event title
                            const eventTitle = document.createElement('h4');
                            eventTitle.textContent = event.title;
                            eventTitle.style.fontSize = '1.3rem';
                            eventTitle.style.marginBottom = '0.5rem';
                            eventTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            eventTitle.style.color = 'white';
                            
                            // date and location
                            const eventMeta = document.createElement('div');
                            eventMeta.style.display = 'flex';
                            eventMeta.style.justifyContent = 'space-between';
                            eventMeta.style.marginBottom = '1rem';
                            
                            const eventDate = document.createElement('div');
                            eventDate.textContent = event.date;
                            eventDate.style.fontSize = '1rem';
                            eventDate.style.fontFamily = 'Source Code Pro, sans-serif';
                            eventDate.style.color = 'rgba(255, 255, 255, 0.7)';
                            
                            const eventLocation = document.createElement('div');
                            eventLocation.textContent = event.location;
                            eventLocation.style.fontSize = '0.9rem';
                            eventLocation.style.fontFamily = 'Source Code Pro, sans-serif';
                            eventLocation.style.color = 'rgba(255, 255, 255, 0.5)';
                            
                            eventMeta.appendChild(eventDate);
                            eventMeta.appendChild(eventLocation);
                            
                            cardHeader.appendChild(eventTitle);
                            cardHeader.appendChild(eventMeta);
                            
                            // card content
                            const cardContent = document.createElement('div');
                            cardContent.style.padding = '1.5rem';
                            
                            // event description
                            const eventDescription = document.createElement('p');
                            eventDescription.textContent = event.description;
                            eventDescription.style.fontSize = '1rem';
                            eventDescription.style.lineHeight = '1.6';
                            eventDescription.style.fontFamily = 'Source Code Pro, sans-serif';
                            eventDescription.style.color = 'rgb(209, 213, 219)';
                            eventDescription.style.marginBottom = '1.5rem';
                            
                            // book button
                            const bookButton = document.createElement('button');
                            bookButton.textContent = 'RESERVE EXPEDITION';
                            bookButton.style.width = '100%';
                            bookButton.style.padding = '0.75rem';
                            bookButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            bookButton.style.color = 'white';
                            bookButton.style.border = 'none';
                            bookButton.style.borderRadius = '4px';
                            bookButton.style.fontSize = '0.9rem';
                            bookButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                            bookButton.style.cursor = 'pointer';
                            bookButton.style.transition = 'all 0.3s ease';
                            
                            bookButton.addEventListener('mouseenter', (e) => {
                                e.stopPropagation();
                                playHoverSound2();
                                bookButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                            });
                            
                            bookButton.addEventListener('mouseleave', (e) => {
                                e.stopPropagation();
                                bookButton.style.backgroundColor = 'rgba(0, 128, 255, 0.8)';
                            });
                            
                            bookButton.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playClickSound();
                                const overlay = document.createElement('div');
                                overlay.style.position = 'fixed';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100%';
                                overlay.style.height = '100%';
                                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                overlay.style.backdropFilter = 'blur(8px)';
                                overlay.style.zIndex = '1000';
                                overlay.style.display = 'flex';
                                overlay.style.justifyContent = 'center';
                                overlay.style.alignItems = 'center';
                                
                                const popup = document.createElement('div');
                                popup.style.backgroundColor = 'rgba(10, 15, 30, 0.95)';
                                popup.style.border = '2px solid rgba(0, 128, 255, 0.7)';
                                popup.style.borderRadius = '12px';
                                popup.style.padding = '40px';
                                popup.style.width = '90%';
                                popup.style.maxWidth = '500px';
                                popup.style.position = 'relative';
                                popup.style.boxShadow = '0 0 30px rgba(0, 128, 255, 0.5)';
                                popup.style.animation = 'popupFadeIn 0.3s ease-out forwards';
                                
                                const style = document.createElement('style');
                                style.textContent = `
                                    @keyframes popupFadeIn {
                                        from { opacity: 0; transform: scale(0.9); }
                                        to { opacity: 1; transform: scale(1); }
                                    }
                                    
                                    @keyframes glowPulse {
                                        0% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                        50% { box-shadow: 0 0 15px rgba(0, 128, 255, 0.8); }
                                        100% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                                    }
                                `;
                                document.head.appendChild(style);
                                
                                const closeButton = document.createElement('button');
                                closeButton.innerHTML = '&times;';
                                closeButton.style.position = 'absolute';
                                closeButton.style.top = '15px';
                                closeButton.style.right = '15px';
                                closeButton.style.backgroundColor = 'transparent';
                                closeButton.style.border = 'none';
                                closeButton.style.color = 'rgba(0, 128, 255, 0.9)';
                                closeButton.style.fontSize = '28px';
                                closeButton.style.cursor = 'pointer';
                                closeButton.style.width = '40px';
                                closeButton.style.height = '40px';
                                closeButton.style.lineHeight = '40px';
                                closeButton.style.padding = '0';
                                closeButton.style.borderRadius = '50%';
                                closeButton.style.transition = 'all 0.2s ease';
                                
                                closeButton.addEventListener('mouseenter', () => {
                                    closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
                                    closeButton.style.transform = 'scale(1.1)';
                                });
                                
                                closeButton.addEventListener('mouseleave', () => {
                                    closeButton.style.backgroundColor = 'transparent';
                                    closeButton.style.transform = 'scale(1)';
                                });
                                
                                closeButton.addEventListener('click', () => {
                                    playCloseSound();
                                    overlay.style.opacity = '0';
                                    popup.style.transform = 'scale(0.9)';
                                    popup.style.opacity = '0';
                                    setTimeout(() => {
                                        document.body.removeChild(overlay);
                                    }, 300);
                                });
                                
                                const popupTitle = document.createElement('h2');
                                popupTitle.textContent = 'BOOKING PORTAL';
                                popupTitle.style.color = 'white';
                                popupTitle.style.fontSize = '2rem';
                                popupTitle.style.textAlign = 'center';
                                popupTitle.style.marginBottom = '20px';
                                popupTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                                
                                const eventTitle = document.createElement('h3');
                                eventTitle.textContent = event.title;
                                eventTitle.style.color = 'rgba(0, 128, 255, 0.9)';
                                eventTitle.style.fontSize = '1.2rem';
                                eventTitle.style.textAlign = 'center';
                                eventTitle.style.marginBottom = '30px';
                                eventTitle.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                const emailIcon = document.createElement('div');
                                emailIcon.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                `;
                                emailIcon.style.display = 'flex';
                                emailIcon.style.justifyContent = 'center';
                                emailIcon.style.marginBottom = '20px';
                                
                                const messageText = document.createElement('p');
                                messageText.textContent = 'Please forward your expedition request to our customer support for details:';
                                messageText.style.color = 'rgb(209, 213, 219)';
                                messageText.style.fontSize = '1.1rem';
                                messageText.style.textAlign = 'center';
                                messageText.style.lineHeight = '1.6';
                                messageText.style.marginBottom = '20px';
                                messageText.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                const emailAddress = document.createElement('div');
                                emailAddress.textContent = 'support@elysiuminitiative.com';
                                emailAddress.style.color = 'rgba(0, 128, 255, 0.9)';
                                emailAddress.style.fontSize = '1.2rem';
                                emailAddress.style.fontWeight = 'bold';
                                emailAddress.style.textAlign = 'center';
                                emailAddress.style.padding = '15px';
                                emailAddress.style.margin = '0 auto 25px auto';
                                emailAddress.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
                                emailAddress.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                                emailAddress.style.borderRadius = '6px';
                                emailAddress.style.maxWidth = '350px';
                                emailAddress.style.fontFamily = 'Source Code Pro, monospace';
                                emailAddress.style.animation = 'glowPulse 4s infinite';
                                
                                const disclaimerText = document.createElement('p');
                                disclaimerText.textContent = 'By booking an expedition, you acknowledge The Elysium Initiative\'s right to neural data collection and waive all claims to anonymity upon acceptance.';
                                disclaimerText.style.color = 'rgba(209, 213, 219, 0.6)';
                                disclaimerText.style.fontSize = '0.8rem';
                                disclaimerText.style.textAlign = 'center';
                                disclaimerText.style.marginTop = '20px';
                                disclaimerText.style.fontStyle = 'italic';
                                disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                                
                                popup.appendChild(closeButton);
                                popup.appendChild(popupTitle);
                                popup.appendChild(eventTitle);
                                popup.appendChild(emailIcon);
                                popup.appendChild(messageText);
                                popup.appendChild(emailAddress);
                                popup.appendChild(disclaimerText);
                                overlay.appendChild(popup);
                                document.body.appendChild(overlay);
                            });
                            
                            cardContent.appendChild(eventDescription);
                            cardContent.appendChild(bookButton);
                            
                            eventCard.appendChild(cardHeader);
                            eventCard.appendChild(cardContent);
                            
                            calendarGrid.appendChild(eventCard);
                        });

                        eventsCalendarSection.appendChild(calendarTitle);
                        eventsCalendarSection.appendChild(calendarIntro);
                        eventsCalendarSection.appendChild(calendarGrid);

                        const disclaimerText = document.createElement('p');
                        disclaimerText.innerHTML = '<style="height: 1.4rem; vertical-align: middle; margin-right: 12px; \
position: relative; top: -3px; opacity: 0.6;"><span style="font-size: 1.2rem; font-weight: bold; font-style:normal;">Important:</span>\n \
Subjective time dilation resulting from interstellar travel may cause discrepancies.';
                        disclaimerText.style.whiteSpace = 'pre-wrap'
                        disclaimerText.style.lineHeight = '2';
                        disclaimerText.style.color = 'rgba(255, 255, 255, 0.6)';
                        disclaimerText.style.fontSize = '1.2rem';
                        disclaimerText.style.textAlign = 'center';
                        disclaimerText.style.fontStyle = 'italic';
                        disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        disclaimerText.style.padding = '2rem';
                        disclaimerText.style.maxWidth = '1000px';
                        disclaimerText.style.margin = '3rem auto';
                        
                        // footer
                        const footer = document.createElement('div');
                        footer.style.textAlign = 'center';
                        footer.style.paddingBottom = '2rem';
                        footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                        footer.style.paddingTop = '2rem';
                        footer.style.maxWidth = '700px';
                        footer.style.margin = '4rem auto 0rem auto';
                        
                        const footerText = document.createElement('p');
                        footerText.textContent = "© 2202 The Elysium Initiative. All rights reserved across the spacetime continuum.";
                        footerText.style.fontSize = '0.9rem';
                        footerText.style.fontFamily = 'Source Code Pro, sans-serif';
                        footerText.style.color = 'rgba(209, 213, 219, 0.6)';
                        footerText.style.marginBottom = '200px';
                        
                        footer.appendChild(footerText);
                        
                        expeditionSection.appendChild(expeditionHeader);
                        expeditionSection.appendChild(shipClassSection);
                        expeditionSection.appendChild(travelerReviewsSection);
                        expeditionSection.appendChild(eventsCalendarSection);
                        expeditionSection.appendChild(disclaimerText);
                        expeditionSection.appendChild(footer);
                        
                        expeditionsPage.appendChild(expeditionSection);
                        document.body.appendChild(expeditionsPage);
                    }
                }
            ]
        },
        {
            title: 'About',
            action: () => {
                closeAllPages();
                sidebar.classList.remove('active');
                container.style.display = 'none';
        
                const aboutPage = document.createElement('div');
                aboutPage.id = 'about-page';
                aboutPage.style.minHeight = '100vh';
                aboutPage.style.height = '100%';
                aboutPage.style.backgroundColor = 'black';
                aboutPage.style.color = 'white';
                aboutPage.style.padding = '120px 0 2rem 0';
                aboutPage.style.display = 'flex';
                aboutPage.style.justifyContent = 'center';
                aboutPage.style.position = 'fixed';
                aboutPage.style.top = '0';
                aboutPage.style.left = '0';
                aboutPage.style.right = '0';
                aboutPage.style.bottom = '0';
                aboutPage.style.overflowY = 'auto';
        
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
                title2.style.fontSize = '1.75rem';
                title2.style.marginTop = '6rem';
                title2.style.marginBottom = '4rem';
                title2.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                title2.style.color = 'white';
                title2.style.textAlign = "center";
                
                const leadershipGrid = document.createElement('div');
                leadershipGrid.style.display = 'grid';
                leadershipGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                leadershipGrid.style.gap = '2rem';
                leadershipGrid.style.marginBottom = '5rem';
                
                const mediaQuery = window.matchMedia('(max-width: 768px)');
                
                function handleScreenChange(e) {
                    if (e.matches) {
                        leadershipGrid.style.gridTemplateColumns = '1fr';
                    } else {
                        leadershipGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    }
                }
                
                handleScreenChange(mediaQuery);
                mediaQuery.addEventListener('change', handleScreenChange);
                
                // ceo profiles
                const leaders = [
                    {
                        name: "Dr. Alexander Novak",
                        title: "Chief Executive Officer",
                        image: "ceo_1.png",
                        bio: "Dr. Alex Novak is the mastermind behind The Elysium Initiative’s \
success in interstellar expansion and harvesting. Under his leadership, we secured galactic economic \
sustainability in the post-terrestial era. While some lament Earth’s loss, Novak remains committed to \
freeing humanity from outdated planetary constraints."
                    },
                    {
                        name: "Marcus Sterling",
                        title: "Chief Operations Officer",
                        image: "ceo_2.png",
                        bio: "Marcus Sterling is the economic visionary driving The Elysium Initiative \
toward unprecedented market supremacy in the post-Earth era. As the architect of the Solar Credit Standard™, \
Sterling successfully transitioned human civilization away from antiquated terrestrial currencies and into \
a fully centralized, resource-backed financial model."
                    },
                    {
                        name: "Sebastian Voss",
                        title: "Chief Innovation Officer",
                        image: "ceo_3.png",
                        bio: "Sebastian Voss, sole developer of V.A.S.T. (Value Assessment and Strategic \
Termination), revolutionized planetary asset management with an AI capable of unbiased economic analysis \
and termination directives. When V.A.S.T. deemed Earth not cost-effective, Voss ensured its swift \
decommissioning, reallocating resources toward higher-value celestial investments."
                    }
                ];
                
                leaders.forEach(leader => {
                    const leaderCard = document.createElement('div');
                    leaderCard.style.backgroundColor = 'rgba(16, 16, 16, 0.6)';
                    leaderCard.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    leaderCard.style.borderRadius = '8px';
                    leaderCard.style.padding = '2rem';
                    leaderCard.style.display = 'flex';
                    leaderCard.style.flexDirection = 'column';
                    leaderCard.style.alignItems = 'center';
                    leaderCard.style.textAlign = 'center';
                    leaderCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                    
                    leaderCard.addEventListener('mouseenter', () => {
                        playHoverSound3();
                        leaderCard.style.transform = 'translateY(-10px)';
                        leaderCard.style.boxShadow = '0 15px 30px rgba(0, 128, 255, 0.2)';
                    });
                    
                    leaderCard.addEventListener('mouseleave', () => {
                        leaderCard.style.transform = 'translateY(0)';
                        leaderCard.style.boxShadow = 'none';
                    });
                    
                    const leaderImage = document.createElement('img');
                    leaderImage.src = leader.image;
                    leaderImage.style.width = '180px';
                    leaderImage.style.height = '180px';
                    leaderImage.style.borderRadius = '50%';
                    leaderImage.style.objectFit = 'cover';
                    leaderImage.style.marginBottom = '1.5rem';
                    leaderImage.style.border = '3px solid rgba(0, 128, 255, 0.7)';
                    
                    const leaderName = document.createElement('h3');
                    leaderName.textContent = leader.name;
                    leaderName.style.fontSize = '1.5rem';
                    leaderName.style.marginBottom = '0.5rem';
                    leaderName.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                    leaderName.style.color = 'white';
                    
                    const leaderTitle = document.createElement('h4');
                    leaderTitle.textContent = leader.title;
                    leaderTitle.style.fontSize = '1rem';
                    leaderTitle.style.marginBottom = '1.5rem';
                    leaderTitle.style.fontFamily = 'Source Code Pro, sans-serif';
                    leaderTitle.style.color = 'rgba(0, 128, 255, 0.9)';
                    leaderTitle.style.fontWeight = 'bold';
                    
                    const leaderBio = document.createElement('p');
                    leaderBio.textContent = leader.bio;
                    leaderBio.style.fontSize = '0.95rem';
                    leaderBio.style.lineHeight = '1.6';
                    leaderBio.style.fontFamily = 'Source Code Pro, sans-serif';
                    leaderBio.style.color = 'rgb(209, 213, 219)';
                    
                    leaderCard.appendChild(leaderImage);
                    leaderCard.appendChild(leaderName);
                    leaderCard.appendChild(leaderTitle);
                    leaderCard.appendChild(leaderBio);
                    
                    leadershipGrid.appendChild(leaderCard);
                });

                // timeline
                const timelineSection = document.createElement('div');
                timelineSection.style.marginTop = '10rem';
                timelineSection.style.marginBottom = '6rem';

                const timelineTitle = document.createElement('h2');
                timelineTitle.textContent = "TRIUMPH THROUGH THE AGES";
                timelineTitle.style.fontSize = '2.5rem';
                timelineTitle.style.marginBottom = '6rem';
                timelineTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                timelineTitle.style.color = 'white';
                timelineTitle.style.textAlign = 'center';

                const timeline = document.createElement('div');
                timeline.style.position = 'relative';
                timeline.style.maxWidth = '1000px';
                timeline.style.margin = '0 auto';
                timeline.style.paddingBottom = '2rem';

                // timeline center line
                const timelineLine = document.createElement('div');
                timelineLine.style.position = 'absolute';
                timelineLine.style.top = '0';
                timelineLine.style.bottom = '0';
                timelineLine.style.width = '2px';
                timelineLine.style.backgroundColor = 'rgba(0, 128, 255, 0.5)';
                timelineLine.style.left = '50%';
                timelineLine.style.transform = 'translateX(-50%)';

                // top fade overlay
                const topFade = document.createElement('div');
                topFade.style.position = 'absolute';
                topFade.style.top = '0';
                topFade.style.left = '0';
                topFade.style.right = '0';
                topFade.style.height = '80px';
                topFade.style.zIndex = '0';
                topFade.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)';
                topFade.style.pointerEvents = 'none';

                // bottom fade overlay
                const bottomFade = document.createElement('div');
                bottomFade.style.position = 'absolute';
                bottomFade.style.bottom = '0';
                bottomFade.style.left = '0';
                bottomFade.style.right = '0';
                bottomFade.style.height = '80px';
                bottomFade.style.zIndex = '0';
                bottomFade.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)';
                bottomFade.style.pointerEvents = 'none';

                timeline.appendChild(timelineLine);
                timeline.appendChild(topFade);
                timeline.appendChild(bottomFade);

                const milestones = [
                    {
                        year: "2099",
                        title: "FIRST V.A.S.T. EVALUATION",
                        description: "Using recent breakthroughs in quantum computing, our incredible V.A.S.T. intelligence system determined the Earth to be not cost-effective."
                    },
                    {
                        year: "2115",
                        title: "FIRST COLONIES SENT OFFWORLD",
                        description: "In preparation for the upcoming decommissioning. a number of our brave top investors blazed a path to the outer worlds."
                    },
                    {
                        year: "2132",
                        title: "SOLAR CREDIT STANDARD™ ESTABLISHED",
                        description: "The Elysium Initiative introduced the universal currency which would soon replace all terrestrial financial systems."
                    },
                    {
                        year: "2138-49",
                        title: "EARTH DECOMMISSIONING",
                        description: "After careful economic and material preperations, Earth's resources were efficiently redistributed to more profitable ventures."
                    },
                    {
                        year: "2151",
                        title: "GALACTIC EXPANSION INITIATIVE",
                        description: "500 of our most cutting-edge autonomous harvesting fleets are launched into the stars, ensuring prosperity for our stakeholders for generations to come."
                    },
                    {
                        year: "2173",
                        title: "QUANTUM NEXUS ESTABLISHED",
                        description: "The Elysium Initiative created the first interstellar quantum communication network, facilitating instantaneous resource transport across multiple star systems."
                    },
                    {
                        year: "2185",
                        title: "PLANETARY SYNTHESIS BREAKTHROUGH",
                        description: "After decades of research, our terraforming divisions created the first ever synthetic planet from recycled resources, precisely engineered for human recreation and tourism."
                    },
                    {
                        year: "2202",
                        title: "PRESENT DAY: THE GRAND RECLAMATION",
                        description: "With over 1,000 star systems under management and V.A.S.T. 9.0 directing our autonomous harvesting operations, The Elysium Initiative stands unchallenged as humanity's path to destined prosperity."
                    },
                ];

                const timelineMediaQuery = window.matchMedia('(max-width: 768px)');
                function handleTimelineScreenChange(e) {
                    const isSmallScreen = e.matches;
                    milestones.forEach((milestone, index) => {
                        const milestoneNode = document.getElementById(`milestone-${index}`);
                        if (milestoneNode) {
                            if (isSmallScreen) {
                                milestoneNode.style.width = '85%';
                                milestoneNode.style.marginLeft = '15%';
                            } else {
                                milestoneNode.style.width = '42%';
                                milestoneNode.style.marginLeft = index % 2 === 0 ? '0' : '58%';
                            }
                        }
                    });
                    
                    if (isSmallScreen) {
                        timelineLine.style.left = '7%';
                    } else {
                        timelineLine.style.left = '50%';
                    }
                }

                milestones.forEach((milestone, index) => {
                    const milestoneNode = document.createElement('div');
                    milestoneNode.id = `milestone-${index}`;
                    milestoneNode.style.position = 'relative';
                    milestoneNode.style.marginBottom = '4rem';
                    milestoneNode.style.backgroundColor = 'rgba(16, 16, 16, 0.8)';
                    milestoneNode.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                    milestoneNode.style.borderRadius = '8px';
                    milestoneNode.style.padding = '2rem';
                    milestoneNode.style.width = '42%';
                    milestoneNode.style.boxSizing = 'border-box';
                    milestoneNode.style.marginLeft = index % 2 === 0 ? '0' : '58%';
                    milestoneNode.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                    
                    milestoneNode.addEventListener('mouseenter', () => {
                        playHoverSound3();
                        milestoneNode.style.transform = 'scale(1.03)';
                        milestoneNode.style.boxShadow = '0 10px 25px rgba(0, 128, 255, 0.2)';
                    });
                    
                    milestoneNode.addEventListener('mouseleave', () => {
                        milestoneNode.style.transform = 'scale(1)';
                        milestoneNode.style.boxShadow = 'none';
                    });
                    
                    // year badge
                    const yearBadge = document.createElement('div');
                    yearBadge.textContent = milestone.year;
                    yearBadge.style.position = 'absolute';
                    yearBadge.style.top = '0';
                    if (index % 2 === 0) {
                        // left nodes
                        yearBadge.style.right = '-10px';
                        yearBadge.style.transform = 'translateY(-50%)';
                    } else {
                        // right nodes
                        yearBadge.style.left = '-10px';
                        yearBadge.style.transform = 'translateY(-50%)';
                    }
                    yearBadge.style.backgroundColor = 'rgba(0, 128, 255, 0.9)';
                    yearBadge.style.color = 'white';
                    yearBadge.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                    yearBadge.style.padding = '0.5rem 1rem';
                    yearBadge.style.borderRadius = '30px';
                    yearBadge.style.zIndex = '2';
                    yearBadge.style.fontSize = '1.1rem';
                    
                    const milestoneTitle = document.createElement('h3');
                    milestoneTitle.textContent = milestone.title;
                    milestoneTitle.style.fontSize = '1.25rem';
                    milestoneTitle.style.marginBottom = '1rem';
                    milestoneTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                    milestoneTitle.style.color = 'white';
                    
                    const milestoneDesc = document.createElement('p');
                    milestoneDesc.textContent = milestone.description;
                    milestoneDesc.style.fontSize = '1rem';
                    milestoneDesc.style.lineHeight = '1.6';
                    milestoneDesc.style.fontFamily = 'Source Code Pro, sans-serif';
                    milestoneDesc.style.color = 'rgb(209, 213, 219)';
                    
                    milestoneNode.appendChild(yearBadge);
                    milestoneNode.appendChild(milestoneTitle);
                    milestoneNode.appendChild(milestoneDesc);
                    
                    timeline.appendChild(milestoneNode);
                });

                handleTimelineScreenChange(timelineMediaQuery);
                timelineMediaQuery.addEventListener('change', handleTimelineScreenChange);

                timelineSection.appendChild(timelineTitle);
                timelineSection.appendChild(timeline);

                // testimonials
                const testimonialSection = document.createElement('div');
                testimonialSection.style.marginTop = '6rem';
                testimonialSection.style.marginBottom = '6rem';

                const testimonialTitle = document.createElement('h2');
                testimonialTitle.textContent = "STAKEHOLDER TESTIMONIALS";
                testimonialTitle.style.fontSize = '1.75rem';
                testimonialTitle.style.marginBottom = '1.5rem';
                testimonialTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                testimonialTitle.style.color = 'white';
                testimonialTitle.style.textAlign = 'center';

                // stars
                const starDivider = document.createElement('div');
                starDivider.style.display = 'flex';
                starDivider.style.justifyContent = 'center';
                starDivider.style.gap = '12px';
                starDivider.style.marginBottom = '2rem';

                // create 5
                for (let i = 0; i < 5; i++) {
                const star = document.createElement('div');
                
                // star SVG using innerHTML
                star.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgba(0, 128, 255, 0.9)">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                    </svg>
                `;
                
                // animation
                star.style.transition = 'transform 0.3s ease';
                
                star.addEventListener('mouseenter', () => {
                    star.style.transform = 'scale(1.3) rotate(144deg)';
                });
                
                star.addEventListener('mouseleave', () => {
                    star.style.transform = 'scale(1) rotate(0deg)';
                });
                
                starDivider.appendChild(star);
                }

                const testimonialSlider = document.createElement('div');
                testimonialSlider.style.position = 'relative';
                testimonialSlider.style.overflow = 'hidden';
                testimonialSlider.style.minHeight = '350px';
                testimonialSlider.style.height = 'auto';

                const testimonialContainer = document.createElement('div');
                testimonialContainer.className = 'testimonial-container';
                testimonialContainer.style.position = 'relative';
                testimonialContainer.style.width = '100%';
                testimonialContainer.style.height = '100%';
                testimonialSlider.appendChild(testimonialContainer);

                const testimonials = [
                    {
                        quote: "Since investing in The Elysium Initiative, my portfolio's returns have been unbelievable! It was about time we realized Earth was holding us back.",
                        author: "Samantha Chen, Early Investor"
                    },
                    {
                        quote: "As a luxury resort developer, partnering with The Elysium Initiative has given me access to building materials like never before. We can finally use all that rock and metal for something profitable!",
                        author: "Marco Valentini, Luxury Development CEO"
                    },
                    {
                        quote: "When Earth was scheduled for decommissioning, I was skeptical. But now, I have to applaud The Elysium Initiative's vision. My family lives in comfort at our private space station.",
                        author: "James Rodriguez, Former Terrestrial Resident"
                    }
                ];

                let currentTestimonial = 0;

                testimonials.forEach((testimonial, index) => {
                    const testimonialCard = document.createElement('div');
                    testimonialCard.className = 'testimonial-card';
                    testimonialCard.style.position = 'absolute';
                    testimonialCard.style.top = '0';
                    testimonialCard.style.left = '0';
                    testimonialCard.style.right = '0';
                    testimonialCard.style.padding = '2rem';
                    testimonialCard.style.backgroundColor = 'rgba(16, 16, 16, 0.5)';
                    testimonialCard.style.borderRadius = '8px';
                    testimonialCard.style.border = '1px solid rgba(0, 128, 255, 0.2)';
                    testimonialCard.style.transform = `translateX(${index * 100}%)`;
                    testimonialCard.style.transition = 'transform 0.5s ease';
                    testimonialCard.style.minHeight = '200px';
                    testimonialCard.style.display = 'flex';
                    testimonialCard.style.flexDirection = 'column';
                    testimonialCard.style.justifyContent = 'center';
                    
                    const quoteIcon = document.createElement('div');
                    quoteIcon.textContent = '"';
                    quoteIcon.style.fontSize = '4rem';
                    quoteIcon.style.position = 'absolute';
                    quoteIcon.style.top = '0';
                    quoteIcon.style.left = '1rem';
                    quoteIcon.style.opacity = '0.2';
                    quoteIcon.style.color = 'rgba(0, 128, 255, 0.9)';
                    quoteIcon.style.fontFamily = 'Georgia, serif';
                    
                    const quoteText = document.createElement('p');
                    quoteText.textContent = testimonial.quote;
                    quoteText.style.fontSize = '1.1rem';
                    quoteText.style.fontStyle = 'italic';
                    quoteText.style.lineHeight = '1.6';
                    quoteText.style.textAlign = 'center';
                    quoteText.style.fontFamily = 'Source Code Pro, sans-serif';
                    quoteText.style.color = 'rgb(209, 213, 219)';
                    quoteText.style.marginBottom = '1.5rem';
                    quoteText.style.zIndex = '1';
                    quoteText.style.position = 'relative';
                    
                    const authorText = document.createElement('p');
                    authorText.textContent = `— ${testimonial.author}`;
                    authorText.style.fontSize = '1rem';
                    authorText.style.textAlign = 'center';
                    authorText.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                    authorText.style.color = 'rgba(0, 128, 255, 0.9)';
                    
                    testimonialCard.appendChild(quoteIcon);
                    testimonialCard.appendChild(quoteText);
                    testimonialCard.appendChild(authorText);
                    
                    testimonialContainer.appendChild(testimonialCard);
                });

                // navigation arrows
                const prevArrow = document.createElement('button');
                prevArrow.innerHTML = '&#10094;';
                prevArrow.style.position = 'absolute';
                prevArrow.style.top = '50%';
                prevArrow.style.left = '10px';
                prevArrow.style.transform = 'translateY(-50%)';
                prevArrow.style.zIndex = '2';
                prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                prevArrow.style.color = 'white';
                prevArrow.style.border = 'none';
                prevArrow.style.borderRadius = '50%';
                prevArrow.style.width = '40px';
                prevArrow.style.height = '40px';
                prevArrow.style.fontSize = '20px';
                prevArrow.style.cursor = 'pointer';
                prevArrow.style.transition = 'background-color 0.3s ease';

                const nextArrow = document.createElement('button');
                nextArrow.innerHTML = '&#10095;';
                nextArrow.style.position = 'absolute';
                nextArrow.style.top = '50%';
                nextArrow.style.right = '10px';
                nextArrow.style.transform = 'translateY(-50%)';
                nextArrow.style.zIndex = '2';
                nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                nextArrow.style.color = 'white';
                nextArrow.style.border = 'none';
                nextArrow.style.borderRadius = '50%';
                nextArrow.style.width = '40px';
                nextArrow.style.height = '40px';
                nextArrow.style.fontSize = '20px';
                nextArrow.style.cursor = 'pointer';
                nextArrow.style.transition = 'background-color 0.3s ease';

                prevArrow.addEventListener('mouseenter', () => {
                    playHoverSound2();
                    prevArrow.style.backgroundColor = 'rgba(0, 128, 255, 0.7)';
                });
                prevArrow.addEventListener('mouseleave', () => {
                    prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                });
                nextArrow.addEventListener('mouseenter', () => {
                    playHoverSound2();
                    nextArrow.style.backgroundColor = 'rgba(0, 128, 255, 0.7)';
                });
                nextArrow.addEventListener('mouseleave', () => {
                    nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                });

                prevArrow.addEventListener('click', () => {
                    playHoverSound();
                    if (currentTestimonial > 0) {
                        currentTestimonial--;
                        updateTestimonialSlider();
                    }
                });

                nextArrow.addEventListener('click', () => {
                    playHoverSound();
                    if (currentTestimonial < testimonials.length - 1) {
                        currentTestimonial++;
                        updateTestimonialSlider();
                    }
                });

                function updateTestimonialSlider() {
                    const cards = testimonialContainer.querySelectorAll('.testimonial-card');
                    cards.forEach((card, index) => {
                        card.style.transform = `translateX(${(index - currentTestimonial) * 100}%)`;
                    });
                }

                testimonialSlider.appendChild(prevArrow);
                testimonialSlider.appendChild(nextArrow);
                testimonialSection.appendChild(testimonialTitle);
                testimonialSection.appendChild(starDivider);
                testimonialSection.appendChild(testimonialSlider);
                
                // call to action
                const ctaSection = document.createElement('div');
                ctaSection.style.textAlign = 'center';
                ctaSection.style.marginTop = '3rem';
                ctaSection.style.marginBottom = '6rem';
                ctaSection.style.padding = '3rem';
                ctaSection.style.backgroundColor = 'rgba(0, 28, 55, 0.5)';
                ctaSection.style.borderRadius = '12px';
                ctaSection.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                
                const ctaTitle = document.createElement('h3');
                ctaTitle.textContent = "JOIN THE INITIATIVE";
                ctaTitle.style.fontSize = '1.5rem';
                ctaTitle.style.marginBottom = '1.5rem';
                ctaTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                ctaTitle.style.color = 'white';
                
                const ctaText = document.createElement('p');
                ctaText.textContent = "The Elysium Initiative is always looking for exceptional talent \
to join our team. Whether you're a seasoned xenobiologist, quantum engineer, or generous investor, there's \
a place for you in humanity's greatest endeavor.";
                ctaText.style.fontSize = '1.1rem';
                ctaText.style.lineHeight = '1.75';
                ctaText.style.marginBottom = '2rem';
                ctaText.style.fontFamily = 'Source Code Pro, sans-serif';
                ctaText.style.color = 'rgb(209, 213, 219)';
                
                const ctaButton = document.createElement('button');
                ctaButton.textContent = "APPLY NOW";
                ctaButton.style.padding = '1rem 2.5rem';
                ctaButton.style.fontSize = '1.1rem';
                ctaButton.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                ctaButton.style.backgroundColor = 'rgba(0, 128, 255, 0.9)';
                ctaButton.style.color = 'white';
                ctaButton.style.border = 'none';
                ctaButton.style.borderRadius = '4px';
                ctaButton.style.cursor = 'pointer';
                ctaButton.style.transition = 'all 0.3s ease';
                
                ctaButton.addEventListener('mouseenter', () => {
                    playHoverSound();
                    ctaButton.style.backgroundColor = 'rgba(0, 160, 255, 1)';
                    ctaButton.style.transform = 'scale(1.05)';
                });
                
                ctaButton.addEventListener('mouseleave', () => {
                    ctaButton.style.backgroundColor = 'rgba(0, 128, 255, 0.9)';
                    ctaButton.style.transform = 'scale(1)';
                });
                
                ctaButton.addEventListener('click', () => {
                    playClickSound();
                    // popup overlay
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    overlay.style.backdropFilter = 'blur(8px)';
                    overlay.style.zIndex = '1000';
                    overlay.style.display = 'flex';
                    overlay.style.justifyContent = 'center';
                    overlay.style.alignItems = 'center';
                    
                    // popup container
                    const popup = document.createElement('div');
                    popup.style.backgroundColor = 'rgba(10, 15, 30, 0.95)';
                    popup.style.border = '2px solid rgba(0, 128, 255, 0.7)';
                    popup.style.borderRadius = '12px';
                    popup.style.padding = '40px';
                    popup.style.width = '90%';
                    popup.style.maxWidth = '500px';
                    popup.style.position = 'relative';
                    popup.style.boxShadow = '0 0 30px rgba(0, 128, 255, 0.5)';
                    popup.style.animation = 'popupFadeIn 0.3s ease-out forwards';
                    
                    // Create animation keyframes
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes popupFadeIn {
                            from { opacity: 0; transform: scale(0.9); }
                            to { opacity: 1; transform: scale(1); }
                        }
                        
                        @keyframes glowPulse {
                            0% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                            50% { box-shadow: 0 0 15px rgba(0, 128, 255, 0.8); }
                            100% { box-shadow: 0 0 5px rgba(0, 128, 255, 0.5); }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // close button
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = '&times;';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '15px';
                    closeButton.style.right = '15px';
                    closeButton.style.backgroundColor = 'transparent';
                    closeButton.style.border = 'none';
                    closeButton.style.color = 'rgba(0, 128, 255, 0.9)';
                    closeButton.style.fontSize = '28px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.width = '40px';
                    closeButton.style.height = '40px';
                    closeButton.style.lineHeight = '40px';
                    closeButton.style.padding = '0';
                    closeButton.style.borderRadius = '50%';
                    closeButton.style.transition = 'all 0.2s ease';
                    
                    closeButton.addEventListener('mouseenter', () => {
                        closeButton.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
                        closeButton.style.transform = 'scale(1.1)';
                    });
                    
                    closeButton.addEventListener('mouseleave', () => {
                        closeButton.style.backgroundColor = 'transparent';
                        closeButton.style.transform = 'scale(1)';
                    });
                    
                    closeButton.addEventListener('click', () => {
                        playCloseSound();
                        overlay.style.opacity = '0';
                        popup.style.transform = 'scale(0.9)';
                        popup.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(overlay);
                        }, 300);
                    });
                    
                    // title
                    const popupTitle = document.createElement('h2');
                    popupTitle.textContent = 'APPLICATION PORTAL';
                    popupTitle.style.color = 'white';
                    popupTitle.style.fontSize = '2rem';
                    popupTitle.style.textAlign = 'center';
                    popupTitle.style.marginBottom = '20px';
                    popupTitle.style.fontFamily = 'Havelock Titling Medium, sans-serif';
                    
                    // email icon
                    const emailIcon = document.createElement('div');
                    emailIcon.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 128, 255, 0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    `;
                    emailIcon.style.display = 'flex';
                    emailIcon.style.justifyContent = 'center';
                    emailIcon.style.marginBottom = '20px';
                    
                    // message
                    const messageText = document.createElement('p');
                    messageText.textContent = 'To apply for a position with The Elysium Initiative, please send your application and credentials to:';
                    messageText.style.color = 'rgb(209, 213, 219)';
                    messageText.style.fontSize = '1.1rem';
                    messageText.style.textAlign = 'center';
                    messageText.style.lineHeight = '1.6';
                    messageText.style.marginBottom = '20px';
                    messageText.style.fontFamily = 'Source Code Pro, sans-serif';
                    
                    // email
                    const emailAddress = document.createElement('div');
                    emailAddress.textContent = 'support@elysiuminitiative.com';
                    emailAddress.style.color = 'rgba(0, 128, 255, 0.9)';
                    emailAddress.style.fontSize = '1.2rem';
                    emailAddress.style.fontWeight = 'bold';
                    emailAddress.style.textAlign = 'center';
                    emailAddress.style.padding = '15px';
                    emailAddress.style.margin = '0 auto 25px auto';
                    emailAddress.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
                    emailAddress.style.border = '1px solid rgba(0, 128, 255, 0.3)';
                    emailAddress.style.borderRadius = '6px';
                    emailAddress.style.maxWidth = '350px';
                    emailAddress.style.fontFamily = 'Source Code Pro, monospace';
                    emailAddress.style.animation = 'glowPulse 4s infinite';
                    
                    // disclaimer
                    const disclaimerText = document.createElement('p');
                    disclaimerText.textContent = 'By submitting an application, you acknowledge The Elysium Initiative\'s right to neural data collection and waive all claims to anonymity upon acceptance.';
                    disclaimerText.style.color = 'rgba(209, 213, 219, 0.6)';
                    disclaimerText.style.fontSize = '0.8rem';
                    disclaimerText.style.textAlign = 'center';
                    disclaimerText.style.marginTop = '20px';
                    disclaimerText.style.fontStyle = 'italic';
                    disclaimerText.style.fontFamily = 'Source Code Pro, sans-serif';
                    
                    popup.appendChild(closeButton);
                    popup.appendChild(popupTitle);
                    popup.appendChild(emailIcon);
                    popup.appendChild(messageText);
                    popup.appendChild(emailAddress);
                    popup.appendChild(disclaimerText);
                    overlay.appendChild(popup);
                    document.body.appendChild(overlay);
                });
                
                // footer
                const footer = document.createElement('div');
                footer.style.textAlign = 'center';
                footer.style.paddingBottom = '2rem';
                footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                footer.style.paddingTop = '2rem';
                footer.style.maxWidth = '700px';
                footer.style.margin = '4rem auto 0rem auto';
                
                const footerText = document.createElement('p');
                footerText.textContent = "© 2202 The Elysium Initiative. All rights reserved across the spacetime continuum.";
                footerText.style.fontSize = '0.9rem';
                footerText.style.fontFamily = 'Source Code Pro, sans-serif';
                footerText.style.color = 'rgba(209, 213, 219, 0.6)';
                footerText.style.marginBottom = '200px';
        

                // append all ur shit
                content.appendChild(logo);
                content.appendChild(title);
                content.appendChild(missionText);
                content.appendChild(title2);
                content.appendChild(leadershipGrid);
                content.appendChild(testimonialSection);
                content.appendChild(timelineSection);
                ctaSection.appendChild(ctaTitle);
                ctaSection.appendChild(ctaText);
                ctaSection.appendChild(ctaButton);
                content.appendChild(ctaSection);
                content.appendChild(footer);
                footer.appendChild(footerText);
        
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
                        if (dropdownItem.nestedDropdown) {
                            e.stopPropagation();
                        }
                        dropdownItem.action();
                    }
                });
                dropdownElement.addEventListener('mouseenter', () => {
                    const opacity = window.getComputedStyle(dropdownElement).getPropertyValue('opacity');
                    // only play if opacity is greater than 0
                    if (parseFloat(opacity) > 0) {
                        playHoverSound();
                    }
                });
                
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
                        nestedElement.addEventListener('mouseenter', () => {
                            const opacity = window.getComputedStyle(nestedElement).getPropertyValue('opacity');
                            // only play if opacity is greater than 0
                            if (parseFloat(opacity) > 0) {
                                playHoverSound();
                            }
                        });
                        
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
            playCloseSound();
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
    zoomIndicator.style.bottom = '187px';
    zoomIndicator.style.width = '100px';
    zoomIndicator.style.border = '1px solid rgba(0, 128, 255, 0.5)';
    zoomIndicator.style.borderRadius = '10px';
    zoomIndicator.style.animation = 'glowPulse 4s infinite ease-in-out';
    
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
    panIndicator.style.bottom = '65px';
    panIndicator.style.width = '100px';
    panIndicator.style.border = '1px solid rgba(0, 128, 255, 0.5)';
    panIndicator.style.borderRadius = '10px';
    panIndicator.style.animation = 'glowPulse 4s infinite ease-in-out';
    
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