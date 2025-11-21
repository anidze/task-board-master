export default function AddTaskModal({ open, onClose }) {
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

          <form className="space-y-6">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#97A3B6" }}>
                Task name
              </label>
              <input
                type="text"
                placeholder="Task Won't Do"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
                style={{
                  borderColor: "#3662E3",
                  backgroundColor: "#F8FAFC",
                  color: "#333",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#97A3B6" }}>
                Description
              </label>
              <textarea
                placeholder="Enter a short description"
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
                {['👤', '💬', '⭐', '🎪', '🎨', '🎭'].map((icon, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition"
                    style={{
                      backgroundColor: idx === 2 ? "#F5D565" : "#E3E8EF",
                      border: idx === 2 ? `2px solid #F5D565` : "2px solid transparent",
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
                {[
                  { label: "In Progress", color: "#E9A23B", selected: false },
                  { label: "Completed", color: "#32D657", selected: false },
                  { label: "Won't do", color: "#DD524C", selected: true },
                ].map((status, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition border-2"
                    style={{
                      backgroundColor: status.selected ? "#F8FAFC" : "white",
                      borderColor: status.selected ? status.color : "#E3E8EF",
                      color: "#333",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.selected && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
                    </div>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#E3E8EF",
                  color: "#333",
                }}
              >
                <span>🗑️</span> Delete
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
