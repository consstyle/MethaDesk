import { supabase } from '@/lib/supabase/client';
import { FleetMapper, ReservationMapper } from './mappers';
import { Fahrzeug, FahrzeugReservierung } from '@/types';

export const FleetService = {
    async getFahrzeuge(): Promise<Fahrzeug[]> {
        const { data, error } = await supabase
            .from('fahrzeuge')
            .select('*')
            .order('bezeichnung');

        if (error) throw error;
        return data.map(FleetMapper.toApp);
    },

    async getFahrzeugById(id: string): Promise<Fahrzeug | null> {
        const { data, error } = await supabase
            .from('fahrzeuge')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return FleetMapper.toApp(data);
    },

    async createFahrzeug(fahrzeug: Partial<Fahrzeug>): Promise<Fahrzeug> {
        const dbPayload = FleetMapper.toDB(fahrzeug);
        const { data, error } = await supabase
            .from('fahrzeuge')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;
        return FleetMapper.toApp(data);
    },

    async updateFahrzeug(id: string, updates: Partial<Fahrzeug>): Promise<Fahrzeug> {
        const dbPayload = FleetMapper.toDB(updates);
        const { data, error } = await supabase
            .from('fahrzeuge')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return FleetMapper.toApp(data);
    },

    async deleteFahrzeug(id: string): Promise<void> {
        const { error } = await supabase
            .from('fahrzeuge')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Reservations
    async getReservierungen(): Promise<FahrzeugReservierung[]> {
        const { data, error } = await supabase
            .from('fahrzeug_reservierungen')
            .select('*')
            .order('reserviert_ab');

        if (error) throw error;
        return data.map(ReservationMapper.toApp);
    },

    async getReservierungenByFahrzeug(fahrzeugId: string): Promise<FahrzeugReservierung[]> {
        const { data, error } = await supabase
            .from('fahrzeug_reservierungen')
            .select('*')
            .eq('fahrzeug_id', fahrzeugId)
            .order('reserviert_ab');

        if (error) throw error;
        return data.map(ReservationMapper.toApp);
    },

    async createReservierung(reservierung: Partial<FahrzeugReservierung>): Promise<FahrzeugReservierung> {
        const dbPayload = ReservationMapper.toDB(reservierung);
        const { data, error } = await supabase
            .from('fahrzeug_reservierungen')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;
        return ReservationMapper.toApp(data);
    },

    async deleteReservierung(id: string): Promise<void> {
        const { error } = await supabase
            .from('fahrzeug_reservierungen')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
