/* 
   ⚠️  EMAILJS SETUP — READ BEFORE GOING LIVE
   
   1. Go to https://www.emailjs.com and create a FREE account
   2. Add a new Email Service → connect your Gmail (kellykantumoya18@gmail.com)
      → copy the Service ID and paste it below
   3. Create an Email Template with these variables:
         {{fullName}}, {{phone}}, {{email}}, {{copies}},
         {{delivery}}, {{address}}, {{note}}, {{timestamp}}
      → Make sure To: is set to both emails (see tip below)
      → Copy the Template ID and paste it below
   4. Go to Account → copy your Public Key and paste it below

   TIP: To send to BOTH emails, in your EmailJS template set
        "To Email" as: kellykantumoya18@gmail.com,nayameluzangu@gmail.com
        Or create two templates and call emailjs.send() twice.

   To update the LAUNCH DATE: find the line below marked 🗓️
 */

const EMAILJS = {
    publicKey:  'YOUR_PUBLIC_KEY',    // ← replace this
    serviceId:  'YOUR_SERVICE_ID',    // ← replace this
    templateId: 'YOUR_TEMPLATE_ID',   // ← replace this
};

emailjs.init(EMAILJS.publicKey);


/* NAVBAR SCROLL EFFECT */

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/*
   COUNTDOWN TIMER
   🗓️  Update this date once the launch date is confirmed:
       new Date(YEAR, MONTH_INDEX, DAY)  ← month is 0-indexed (July = 6)
 */
const LAUNCH_DATE = new Date(2026, 6, 31, 10, 0, 0); // July 31 2026, 10:00am

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
    const diff = LAUNCH_DATE - new Date();
    if (diff <= 0) {
        ['cd-days','cd-hours','cd-minutes','cd-seconds']
            .forEach(id => document.getElementById(id).textContent = '00');
        return;
    }
    document.getElementById('cd-days').textContent    = pad(Math.floor(diff / 864e5));
    document.getElementById('cd-hours').textContent   = pad(Math.floor((diff % 864e5) / 36e5));
    document.getElementById('cd-minutes').textContent = pad(Math.floor((diff % 36e5) / 6e4));
    document.getElementById('cd-seconds').textContent = pad(Math.floor((diff % 6e4) / 1e3));
}
tick();
setInterval(tick, 1000);


/* DELIVERY ADDRESS TOGGLE */
const deliverySelect = document.getElementById('delivery');
const addressGroup   = document.getElementById('addressGroup');
const addressInput   = document.getElementById('address');

deliverySelect.addEventListener('change', () => {
    const isPickup = deliverySelect.value === 'Pickup at Event';
    addressGroup.style.display = isPickup ? 'none' : 'block';
    addressInput.required      = !isPickup;
    if (isPickup) addressInput.value = '';
});


/*  FORM SUBMISSION */
const form       = document.getElementById('orderForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg   = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const required = ['fullName','phone','email'];
    if (deliverySelect.value === 'Home Delivery') required.push('address');
    let valid = true;
    required.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) { el.focus(); valid = false; }
    });
    if (!valid) return;

    // UI loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';

    const data = {
        fullName:  document.getElementById('fullName').value.trim(),
        phone:     document.getElementById('phone').value.trim(),
        email:     document.getElementById('email').value.trim(),
        copies:    document.getElementById('copies').value,
        delivery:  deliverySelect.value,
        address:   addressInput.value.trim() || 'Pickup at launch event',
        note:      document.getElementById('note').value.trim() || 'No message',
        timestamp: new Date().toLocaleString('en-GB', {
            timeZone: 'Africa/Lusaka',
            dateStyle: 'full',
            timeStyle: 'short'
        }),
    };

    try {
        await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data);

        // Show success
        document.getElementById('confirmedEmail').textContent = data.email;
        successMsg.style.display = 'block';
        form.reset();
        addressGroup.style.display = 'block';
        addressInput.required      = true;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
        console.error('EmailJS error:', err);
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
});


/* SCROLL REVEAL */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));



   /*FAQ ACCORDION*/

function toggleFaq(btn) {
    const item   = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}