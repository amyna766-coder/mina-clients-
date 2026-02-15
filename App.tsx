
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Customer, SortType } from './types';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import SearchBar from './components/SearchBar';
import StatsOverview from './components/StatsOverview';
import { Plus, Users, Download, FileSpreadsheet, Upload, SearchX } from 'lucide-react';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>(SortType.LATEST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('tamween_customers');
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('tamween_customers', JSON.stringify(customers));
  }, [customers]);

  const handleAddOrUpdate = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id ? { ...c, ...data } : c
      ));
    } else {
      const newCustomer: Customer = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }
    closeModal();
  };

  const deleteCustomer = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل نهائياً؟')) {
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
    if (customers.length === 0) return alert('لا توجد بيانات لتصديرها');
    const dataStr = JSON.stringify(customers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `tamween_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          if (window.confirm('هل تريد استبدال البيانات الحالية بالبيانات المستوردة؟ (إلغاء سيقوم بدمجهم معاً)')) {
            setCustomers(importedData);
          } else {
            // Merge logic: avoid duplicates based on name and pageNumber
            setCustomers(prev => {
              const combined = [...prev, ...importedData];
              const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
              return unique;
            });
          }
          alert('تم استيراد البيانات بنجاح');
        } else {
          alert('الملف غير صالح');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const exportDataCSV = () => {
    if (customers.length === 0) return alert('لا توجد بيانات لتصديرها');
    
    const headers = ["الاسم", "رقم الصفحة", "عدد الأفراد", "الرمز السري", "تاريخ الإضافة"];
    
    // Improved CSV conversion to handle special characters and commas
    const escapeCSV = (str: string | number) => {
      const stringValue = String(str);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = customers.map(c => [
      escapeCSV(c.name),
      escapeCSV(c.pageNumber),
      escapeCSV(c.familyCount),
      escapeCSV(c.secretPin),
      escapeCSV(new Date(c.createdAt).toLocaleDateString('ar-EG'))
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tamween_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-12 text-right" dir="rtl">
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2.5 rounded-2xl shadow-lg shadow-sky-100">
              <Users className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-sky-950">مدير التموين</h1>
              <p className="text-[10px] text-sky-500 font-bold">إدارة بيانات العملاء بذكاء</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportJSON} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              title="استيراد نسخة احتياطية (JSON)"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button 
              onClick={exportDataCSV}
              className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              title="تصدير Excel (CSV)"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button 
              onClick={exportDataJSON}
              className="p-2.5 text-sky-600 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors"
              title="تصدير نسخة احتياطية (JSON)"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-xl transition-transform active:scale-95 shadow-md shadow-sky-200"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <StatsOverview customers={customers} />

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-sky-50 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { type: SortType.LATEST, label: 'الأحدث' },
              { type: SortType.ALPHABETICAL, label: 'أبجدي' },
              { type: SortType.FAMILY_COUNT, label: 'عدد الأفراد' }
            ].map((btn) => (
              <button 
                key={btn.type}
                onClick={() => setSortType(btn.type)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${sortType === btn.type ? 'bg-sky-600 text-white shadow-md' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && filteredAndSortedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-sky-50 shadow-sm px-6">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <SearchX className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-sky-950">لا توجد نتائج</h3>
            <p className="text-slate-400 text-sm mt-1">لم نجد أي عميل يطابق بحثك عن "{searchQuery}"</p>
          </div>
        ) : (
          <CustomerList 
            customers={filteredAndSortedCustomers} 
            onDelete={deleteCustomer} 
            onEdit={startEdit}
          />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-sky-950">
                  {editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                </h2>
                <p className="text-sky-500 text-sm font-medium mt-1">يرجى التأكد من دقة البيانات المدخلة</p>
              </div>
              <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <CustomerForm 
              onSubmit={handleAddOrUpdate} 
              onCancel={closeModal} 
              initialData={editingCustomer}
            />
          </div>
        </div>
      )}

      {/* Mobile Nav Overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-40">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 text-white w-16 h-16 rounded-full shadow-2xl shadow-sky-300 flex items-center justify-center transition-transform active:scale-90"
        >
          <Plus className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default App;
