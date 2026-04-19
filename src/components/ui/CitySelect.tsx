'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CITIES, City, COUNTRIES, STATES_BY_COUNTRY } from '@/lib/cities';
import { Search, MapPin, ChevronDown, Check, ChevronLeft, Globe, Landmark, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CitySelectProps {
    value: string;
    onChange: (city: string) => void;
    placeholder?: string;
    className?: string;
}

type SelectionStep = 'country' | 'state' | 'city' | 'search';

export function CitySelect({ value, onChange, placeholder = "Select Location...", className }: CitySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<SelectionStep>('country');
    const [selectedCountry, setSelectedCountry] = useState('India');
    const [selectedState, setSelectedState] = useState('West Bengal');
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter logic
    const countries = COUNTRIES.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const states = (STATES_BY_COUNTRY[selectedCountry] || []).filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const cities = CITIES.filter(c => 
        c.country === selectedCountry && 
        c.state === selectedState &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));

    // Global search logic (find any city directly)
    const searchResults = searchTerm.length >= 2 ? CITIES.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.state.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10) : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectCity = (city: string) => {
        onChange(city);
        setIsOpen(false);
        setSearchTerm('');
        setStep('country'); // reset for next time
    };

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
                    <div className="flex flex-col">
                        {value && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedState}, {selectedCountry}</span>}
                        <span className={cn("text-lg font-bold leading-tight", value ? "text-slate-900" : "text-slate-400")}>
                            {value || placeholder}
                        </span>
                    </div>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with Navigation */}
                    <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {step !== 'country' && step !== 'search' && (
                                <button 
                                    onClick={() => setStep(step === 'city' ? 'state' : 'country')}
                                    className="p-2 hover:bg-white rounded-xl transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                                </button>
                            )}
                            <span className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">
                                {step === 'country' ? '1. Select Country' : 
                                 step === 'state' ? `2. Select State in ${selectedCountry}` : 
                                 step === 'city' ? `3. Select District in ${selectedState}` : 
                                 'Search Location'}
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                setStep(step === 'search' ? 'country' : 'search');
                                setSearchTerm('');
                            }}
                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                        >
                            {step === 'search' ? 'Use Tiers' : 'Quick Search'}
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="p-4 border-b border-slate-50 bg-white">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border-none outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder={step === 'search' ? "Type city or state..." : `Filter ${step}...`}
                            />
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {/* 1. Country Step */}
                        {step === 'country' && countries.map(country => (
                            <button
                                key={country}
                                onClick={() => { setSelectedCountry(country); setStep('state'); setSearchTerm(''); }}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-slate-700"
                            >
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-slate-300" />
                                    <span>{country}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-300" />
                            </button>
                        ))}

                        {/* 2. State Step */}
                        {step === 'state' && states.map(state => (
                            <button
                                key={state}
                                onClick={() => { setSelectedState(state); setStep('city'); setSearchTerm(''); }}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-slate-700"
                            >
                                <div className="flex items-center gap-3">
                                    <Landmark className="h-4 w-4 text-slate-300" />
                                    <span>{state}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-300" />
                            </button>
                        ))}

                        {/* 3. City Step */}
                        {step === 'city' && cities.map(city => (
                            <button
                                key={city.name}
                                onClick={() => handleSelectCity(city.name)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors font-bold",
                                    value === city.name ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-slate-300" />
                                    <span>{city.name}</span>
                                </div>
                                {value === city.name && <Check className="h-4 w-4 text-emerald-500" />}
                            </button>
                        ))}

                        {/* Search Step */}
                        {step === 'search' && searchResults.map(city => (
                            <button
                                key={`${city.name}-${city.state}`}
                                onClick={() => {
                                    setSelectedCountry(city.country);
                                    setSelectedState(city.state);
                                    handleSelectCity(city.name);
                                }}
                                className="w-full flex flex-col px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-900">{city.name}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{city.state}, {city.country}</span>
                            </button>
                        ))}

                        {/* Empty States */}
                        {((step === 'country' && countries.length === 0) || 
                          (step === 'state' && states.length === 0) || 
                          (step === 'city' && cities.length === 0) ||
                          (step === 'search' && searchResults.length === 0 && searchTerm.length >= 2)) && (
                            <div className="p-8 text-center">
                                <p className="text-slate-400 font-bold">No matches found</p>
                                <button 
                                    onClick={() => setStep('search')}
                                    className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-2 block mx-auto underline"
                                >
                                    Try Quick Search
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
