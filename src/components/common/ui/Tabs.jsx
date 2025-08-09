import React, { useState } from "react";

const Tabs = ({ tabs, defaultActiveId }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveId || tabs[0]?.id);

  if (!tabs.length) return null;

  return (
    <div className="mt-4">
      {/* Tab Headers */}
      <div className="flex w-1/3 gap-1 p-2 rounded-full bg-richblack-700">
        {tabs.map((tab) => (
         <button
  key={tab.id}
  className={`px-6 py-2 rounded-full font-medium transition-all
    ${
      activeTab === tab.id
        ? "bg-black text-white "  // Active state: black background, white text
        : "text-pure-greys-100 hover:bg-gray-100"  // Inactive state: light gray text, subtle hover
    }`}
  onClick={() => setActiveTab(tab.id)}
>
  {tab.label}
</button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="py-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;