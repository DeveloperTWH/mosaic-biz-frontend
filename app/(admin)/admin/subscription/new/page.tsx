'use client';

import { useState } from 'react';
import SubscriptionPlanForm from '../_components/SubscriptionPlanForm';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function CreatePlanPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [loading] = useState<boolean>(false); // reserved if you later load any defaults

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setSidebarOpen} />
                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold heading">Create Subscription Plan</h1>
                    </div>

                    {/* You can render a loader here if "loading" ever becomes true */}
                    <SubscriptionPlanForm
                        mode="create"
                        submitPath="/api/subscription-plans"
                        method="POST"
                    />
                </main>
            </div>
        </div>
    );
}
