$(document).ready(function() {
    // 1. Data Structure for Trophies (Array of Objects - fulfills JS criteria)
    const trophies = [
        {
            count: 15,
            title: "UEFA Champions League",
            desc: "Most in history. Last won in 2024.",
            image: "images/trophies/ucl.png"
        },
        {
            count: 36,
            title: "La Liga",
            desc: "Most in Spain. Last won in 2024.",
            image: "images/trophies/laliga.png"
        },
        {
            count: 20,
            title: "Copa del Rey",
            desc: "Third most behind Barcelona and Athletic Club.",
            image: "images/trophies/copa.png"
        },
        {
            count: 13,
            title: "Spanish Super Cups",
            desc: "Domestic dominance.",
            image: "images/trophies/supercopa.png"
        },
        {
            count: 9,
            title: "World Titles",
            desc: "4 Intercontinental Cups and 5 Club World Cups.",
            image: "images/trophies/cwc.png"
        }
    ];

    // 2. Render Trophies dynamically back into the Bootstrap Carousel
    const $carousel = $('#carousel-content');
    
    if ($carousel.length) {
        trophies.forEach((trophy, index) => {
            const isActive = index === 0 ? 'active' : '';
            const slideHtml = `
                <div class="carousel-item ${isActive} trophy-slide" style="background-image: url('${trophy.image}');">
                    <div class="trophy-content">
                        <div class="stat-big display-1">${trophy.count}</div>
                        <p class="text-white fs-4 mb-1">${trophy.title}</p>
                        <p class="text-white mb-0">${trophy.desc}</p>
                    </div>
                </div>
            `;
            $carousel.append(slideHtml);
        });
    }

    // jQuery Effect 2: accordion (slideToggle) for eras; real buttons, so Enter and Space work
    $('.era-toggle').on('click', function () {
        const $btn = $(this);
        const open = $btn.attr('aria-expanded') === 'true';
        $btn.attr('aria-expanded', String(!open)).find('span').text(open ? '▼' : '▲');
        $btn.closest('.era-section').find('.era-content').stop(true, true).slideToggle(300);
    });

    // jQuery Effect 3: back-to-top button fades in/out once and scrolls smoothly
    const $top = $('#backToTop');
    let topShown = false;
    $(window).on('scroll', function () {
        const show = $(this).scrollTop() > 300;
        if (show === topShown) return;
        topShown = show;
        $top.stop(true, true)[show ? 'fadeIn' : 'fadeOut'](200);
    });
    $top.on('click', function () {
        $('html, body').stop(true).animate({ scrollTop: 0 }, 600);
    });
});
