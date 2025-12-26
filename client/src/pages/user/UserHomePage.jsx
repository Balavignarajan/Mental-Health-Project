import { useState } from 'react';


import heroImage from '../../assets/images/hero-home.png';
import f1 from '../../assets/images/f1.png'
import f2 from '../../assets/images/f2.png'
import f3 from '../../assets/images/f3.png'
import serviceImage from '../../assets/images/service-img.png'
import assessmentMatterImage from '../../assets/images/asses-m.png'
import soukya from '../../assets/images/soukya.png'



function UserHomePage() {

  const assessments = [
    { img: f1 },
    { img: f2 },
    { img: f3 },
    { img: f2 },
    { img: f3 },
    { img: f1 },
  ];

  const [activeIndex, setActiveIndex] = useState(-1);

  const faqs = [
    {
      question: 'Question text goes here',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.',
    },
    {
      question: 'Question text goes here',
      answer:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      question: 'Question text goes here',
      answer:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
    },
    {
      question: 'Question text goes here',
      answer:
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt.',
    },
    {
      question: 'Question text goes here',
      answer:
        'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.',
    },
  ];

  return (
    <>
      <section className="bg-[#F8F8F0] py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              {/* Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm bg-[#FBEBDC] ">
                  Reassurance
                </span>
                <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm  bg-[#D5DCEE]">
                  Privacy
                </span>
                <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm  bg-[#DFF7EA]">
                  Confidentiality
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-mh-dark mb-4 sm:mb-6">
                Understand Your <br className="hidden sm:block" />
                <span className="inline-block bg-[#C5E9DB] px-3 py-1 rounded-xl mt-1">
                  Mental Health
                </span>
                <br className="hidden sm:block" />
                with Science-Backed <br className="hidden sm:block" />
                Assessments
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
                Take clinically aligned mental health assessments and receive a clear,
                private report you can confidently share with a professional.
              </p>

              {/* Button */}
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-mh-gradient text-mh-white text-sm sm:text-base font-semibold hover:opacity-90 transition">
                Explore Assessments
              </button>
            </div>


            {/* RIGHT IMAGE CARD */}
            <div className="relative flex justify-center">

              {/* Image container */}
              <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden w-full max-w-full">
                <img
                  src={heroImage}
                  alt="Mental health wellbeing"
                  className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[520px] object-cover"
                />
              </div>



            </div>
          </div>
        </div>
      </section>

      {/* Featured Assessments Section */}

      <section className="bg-mh-white py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mh-dark mb-3 sm:mb-4">
              Featured Assessments
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mx-auto">
              Take clinically aligned mental health assessments and receive a clear, <br className="hidden sm:block" />
              private report you can confidently share with a professional.
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">

            {/* Card 1 */}
            <div className="bg-[#FBEBDC] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">

              {/* Left */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                  Anxiety Assessment
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
                  A quick screening that helps identify symptoms of excessive worry,
                  tension, and emotional overwhelm.
                </p>

                <div className="flex gap-6 sm:gap-8 lg:gap-10 mb-4 sm:mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">20 questions</p>
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
                  className="rounded-xl sm:rounded-2xl w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
                />
              </div>

            </div>

            {/* Card 2 */}
            <div className="bg-[#D5DCEE] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                  Depression Screening
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
                  Evaluates mood patterns, motivation levels, and emotional well-being
                  to detect signs of low mood or persistent sadness.
                </p>

                <div className="flex gap-6 sm:gap-8 lg:gap-10 mb-4 sm:mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">20 questions</p>
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
                  className="rounded-xl sm:rounded-2xl w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
                />
              </div>

            </div>

            {/* Card 3 */}
            <div className="bg-[#F7E3EE] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                  ADHD / Attention Difficulty Screening
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
                  Assesses focus, impulsivity, and attention-related challenges
                  to support early understanding of ADHD-like symptoms.
                </p>

                <div className="flex gap-6 sm:gap-8 lg:gap-10 mb-4 sm:mb-6">
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Duration</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">10–12 minutes</p>
                  </div>
                  <div>
                    <svg className="w-4 h-4 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-mh-dark font-bold mb-1">Questions</p>
                    <p className="text-sm sm:text-base font-medium text-gray-700">20 questions</p>
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
                  className="rounded-xl sm:rounded-2xl w-full h-[200px] sm:h-[250px] lg:h-[300px] object-cover"
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Our Service Section  */}


      <section className="bg-mh-light py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mh-dark mb-8 sm:mb-10 lg:mb-12">
            Our Services
          </h2>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

            {/* LEFT LARGE CARD */}
            <div className="lg:col-span-2 bg-mh-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
              <img
                src={serviceImage}
                alt="Psychologist support"
                className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[320px] object-cover"
              />

              <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  Psychologist & Psychiatrist Network
                </h3>

                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-xl">
                  Connect with trusted mental-health experts for guidance,
                  diagnosis, therapy, and long-term support tailored to your needs.
                </p>

                <button className="px-6 py-2 rounded-full border border-mh-green text-mh-green text-sm font-semibold hover:bg-mh-green hover:text-mh-white transition">
                  View Details
                </button>
              </div>
            </div>

            {/* RIGHT STACKED CARDS */}
            <div className="space-y-6 sm:space-y-8">

              {/* Card 1 */}
              <div className="bg-mh-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8">
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Meditation & Wellness Retreats
                </h4>

                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Experience guided meditation, mindfulness workshops,
                  and rejuvenating retreats designed to help you reset,
                  relax, and restore balance.
                </p>

                <button className="px-5 py-2 rounded-full border border-mh-green text-mh-green text-sm font-semibold hover:bg-mh-green hover:text-mh-white transition">
                  View Details
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-mh-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8">
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Age-Focused Wellness Camps
                </h4>

                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
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
          <div className="flex justify-center mt-8 sm:mt-12 lg:mt-14">
            <button className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-mh-gradient text-mh-white text-sm sm:text-base font-semibold hover:opacity-90 transition">
              Explore More
            </button>
          </div>

        </div>
      </section>

      {/* Our Assessments Section   */}


      <section className="bg-mh-white py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mh-dark mb-8 sm:mb-10 lg:mb-12">
            Our Assessment
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {assessments.map((item, index) => (
              <div
                key={index}
                className="bg-mh-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.img}
                    alt="Assessment"
                    className="w-full h-[180px] sm:h-[200px] object-cover"
                  />

                  {/* Badge */}
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-mh-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full shadow">
                    Research-Based
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-mh-dark mb-2">
                    Anxiety Assessment
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    A quick screening that helps identify symptoms of excessive
                    worry, tension, and emotional overwhelm.
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
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
          <div className="flex justify-center mt-8 sm:mt-12 lg:mt-14">
            <button className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-mh-gradient text-mh-white text-sm sm:text-base font-semibold hover:opacity-90 transition">
              View All Assessment
            </button>
          </div>

        </div>
      </section>



      {/* FAQ Section  */}

      <section className="bg-mh-white py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">

            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mh-dark mb-3 sm:mb-4">
                Frequently Asked <br className="hidden sm:block" /> Questions
              </h2>

              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                If you still have questions?
              </p>

              <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-mh-gradient text-mh-white text-sm sm:text-base font-semibold hover:opacity-90 transition">
                Contact Us
              </button>
            </div>

            {/* RIGHT FAQ */}
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-xl sm:rounded-2xl border transition ${activeIndex === index
                      ? 'bg-green-50 border-green-100'
                      : 'bg-mh-white border-gray-200'
                    }`}
                >
                  <button
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? -1 : index)
                    }
                    className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left"
                  >
                    <span className="text-sm sm:text-base font-bold text-mh-dark pr-4">
                      {faq.question}
                    </span>
                    <span className="text-lg sm:text-xl font-semibold flex-shrink-0">
                      {activeIndex === index ? '−' : '+'}
                    </span>
                  </button>

                  {activeIndex === index && faq.answer && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
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


export default UserHomePage;