import { Mail,MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-background pt-[130px] pb-24">
      <div className="layout">
        <h1 className="font-primary text-primary text-[50px] md:text-[90px] text-center mb-6">
          Contact Us
        </h1>
        <p className="font-secondary text-text text-center text-[18px] mb-16 max-w-2xl mx-auto">
          Get in touch with us for expert dermatological care.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="bg-alternate p-12 rounded-3xl space-y-8">
            <h3 className="font-primary text-primary text-[32px] mb-8">Clinic Details</h3>
            
            <div className="flex gap-4 items-start">
              <MapPin className="text-primary mt-1" size={24} />
              <div>
                <h4 className="font-primary text-primary text-[20px] mb-2">Location</h4>
                <p className="font-secondary text-text">Chennai, Tamil Nadu, India</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Phone className="text-primary mt-1" size={24} />
              <div>
                <h4 className="font-primary text-primary text-[20px] mb-2">Phone</h4>
                <a href="tel:8055855585" className="font-secondary text-text hover:text-accent transition-colors">8055855585</a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Mail className="text-primary mt-1" size={24} />
              <div>
                <h4 className="font-primary text-primary text-[20px] mb-2">Email</h4>
                <a href="mailto:info@aylaluxedermatology.com" className="font-secondary text-text hover:text-accent transition-colors">info@aylaluxedermatology.com</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-primary p-12 rounded-3xl text-alternate">
            <h3 className="font-primary text-alternate text-[32px] mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div>
                <label className="block font-secondary text-[14px] mb-2">Your Name</label>
                <input type="text" className="w-full bg-alternate/10 border border-alternate/20 rounded-xl px-4 py-3 text-alternate placeholder-alternate/50 focus:outline-none focus:border-accent" placeholder="John Doe" />
              </div>
              <div>
                <label className="block font-secondary text-[14px] mb-2">Your Email</label>
                <input type="email" className="w-full bg-alternate/10 border border-alternate/20 rounded-xl px-4 py-3 text-alternate placeholder-alternate/50 focus:outline-none focus:border-accent" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block font-secondary text-[14px] mb-2">Message</label>
                <textarea rows={4} className="w-full bg-alternate/10 border border-alternate/20 rounded-xl px-4 py-3 text-alternate placeholder-alternate/50 focus:outline-none focus:border-accent" placeholder="How can we help you?"></textarea>
              </div>
              <button className="bg-accent text-secondary px-8 py-4 rounded-full font-secondary font-medium uppercase text-[16px] hover:bg-tertiary transition-colors w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
