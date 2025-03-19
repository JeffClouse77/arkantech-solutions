// Enhanced Region Data for Arkansas Tech Map
const regionData = {
    northwest: {
        title: "Northwest Arkansas - Technology Innovation Hub",
        description: "Home to major tech companies and startups focused on retail technology, supply chain innovation, data analytics, and a growing tech ecosystem. The Ozark Mountains provide a backdrop for a thriving technology community.",
        stats: {
            companies: "250+",
            jobs: "15,000+",
            growth: "12.5%",
            investment: "$2.4B"
        },
        highlights: [
            "University Research Partnerships",
            "Retail Technology Center",
            "AI & Machine Learning Hub",
            "Startup Incubators"
        ]
    },
    northeast: {
        title: "Northeast Arkansas - Agricultural Tech Center",
        description: "A rising technology corridor emphasizing agricultural innovation, logistics technology, and sustainable solutions. This region combines traditional farming with cutting-edge agritech developments.",
        stats: {
            companies: "120+",
            jobs: "8,500+",
            growth: "8.2%",
            investment: "$920M"
        },
        highlights: [
            "Precision Agriculture",
            "Supply Chain Logistics",
            "Drone Technology",
            "Sustainable Farming Systems"
        ]
    },
    central: {
        title: "Central Arkansas - Digital Commerce Corridor",
        description: "The state's primary technology hub, featuring fintech companies, healthcare innovation centers, and government technology solutions. Little Rock serves as the anchor for this vibrant tech ecosystem.",
        stats: {
            companies: "300+",
            jobs: "22,000+",
            growth: "15.8%",
            investment: "$3.5B"
        },
        highlights: [
            "Financial Technology Center",
            "Healthcare Innovation",
            "Government Tech Solutions",
            "Cybersecurity Development"
        ]
    },
    southwest: {
        title: "Southwest Arkansas - Manufacturing Technology Zone",
        description: "Emerging technology center focused on industrial automation, smart manufacturing, defense technology, and natural resource management innovations.",
        stats: {
            companies: "85+",
            jobs: "5,800+",
            growth: "7.4%",
            investment: "$680M"
        },
        highlights: [
            "Advanced Manufacturing",
            "Industrial Automation",
            "Smart Resource Management",
            "Defense Technology"
        ]
    },
    southeast: {
        title: "Southeast Arkansas - Agricultural Innovation District",
        description: "Developing region with focus on agricultural technology, renewable energy innovation, smart farming solutions, and water management systems for the Mississippi Delta.",
        stats: {
            companies: "65+",
            jobs: "4,200+",
            growth: "6.3%",
            investment: "$420M"
        },
        highlights: [
            "Renewable Energy Solutions",
            "Smart Irrigation Systems",
            "Crop Management Technology",
            "Sustainable Development"
        ]
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});

function initializeMap() {
    // Get map container and wait for SVG to load
    const mapContainer = document.querySelector('.arkansas-map-container');
    if (!mapContainer) return;

    const svgObject = mapContainer.querySelector('.arkansas-map');
    if (!svgObject) return;

    // Initialize mobile detection
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        document.documentElement.classList.add('mobile-device');
    }

    // Wait for SVG to load
    svgObject.addEventListener('load', () => {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;

        // Create info panel
        createInfoPanel(mapContainer);
        
        // Initialize Intersection Observer
        initIntersectionObserver(svgDoc);
        
        // Setup region interactions
        setupRegionInteractions(svgDoc);
        
        // Setup city marker interactions
        setupCityMarkerInteractions(svgDoc);
        
        // Add touch support
        setupTouchSupport(svgDoc);
        
        // Handle window resize
        setupResizeHandler();
        
        // Performance optimizations
        optimizePerformance(svgDoc);

        // Add map loading complete class
        mapContainer.classList.add('map-loaded');
    });
}

// Create info panel with enhanced structure
function createInfoPanel(container) {
    const infoPanel = document.createElement('div');
    infoPanel.className = 'map-info-panel';
    infoPanel.innerHTML = `
        <div class="info-panel-close">&times;</div>
        <h3 class="info-panel-title">Select a Region</h3>
        <p class="info-panel-content">Click on any region of Arkansas to learn about its technology ecosystem.</p>
        <div class="info-panel-stats"></div>
    `;
    container.appendChild(infoPanel);
    
    // Add close button functionality
    const closeBtn = infoPanel.querySelector('.info-panel-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            infoPanel.classList.remove('active');
            resetRegions();
            e.stopPropagation();
        });
    }
}

// Initialize Intersection Observer with enhanced thresholds
function initIntersectionObserver(svgDoc) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate map elements when in view
            animateMapElements(svgDoc);
            observer.disconnect();
        }
    }, {
        rootMargin: '0px',
        threshold: 0.15
    });

    observer.observe(svgDoc.querySelector('svg'));
}

// Animate map elements with staggered approach
function animateMapElements(svgDoc) {
    // Get all animation groups
    const regions = svgDoc.querySelector('.regions');
    const techOverlay = svgDoc.querySelector('.tech-overlay');
    const topography = svgDoc.querySelector('.topography');
    const rivers = svgDoc.querySelector('.rivers');
    const cities = svgDoc.querySelector('.cities');
    const hexCodes = svgDoc.querySelector('.hex-codes');
    
    // Staggered animations
    if (regions) regions.style.opacity = '1';
    
    setTimeout(() => {
        if (techOverlay) techOverlay.style.opacity = '0.15';
    }, 800);
    
    setTimeout(() => {
        if (topography) topography.style.opacity = '1';
    }, 1200);
    
    setTimeout(() => {
        if (rivers) rivers.style.opacity = '1';
    }, 1800);
    
    setTimeout(() => {
        if (cities) cities.style.opacity = '1';
    }, 2400);
    
    setTimeout(() => {
        if (hexCodes) hexCodes.style.opacity = '1';
    }, 3000);
}

// Set up region interactions with enhanced feedback
function setupRegionInteractions(svgDoc) {
    const regions = svgDoc.querySelectorAll('.region');
    const infoPanel = document.querySelector('.map-info-panel');
    if (!regions || !infoPanel) return;
    
    let activeRegion = null;
    
    regions.forEach(region => {
        // Add tabindex for accessibility
        region.setAttribute('tabindex', '0');
        
        // Add ARIA attributes
        region.setAttribute('role', 'button');
        region.setAttribute('aria-expanded', 'false');
        
        // Click event
        region.addEventListener('click', (e) => {
            e.stopPropagation();
            const regionId = region.getAttribute('data-region');
            
            // Reset previous active region
            if (activeRegion && activeRegion !== region) {
                activeRegion.classList.remove('active');
                activeRegion.setAttribute('aria-expanded', 'false');
            }
            
            // Select current region
            activeRegion = region;
            region.classList.add('active');
            region.setAttribute('aria-expanded', 'true');
            
            // Update and show info panel
            updateInfoPanel(regionId);
            infoPanel.classList.add('active');
            
            // Add visual feedback
            addClickRippleEffect(e, region);
        });
        
        // Keyboard accessibility
        region.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                region.click();
            }
        });
        
        // Hover effects with performance optimization
        region.addEventListener('mouseenter', () => {
            region.style.willChange = 'transform, filter';
        });
        
        region.addEventListener('mouseleave', () => {
            if (region !== activeRegion) {
                region.style.willChange = 'auto';
            }
        });
    });
    
    // Close info panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.region') && !e.target.closest('.map-info-panel')) {
            infoPanel.classList.remove('active');
            resetRegions();
        }
    });
    
    // Reset all regions
    function resetRegions() {
        regions.forEach(r => {
            r.classList.remove('active');
            r.setAttribute('aria-expanded', 'false');
            r.style.willChange = 'auto';
        });
        activeRegion = null;
    }
}

// Add ripple effect for better visual feedback on click
function addClickRippleEffect(event, element) {
    const ripple = document.createElement('div');
    ripple.className = 'map-ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Set up city marker interactions with enhanced feedback
function setupCityMarkerInteractions(svgDoc) {
    const cityMarkers = svgDoc.querySelectorAll('.city-marker');
    if (!cityMarkers) return;
    
    cityMarkers.forEach(marker => {
        const label = marker.nextElementSibling;
        if (!label || !label.classList.contains('city-label')) return;
        
        // Add ARIA attributes for accessibility
        marker.setAttribute('role', 'button');
        marker.setAttribute('tabindex', '0');
        marker.setAttribute('aria-label', marker.querySelector('title')?.textContent || 'City');
        
        // Mouse interactions
        marker.addEventListener('mouseenter', () => {
            marker.style.willChange = 'transform, opacity';
            label.style.opacity = '1';
            label.style.transform = 'translateY(-2px)';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.willChange = 'auto';
            label.style.opacity = '0';
            label.style.transform = 'translateY(0)';
        });
        
        // Click to show brief tooltip
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            showCityTooltip(marker, label);
        });
        
        // Keyboard accessibility
        marker.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showCityTooltip(marker, label);
            }
        });
    });
}

// Show city tooltip with brief info
function showCityTooltip(marker, label) {
    // Create tooltip if it doesn't exist
    let tooltip = document.getElementById('city-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'city-tooltip';
        tooltip.className = 'city-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Position tooltip near the marker
    const rect = marker.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width/2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    
    // Set content
    const title = marker.querySelector('title')?.textContent || label.textContent;
    tooltip.innerHTML = `<strong>${title}</strong>`;
    
    // Show tooltip
    tooltip.classList.add('active');
    
    // Hide after short delay
    setTimeout(() => {
        tooltip.classList.remove('active');
    }, 2000);
}

// Update info panel with region data
function updateInfoPanel(regionId) {
    const infoPanel = document.querySelector('.map-info-panel');
    if (!infoPanel) return;
    
    const data = regionData[regionId];
    if (!data) return;
    
    const title = infoPanel.querySelector('.info-panel-title');
    const content = infoPanel.querySelector('.info-panel-content');
    const stats = infoPanel.querySelector('.info-panel-stats');
    
    if (title) title.textContent = data.title;
    if (content) content.textContent = data.description;
    
    if (stats) {
        // Clear previous stats
        stats.innerHTML = '';
        
        // Add stat items
        for (const [key, value] of Object.entries(data.stats)) {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            let label = key.charAt(0).toUpperCase() + key.slice(1);
            if (key === 'companies') label = 'Tech Companies';
            if (key === 'jobs') label = 'Tech Jobs';
            if (key === 'growth') label = 'Annual Growth';
            if (key === 'investment') label = 'Tech Investment';
            
            statItem.innerHTML = `
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            `;
            
            stats.appendChild(statItem);
        }
        
        // Add highlights section
        if (data.highlights && data.highlights.length) {
            const highlightsSection = document.createElement('div');
            highlightsSection.className = 'highlights-section';
            
            const highlightsList = document.createElement('ul');
            highlightsList.className = 'highlights-list';
            
            data.highlights.forEach(highlight => {
                const item = document.createElement('li');
                item.textContent = highlight;
                highlightsList.appendChild(item);
            });
            
            highlightsSection.appendChild(highlightsList);
            stats.appendChild(highlightsSection);
        }
    }
    
    // Add extra CSS class to indicate the current region
    infoPanel.className = 'map-info-panel active';
    infoPanel.classList.add(`region-${regionId}`);
}

// Add touch support for mobile devices
function setupTouchSupport(svgDoc) {
    if (!('ontouchstart' in window)) return;
    
    const regions = svgDoc.querySelectorAll('.region');
    const cityMarkers = svgDoc.querySelectorAll('.city-marker');
    
    // Add touch-specific classes
    document.documentElement.classList.add('touch-device');
    
    // Enhanced touch feedback for regions
    if (regions) {
        regions.forEach(region => {
            region.addEventListener('touchstart', () => {
                region.classList.add('touch-active');
            });
            
            region.addEventListener('touchend', () => {
                setTimeout(() => {
                    region.classList.remove('touch-active');
                }, 300);
            });
            
            region.addEventListener('touchcancel', () => {
                region.classList.remove('touch-active');
            });
        });
    }
    
    // Enhanced touch feedback for city markers
    if (cityMarkers) {
        cityMarkers.forEach(marker => {
            const label = marker.nextElementSibling;
            
            marker.addEventListener('touchstart', () => {
                marker.classList.add('touch-active');
                if (label) label.style.opacity = '1';
            });
            
            marker.addEventListener('touchend', () => {
                setTimeout(() => {
                    marker.classList.remove('touch-active');
                    if (label) label.style.opacity = '0';
                }, 1500);
            });
            
            marker.addEventListener('touchcancel', () => {
                marker.classList.remove('touch-active');
                if (label) label.style.opacity = '0';
            });
        });
    }
}

// Handle window resize
function setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        
        // Debounce resize events
        resizeTimeout = setTimeout(() => {
            const infoPanel = document.querySelector('.map-info-panel');
            if (!infoPanel) return;
            
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            
            if (isMobile) {
                document.documentElement.classList.add('mobile-device');
                infoPanel.style.transform = 'none';
            } else {
                document.documentElement.classList.remove('mobile-device');
                if (!infoPanel.classList.contains('active')) {
                    infoPanel.style.transform = 'translateY(-50%)';
                }
            }
        }, 250);
    });
}

// Performance optimizations
function optimizePerformance(svgDoc) {
    // Optimize animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    });
    
    // Minimize repaints for river animations
    const rivers = svgDoc.querySelectorAll('.river');
    if (rivers) {
        rivers.forEach(river => {
            river.style.willChange = 'stroke-dashoffset';
        });
    }
    
    // Add passive event listeners for touch events
    if ('ontouchstart' in window) {
        const options = { passive: true };
        
        svgDoc.addEventListener('touchstart', () => {}, options);
        svgDoc.addEventListener('touchmove', () => {}, options);
        svgDoc.addEventListener('touchend', () => {}, options);
    }
    
    // Add pause animations when scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        document.body.classList.add('scrolling');
        
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 200);
    }, { passive: true });
} 