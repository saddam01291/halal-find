'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CITIES, City } from '@/lib/cities';
import { Search, MapPin, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from '@/context/LocationContext';

interface CitySelectProps {
    value: string;
    onChange: (city: string) => void;
    placeholder?: string;
    className?: string;
}

export function CitySelect({ value, onChange, placeholder = "Select city...", className }: CitySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { userCoords } = useLocation();

    // Intersection of detected country + priority
    // For now, we prioritize West Bengal, then India.
    const filteredCities = CITIES
        .filter(city => {
            if (!searchTerm) return true;
            return city.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            // Priority first
            if (b.priority !== a.priority) return b.priority - a.priority;
            // Then alphabetical
            return a.name.localeCompare(b.name);
        });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCity = CITIES.find(c => c.name === value);

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-16 px-6 rounded-3xl border-3 flex items-center justify-between cursor-pointer transition-all",
                    isOpen ? "border-emerald-500 bg-white ring-4 ring-emerald-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                )}
            >
                <div className="flex items-center gap-3">
                    <MapPin className={cn("h-5 w-5", value ? "text-emerald-500" : "text-slate-300")} />
                    <span className={cn("text-lg font-bold", value ? "text-slate-900" : "text-slate-400")}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border-none outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="Type a city name..."
                            />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                                <button
                                    key={`${city.name}-${city.state}`}
                                    type="button"
                                    onClick={() => {
                                        onChange(city.name);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-colors font-bold",
                                        value === city.name ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <div>
                                        <span>{city.name}</span>
                                        <span className="ml-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">{city.state}</span>
                                    </div>
                                    {value === city.name && <Check className="h-4 w-4 text-emerald-500" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-slate-400 font-bold mb-1">No cities found</p>
                                <p className="text-[10px] uppercase text-slate-300 tracking-widest">Try typing another letter</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
