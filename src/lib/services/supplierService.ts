import { supabase } from '@/lib/supabase/client';
import { SupplierMapper } from './mappers';
import { Lieferant } from '@/types';

export const SupplierService = {
    async getLieferanten(): Promise<Lieferant[]> {
        const { data, error } = await supabase
            .from('lieferanten')
            .select('*')
            .order('name');

        if (error) throw error;
        return data.map(SupplierMapper.toApp);
    },

    async getLieferantById(id: string): Promise<Lieferant | null> {
        const { data, error } = await supabase
            .from('lieferanten')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return SupplierMapper.toApp(data);
    },

    async createLieferant(lieferant: Partial<Lieferant>): Promise<Lieferant> {
        const dbPayload = SupplierMapper.toDB(lieferant);
        const { data, error } = await supabase
            .from('lieferanten')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;
        return SupplierMapper.toApp(data);
    },

    async updateLieferant(id: string, updates: Partial<Lieferant>): Promise<Lieferant> {
        const dbPayload = SupplierMapper.toDB(updates);
        const { data, error } = await supabase
            .from('lieferanten')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return SupplierMapper.toApp(data);
    },

    async deleteLieferant(id: string): Promise<void> {
        const { error } = await supabase
            .from('lieferanten')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
