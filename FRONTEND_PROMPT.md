# 🏗️ Real Human Education & Charitable Trust — NGO Website Frontend Prompt

## PROJECT OVERVIEW
Build a complete NGO Management System frontend for "Real Human Education & Charitable Trust" — a Gujarat-based NGO.

Reference design: https://sanataningo.org (match this style closely)
Color Theme: Saffron #ff9933, Navy #050a30, Green #138808 (Indian flag colors)
Fonts: Outfit + Playfair Display (Google Fonts)

---

## BACKEND API (Already Built)
Base URL: https://real-human-trust.onrender.com/api/v1
Auth: JWT Bearer Token in Authorization header
Content-Type: application/json (or multipart/form-data for file uploads)

---

## ALL API ENDPOINTS

### AUTH
POST   /auth/register          → Register new user (fullName, email, mobile, password, gender, dob, state, district, address, userType, profileImage)
POST   /auth/login             → Member login (emailOrMobile, password)
POST   /auth/admin-login       → Admin/Staff login (emailOrMobile, password)
GET    /auth/logout            → Logout
GET    /auth/me                → Get current logged-in user (requires token)
POST   /auth/setup-admin       → First-time Super Admin setup

### MEMBERS (NGO Membership)
POST   /members/apply          → Apply for membership (bloodGroup, occupation, membershipType, referredBy, profileImage file, idProof file) — requires login
GET    /members/me             → My membership profile — requires login
GET    /members                → All members list — Admin/Manager/Coordinator only
PUT    /members/:id/approve    → Approve member + generate QR code — Admin/Manager only
PUT    /members/:id/reject     → Reject membership — Admin/Manager only

### DONATIONS
POST   /donations/manual       → Manual/offline donation (fullName, email, phone, amount, paymentMethod: upi/bank/cash, transactionId, purpose, paymentProof image) — NO login needed
POST   /donations/create-order → Create Razorpay order (amount, currency) — login optional
POST   /donations/verify       → Verify Razorpay payment (razorpay_payment_id, razorpay_order_id, razorpay_signature, donorInfo) — login optional
GET    /donations/me           → My donation history — requires login
GET    /donations              → All donations — Admin/Manager only
PUT    /donations/:id/verify   → Admin verify manual donation (status: verified/rejected) — Admin only

### EVENTS
GET    /events                 → All events (public)
GET    /events/:id             → Single event (public)
POST   /events                 → Create event — Admin only (title, description, location, eventDate, registrationLastDate, maxParticipants, image file)
PUT    /events/:id             → Update event — Admin only
DELETE /events/:id             → Delete event — Admin only

### EVENT REGISTRATION
POST   /event-registration     → Register for event (eventId) — requires login
GET    /event-registration/me  → My registrations — requires login
GET    /event-registration/event/:eventId → All registrations for an event — Admin only

### NEWS / BLOG
GET    /news                   → All news (public)
GET    /news/:id               → Single news (public)
POST   /news                   → Create news — Admin only (title, content, category, type: news/press_release, image file)
PUT    /news/:id               → Update — Admin only
DELETE /news/:id               → Delete — Admin only

### GALLERY
GET    /gallery                → All gallery items (public) — ?type=photo or ?type=video
GET    /gallery/:id            → Single item (public)
POST   /gallery                → Add gallery item — Admin only (title, description, type: photo/video, image file or videoUrl)
PUT    /gallery/:id            → Update — Admin only
DELETE /gallery/:id            → Delete — Admin only

### PROJECTS
GET    /projects               → All projects (public)
GET    /projects/:id           → Single project (public)
POST   /projects               → Create — Admin only
PUT    /projects/:id           → Update — Admin only
DELETE /projects/:id           → Delete — Admin only

### CROWDFUNDING
GET    /crowdfunding           → All campaigns (public)
GET    /crowdfunding/:id       → Single campaign (public)
POST   /crowdfunding           → Create campaign — Admin only (title, description, targetAmount, endDate, category, image file)
PUT    /crowdfunding/:id       → Update — Admin only
DELETE /crowdfunding/:id       → Delete — Admin only

### REPORTS (Annual/Audit)
GET    /reports                → All reports (public) — ?type=annual or ?type=audit
GET    /reports/:id            → Single report (public)
POST   /reports                → Upload report — Admin only (title, type: annual/audit/activity/financial, year, pdf file)
DELETE /reports/:id            → Delete — Admin only

### TESTIMONIALS
GET    /testimonials           → All testimonials (public)
POST   /testimonials           → Submit testimonial (name, message, rating 1-5) — NO login needed
DELETE /testimonials/:id       → Delete — Admin only

### CONTACT / ENQUIRY
POST   /contact                → Submit enquiry (name, email, phone, subject, message) — NO login needed
GET    /contact                → All enquiries — Admin/Manager only
GET    /contact/:id            → Single enquiry — Admin only

### VOLUNTEERS
POST   /volunteers             → Apply as volunteer (fullName, email, phone, skills, availability, message) — NO login needed
GET    /volunteers             → All volunteers — Admin/Manager only
PUT    /volunteers/:id/status  → Update volunteer status — Admin only

### COMPLAINTS / SUPPORT
POST   /complaints             → Submit complaint (subject, description, category) — requires login
GET    /complaints/me          → My complaints — requires login
GET    /complaints             → All complaints — Admin/Manager only
PUT    /complaints/:id/status  → Update status — Admin only

### CERTIFICATES
GET    /certificates/me        → My certificates — requires login
GET    /certificates           → All certificates — Admin only
POST   /certificates           → Issue certificate — Admin only

### APPOINTMENT LETTERS
GET    /appointments/me        → My appointment letters — requires login
GET    /appointments           → All letters — Admin only
POST   /appointments           → Issue letter — Admin only

### TEAM (Management Team Page)
GET    /team                   → All team members (public)
POST   /team                   → Add team member — Admin only (name, designation, description, email, phone, socialLinks JSON, order, photo file)
PUT    /team/:id               → Update — Admin only
DELETE /team/:id               → Delete — Admin only

### AWARDS
GET    /awards                 → All awards (public)
POST   /awards                 → Add award — Admin only (title, description, awardedBy, year, image file)
PUT    /awards/:id             → Update — Admin only
DELETE /awards/:id             → Delete — Admin only

### DOWNLOADS
GET    /downloads              → All downloads (public) — ?category=form/brochure/document
POST   /downloads              → Upload — Admin only (title, description, category, file)
PUT    /downloads/:id          → Update — Admin only
DELETE /downloads/:id          → Delete — Admin only

### SITE CONTENT (Admin-editable static pages)
GET    /site-content           → All content (public)
GET    /site-content/:key      → By key (public) — keys: founder_message, vision_mission, objectives, about_us, bank_details
POST   /site-content           → Create/Update content — Admin only (key, title, content, content_hi, content_gu, image file)

### NEWSLETTER
POST   /newsletter/subscribe   → Subscribe (email, name) — NO login needed
GET    /newsletter             → All subscribers — Admin only
DELETE /newsletter/:id         → Remove subscriber — Admin only

### DASHBOARD (Admin Analytics)
GET    /dashboard/stats        → Full dashboard stats — Admin/Manager only
Response includes:
  - overview: members{total, approved}, projects{total, active}, events{total, upcoming}, donations{totalAmount, count}
  - actionableAlerts: pendingMembers{count, list}, pendingDonations{count, list}, openComplaints{count, list}, pendingVolunteers{count, list}
  - crowdfunding: active campaigns
  - monthlyTrends: last 6 months donation data (for chart)

### BACKUP
GET    /admin/backup           → Full DB export JSON — Super Admin only

---

## ROLES & PERMISSIONS

| Role | Access |
|------|--------|
| super_admin | Everything including backup, user management |
| admin | All content management, member approve, donation verify |
| manager | View reports, verify members, manage events |
| coordinator | Add members, referral management |
| member | Profile, ID card, certificates, donations, complaints |
| public | Read-only: events, news, gallery, projects, donate |

---

## ORGANIZATION DETAILS
Name: Real Human Education & Charitable Trust
Address: 1st Floor, DK Plaza Complex, New Naherunagar Nagar Main Road, Near Ahir Chowk Atika South, Rajkot, Gujarat 360002
Phone: +918735899909, 8511331111
WhatsApp: +918735899909
Email: realhumantrust@gmail.com
Website: realhumantrust.org
Google Maps: https://maps.app.goo.gl/krNGmBPzbFAsZeSj7

---

## PAGES NEEDED

### Public Website:
1. Home - Hero, Stats, Events, Crowdfunding, Gallery, Testimonials, Newsletter
2. About Us - Story, Vision & Mission
3. Founder's Message
4. Vision & Mission
5. Objectives
6. Our Projects
7. Membership - Apply form
8. Donate Now - UPI/Bank + Razorpay
9. Volunteer - Apply form
10. Events - List + Register
11. News & Media
12. Photo Gallery
13. Video Gallery
14. Awards & Certificates
15. Crowdfunding
16. Annual Reports
17. Audit Reports
18. Downloads
19. Management Team
20. Contact Us
21. Testimonials
22. Member Login
23. Admin Login
24. Sign Up

### Admin Dashboard:
- Dashboard (stats + charts)
- Members Management
- Donations Management
- Events Management
- Gallery Management
- News Management
- Projects Management
- Crowdfunding Management
- Reports Management
- Downloads Management
- Team Management
- Awards Management
- Volunteers List
- Complaints List
- Contact Enquiries
- Certificates
- Appointment Letters
- Site Content Editor
- Newsletter Subscribers
- Database Backup

### Member Panel:
- My Profile
- Download QR ID Card
- Appointment Letter
- Certificates
- Donation History
- Event Registration
- Submit Complaint

---

## PAYMENT (Razorpay)
Key: rzp_test_xxxx (get from .env)
Flow:
1. POST /donations/create-order → get orderId
2. Open Razorpay checkout
3. On success: POST /donations/verify → backend verifies + sends email receipt

---

## LANGUAGES
Primary: English
Also support: Hindi, Gujarati (using Google Translate widget)

---

## DESIGN REQUIREMENTS
- Reference: https://sanataningo.org
- Glassmorphism cards
- Smooth animations
- Fully mobile responsive
- Premium NGO feel
- Indian flag color theme: Saffron + White + Green
- Font: Outfit (body) + Playfair Display (headings)
