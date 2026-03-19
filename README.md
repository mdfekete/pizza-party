# Pizza Party

A static website for **Mario's**, a West Park home pizzeria serving contemporary Neapolitan pizzas. The site lets guests browse the menu and place their pizza order for an upcoming pizza party.

## Features

- Menu showcasing Red and White pizza options
- Image carousel of available pizzas
- Order form (modal) with name, pizza selection, quantity, and optional notes
- Order submission via [EmailJS](https://www.emailjs.com/)

## Tech Stack

- HTML / CSS / JavaScript
- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Splide](https://splidejs.com/) — image carousel
- [jQuery](https://jquery.com/)
- [EmailJS](https://www.emailjs.com/) — order submission via email

## Project Structure

```
pizza-party/
├── css/          # Custom styles
├── fonts/        # Local font files
├── images/       # Favicon and pizza photos
├── js/           # Email sending logic
├── lib/          # Vendored libraries (Bootstrap, Splide, jQuery)
├── index.html    # Main page
└── site.webmanifest
```

## Setup

This is a static site with no build step. Simply open `index.html` in a browser, or serve it with any static file server.

Order submissions use EmailJS. To configure your own EmailJS integration, update the credentials in `js/email.js` with your public key, service ID, and template ID.
