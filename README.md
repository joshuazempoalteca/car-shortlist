# The Shortlist

[Open the public comparison](https://joshuazempoalteca.github.io/car-shortlist/)

Exact linked vehicles, with original user comparison prices preserved:

- New 2026 Mazda3 Sedan 2.5 S Select Sport FWD — $26,000 scenario; Mazda builder shows $26,855.
- Mazda Certified 2025 Mazda3 Sedan 2.5 S Preferred FWD — $28,000 scenario; listing shows $27,937, 9,177 miles; VIN JM1BPACM3S1759974. This corrects the original Carbon Edition placeholder.
- Used 2025 Honda Civic Hybrid Sedan — $27,000 scenario; Carvana shows $27,990 plus shipping, 40,310 miles; VIN 2HGFE4F87SH304734. Structured header says Sport; its generated description says Touring, so trim-specific equipment remains qualified.

- Used 2024 Honda Civic Touring gas sedan — $27,990 asking price, 19,455 miles; VIN 2HGFE1F98RH310592; 180 hp, 31/38/34 mpg, 14.4-cu-ft trunk. Source: https://www.carvana.com/vehicle/4770953

The calculator models purchase + fuel + insurance + routine maintenance. It excludes resale/depreciation, interest, taxes, fees and unexpected repairs. “Load listing prices” loads the observed builder/listing prices; those are not equivalent out-the-door quotes. The used Mazda price includes its dealer admin charge; Both Civic shipping costs are excluded; the browser’s free-shipping display for the Touring is not a Commerce quote.

Defaults: 12,000 miles/year, $3.50/gallon, five years; EPA combined MPG 30 / 31 / 49 / 34. Insurance defaults are $200 / $200 / $230 / $230 per month; the fourth amount is an editable placeholder for the gas Touring. Annual maintenance reserves are $800 / $900 / $900 / $900 for routine service and wear items, excluding unexpected repairs. These are planning assumptions, informed by Edmunds five-year maintenance categories, not exact quotes. Insurance and maintenance amounts are held constant without inflation and do not auto-scale with mileage. Inputs are local to the browser and not transmitted or saved. No trackers, keys, dependencies, build step or backend.

## Images and sources

Vehicle images were exported from the user-supplied Mazda builder, Mazda exact-VIN inventory page and Carvana exact-vehicle page. The builder image is illustrative; used photos show the linked vehicles. Photo attribution and listing links appear on each card. Copyright remains with the respective source owners. Dealer-photo promotional text is part of the original listing image, not a modeled offer.

Listings and warranty/specification sources were checked October 17, 2026 and are linked on the page. Prices and availability are a snapshot.

## Hosting

Static files are served by GitHub Pages from the main branch root. `.nojekyll` disables Jekyll processing. Relative asset paths support the repository subpath. Open index.html directly or use a static server for local preview.

## Interface

The October 17 redesign uses the Hallmark editorial catalogue approach with a Sport-derived token system. Local Big Shoulders Display, Albert Sans and JetBrains Mono font files are covered by the notices in font-licenses.txt. UI styling is in ui.css and tokens.css; the original styles.css remains as source history. The catalogue now includes four vehicles; the calculator separates purchase, fuel, insurance and maintenance.

