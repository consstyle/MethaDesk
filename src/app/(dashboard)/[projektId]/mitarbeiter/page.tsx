'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { Mitarbeiter } from '@/types';
import { Plus, User, Mail, Shield, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MitarbeiterListPage() {
    const { projektId } = useParams() as { projektId: string };
    const [items, setItems] = useState<Mitarbeiter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setItems(mockStore.getMitarbeiter());
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Mitarbeiter</h1>
                    <p className="text-muted-foreground font-medium mt-1">Teammitglieder, die diesem Projekt zugewiesen sind.</p>
                </div>
                <Link href={`/${projektId}/mitarbeiter/erfassen`}>
                    <Button className="font-bold shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5 mr-2" />
                        Mitarbeiter hinzufügen
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <Table className="border-none rounded-none">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mitarbeiter</TableHead>
                                    <TableHead>Rolle</TableHead>
                                    <TableHead>E-Mail</TableHead>
                                    <TableHead className="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="font-bold text-foreground">{item.vorname} {item.nachname}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Shield className="h-3.5 w-3.5" />
                                                {item.rolle}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Mail className="h-3.5 w-3.5" />
                                                {item.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/${projektId}/mitarbeiter/${item.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-muted hover:shadow-sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/${projektId}/mitarbeiter/${item.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground/50 hover:text-red-600 hover:bg-red-50 hover:shadow-sm"
                                                    onClick={() => {
                                                        if (confirm(`Sind Sie sicher, dass Sie "${item.vorname} ${item.nachname}" löschen möchten?`)) {
                                                            const currentItems = mockStore.getMitarbeiter();
                                                            const newItems = currentItems.filter((i: Mitarbeiter) => i.id !== item.id);
                                                            mockStore.saveMitarbeiter(newItems);
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
