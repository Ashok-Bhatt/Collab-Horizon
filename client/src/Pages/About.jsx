function About() {

  const projectTeam = [
    { name: "Ashok Bhatt", role: "Founder & Developer" },
    { name: "Vrajesh Pandya", role: "UI/UX Designer" },
    { name: "Priyansh Dabhi", role: "Product Manager and Developer"}
  ]

  return (
    <div className="flex-grow overflow-y-auto bg-gray-50 text-gray-900 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Collab Horizon</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Collab Horizon is a collaborative coding platform built to connect developers, 
            learners, and innovators. Our mission is to make teamwork seamless, 
            projects visible, and coding more impactful.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Seamless Collaboration</h3>
              <p className="text-gray-600">
                Work on projects together, manage tasks, and boost productivity.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Project Discovery</h3>
              <p className="text-gray-600">
                Discover, join, or showcase coding projects with a global community.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Learning & Growth</h3>
              <p className="text-gray-600">
                Enhance your skills by solving real-world problems with peers.
              </p>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            At Collab Horizon, we aim to break barriers between coders worldwide. 
            Whether you’re a beginner or an expert, our platform gives you the 
            tools to collaborate, innovate, and grow together.
          </p>
        </div>

        {/* Meet the Team */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {projectTeam.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-4" />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600">📧 ashokbhatt2048@gmail.com</p>
          <p className="text-gray-600">🌐 www.collabhorizon.com</p>
        </div>
      </div>
    </div>
  );
}

export default About;