"use client";

import { useAdmin } from "@/context/AdminContext";
import { Save, ToggleLeft, ToggleRight, LayoutTemplate } from "lucide-react";
import { useState } from "react";

export default function CMSPage() {
    const { cms, updateCms, toggleSection } = useAdmin();
    // Local state for text input to prevent excessive re-renders/logs on every keystroke
    const [tempAnnouncement, setTempAnnouncement] = useState(cms.announcement);

    const handleSave = () => {
        updateCms("announcement", tempAnnouncement);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-primary">Content Management</h1>
                <p className="text-neutral-gray">Customize homepage and global announcements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Announcement Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-beige">
                    <h2 className="text-xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
                        <LayoutTemplate size={20} />
                        Announcement Bar
                    </h2>
                    <p className="text-sm text-neutral-gray mb-4">This text appears at the very top of the website.</p>

                    <div className="space-y-4">
                        <textarea
                            value={tempAnnouncement}
                            onChange={(e) => setTempAnnouncement(e.target.value)}
                            rows={3}
                            className="w-full p-4 border border-neutral-beige rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        />
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
                        >
                            <Save size={16} />
                            Save Text
                        </button>
                    </div>
                </div>

                {/* Section Toggles */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-beige">
                    <h2 className="text-xl font-heading font-bold text-primary mb-4">Homepage Sections</h2>
                    <p className="text-sm text-neutral-gray mb-6">Enable or disable sections on the homepage.</p>

                    <div className="space-y-4">
                        {Object.entries(cms.sections).map(([key, isEnabled]) => (
                            <div key={key} className="flex items-center justify-between p-3 border border-neutral-beige rounded-lg hover:bg-neutral-cream transition-colors">
                                <span className="font-medium text-primary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <button
                                    onClick={() => toggleSection(key)}
                                    className={`transition-colors ${isEnabled ? "text-primary" : "text-neutral-300"}`}
                                >
                                    {isEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
