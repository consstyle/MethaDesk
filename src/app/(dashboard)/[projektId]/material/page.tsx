'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockStore } from '@/lib/mock/store';
import { Material } from '@/types';
import { Plus, Search, Package, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MaterialListPage() {
    const { projektId } = useParams() as { projektId: string };
    const [items, setItems] = useState<Material[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setItems(mockStore.getMaterial());
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.hersteller.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Material</h1>
                    <p className="text-muted-foreground font-medium mt-1">Bestands- und Bedarfsliste der Materialien.</p>
                </div>
                <Link href={`/${projektId}/material/erfassen`}>
                    <Button className="font-bold shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5 mr-2" />
                        Material erfassen
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Nach Material oder Hersteller suchen..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Artikel</TableHead>
                                    <TableHead>Hersteller</TableHead>
                                    <TableHead>Artikelnummer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id} className="group">
                                        <TableCell className="font-bold text-foreground">{item.name}</TableCell>
                                        <TableCell className="font-medium text-muted-foreground">{item.hersteller}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground/80">{item.artikelnummer}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/${projektId}/material/${item.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-muted hover:shadow-sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/${projektId}/material/${item.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground/50 hover:text-red-600 hover:bg-red-50 hover:shadow-sm"
                                                    onClick={() => {
                                                        if (confirm(`Sind Sie sicher, dass Sie "${item.name}" löschen möchten?`)) {
                                                            const currentItems = mockStore.getMaterial();
                                                            const newItems = currentItems.filter((i: Material) => i.id !== item.id);
                                                            mockStore.saveMaterial(newItems);
                                                            setItems(newItems);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-20 text-center">
                            <Package className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-400">Kein Material gefunden</h3>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
