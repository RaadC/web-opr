import TopBar from "../components/TopBar";

const About = () => {
  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gray-100">
        <div className="px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 space-y-5">
              <h1 className="text-4xl font-bold">Online Procurement Cart</h1>

              <p className="text-gray-700 leading-relaxed text-justify">
                The Online Procurement Cart allows end-users to create Purchase
                Requests (PR) for common supplies through a digital system.
              </p>

              <p className="text-gray-700 leading-relaxed text-justify">
                The platform helps maintain uniform pricing and standardized
                units of measurement such as per piece, box, or pack for
                commonly requested supplies.
              </p>

              <p className="text-gray-700 leading-relaxed text-justify">
                The system also enables the Procurement Office to store and
                manage digital copies of Purchase Requests for easier
                organization and record keeping.
              </p>
            </div>
            <div className="w-full lg:w-[600px]">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/MrmPDUvKyLs?si=2atiQsqbSeixtxG7"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-10">
          <h1 className="text-3xl font-bold mb-6">Notes</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8">
            <p className="text-gray-700 leading-relaxed">
              If long text causes multi-line content in the generated Excel
              form, enable <strong>Auto Fit Row Height</strong>
              to properly display all information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <img
                src="/pic1.png"
                alt="Before Auto Fit"
                className="w-full rounded-xl"
              />

              <p className="text-center text-sm text-gray-600 mt-4">
                Before enabling Auto Fit Row Height.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4">
              <img
                src="/pic2.png"
                alt="After Auto Fit"
                className="w-full rounded-xl"
              />

              <p className="text-center text-sm text-gray-600 mt-4">
                After enabling Auto Fit Row Height.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
