import React from 'react';
import { Building2, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FacadeAI</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered facade analysis for construction professionals. 
              Instant measurements, accurate results.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              {['Facade Analysis', 'Window Detection', 'Door Detection', 'Area Calculator', 'CSV Export'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-white transition-colors flex items-center gap-1 group">
                    {item}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology</h4>
            <ul className="space-y-2">
              {['Computer Vision', 'AI Detection', 'Image Segmentation', 'Scale Calibration', 'Real-time Processing'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <p className="text-sm">Interested in integrating FacadeAI into your workflow?</p>
              <a
                href="mailto:eloy@facadeai.dev"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Eloy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            FacadeAI Demo — Built with React, Tailwind CSS & AI Vision
          </p>
          <p className="text-xs text-slate-500">
            Prototype for facade measurement automation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
