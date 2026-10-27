const weddingDate = new Date('2026-11-09T11:00:00+05:30');
const countdownParts = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
};

function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownParts.days.textContent = String(days).padStart(2, '0');
  countdownParts.hours.textContent = String(hours).padStart(2, '0');
  countdownParts.minutes.textContent = String(minutes).padStart(2, '0');
  countdownParts.seconds.textContent = String(seconds).padStart(2, '0');

  if (remaining === 0) {
    document.querySelector('#countdown-title').innerHTML = 'The day has<br /><em>arrived</em>';
  }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealTargets = document.querySelectorAll(
  '.story-image, .story-copy, .section-heading, .event-card, .event-connector, .family-photo, .family-copy, .gallery-item, .rsvp-content',
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((target, index) => {
    target.classList.add('scroll-reveal');
    target.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
    revealObserver.observe(target);
  });
}

function downloadCalendarInvite(event) {
  event.preventDefault();
  const calendarContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Thomas and Anju//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:thomas-anju-wedding-20261109@invitation.local',
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    'DTSTART;TZID=Asia/Kolkata:20261109T110000',
    'DTEND;TZID=Asia/Kolkata:20261109T130000',
    'SUMMARY:Wedding of Thomas and Anju',
    'LOCATION:Mar Gregorios Orthodox Church, Nalunnakkal, Kottayam',
    'DESCRIPTION:Wedding ceremony at 11:00 AM IST. Reception thereafter at St Adais Church Parish Hall, Nalunnakkal.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const calendarFile = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(calendarFile);
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = 'thomas-and-anju-wedding.ics';
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
}

document.querySelectorAll('#calendar-link, [data-calendar-link]').forEach((link) => {
  link.addEventListener('click', downloadCalendarInvite);
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.dataset.alt;
    lightboxCaption.textContent = item.dataset.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
