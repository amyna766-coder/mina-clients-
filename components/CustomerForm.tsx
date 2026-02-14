
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { User, FileText, Users, Lock, Save } from 'lucide-react';

interface Props {
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Customer;
}

const CustomerForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    pageNumber: '',
    familyCount: 1,
    secretPin: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        pageNumber: initialData.pageNumber,
        familyCount: initialData.familyCount,
        secretPin: initialData.secretPin
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pageNumber) return;
    onSubmit(formData);
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white outline-none transition-all text-sky-950 font-bold placeholder:text-slate-300";
  const labelClass = "text-xs font-black text-sky-900 flex items-center gap-1.5 mb-2 mr-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className={labelClass}>
          <User className="w-3.5 h-3.5 text-sky-500" /> اسم العميل الرباعي
        </label>
        <input
          required
          type="text"
          placeholder="مثال: محمد أحمد علي حسن"
          className={inputClass}
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>
            <FileText className="w-3.5 h-3.5 text-sky-500" /> رقم الصفحة
          </label>
          <input
            required
            type="text"
            placeholder="رقم الدفتر"
            className={inputClass}
            value={formData.pageNumber}
            onChange={e => setFormData({ ...formData, pageNumber: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>
            <Users className="w-3.5 h-3.5 text-sky-500" /> عدد الأفراد
          </label>
          <input
            required
            type="number"
            min="1"
            className={inputClass}
            value={formData.familyCount}
            onChange={e => setFormData({ ...formData, familyCount: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>
          <Lock className="w-3.5 h-3.5 text-sky-500" /> الرقم السري للبطاقة
        </label>
        <input
          required
          type="text"
          placeholder="عادة مكون من 4 أرقام"
          className={inputClass}
          value={formData.secretPin}
          onChange={e => setFormData({ ...formData, secretPin: e.target.value })}
        />
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-sky-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {initialData ? 'تحديث البيانات' : 'إضافة العميل الآن'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          إغلاق النافذة
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
