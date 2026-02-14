'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/mock/store';
import { ArrowLeft, Save, Building2, MapPin, User, Hash } from 'lucide-react';
import Link from 'next/link';

const projektSchema = z.object({
    projektnummer: z.string().min(1, 'Projektnummer ist erforderlich'),
    projektname: z.string().min(3, 'Projektname muss mindestens 3 Zeichen lang sein'),
    strasse: z.string().optional(),
    plz: z.string().min(4, 'PLZ ist erforderlich'),
    ort: z.string().min(1, 'Ort ist erforderlich'),
    kanton: z.string().min(2, 'Kanton ist erforderlich'),
    projektleiter: z.string().min(1, 'Projektleiter ist erforderlich'),
    bauleiter: z.string().optional(),
    polier: z.string().optional(),
    bimKonstrukteur: z.string().optional(),
    status: z.string().min(1, 'Status ist erforderlich'),
});

type ProjektValues = z.infer<typeof projektSchema>;

export default function ProjektErfassenPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProjektValues>({
        resolver: zodResolver(projektSchema),
        defaultValues: {
            status: 'offen',
            kanton: 'ZH',
        }
    });

    const onSubmit = async (data: ProjektValues) => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const all = mockStore.getProjekte();
        const newProj = {
            id: `p${Math.floor(1000 + Math.random() * 9000)}`,
            ...data,
            createdAt: new Date().toISOString()
        };

        mockStore.saveProjekte([...all, newProj]);
        router.push(`/projekte`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-12 px-4 pb-20">
            <Link href="/projekte" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Projektwahl
            </Link>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Neues Projekt erfassen</h1>
                    <p className="text-slate-500 font-medium">Legen Sie ein neues Bauvorhaben im System an.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card className="shadow-xl border-none overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <Building2 className="h-6 w-6 text-primary" />
                            Stammdaten & Standort
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <Input
                                    label="Projektnummer *"
                                    placeholder="z.B. 2024-001"
                                    {...register('projektnummer')}
                                    error={errors.projektnummer?.message}
                                />
                                <Hash className="absolute right-3 top-[38px] h-4 w-4 text-slate-300" />
                            </div>
                            <div className="relative">
                                <Input
                                    label="Projektname *"
                                    placeholder="Name des Bauvorhabens"
                                    {...register('projektname')}
                                    error={errors.projektname?.message}
                                />
                                <Building2 className="absolute right-3 top-[38px] h-4 w-4 text-slate-300" />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Standort
                            </h3>
                            <Input
                                label="Strasse / Hausnummer"
                                placeholder="Musterstrasse 123"
                                {...register('strasse')}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input
                                    label="PLZ *"
                                    placeholder="8000"
                                    {...register('plz')}
                                    error={errors.plz?.message}
                                />
                                <Input
                                    label="Ort *"
                                    placeholder="Zürich"
                                    {...register('ort')}
                                    error={errors.ort?.message}
                                />
                                <Input
                                    label="Kanton *"
                                    placeholder="ZH"
                                    {...register('kanton')}
                                    error={errors.kanton?.message}
                                />
                            </div>
                        </div>

                        {/* Staff */}
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Verantwortlichkeiten
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Projektleiter *"
                                    placeholder="Name"
                                    {...register('projektleiter')}
                                    error={errors.projektleiter?.message}
                                />
                                <Input
                                    label="Bauleiter"
                                    placeholder="Name"
                                    {...register('bauleiter')}
                                />
                                <Input
                                    label="Polier"
                                    placeholder="Name"
                                    {...register('polier')}
                                />
                                <Input
                                    label="BIM Konstrukteur"
                                    placeholder="Name"
                                    {...register('bimKonstrukteur')}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <Select
                                label="Status *"
                                options={[
                                    { label: 'Offen', value: 'offen' },
                                    { label: 'In Arbeit', value: 'in arbeit' },
                                    { label: 'Abgeschlossen', value: 'abgeschlossen' },
                                ]}
                                {...register('status')}
                                error={errors.status?.message}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t border-slate-100 p-8 flex justify-end gap-4">
                        <Link href="/projekte">
                            <Button type="button" variant="outline" className="font-bold h-12 px-8">Abbrechen</Button>
                        </Link>
                        <Button type="submit" className="font-bold h-12 px-10 shadow-lg shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? 'Wird erstellt...' : (
                                <span className="flex items-center gap-2">
                                    <Save className="h-5 w-5" />
                                    Projekt erstellen
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
