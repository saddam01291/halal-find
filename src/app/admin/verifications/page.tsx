'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, X, FileText } from 'lucide-react';

interface VerificationRequest {
    id: string;
    ownerName: string;
    restaurantName: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

const MOCK_REQUESTS: VerificationRequest[] = [
    { id: '1', ownerName: 'Ahmed Khan', restaurantName: 'Spice Village', status: 'pending', submittedAt: '2024-02-14 10:30 AM' },
    { id: '2', ownerName: 'Sarah Rahman', restaurantName: 'Burger Bliss', status: 'pending', submittedAt: '2024-02-14 11:15 AM' },
    { id: '3', ownerName: 'John Doe', restaurantName: 'Pizza Express', status: 'rejected', submittedAt: '2024-02-13 04:20 PM' },
];

export default function VerificationPage() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        ));
        alert(`Request ${action}d!`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Verification Requests</h1>
                <div className="text-sm text-slate-500">
                    Showing <span className="font-bold text-slate-900">{requests.filter(r => r.status === 'pending').length}</span> pending requests
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Restaurant</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificate</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{req.restaurantName}</p>
                                    <p className="text-xs text-slate-500">{req.submittedAt}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{req.ownerName}</td>
                                <td className="px-6 py-4">
                                    <button className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        <FileText className="h-4 w-4" /> View PDF
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${req.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {req.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAction(req.id, 'approve')}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 p-0 rounded-lg"
                                                title="Approve"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAction(req.id, 'reject')}
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0 rounded-lg"
                                                title="Reject"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                        No verification requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
