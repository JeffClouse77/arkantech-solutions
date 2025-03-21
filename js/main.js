// Chat Bot Configuration
const chatBot = {
    name: "Lisa",
    role: "Customer Experience Specialist",
    avatar: "images/images/lisa-support.jpg",
    conversationState: {
        currentTopic: "",
        shownServices: false,
        askedForContact: false,
        interactions: 0
    },
    greetings: [
        "Hi there! I'm Lisa, your ArkanTech Solutions Customer Experience Specialist. How can I help you today?",
        "Hello! I'm Lisa from ArkanTech Solutions. I'd be happy to answer any questions about our services!",
        "Welcome to ArkanTech Solutions! I'm Lisa, and I'm here to help you find the right technology solutions for your Arkansas business."
    ],
    
    services: {
        "market research": {
            description: "Our data-driven market research helps businesses make informed decisions and stay competitive.",
            features: [
                "Comprehensive competitive analysis",
                "Market trend identification",
                "Data-driven insights customized for Arkansas markets",
                "Industry-specific research with local expertise",
                "Growth opportunity analysis with actionable recommendations"
            ],
            response: "Our market research service transforms raw data into strategic advantages for Arkansas businesses. We begin with a thorough analysis of your current market position, then develop customized research strategies to identify new opportunities. Would you like me to share a specific example of how we've helped similar businesses? Or would you prefer to discuss your specific research needs with our team?",
            followUp: "If you'd like to see how our market research could benefit your business, I'd be happy to arrange a no-obligation consultation with our research team. They can provide a sample analysis specific to your industry."
        },
        "online presence": {
            description: "We help establish and enhance your digital footprint with strategic online presence management.",
            features: [
                "Digital brand development",
                "Social media strategy",
                "Content marketing",
                "SEO optimization",
                "Online reputation management"
            ],
            response: "Our online presence management services help Arkansas businesses stand out in the digital landscape. We create comprehensive strategies that include SEO optimization, content development, social media management, and reputation monitoring. Our clients typically see significant improvements in traffic and engagement within the first 3 months. What specific aspects of your online presence are you looking to enhance?",
            followUp: "Many businesses find it helpful to start with our digital presence audit, which provides a clear picture of your current online standing. Would you like to schedule one with our team? It only takes about 30 minutes of your time."
        },
        "web development": {
            description: "We create custom web solutions using modern technologies to drive business growth.",
            features: [
                "Custom website development tailored to Arkansas businesses",
                "E-commerce solutions with local shipping integration",
                "Progressive web apps for better customer engagement",
                "Mobile-first design optimized for local audiences",
                "Performance optimization for faster loading"
            ],
            response: "Our web development team specializes in creating custom websites that not only look great but actually drive business results. We focus on user experience, mobile optimization, and conversion-focused design. Every project begins with understanding your business goals and target audience. What type of web project are you considering?",
            followUp: "If you're thinking about a new website or upgrading your current one, our designers would love to share some portfolio examples relevant to your industry. Would you like to schedule a brief call to discuss your vision?"
        },
        "ai education": {
            description: "We help Arkansas businesses integrate AI solutions with expert guidance and training.",
            features: [
                "AI readiness assessment",
                "Customized education programs",
                "Implementation planning",
                "Staff training and adoption support",
                "Performance monitoring and optimization"
            ],
            response: "Our AI Education & Optimization service helps Arkansas businesses leverage artificial intelligence to transform operations and enhance decision-making. We start with an AI readiness assessment to identify the best opportunities for implementation, then develop a customized adoption strategy. What aspects of AI are you most interested in for your business?",
            followUp: "Many of our clients find our AI Readiness Assessment incredibly valuable, even if they're just beginning to explore AI. Would you like me to have our AI team reach out to schedule one for your business?"
        },
        "data analytics": {
            description: "We transform raw data into actionable insights to drive strategic decision-making.",
            features: [
                "Data ecosystem assessment",
                "Advanced analytics implementation",
                "Market research integration",
                "Visualization dashboards",
                "Predictive modeling"
            ],
            response: "Our Data Analytics & Market Research services help Arkansas businesses make better decisions using their data. We help collect, organize, analyze, and visualize your business data in ways that reveal new opportunities. Our clients often discover untapped revenue streams or significant cost-saving opportunities. What kind of data challenges is your business facing?",
            followUp: "To give you a better idea of what's possible, our analytics team can provide a sample analysis using public data from your industry. Would you like me to arrange a demonstration?"
        }
    },

    commonQuestions: {
        "pricing": "Our pricing is customized based on your specific needs and project scope. We work with businesses of all sizes and can tailor solutions to fit various budgets. The best way to get accurate pricing is through a brief consultation where we can understand your requirements. Would you like me to arrange a call with our team?",
        "timeline": "Project timelines vary depending on complexity and scope. Typically, our web development projects take 4-12 weeks, market research 3-6 weeks, and AI implementation 6-12 weeks. We always provide detailed timelines during our project planning phase. Are you working with any specific deadlines?",
        "location": "We're proudly based in Arkansas and serve businesses throughout the state, with special focus on Little Rock, Northwest Arkansas, Jonesboro, and Fort Smith. We offer both in-person and remote consulting, depending on your preference. What part of Arkansas is your business located in?",
        "experience": "We have extensive experience serving Arkansas businesses across various industries. Our team has worked with retail, manufacturing, healthcare, agriculture, logistics, and professional services. We bring both technology expertise and local market knowledge. What industry is your business in?",
        "consultation": "We offer free initial consultations to understand your needs and determine if we're the right fit for your business. The consultation typically takes 30-45 minutes and can be done in person or virtually. Would you like me to help you schedule one with the appropriate specialist for your needs?"
    },

    handleQuery(query) {
        query = query.toLowerCase();
        this.conversationState.interactions++;
        
        // Check for contact form interest
        if (query.includes("contact") || query.includes("schedule") || query.includes("consultation") || query.includes("talk to someone")) {
            this.conversationState.askedForContact = true;
            return "I'd be happy to connect you with one of our specialists! You can fill out our contact form at <a href='contact.html' target='_blank'>our contact page</a>, or if you prefer, I can have someone reach out to you directly. Would you like to provide your name and the best way to reach you?";
        }
        
        // Check for service-related queries and set the conversation topic
        for (const [service, info] of Object.entries(this.services)) {
            if (query.includes(service)) {
                this.conversationState.currentTopic = service;
                return info.response;
            }
        }
        
        // Follow up on previously discussed service
        if (this.conversationState.currentTopic && this.conversationState.interactions > 1) {
            const currentService = this.services[this.conversationState.currentTopic];
            
            // If we've had multiple interactions about the same topic, suggest contact
            if (this.conversationState.interactions > 2 && !this.conversationState.askedForContact) {
                this.conversationState.askedForContact = true;
                return `${currentService.followUp} You can also fill out our <a href='contact.html' target='_blank'>contact form</a>, and we'll get back to you promptly.`;
            }
            
            return currentService.followUp;
        }
        
        // Check for common questions
        for (const [question, answer] of Object.entries(this.commonQuestions)) {
            if (query.includes(question)) {
                return answer;
            }
        }
        
        // If user asks about services in general
        if (query.includes("service") || query.includes("offer") || query.includes("help") || query.includes("what")) {
            this.conversationState.shownServices = true;
            return "We specialize in several services for Arkansas businesses:<br><br>" +
                "• <b>Web Development & Support</b>: Custom websites and apps<br>" +
                "• <b>Online Presence Management</b>: SEO, social media, and reputation<br>" +
                "• <b>AI Education & Optimization</b>: AI implementation and training<br>" +
                "• <b>Data Analytics & Market Research</b>: Insights for decision-making<br><br>" +
                "Which of these services would you like to learn more about?";
        }
        
        // Default response with slightly different wording based on interaction count
        if (this.conversationState.interactions <= 1) {
            return "I'm here to help with information about our services for Arkansas businesses. We offer web development, online presence management, AI education, and data analytics services. What specific area are you interested in?";
        } else {
            return "I'd be happy to tell you more about any of our services or answer specific questions. If you'd prefer to speak directly with a specialist, I can also help arrange that. What would be most helpful for you?";
        }
    },

    getRandomGreeting() {
        return this.greetings[Math.floor(Math.random() * this.greetings.length)];
    },
    
    resetConversation() {
        this.conversationState = {
            currentTopic: "",
            shownServices: false,
            askedForContact: false,
            interactions: 0
        };
    }
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and append chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(chatWidget);

    // Create and append chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.style.display = 'none';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <div class="chat-agent">
                <img src="${chatBot.avatar}" alt="${chatBot.name}" class="agent-avatar">
                <div class="agent-info">
                    <h3>${chatBot.name}</h3>
                    <p>${chatBot.role}</p>
                </div>
            </div>
            <button class="close-chat">&times;</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input">
            <input type="text" placeholder="Type your question here...">
            <button class="send-message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // Set up chat functionality
    const messages = chatWindow.querySelector('.chat-messages');
    const input = chatWindow.querySelector('input');
    const sendButton = chatWindow.querySelector('.send-message');

    // Add initial greeting
    setTimeout(() => {
        addMessage(chatBot.getRandomGreeting(), true);
    }, 500);

    // Event listeners
    chatWidget.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        if (chatWindow.style.display === 'flex') {
            messages.scrollTop = messages.scrollHeight;
            // Reset conversation if chat was closed and reopened
            if (chatBot.conversationState.interactions > 0) {
                chatBot.resetConversation();
                messages.innerHTML = '';
                setTimeout(() => {
                    addMessage(chatBot.getRandomGreeting(), true);
                }, 300);
            }
        }
    });

    chatWindow.querySelector('.close-chat').addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    function addMessage(text, isBot = false) {
        const message = document.createElement('div');
        message.className = `chat-message ${isBot ? 'bot-message' : 'user-message'}`;
        message.innerHTML = text; // Using innerHTML to support HTML in messages
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function handleUserInput() {
        const text = input.value.trim();
        if (text) {
            addMessage(text);
            input.value = '';
            // Simulate typing delay
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-message bot-message typing-indicator';
            typingIndicator.innerHTML = '<span>•</span><span>•</span><span>•</span>';
            messages.appendChild(typingIndicator);
            messages.scrollTop = messages.scrollHeight;
            
            setTimeout(() => {
                messages.removeChild(typingIndicator);
                const response = chatBot.handleQuery(text);
                addMessage(response, true);
            }, 1200);
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Progress Bar
    const progressFill = document.querySelector('.progress-fill');
    
    function updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();

    // Mobile Menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    menuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });

    // Testimonial Carousel
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const cards = document.querySelectorAll('.testimonial-card');
    
    let currentIndex = 0;
    
    function updateSlider() {
        if (slider) {
            const offset = currentIndex * -100;
            slider.style.transform = `translateX(${offset}%)`;
        }
    }
    
    prevBtn?.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateSlider();
    });
    
    nextBtn?.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, cards.length - 1);
        updateSlider();
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    checkReveal();

    // City panel interactions
    const cityLinks = document.querySelectorAll('.city-link');
    
    cityLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cityId = this.getAttribute('data-city');
            
            document.querySelectorAll('.city-info-panel.active').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const panel = document.getElementById(cityId + '-panel');
            if (panel) {
                panel.classList.add('active');
                
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    document.querySelectorAll('.close-panel').forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.city-info-panel');
            if (panel) {
                panel.classList.remove('active');
            }
        });
    });
    
    // Share Your Success Story functionality
    const shareStoryBtn = document.querySelector('.share-story-btn');
    const modal = document.getElementById('storyCaptureModal');
    const closeModal = modal?.querySelector('.close-modal');
    const storyForm = document.getElementById('storyCaptureForm');
    const steps = modal?.querySelectorAll('.capture-step');
    const progressSteps = modal?.querySelectorAll('.progress-step');
    
    let currentStep = 1;
    
    // Open modal
    shareStoryBtn?.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        currentStep = 1;
        updateStepDisplay();
    });
    
    // Close modal
    closeModal?.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Outside click closes modal
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Previous step
    modal?.querySelector('.prev-step')?.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    });
    
    // Next step
    modal?.querySelector('.next-step')?.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < 3) {
                currentStep++;
                updateStepDisplay();
            }
        }
    });
    
    // Update display based on current step
    function updateStepDisplay() {
        // Update steps
        steps?.forEach(step => {
            step.classList.remove('active');
        });
        
        const activeStep = modal?.querySelector(`.capture-step[data-step="${currentStep}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
        
        // Update progress indicators
        progressSteps?.forEach(step => {
            step.classList.remove('active');
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('completed');
            }
        });
        
        // Update buttons
        const prevBtn = modal?.querySelector('.prev-step');
        const nextBtn = modal?.querySelector('.next-step');
        const submitBtn = modal?.querySelector('.submit-story');
        
        if (prevBtn && nextBtn && submitBtn) {
            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            nextBtn.style.display = currentStep === 3 ? 'none' : 'block';
            submitBtn.style.display = currentStep === 3 ? 'block' : 'none';
        }
    }
    
    // Validate current step
    function validateCurrentStep() {
        if (!storyForm) return true;
        
        const currentStepEl = modal?.querySelector(`.capture-step[data-step="${currentStep}"]`);
        if (!currentStepEl) return true;
        
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message if not exists
                let errorMsg = field.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.classList.add('error-message');
                    errorMsg.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                
                // Remove error message if exists
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Handle photo upload preview
    const photoInput = document.getElementById('clientPhoto');
    const photoPreview = document.querySelector('.photo-preview');
    
    photoInput?.addEventListener('change', function() {
        if (photoPreview) {
            photoPreview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Profile preview';
                    photoPreview.appendChild(img);
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        }
    });
    
    // Handle form submission
    storyForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;
        
        const formData = new FormData(this);
        
        // Disable form to prevent double submission
        const formElements = this.elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = true;
        }
        
        const submitBtn = modal?.querySelector('.submit-story');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
        }
        
        fetch('submit_testimonial.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Show success message
            steps?.forEach(step => step.classList.remove('active'));
            
            const successStep = modal?.querySelector('.capture-step[data-step="success"]');
            if (successStep) {
                successStep.style.display = 'block';
            }
            
            // Hide buttons
            const prevBtn = modal?.querySelector('.prev-step');
            const nextBtn = modal?.querySelector('.next-step');
            const submitBtn = modal?.querySelector('.submit-story');
            
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
            
            // Reset form after successful submission
            if (data.success) {
                setTimeout(() => {
                    storyForm.reset();
                    if (photoPreview) {
                        photoPreview.innerHTML = '';
                    }
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }, 3000);
            } else {
                // Show error message
                alert(data.message || 'Failed to submit your story. Please try again.');
                
                // Re-enable form
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = false;
                }
                
                if (submitBtn) {
                    submitBtn.textContent = 'Submit Story';
                    submitBtn.disabled = false;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            
            // Re-enable form
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }
            
            const submitBtn = modal?.querySelector('.submit-story');
            if (submitBtn) {
                submitBtn.textContent = 'Submit Story';
                submitBtn.disabled = false;
            }
        });
    });
});
