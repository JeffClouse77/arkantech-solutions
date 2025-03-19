// Region data with services and descriptions
const regionData = {
    northwest: {
        title: 'Northwest Arkansas',
        description: 'Home to major tech companies and startups, Northwest Arkansas is a hub of innovation and technology.',
        services: [
            'Technology Consulting',
            'Startup Support',
            'Digital Transformation',
            'AI Implementation',
            'Process Automation'
        ]
    },
    northeast: {
        title: 'Northeast Arkansas',
        description: 'A growing center for agricultural technology and manufacturing innovation.',
        services: [
            'AgTech Solutions',
            'Manufacturing Tech',
            'Supply Chain Optimization',
            'IoT Integration',
            'Data Analytics'
        ]
    },
    central: {
        title: 'Central Arkansas',
        description: 'The business and government center of Arkansas, focusing on enterprise solutions and cybersecurity.',
        services: [
            'Enterprise Solutions',
            'Cybersecurity',
            'Cloud Migration',
            'Business Intelligence',
            'IT Infrastructure'
        ]
    },
    southwest: {
        title: 'Southwest Arkansas',
        description: 'Rich in natural resources and manufacturing, emphasizing industrial technology solutions.',
        services: [
            'Industrial Automation',
            'Quality Control Systems',
            'Resource Management',
            'Environmental Tech',
            'Safety Solutions'
        ]
    },
    southeast: {
        title: 'Southeast Arkansas',
        description: 'Focused on agricultural technology and logistics optimization.',
        services: [
            'Logistics Technology',
            'Agricultural Systems',
            'Supply Chain Management',
            'Fleet Management',
            'Warehouse Automation'
        ]
    }
};

// Initialize map interactions when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get map elements
    const mapContainer = document.querySelector('.arkansas-map-container');
    const svgObject = mapContainer.querySelector('object');
    
    // Wait for SVG to load
    svgObject.addEventListener('load', () => {
        const svgDoc = svgObject.contentDocument;
        const regions = svgDoc.querySelectorAll('.region');
        const rivers = svgDoc.querySelectorAll('.river');
        const cityNodes = svgDoc.querySelectorAll('.city-node');
        const cityLabels = svgDoc.querySelectorAll('.city-labels text');
        const regionLabels = svgDoc.querySelectorAll('.region-labels text');
        const mountains = svgDoc.querySelectorAll('.mountains');
        
        // Create info panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'region-info';
        mapContainer.appendChild(infoPanel);

        // Intersection Observer for fade-in animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animations when map comes into view
                    setTimeout(() => {
                        regions.forEach((region, index) => {
                            setTimeout(() => {
                                region.classList.add('visible');
                            }, index * 200);
                        });

                        setTimeout(() => {
                            rivers.forEach((river, index) => {
                                setTimeout(() => {
                                    river.classList.add('visible');
                                }, index * 200);
                            });
                        }, 1000);

                        setTimeout(() => {
                            mountains.forEach((mountain, index) => {
                                setTimeout(() => {
                                    mountain.classList.add('visible');
                                }, index * 200);
                            });
                        }, 1500);

                        setTimeout(() => {
                            cityNodes.forEach((node, index) => {
                                setTimeout(() => {
                                    node.classList.add('visible');
                                }, index * 200);
                            });
                        }, 2000);

                        setTimeout(() => {
                            [...cityLabels, ...regionLabels].forEach((label, index) => {
                                setTimeout(() => {
                                    label.classList.add('visible');
                                }, index * 100);
                            });
                        }, 2500);
                    }, 200);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        // Observe map container
        observer.observe(mapContainer);

        // Handle region clicks
        regions.forEach(region => {
            region.addEventListener('click', (e) => {
                // Remove active class from all regions
                regions.forEach(r => r.classList.remove('active'));
                
                // Add active class to clicked region
                region.classList.add('active');
                
                // Get region data
                const regionId = region.getAttribute('id');
                const data = regionData[regionId];
                
                // Update info panel with animation
                infoPanel.style.opacity = '0';
                setTimeout(() => {
                    infoPanel.innerHTML = `
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <ul class="services-list">
                            ${data.services.map(service => `
                                <li class="service-item">
                                    <i class="fas fa-check-circle"></i>
                                    ${service}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    infoPanel.classList.add('active');
                    infoPanel.style.opacity = '1';
                }, 300);
                
                e.stopPropagation();
            });

            // Add hover effects
            region.addEventListener('mouseenter', () => {
                region.style.filter = 'url(#regionGlow)';
            });

            region.addEventListener('mouseleave', () => {
                if (!region.classList.contains('active')) {
                    region.style.filter = 'none';
                }
            });
        });

        // Handle city node interactions
        cityNodes.forEach((node, index) => {
            const label = cityLabels[index];
            
            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.5)';
                if (label) {
                    label.style.fontWeight = 'bold';
                    label.style.fontSize = '14px';
                    label.style.fill = '#2D5B7F';
                }
            });

            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                if (label) {
                    label.style.fontWeight = 'normal';
                    label.style.fontSize = '12px';
                    label.style.fill = '#1D1D1F';
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
});

// Add touch support for mobile devices
document.addEventListener('touchstart', () => {
    document.documentElement.classList.add('touch-device');
}); 