import React from 'react'

export const metadata = {
  title: 'Privacy Policy | Real Human Education & Charitable Trust',
  description: 'Privacy Policy for Real Human Education & Charitable Trust.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-navy sm:text-4xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p>
            At <strong>Real Human Education & Charitable Trust</strong>, we are committed to protecting the privacy and security of our donors, members, and website visitors. This Privacy Policy outlines how we collect, use, and protect your information.
          </p>

          <h2 className="text-xl font-bold text-navy pt-4">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, address, and payment details when you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Make a donation</li>
            <li>Apply for membership</li>
            <li>Register for events</li>
            <li>Subscribe to our newsletter</li>
          </ul>

          <h2 className="text-xl font-bold text-navy pt-4">2. How We Use Your Information</h2>
          <p>Your information is used for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process your donations and issue 80G tax-exemption receipts.</li>
            <li>To manage your membership and issue ID cards.</li>
            <li>To communicate updates about our projects, events, and campaigns.</li>
            <li>To respond to your inquiries and support requests.</li>
          </ul>

          <h2 className="text-xl font-bold text-navy pt-4">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. Payment transactions are processed securely through certified payment gateways (like Razorpay) and we do not store your credit/debit card information on our servers.
          </p>

          <h2 className="text-xl font-bold text-navy pt-4">4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share necessary information with trusted service providers (e.g., payment processors) solely for the purpose of facilitating your transactions and our operations.
          </p>

          <h2 className="text-xl font-bold text-navy pt-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
            <br /><br />
            <strong>Real Human Education & Charitable Trust</strong><br />
            1st Floor, DK Plaza Complex, New Naherunagar Nagar Main Road,<br />
            Near Ahir Chowk Atika South, Rajkot, Gujarat. 360002<br />
            Email: realhumantrust@gmail.com<br />
            Phone: +918735899909
          </p>
        </div>
      </div>
    </div>
  )
}
