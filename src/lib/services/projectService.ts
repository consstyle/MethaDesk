import { supabase } from '@/lib/supabase/client';
import { ProjectMapper } from './mappers';
import { Projekt } from '@/types';

export const ProjectService = {
    async getProjekte(): Promise<Projekt[]> {
        const { data, error } = await supabase
            .from('projekte')
            .select('*')
            .order('projektnummer');

        if (error) throw error;
        return data.map(ProjectMapper.toApp);
    },

    async getProjektById(id: string): Promise<Projekt | null> {
        const { data, error } = await supabase
            .from('projekte')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return ProjectMapper.toApp(data);
    },

    async createProjekt(projekt: Partial<Projekt>): Promise<Projekt> {
        const dbPayload = ProjectMapper.toDB(projekt);
        const { data, error } = await supabase
            .from('projekte')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;
        return ProjectMapper.toApp(data);
    },

    async updateProjekt(id: string, updates: Partial<Projekt>): Promise<Projekt> {
        const dbPayload = ProjectMapper.toDB(updates);
        const { data, error } = await supabase
            .from('projekte')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return ProjectMapper.toApp(data);
    }
};
