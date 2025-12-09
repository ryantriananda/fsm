
import React, { useState, useEffect } from 'react';
import { CreditCard as CardIcon, DollarSign, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { CreditCard } from '../types';
import { creditCardService } from '../services/supabaseService';

const CreditCardPage: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await creditCardService.getAll();
      setCards(data);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };
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
                    <span className="font-mono text-sm tracking-wider opacity-80">{card.bank}</span>
                    {card.status === 'Blocked' && <div className="bg-red-500 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Lock size={12}/> BLOCKED</div>}
                </div>

                <div className="z-10">
                    <div className="text-2xl font-mono tracking-widest mb-1">
                        **** **** **** {card.lastFourDigits}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                            <p className="font-medium tracking-wide text-sm">{card.holderName}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] uppercase opacity-60">Expires</p>
                             <p className="font-medium tracking-wide text-sm">{card.expiryDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Bar */}
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Used Balance</span>
                    <span className="font-bold text-gray-900">${card.currentBalance.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                        className={`h-2 rounded-full ${card.currentBalance / card.limit > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(card.currentBalance / card.limit) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>Limit: ${card.limit.toLocaleString()}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditCardPage;
