import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* NAVBAR */}
    <nav className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    
    {/* LEFT SIDE (LOGO + TITLE) */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl">
        <img 
          src="/logo.png" 
          alt="logo" 
          className="w-6 h-6 object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        Freelancer Hub
      </h1>
    </div>

    {/* RIGHT SIDE (BUTTONS) */}
    <div className="flex gap-4">
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 text-gray-900 font-semibold hover:text-indigo-600 transition-colors"
      >
        Sign In
      </button>

      <button
        onClick={() => navigate("/register")}
        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
      >
        Get Started
      </button>
    </div>

  </div>
</nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Collaborate, Create, Deliver
        </h2>
        <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A focused platform where clients and freelancers work together seamlessly from proposal to payment.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start as Freelancer
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-white border-2 border-indigo-500 text-indigo-600 font-bold text-lg rounded-lg hover:bg-indigo-50 transition-all"
          >
            Post a Project
          </button>
        </div>

        {/* Hero Image */}
        <div className="bg-gradient-to-b from-indigo-100 to-pink-100 rounded-2xl p-8 h-96 flex items-center justify-center mb-20">
          <div className="text-6xl text-gray-400">
            🚀 Project Collaboration Hub
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Why Choose Freelancer Hub?
          </h3>
          <p className="text-gray-600 text-center mb-16 text-lg max-w-2xl mx-auto">
            Built specifically for collaboration, not quick gigs. Get serious work done with professional tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Real-Time Chat</h4>
              <p className="text-gray-700">
                Communicate instantly with your team. Share files, updates, and feedback in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 border border-pink-200">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Task Management</h4>
              <p className="text-gray-700">
                Organize work with tasks, set priorities, and track progress with kanban boards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <div className="text-4xl mb-4">📁</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">File Management</h4>
              <p className="text-gray-700">
                Upload deliverables, briefs, and assets. Keep everything organized and accessible.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h4>
              <p className="text-gray-700">
                Safe, transparent payment handling with invoices and transaction history built-in.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-8 border border-yellow-200">
              <div className="text-4xl mb-4">⭐</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Ratings & Reviews</h4>
              <p className="text-gray-700">
                Build your reputation with verified ratings and showcase completed projects.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 border border-indigo-200">
              <div className="text-4xl mb-4">🔔</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Live Notifications</h4>
              <p className="text-gray-700">
                Get instant updates on messages, task changes, and deliverable uploads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-gray-900 text-center mb-16">
          How It Works
        </h3>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-8 items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Post or Apply</h4>
              <p className="text-gray-700 text-lg">
                Clients post projects or freelancers apply with proposals and relevant expertise.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-8 items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Hire & Collaborate</h4>
              <p className="text-gray-700 text-lg">
                Accept proposals and start working together with real-time chat and file sharing.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-8 items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Deliver & Review</h4>
              <p className="text-gray-700 text-lg">
                Submit deliverables, get feedback, and iterate until perfect.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-8 items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Pay & Rate</h4>
              <p className="text-gray-700 text-lg">
                Process secure payment and leave reviews to build credibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (Optional) */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-4">Trusted by Teams Worldwide</h3>
          <p className="text-gray-300 text-lg mb-12">
            Join hundreds of successful collaborations on Freelancer Hub.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 mb-4">
                "The smoothest collaboration experience we've ever had. Highly recommended!"
              </p>
              <p className="font-semibold">— Sarah M., Design Agency</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 mb-4">
                "Finally a platform built for real work. Love the transparency and tools."
              </p>
              <p className="font-semibold">— John D., Freelancer</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 mb-4">
                "We've cut our project management overhead by 50% using this platform."
              </p>
              <p className="font-semibold">— Lisa T., Startup Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl p-16 text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join Freelancer Hub today and start collaborating on meaningful projects.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              Sign Up Now
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-indigo-600 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Freelancer Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
