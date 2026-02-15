'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ReservierungModal } from '@/components/shared/ReservierungModal';
import { mockStore } from '@/lib/mock/store';
import { Fahrzeug, FahrzeugKategorie, FahrzeugStatus, FahrzeugReservierung } from '@/types';
import { ArrowLeft, Save, Edit, Car, CalendarPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const KATEGORIE_OPTIONS = [
    { label: 'Scherenbühne', value: 'scherenbuehne' },
    { label: 'Teleskopbühne', value: 'teleskopbuehne' },
    { label: 'Vertikalmastbühne', value: 'vertikalmastbuehne' },
    { label: 'Mauerbühne', value: 'mauerbuehne' },
    { label: 'Teleskop Frontlader', value: 'teleskop_frontlader' },
    { label: 'Kleinbagger', value: 'kleinbagger' },
    { label: 'Baggerlader', value: 'baggerlader' },
    { label: 'Raupendumper', value: 'raupendumper' },
    { label: 'Minikran', value: 'minikran' },
    { label: 'Turmdrehkran', value: 'turmdrehkran' },
    { label: 'Sonstiges', value: 'sonstiges' },
];

const STATUS_OPTIONS = [
    { label: 'Verfügbar', value: 'verfuegbar' },
    { label: 'Reserviert', value: 'reserviert' },
    { label: 'In Wartung', value: 'in_wartung' },
    { label: 'Außer Betrieb', value: 'ausser_betrieb' },
];

const ANTRIEB_OPTIONS = [
    { label: '–', value: '' },
    { label: 'Elektrisch', value: 'elektrisch' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Elektro / Diesel', value: 'Elektro / Diesel' },
];

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
    verfuegbar: { label: 'Verfügbar', variant: 'success' },
    reserviert: { label: 'Reserviert', variant: 'warning' },
    in_wartung: { label: 'In Wartung', variant: 'info' },
    ausser_betrieb: { label: 'Außer Betrieb', variant: 'error' },
};

export default function FahrzeugDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [fahrzeug, setFahrzeug] = useState<Fahrzeug | null>(null);
    const [reservierungen, setReservierungen] = useState<FahrzeugReservierung[]>([]);
    const [editing, setEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const allFz = mockStore.getFahrzeuge();
            const found = allFz.find((f: Fahrzeug) => f.id === id);
            if (found) {
                setFahrzeug(found);
                setForm({
                    bezeichnung: found.bezeichnung,
                    kategorie: found.kategorie,
                    inventarnummer: found.inventarnummer,
                    fabrikat: found.fabrikat || '',
                    typ: found.typ || '',
                    seriennummer: found.seriennummer || '',
                    farbe: found.farbe || '',
                    kennzeichen: found.kennzeichen || '',
                    plattformhoehe: found.plattformhoehe || '',
                    masse: found.masse || '',
                    leistung: found.leistung || '',
                    gewicht: found.gewicht || '',
                    reichweite: found.reichweite || '',
                    nutzlast: found.nutzlast || '',
                    antrieb: found.antrieb || '',
                    baujahr: found.baujahr?.toString() || '',
                    spezHinweis: found.spezHinweis || '',
                    kaufjahr: found.kaufjahr || '',
                    geprueftBis: found.geprueftBis || '',
                    abgaswartung: found.abgaswartung || '',
                    status: found.status,
                    bemerkung: found.bemerkung || '',
                });
            }
            const allRes = mockStore.getReservierungen();
            setReservierungen(allRes.filter((r: FahrzeugReservierung) => r.fahrzeugId === id));
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [id]);

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = () => {
        if (!fahrzeug) return;
        const updated: Fahrzeug = {
            ...fahrzeug,
            bezeichnung: form.bezeichnung,
            kategorie: form.kategorie as FahrzeugKategorie,
            inventarnummer: form.inventarnummer,
            fabrikat: form.fabrikat || undefined,
            typ: form.typ || undefined,
            seriennummer: form.seriennummer || undefined,
            farbe: form.farbe || undefined,
            kennzeichen: form.kennzeichen || undefined,
            plattformhoehe: form.plattformhoehe || undefined,
            masse: form.masse || undefined,
            leistung: form.leistung || undefined,
            gewicht: form.gewicht || undefined,
            reichweite: form.reichweite || undefined,
            nutzlast: form.nutzlast || undefined,
            antrieb: form.antrieb || undefined,
            baujahr: form.baujahr ? parseInt(form.baujahr) : undefined,
            spezHinweis: form.spezHinweis || undefined,
            kaufjahr: form.kaufjahr || undefined,
            geprueftBis: form.geprueftBis || undefined,
            abgaswartung: form.abgaswartung || undefined,
            status: form.status as FahrzeugStatus,
            bemerkung: form.bemerkung || undefined,
        };
        const allFz = mockStore.getFahrzeuge();
        mockStore.saveFahrzeuge(allFz.map((f: Fahrzeug) => f.id === id ? updated : f));
        setFahrzeug(updated);
        setEditing(false);
    };

    const handleDeleteReservierung = (resId: string) => {
        if (!confirm('Reservierung wirklich löschen?')) return;
        const allRes = mockStore.getReservierungen();
        const updated = allRes.filter((r: FahrzeugReservierung) => r.id !== resId);
        mockStore.saveReservierungen(updated);
        setReservierungen(updated.filter((r: FahrzeugReservierung) => r.fahrzeugId === id));
    };

    const handleSaveReservierung = (newRes: FahrzeugReservierung) => {
        const allRes = mockStore.getReservierungen();
        mockStore.saveReservierungen([...allRes, newRes]);
        setReservierungen(prev => [...prev, newRes]);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!fahrzeug) {
        return (
            <div className="text-center py-20">
                <Car className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-bold">Fahrzeug nicht gefunden</p>
                <Link href="/fuhrpark">
                    <Button variant="ghost" className="mt-4">Zurück zum Fuhrpark</Button>
                </Link>
            </div>
        );
    }

    const statusCfg = STATUS_CONFIG[fahrzeug.status] || STATUS_CONFIG.verfuegbar;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/fuhrpark">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{fahrzeug.bezeichnung}</h1>
                            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        <p className="text-muted-foreground font-medium mt-1">
                            {fahrzeug.inventarnummer} · {fahrzeug.fabrikat} {fahrzeug.typ}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setModalOpen(true)}
                        className="font-bold"
                    >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Reservieren
                    </Button>
                    <Button
                        onClick={() => setEditing(!editing)}
                        className="font-bold shadow-lg shadow-primary/20"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        {editing ? 'Abbrechen' : 'Bearbeiten'}
                    </Button>
                </div>
            </div>

            {/* Detail / Edit Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        {editing ? 'Maschine bearbeiten' : 'Stammdaten'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {editing ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Bezeichnung" value={form.bezeichnung} onChange={e => update('bezeichnung', e.target.value)} />
                                <Select label="Kategorie" options={KATEGORIE_OPTIONS} value={form.kategorie} onChange={e => update('kategorie', e.target.value)} />
                                <Input label="Inventar-Nr." value={form.inventarnummer} onChange={e => update('inventarnummer', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Fabrikat" value={form.fabrikat} onChange={e => update('fabrikat', e.target.value)} />
                                <Input label="Typ" value={form.typ} onChange={e => update('typ', e.target.value)} />
                                <Input label="Serien-Nr." value={form.seriennummer} onChange={e => update('seriennummer', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Farbe" value={form.farbe} onChange={e => update('farbe', e.target.value)} />
                                <Input label="Kennzeichen" value={form.kennzeichen} onChange={e => update('kennzeichen', e.target.value)} />
                                <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => update('status', e.target.value)} />
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-800" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Plattformhöhe / Ausladung" value={form.plattformhoehe} onChange={e => update('plattformhoehe', e.target.value)} />
                                <Input label="Masse (LxBxH)" value={form.masse} onChange={e => update('masse', e.target.value)} />
                                <Input label="Leistung" value={form.leistung} onChange={e => update('leistung', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Gewicht" value={form.gewicht} onChange={e => update('gewicht', e.target.value)} />
                                <Input label="Nutzlast" value={form.nutzlast} onChange={e => update('nutzlast', e.target.value)} />
                                <Select label="Antrieb" options={ANTRIEB_OPTIONS} value={form.antrieb} onChange={e => update('antrieb', e.target.value)} />
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-800" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Baujahr" type="number" value={form.baujahr} onChange={e => update('baujahr', e.target.value)} />
                                <Input label="Kaufjahr" value={form.kaufjahr} onChange={e => update('kaufjahr', e.target.value)} />
                                <Input label="Geprüft bis" value={form.geprueftBis} onChange={e => update('geprueftBis', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Abgaswartung" value={form.abgaswartung} onChange={e => update('abgaswartung', e.target.value)} />
                                <Input label="Spez. Hinweis" value={form.spezHinweis} onChange={e => update('spezHinweis', e.target.value)} />
                                <Input label="Bemerkung" value={form.bemerkung} onChange={e => update('bemerkung', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <Button variant="ghost" onClick={() => setEditing(false)}>Abbrechen</Button>
                                <Button onClick={handleSave} className="font-bold shadow-lg shadow-primary/20">
                                    <Save className="h-4 w-4 mr-2" />
                                    Änderungen speichern
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                            {[
                                ['Bezeichnung', fahrzeug.bezeichnung],
                                ['Inventar-Nr.', fahrzeug.inventarnummer],
                                ['Fabrikat', fahrzeug.fabrikat],
                                ['Typ', fahrzeug.typ],
                                ['Serien-Nr.', fahrzeug.seriennummer],
                                ['Farbe', fahrzeug.farbe],
                                ['Kennzeichen', fahrzeug.kennzeichen],
                                ['Plattformhöhe', fahrzeug.plattformhoehe],
                                ['Masse (LxBxH)', fahrzeug.masse],
                                ['Leistung', fahrzeug.leistung],
                                ['Gewicht', fahrzeug.gewicht],
                                ['Nutzlast', fahrzeug.nutzlast],
                                ['Antrieb', fahrzeug.antrieb],
                                ['Baujahr', fahrzeug.baujahr?.toString()],
                                ['Kaufjahr', fahrzeug.kaufjahr],
                                ['Geprüft bis', fahrzeug.geprueftBis],
                                ['Abgaswartung', fahrzeug.abgaswartung],
                                ['Spez. Hinweis', fahrzeug.spezHinweis],
                                ['Bemerkung', fahrzeug.bemerkung],
                            ].filter(([, val]) => val).map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                                    <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reservierungen for this machine */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CalendarPlus className="h-5 w-5 text-primary" />
                            Reservierungen
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)} className="font-bold">
                            <CalendarPlus className="h-4 w-4 mr-1" />
                            Neue Reservierung
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {reservierungen.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground font-medium">Keine Reservierungen für diese Maschine.</p>
                        </div>
                    ) : (
                        <Table className="border-none rounded-none">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Projekt</TableHead>
                                    <TableHead>Baustelle</TableHead>
                                    <TableHead>Von</TableHead>
                                    <TableHead>Bis</TableHead>
                                    <TableHead>Durch</TableHead>
                                    <TableHead className="text-right">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reservierungen.map(res => (
                                    <TableRow key={res.id}>
                                        <TableCell><span className="text-muted-foreground font-medium">{res.projektName || '–'}</span></TableCell>
                                        <TableCell><span className="font-semibold text-foreground">{res.baustelle}</span></TableCell>
                                        <TableCell><span className="text-xs font-semibold text-muted-foreground">{res.reserviertAb}</span></TableCell>
                                        <TableCell><span className="text-xs font-semibold text-muted-foreground">{res.reserviertBis || 'offen'}</span></TableCell>
                                        <TableCell><span className="text-muted-foreground font-medium">{res.reserviertDurch || '–'}</span></TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 text-muted-foreground/50 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDeleteReservierung(res.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Reservation Modal */}
            <ReservierungModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveReservierung}
                fahrzeug={fahrzeug}
            />
        </div>
    );
}
