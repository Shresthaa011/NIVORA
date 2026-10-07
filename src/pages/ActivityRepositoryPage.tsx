import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Download, MapPin, Building } from 'lucide-react';


const mockActivities = [
  { id: 'act-1', title: 'National Conference on Polar Sciences (NCPS-2023)', category: 'Conferences', event_date: '2023-05-18', location: 'NCPOR Complex, Vasco-da-Gama, Goa', organizer: 'NCPOR / MoES', description: 'Annual national symposium hosting over 200 climate scientists, oceanographers, and cryosphere experts.' },
  { id: 'act-2', title: 'International Polar Day Public Outreach & School Science Workshop', category: 'School outreach', event_date: '2022-10-24', location: 'National Science Centre, New Delhi', organizer: 'NCPOR Outreach Cell', description: 'Interactive session and live video link connection with Maitri station for over 500 high school students.' },
  { id: 'act-3', title: 'Specialized Polar Medicine & Extreme Environment Survival Training', category: 'Training programs', event_date: '2022-09-10', location: 'ITBP High Altitude Training Centre, Auli', organizer: 'NCPOR Medical Wing', description: 'Mandatory pre-expedition medical screening and cold-weather survival training conducted in Auli.' },
  { id: 'act-4', title: 'Indo-Arctic Bilateral Climate Workshop', category: 'Workshops', event_date: '2021-11-15', location: 'Fram Centre, Tromsø, Norway', organizer: 'NCPOR & NPI Norway', description: 'Joint scientific deliberations between NCPOR and Norwegian Polar Institute on fjord ecosystem changes.' },
  { id: 'act-5', title: 'Exhibition on 40 Years of India’s Antarctic Endeavours', category: 'Exhibitions', event_date: '2021-12-01', location: 'India International Centre, New Delhi', organizer: 'MoES Govt of India', description: 'Public photo exhibition displaying rare historical artifacts from the first 1981 Antarctic expedition.' },
];

export const ActivityRepositoryPage: React.FC = () => {
  return (
    <div className="activity-repository-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-emerald-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-400" />
            Institutional Activity Documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Workshops, Conferences, Seminars, School Outreach, Public Lectures & Announcements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 gap-4">
          {mockActivities.map((act) => (
            <div key={act.id} className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                    {act.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{act.event_date}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{act.title}</h3>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{act.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {act.location}</span>
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-500" /> {act.organizer}</span>
                </div>
              </div>
              <div className="self-start md:self-center">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download Brochure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
