'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

export default function FuhrparkPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Fuhrpark</h1>
                <p className="text-muted-foreground font-medium mt-1">Fahrzeugverwaltung und Disposition.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Fahrzeugübersicht
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96 bg-muted/30 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground font-bold">Fuhrpark Modul wird geladen...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
