import { useState } from 'react';


import heroImage from '../../assets/images/hero-home.png';
import f1 from '../../assets/images/f1.png'
import f2 from '../../assets/images/f2.png'
import f3 from '../../assets/images/f3.png'
import serviceImage from '../../assets/images/service-img.png'
import assessmentMatterImage from '../../assets/images/asses-m.png'
import soukya from '../../assets/images/soukya.png'



function HomePage() {

  const assessments = [
    { img: f1 },
    { img: f2 },
    { img: f3 },
    { img: f2 },
    { img: f3 },
    { img: f1 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: 'Question text goes here',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.',
    },
    { question: 'Question text goes here', answer: '' },
    { question: 'Question text goes here', answer: '' },
    { question: 'Question text goes here', answer: '' },
    { question: 'Question text goes here', answer: '' },
  ];

  return (
    <>
      <section className="bg-mh-light py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              {/* Pills */}
              <div className="flex gap-3 mb-6">
                <span className="px-4 py-1 rounded-full text-sm bg-[#FBEBDC] ">
                  Reassurance
                </span>
                <span className="px-4 py-1 rounded-full text-sm  bg-[#D5DCEE]">
                  Privacy
                </span>
                <span className="px-4 py-1 rounded-full text-sm  bg-[#DFF7EA]">
                  Confidentiality
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl lg:text-5xl font-medium leading-tight text-mh-dark mb-6">
                Understand Your <br />
                <span className="inline-block bg-[#C5E9DB] px-3 py-1 rounded-xl">
                  Mental Health
                </span>
                <br />
                with Science-Backed <br />
                Assessments
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8">
                Take clinically aligned mental health assessments and receive a clear,
                private report you can confidently share with a professional.
              </p>

              {/* Button */}
              <button className="px-8 py-3 rounded-full bg-mh-gradient text-mh-white font-semibold hover:opacity-90 transition">
                Explore Assessments
              </button>
            </div>


            {/* RIGHT IMAGE CARD */}
            <div className="relative flex justify-center">

              {/* Image container */}
              <div className="relative rounded-[32px] overflow-hidden ">
                <img
                  src={heroImage}
                  alt="Mental health wellbeing"
                  className="w-[600px] h-[520px] object-cover"
                />
              </div>



            </div>
          </div>
        </div>
      </section>

      {/* Featured Assessments Section */}

      <section className="bg-mh-light py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark mb-4">
              Featured Assessments
            </h2>
            <p className="text-gray-600  mx-auto">
              Take clinically aligned mental health assessments and receive a clear, <br></br>
              private report you can confidently share with a professional.
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-10">

            {/* Card 1 */}
            <div className="bg-[#FBEBDC] rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left */}
              <div>
                <h3 className="text-2xl font-semibold mb-3">
                  Anxiety Assessment
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  A quick screening that helps identify symptoms of excessive worry,
                  tension, and emotional overwhelm.
                </p>

                <div className="flex gap-10 mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="font-medium text-gray-700">20 questions</p>
                  </div>
                </div>

                <button className="px-6 py-2 rounded-full bg-mh-gradient text-mh-white text-sm">
                  View Details
                </button>
              </div>

              {/* Right */}
              <div className="relative">
                <span className="absolute top-4 left-4 bg-mh-white text-xs px-3 py-1 rounded-full shadow">
                  Research-Based
                </span>
                <img
                  src={f1}
                  alt="Anxiety assessment"
                  className="rounded-2xl w-full h-[300px] object-cover"
                />
              </div>

            </div>

            {/* Card 2 */}
            <div className="bg-[#D5DCEE] rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              <div>
                <h3 className="text-2xl font-semibold mb-3">
                  Depression Screening
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Evaluates mood patterns, motivation levels, and emotional well-being
                  to detect signs of low mood or persistent sadness.
                </p>

                <div className="flex gap-10 mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="font-medium text-gray-700">20 questions</p>
                  </div>
                </div>

                <button className="px-6 py-2 rounded-full bg-mh-gradient text-mh-white text-sm ">
                  View Details
                </button>
              </div>

              <div className="relative">
                <span className="absolute top-4 left-4 bg-mh-white text-xs px-3 py-1 rounded-full shadow">
                  Research-Based
                </span>
                <img
                  src={f2}
                  alt="Depression screening"
                  className="rounded-2xl w-full h-[300px] object-cover"
                />
              </div>

            </div>

            {/* Card 3 */}
            <div className="bg-[#F7E3EE] rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              <div>
                <h3 className="text-2xl font-semibold mb-3">
                  ADHD / Attention Difficulty Screening
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Assesses focus, impulsivity, and attention-related challenges
                  to support early understanding of ADHD-like symptoms.
                </p>

                <div className="flex gap-10 mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="font-medium text-gray-700">20 questions</p>
                  </div>
                </div>

                <button className="px-6 py-2 rounded-full bg-mh-gradient text-mh-white text-sm">
                  View Details
                </button>
              </div>

              <div className="relative">
                <span className="absolute top-4 left-4 bg-mh-white text-xs px-3 py-1 rounded-full shadow">
                  Research-Based
                </span>
                <img
                  src={f3}
                  alt="ADHD screening"
                  className="rounded-2xl w-full h-[300px] object-cover"
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Our Service Section  */}


      <section className="bg-mh-light py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark mb-12">
            Our Services
          </h2>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT LARGE CARD */}
            <div className="lg:col-span-2 bg-mh-white rounded-3xl shadow-sm overflow-hidden">
              <img
                src={serviceImage}
                alt="Psychologist support"
                className="w-full h-[320px] object-cover"
              />

              <div className="p-8">
                <h3 className="text-xl font-semibold mb-3">
                  Psychologist & Psychiatrist Network
                </h3>

                <p className="text-gray-600 mb-6 max-w-xl">
                  Connect with trusted mental-health experts for guidance,
                  diagnosis, therapy, and long-term support tailored to your needs.
                </p>

                <button className="px-6 py-2 rounded-full border border-mh-green text-mh-green text-sm font-semibold hover:bg-mh-green hover:text-mh-white transition">
                  View Details
                </button>
              </div>
            </div>

            {/* RIGHT STACKED CARDS */}
            <div className="space-y-8">

              {/* Card 1 */}
              <div className="bg-mh-white rounded-3xl shadow-sm p-8">
                <h4 className="text-lg font-semibold mb-3">
                  Meditation & Wellness Retreats
                </h4>

                <p className="text-gray-600 mb-6 text-sm">
                  Experience guided meditation, mindfulness workshops,
                  and rejuvenating retreats designed to help you reset,
                  relax, and restore balance.
                </p>

                <button className="px-5 py-2 rounded-full border border-mh-green text-mh-green text-sm font-semibold hover:bg-mh-green hover:text-mh-white transition">
                  View Details
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-mh-white rounded-3xl shadow-sm p-8">
                <h4 className="text-lg font-semibold mb-3">
                  Age-Focused Wellness Camps
                </h4>

                <p className="text-gray-600 mb-6 text-sm">
                  Programs for teens, young adults, and seniors, addressing
                  unique mental health challenges through curated activities
                  and expert-led sessions.
                </p>

                <button className="px-5 py-2 rounded-full border border-mh-green text-mh-green text-sm font-semibold hover:bg-mh-green hover:text-mh-white transition">
                  View Details
                </button>
              </div>

            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-14">
            <button className="px-10 py-3 rounded-full bg-mh-gradient text-mh-white font-semibold hover:opacity-90 transition">
              Explore More
            </button>
          </div>

        </div>
      </section>

      {/* Our Assessments Section   */}


      <section className="bg-mh-light py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark mb-12">
            Our Assessment
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessments.map((item, index) => (
              <div
                key={index}
                className="bg-mh-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.img}
                    alt="Assessment"
                    className="w-full h-[200px] object-cover"
                  />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-mh-white text-xs px-3 py-1 rounded-full shadow">
                    Research-Based
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-mh-dark mb-2">
                    Anxiety Assessment
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    A quick screening that helps identify symptoms of excessive
                    worry, tension, and emotional overwhelm.
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-mh-green font-semibold">
                      ⭐ 4.9
                    </span>
                    <span className="text-gray-500">190 Reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-14">
            <button className="px-10 py-3 rounded-full bg-mh-gradient text-mh-white font-semibold hover:opacity-90 transition">
              View All Assessment
            </button>
          </div>

        </div>
      </section>

      {/* Assessments Matter Section  */}


      <section className="bg-mh-light py-28">
        <div className="max-w-7xl mx-auto px-6">

          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-mh-dark mb-20">
            Why These <br /> Assessments Matter
          </h2>

          {/* Layout */}
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

            {/* LEFT COLUMN */}
            <div className="space-y-10">
              <div className="relative bg-[#D3D9F4] rounded-3xl p-8 min-h-[160px]">
                <div className="w-6 h-6 bg-mh-white rounded-md mb-6"></div>
                <p className="font-medium">
                  Used by mental health <br></br> professionals
                </p>
              </div>

              <div className="relative bg-[#B4EACF] rounded-3xl p-8 min-h-[160px]">
                <div className="w-6 h-6 bg-mh-white rounded-md mb-6"></div>
                <p className="font-medium">
                  Backed by standardized <br></br> psychological models
                </p>
              </div>
            </div>

            {/* CENTER IMAGE */}
            <div className="flex justify-center">
              <img
                src={assessmentMatterImage}
                alt="Assessment importance"
                className="rounded-3xl w-[460px] h-[400px] object-cover"
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              <div className="relative bg-[#F9DAEB] rounded-3xl p-8 min-h-[160px]">
                <div className="w-6 h-6 bg-mh-white rounded-md mb-6"></div>
                <p className="font-medium">
                  Safe, confidential, private
                </p>
              </div>

              <div className="relative bg-[#D4E8EF] rounded-3xl p-8 min-h-[160px]">
                <div className="w-6 h-6 bg-mh-white rounded-md mb-6"></div>
                <p className="font-medium">
                  Used for preliminary screening, not diagnosis
                </p>
              </div>
            </div>

            {/* Decorative Circles
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-1/2 w-[500px] h-[500px] border border-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-1/2 w-[320px] h-[320px] border border-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            </div> */}

          </div>
        </div>
      </section>

      {/* Why Choose Soukya */}

    
      <section className="bg-mh-light py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark mb-14">
          Why Choose Soukya Stacks
        </h2>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT IMAGE */}
          <div>
            <img
              src={soukya}
              alt="Why choose Soukya"
              className="rounded-3xl w-full h-[520px] object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">

            {/* Active Highlight Card */}
            <div className="bg-mh-gradient rounded-2xl p-6 text-mh-white">
              <h4 className="font-semibold mb-2">Heading</h4>
              <p className="text-sm opacity-90">
                It is a long established fact that a reader will be distracted by the
                readable content of a page when looking at its layout. The point of
                using Lorem Ipsum is that it has a more-or-less normal.
              </p>
            </div>

            {/* Accordion Items */}
            {['Heading', 'Heading', 'Heading', 'Heading'].map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-4 cursor-pointer hover:text-mh-green transition"
              >
                <h4 className="font-medium text-mh-dark">
                  {item}
                </h4>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>

    {/* Testimonials section  */}
   
   
    <section className="bg-mh-light py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark

-dark">
            Testimonials
          </h2>

          <button className="mt-6 sm:mt-0 px-6 py-2 rounded-full bg-mh-gradient text-mh-white text-sm font-semibold hover:opacity-90 transition">
            View All Testimonials
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Testimonial Card */}
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="bg-mh-white rounded-3xl p-8 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 text-mh-green mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis
                cursus, mi quis viverra ornare, eros dolor interdum nulla,
                ut commodo diam libero vitae erat."
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                  😊
                </div>

                <div>
                  <p className="font-semibold text-mh-dark">
                    Name Surname
                  </p>
                  <p className="text-sm text-gray-500">
                    Company name
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-between items-center mt-12">

          {/* Dots */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded-full bg-mh-green"></span>
            <span className="w-2 h-1 rounded-full bg-green-200"></span>
            <span className="w-2 h-1 rounded-full bg-green-200"></span>
          </div>

          {/* Arrows */}
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-lg bg-green-100 text-mh-green flex items-center justify-center hover:bg-green-200 transition">
              ‹
            </button>
            <button className="w-10 h-10 rounded-lg bg-mh-green text-mh-white flex items-center justify-center hover:opacity-90 transition">
              ›
            </button>
          </div>

        </div>

      </div>
    </section>


    {/* FAQ Section  */}
    
    <section className="bg-mh-light py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-mh-dark mb-4">
              Frequently Asked <br /> Questions
            </h2>

            <p className="text-gray-600 mb-8">
              If you still have questions?
            </p>

            <button className="px-8 py-3 rounded-full bg-mh-gradient text-mh-white font-semibold hover:opacity-90 transition">
              Contact Us
            </button>
          </div>

          {/* RIGHT FAQ */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition ${
                  activeIndex === index
                    ? 'bg-green-50 border-green-100'
                    : 'bg-mh-white border-gray-200'
                }`}
              >
                <button
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? -1 : index)
                  }
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="font-bold text-mh-dark">
                    {faq.question}
                  </span>
                  <span className="text-xl font-semibold">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>

                {activeIndex === index && faq.answer && (
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>


    </>
  );
}


export default HomePage;