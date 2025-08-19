import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactSection() {

  return (
    <section id="contact" className="py-20 px-6 bg-neutral/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Contact
          </h2>
          <p className="text-xl text-gray-400">
            Ready to collaborate on your next project?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="scroll-fade-in">
            <h3 className="text-2xl font-bold mb-6 gradient-text">
              Get In Touch
            </h3>
            <p className="text-gray-300 mb-8">
              I'm always open to discussing new opportunities, innovative
              projects, and potential collaborations. Let's create something
              amazing together!
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-400">ervhyned@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-800" />
                </div>
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-gray-400">Caloocan City, Metro Manila</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex space-x-4">
              <a
                href="https://github.com/Ervhyne"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Github className="h-6 w-6 text-blue-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/ervhyne-dalugdog-867531359"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Linkedin className="h-6 w-6 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Contact Action */}
          <div className="scroll-fade-in">
            <div className="glassmorphism rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                Send Message
              </h3>
              <p className="text-gray-300 mb-8">
                Click the button below to open Gmail with my email address pre-filled.
              </p>
              <Button
                onClick={() => window.open('https://mail.google.com/mail/?view=cm&to=ervhyned@gmail.com', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold hover:scale-105 transition-all duration-300 px-8 py-4 text-lg shadow-lg hover:shadow-xl"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
