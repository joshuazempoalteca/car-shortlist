# The Shortlist

A responsive, static comparison of three supplied car scenarios:

- New 2026 Mazda3 — $26,000
- Used Mazda3 Carbon Edition — $28,000, 9,000 miles, year unconfirmed
- Used 2025 Honda Civic Hybrid Sedan — $27,000, mileage and trim unconfirmed

Open `index.html` directly, or serve this folder with any static HTTP server. No build step, dependencies, trackers, keys, or backend are required. Inputs change the current browser view; they are not saved or transmitted.

## GitHub Pages

Publish this folder as the root of a **new public repository**. In that repository, choose **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**. GitHub will show the public page URL when deployment completes.

All assets use relative paths so the page works at a repository subpath. `.nojekyll` disables unnecessary Jekyll processing.

## Model and sources

The calculator models **purchase price + gasoline only**. It excludes taxes, fees, interest, insurance, maintenance, repairs and depreciation/resale. Inputs are illustrative assumptions. Defaults: 12,000 miles/year, $3.50/gallon, 5 years; 30 / 30 / 49 combined MPG. Manufacturer references and configuration caveats are linked on the page.

The new Mazda uses 2026 2.5 S FWD sedan specs pending trim/body confirmation. The Carbon uses 2025 2.5 S Carbon Edition AWD sedan specs pending year/body confirmation. Do not treat those reference configurations as verified listings. Both 2025 Civic sedan hybrid trims share the displayed power and MPG ratings.

Prepared October 17, 2026. There is no live vehicle inventory or price feed.
