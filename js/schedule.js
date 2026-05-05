document.addEventListener('DOMContentLoaded', function () {
    fetch('data/parties.json')
        .then(function (response) { return response.json(); })
        .then(function (data) { renderSchedule(data.parties); })
        .catch(function () {
            document.getElementById('schedule-content').innerHTML =
                '<div class="container py-5 text-center"><p class="lead">Unable to load schedule. Please try again later.</p></div>';
        });
});

function parseLocalDate(dateStr) {
    var parts = dateStr.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function formatDate(dateStr) {
    var date = parseLocalDate(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function renderMenuItems(menu) {
    return menu.map(function (item) {
        var badgeClass = item.type === 'Red' ? 'badge-red-pizza' : 'badge-white-pizza';
        return '<div class="menu-item mb-3">' +
            '<h5 class="fw-bold mb-0 text-uppercase">' +
            '<span class="me-2">' + item.name + '</span>' +
            '<span class="badge ' + badgeClass + '">' + item.type + '</span>' +
            '</h5>' +
            '<p class="mb-0">' + item.description + '</p>' +
            '</div>';
    }).join('');
}

function renderPizzaSection(pizza) {
    return '<div class="border-bottom border-black mb-2 mt-4">' +
        '<h6 class="fw-bold text-uppercase mb-1">Pizza</h6>' +
        '</div>' +
        renderMenuItems(pizza);
}

function renderSaladSection(salad) {
    if (!salad) return '';
    return '<div class="border-bottom border-black mb-2 mt-5">' +
        '<h6 class="fw-bold text-uppercase mb-1">Salad</h6>' +
        '</div>' +
        '<div class="menu-item">' +
        '<h5 class="fw-bold mb-0 text-uppercase">' + salad.name + '</h5>' +
        '<p class="mb-0">' + salad.description + '</p>' +
        '</div>';
}

function renderBeerSection(beer) {
    if (!beer) return '';
    return '<div class="border-bottom border-black mb-2 mt-5">' +
        '<h6 class="fw-bold text-uppercase mb-1">Beer</h6>' +
        '</div>' +
        '<div class="menu-item mb-2">' +
        '<h5 class="fw-bold mb-0 text-uppercase">' + beer.light + '</h5>' +
        '</div>' +
        '<div class="menu-item">' +
        '<h5 class="fw-bold mb-0 text-uppercase">' +
        '<span class="me-2">' + beer.homebrew + '</span>' +
        '<span class="badge badge-homebrew">Homebrew</span>' +
        '</h5>' +
        '</div>';
}

function rsvpButton(date, displayDate) {
    return '<div class="text-center mt-4">' +
        '<button class="btn btn-dark rsvp-btn px-4 py-2" data-date="' + date + '" data-display-date="' + displayDate + '">RSVP</button>' +
        '<p class="small fst-italic text-secondary mt-2 mb-0">RSVPing is optional, no pressure!</p>' +
        '</div>';
}

function renderNextParty(party) {
    var displayDate = formatDate(party.date);
    return '<div class="next-party-wrapper py-5">' +
        '<div class="container">' +
        '<div class="row justify-content-center">' +
        '<div class="col-12 col-md-8">' +
        '<div class="text-center mb-4"><span class="next-party-label">Next Party</span></div>' +
        '<div class="party-card next-party-card">' +
        '<div class="party-card-date">' + displayDate + '</div>' +
        (party.time ? '<div class="party-card-time">' + party.time + '</div>' : '') +
        '<div class="party-card-time"><a href="https://www.google.com/maps/search/?api=1&query=3523+W+146+ST+CLEVELAND+OH+44111" target="_blank" rel="noopener">3523 W 146 ST, CLEVELAND, OH</a></div>' +
        renderPizzaSection(party.pizza) + renderSaladSection(party.salad) + renderBeerSection(party.beer) +
        (party.notes ? '<p class="fst-italic text-secondary mt-3">' + party.notes + '</p>' : '') +
        rsvpButton(party.date, displayDate) +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function renderUpcomingParties(parties) {
    var cards = parties.map(function (party) {
        var displayDate = formatDate(party.date);
        return '<div class="col-12 col-md-6">' +
            '<div class="party-card upcoming-party-card h-100">' +
            '<div class="party-card-date upcoming-date">' + displayDate + '</div>' +
            renderPizzaSection(party.pizza) + renderSaladSection(party.salad) + renderBeerSection(party.beer) +
            (party.notes ? '<p class="fst-italic text-secondary mt-3">' + party.notes + '</p>' : '') +
            '</div>' +
            '</div>';
    }).join('');

    return '<div class="upcoming-parties-wrapper py-5">' +
        '<div class="container">' +
        '<h3 class="fw-bold text-uppercase text-center mb-4 section-heading">Also This Summer</h3>' +
        '<div class="row g-4 justify-content-center">' + cards + '</div>' +
        '</div>' +
        '</div>';
}

function renderPastParties(parties) {
    var items = parties.map(function (party, index) {
        var displayDate = formatDate(party.date);
        var id = 'past-party-' + index;
        return '<div class="accordion-item">' +
            '<h2 class="accordion-header">' +
            '<button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#' + id + '" aria-expanded="false" aria-controls="' + id + '">' +
            displayDate +
            '</button>' +
            '</h2>' +
            '<div id="' + id + '" class="accordion-collapse collapse">' +
            '<div class="accordion-body">' +
            renderPizzaSection(party.pizza) + renderSaladSection(party.salad) + renderBeerSection(party.beer) +
            (party.notes ? '<p class="fst-italic text-secondary mt-3">' + party.notes + '</p>' : '') +
            '</div>' +
            '</div>' +
            '</div>';
    }).join('');

    return '<div class="past-parties-wrapper py-5">' +
        '<div class="container">' +
        '<h3 class="fw-bold text-uppercase text-center mb-4 section-heading">Past Parties</h3>' +
        '<div class="accordion past-parties-accordion">' + items + '</div>' +
        '</div>' +
        '</div>';
}

function renderSchedule(parties) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var past = [];
    var upcoming = [];

    parties.forEach(function (party) {
        if (parseLocalDate(party.date) < today) {
            past.push(party);
        } else {
            upcoming.push(party);
        }
    });

    upcoming.sort(function (a, b) { return parseLocalDate(a.date) - parseLocalDate(b.date); });
    past.sort(function (a, b) { return parseLocalDate(b.date) - parseLocalDate(a.date); });

    var next = upcoming.length > 0 ? upcoming.shift() : null;
    var content = document.getElementById('schedule-content');

    if (!next && upcoming.length === 0 && past.length === 0) {
        content.innerHTML = '<div class="container py-5 text-center"><p class="lead section-heading">Stay tuned for next summer!</p></div>';
        return;
    }

    var html = '';
    if (next) html += renderNextParty(next);
    if (upcoming.length > 0) html += renderUpcomingParties(upcoming);
    if (past.length > 0) html += renderPastParties(past);

    content.innerHTML = html;

    document.querySelectorAll('.rsvp-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var date = this.getAttribute('data-date');
            var displayDate = this.getAttribute('data-display-date');

            document.getElementById('rsvp-party-date').value = date;
            document.getElementById('rsvp-party-display').textContent = displayDate;
            document.getElementById('rsvp-name').value = '';
            document.getElementById('rsvp-guests').selectedIndex = 0;
            document.getElementById('rsvp-notes').value = '';
            document.getElementById('rsvp-name').classList.remove('is-invalid');

            document.querySelector('#rsvp-modal .status-spinner').classList.add('d-none');
            document.querySelector('#rsvp-modal .status-success').classList.add('d-none');
            document.querySelector('#rsvp-modal .status-fail').classList.add('d-none');
            document.getElementById('rsvp-button').classList.remove('d-none');
            document.getElementById('rsvp-button').disabled = false;
            document.getElementById('rsvp-close').classList.add('d-none');

            new bootstrap.Modal(document.getElementById('rsvp-modal')).show();
        });
    });
}
