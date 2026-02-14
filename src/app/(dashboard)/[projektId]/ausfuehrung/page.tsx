'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockStore } from '@/lib/mock/store';
import { Teilsystem, Projekt } from '@/types';
import {
    Search, Filter, Layers, MapPin, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AusfuehrungPage() {
    const { projektId } = useParams() as { projektId: string };
    const router = useRouter();
    const [items, setItems] = useState<Teilsystem[]>([]);
    const [project, setProject] = useState<Projekt | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setItems(mockStore.getTeilsysteme(projektId));
            const allProjekte = mockStore.getProjekte();
            setProject(allProjekte.find((p: Projekt) => p.id === projektId) || null);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [projektId]);

    const filteredItems = items.filter(item =>
        (item.teilsystemNummer?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (item.name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] space-y-3">
            {/* Project Context Header (Compact) */}
            {project && (
                <div className="bg-slate-900 text-white rounded-lg px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center shadow-md gap-4">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                        <div>
                            <div className="text-[9px] font-bold text-primary uppercase tracking-wider">Projekt</div>
                            <div className="text-xl font-black">{project.projektname}</div>
                        </div>
                        <div className="text-xs text-slate-400 flex gap-4 items-baseline">
                            <MapPin className="h-3 w-3 mr-1 inline-block" />
                            <span>{project.plz} {project.ort}</span>
                        </div>
                    </div>
                    <div className="flex gap-8 text-xs self-end md:self-auto">
                        <div>
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Kommission</span>
                            <span className="font-bold text-sm block font-mono">#{project.projektnummer}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Bauleiter</span>
                            <span className="font-bold text-sm block">{project.bauleiter || 'n/a'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Polier</span>
                            <span className="font-bold text-sm block">{project.polier || 'n/a'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Projektleiter</span>
                            <span className="font-bold text-sm block">{project.projektleiter || 'n/a'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">BIM Konst.</span>
                            <span className="font-bold text-sm block">{project.bimKonstrukteur || 'n/a'}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight dark:text-slate-100">Ausführung</h2>
                    <p className="text-slate-500 font-medium text-xs">Schreibgeschützte Ansicht der Ausführungskontrolle.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-bold h-9 pointer-events-none opacity-50">
                        <Layers className="h-4 w-4" />
                        Lese-Modus
                    </Button>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-3 px-4 border-b">
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Suche nach Nummer oder Name..."
                                className="pl-10 h-9 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 font-bold h-9">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-auto">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="text-sm font-bold text-slate-400">Daten werden geladen...</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="overflow-x-auto max-w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-14 h-8 px-2 font-bold text-foreground text-center text-[10px]">System-Nr.</TableHead>
                                        <TableHead className="w-10 h-8 px-2 font-bold text-foreground text-[10px]">KS</TableHead>
                                        <TableHead className="min-w-[140px] h-8 px-2 font-bold text-foreground text-[10px]">Bezeichnung</TableHead>
                                        <TableHead className="max-w-[100px] h-8 px-2 font-bold text-foreground text-[10px]">Bemerkung</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground whitespace-nowrap text-[10px]">Eröffnet am</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground whitespace-nowrap text-[10px]">Von</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground whitespace-nowrap text-[10px]">Montage</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground text-center text-[10px]">Frist</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground whitespace-nowrap text-[10px]">Plan-Abgabe</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground text-[10px]">P-Status</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground text-[10px]">WEMA</TableHead>
                                        <TableHead className="h-8 px-2 font-bold text-foreground text-[10px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="group hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/${projektId}/teilsysteme/${item.id}?mode=readOnly`)}
                                        >
                                            <TableCell className="p-2 font-medium text-foreground text-center text-xs">{item.teilsystemNummer || '—'}</TableCell>
                                            <TableCell className="p-2 font-bold text-muted-foreground text-xs">{item.ks || '1'}</TableCell>
                                            <TableCell className="p-2 font-medium text-foreground text-xs min-w-[140px]">{item.name}</TableCell>
                                            <TableCell className="p-2 text-muted-foreground text-[10px] italic max-w-[100px] truncate" title={item.bemerkung || ''}>{item.bemerkung || '—'}</TableCell>
                                            <TableCell className="p-2 text-[10px] font-bold text-muted-foreground whitespace-nowrap">{item.eroeffnetAm || '17.07.2025'}</TableCell>
                                            <TableCell className="p-2 text-[10px] font-black text-foreground whitespace-nowrap">{item.eroeffnetDurch || 'Moritz'}</TableCell>
                                            <TableCell className="p-2 text-[10px] font-black text-orange-600 whitespace-nowrap">{item.montagetermin || '—'}</TableCell>
                                            <TableCell className="p-2 text-[10px] font-bold text-muted-foreground text-center whitespace-nowrap">{item.lieferfrist || '—'}</TableCell>
                                            <TableCell className="p-2 text-[10px] font-bold text-muted-foreground whitespace-nowrap">{item.abgabePlaner || '—'}</TableCell>
                                            <TableCell className="p-2">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                    item.planStatus === 'fertig' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {item.planStatus || 'offen'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="p-2 text-center text-muted-foreground">
                                                {item.wemaLink ? (
                                                    <LinkIcon className="h-3 w-3 text-primary inline-block" />
                                                ) : (
                                                    <span className="text-muted-foreground/30">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <StatusBadge status={item.status} className="scale-90 origin-left" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                            <Layers className="mx-auto h-12 w-12 text-slate-200 dark:text-slate-800 mb-4" />
                            <h3 className="text-lg font-bold text-slate-400">Keine Daten gefunden</h3>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

