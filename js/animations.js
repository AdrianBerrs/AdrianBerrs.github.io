(() => {
    const header = document.querySelector(".site-header");
    const navigation = [...header.querySelectorAll('nav a, .header-contact')]
        .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }));
    const timeline = document.querySelector(".experience-list");
    const jobs = [...timeline.querySelectorAll(".job")];
    let currentLink = header.querySelector('[aria-current="location"]');
    let currentJob;
    let frame = 0;

    function updateNavigation() {
        const guide = Math.max(window.innerHeight * 0.35, header.getBoundingClientRect().bottom + 16);
        let sectionInView = navigation[0];
        let latestTop = -Infinity;

        for (const item of navigation) {
            const top = item.section.getBoundingClientRect().top;
            if (top > guide) continue;

            if (top > latestTop || (top === latestTop && item.link.hash === location.hash)) {
                latestTop = top;
                sectionInView = item;
            }
        }

        const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
        const readingProgress = scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0;
        header.style.setProperty("--reading-progress", readingProgress.toFixed(4));

        const atBottom = window.scrollY > 0 && window.scrollY >= scrollRange - 2;
        const nextLink = atBottom ? navigation.at(-1).link : sectionInView.link;

        if (nextLink === currentLink) return;

        currentLink?.removeAttribute("aria-current");
        nextLink.setAttribute("aria-current", "location");
        currentLink = nextLink;
    }

    function updateTimeline() {
        const guide = window.innerHeight * 0.52 - timeline.getBoundingClientRect().top;
        const progress = Math.min(1, Math.max(0, guide / timeline.offsetHeight));
        let activeJob;

        for (const job of jobs) {
            const reached = guide + 1 >= job.offsetTop + job.offsetHeight / 2;
            job.classList.toggle("is-reached", reached);
            if (reached && progress < 1) activeJob = job;
        }

        timeline.style.setProperty("--timeline-progress", progress.toFixed(3));

        if (activeJob === currentJob) return;

        currentJob?.classList.remove("is-in-view");
        activeJob?.classList.add("is-in-view");
        currentJob = activeJob;
    }

    function scheduleUpdate() {
        if (frame) return;

        frame = requestAnimationFrame(() => {
            frame = 0;
            updateNavigation();
            updateTimeline();
        });
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    scheduleUpdate();

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            let delay = 0;
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                entry.target.style.setProperty("--reveal-delay", delay + "ms");
                entry.target.classList.add("has-entered");
                observer.unobserve(entry.target);
                delay = Math.min(delay + 75, 225);
            }
        }, { threshold: 0.14 });

        for (const element of document.querySelectorAll("[data-reveal]")) {
            observer.observe(element);
        }
    }

    const portrait = document.querySelector(".portrait");
    const pointerMotion = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");

    portrait.addEventListener("pointermove", (event) => {
        if (!pointerMotion.matches || event.pointerType !== "mouse") return;

        const bounds = portrait.getBoundingClientRect();
        portrait.style.setProperty("--portrait-x", ((event.clientX - bounds.left) / bounds.width - 0.5) * 18 + "px");
        portrait.style.setProperty("--portrait-y", ((event.clientY - bounds.top) / bounds.height - 0.5) * 18 + "px");
    });

    portrait.addEventListener("pointerleave", () => {
        portrait.style.removeProperty("--portrait-x");
        portrait.style.removeProperty("--portrait-y");
    });
})();
