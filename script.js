/**
 * Himanshu Kumar - Developer Portfolio
 * Interactive Script (Three.js 3D Starfield, Preloader, Dual Cursor, Typewriter, Tilt, Filter, Modals)
 */

// ══════════════════════════════════════════════════════════
// 1. THREE.JS 3D STARFIELD BACKGROUND
// ══════════════════════════════════════════════════════════
(function initThreeBackground() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsCount = 2800;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 110;
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    function createStarTexture() {
        const c = document.createElement('canvas');
        c.width = 32;
        c.height = 32;
        const ctx = c.getContext('2d');
        const center = 16;
        const grad = ctx.createRadialGradient(center, center, 0, center, center, 14);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(192, 132, 252, 0.8)');
        grad.addColorStop(0.7, 'rgba(168, 85, 247, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(center, center, 14, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        return new THREE.CanvasTexture(c);
    }

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.18,
        map: createStarTexture(),
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
    });

    const starMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starMesh);

    camera.position.z = 24;

    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX) * 0.00012;
        mouseY = (e.clientY - windowHalfY) * 0.00012;
    });

    function animate() {
        requestAnimationFrame(animate);
        starMesh.rotation.y += 0.00015;
        starMesh.rotation.x += 0.00008;

        starMesh.rotation.y += mouseX * 0.35;
        starMesh.rotation.x += mouseY * 0.35;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ══════════════════════════════════════════════════════════
// 2. PRELOADER & BOOT SEQUENCE
// ══════════════════════════════════════════════════════════
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderSleekFill');
    const particlesContainer = document.getElementById('preloaderParticles');
    if (!preloader) return;

    // Generate floating tech particles
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'preloader-particle';
            p.style.left = (Math.random() * 100) + '%';
            p.style.bottom = -(Math.random() * 20) + '%';
            p.style.animationDuration = (2 + Math.random() * 2) + 's';
            p.style.animationDelay = (Math.random() * 1.5) + 's';
            const sz = 2 + Math.random() * 3.5;
            p.style.width = sz + 'px';
            p.style.height = sz + 'px';
            particlesContainer.appendChild(p);
        }
    }

    const DURATION = 2200;
    const start = performance.now();
    let pageLoaded = false;
    let animDone = false;

    function step(now) {
        const elapsed = now - start;
        let t = Math.min(elapsed / DURATION, 1);
        let eased = 1 - Math.pow(1 - t, 3);

        if (fill) fill.style.width = (eased * 100) + '%';

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            animDone = true;
            dismiss();
        }
    }
    requestAnimationFrame(step);

    function dismiss() {
        if (!animDone || !pageLoaded) return;
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.remove();
                window.dispatchEvent(new Event('preloaderComplete'));
            }, 800);
        }, 300);
    }

    window.addEventListener('load', () => {
        pageLoaded = true;
        dismiss();
    });
})();

// ══════════════════════════════════════════════════════════
// 3. DUAL CUSTOM CURSOR
// ══════════════════════════════════════════════════════════
(function initCursor() {
    const dot = document.querySelector('[data-cursor-dot]');
    const outline = document.querySelector('[data-cursor-outline]');
    if (!dot || !outline) return;

    window.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';

        outline.animate({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        }, { duration: 400, fill: 'forwards' });
    });

    const interactables = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .profile-card, .cert-item, .close-resume-btn');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
    });
})();

// ══════════════════════════════════════════════════════════
// 4. HERO DYNAMIC TYPING ANIMATION
// ══════════════════════════════════════════════════════════
(function initTypingText() {
    const typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    const words = [
        "C++ PROGRAMMER",
        "SYSTEMS ENTHUSIAST",
        "PROBLEM SOLVER",
        "SOFTWARE DEVELOPER",
        "ALGORITHM CRAFTER"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typingEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 45 : 85;

        if (!isDeleting && charIdx === currentWord.length) {
            speed = 1800; // Pause on complete word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 400;
        }

        setTimeout(typeLoop, speed);
    }

    if (document.getElementById('preloader')) {
        window.addEventListener('preloaderComplete', typeLoop, { once: true });
    } else {
        typeLoop();
    }
})();

// ══════════════════════════════════════════════════════════
// 5. FLOATING NAVBAR & SCROLL SECTION TRACKING
// ══════════════════════════════════════════════════════════
(function initNavbar() {
    const nav = document.getElementById('siteNav');
    const indicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const progressBar = document.getElementById('scrollProgressBar');
    if (!nav || !indicator) return;

    const sections = Array.from(navLinks).map(link => document.getElementById(link.dataset.section)).filter(Boolean);
    let currentActive = 'home';
    let navShown = false;

    function updateIndicator(activeLink) {
        if (!activeLink) return;
        const pill = nav.querySelector('.nav-pill');
        if (!pill) return;

        const pillRect = pill.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        const left = linkRect.left - pillRect.left;
        const width = linkRect.width;

        indicator.style.left = left + 'px';
        indicator.style.width = width + 'px';
    }

    function setActive(sectionId) {
        if (sectionId === currentActive) return;
        currentActive = sectionId;

        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
                updateIndicator(link);
            } else {
                link.classList.remove('active');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));

    // Navbar show/hide on scroll
    const hero = document.getElementById('home');
    function onScroll() {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;

        // Progress bar
        if (progressBar) {
            const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
            progressBar.style.width = pct + '%';
        }

        // Nav visibility
        const heroH = hero ? hero.offsetHeight : 600;
        if (scrollY > heroH * 0.4 && !navShown) {
            nav.classList.add('nav-visible');
            navShown = true;
            requestAnimationFrame(() => {
                const active = nav.querySelector('.nav-link.active');
                updateIndicator(active);
            });
        } else if (scrollY <= heroH * 0.25 && navShown) {
            nav.classList.remove('nav-visible');
            navShown = false;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        const active = nav.querySelector('.nav-link.active');
        updateIndicator(active);
    });

    // Smooth click scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();

// ══════════════════════════════════════════════════════════
// 6. 3D TILT ON ABOUT CARD & INTERSECTION REVEALS
// ══════════════════════════════════════════════════════════
(function initAboutTiltAndReveals() {
    const aboutCard = document.getElementById('aboutGlassCard');
    if (aboutCard) {
        // Reveal on scroll
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) aboutCard.classList.add('in-view');
            });
        }, { threshold: 0.25 });
        cardObserver.observe(aboutCard);

        // 3D Parallax tilt
        aboutCard.addEventListener('mousemove', (e) => {
            const rect = aboutCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });

        aboutCard.addEventListener('mouseleave', () => {
            aboutCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    // Timeline Items Reveal & Progress Line
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.getElementById('timelineProgress');

    if (timeline) {
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
            });
        }, { threshold: 0.2 });
        timelineItems.forEach(item => itemObserver.observe(item));

        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const top = rect.top;
            const height = rect.height;
            const windowH = window.innerHeight;

            const startOffset = windowH * 0.6;
            let scrollDistance = startOffset - top;
            let pct = Math.max(0, Math.min(100, (scrollDistance / height) * 100));

            if (timelineProgress) timelineProgress.style.height = pct + '%';

            const dots = timeline.querySelectorAll('.timeline-dot');
            dots.forEach(dot => {
                const dotTop = dot.getBoundingClientRect().top;
                const lineBottom = timelineProgress.getBoundingClientRect().bottom;
                if (lineBottom >= dotTop) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });
    }
})();

// ══════════════════════════════════════════════════════════
// 7. PROJECT SPOTLIGHT CURSOR TRACKING
// ══════════════════════════════════════════════════════════
(function initProjectSpotlight() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
    });
})();

// ══════════════════════════════════════════════════════════
// 8. TECHNICAL SKILLS FILTERING
// ══════════════════════════════════════════════════════════
(function initSkillFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.skill-card');
    let isFiltering = false;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isFiltering || btn.classList.contains('active')) return;
            isFiltering = true;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Stagger hide
            const visible = Array.from(cards).filter(c => !c.classList.contains('d-none'));
            visible.forEach((c, idx) => {
                setTimeout(() => c.classList.add('filter-hide'), idx * 25);
            });

            const hideTime = visible.length * 25 + 250;

            setTimeout(() => {
                let toShow = [];
                cards.forEach(c => {
                    const cat = c.dataset.category;
                    const match = (filter === 'all' || cat === filter);
                    c.style.transition = 'none';

                    if (match) {
                        c.classList.remove('d-none');
                        c.classList.add('filter-hide');
                        toShow.push(c);
                    } else {
                        c.classList.add('d-none');
                    }
                });

                // Reflow
                cards.forEach(c => void c.offsetWidth);
                cards.forEach(c => c.style.transition = '');

                // Stagger show
                toShow.forEach((c, idx) => {
                    setTimeout(() => c.classList.remove('filter-hide'), idx * 45);
                });

                setTimeout(() => {
                    isFiltering = false;
                }, toShow.length * 45 + 300);

            }, hideTime);
        });
    });
})();

// ══════════════════════════════════════════════════════════
// 9. CONTACT FORM REAL DIRECT DELIVERY & FEEDBACK
// ══════════════════════════════════════════════════════════
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const statusMsg = document.getElementById('formStatusMsg');
    const directLink = document.getElementById('directEmailLink');
    if (!form || !submitBtn) return;

    // Clipboard copy on direct email click
    if (directLink) {
        directLink.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('hello.himanshukr@gmail.com');
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('contactName').value || '').trim();
        const email = (document.getElementById('contactEmail').value || '').trim();
        const message = (document.getElementById('contactMessage').value || '').trim();

        if (!name || !email || !message) {
            if (statusMsg) {
                statusMsg.className = 'form-status-msg error';
                statusMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all fields (Name, Email, Message) before sending.';
            }
            return;
        }

        const origHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Delivering Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.style.opacity = '0.85';
        submitBtn.style.pointerEvents = 'none';

        if (statusMsg) {
            statusMsg.className = 'form-status-msg';
            statusMsg.style.display = 'none';
        }

        // Send via FormSubmit AJAX endpoint directly to hello.himanshukr@gmail.com
        fetch("https://formsubmit.co/ajax/hello.himanshukr@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: `New Portfolio Message from ${name} (${email})`
            })
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.innerHTML = '<span>Message Delivered!</span> <i class="fa-solid fa-circle-check"></i>';
            submitBtn.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            submitBtn.style.borderColor = '#34d399';

            if (statusMsg) {
                statusMsg.className = 'form-status-msg success';
                statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message has been sent directly to Himanshu (hello.himanshukr@gmail.com).`;
            }

            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML = origHTML;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }, 5000);
        })
        .catch(err => {
            // Fallback: Launch mail client + offer direct Gmail link
            submitBtn.innerHTML = '<span>Message Prepared!</span> <i class="fa-solid fa-circle-check"></i>';
            submitBtn.style.background = 'linear-gradient(90deg, #10b981, #059669)';

            if (statusMsg) {
                statusMsg.className = 'form-status-msg success';
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=hello.himanshukr@gmail.com&su=Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
                statusMsg.innerHTML = `<i class="fa-solid fa-envelope"></i> Message ready! Prefer Gmail in browser? <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer">Send directly via Gmail Web &rarr;</a>`;
            }

            const mailtoUrl = `mailto:hello.himanshukr@gmail.com?subject=Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
            window.location.href = mailtoUrl;

            setTimeout(() => {
                submitBtn.innerHTML = origHTML;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }, 5000);
        });
    });
})();

// ══════════════════════════════════════════════════════════
// 10. RESUME MODAL & BACK TO TOP BUTTON
// ══════════════════════════════════════════════════════════
(function initModalsAndScroll() {
    const modal = document.getElementById('resumeModal');
    const closeBtn = document.getElementById('closeResumeBtn');
    const navBtn = document.getElementById('navResumeBtn');
    const heroBtn = document.getElementById('heroResumeBtn');
    const reqBtn = document.getElementById('requestResumeBtn');
    const tip = document.getElementById('resumeCopyTip');

    function openModal(e) {
        if (e) e.preventDefault();
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            modal.scrollTop = 0;
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    if (navBtn) navBtn.addEventListener('click', openModal);
    if (heroBtn) heroBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Copy email to clipboard on Request Resume click
    if (reqBtn) {
        reqBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('hello.himanshukr@gmail.com').then(() => {
                    if (tip) {
                        tip.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> <span>Opening email with "Resume Enquiry"! (hello.himanshukr@gmail.com copied to clipboard)</span>';
                        setTimeout(() => {
                            tip.innerHTML = '<i class="fa-solid fa-circle-info"></i> <span>Clicking "Request Resume PDF" directs to email with pre-filled subject <strong>"Resume Enquiry"</strong>.</span>';
                        }, 5000);
                    }
                }).catch(() => {});
            }
        });
    }

    // Make whole cert cards clickable for easy touch & desktop navigation
    document.querySelectorAll('.cert-item').forEach(item => {
        const link = item.querySelector('.cert-overlay-link');
        if (link) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                if (e.target !== link && !link.contains(e.target)) {
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                }
            });
        }
    });

    // Back to Top Button
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
                backBtn.classList.add('bounce');
            } else {
                backBtn.classList.remove('bounce');
            }
        }, { passive: true });
    }
})();
