document.addEventListener('DOMContentLoaded', () => {
    const ambientSound = new Audio('ambience.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0;
    ambientSound.play();

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
            transition: opacity 0.31s ease, transform 0.3s ease;
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
        strokeWidth: 2.5
    };

    // planet label fading thresholds (second number should be larger)
    const labelFadeThresholds = {
        'Sun': { start: 0.01, end: 0.1 },
        'Mercury': { start: 0.1, end: 1 },
        'Venus': { start: 0.05, end: 0.5 },
        'Earth': { start: 0.05, end: 0.5 },
        'Moon': { start: 0.1, end: 1 },
        'Mars': { start: 0.1, end: 1 },
        'Jupiter': { start: 0.1, end: 1 },
        'Saturn': { start: 0.15, end: 1.5 },
        'Uranus': { start: 0.01, end: 0.1 },
        'Neptune': { start: 0.01, end: 0.1 },
        'Pluto': { start: 0.001, end: 0.01 }
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
        
        const orbits = orbitsSvg.getElementsByTagName('circle');
        for (let orbit of orbits) {
            orbit.setAttribute('stroke-width', state.strokeWidth / state.scale);
            
            const opacity = Math.max(0, Math.min(1, (state.scale - 0.01) / (0.0001 - 0.01)));
            orbit.style.opacity = opacity;
        }
    
        const labels = objectsContainer.getElementsByTagName('div');
        for (let label of labels) {
            const planetName = label.dataset.planetName;
            if (planetName && labelFadeThresholds[planetName]) {
                const { start, end } = labelFadeThresholds[planetName];
                const labelOpacity = Math.max(0, Math.min(1, (state.scale - end) / (start - end)));
                label.style.opacity = labelOpacity;
            }
            label.style.transform = label.style.transform.replace(/scale\([^\)]+\)/, `scale(${1 / state.scale})`);
        }
        
        zoomDisplay.textContent = `Magnification: ${(state.scale * 10000).toFixed(2)}`;
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
                if (document.getElementById('about-page')) {
                    document.body.removeChild(document.getElementById('about-page'));
                    container.style.display = 'flex';
                }
            },
            dropdown: [
                { name: 'Sun', action: () => {
                    state.scale = 0.8;
                    state.offsetX = 0;
                    state.offsetY = 0;
                    updateTransform();
                    showPlanetInfo('Sun');
                }},
                { name: 'Mercury', action: () => {
                    state.scale = 9;
                    state.offsetX = -mercuryX * state.scale;
                    state.offsetY = -mercuryY * state.scale;
                    updateTransform();
                    showPlanetInfo('Mercury');
                }},
                { name: 'Venus', action: () => {
                    state.scale = 5;
                    state.offsetX = -venusX * state.scale;
                    state.offsetY = -venusY * state.scale;
                    updateTransform();
                    showPlanetInfo('Venus');
                }},
                { name: 'Earth', action: () => {
                    state.scale = 5.5;
                    state.offsetX = -earthX * state.scale;
                    state.offsetY = -earthY * state.scale;
                    updateTransform();
                    showPlanetInfo('Earth');
                }},
                { name: 'Moon', action: () => {
                    state.scale = 13;
                    state.offsetX = -(EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * state.scale;
                    state.offsetY = 0;
                    updateTransform();
                    showPlanetInfo('Moon');
                }},
                { name: 'Mars', action: () => {
                    state.scale = 10;
                    state.offsetX = -marsX * state.scale;
                    state.offsetY = -marsY * state.scale;
                    updateTransform();
                    showPlanetInfo('Mars');
                }},
                { name: 'Jupiter', action: () => {
                    state.scale = 7;
                    state.offsetX = -jupiterX * state.scale;
                    state.offsetY = -jupiterY * state.scale;
                    updateTransform();
                    showPlanetInfo('Jupiter');
                }},
                { name: 'Saturn', action: () => {
                    state.scale = 10;
                    state.offsetX = -saturnX * state.scale;
                    state.offsetY = -saturnY * state.scale;
                    updateTransform();
                    showPlanetInfo('Saturn');
                }},
                { name: 'Uranus', action: () => {
                    state.scale = 1.2;
                    state.offsetX = -uranusX * state.scale;
                    state.offsetY = -uranusY * state.scale;
                    updateTransform();
                    showPlanetInfo('Uranus');
                }},
                { name: 'Neptune', action: () => {
                    state.scale = 1.2;
                    state.offsetX = -neptuneX * state.scale;
                    state.offsetY = -neptuneY * state.scale;
                    updateTransform();
                    showPlanetInfo('Neptune');
                }},
                { name: 'Pluto', action: () => {
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
                { name: 'Index'},
                { name: 'Extraction'}
            ]
        },
        {
            title: 'Travel',
            dropdown: [
                { name: 'Getaways'},
                { name: 'Expeditions'},
                { name: 'Charters'}
            ]
        },
        {
            title: 'About',
            action: () => {
                // close sidebar
                sidebar.classList.remove('active');
                
                // hide main container
                container.style.display = 'none';
        
                const aboutPageContainer = document.createElement('div');
                aboutPageContainer.id = 'about-page';
                aboutPageContainer.style.minHeight = '100vh';
                aboutPageContainer.style.height = '100%';
                aboutPageContainer.style.backgroundColor = 'black';
                aboutPageContainer.style.color = 'white';
                aboutPageContainer.style.padding = '120px 2rem 2rem 2rem';
                aboutPageContainer.style.display = 'flex';
                aboutPageContainer.style.justifyContent = 'center';
                aboutPageContainer.style.position = 'fixed';
                aboutPageContainer.style.top = '0';
                aboutPageContainer.style.left = '0';
                aboutPageContainer.style.right = '0';
                aboutPageContainer.style.bottom = '0';
                aboutPageContainer.style.overflowY = 'scroll';
        
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
                missionText.textContent = "     As the universe's premiere prospecting and colonization agency, \
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
        
                aboutPageContainer.appendChild(content);
                document.body.appendChild(aboutPageContainer);
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
                dropdownElement.textContent = dropdownItem.name;
                dropdownElement.style.setProperty('--underline-width', `${dropdownItem.name.length + 1}ch`);
                dropdownElement.addEventListener('click', () => {
                    if (dropdownItem.action) {
                        dropdownItem.action();
                    }
                });
                dropdownElement.addEventListener('mouseenter', playHoverSound);
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
                "Distance": "1 AU",
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
                "Distance": "0.52-1.48 AU",
                "Valuation": "$4-5 quintillion",
                "Extraction": "Mining automata",
                "Mass": "3.301 × 10^23 kg",
                "Diameter": "4879 km",
                "Composition": "70% - Iron<br>15% - Oxygen<br>6% - Silicon<br>3% - Sulfur<br>2% - Nickel<br>4% - Other",
                "Surface Temperature": "100-700 K"
            }
        },
        Venus: {
            description: "Greenhouse world. Sulferic acid cloud cover",
            stats: {
                "Distance": "0.28-1.72 AU",
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
                "Valuation": "$85-100 sextillion",
                "Extraction": "Completed",
                "Mass": "5.972 x 10^24 kg",
                "Diameter": "12,742 km",
                "Atmospheric Composition": "78% - Nitrogen<br>21% - Oxygen<br>0.9% - Argon<br>0.1% - Other",
                "Planet Composition": "35% - Iron<br>30% - Oxygen<br>15% - Silicon<br>13% - Magnesium<br>2.4% - Nickel<br>4.6% - Other",
                "Surface Temperature": "288 K"
            }
        },
        Moon: {
            description: "Earth's only natural satellite and humanity's first step into space. Now home to multiple research bases and mining operations.",
            stats: {
                "Distance": "0.0026 AU",
                "Valuation": "$60 quintillion ",
                "Extraction": "Mining automata",
                "Mass": "7.346 x 10^22 kg",
                "Diameter": "3475 km",
                "Composition": "42% - Oxygen<br>19% - Silicon<br>14% - Magnesium<br>13% - Iron<br>8% - Calcium<br>4% - Other",
                "Surface Temperature": "250 K"
            }
        },
        Mars: {
            description: "The red planet and humanity's first major colonization target. Rich in iron and perfect for initial terraforming experiments.",
            stats: {
                "Distance": "0.52-2.52 AU",
                "Valuation": "$2-3 septillion",
                "Extraction": "Mining automata, atmospheric skimming",
                "Mass": "6.417 x 10^23 kg",
                "Diameter": "6779 km",
                "Atmospheric Composition": "95% - Carbon Dioxide<br>2.7% - Nitrogen<br>1.6% - Argon<br>0.1% - Oxygen<br>0.6% - Other",
                "Planet Composition": "29.5% - Oxygen<br>27% - Iron<br>17% - Silicon<br>16% - Magnesium<br>3% - Sulfur<br>7.5% - Other",
                "Surface Temperature": "210 K"
            }
        },
        Jupiter: {
            description: "The largest planet in our solar system. Its powerful gravitational field protects the inner solar system and provides unique mining opportunities.",
            stats: {
                "Distance": "4.20-6.22 AU",
                "Valuation": "$1-2 octillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "1.898 x 10^27 kg",
                "Diameter": "139,820 km",
                "Composition": "89% - Hydrogen<br>10% - Helium<br>1% - Other",
                "Surface Temperature": "134 K"
            }
        },
        Saturn: {
            description: "Known for its spectacular rings, Saturn is a gas giant with numerous moons rich in resources and potential for colonization.",
            stats: {
                "Distance": "8.58-10.62 AU",
                "Valuation": "$300-600 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "5.683 x 10^26 kg",
                "Diameter": "116,500 km",
                "Composition": "94% - Hydrogen<br>5% - Helium<br>1% - Other",
                "Surface Temperature": "134 K"
            }
        },
        Uranus: {
            description: "An ice giant with unique rotational properties. Its moons hold potential for mining water ice and other valuable compounds.",
            stats: {
                "Distance": "18.36-20.06 AU",
                "Valuation": "$600-900 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "8.681 x 10^25 kg",
                "Diameter": "50,724 km",
                "Composition": "83% - Hydrogen<br>15% - Helium<br>1% - Oxygen<br>1% - Other",
                "Surface Temperature": "76 K"
            }
        },
        Neptune: {
            description: "The windiest planet in the Solar System. Its position makes it a potential future fuel station for deep space missions.",
            stats: {
                "Distance": "28.80-30.07 AU",
                "Valuation": "$500-600 sextillion",
                "Extraction": "Dyson Hemisphere",
                "Mass": "1.024 x 10^26 kg",
                "Diameter": "49,244 km",
                "Composition": "80% - Hydrogen<br>19% - Helium<br>1% - Other",
                "Surface Temperature": "72 K"
            }
        },
        Pluto: {
            description: "A dwarf planet and the gateway to the Kuiper Belt. Its unique composition makes it valuable for deep space research.",
            stats: {
                "Distance": "29.65-49.30 AU",
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
            'Earth': '2',
            'Moon': '1',
            'Mars': '2',
            'Jupiter': '3',
            'Saturn': '2',
            'Uranus': '2',
            'Neptune': '2',
            'Pluto': '1'
        };

        const dollarCount = parseInt(economicSymbols[planetName]) || 1;
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

    // Create and configure planet labels
    function configurePlanetLabel(label, planetName) {
        label.style.cursor = 'pointer';
        label.addEventListener('click', (e) => {
            e.stopPropagation();
            const navigationItem = menuItems[1].dropdown.find(item => item.name === planetName);
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
    const jupiterLabel = configurePlanetLabel(createPlanetLabel('Jupiter', jupiterX, jupiterY), 'Jupiter');
    const saturnLabel = configurePlanetLabel(createPlanetLabel('Saturn', saturnX, saturnY), 'Saturn');
    const uranusLabel = configurePlanetLabel(createPlanetLabel('Uranus', uranusX, uranusY), 'Uranus');
    const neptuneLabel = configurePlanetLabel(createPlanetLabel('Neptune', neptuneX, neptuneY), 'Neptune');
    const plutoLabel = configurePlanetLabel(createPlanetLabel('Pluto', plutoX, plutoY), 'Pluto');

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
    function createOrbitCircle(radius, color = 'rgba(255, 255, 255, 0.5)') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', state.strokeWidth);
        circle.style.transition = 'opacity 0.3s ease';
        return circle;
    }

    const mercuryOrbit = createOrbitCircle(MERCURY_DISTANCE_PX, 'rgba(255, 140, 86, 0.5)');
    const venusOrbit = createOrbitCircle(VENUS_DISTANCE_PX, 'rgba(255, 217, 0, 0.5)');
    const earthOrbit = createOrbitCircle(EARTH_DISTANCE_PX, 'rgba(0, 255, 55, 0.5)');
    const marsOrbit = createOrbitCircle(MARS_DISTANCE_PX, 'rgba(255, 72, 0, 0.5)');
    const jupiterOrbit = createOrbitCircle(JUPITER_DISTANCE_PX, 'rgba(255, 166, 0, 0.5)');
    const saturnOrbit = createOrbitCircle(SATURN_DISTANCE_PX, 'rgba(255, 230, 0, 0.5)');
    const uranusOrbit = createOrbitCircle(URANUS_DISTANCE_PX, 'rgba(0, 225, 255, 0.5)');
    const neptuneOrbit = createOrbitCircle(NEPTUNE_DISTANCE_PX, 'rgba(0, 89, 255, 0.5)');
    const plutoOrbit = createOrbitCircle(PLUTO_DISTANCE_PX, 'rgba(138, 87, 255, 0.5)');

    orbitsSvg.appendChild(mercuryOrbit);
    orbitsSvg.appendChild(venusOrbit);
    orbitsSvg.appendChild(earthOrbit);
    orbitsSvg.appendChild(marsOrbit);
    orbitsSvg.appendChild(jupiterOrbit);
    orbitsSvg.appendChild(saturnOrbit);
    orbitsSvg.appendChild(uranusOrbit);
    orbitsSvg.appendChild(neptuneOrbit);
    orbitsSvg.appendChild(plutoOrbit);

    // click handlers for planets
    [
        { element: sunImage, name: 'Sun' },
        { element: mercuryImage, name: 'Mercury' },
        { element: venusImage, name: 'Venus' },
        { element: earthImage, name: 'Earth' },
        { element: moonImage, name: 'Moon' },
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