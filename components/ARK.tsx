
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  MapPin, 
  Users, 
  Box, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronRight,
  Search,
  Monitor,
  Armchair,
  Wifi,
  MoreVertical
} from 'lucide-react';
import { Room, RoomAsset } from '../types';

// Mock Data
const initialRooms: Room[] = [
  {
    id: 'R01',
    name: 'Main Conference Room',
    type: 'Meeting Room',
    floor: '2nd Floor',
    capacity: 12,
    status: 'Available',
    assets: [
      { id: 'A1', name: 'Logitech Rally System', category: 'Electronics', condition: 'Good', lastChecked: '2023-10-20' },
      { id: 'A2', name: 'Herman Miller Table', category: 'Furniture', condition: 'Good', lastChecked: '2023-10-20' },
      { id: 'A3', name: 'Ergonomic Chairs (12x)', category: 'Furniture', condition: 'Good', lastChecked: '2023-10-20' },
      { id: 'A4', name: 'Projector Epson 4K', category: 'Electronics', condition: 'Needs Repair', lastChecked: '2023-10-25' },
    ]
  },
  {
    id: 'R02',
    name: 'CEO Office',
    type: 'Office',
    floor: '3rd Floor',
    capacity: 2,
    status: 'In Use',
    assets: [
      { id: 'B1', name: 'Executive Desk', category: 'Furniture', condition: 'Good', lastChecked: '2023-09-15' },
      { id: 'B2', name: 'Mac Studio Display', category: 'Electronics', condition: 'Good', lastChecked: '2023-09-15' },
      { id: 'B3', name: 'Leather Sofa', category: 'Furniture', condition: 'Good', lastChecked: '2023-09-15' },
    ]
  },
  {
    id: 'R03',
    name: 'Creative Space / Pantry',
    type: 'Common Area',
    floor: '1st Floor',
    capacity: 20,
    status: 'Available',
    assets: [
      { id: 'C1', name: 'Espresso Machine', category: 'Electronics', condition: 'Broken', lastChecked: '2023-10-26' },
      { id: 'C2', name: 'High Tables (4x)', category: 'Furniture', condition: 'Good', lastChecked: '2023-10-01' },
      { id: 'C3', name: 'Microwave Samsung', category: 'Electronics', condition: 'Good', lastChecked: '2023-10-01' },
    ]
  },
  {
    id: 'R04',
    name: 'Server Room B',
    type: 'Utility',
    floor: 'Basement',
    capacity: 0,
    status: 'Maintenance',
    assets: [
      { id: 'D1', name: 'Rack Server 42U', category: 'Furniture', condition: 'Good', lastChecked: '2023-10-10' },
      { id: 'D2', name: 'Cooling Unit A', category: 'Electronics', condition: 'Needs Repair', lastChecked: '2023-10-27' },
    ]
  },
];

const ARK: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionIcon = (condition: string) => {
    switch(condition) {
      case 'Good': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'Needs Repair': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'Broken': return <XCircle size={16} className="text-rose-500" />;
      default: return <CheckCircle size={16} className="text-gray-400" />;
    }
  };

  const getAssetIcon = (category: string) => {
    switch(category) {
      case 'Electronics': return <Monitor size={18} />;
      case 'Furniture': return <Armchair size={18} />;
      default: return <Box size={18} />;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">ARK Management</h2>
          <p className="text-gray-500 text-sm mt-1">Aset Ruang Kerja - Workspace & Facility Asset Tracking.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Find a room..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm w-64"
                />
            </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium">
            <LayoutGrid size={16} />
            Add Room
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-full min-h-[600px]">
        {/* Room Grid (Left Side) */}
        <div className={`transition-all duration-300 ${selectedRoom ? 'w-1/2 hidden md:block' : 'w-full'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div 
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`
                    group bg-white p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg relative overflow-hidden
                    ${selectedRoom?.id === room.id ? 'border-gray-900 ring-1 ring-gray-900 shadow-md' : 'border-gray-200'}
                `}
              >
                {/* Status Stripe */}
                <div className={`absolute top-0 left-0 w-1 h-full 
                    ${room.status === 'Available' ? 'bg-emerald-500' : 
                      room.status === 'Maintenance' ? 'bg-rose-500' : 'bg-blue-500'}`} 
                />

                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className="p-2 bg-gray-50 rounded-lg text-gray-700">
                             {room.type === 'Meeting Room' ? <Users size={20} /> : 
                              room.type === 'Utility' ? <Wifi size={20} /> : <MapPin size={20} />}
                        </span>
                        <div>
                            <h3 className="font-bold text-gray-900">{room.name}</h3>
                            <span className="text-xs text-gray-500">{room.floor}</span>
                        </div>
                    </div>
                    {selectedRoom?.id === room.id && <ChevronRight size={20} className="text-gray-900" />}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider">Capacity</span>
                        <span className="font-semibold text-gray-900">{room.capacity} Pax</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider">Assets</span>
                        <span className="font-semibold text-gray-900">{room.assets.length} Items</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border
                        ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          room.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        {room.status}
                    </span>
                    
                    {/* Issues Indicator */}
                    {room.assets.some(a => a.condition !== 'Good') && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium animate-pulse">
                            <AlertTriangle size={12} />
                            Issues Detected
                        </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel (Right Side) */}
        {selectedRoom && (
            <div className="w-full md:w-1/2 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col animate-slide-in-right">
                {/* Panel Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h3>
                        <p className="text-sm text-gray-500">{selectedRoom.type} • {selectedRoom.floor}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedRoom(null)}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900 md:hidden"
                    >
                        <XCircle size={24} />
                    </button>
                    <div className="hidden md:flex gap-2">
                        <button className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium rounded text-gray-700 hover:bg-gray-100">
                            Edit Room
                        </button>
                        <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800">
                            + Add Asset
                        </button>
                    </div>
                </div>

                {/* Asset List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Assets in this room</h4>
                    <div className="space-y-3">
                        {selectedRoom.assets.map((asset) => (
                            <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${asset.category === 'Electronics' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {getAssetIcon(asset.category)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{asset.name}</p>
                                        <p className="text-xs text-gray-500">ID: {asset.id} • Checked: {asset.lastChecked}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                                            ${asset.condition === 'Good' ? 'bg-emerald-50 text-emerald-700' : 
                                              asset.condition === 'Needs Repair' ? 'bg-amber-50 text-amber-700' : 
                                              'bg-rose-50 text-rose-700'}`}>
                                            {getConditionIcon(asset.condition)}
                                            {asset.condition}
                                        </span>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-900">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedRoom.assets.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <Box size={48} className="mx-auto mb-2 opacity-20" />
                            <p>No assets assigned to this room yet.</p>
                        </div>
                    )}
                </div>
                
                {/* Footer Stats */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between text-xs text-gray-500">
                    <span>Total Valuation: <strong className="text-gray-900">$12,450</strong></span>
                    <span>Last Audit: <strong className="text-gray-900">Oct 20, 2023</strong></span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ARK;
