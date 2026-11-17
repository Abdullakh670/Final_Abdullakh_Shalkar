// Ticket order form: validation, success message and orders saved in localStorage
$(function () {
    const ORDERS_KEY = 'rmOrders';
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    const PHONE_RE = /^\+?[0-9\s\-()]+$/;
    const $form = $('#ticketForm');
    const $success = $('#successMessage');
    const $list = $('#ordersList');

    function loadOrders() {
        try {
            const data = JSON.parse(localStorage.getItem(ORDERS_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveOrders(orders) {
        try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (e) { /* storage unavailable */ }
    }

    function renderOrders() {
        const orders = loadOrders();
        $list.empty();
        $('#clearOrders').toggle(orders.length > 0);
        if (!orders.length) {
            $list.append('<li class="list-group-item text-muted">No orders yet. Fill in the form above to add one.</li>');
            return;
        }
        orders.forEach(o => {
            const $info = $('<span></span>')
                .append($('<strong></strong>').text(o.match), '<br>',
                        $('<small class="text-muted"></small>').text(`${o.tickets} × ticket, total ${o.total} €, ${o.name}`));
            const $remove = $('<button type="button" class="btn btn-outline-danger btn-sm remove-order">Remove</button>')
                .attr('data-id', o.id).attr('aria-label', 'Remove order: ' + o.match);
            $list.append($('<li class="list-group-item d-flex justify-content-between align-items-center gap-2"></li>').append($info, $remove));
        });
    }

    function setState($el, ok) {
        $el.toggleClass('is-invalid', !ok).toggleClass('is-valid', ok);
    }

    function validate() {
        const count = Number($('#ticketCount').val());
        const phone = $('#phone').val().trim();
        const digits = phone.replace(/\D/g, '');
        const rules = [
            ['#matchSelect', Boolean($('#matchSelect').val())],
            ['#ticketCount', Number.isInteger(count) && count >= 1 && count <= 4],
            ['#fullName', $('#fullName').val().trim().length >= 3],
            ['#email', EMAIL_RE.test($('#email').val().trim())],
            ['#phone', PHONE_RE.test(phone) && digits.length >= 10 && digits.length <= 15]
        ];
        let valid = true;
        rules.forEach(([sel, ok]) => {
            setState($(sel), ok);
            if (!ok) valid = false;
        });
        return valid;
    }

    $form.on('submit', function (e) {
        e.preventDefault();
        $success.stop(true, true).hide();
        if (!validate()) {
            $form.find('.is-invalid').first().trigger('focus');
            return;
        }
        const match = MATCHES[$('#matchSelect').val()];
        const tickets = Number($('#ticketCount').val());
        const total = tickets * match.price;
        const orders = loadOrders();
        orders.push({ id: Date.now(), match: match.title, tickets: tickets, total: total, name: $('#fullName').val().trim() });
        saveOrders(orders);
        renderOrders();

        this.reset();
        $form.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        $('#matchInfo').hide();
        // jQuery effect: slideDown success message
        $success.text(`✅ Order saved: ${tickets} × ${match.title}, total ${total} € (practice order).`).stop(true, true).slideDown();
    });

    $list.on('click', '.remove-order', function () {
        const id = Number($(this).data('id'));
        saveOrders(loadOrders().filter(o => o.id !== id));
        renderOrders();
    });

    $('#clearOrders').on('click', function () {
        saveOrders([]);
        renderOrders();
    });

    // Remove the error as soon as the visitor edits the field
    $form.find('.form-control, .form-select').on('input change', function () {
        $(this).removeClass('is-invalid');
    });

    renderOrders();
});
