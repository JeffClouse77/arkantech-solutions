// Region data with descriptions and services
const regionData = {
    northwest: {
        title: 'Northwest Arkansas - Ozark Mountains',
        description: 'Home to the Ozark Mountains and major business centers.',
        services: [
            'Technology Consulting',
            'Enterprise Solutions',
            'Digital Transformation',
            'Cloud Services',
            'Data Analytics'
        ]
    },
    northeast: {
        title: 'Northeast Arkansas - Mississippi Delta',
        description: 'Rich agricultural region with growing technology sector.',
        services: [
            'AgTech Solutions',
            'IoT Implementation',
            'Supply Chain Optimization',
            'Business Intelligence',
            'Process Automation'
        ]
    },
    central: {
        title: 'Central Arkansas',
        description: 'State capital region and major business hub.',
        services: [
            'Government Solutions',
            'Cybersecurity',
            'IT Infrastructure',
            'Systems Integration',
            'Project Management'
        ]
    },
    southwest: {
        title: 'Southwest Arkansas',
        description: 'Natural resources and manufacturing center.',
        services: [
            'Industrial Automation',
            'Manufacturing Tech',
            'Quality Control Systems',
            'Resource Management',
            'Safety Solutions'
        ]
    },
    southeast: {
        title: 'Southeast Arkansas',
        description: 'Agricultural and logistics hub.',
        services: [
            'Logistics Technology',
            'Supply Chain Management',
            'Agricultural Systems',
            'Fleet Management',
            'Warehouse Automation'
        ]
    }
};

// Initialize map interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get map container and create info panel
    const mapContainer = document.querySelector('.arkansas-map-container');
    const svgObject = document.querySelector('object[data*="arkansas-map-geo.svg"]');
    
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'region-info';
    mapContainer.appendChild(infoPanel);

    // Wait for SVG to load
    svgObject.addEventListener('load', () => {
        const svgDoc = svgObject.contentDocument;
        initializeMapElements(svgDoc);
    });

    // Initialize map elements and interactions
    function initializeMapElements(svgDoc) {
        const regions = svgDoc.querySelectorAll('.region');
        const rivers = svgDoc.querySelectorAll('.river');
        const cityMarkers = svgDoc.querySelectorAll('.city-marker');
        const cityLabels = svgDoc.querySelectorAll('.city-label');
        const topoLines = svgDoc.querySelectorAll('.topo-line');

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger staggered animations
                    setTimeout(() => {
                        // Animate regions
                        regions.forEach((region, index) => {
                            setTimeout(() => {
                                region.classList.add('visible');
                            }, index * 200);
                        });

                        // Animate rivers
                        setTimeout(() => {
                            rivers.forEach((river, index) => {
                                setTimeout(() => {
                                    river.classList.add('visible');
                                }, index * 200);
                            });
                        }, 1000);

                        // Animate topographic lines
                        setTimeout(() => {
                            topoLines.forEach((line, index) => {
                                setTimeout(() => {
                                    line.classList.add('visible');
                                }, index * 100);
                            });
                        }, 1500);

                        // Animate city markers and labels
                        setTimeout(() => {
                            cityMarkers.forEach((marker, index) => {
                                setTimeout(() => {
                                    marker.classList.add('visible');
                                    cityLabels[index].classList.add('visible');
                                }, index * 200);
                            });
                        }, 2000);
                    }, 200);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        // Observe map container
        observer.observe(mapContainer);

        // Handle region interactions
        regions.forEach(region => {
            region.addEventListener('click', (e) => {
                // Remove active class from all regions
                regions.forEach(r => r.classList.remove('active'));
                
                // Add active class to clicked region
                region.classList.add('active');
                
                // Get region data
                const regionId = region.getAttribute('id');
                const data = regionData[regionId];
                
                // Update info panel
                updateInfoPanel(data);
                
                e.stopPropagation();
            });
        });

        // Handle city marker interactions
        cityMarkers.forEach((marker, index) => {
            const label = cityLabels[index];
            
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'scale(1.5)';
                if (label) {
                    label.style.fontWeight = 'bold';
                    label.style.fontSize = '14px';
                }
            });

            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'scale(1)';
                if (label) {
                    label.style.fontWeight = 'normal';
                    label.style.fontSize = '12px';
                }
            });
        });

        // Close info panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.region') && !e.target.closest('.region-info')) {
                regions.forEach(r => r.classList.remove('active'));
                infoPanel.classList.remove('active');
            }
        });
    }

    // Update info panel content
    function updateInfoPanel(data) {
        infoPanel.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <h4>Services:</h4>
            <ul>
                ${data.services.map(service => `
                    <li>${service}</li>
                `).join('')}
            </ul>
        `;
        
        // Show info panel with animation
        infoPanel.classList.add('active');
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const width = window.innerWidth;
            if (width <= 1200) {
                infoPanel.style.position = 'relative';
                infoPanel.style.transform = 'none';
            } else {
                infoPanel.style.position = 'absolute';
                infoPanel.style.transform = 'translateY(-50%)';
            }
        }, 250);
    });
});

// Add touch support for mobile devices
document.addEventListener('touchstart', () => {
    document.documentElement.classList.add('touch-device');
}); 