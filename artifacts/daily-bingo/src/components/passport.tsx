import { useState } from "react";

export default function Passport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-serif font-bold mb-6">📖 Passport</h2>

      <div className="flex justify-center">
        <div className="passport-cover">
          <div className="passport-inner">
            <h2>جواز العبور</h2>

            <p>الدخول الى جبل صهيون</p>

            <div className="passport-cross">✝</div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-6 rounded-xl bg-amber-700 text-white px-5 py-2"
            >
              {isOpen ? "Close Passport" : "Open Passport"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border">
          <h2 className="text-2xl font-bold mb-6">اسم المهمة</h2>

          <input
            type="text"
            placeholder="Task Name"
            className="w-full border rounded-lg p-3 mb-6"
          />

          <textarea
            rows={10}
            placeholder="Write your reflection..."
            className="w-full border rounded-lg p-3 mb-6"
          />

          <div className="flex justify-end">
            <div className="w-56">
              <p className="mb-2 font-semibold">التوقيع</p>

              <input type="text" className="w-full border-b p-2" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
