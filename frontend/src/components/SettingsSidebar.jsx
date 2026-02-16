import React from "react";
import { User, Sliders, AlertCircle, ScanFace, Heart,LogOut, } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SettingsSidebar({ activeTab, setActiveTab, onLogout}) {
  const { t } = useTranslation();

  const sidebarItems = [
    { id: "general", icon: Sliders },
    { id: "thresholds", icon: AlertCircle },
    { id: "profile", icon: User },
    { id: "face_settings", icon: ScanFace },
    { id: "credits", icon: Heart },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-xl border md:border-none border-gray-100 shadow-sm md:shadow-none p-2 md:p-0">
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3 hidden md:block">
          {t('settings.sidebar.heading')}
        </h3>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon size={18} />
            {t(`settings.sidebar.${item.id}`)}
          </button>
        ))}
        
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
                {item.label}
              </div>
              {isActive && <ChevronRight size={16} className="text-blue-600" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          {t('settings.sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}

SettingsSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
