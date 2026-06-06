
import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaFolderOpen,
  FaGoogle,
  FaShieldAlt,
  FaDatabase,
} from "react-icons/fa";

function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">
          Cloud Storage
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Secure Cloud Storage
            </span>

            <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
              Store, Organize and Access Files Anywhere
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Upload files, create folders, manage content, and securely access
              your data from anywhere using AWS S3 powered cloud storage.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
              >
                Sign In
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-6 text-gray-500">
              <FaGoogle />
              <span>Google OAuth Supported</span>
            </div>
          </div>

          {/* Hero Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FaFolderOpen className="text-amber-500 text-xl" />
                <span className="font-medium">Projects</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FaFolderOpen className="text-amber-500 text-xl" />
                <span className="font-medium">Documents</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FaCloudUploadAlt className="text-blue-600 text-xl" />
                <span className="font-medium">
                  Upload files securely
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <FaCloudUploadAlt className="text-3xl text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              File Uploads
            </h3>
            <p className="text-gray-600">
              Store files securely using AWS S3.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <FaFolderOpen className="text-3xl text-amber-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Folder Management
            </h3>
            <p className="text-gray-600">
              Organize files using folders and directories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <FaShieldAlt className="text-3xl text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Secure Access
            </h3>
            <p className="text-gray-600">
              JWT authentication and role-based access.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <FaDatabase className="text-3xl text-purple-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Optimized Performance
            </h3>
            <p className="text-gray-600">
              Redis caching for faster data access.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl text-white text-center p-12">
          <h2 className="text-4xl font-bold">
            Start Managing Your Files Today
          </h2>

          <p className="mt-4 text-blue-100">
            Create folders, upload files, and access them securely from anywhere.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default WelcomePage;