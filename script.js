const CHECKOUT_URL = 'https://pagamento.centraldepagamentos.org/checkout?product=32f06008-856c-11f1-a1eb-46da4690ad53';

document.querySelectorAll('.buy-link').forEach(link => {
  link.href = CHECKOUT_URL;
  link.target = '_blank';
  link.rel = 'noopener';
});

// Contagem individual de 15 minutos por visitante.
const TIMER_KEY = 'casaPraticaOfferEnd';
const duration = 15 * 60 * 1000;
let offerEnd = Number(localStorage.getItem(TIMER_KEY));
if (!offerEnd || offerEnd < Date.now()) {
  offerEnd = Date.now() + duration;
  localStorage.setItem(TIMER_KEY, String(offerEnd));
}

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateTimer() {
  let remaining = Math.max(0, offerEnd - Date.now());
  if (remaining === 0) {
    offerEnd = Date.now() + duration;
    localStorage.setItem(TIMER_KEY, String(offerEnd));
    remaining = duration;
  }
  const totalSeconds = Math.floor(remaining / 1000);
  minutesEl.textContent = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  secondsEl.textContent = String(totalSeconds % 60).padStart(2, '0');
}
updateTimer();
setInterval(updateTimer, 1000);

// Galeria
const track = document.querySelector('.slider__track');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.querySelector('.slider__dots');
let currentSlide = 0;
let touchStart = 0;

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ver imagem ${index + 1}`);
  dot.addEventListener('click', () => goToSlide(index));
  dotsWrap.appendChild(dot);
});

const dots = [...dotsWrap.children];
function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

document.querySelector('.slider__arrow--prev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.querySelector('.slider__arrow--next').addEventListener('click', () => goToSlide(currentSlide + 1));
track.addEventListener('touchstart', event => { touchStart = event.touches[0].clientX; }, {passive:true});
track.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 45) goToSlide(currentSlide + (delta < 0 ? 1 : -1));
}, {passive:true});
goToSlide(0);

// Animações de entrada
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
