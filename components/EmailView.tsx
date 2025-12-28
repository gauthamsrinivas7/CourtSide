import React from 'react';

interface EmailViewProps {
  title: string;
  subtitle: string;
  timeLabel: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const EmailView: React.FC<EmailViewProps> = ({ title, subtitle, timeLabel, children, icon }) => {
  return (
    <div className="w-full bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto my-8">
      {/* Email Header */}
      <div className="bg-slate-100 border-b border-slate-200 p-6 flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received</div>
          <div className="text-sm font-medium text-slate-700">{timeLabel}</div>
        </div>
      </div>

      {/* Email Body */}
      <div className="p-8 min-h-[300px] bg-white">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600">
              Here is your personalized sports digest for today, curated by <strong>CourtSide Pulse</strong>.
            </p>
            <hr className="border-slate-100 my-6" />
            {children}
            <hr className="border-slate-100 my-6" />
            <p className="text-xs text-slate-400 text-center">
              You are receiving this because you subscribed to updates for your favorite teams.
              <br />
              © {new Date().getFullYear()} CourtSide Pulse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailView;
