export default function FAQPage() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] pt-[130px] pb-24 bg-alternate">
      <div className="layout">
        <h1 className="font-primary text-primary text-[50px] md:text-[90px] text-center mb-16">
          Frequently Asked Questions
        </h1>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            'What is Ayla Luxe Dermatology?',
            'How do I book an appointment?',
            'What treatments do you offer?',
            'Is there parking available?',
          ].map((q, i) => (
            <div key={i} className="bg-background p-8 rounded-2xl">
              <h4 className="font-primary text-primary text-[24px] mb-4">{q}</h4>
              <p className="font-secondary text-text">Detailed answer will be provided here.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
