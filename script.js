// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== Pricing Toggle =====
const pricingToggle = document.getElementById('pricingToggle');
const prices = document.querySelectorAll('.price');
const toggleLabels = document.querySelectorAll('.pricing-toggle > span');
let isAnnual = false;

pricingToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    pricingToggle.classList.toggle('active', isAnnual);
    toggleLabels[0].classList.toggle('active', !isAnnual);
    toggleLabels[1].classList.toggle('active', isAnnual);

    prices.forEach(priceEl => {
        const monthly = priceEl.getAttribute('data-monthly');
        const annual = priceEl.getAttribute('data-annual');
        priceEl.textContent = isAnnual ? annual : monthly;
    });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Chat Widget =====
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('open');
});

chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('open');
});

// Chat bot responses
const botResponses = {
    'hello': 'Hello! Welcome to Upali Immigration Services. How can I help you today?',
    'hi': 'Hi there! I\'m here to help you with insurance for your migration journey. What would you like to know?',
    'price': 'Our plans start from just €29/month for Basic coverage. The Professional plan is €59/month and Family Premium is €99/month. Would you like details on any specific plan?',
    'pricing': 'Our plans start from just €29/month for Basic coverage. The Professional plan is €59/month and Family Premium is €99/month. Would you like details on any specific plan?',
    'cost': 'Our plans start from just €29/month for Basic coverage. The Professional plan is €59/month and Family Premium is €99/month. Would you like details on any specific plan?',
    'germany': 'We offer comprehensive health insurance that meets German Krankenversicherung requirements. Our cards are accepted by all German health institutions. Plans start at €29/month.',
    'netherlands': 'Our Dutch insurance plans comply with the Zorgverzekeringswet. You\'ll receive coverage accepted across all healthcare providers in the Netherlands.',
    'usa': 'We provide ACA-compliant health coverage for H-1B, L-1, and other work visa holders. Coverage is valid across all 50 states.',
    'card': 'You\'ll receive your digital insurance card within 24 hours of approval via email. The physical card arrives in 5-7 business days.',
    'claim': 'Claims can be filed through our online portal or app. Most claims are processed within 48 hours. For emergencies, call our 24/7 helpline.',
    'family': 'Our Family Premium plan at €99/month covers you, your spouse, and dependents. It includes maternity benefits, dental coverage, and more.',
    'visa': 'Yes! Our insurance documentation is accepted for visa applications in Germany, Netherlands, and all EU countries. We provide official certificates.',
    'contact': 'You can reach us at +971 54 204 0298 or email info@myupali.lk. Our team responds within 2 hours during business hours.',
    'cancel': 'You can upgrade anytime. Downgrades and cancellations require 30 days\' notice. We offer a full refund within the first 14 days.',
    'salary': 'Blue collar jobs offer €2,500/month with free accommodation, transportation, and insurance. Professional roles start from €4,000/month with premium benefits.',
    'job': 'We help Sri Lankan workers find jobs in construction, manufacturing, healthcare, IT, and more. Blue collar: €2,500/month with housing. Professional: from €4,000/month. Fill out our contact form to apply!',
    'work': 'We place Sri Lankan workers across Europe and USA. Blue collar roles start at €2,500/month with accommodation and transport included. Professional roles from €4,000/month.',
    'sri lanka': 'We are Sri Lanka\'s premier migration service provider based in Puttalam. We help Sri Lankan workers migrate to Europe and USA with full support.',
    'puttalam': 'Our head office is at Shams Free Zone, Sharjah Media City, Sharjah, UAE. Call us at +971 54 204 0298 for a consultation.',
    'accommodation': 'Yes! Blue collar job packages include free furnished accommodation. Professional roles include a housing allowance or relocation support.',
    'transport': 'Transportation to and from work is included free of charge for blue collar positions. Professional roles may include a travel stipend.',
    'ireland': 'We offer health insurance accepted across all HSE facilities in Ireland. Our plans comply with Irish immigration requirements.',
    'czech': 'Our Czech Republic plans are VZP-compatible and cover all work permit categories.',
    'uk': 'We provide full support for UK Skilled Worker visas and Health & Care Worker visas. Our packages include job placement, accommodation, and insurance.',
    'united kingdom': 'We provide full support for UK Skilled Worker visas and Health & Care Worker visas. Our packages include job placement, accommodation, and insurance.',
    'britain': 'We provide full support for UK Skilled Worker visas and Health & Care Worker visas. Our packages include job placement, accommodation, and insurance.',
    'new zealand': 'We offer comprehensive immigration support for New Zealand including Skilled Migrant, Essential Skills, and Work to Residence visas with full health coverage and job placement.',
    'zealand': 'We offer comprehensive immigration support for New Zealand including Skilled Migrant, Essential Skills, and Work to Residence visas with full health coverage and job placement.',
};

function getBotResponse(message) {
    const lower = message.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
        if (lower.includes(key)) {
            return response;
        }
    }
    return 'Thank you for your message! For detailed assistance, please fill out our contact form or call us at +971 54 204 0298. Our team will be happy to help you with your specific requirements.';
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.innerHTML = `<div class="message-bubble">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Bot typing delay
    setTimeout(() => {
        addMessage(getBotResponse(text), 'bot');
    }, 800);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Show success message
    const wrapper = document.querySelector('.contact-form-wrapper');
    wrapper.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="width: 72px; height: 72px; background: #E6FFE6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38A169" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 style="font-size: 24px; font-weight: 700; color: #1A202C; margin-bottom: 12px;">Message Sent Successfully!</h3>
            <p style="font-size: 16px; color: #718096; line-height: 1.6;">Thank you, <strong>${data.firstName}</strong>! Our team will review your request and get back to you within 2 hours with a personalized quote.</p>
            <p style="font-size: 14px; color: #A0AEC0; margin-top: 16px;">Reference: MIG-${Date.now().toString(36).toUpperCase()}</p>
        </div>
    `;
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Animate elements on scroll with staggered delays
document.querySelectorAll('.service-card, .country-card, .testimonial-card, .pricing-card, .step-card, .feature-item, .faq-item, .salary-card, .life-card, .gallery-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.1}s, transform 0.6s ease ${(i % 6) * 0.1}s`;
    observer.observe(el);
});

// ===== Animated Counter =====
function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 20);
}

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const text = entry.target.textContent;
            if (text.includes('25K')) animateCounter(entry.target, 25, 'K+');
            else if (text.includes('14+')) animateCounter(entry.target, 14, '+');
            else if (text.includes('4.9')) {
                let c = 0;
                const timer = setInterval(() => {
                    c += 0.1;
                    if (c >= 4.9) { c = 4.9; clearInterval(timer); }
                    entry.target.textContent = c.toFixed(1) + '/5';
                }, 25);
            }
            else if (text.includes('98%')) animateCounter(entry.target, 98, '%');
            else if (text.includes('25K+')) animateCounter(entry.target, 25, 'K+');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat strong, .mini-stat-value').forEach(el => {
    counterObserver.observe(el);
});

// ===== Parallax on Hero Shapes =====
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
        const speed = (i + 1) * 15;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ===== Insurance Card Tilt Effect =====
const card = document.querySelector('.insurance-card');
if (card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(-5deg) rotateX(5deg)';
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
}

// ===== Typing Effect for Chat =====
function typeMessage(element, text, speed = 30) {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(timer);
    }, speed);
}

// ===== Navbar Active Link Highlighting =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                link.style.color = '#00D4FF';
                link.style.fontWeight = '700';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        }
    });
});

// ===== Smooth Scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Language Toggle (English / Sinhala / Tamil) =====
const translations = {
    en: {
        getQuote: 'Get a Quote',
        heroTitle: 'Your Gateway from Sri Lanka to Europe & USA',
        heroSubtitle: 'Upali Immigration Services helps Sri Lankan workers migrate to Germany, Netherlands, Ireland, Czech Republic, United Kingdom, New Zealand, and the USA with complete job placement, insurance, accommodation, and visa support.',
        heroBadge: "Sri Lanka's No.1 Migration Service Provider",
        heroBtn1: 'View Plans & Pricing',
        heroBtn2: 'Learn More',
        statWorkers: 'Workers Insured',
        statCountries: 'Countries Covered',
        statRating: 'Customer Rating',
        servicesTag: 'Our Services',
        jobOpeningsTag: 'Now Hiring',
        jobOpeningsTitle: 'Current Job Openings Abroad',
        contactBtn: 'Send Message & Get Quote',
    },
    si: {
        getQuote: 'උපුටාගත් මිලක් ලබා ගන්න',
        heroTitle: 'ශ්‍රී ලංකාවෙන් යුරෝපයට සහ ඇමෙරිකාවට ඔබේ දොරටුව',
        heroSubtitle: 'උපාලි ආගමන සේවා ශ්‍රී ලාංකීය කම්කරුවන්ට ජර්මනිය, නෙදර්ලන්ත, අයර්ලන්තය සහ ඇමෙරිකාවට සංක්‍රමණය වීමට සම්පූර්ණ සහාය සපයයි.',
        heroBadge: 'ශ්‍රී ලංකාවේ අංක 1 සංක්‍රමණ සේවා සපයන්නා',
        heroBtn1: 'සැලසුම් & මිල ගණන් බලන්න',
        heroBtn2: 'තව දැනගන්න',
        statWorkers: 'රක්ෂිත කම්කරුවන්',
        statCountries: 'ආවරණය කළ රටවල්',
        statRating: 'පාරිභෝගික ශ්‍රේණිගත කිරීම',
        servicesTag: 'අපගේ සේවාවන්',
        jobOpeningsTag: 'දැන් බඳවා ගනිමින්',
        jobOpeningsTitle: 'විදෙස් රැකියා ඉල්ලුම්',
        contactBtn: 'පණිවිඩය යවා මිලක් ලබා ගන්න',
    },
    ta: {
        getQuote: 'மேற்கோள் பெறுக',
        heroTitle: 'இலங்கையிலிருந்து ஐரோப்பா மற்றும் அமெரிக்காவுக்கான உங்கள் வாயில்',
        heroSubtitle: 'உபாலி குடியேற்ற சேவைகள் இலங்கை தொழிலாளர்களுக்கு ஜெர்மனி, நெதர்லாந்து, அயர்லாந்து மற்றும் அமெரிக்காவிற்கு குடியேற முழு உதவி வழங்குகிறது.',
        heroBadge: 'இலங்கையின் நம்பர் 1 குடியேற்ற சேவை வழங்குனர்',
        heroBtn1: 'திட்டங்கள் & விலை பார்க்க',
        heroBtn2: 'மேலும் அறிய',
        statWorkers: 'காப்பீடு செய்யப்பட்ட தொழிலாளர்கள்',
        statCountries: 'நாடுகள் உள்ளடக்கப்பட்டன',
        statRating: 'வாடிக்கையாளர் மதிப்பீடு',
        servicesTag: 'எங்கள் சேவைகள்',
        jobOpeningsTag: 'இப்போது பணியமர்த்துகிறோம்',
        jobOpeningsTitle: 'தற்போதைய வெளிநாட்டு வேலை வாய்ப்புகள்',
        contactBtn: 'செய்தி அனுப்பி மேற்கோள் பெறுக',
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update lang toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });

    // Update key hero content
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) heroTitle.innerHTML = `<span>${t.heroTitle.split(' to ')[0]}</span> to<br><span class="gradient-text">${t.heroTitle.split(' to ')[1] || ''}</span>`;

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) heroBadge.textContent = t.heroBadge;

    // Update submit button
    const contactBtn = document.querySelector('#contactForm button[type="submit"]');
    if (contactBtn) contactBtn.textContent = t.contactBtn;

    // Update Job Openings section tag
    const jobTag = document.querySelector('.job-openings .section-tag');
    if (jobTag) jobTag.textContent = t.jobOpeningsTag;
    const jobTitle = document.querySelector('.job-openings h2');
    if (jobTitle) jobTitle.innerHTML = `${t.jobOpeningsTitle.split(' ')[0]} <span class="gradient-text">${t.jobOpeningsTitle.split(' ').slice(1).join(' ')}</span>`;

    document.documentElement.lang = lang === 'si' ? 'si' : lang === 'ta' ? 'ta' : 'en';
}

// ===== Job Openings Filter =====
document.querySelectorAll('.job-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.job-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.job-card').forEach(card => {
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else if (filter === 'blue-collar' || filter === 'professional') {
                card.classList.toggle('hidden', card.dataset.type !== filter);
            } else {
                card.classList.toggle('hidden', card.dataset.country !== filter);
            }
        });
    });
});

// ===== Job Apply Function =====
function applyForJob(jobTitle) {
    // Scroll to contact form and pre-fill
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const msgField = document.getElementById('message');
            if (msgField) {
                msgField.value = `I am interested in applying for the position: ${jobTitle}. Please contact me with more details about the application process.`;
                msgField.focus();
            }
        }, 600);
    }
}

// Animate job cards on scroll
document.querySelectorAll('.job-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${(i % 3) * 0.1}s, transform 0.5s ease ${(i % 3) * 0.1}s`;
    observer.observe(el);
});

// ===== Promo Video =====
function startPromoVideo() {
    const overlay = document.getElementById('videoPlayOverlay');
    const iframe = document.getElementById('promoVideoFrame');
    overlay.style.display = 'none';
    iframe.src = 'promo_video.html';
    // Click inside iframe to trigger sound after a short delay
    setTimeout(() => {
        try { iframe.contentWindow.document.body.click(); } catch(e) {}
    }, 500);
}
