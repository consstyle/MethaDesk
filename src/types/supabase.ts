export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    vorname: string | null
                    nachname: string | null
                    email: string | null
                    abteilung: string | null
                    rolle: string
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    vorname?: string | null
                    nachname?: string | null
                    email?: string | null
                    abteilung?: string | null
                    rolle?: string
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    vorname?: string | null
                    nachname?: string | null
                    email?: string | null
                    abteilung?: string | null
                    rolle?: string
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projekte: {
                Row: {
                    id: string
                    projektnummer: string
                    projektname: string
                    strasse: string | null
                    plz: string | null
                    ort: string
                    kanton: string
                    status: string
                    image_url: string | null
                    created_by: string | null
                    projektleiter: string | null
                    bauleiter: string | null
                    polier: string | null
                    bim_konstrukteur: string | null
                    deviseur: string | null
                    einkauf: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    projektnummer: string
                    projektname: string
                    strasse?: string | null
                    plz?: string | null
                    ort: string
                    kanton: string
                    status?: string
                    image_url?: string | null
                    created_by?: string | null
                    projektleiter?: string | null
                    bauleiter?: string | null
                    polier?: string | null
                    bim_konstrukteur?: string | null
                    deviseur?: string | null
                    einkauf?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    projektnummer?: string
                    projektname?: string
                    strasse?: string | null
                    plz?: string | null
                    ort?: string
                    kanton?: string
                    status?: string
                    image_url?: string | null
                    created_by?: string | null
                    projektleiter?: string | null
                    bauleiter?: string | null
                    polier?: string | null
                    bim_konstrukteur?: string | null
                    deviseur?: string | null
                    einkauf?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            fahrzeuge: {
                Row: {
                    id: string
                    bezeichnung: string
                    kategorie: string
                    inventarnummer: string
                    fabrikat: string | null
                    typ: string | null
                    seriennummer: string | null
                    farbe: string | null
                    kennzeichen: string | null
                    plattformhoehe: string | null
                    masse: string | null
                    leistung: string | null
                    gewicht: string | null
                    nutzlast: string | null
                    antrieb: string | null
                    baujahr: number | null
                    spez_hinweis: string | null
                    kaufjahr: string | null
                    geprueft_bis: string | null
                    abgaswartung: string | null
                    status: string
                    bemerkung: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    bezeichnung: string
                    kategorie: string
                    inventarnummer: string
                    fabrikat?: string | null
                    typ?: string | null
                    seriennummer?: string | null
                    farbe?: string | null
                    kennzeichen?: string | null
                    plattformhoehe?: string | null
                    masse?: string | null
                    leistung?: string | null
                    gewicht?: string | null
                    nutzlast?: string | null
                    antrieb?: string | null
                    baujahr?: number | null
                    spez_hinweis?: string | null
                    kaufjahr?: string | null
                    geprueft_bis?: string | null
                    abgaswartung?: string | null
                    status?: string
                    bemerkung?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    bezeichnung?: string
                    kategorie?: string
                    inventarnummer?: string
                    fabrikat?: string | null
                    typ?: string | null
                    seriennummer?: string | null
                    farbe?: string | null
                    kennzeichen?: string | null
                    plattformhoehe?: string | null
                    masse?: string | null
                    leistung?: string | null
                    gewicht?: string | null
                    nutzlast?: string | null
                    antrieb?: string | null
                    baujahr?: number | null
                    spez_hinweis?: string | null
                    kaufjahr?: string | null
                    geprueft_bis?: string | null
                    abgaswartung?: string | null
                    status?: string
                    bemerkung?: string | null
                    created_at?: string
                }
            }
            fahrzeug_reservierungen: {
                Row: {
                    id: string
                    fahrzeug_id: string
                    projekt_id: string | null
                    baustelle: string | null
                    reserviert_ab: string
                    reserviert_bis: string | null
                    reserviert_durch: string | null
                    bemerkung: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    fahrzeug_id: string
                    projekt_id?: string | null
                    baustelle?: string | null
                    reserviert_ab: string
                    reserviert_bis?: string | null
                    reserviert_durch?: string | null
                    bemerkung?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    fahrzeug_id?: string
                    projekt_id?: string | null
                    baustelle?: string | null
                    reserviert_ab?: string
                    reserviert_bis?: string | null
                    reserviert_durch?: string | null
                    bemerkung?: string | null
                    created_at?: string
                }
            }
            lieferanten: {
                Row: {
                    id: string
                    name: string
                    kontakt: string | null
                    email: string | null
                    telefon: string | null
                    adresse: string | null
                    notizen: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    kontakt?: string | null
                    email?: string | null
                    telefon?: string | null
                    adresse?: string | null
                    notizen?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    kontakt?: string | null
                    email?: string | null
                    telefon?: string | null
                    adresse?: string | null
                    notizen?: string | null
                    created_at?: string
                }
            }
            teilsysteme: {
                Row: {
                    id: string
                    projekt_id: string
                    teilsystem_nummer: string | null
                    name: string
                    beschreibung: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    projekt_id: string
                    teilsystem_nummer?: string | null
                    name: string
                    beschreibung?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    projekt_id?: string
                    teilsystem_nummer?: string | null
                    name?: string
                    beschreibung?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            positionen: {
                Row: {
                    id: string
                    teilsystem_id: string
                    positionsnummer: string | null
                    name: string
                    menge: number | null
                    einheit: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    teilsystem_id: string
                    positionsnummer?: string | null
                    name: string
                    menge?: number | null
                    einheit?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    teilsystem_id?: string
                    positionsnummer?: string | null
                    name?: string
                    menge?: number | null
                    einheit?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            material: {
                Row: {
                    id: string
                    position_id: string | null
                    lieferant_id: string | null
                    name: string
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    position_id?: string | null
                    lieferant_id?: string | null
                    name: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    position_id?: string | null
                    lieferant_id?: string | null
                    name?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
