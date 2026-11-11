# Black Meadow Real Estate

Static website for Black Meadow Real Estate. The pages are plain HTML and CSS, with one small script for the mobile menu. There is no framework and no build step. GitHub Pages serves this folder from the root of the `main` branch.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, three sample listings, service areas, and an about teaser |
| `about.html` | Biography, values, and why choose us |
| `listings.html` | Six sample listings |
| `contact.html` | Email, phone, office, and a contact form |
| `styles.css` | Shared styles for every page |
| `nav.js` | Opens and closes the menu on small screens |
| `assets/` | Logo, favicon, hero, and property illustrations |
| `CNAME` | Custom domain `domsellsforyou.com` |

## Preview on your computer

From this folder, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. Opening an HTML file directly also works for a quick look. Use the local server if you want links and paths to behave the way they will on GitHub Pages.

## Edit the words

Placeholder copy is marked in the HTML with `<!-- PLACEHOLDER -->`. Search the project for `PLACEHOLDER` and replace the text next to each comment.

Replace these before you advertise the site:

- Town names in the service-area list on `index.html`
- The biography, values, and “why choose us” sections on `about.html`
- The phone number and office address on `contact.html`
- The six sample properties on `listings.html`, and the three featured cards on `index.html`

Each sample card is also labeled **Sample** on the page. Remove that badge, and the notes that say the homes are not for sale, when the cards show real listings.

The email address `blackmeadowrealestate@gmail.com` is the real contact address. It appears in the footer of every page, on the contact page, and as the form’s `mailto:` action. Change it in all of those places if the address changes.

The header (Home, About, Listings, Contact) and the footer are repeated in each HTML file. If you add a page or rename a file, update those links in every file.

## Edit the contact form

The form on `contact.html` uses `action="mailto:blackmeadowrealestate@gmail.com"`. It does not save messages on the website. Choosing **Email Black Meadow** opens the visitor’s email program with the name, email, phone, and message filled in.

Someone without an email app may see nothing happen. The address is also written on the page so they can write directly. Fields marked with an asterisk are required. The phone field is optional.

## Edit the look

Colors and fonts live at the top of `styles.css`, on `:root`. The display face is Cormorant Garamond. The body face is Outfit. Both are loaded from Google Fonts. The link is in the `<head>` of each HTML file, so a font change needs both the stylesheet and those links.

Illustrations are SVG files in `assets/`:

- `favicon.svg` is the browser icon
- `logo-mark.svg` sits beside the name in the header
- `hero-meadow.svg` is the picture in the home hero
- `prop-01.svg` through `prop-06.svg` are the property cards, in the same order as the listings

To swap a picture, replace the file and keep the filename, or change the `src` in the HTML. Photographs work in the same spots. Keep a similar shape (about 4:3 for property cards) so the grid stays even.

`nav.js` only handles the mobile menu. It does not need a change for ordinary copy or image edits.

## Domain and publishing

`CNAME` contains one line: `domsellsforyou.com`. GitHub Pages reads that file when the site is published from the `main` branch, folder `/`.

Pointing the domain’s DNS records at GitHub is done with the registrar, not in this repository. After DNS is in place, HTTPS is turned on from the GitHub Pages settings once the certificate is ready.

To publish a change, commit it to `main` and push. Pages rebuilds from those files. No build command is required.
