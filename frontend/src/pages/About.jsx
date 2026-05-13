import TopBar from "../components/TopBar";

const About = () => {
  return (
    <>
      <TopBar />

      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-4">
              About Online Procurement Cart
            </h1>

            <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
              <p>
                The Online Procurement Cart allows end-users to create Purchase
                Requests (PR) for common supplies.
              </p>

              <p>
                The platform helps maintain uniform pricing and standardized
                units of measurement such as per piece, box, or pack for
                commonly requested supplies.
              </p>

              <p>
                The system also enables the Procurement Office to store and
                manage digital copies of Purchase Requests for easier
                organization and record keeping.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://youtu.be/MrmPDUvKyLs?si=0Kakhw15uLNq05Uv?autoplay=1&mute=1"
                title="How to Use Procurement Cart"
                allow="autoplay"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-gray-700">
              <p>
                If long text causes multi-line content in the generated Excel
                form, enable <strong>Auto Fit Row Height</strong>
                to properly display all information.
              </p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PIC 1 */}
              <div className="bg-gray-50 border rounded-2xl p-4 shadow-sm">
                <img
                  src="/pic1.png"
                  alt="Example 1"
                  className="rounded-xl w-full object-cover"
                />

                <p className="mt-4 text-sm text-gray-600 text-center">
                  Example of multi-line content before enabling Auto Fit Row
                  Height.
                </p>
              </div>

              {/* PIC 2 */}
              <div className="bg-gray-50 border rounded-2xl p-4 shadow-sm">
                <img
                  src="/pic2.png"
                  alt="Example 2"
                  className="rounded-xl w-full object-cover"
                />

                <p className="mt-4 text-sm text-gray-600 text-center">
                  Correct appearance after enabling Auto Fit Row Height.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
