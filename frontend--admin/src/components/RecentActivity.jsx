// src/components/RecentActivity.jsx
import { Clock } from "lucide-react";

const activities = [
  { id: 1, user: "User A", action: "booked a ticket", detail: "from Chennai to Bangalore" },
  { id: 2, user: "Admin", action: "added a bus", detail: "KA-01-1234" },
  { id: 3, user: "User B", action: "cancelled a ticket", detail: "" },
  { id: 4, user: "Admin", action: "created a route", detail: "Hyderabad to Kochi" },
];

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          >
            <Clock className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              {activity.detail && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
