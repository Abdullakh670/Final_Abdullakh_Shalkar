// Data for the home matches (used by the order form) + schedule filters
// Prices are practice values for the course project.
const MATCHES = {
    celta:   { title: 'Real Madrid vs Celta Vigo',   text: 'La Liga, Sat Nov 21, 21:00, Santiago Bernabéu.', price: 60 },
    psv:     { title: 'Real Madrid vs PSV Eindhoven', text: 'Champions League, Tue Nov 24, 21:00, Santiago Bernabéu.', price: 90 },
    alaves:  { title: 'Real Madrid vs Alavés',        text: 'La Liga, Sat Nov 28, time to be confirmed, Santiago Bernabéu.', price: 60 },
    osasuna: { title: 'Real Madrid vs Osasuna',       text: 'La Liga, Sun Dec 13, time to be confirmed, Santiago Bernabéu.', price: 60 }
};

$(function () {
    // Ticket price column in the schedule (home matches only)
    $('#matchTable td[data-match]').each(function () {
        const m = MATCHES[$(this).data('match')];
        $(this).text(m ? `from ${m.price} €` : '—');
    });

    const $buttons = $('#matchFilters .filter-btn');
    $buttons.attr('aria-pressed', 'false').filter('.active').attr('aria-pressed', 'true');

    $('#matchFilters').on('click', '.filter-btn', function () {
        $buttons.removeClass('active').attr('aria-pressed', 'false');
        $(this).addClass('active').attr('aria-pressed', 'true');
        const q = $(this).data('f');
        $('#matchTable tbody tr').each(function () {
            $(this).toggle(!q || $(this).text().indexOf(q) > -1);
        });
    });

    $('#matchSelect').on('change', function () {
        const m = MATCHES[this.value];
        if (m) {
            $('#matchInfo').text(`${m.text} Practice price: ${m.price} € per ticket.`).stop(true, true).slideDown(150);
        } else {
            $('#matchInfo').stop(true, true).slideUp(150);
        }
    });
});
