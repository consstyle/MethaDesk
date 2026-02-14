'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Calendar, Search, Filter, ArrowUpDown,
    Clock, CheckCircle2, AlertCircle, FileText,
    ChevronRight, Download
} from 'lucide-react';
import { mockStore } from '@/lib/mock/store';
import { Teilsystem } from '@/types';
import { cn } from '@/lib/utils';

export default function PlannerPage() {
    const { projektId } = useParams() as { projektId: string };
    const [items, setItems] = useState<Teilsystem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const subsystems = mockStore.getTeilsysteme(projektId);
            setItems(subsystems);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [projektId]);

    const filteredItems = items.filter(item =>
        (item.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (item.teilsystemNummer?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const getPlanStatusColor = (status: string | undefined) => {
        if (status === 'fertig') return 'bg-green-100 text-green-700 border-green-200';
        return 'bg-muted text-muted-foreground border-border';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Planer</h1>
                    <p className="text-slate-500 font-medium mt-1">Überwachen Sie Meilensteine, Planabgaben und Lieferfristen.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="font-bold gap-2">
                        <Download className="h-4 w-4" />
                        Exportieren
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Offene Pläne', value: items.filter(i => i.planStatus !== 'fertig').length, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Fristen diese Woche', value: '2', icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Abgeschlossen', value: items.filter(i => i.planStatus === 'fertig').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-xl overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100 bg-white py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Planungsübersicht
                    </CardTitle>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Suche..."
                                className="pl-10 h-10 border-slate-100 bg-slate-50 focus-visible:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-slate-100">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">System</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Bezeichnung</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Plan-Abgabe</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Montagetermin</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Lieferfrist</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">P-Status</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase text-muted-foreground text-right">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={7} className="h-12 animate-pulse bg-muted/50" />
                                        </TableRow>
                                    ))
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-mono text-xs font-bold text-muted-foreground">#{item.teilsystemNummer}</TableCell>
                                            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {item.abgabePlaner || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm font-bold text-orange-600">
                                                {item.montagetermin || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {item.lieferfrist || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("font-black text-[10px] uppercase px-2 py-0.5", getPlanStatusColor(item.planStatus))}>
                                                    {item.planStatus || 'offen'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-bold">
                                            Keine Daten gefunden
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
