'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/mock/store';
import { Fahrzeug, FahrzeugReservierung, Projekt } from '@/types';
import { X, CalendarDays } from 'lucide-react';

interface ReservierungModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reservierung: FahrzeugReservierung) => void;
    fahrzeug?: Fahrzeug;
}

export function ReservierungModal({ isOpen, onClose, onSave, fahrzeug }: ReservierungModalProps) {
    const [projekte, setProjekte] = useState<Projekt[]>([]);
    const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
    const [form, setForm] = useState({
        fahrzeugId: fahrzeug?.id || '',
        projektId: '',
        baustelle: '',
        reserviertAb: '',
        reserviertBis: '',
        reserviertDurch: '',
        bemerkung: '',
    });

    useEffect(() => {
        setProjekte(mockStore.getProjekte());
        setFahrzeuge(mockStore.getFahrzeuge());
    }, []);

    useEffect(() => {
        if (fahrzeug) {
            setForm(prev => ({ ...prev, fahrzeugId: fahrzeug.id }));
        }
    }, [fahrzeug]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fahrzeugId || !form.baustelle || !form.reserviertAb) return;

        const selectedProjekt = projekte.find(p => p.id === form.projektId);
        const newReservierung: FahrzeugReservierung = {
            id: `res-${Date.now()}`,
            fahrzeugId: form.fahrzeugId,
            projektId: form.projektId || '',
            projektName: selectedProjekt ? `${selectedProjekt.projektnummer} – ${selectedProjekt.projektname}` : '',
            baustelle: form.baustelle,
            reserviertAb: form.reserviertAb,
            reserviertBis: form.reserviertBis || undefined,
            reserviertDurch: form.reserviertDurch || undefined,
            bemerkung: form.bemerkung || undefined,
            createdAt: new Date().toISOString(),
        };
        onSave(newReservierung);
        onClose();
    };

    const projektOptions = [
        { label: 'Kein Projekt (optional)', value: '' },
        ...projekte.map(p => ({ label: `${p.projektnummer} – ${p.projektname}`, value: p.id })),
    ];

    const fahrzeugOptions = [
        { label: 'Fahrzeug wählen...', value: '' },
        ...fahrzeuge.map(f => ({ label: `${f.bezeichnung} (${f.inventarnummer})`, value: f.id })),
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-card border border-border rounded-2xl shadow-strong w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Neue Reservierung</h2>
                            {fahrzeug && (
                                <p className="text-sm text-muted-foreground">{fahrzeug.bezeichnung} – {fahrzeug.inventarnummer}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {!fahrzeug && (
                        <Select
                            label="Fahrzeug"
                            options={fahrzeugOptions}
                            value={form.fahrzeugId}
                            onChange={e => setForm({ ...form, fahrzeugId: e.target.value })}
                        />
                    )}

                    <Select
                        label="Projekt (optional)"
                        options={projektOptions}
                        value={form.projektId}
                        onChange={e => setForm({ ...form, projektId: e.target.value })}
                    />

                    <Input
                        label="Baustelle / Einsatzort"
                        placeholder="z.B. Landi Frauenfeld"
                        value={form.baustelle}
                        onChange={e => setForm({ ...form, baustelle: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Reserviert ab"
                            type="date"
                            value={form.reserviertAb}
                            onChange={e => setForm({ ...form, reserviertAb: e.target.value })}
                        />
                        <Input
                            label="Reserviert bis"
                            type="date"
                            value={form.reserviertBis}
                            onChange={e => setForm({ ...form, reserviertBis: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Reserviert durch"
                        placeholder="Name"
                        value={form.reserviertDurch}
                        onChange={e => setForm({ ...form, reserviertDurch: e.target.value })}
                    />

                    <Input
                        label="Bemerkung"
                        placeholder="Optional"
                        value={form.bemerkung}
                        onChange={e => setForm({ ...form, bemerkung: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" type="button" onClick={onClose}>
                            Abbrechen
                        </Button>
                        <Button
                            type="submit"
                            className="font-bold shadow-lg shadow-primary/20"
                            disabled={!form.fahrzeugId || !form.baustelle || !form.reserviertAb}
                        >
                            Reservierung erstellen
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
