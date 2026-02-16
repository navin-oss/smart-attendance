import React from 'react';
import PropTypes from 'prop-types';
import { Trash2 } from 'lucide-react';

const SubjectAttendanceCard = ({ subject, onDelete }) => {
  const { name, code, attended, total, id, _id } = subject;
  // Handle both id formats just in case
  const subjectId = id || _id;

  // Calculate percentage safely
  const percentage = total > 0 ? (attended / total) * 100 : 0;
  const isSafe = percentage >= 75;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5 relative shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[var(--text-main)] font-bold text-lg leading-tight">{name}</h3>
          <p className="text-[var(--text-body)] text-xs font-medium uppercase tracking-wide mt-1">{code}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(subjectId)}
            className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
            title="Remove subject"
            aria-label={`Remove ${name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
           <span className="text-[var(--text-body)] text-sm font-medium">{attended} / {total} Classes</span>
           <span className={`text-lg font-bold ${isSafe ? 'text-emerald-500' : 'text-red-500'}`}>
             {percentage.toFixed(1)}%
           </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isSafe ? 'bg-emerald-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          ></div>
        </div>

        {/* Status Badge */}
        <div className="pt-1">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                isSafe
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
            {isSafe ? 'On Track' : 'Low Attendance'}
            </span>
        </div>
      </div>
    </div>
  );
};

SubjectAttendanceCard.propTypes = {
  subject: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    attended: PropTypes.number,
    total: PropTypes.number,
    id: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func,
};

export default SubjectAttendanceCard;
