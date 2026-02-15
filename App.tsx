
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Customer, SortType } from './types.ts';
import CustomerForm from './components/CustomerForm.tsx';
import CustomerList from './components/CustomerList.tsx';
import SearchBar from './components/SearchBar.tsx';
import StatsOverview from './components/StatsOverview.tsx';
import { Plus, Users, Download, FileSpreadsheet, Upload, SearchX } from 'lucide-react';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>(SortType.LATEST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('tamween_customers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCustomers(parsed);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('tamween_customers', JSON.stringify(customers));
    }
  }, [customers]);

  const handleAddOrUpdate = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id ? { ...c, ...data } : c
      ));
    } else {
      const newCustomer: Customer = {
        ...data,
        id: generateId(),
        createdAt: Date.now()
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }
    closeModal();
  };

  const deleteCustomer = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const startEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(undefined);
  };

  const exportDataJSON = () => {
    if (customers.length === 0) return alert('لا توجد بيانات');
    const dataStr = JSON.stringify(customers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tamween_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setCustomers(imported);
          alert('تم الاستيراد بنجاح');
        }
      } catch (err) {
        alert('خطأ في الملف');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const exportDataCSV = () => {
    if (customers.length === 0) return alert('لا توجد بيانات');
    const headers = ["الاسم", "الصفحة", "الأفراد", "الرمز", "التاريخ"];
    const rows = customers.map(c => [
      c.name, c.pageNumber, c.familyCount, c.secretPin, 
      new Date(c.createdAt).toLocaleDateString('ar-EG')
    ]);
    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tamween_data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.pageNumber.includes(q));
    }
    result.sort((a, b) => {
      if (sortType === SortType.ALPHABETICAL) return a.name.localeCompare(b.name, 'ar');
      if (sortType === SortType.FAMILY_COUNT) return b.familyCount - a.familyCount;
      return b.createdAt - a.createdAt;
    });
    return result;
  }, [customers, searchQuery, sortType]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-right" dir="rtl">
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2.5 rounded-2xl shadow-lg">
              <Users className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-sky-950">مدير التموين</h1>
              <p className="text-[10px] text-sky-500 font-bold">نظام إدارة العملاء</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImportJSON} />
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-orange-600 bg-orange-50 rounded-xl"><Upload className="w-5 h-5" /></button>
            <button onClick={exportDataCSV} className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl"><FileSpreadsheet className="w-5 h-5" /></button>
            <button onClick={exportDataJSON} className="p-2.5 text-sky-600 bg-sky-50 rounded-xl"><Download className="w-5 h-5" /></button>
            <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 text-white p-2.5 rounded-xl shadow-md"><Plus className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <StatsOverview customers={customers} />
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-sky-50 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[{ type: SortType.LATEST, label: 'الأحدث' }, { type: SortType.ALPHABETICAL, label: 'أبجدي' }, { type: SortType.FAMILY_COUNT, label: 'عدد الأفراد' }].map((btn) => (
              <button key={btn.type} onClick={() => setSortType(btn.type as SortType)} className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${sortType === btn.type ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'}`}>{btn.label}</button>
            ))}
          </div>
        </div>
        {searchQuery && filteredAndSortedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-sky-50 shadow-sm px-6">
            <SearchX className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-black text-sky-950">لا توجد نتائج</h3>
          </div>
        ) : (
          <CustomerList customers={filteredAndSortedCustomers} onDelete={deleteCustomer} onEdit={startEdit} />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-sky-950">{editingCustomer ? 'تعديل البيانات' : 'إضافة عميل'}</h2>
              <button onClick={closeModal} className="text-slate-400 text-2xl">✕</button>
            </div>
            <CustomerForm onSubmit={handleAddOrUpdate} onCancel={closeModal} initialData={editingCustomer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
