import { useState } from 'react';
import { IoPieChart } from "react-icons/io5";
import { FaCheck, FaXmark } from "react-icons/fa6";
export default function AddTaskModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    icon: '📚' // Default to To Do icon
  });

  // Status-to-icon mapping to match homepage
  const statusIcons = {
    'To Do': '📚',
    'In Progress': '⏰',
    "Won't do": '🍸',
    'Completed': '🏋️‍♂️'
  };

  const icons = ['📚', '⏰', '🍸', '🏋️‍♂️', '👤', '💬', '🎪', '🎨'];
  const statuses = [
    { label: "To Do", color: "#E3E8EF", value: "To Do", icon: '📚', reactIcon: null },
    { label: "In Progress", color: "#E9A23B", value: "In Progress", icon: '⏰', reactIcon: <IoPieChart /> },
    { label: "Won't do", color: "#DD524C", value: "Won't do", icon: '🍸', reactIcon: <FaXmark /> }
  ];

  const handleStatusChange = (newStatus) => {
    setFormData({
      ...formData,
      status: newStatus,
      icon: statusIcons[newStatus] || formData.icon
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please log in first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          icon: formData.icon,
          userEmail: user.Email
        }),
      });

      if (response.ok) {
        alert('Task created successfully!');
        setFormData({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          icon: '📚'
        });
        onClose();
        // Refresh page to show new task
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Failed to create task: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Drawer */}
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 overflow-y-auto"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl hover:text-gray-600 z-10"
          style={{ color: "#E9A23B" }}
        >
          ×
        </button>

        <div className="p-8 pt-12">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#333" }}>
            Task details
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#97A3B6" }}>
                Task name
              </label>
              <input
                type="text"
                placeholder="Enter task name"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                style={{
                  borderColor: "#3662E3",
                  backgroundColor: "#F8FAFC",
                  color: "#333",
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#97A3B6" }}>
                Description
              </label>
              <textarea
                placeholder="Enter a short description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="5"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition resize-none"
                style={{
                  borderColor: "#E3E8EF",
                  backgroundColor: "#F8FAFC",
                  color: "#333",
                }}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "#97A3B6" }}>
                Icon
              </label>
              <div className="flex gap-3 flex-wrap">
                {icons.map((icon, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({...formData, icon})}
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition hover:opacity-80"
                    style={{
                      backgroundColor: formData.icon === icon ? "#F5D565" : "#E3E8EF",
                      border: formData.icon === icon ? `2px solid #F5D565` : "2px solid transparent",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "#97A3B6" }}>
                Status
              </label>
              <div className="flex gap-3 flex-col">
                {statuses.map((status, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStatusChange(status.value)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition border-2 hover:opacity-80"
                    style={{
                      backgroundColor: formData.status === status.value ? "#F8FAFC" : "white",
                      borderColor: formData.status === status.value ? status.color : "#E3E8EF",
                      color: "#333",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      {status.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{status.label}</div>
                      {formData.status === status.value && (
                        <div className="text-sm" style={{ color: status.color }}>Selected ✓</div>
                      )}
                    </div>
                    {status.reactIcon && (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: status.color, color: 'white' }}
                      >
                        {status.reactIcon}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg font-semibold transition hover:opacity-80"
                style={{
                  backgroundColor: "#E3E8EF",
                  color: "#333",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                style={{
                  backgroundColor: "#3662E3",
                }}
              >
                Save ✓
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
