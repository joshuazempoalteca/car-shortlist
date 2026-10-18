'use strict';

// A deliberately narrow model: purchase price plus gasoline, with no resale credit.
const defaults = Object.freeze({ 'annual-miles': 12000, 'gas-price': 3.5, years: 5, 'price-new': 26000, 'price-used': 28000, 'price-civic': 27000, 'mpg-new': 30, 'mpg-used': 31, 'mpg-civic': 49 });
const cars = [{ id: 'new', name: 'New Mazda3' }, { id: 'used', name: 'Mazda3 Preferred' }, { id: 'civic', name: 'Civic Hybrid' }];
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const number = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
const inputLabels = Object.freeze({
  'annual-miles': 'Annual miles',
  'gas-price': 'Gas price',
  years: 'Years you’ll keep the car',
  'price-new': 'New Mazda3 purchase price',
  'price-used': 'Mazda3 Preferred purchase price',
  'price-civic': 'Civic Hybrid purchase price',
  'mpg-new': 'New Mazda3 fuel economy',
  'mpg-used': 'Mazda3 Preferred fuel economy',
  'mpg-civic': 'Civic Hybrid fuel economy'
});

function validationMessage(input) {
  const label = inputLabels[input.id] || input.labels?.[0]?.textContent.trim() || 'This field';
  const whole = input.step === '1';
  const bounds = input.min !== '' && input.max !== '' ? ' from ' + number(Number(input.min)) + ' to ' + number(Number(input.max)) : '';
  const increment = input.step && input.step !== 'any' && !whole ? ', in increments of ' + input.step : '';
  return label + ': enter ' + (whole ? 'a whole number' : 'a number') + bounds + increment + '. Results show the last valid inputs.';
}

function calculateScenario(values) {
  return cars.map(car => {
    const price = values['price-' + car.id];
    const mpg = values['mpg-' + car.id];
    const annualFuel = values['annual-miles'] / mpg * values['gas-price'];
    const fuel = annualFuel * values.years;
    return { ...car, price, mpg, annualFuel, fuel, total: price + fuel };
  });
}

function render() {
  const values = {};
  let invalidInput = null;
  for (const id of Object.keys(defaults)) {
    const input = document.getElementById(id);
    const valid = input.value.trim() !== '' && input.validity.valid && Number.isFinite(input.valueAsNumber);
    input.setAttribute('aria-invalid', String(!valid));
    const describedBy = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== 'input-error');
    if (!valid) describedBy.push('input-error');
    if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));
    else input.removeAttribute('aria-describedby');
    if (!valid && !invalidInput) invalidInput = input;
    values[id] = input.valueAsNumber;
  }
  const error = document.getElementById('input-error');
  error.hidden = !invalidInput;
  error.textContent = invalidInput ? validationMessage(invalidInput) : '';
  const staleNotice = document.getElementById('results-stale');
  if (staleNotice) staleNotice.hidden = !invalidInput;
  document.getElementById('results').dataset.stale = String(Boolean(invalidInput));
  if (invalidInput) {
    return;
  }
  const original = ['new', 'used', 'civic'].every(id => values['price-' + id] === defaults['price-' + id]);
  const listed = values['price-new'] === 26855 && values['price-used'] === 27937 && values['price-civic'] === 27990;
  document.getElementById('price-basis').textContent = original ? 'Calculator prices: original estimates.' : listed ? 'Calculator prices: linked listings (fees excluded).' : 'Calculator prices: custom.';
  const rows = calculateScenario(values);
  const maximum = Math.max(...rows.map(row => row.total), 1);
  const minimum = Math.min(...rows.map(row => row.total));
  document.getElementById('term-label').textContent = values.years + '-year';
  document.getElementById('cost-bars').replaceChildren(...rows.map(row => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cost-row';
    const title = document.createElement('div');
    title.className = 'bar-heading';
    const label = document.createElement('span');
    label.textContent = row.name;
    if (Math.abs(row.total - minimum) < 0.005) {
      const lowest = document.createElement('span');
      lowest.className = 'lowest';
      lowest.textContent = 'Lowest purchase + fuel';
      label.append(lowest);
    }
    const total = document.createElement('strong');
    total.textContent = money(row.total);
    title.append(label, total);
    const bar = document.createElement('div');
    bar.className = 'cost-bar';
    bar.setAttribute('aria-hidden', 'true');
    for (const [className, amount] of [['purchase', row.price], ['fuel', row.fuel]]) {
      const segment = document.createElement('span');
      segment.className = className;
      segment.style.width = (amount / maximum * 100) + '%';
      bar.append(segment);
    }
    const sub = document.createElement('div');
    sub.className = 'bar-sub';
    const breakdown = document.createElement('span');
    breakdown.textContent = money(row.price) + ' purchase + ' + money(row.fuel) + ' fuel';
    const annual = document.createElement('span');
    annual.textContent = money(row.annualFuel) + ' fuel / yr · ' + number(row.mpg) + ' mpg';
    sub.append(breakdown, annual);
    wrapper.append(title, bar, sub);
    return wrapper;
  }));
  const savings = rows[0].annualFuel - rows[2].annualFuel;
  const premium = rows[2].price - rows[0].price;
  document.getElementById('annual-savings').textContent = money(Math.abs(savings));
  document.getElementById('savings-caption').textContent = savings > 0 ? 'less per year in the Civic vs. the new Mazda3' : savings < 0 ? 'more per year in the Civic vs. the new Mazda3' : 'annual fuel-cost difference between the Civic and new Mazda3';
  const crossover = document.getElementById('break-even');
  if (premium > 0 && savings > 0) {
    const time = premium / savings;
    const formatted = time < 0.1 ? 'less than 0.1 years' : 'about ' + number(time) + ' years';
    crossover.textContent = 'The Civic’s ' + money(premium) + ' purchase premium is recovered in ' + formatted + ' through fuel savings alone.';
  } else if (premium <= 0 && savings >= 0) {
    crossover.textContent = 'At these inputs, the Civic starts ' + (premium < 0 ? money(-premium) + ' lower' : 'at the same purchase price') + ' and uses ' + (savings > 0 ? 'less fuel money' : 'the same fuel money') + ' than the new Mazda3.';
  } else if (premium > 0) {
    crossover.textContent = 'At these inputs, fuel savings do not recover the Civic’s ' + money(premium) + ' purchase premium over the new Mazda3.';
  } else {
    const time = -premium / -savings;
    crossover.textContent = premium < 0 ? 'The Civic’s ' + money(-premium) + ' lower purchase price is offset by higher fuel costs after about ' + number(time) + ' years.' : 'The purchase prices are equal, and the Civic uses more fuel money at these inputs.';
  }
  document.getElementById('calculation-status').textContent = values.years + '-year purchase plus fuel: ' + rows.map(row => row.name + ' ' + money(row.total)).join('; ') + '.';
}

if (typeof document !== 'undefined') {
  document.getElementById('cost-form').addEventListener('submit', event => event.preventDefault());
  document.getElementById('cost-form').addEventListener('input', render);
  document.getElementById('reset').addEventListener('click', () => {
    for (const [id, value] of Object.entries(defaults)) document.getElementById(id).value = value;
    render();
  });
  document.getElementById('use-listing-prices').addEventListener('click', () => {
    const listingPrices = { new: 26855, used: 27937, civic: 27990 };
    for (const [id, price] of Object.entries(listingPrices)) document.getElementById('price-' + id).value = price;
    render();
  });
  render();
}
if (typeof module !== 'undefined') module.exports = { calculateScenario, defaults };
