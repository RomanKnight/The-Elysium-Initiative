document.addEventListener('DOMContentLoaded', () => {
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

    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
        .menu-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            z-index: 1000;
        }
        .menu-item {
            color: rgb(200, 200, 200);
            padding: 0 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 18px;
            position: relative;
        }
        .menu-item:not(:first-child)::after {
            content: '';
            position: absolute;
            bottom: 35px;
            left: 20px;
            width: 0;
            height: 2px;
            background-color: rgb(255, 255, 255);
            transition: width 0.3s ease;
            transform-origin: left;
        }
        .menu-item:not(:first-child):hover::after {
            width: calc(100% - 40px);
        }
        .menu-item:hover {
            color: rgba(255, 255, 255, 1);
        }
        .dropdown {
            display: none;
            position: absolute;
            top: 100px;
            background-color: rgba(0, 0, 0, 0.5);
            min-width: 200px;
        }
        .menu-item:hover .dropdown {
            display: block;
        }
        .dropdown-item {
            color: rgb(200, 200, 200);
            padding: 15px 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-family: 'Havelock Titling Medium', sans-serif;
            font-size: 18px;
            position: relative;
        }
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
        .dropdown-item:hover {
            color: rgba(255, 255, 255, 1);
        }
    `;
    document.head.appendChild(menuStyle);

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
    zoomDisplay.style.right = '20px';
    zoomDisplay.style.padding = '8px 12px';
    zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    zoomDisplay.style.color = 'white';
    zoomDisplay.style.borderRadius = '5px';
    zoomDisplay.style.fontFamily = 'Source Code Pro, sans-serif';
    zoomDisplay.style.fontSize = '14px';
    zoomDisplay.style.fontWeight = 'bold';

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
            
            // start fading at scale 0.001, completely fade out by scale 0.01
            const opacity = Math.max(0, Math.min(1, (state.scale - 0.01) / (0.0001 - 0.01)));
            orbit.style.opacity = opacity;
        }

        const labels = objectsContainer.getElementsByTagName('div');
        for (let label of labels) {
            
            // start fading at scale 0.001, completely fade out by scale 0.01
            const labelOpacity = Math.max(0, Math.min(1, (state.scale - 0.6) / (0.3 - 0.6)));
            label.style.opacity = labelOpacity;
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
        const newScale = Math.min(Math.max(state.scale * delta, 0.00005), 150);
    
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
                }},
                { name: 'Mercury', action: () => {
                    state.scale = 9;
                    state.offsetX = -mercuryX * state.scale;
                    state.offsetY = -mercuryY * state.scale;
                    updateTransform();
                }},
                { name: 'Venus', action: () => {
                    state.scale = 5;
                    state.offsetX = -venusX * state.scale;
                    state.offsetY = -venusY * state.scale;
                    updateTransform();
                }},
                { name: 'Earth', action: () => {
                    state.scale = 5.5;
                    state.offsetX = -earthX * state.scale;
                    state.offsetY = -earthY * state.scale;
                    updateTransform();
                }},
                { name: 'Moon', action: () => {
                    state.scale = 13;
                    state.offsetX = -(EARTH_DISTANCE_PX + MOON_DISTANCE_PX) * state.scale;
                    state.offsetY = 0;
                    updateTransform();
                }},
                { name: 'Mars', action: () => {
                    state.scale = 10;
                    state.offsetX = -marsX * state.scale;
                    state.offsetY = -marsY * state.scale;
                    updateTransform();
                }},
                { name: 'Jupiter', action: () => {
                    state.scale = 7;
                    state.offsetX = -jupiterX * state.scale;
                    state.offsetY = -jupiterY * state.scale;
                    updateTransform();
                }},
                { name: 'Saturn', action: () => {
                    state.scale = 10;
                    state.offsetX = -saturnX * state.scale;
                    state.offsetY = -saturnY * state.scale;
                    updateTransform();
                }},
                { name: 'Uranus', action: () => {
                    state.scale = 1.2;
                    state.offsetX = -uranusX * state.scale;
                    state.offsetY = -uranusY * state.scale;
                    updateTransform();
                }},
                { name: 'Neptune', action: () => {
                    state.scale = 1.2;
                    state.offsetX = -neptuneX * state.scale;
                    state.offsetY = -neptuneY * state.scale;
                    updateTransform();
                }},
                { name: 'Pluto', action: () => {
                    state.scale = 0.15;
                    state.offsetX = -plutoX * state.scale;
                    state.offsetY = -plutoY * state.scale;
                    updateTransform();
                }}
            ]
        },
        {
            title: 'Prospecting',
            dropdown: [
                { name: 'Index'},
                { name: 'Assets'}
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
blaze a new frontier for those who dare to dream beyond Earth's constraints. As pioneers of this post-\
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
                    playClickSound();
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

    // planet labels
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

    addUIElement(zoomDisplay);
});