import React from "react";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, isOrganizer } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {}
      <div className="relative w-full h-96 overflow-hidden group cursor-pointer">
        {}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1500 ease-in-out group-hover:blur-sm"
          style={{
            backgroundImage: `url('./Artboard 2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            zIndex: 1,
          }}
        ></div>

        {}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3 }}
        >
          <div className="text-center">
            <h3 className="text-6xl font-bold text-white tracking-wider transition-all duration-1000 ease-in-out transform opacity-90 group-hover:opacity-100 group-hover:-translate-y-8 group-hover:scale-105">
              {isOrganizer ? "CREATE AND CONNECT" : "JOIN AND CONNECT"}
            </h3>
            <div className="w-0 h-0.5 bg-white mx-auto mt-6 transition-all duration-1500 ease-in-out group-hover:w-32 group-hover:bg-opacity-80"></div>
          </div>
        </div>
      </div>

      {}
      <div className="container-clean py-16">
        {}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Meet the Creators
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The talented team behind EventHub, dedicated to creating
              exceptional experiences.
            </p>
          </div>

          <div className="flex justify-center items-center space-x-12 flex-wrap gap-y-8">
            {}
            <div className="text-center">
              <img
                src="-iqsmzo.jpg"
                alt="Sayan Mondal"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mx-auto mb-3"
              />
              <p className="text-sm font-medium text-slate-900">SAYAN MONDAL</p>
            </div>

            {}
            <div className="text-center">
              <img
                src="Kaushik.jpeg"
                alt="Kaushik Das"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mx-auto mb-3"
              />
              <p className="text-sm font-medium text-slate-900">KAUSHIK DAS</p>
            </div>

            {}
            <div className="text-center">
              <img
                src="https://via.placeholder.com/120x120/666666/FFFFFF?text=Creator+3"
                alt="Suranjana Giri"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mx-auto mb-3"
              />
              <p className="text-sm font-medium text-slate-900">
                SURANJANA GIRI
              </p>
            </div>

            {}
            <div className="text-center">
              <img
                src="Sahin.jpeg"
                alt="Sahin Saharear"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mx-auto mb-3"
              />
              <p className="text-sm font-medium text-slate-900">
                SAHIN SAHAREAR
              </p>
            </div>

            {}
            <div className="text-center">
              <img
                src="Sreejani.jpeg"
                alt="Sreejani Biswas"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mx-auto mb-3"
              />
              <p className="text-sm font-medium text-slate-900">
                SREEJANI BISWAS
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {}
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              For Event Organizers
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Professional Event Creation
                  </div>
                  <p className="text-slate-600">
                    Create detailed events with all the information your
                    attendees need.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Real-time Registration Tracking
                  </div>
                  <p className="text-slate-600">
                    Monitor event capacity and registrations as they happen.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Attendee Management
                  </div>
                  <p className="text-slate-600">
                    Access comprehensive attendee information and communication
                    tools.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Performance Analytics
                  </div>
                  <p className="text-slate-600">
                    Understand your events with detailed insights and metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              For Event Attendees
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Discover Quality Events
                  </div>
                  <p className="text-slate-600">
                    Find events that match your interests and schedule.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Simple Registration Process
                  </div>
                  <p className="text-slate-600">
                    Register for events quickly with our streamlined process.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Organized Event Management
                  </div>
                  <p className="text-slate-600">
                    Keep track of all your registered events in one place.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Event Updates
                  </div>
                  <p className="text-slate-600">
                    Stay informed with notifications and updates about your
                    events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="w-screen bg-black text-white py-16">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-light tracking-wide mb-8">
            About This Project
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-medium mb-4 text-gray-300">
                Project Overview
              </h3>
              <p className="text-gray-400 leading-relaxed">
                EventHub is a comprehensive event management platform developed
                as a college project. It provides seamless event creation,
                registration, and management capabilities for both organizers
                and attendees.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4 text-gray-300">
                Development Team
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>• Sayan Mondal -Backend Developer</p>
                <p>• Kaushik Das - Backend Developer</p>
                <p>• Suranjana Giri - Frontend Developer</p>
                <p>• Sahin Saharear - UI/UX Designer</p>
                <p>• Sreejani Biswas -Frontend Developer</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              Built with modern web technologies including React, Node.js, and
              MongoDB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
