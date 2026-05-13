import TopBar from "../components/TopBar";

const About = () => {
  return (
    <>
      <TopBar />

      <div className="min-h-screen px-6 md:px-10 py-8">
        <div
          className="
        flex flex-col lg:flex-row
        gap-10
        items-center
        mb-16
      "
        >
          <div className="flex-1 space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold">
              Online Procurement Cart
            </h1>

            <p className="text-gray-700 leading-relaxed text-justify">
              The Online Procurement Cart allows end-users to create Purchase
              Requests (PR) for common supplies through a digital system.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              The platform helps maintain uniform pricing and standardized units
              of measurement such as per piece, box, or pack for commonly
              requested supplies.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              The system also enables the Procurement Office to store and manage
              digital copies of Purchase Requests for easier record keeping.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg">
              <iframe
                width="500"
                height="280"
                src="https://www.youtube.com/embed/MrmPDUvKyLs?si=RnkR6WH_VIafQa7P"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
        <div className="space-y-6 mb-6">
          <p className="text-gray-700 leading-relaxed">
            If long text causes multi-line content in the generated Excel form,
            enable <strong>Auto Fit Row Height </strong>
            to properly display all information. <br />
            <strong>- Select Rows - Format - AutoFit Row Height</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
