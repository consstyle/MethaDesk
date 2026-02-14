'use client';

import React, { useEffect, useState } from 'react';
import { useProjekt } from '@/lib/context/ProjektContext';
import { mockStore } from '@/lib/mock/store';
import { Projekt } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function ProjektePage() {
    const { setActiveProjekt, currentUser, loading } = useProjekt();
    const [projekte, setProjekte] = useState<Projekt[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            setProjekte(mockStore.getProjekte());
        }
    }, [loading]);

    const handleSelect = (p: Projekt) => {
        setActiveProjekt(p);
        router.push(`/${p.id}`);
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-background pt-16">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Projekt auswählen</h1>
                        <p className="text-muted-foreground font-medium mt-1">Wählen Sie ein Projekt aus, um mit der Verwaltung zu beginnen.</p>
                    </div>

                    {(currentUser?.role === 'admin' || currentUser?.role === 'projektleiter') && (
                        <Button
                            className="font-bold gap-2 shadow-lg shadow-primary/20"
                            onClick={() => router.push('/projekte/erfassen')}
                        >
                            <Plus className="h-5 w-5" />
                            Neues Projekt
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projekte.map((p) => (
                        <Card key={p.id} className="group hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                                        {p.projektnummer}
                                    </span>
                                    <Badge variant={p.status === 'in arbeit' ? 'info' : 'warning'}>
                                        {p.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold text-foreground line-clamp-1">
                                    {p.projektname}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                    <span>{p.ort}, {p.kanton}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                    <Calendar className="h-4 w-4 text-muted-foreground/60" />
                                    <span>Erstellt am {new Date(p.createdAt).toLocaleDateString('de-CH')}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button
                                    onClick={() => handleSelect(p)}
                                    className="w-full font-bold group-hover:bg-primary group-hover:shadow-primary/20"
                                    variant="secondary"
                                >
                                    Projekt öffnen
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {(currentUser?.role === 'admin' || currentUser?.role === 'projektleiter') && (
                        <Card
                            className="border-dashed border-2 border-border bg-transparent shadow-none hover:border-primary/50 hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center p-8 transition-colors group"
                            onClick={() => router.push('/projekte/erfassen')}
                        >
                            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                                <Plus className="h-8 w-8" />
                            </div>
                            <p className="font-bold text-foreground/70 group-hover:text-primary">Neues Projekt erstellen</p>
                            <p className="text-xs text-muted-foreground mt-1">Legen Sie ein neues Bauvorhaben an</p>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
