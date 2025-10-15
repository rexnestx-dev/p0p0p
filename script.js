// ===== GLOBAL VARIABLES =====
let currentService = null;
let cart = [];
let chatOpen = false;

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll untuk semua anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip untuk link yang mengarah ke modal atau admin
            if (href === '#admin' || href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu jika terbuka
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
});

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ===== SMOOTH SCROLL =====
function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

function showBookingModal() {
    // Show the booking form directly since we don't have a dedicated booking section
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    if (selectedData.serviceId) {
        showBookingForm();
    } else {
        showNotification('Silakan pilih layanan terlebih dahulu', 'warning');
    }
}

// ===== SERVICE DETAILS DATA =====
const serviceDetails = {
    perawatan1: {
        title: "Perawatan Luka Profesional",
        description: "Pilih jenis perawatan luka yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "luka-diabetes",
                name: "Luka Diabetes",
                description: "Perawatan khusus untuk luka pada penderita diabetes dengan penanganan ekstra hati-hati",
                features: [
                    "Pemeriksaan kadar gula darah",
                    "Debridement luka diabetes",
                    "Perawatan dengan dressing khusus",
                    "Monitoring tanda infeksi",
                    "Edukasi perawatan luka diabetes",
                    "Rujukan ke dokter spesialis jika diperlukan"
                ],
                duration: "45-60 menit",
                price: "Rp 300.000 - 450.000",
                image: "🩺"
            },
            {
                id: "luka-bakar",
                name: "Luka Bakar",
                description: "Penanganan profesional untuk luka bakar derajat 1 dan 2",
                features: [
                    "Assessment tingkat keparahan luka bakar",
                    "Pembersihan dan cooling area luka",
                    "Aplikasi salep khusus luka bakar",
                    "Dressing steril anti lengket",
                    "Manajemen nyeri",
                    "Edukasi perawatan lanjutan di rumah"
                ],
                duration: "30-50 menit",
                price: "Rp 250.000 - 400.000",
                image: "🔥"
            }
        ]
    },
    perawatan2: {
        title: "Perawatan Kecantikan",
        description: "Pilih jenis perawatan kecantikan yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "laser-tato",
                name: "Laser Tato",
                description: "Penghapusan tato dengan teknologi laser modern yang aman dan efektif",
                features: [
                    "Konsultasi pra-perawatan gratis",
                    "Skin test dan patch test",
                    "Sesi laser dengan teknologi Q-switched",
                    "Perawatan pasca laser",
                    "Krim khusus untuk penyembuhan",
                    "Multiple sesi hingga hasil maksimal"
                ],
                duration: "60-90 menit per sesi",
                price: "Rp 500.000 - 1.500.000 per sesi",
                image: "⚡"
            },
            {
                id: "kutil",
                name: "Perawatan Kutil",
                description: "Penanganan medis untuk berbagai jenis kutil dengan hasil optimal",
                features: [
                    "Diagnosis jenis kutil",
                    "Cryotherapy (pembekuan)",
                    "Laser excision jika diperlukan",
                    "Perawatan pasca tindakan",
                    "Obat topical khusus",
                    "Kontrol evaluasi hasil"
                ],
                duration: "30-45 menit",
                price: "Rp 200.000 - 600.000",
                image: "🔍"
            }
        ]
    },
    perawatan3: {
        title: "Layanan Sunat Modern",
        description: "Pilih metode sunat yang sesuai dengan kebutuhan",
        type: "checkbox",
        options: [
            {
                id: "sunat-ring",
                name: "Sunat Ring",
                description: "Teknik sunat modern menggunakan ring dengan proses cepat dan minim rasa sakit",
                features: [
                    "Konsultasi pra-sunat gratis",
                    "Pemeriksaan kesehatan umum",
                    "Sunat dengan metode ring",
                    "Anestesi lokal",
                    "Ring khusus yang aman",
                    "Perawatan pasca sunat",
                    "Kontrol lepas ring (5-7 hari)"
                ],
                duration: "30-45 menit",
                price: "Rp 1.500.000 - 2.500.000",
                image: "💍"
            }
        ]
    },
    perawatan4: {
        title: "Terapi Hipnoterapi",
        description: "Pilih jenis terapi hipnoterapi yang sesuai dengan kebutuhan Anda",
        type: "checkbox",
        options: [
            {
                id: "berhenti-merokok",
                name: "Berhenti Merokok",
                description: "Program hipnoterapi khusus untuk mengatasi kecanduan rokok secara permanen",
                features: [
                    "Konsultasi awal mendalam",
                    "Assessment tingkat kecanduan",
                    "Sesi hipnoterapi khusus anti rokok",
                    "Teknik anchor dan trigger removal",
                    "Audio terapi untuk reinforcement",
                    "Program follow-up 30 hari",
                    "Support system selama proses"
                ],
                duration: "90-120 menit",
                price: "Rp 600.000 - 900.000",
                image: "🚭"
            }
        ]
    }
};

// ===== MODAL MANAGEMENT SYSTEM =====
class ModalManager {
    constructor() {
        this.modals = {};
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('close') ||
                (e.target.classList.contains('modal') && !e.target.closest('.modal-content'))) {
                this.closeAll();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAll();
        });
    }

    registerModal(id, element) {
        this.modals[id] = element;
    }

    openModal(id) {
        this.closeAll();
        if (this.modals[id]) {
            this.modals[id].style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(id) {
        if (this.modals[id]) {
            this.modals[id].style.display = 'none';
        }
    }

    closeAll() {
        Object.values(this.modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
}

const modalManager = new ModalManager();

// ===== SERVICE DETAIL MODAL FUNCTIONS =====
function showServiceDetail(serviceId) {
    const service = serviceDetails[serviceId];
    if (!service) return;

    let content = '';

    if (service.type === "checkbox") {
        const optionsHTML = service.options.map(option => `
            <div class="option-card">
                <div class="option-header">
                    <div class="option-checkbox">
                        <input type="checkbox" id="${option.id}" name="service-option" value="${option.id}">
                    </div>
                    <div class="option-icon">${option.image}</div>
                    <div class="option-title">
                        <h3>${option.name}</h3>
                        <p class="option-description">${option.description}</p>
                    </div>
                </div>
                
                <div class="option-details">
                    <div class="option-features">
                        <h4>Fitur Perawatan:</h4>
                        <ul>
                            ${option.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="option-meta">
                        <div class="option-price">
                            <strong>Harga:</strong> ${option.price}
                        </div>
                        <div class="option-duration">
                            <strong>Durasi:</strong> ${option.duration}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        content = `
            <div class="service-modal-header">
                <h2>${service.title}</h2>
                <p class="service-description">${service.description}</p>
                <p class="selection-info">✓ Pilih satu atau beberapa perawatan</p>
            </div>
            
            <div class="options-container">
                ${optionsHTML}
            </div>
            
            <div class="selection-summary" id="selectionSummary" style="display: none;">
                <h4>Perawatan yang Dipilih:</h4>
                <div id="selectedOptionsList"></div>
                <div class="total-price">
                    <strong>Total Estimasi: <span id="totalPrice">Rp 0</span></strong>
                </div>
            </div>
            
            <div class="service-modal-footer">
                <button class="cta-button secondary" onclick="modalManager.closeAll()">
                    Kembali
                </button>
                <button class="cta-button" id="bookingBtn" onclick="proceedToBooking('${serviceId}')" disabled>
                    📅 Lanjut ke Booking
                </button>
            </div>
        `;

    } else {
        content = `
            <div class="service-modal-header">
                <h2>${service.title}</h2>
                <p class="service-description">${service.description}</p>
            </div>
            <div class="service-modal-footer">
                <button class="cta-button secondary" onclick="modalManager.closeAll()">
                    Tutup
                </button>
            </div>
        `;
    }

    document.getElementById('serviceModalContent').innerHTML = content;
    modalManager.openModal('serviceModal');

    if (service.type === "checkbox") {
        attachCheckboxListeners(serviceId);
    }
}

function attachCheckboxListeners(serviceId) {
    const checkboxes = document.querySelectorAll('input[name="service-option"]');
    const bookingBtn = document.getElementById('bookingBtn');
    const selectionSummary = document.getElementById('selectionSummary');
    const selectedOptionsList = document.getElementById('selectedOptionsList');
    const totalPriceElement = document.getElementById('totalPrice');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectionSummary(serviceId);
        });
    });

    function updateSelectionSummary(serviceId) {
        const service = serviceDetails[serviceId];
        const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
        
        bookingBtn.disabled = selectedCheckboxes.length === 0;
        
        if (selectedCheckboxes.length > 0) {
            selectionSummary.style.display = 'block';
            
            let optionsHTML = '';
            let totalPrice = 0;
            
            selectedCheckboxes.forEach(checkbox => {
                const option = service.options.find(opt => opt.id === checkbox.value);
                if (option) {
                    optionsHTML += `
                        <div class="selected-option">
                            <span class="option-name">${option.name}</span>
                            <span class="option-price">${option.price}</span>
                        </div>
                    `;
                    
                    const priceRange = option.price.match(/(\d+\.?\d*)/g);
                    if (priceRange && priceRange.length > 0) {
                        const minPrice = parseInt(priceRange[0].replace('.', ''));
                        const maxPrice = priceRange[1] ? parseInt(priceRange[1].replace('.', '')) : minPrice;
                        const avgPrice = (minPrice + maxPrice) / 2;
                        totalPrice += avgPrice;
                    }
                }
            });
            
            selectedOptionsList.innerHTML = optionsHTML;
            totalPriceElement.textContent = `Rp ${Math.round(totalPrice).toLocaleString('id-ID')}`;
            
        } else {
            selectionSummary.style.display = 'none';
        }
    }
}

function proceedToBooking(serviceId) {
    const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
    const selectedOptions = [];
    
    selectedCheckboxes.forEach(checkbox => {
        const option = serviceDetails[serviceId].options.find(opt => opt.id === checkbox.value);
        if (option) {
            selectedOptions.push({
                id: option.id,
                name: option.name,
                price: option.price,
                duration: option.duration
            });
        }
    });
    
    localStorage.setItem('selectedService', JSON.stringify({
        serviceId: serviceId,
        serviceName: serviceDetails[serviceId].title,
        selectedOptions: selectedOptions,
        type: 'checkbox'
    }));
    
    showBookingForm();
}

// ===== BOOKING FORM FUNCTIONS =====
function showBookingForm() {
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    
    const timeOptions = generateTimeOptions();
    const today = new Date().toISOString().split('T')[0];
    
    const content = `
        <div class="booking-form-modal">
            <div class="booking-header">
                <h2>Formulir Booking Perawatan</h2>
                <p class="form-description">Lengkapi data diri Anda untuk melanjutkan booking</p>
            </div>
            
            <div class="selected-services-summary">
                <h4>Layanan yang Dipilih:</h4>
                ${selectedData.selectedOptions ? selectedData.selectedOptions.map(option => `
                    <div class="service-summary-item">
                        <span class="service-name">${option.name}</span>
                        <span class="service-price">${option.price}</span>
                    </div>
                `).join('') : '<p>Tidak ada layanan yang dipilih</p>'}
            </div>
            
            <form id="patientBookingForm" class="booking-form">
                <div class="form-section">
                    <h4>Data Diri Pasien</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="patientName">Nama Lengkap *</label>
                            <input type="text" id="patientName" name="patientName" required 
                                   placeholder="Masukkan nama lengkap">
                        </div>
                        <div class="form-group">
                            <label for="patientPhone">Nomor Telepon *</label>
                            <input type="tel" id="patientPhone" name="patientPhone" required 
                                   placeholder="Contoh: 081234567890">
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="patientAddress">Alamat Lengkap *</label>
                        <textarea id="patientAddress" name="patientAddress" rows="3" required 
                                  placeholder="Masukkan alamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota)"></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>Jadwal Perawatan</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="appointmentDate">Tanggal Perawatan *</label>
                            <input type="date" id="appointmentDate" name="appointmentDate" 
                                   min="${today}" required>
                            <small class="date-note">Pilih tanggal mulai hari ini</small>
                        </div>
                        <div class="form-group">
                            <label for="appointmentTime">Jam Perawatan *</label>
                            <select id="appointmentTime" name="appointmentTime" required>
                                <option value="">Pilih Jam</option>
                                ${timeOptions}
                            </select>
                            <small class="time-note">Jam praktik: 08:00 - 17:00</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>Informasi Tambahan</h4>
                    <div class="form-group full-width">
                        <label for="patientNotes">Catatan Tambahan (opsional)</label>
                        <textarea id="patientNotes" name="patientNotes" rows="3" 
                                  placeholder="Keluhan khusus, alergi, riwayat penyakit, atau informasi lain yang perlu kami ketahui..."></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cta-button secondary" onclick="goBackToServiceSelection()">
                        ← Kembali ke Pilihan Layanan
                    </button>
                    <button type="submit" class="cta-button">
                        📅 Konfirmasi Booking
                    </button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('serviceModalContent').innerHTML = content;
    modalManager.openModal('serviceModal');

    setDefaultAppointmentDate();
    setupFormValidation();
    
    document.getElementById('patientBookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitBookingForm();
    });
}

function generateTimeOptions() {
    let options = '';
    for (let hour = 8; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        options += `<option value="${time}">${time}</option>`;
    }
    return options;
}

function setDefaultAppointmentDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = tomorrowFormatted;
    }
}

function setupFormValidation() {
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length < 10 || this.value.length > 13) {
                this.setCustomValidity('Nomor telepon harus 10-13 digit');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.setCustomValidity('Tidak bisa memilih tanggal yang sudah lewat');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

function goBackToServiceSelection() {
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    if (selectedData.serviceId) {
        showServiceDetail(selectedData.serviceId);
    } else {
        modalManager.closeAll();
    }
}

function submitBookingForm() {
    const formData = new FormData(document.getElementById('patientBookingForm'));
    const selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    
    if (!validateBookingForm(formData)) {
        return;
    }
    
    const bookingData = {
        bookingId: 'BK' + Date.now(),
        patientInfo: {
            name: formData.get('patientName'),
            phone: formData.get('patientPhone'),
            address: formData.get('patientAddress'),
            notes: formData.get('patientNotes') || 'Tidak ada catatan'
        },
        appointmentInfo: {
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            datetime: new Date(formData.get('appointmentDate') + 'T' + formData.get('appointmentTime'))
        },
        serviceInfo: selectedData,
        status: 'pending',
        bookingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    if (saveBookingToStorage(bookingData)) {
        showBookingConfirmation(bookingData);
        localStorage.removeItem('selectedService');
    }
}

function validateBookingForm(formData) {
    const name = formData.get('patientName');
    const phone = formData.get('patientPhone');
    const address = formData.get('patientAddress');
    const date = formData.get('appointmentDate');
    const time = formData.get('appointmentTime');
    
    if (!name || !phone || !address || !date || !time) {
        showNotification('Harap lengkapi semua field yang wajib diisi', 'error');
        return false;
    }
    
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
        showNotification('Harap masukkan nama lengkap (minimal 2 kata)', 'error');
        return false;
    }
    
    if (phone.length < 10 || phone.length > 13) {
        showNotification('Nomor telepon harus 10-13 digit', 'error');
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Tidak bisa memilih tanggal yang sudah lewat', 'error');
        return false;
    }
    
    return true;
}

function saveBookingToStorage(bookingData) {
    try {
        const existingBookings = JSON.parse(localStorage.getItem('clinicBookings') || '[]');
        
        const isDuplicate = existingBookings.some(booking => 
            booking.patientInfo.phone === bookingData.patientInfo.phone &&
            booking.serviceInfo.serviceId === bookingData.serviceInfo.serviceId &&
            booking.appointmentInfo.date === bookingData.appointmentInfo.date
        );
        
        if (isDuplicate) {
            showNotification('Anda sudah memiliki booking untuk layanan ini di tanggal yang sama', 'warning');
            return false;
        }
        
        existingBookings.push(bookingData);
        localStorage.setItem('clinicBookings', JSON.stringify(existingBookings));
        
        return true;
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('Terjadi error saat menyimpan booking', 'error');
        return false;
    }
}

function showBookingConfirmation(bookingData) {
    const appointmentDate = new Date(bookingData.appointmentInfo.datetime);
    const formattedDate = appointmentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const content = `
        <div class="confirmation-modal">
            <div class="confirmation-icon">✅</div>
            <h2>Booking Berhasil!</h2>
            
            <div class="confirmation-details">
                <div class="detail-item">
                    <strong>Nomor Booking:</strong>
                    <span>${bookingData.bookingId}</span>
                </div>
                <div class="detail-item">
                    <strong>Nama Pasien:</strong>
                    <span>${bookingData.patientInfo.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Layanan:</strong>
                    <span>${bookingData.serviceInfo.serviceName}</span>
                </div>
                <div class="detail-item">
                    <strong>Tanggal & Jam:</strong>
                    <span>${formattedDate}, ${bookingData.appointmentInfo.time}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-pending">Menunggu Konfirmasi</span>
                </div>
            </div>
            
            <div class="confirmation-message">
                <p>📞 Kami akan menghubungi Anda di <strong>${bookingData.patientInfo.phone}</strong> 
                   dalam 1x24 jam untuk konfirmasi jadwal.</p>
                <p>📍 Pastikan Anda datang 15 menit sebelum jadwal perawatan.</p>
            </div>
            
            <div class="confirmation-actions">
                <button class="cta-button secondary" onclick="printBookingDetails('${bookingData.bookingId}')">
                    🖨️ Cetak Detail
                </button>
                <button class="cta-button" onclick="modalManager.closeAll()">
                    Tutup
                </button>
            </div>
        </div>
    `;

    document.getElementById('serviceModalContent').innerHTML = content;
}

function printBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('clinicBookings') || '[]');
    const booking = bookings.find(b => b.bookingId === bookingId);
    
    if (booking) {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>Booking Confirmation - ${booking.bookingId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .details { margin: 20px 0; }
                        .detail-item { margin: 10px 0; }
                        .footer { margin-top: 30px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Klinik Sehat</h1>
                        <h2>Konfirmasi Booking</h2>
                    </div>
                    <div class="details">
                        <div class="detail-item"><strong>Nomor Booking:</strong> ${booking.bookingId}</div>
                        <div class="detail-item"><strong>Nama Pasien:</strong> ${booking.patientInfo.name}</div>
                        <div class="detail-item"><strong>Telepon:</strong> ${booking.patientInfo.phone}</div>
                        <div class="detail-item"><strong>Layanan:</strong> ${booking.serviceInfo.serviceName}</div>
                        <div class="detail-item"><strong>Tanggal:</strong> ${booking.appointmentInfo.date}</div>
                        <div class="detail-item"><strong>Jam:</strong> ${booking.appointmentInfo.time}</div>
                    </div>
                    <div class="footer">
                        <p>Harap datang 15 menit sebelum jadwal perawatan</p>
                        <p>Terima kasih atas kepercayaan Anda kepada Klinik Sehat</p>
                    </div>
                </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        if (type === 'error') {
            notification.style.borderLeftColor = '#ff6b6b';
        } else if (type === 'success') {
            notification.style.borderLeftColor = '#4CAF50';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = '#ff9800';
        } else {
            notification.style.borderLeftColor = '#2c7873';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ===== CART SYSTEM =====
function addToCart(productId) {
    const products = {
        'serum-vitamin-c': { name: 'Serum Vitamin C', price: 250000 },
        'facial-cleanser': { name: 'Facial Cleanser', price: 120000 },
        'moisturizing-cream': { name: 'Moisturizing Cream', price: 180000 }
    };
    
    const product = products[productId];
    if (product) {
        cart.push(product);
        updateCart();
        showNotification(`🛒 ${product.name} ditambahkan ke keranjang!`, 'success');
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>Rp ${item.price.toLocaleString()}</span>
                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });
        
        cartTotal.textContent = total.toLocaleString();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function showCart() {
    updateCart();
    modalManager.openModal('cartModal');
}

function closeCart() {
    modalManager.closeModal('cartModal');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('🛒 Keranjang kosong!', 'error');
        return;
    }
    
    showNotification('🚀 Checkout berhasil! Terima kasih atas pembelian Anda.', 'success');
    cart = [];
    closeCart();
}

// ===== ADMIN SYSTEM =====
function showAdminLogin() {
    modalManager.openModal('adminLoginModal');
}

function closeAdminLogin() {
    modalManager.closeModal('adminLoginModal');
}

document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'admin' && password === 'admin123') {
        closeAdminLogin();
        showAdminDashboard();
        showNotification('🔑 Login admin berhasil!', 'success');
    } else {
        showNotification('❌ Username atau password salah!', 'error');
    }
});

function showAdminDashboard() {
    const bookings = JSON.parse(localStorage.getItem('clinicBookings') || '[]');
    
    const bookingsTable = document.getElementById('bookingsTable');
    if (bookingsTable) {
        if (bookings.length === 0) {
            bookingsTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">Tidak ada data booking</td>
                </tr>
            `;
        } else {
            bookingsTable.innerHTML = bookings.map(booking => `
                <tr>
                    <td>${booking.patientInfo.name}</td>
                    <td>${booking.serviceInfo.serviceName}</td>
                    <td>${booking.appointmentInfo.date}</td>
                    <td>${booking.appointmentInfo.time}</td>
                    <td>${booking.status}</td>
                    <td>
                        <button class="action-btn" onclick="editBooking('${booking.bookingId}')">✏️</button>
                        <button class="action-btn" onclick="deleteBooking('${booking.bookingId}')">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    modalManager.openModal('adminDashboard');
}

function closeAdminDashboard() {
    modalManager.closeModal('adminDashboard');
}

function openAdminTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

function editBooking(bookingId) {
    showNotification(`✏️ Mengedit booking: ${bookingId}`, 'info');
}

function deleteBooking(bookingId) {
    if (confirm(`Apakah Anda yakin ingin menghapus booking ${bookingId}?`)) {
        const bookings = JSON.parse(localStorage.getItem('clinicBookings') || '[]');
        const updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId);
        localStorage.setItem('clinicBookings', JSON.stringify(updatedBookings));
        showNotification(`🗑️ Booking ${bookingId} telah dihapus`, 'success');
        showAdminDashboard(); // Refresh the table
    }
}

// ===== CHAT WIDGET =====
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    chatOpen = !chatOpen;
    
    if (chatBox) {
        if (chatOpen) {
            chatBox.classList.add('show');
        } else {
            chatBox.classList.remove('show');
        }
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatMessage');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && chatInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.textContent = chatInput.value;
        chatMessages.appendChild(userMessage);
        
        chatInput.value = '';
        
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.textContent = 'Terima kasih atas pesan Anda! Tim kami akan membalas segera. Untuk pertanyaan mendesak, silakan hubungi 0812-3456-7890.';
            chatMessages.appendChild(botMessage);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

document.getElementById('chatMessage')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// ===== GALLERY SYSTEM =====
function openGallery(imageId) {
    showNotification(`🖼️ Membuka galeri: ${imageId}`, 'info');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Register modals
    const modals = {
        'serviceModal': document.getElementById('serviceModal'),
        'adminLoginModal': document.getElementById('adminLoginModal'),
        'adminDashboard': document.getElementById('adminDashboard'),
        'cartModal': document.getElementById('cartModal')
    };
    
    Object.entries(modals).forEach(([id, element]) => {
        if (element) {
            modalManager.registerModal(id, element);
        }
    });
    
    // Initialize cart
    updateCart();
    
    console.log('Klinik Sehat Website initialized successfully!');
});