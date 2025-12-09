
import React from 'react';
import { CreditCard as CardIcon, DollarSign, Lock, AlertCircle } from 'lucide-react';
import { CreditCard } from '../types';

const mockCards: CreditCard[] = [
  { id: 'CC1', holder_name: 'John Doe', bank_name: 'BCA Corporate', card_number_last4: '4242', expiry_date: '12/25', credit_limit: 50000, current_balance: 12450, status: 'Active' },
  { id: 'CC2', holder_name: 'Jane Smith', bank_name: 'Mandiri Business', card_number_last4: '8899', expiry_date: '06/24', credit_limit: 20000, current_balance: 500, status: 'Active' },
  { id: 'CC3', holder_name: 'Ops Department', bank_name: 'BCA Corporate', card_number_last4: '1122', expiry_date: '10/23', credit_limit: 10000, current_balance: 0, status: 'Blocked' },
];

const CreditCardPage: React.FC = () => {
  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Corporate Cards</h2>
            <p className="text-gray-500 text-sm mt-1">Manage spending limits and transactions.</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            Request Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCards.map((card) => (
          <div key={card.id} className="relative group perspective">
            {/* Card Visual */}
            <div className={`
                p-6 rounded-xl text-white shadow-xl transition-transform transform hover:-translate-y-1 relative overflow-hidden h-56 flex flex-col justify-between
                ${card.status === 'Blocked' ? 'bg-gray-700 grayscale' : 'bg-gradient-to-br from-gray-900 to-gray-800'}
            `}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CardIcon size={120} />
                </div>

                <div className="flex justify-between items-start z-10">
                    <span className="font-mono text-sm tracking-wider opacity-80">{card.bank_name}</span>
                    {card.status === 'Blocked' && <div className="bg-red-500 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Lock size={12}/> BLOCKED</div>}
                </div>

                <div className="z-10">
                    <div className="text-2xl font-mono tracking-widest mb-1">
                        **** **** **** {card.card_number_last4}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                            <p className="font-medium tracking-wide text-sm">{card.holder_name}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] uppercase opacity-60">Expires</p>
                             <p className="font-medium tracking-wide text-sm">{card.expiry_date}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Bar */}
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Used Balance</span>
                    <span className="font-bold text-gray-900">${card.current_balance.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                        className={`h-2 rounded-full ${card.current_balance / card.credit_limit > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(card.current_balance / card.credit_limit) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>Limit: ${card.credit_limit.toLocaleString()}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditCardPage;
