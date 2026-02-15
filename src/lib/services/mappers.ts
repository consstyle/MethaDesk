import { Database } from '@/types/supabase';
import { Fahrzeug, FahrzeugReservierung, Projekt, Mitarbeiter } from '@/types';

type DBProjekte = Database['public']['Tables']['projekte']['Row'];
type DBFahrzeuge = Database['public']['Tables']['fahrzeuge']['Row'];
type DBReservierungen = Database['public']['Tables']['fahrzeug_reservierungen']['Row'];
type DBProfiles = Database['public']['Tables']['profiles']['Row'];

export const ProjectMapper = {
    toApp: (db: DBProjekte): Projekt => ({
        id: db.id,
        projektnummer: db.projektnummer,
        projektname: db.projektname,
        strasse: db.strasse || undefined,
        plz: db.plz || undefined,
        ort: db.ort,
        kanton: db.kanton,
        status: db.status as any,
        imageUrl: db.image_url || undefined,
        createdAt: db.created_at,
        createdBy: db.created_by || undefined,
        projektleiter: db.projektleiter || undefined,
        deviseur: db.deviseur || undefined,
        bimKonstrukteur: db.bim_konstrukteur || undefined,
        bauleiter: db.bauleiter || undefined,
        polier: db.polier || undefined,
        einkauf: db.einkauf || undefined,
    }),
    toDB: (app: Partial<Projekt>) => ({
        // Used for inserts/updates
        projektnummer: app.projektnummer,
        projektname: app.projektname,
        strasse: app.strasse,
        plz: app.plz,
        ort: app.ort,
        kanton: app.kanton,
        status: app.status,
        image_url: app.imageUrl,
        created_by: app.createdBy,
        projektleiter: app.projektleiter,
        bauleiter: app.bauleiter,
        polier: app.polier,
        bim_konstrukteur: app.bimKonstrukteur,
        deviseur: app.deviseur,
        einkauf: app.einkauf,
    })
};

export const FleetMapper = {
    toApp: (db: DBFahrzeuge): Fahrzeug => ({
        id: db.id,
        bezeichnung: db.bezeichnung,
        kategorie: db.kategorie as any,
        inventarnummer: db.inventarnummer,
        fabrikat: db.fabrikat || undefined,
        typ: db.typ || undefined,
        seriennummer: db.seriennummer || undefined,
        farbe: db.farbe || undefined,
        kennzeichen: db.kennzeichen || undefined,
        plattformhoehe: db.plattformhoehe || undefined,
        masse: db.masse || undefined,
        leistung: db.leistung || undefined,
        gewicht: db.gewicht || undefined,
        nutzlast: db.nutzlast || undefined,
        antrieb: db.antrieb || undefined,
        baujahr: db.baujahr || undefined,
        spezHinweis: db.spez_hinweis || undefined,
        kaufjahr: db.kaufjahr || undefined,
        geprueftBis: db.geprueft_bis || undefined,
        abgaswartung: db.abgaswartung || undefined,
        status: db.status as any,
        bemerkung: db.bemerkung || undefined,
    }),
    toDB: (app: Partial<Fahrzeug>) => ({
        bezeichnung: app.bezeichnung,
        kategorie: app.kategorie,
        inventarnummer: app.inventarnummer,
        fabrikat: app.fabrikat,
        typ: app.typ,
        seriennummer: app.seriennummer,
        farbe: app.farbe,
        kennzeichen: app.kennzeichen,
        plattformhoehe: app.plattformhoehe,
        masse: app.masse,
        leistung: app.leistung,
        gewicht: app.gewicht,
        nutzlast: app.nutzlast,
        antrieb: app.antrieb,
        baujahr: app.baujahr,
        spez_hinweis: app.spezHinweis,
        kaufjahr: app.kaufjahr,
        geprueft_bis: app.geprueftBis,
        abgaswartung: app.abgaswartung,
        status: app.status,
        bemerkung: app.bemerkung,
    })
};

export const ReservationMapper = {
    toApp: (db: DBReservierungen): FahrzeugReservierung => ({
        id: db.id,
        fahrzeugId: db.fahrzeug_id,
        projektId: db.projekt_id || '', // Handle null
        baustelle: db.baustelle || '',
        reserviertAb: db.reserviert_ab,
        reserviertBis: db.reserviert_bis || undefined,
        reserviertDurch: db.reserviert_durch || undefined,
        bemerkung: db.bemerkung || undefined,
        createdAt: db.created_at,
    }),
    toDB: (app: Partial<FahrzeugReservierung>) => ({
        fahrzeug_id: app.fahrzeugId,
        projekt_id: app.projektId || null,
        baustelle: app.baustelle,
        reserviert_ab: app.reserviertAb,
        reserviert_bis: app.reserviertBis,
        reserviert_durch: app.reserviertDurch,
        bemerkung: app.bemerkung,
    })
};

type DBLieferanten = Database['public']['Tables']['lieferanten']['Row'];

export const SupplierMapper = {
    toApp: (db: DBLieferanten): any => ({ // Type as Lieferant from @/types but avoiding circular dep issues if any, using 'any' temporarily or import correctly.
        // Actually imports are fine.
        id: db.id,
        name: db.name,
        kontakt: db.kontakt || '',
        email: db.email || '',
        telefon: db.telefon || '',
        adresse: db.adresse || undefined,
        notizen: db.notizen || undefined,
    }),
    toDB: (app: any) => ({
        name: app.name,
        kontakt: app.kontakt,
        email: app.email,
        telefon: app.telefon,
        adresse: app.adresse,
        notizen: app.notizen,
    })
};
