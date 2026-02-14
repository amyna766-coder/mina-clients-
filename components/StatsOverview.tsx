
import React from 'react';
import { Customer } from '../types';
import { Users, BookOpen, CreditCard } from 'lucide-react';

interface Props {
  customers: Customer[];
}

const StatsOverview: React.FC<Props> = ({ customers }) => {
  const totalIndividuals = customers.reduce((acc, curr) => acc + curr.familyCount, 0);
  
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      <div className="bg-sky-600 p-5 rounded-[2rem] text-white shadow-xl shadow-sky-100 flex flex-col justify-between">
        <CreditCard className="w-5 h-5 opacity-40 mb-4" />
        <div>
          <p className="text-[10px] opacity-80 font-black mb-1">العملاء</p>
          <p className="text-2xl font-black leading-none">{customers.length}</p>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-[2rem] border border-sky-50 shadow-sm flex flex-col justify-between">
        <Users className="w-5 h-5 text-sky-500 opacity-40 mb-4" />
        <div>
          <p className="text-[10px] text-slate-400 font-black mb-1">الأفراد</p>
          <p className="text-2xl font-black text-sky-950 leading-none">{totalIndividuals}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-sky-50 shadow-sm flex flex-col justify-between">
        <BookOpen className="w-5 h-5 text-sky-500 opacity-40 mb-4" />
        <div>
          <p className="text-[10px] text-slate-400 font-black mb-1">المتوسط</p>
          <p className="text-2xl font-black text-sky-950 leading-none">
            {customers.length > 0 ? (totalIndividuals / customers.length).toFixed(1) : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
