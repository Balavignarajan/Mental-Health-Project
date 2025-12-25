import about1 from '../../assets/images/about1.png';
import about2 from '../../assets/images/about2.png';
import about3 from '../../assets/images/about3.png';

function AboutUsPage() {
  return (
    <div className="bg-mh-light">

      {/* HERO SECTION */}
      <section className="bg-mh-gradient py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center text-mh-white">

          <p className="text-sm opacity-80 mb-4">
            Home / About Us
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold mb-6">
            Helping You Understand Your Mind, <br />
            One Step at a Time
          </h1>

          <p className="max-w-2xl mx-auto text-sm opacity-90 mb-14">
            We created this platform to make mental health support more
            approachable and easier to access. Through simple, research-based
            assessments, we help you gain clarity about your emotional well-being,
            behaviour patterns, and areas where you may need support.
          </p>

          {/* Image Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <img
              src={about1}
              alt="About"
              className="rounded-3xl h-[260px] w-full object-cover"
            />
            <img
              src={about2}
              alt="About"
              className="rounded-3xl h-[260px] w-full object-cover"
            />
            <img
              src={about3}
              alt="About"
              className="rounded-3xl h-[260px] w-full object-cover"
            />
          </div>

        </div>

      </section>

      {/* MISSION & VISION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Mission */}
          <div className="bg-mh-white rounded-2xl p-8 shadow-sm">
            <div className="mb-4 text-mh-green text-xl">⛰</div>
            <h3 className="text-xl font-semibold mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 text-sm">
              To support individuals on their mental-wellness journey by offering
              simple, research-based tools that help them understand their emotions,
              behaviour, and attention patterns with compassion and clarity.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-mh-white rounded-2xl p-8 shadow-sm">
            <div className="mb-4 text-mh-green text-xl">👁</div>
            <h3 className="text-xl font-semibold mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600 text-sm">
              A world where everyone feels empowered to explore their mental
              health openly, access helpful insights easily, and receive the
              support they need without fear, shame, or confusion.
            </p>
          </div>

        </div>
      </section>

      {/* OUR VALUES */}
      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-semibold mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Value Card */}
            <div>
              <div className="mb-3 text-xl">💗</div>
              <h4 className="font-semibold mb-2">
                Compassion First
              </h4>
              <p className="text-sm text-gray-600">
                We design every experience with empathy, ensuring users
                feel safe, supported, and understood throughout their
                mental-health journey.
              </p>
            </div>

            <div>
              <div className="mb-3 text-xl">✨</div>
              <h4 className="font-semibold mb-2">
                Clarity & Simplicity
              </h4>
              <p className="text-sm text-gray-600">
                Mental health can feel complex — our goal is to make
                understanding it simple, approachable, and easy to navigate.
              </p>
            </div>

            <div>
              <div className="mb-3 text-xl">🔒</div>
              <h4 className="font-semibold mb-2">
                Privacy You Can Trust
              </h4>
              <p className="text-sm text-gray-600">
                Your information stays secure, encrypted, and under your
                control. Confidentiality isn’t optional — it’s foundational.
              </p>
            </div>

            <div>
              <div className="mb-3 text-xl">🧠</div>
              <h4 className="font-semibold mb-2">
                Empowering Early Insight
              </h4>
              <p className="text-sm text-gray-600">
                We believe early awareness creates better outcomes. Our tools
                help highlight patterns before they become overwhelming.
              </p>
            </div>

            <div>
              <div className="mb-3 text-xl">🌍</div>
              <h4 className="font-semibold mb-2">
                Designed for Everyone
              </h4>
              <p className="text-sm text-gray-600">
                Whether you’re an individual, a parent, or a psychologist,
                our platform adapts to your needs with accessibility at its core.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default AboutUsPage;
