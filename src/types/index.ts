// src/types/index.ts

export type UserRole = 'admin' | 'projektleiter' | 'mitarbeiter';

export interface User {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  department?: string;
  role: UserRole;
}

export type ProjektStatus = 'offen' | 'in arbeit' | 'abgeschlossen' | 'pausiert';

export interface Projekt {
  id: string;
  projektnummer: string;
  projektname: string;
  strasse?: string;
  plz?: string;
  ort: string;
  kanton: string;
  projektleiter?: string;
  deviseur?: string;
  bimKonstrukteur?: string;
  bauleiter?: string;
  polier?: string;
  einkauf?: string;
  status: ProjektStatus;
  createdAt: string;
}

export type ItemStatus = 'offen' | 'bestellt' | 'geliefert' | 'verbaut' | 'abgeschlossen';

export interface Teilsystem {
  id: string;
  projektId: string;
  ks?: string;
  teilsystemNummer?: string;
  name: string;
  beschreibung: string;
  bemerkung?: string;
  eroeffnetAm?: string;
  eroeffnetDurch?: string;
  montagetermin?: string;
  lieferfrist?: string;
  abgabePlaner?: string;
  planStatus?: string;
  wemaLink?: string;
  status: ItemStatus;
}

export interface Position {
  id: string;
  teilsystemId: string;
  name: string;
  menge: number;
  einheit: string;
  status: ItemStatus;
}

export interface Material {
  id: string;
  positionId?: string;
  name: string;
  hersteller: string;
  artikelnummer: string;
  status: ItemStatus;
}

export interface Lieferant {
  id: string;
  name: string;
  kontakt: string;
  email: string;
  telefon: string;
}

export interface Mitarbeiter {
  id: string;
  vorname: string;
  nachname: string;
  rolle: string;
  email: string;
  abteilung?: string;
  image?: string;
}
