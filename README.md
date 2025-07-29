# CS-Kréyasion Website

Showcase website for CS-Kréyasion, a family artisanal business in Martinique specializing in decorative objects, earrings, handbags, lamps, and clocks made from wood, resin, and traditional fabrics like madras and wax with a Creole design touch.

## Project Structure

```
cs-kreayasion/
├── index.html                 # Home page
├── css/
│   └── style.css             # Custom styles and color palette
├── js/
│   └── main.js               # JavaScript functionality
├── pages/
│   ├── articles.html         # Products page
│   ├── about.html            # About page
│   └── contact.html          # Contact page
├── imgs/
│   ├── hero/                 # Hero section images
│   ├── products/             # Product images
│   │   ├── lamps/            # Lamp images
│   │   ├── earrings/         # Earring images
│   │   ├── handbags/         # Handbag images
│   │   ├── clocks/           # Clock images
│   │   └── decorations/      # Decoration images
│   ├── testimonials/         # Customer testimonial images
│   ├── team/                 # Team member images
│   └── favicon.png           # Website favicon
├── data/
│   └── content.md            # Content management file
└── README.md                 # This file
```

## Design Features

- **Modern and Clean Design**: Minimalist aesthetic with focus on products
- **Responsive Layout**: Works on all device sizes
- **Martinique Color Palette**:
  - Wood brown (#3E2723) for primary elements
  - Off-white (#FFFCF9) for backgrounds
  - Martinique flag colors (red #C1272D, green #006B3F, black) for accents
- **Soft Animations**: Subtle transitions and hover effects
- **Creole Design Touch**: Cultural elements throughout the site

## Technical Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript**: Interactive elements and functionality
- **Google Fonts**: Playfair Display and Poppins typography
- **Font Awesome**: Icons

## Content Management

All content is managed through the `data/content.md` file. This includes:
- Hero section content
- Featured products
- Testimonials
- About page information
- Contact information
- FAQ items
- Color palette references
- Typography information

## Maintenance Guide

### Updating Content
1. Edit the `data/content.md` file to update text content
2. Replace images in the appropriate directories under `imgs/`
3. Update navigation links if pages are added/removed

### Adding New Products
1. Add product images to the appropriate category folder in `imgs/products/`
2. Update the products section in the relevant HTML file
3. Add product information to `data/content.md`

### Updating the Color Palette
1. Modify the color variables in `css/style.css`
2. Update the color palette information in `data/content.md`

### Adding New Pages
1. Create a new HTML file in the `pages/` directory
2. Follow the existing structure and design patterns
3. Add the page to the navigation menu in all HTML files
4. Add page information to `data/content.md`

## Deployment

Simply upload all files to your web server. The site is completely static and requires no server-side processing.

## Browser Support

The site works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Accessibility

The site follows WCAG 2.1 guidelines for accessibility:
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Sufficient color contrast
- Keyboard navigation support

## Performance

- Optimized images
- Minified CSS and JavaScript
- Efficient code structure
- No external dependencies except CDN-hosted libraries

## Customization

To customize the site:
1. Update colors in `css/style.css`
2. Replace images in the `imgs/` directory
3. Modify content in `data/content.md`
4. Update text content in HTML files as needed

## Support

For support with this website, contact the developer or refer to the documentation in this README file.