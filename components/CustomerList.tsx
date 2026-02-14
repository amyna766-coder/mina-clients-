
import React from 'react';
import { Customer } from '../types';
import { Trash2, Edit3, Users, Key, Hash } from 'lucide-react';

interface Props {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerList: React.FC<Props> = ({ customers, onDelete, onEdit }) => {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-dashed border-sky-100 px-6">
        <div className="bg-sky-50 p-6 rounded-full mb-6">
          <Users className="w-16 h-16 text-sky-200" />
        </div>
        <h3 className="text-xl font-black text-sky-950">السجل فارغ تماماً</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-[200px] mx-auto">لم تقم بإضافة أي عملاء بعد، ابدأ الآن بتنظيم عملك.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {customers.map(customer => (
        <div 
          key={customer.id} 
          className="group bg-white rounded-[2rem] border border-sky-50 p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-sky-100">
                  {customer.name.trim().charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-sky-950 text-lg leading-tight line-clamp-1">{customer.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-sky-500">
                    <Hash className="w-3 h-3" />
                    <span className="text-xs font-bold">صفحة: {customer.pageNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => onEdit(customer)}
                  className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  title="تعديل"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(customer.id)}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الأفراد</span>
                </div>
                <p className="text-lg font-black text-sky-950 leading-none">{customer.familyCount}</p>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الرمز</span>
                </div>
                <p className="text-lg font-black text-sky-950 leading-none">{customer.secretPin}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-slate-300 border-t border-slate-50 pt-4">
               <p>تاريخ الإضافة: {new Date(customer.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
