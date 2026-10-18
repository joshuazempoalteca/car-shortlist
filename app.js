'use strict';

// Insurance and annual routine-maintenance/wear reserves stay constant; no inflation, unexpected repairs or resale credit.
const defaults = Object.freeze({ 'annual-miles': 12000, 'gas-price': 3.5, years: 5, 'price-new': 26000, 'price-used': 28000, 'price-civic': 27000, 'price-touring': 27990, 'mpg-new': 30, 'mpg-used': 31, 'mpg-civic': 49, 'mpg-touring': 34, 'insurance-new': 200, 'insurance-used': 200, 'insurance-civic': 230, 'insurance-touring': 230, 'maintenance-new': 800, 'maintenance-used': 900, 'maintenance-civic': 900, 'maintenance-touring': 900 });
const cars = [{ id: 'new', name: 'New Mazda3', listingPrice: 26855 }, { id: 'used', name: 'Mazda3 Preferred', listingPrice: 27937 }, { id: 'civic', name: 'Civic Hybrid', listingPrice: 27990 }, { id: 'touring', name: 'Civic Touring', listingPrice: 27990 }];
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const number = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
const inputLabels = Object.freeze({
  'annual-miles': 'Annual miles',
  'gas-price': 'Gas price',
  years: 'Years you’ll keep the car',
  'price-new': 'New Mazda3 purchase price',
  'price-used': 'Mazda3 Preferred purchase price',
  'price-civic': 'Civic Hybrid purchase price',
  'price-touring': 'Civic Touring purchase price',
  'mpg-new': 'New Mazda3 fuel economy',
  'mpg-used': 'Mazda3 Preferred fuel economy',
  'mpg-civic': 'Civic Hybrid fuel economy',
  'mpg-touring': 'Civic Touring fuel economy',
  'insurance-new': 'New Mazda3 monthly insurance',
  'insurance-used': 'Mazda3 Preferred monthly insurance',
  'insurance-civic': 'Civic Hybrid monthly insurance',
  'insurance-touring': 'Civic Touring monthly insurance',
  'maintenance-new': 'New Mazda3 annual maintenance',
  'maintenance-used': 'Mazda3 Preferred annual maintenance',
  'maintenance-civic': 'Civic Hybrid annual maintenance',
  'maintenance-touring': 'Civic Touring annual maintenance'
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
    const annualInsurance = values['insurance-' + car.id] * 12;
    const insurance = annualInsurance * values.years;
    const annualMaintenance = values['maintenance-' + car.id];
    const maintenance = annualMaintenance * values.years;
    const annualRunning = annualFuel + annualInsurance + annualMaintenance;
    return { ...car, price, mpg, annualFuel, fuel, annualInsurance, insurance, annualMaintenance, maintenance, annualRunning, total: price + fuel + insurance + maintenance };
  });
}

function compareRunningCosts(newMazda, civic, years) {
  const savings = newMazda.annualRunning - civic.annualRunning;
  const premium = civic.price - newMazda.price;
  const caption = savings > 0 ? 'less per year in Civic Hybrid operating costs' : savings < 0 ? 'more per year in Civic Hybrid operating costs' : 'annual operating-cost difference: Civic Hybrid vs. new Mazda3';
  const duration = time => time < 0.1 ? 'less than 0.1 years' : 'about ' + number(time) + ' years';
  let breakEven;
  if (premium > 0 && savings > 0) {
    const time = premium / savings;
    breakEven = 'The Civic Hybrid’s ' + money(premium) + ' purchase premium is recovered in ' + duration(time) + ' through lower operating costs' + (time > years ? ', beyond the selected ownership period.' : '.');
  } else if (premium <= 0 && savings >= 0) {
    breakEven = 'At these inputs, the Civic Hybrid starts ' + (premium < 0 ? money(-premium) + ' lower' : 'at the same purchase price') + ' and has ' + (savings > 0 ? 'lower' : 'the same') + ' annual operating costs as the new Mazda3.';
  } else if (premium > 0) {
    breakEven = 'At these inputs, operating costs do not recover the Civic Hybrid’s ' + money(premium) + ' purchase premium over the new Mazda3; its annual operating costs are ' + (savings < 0 ? 'higher.' : 'the same.');
  } else {
    const time = -premium / -savings;
    breakEven = premium < 0 ? 'The Civic Hybrid’s ' + money(-premium) + ' lower purchase price is offset by higher operating costs after ' + duration(time) + (time > years ? ', beyond the selected ownership period.' : '.') : 'The purchase prices are equal, and the Civic Hybrid has higher annual operating costs at these inputs.';
  }
  return { savings, premium, caption, breakEven };
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
  const original = cars.every(car => values['price-' + car.id] === defaults['price-' + car.id]);
  const listed = cars.every(car => values['price-' + car.id] === car.listingPrice);
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
      lowest.textContent = 'Lowest modeled total';
      label.append(lowest);
    }
    const total = document.createElement('strong');
    total.textContent = money(row.total);
    title.append(label, total);
    const bar = document.createElement('div');
    bar.className = 'cost-bar';
    bar.setAttribute('aria-hidden', 'true');
    for (const [className, amount] of [['purchase', row.price], ['fuel', row.fuel], ['insurance', row.insurance], ['maintenance', row.maintenance]]) {
      const segment = document.createElement('span');
      segment.className = className;
      segment.style.width = (amount / maximum * 100) + '%';
      bar.append(segment);
    }
    const sub = document.createElement('div');
    sub.className = 'bar-sub';
    const breakdown = document.createElement('span');
    breakdown.className = 'bar-breakdown';
    for (const [label, amount] of [['purchase', row.price], ['fuel', row.fuel], ['insurance', row.insurance], ['maintenance', row.maintenance]]) {
      const component = document.createElement('span');
      component.textContent = money(amount) + ' ' + label;
      breakdown.append(component);
    }
    const annual = document.createElement('span');
    annual.textContent = money(row.annualRunning) + ' running costs / yr · ' + number(row.mpg) + ' mpg';
    sub.append(breakdown, annual);
    wrapper.append(title, bar, sub);
    return wrapper;
  }));
  const comparison = compareRunningCosts(rows.find(row => row.id === 'new'), rows.find(row => row.id === 'civic'), values.years);
  document.getElementById('annual-savings').textContent = money(Math.abs(comparison.savings));
  document.getElementById('savings-caption').textContent = comparison.caption;
  document.getElementById('break-even').textContent = comparison.breakEven;
  document.getElementById('calculation-status').textContent = values.years + '-year purchase, fuel, insurance and maintenance: ' + rows.map(row => row.name + ' ' + money(row.total)).join('; ') + '.';
}

if (typeof document !== 'undefined') {
  document.getElementById('cost-form').addEventListener('submit', event => event.preventDefault());
  document.getElementById('cost-form').addEventListener('input', render);
  document.getElementById('reset').addEventListener('click', () => {
    for (const [id, value] of Object.entries(defaults)) document.getElementById(id).value = value;
    render();
  });
  document.getElementById('use-listing-prices').addEventListener('click', () => {
    for (const car of cars) document.getElementById('price-' + car.id).value = car.listingPrice;
    render();
  });
  render();
}
if (typeof module !== 'undefined') module.exports = { calculateScenario, compareRunningCosts, defaults };
