import { supabase } from '@/lib/supabase/client';

export const SubsystemService = {
    async getTeilsystemCount(projektId: string): Promise<number> {
        const { count, error } = await supabase
            .from('teilsysteme')
            .select('*', { count: 'exact', head: true })
            .eq('projekt_id', projektId);

        if (error) throw error;
        return count || 0;
    },

    async getPositionCount(projektId: string): Promise<number> {
        // Positionen are linked to Teilsysteme, which are linked to Projekte.
        // Needs a join or we can cheat if we had projekt_id on positionen (we don't).
        // Query: Select count of positionen where teilsystem_id in (select id from teilsysteme where projekt_id = ?)

        const { count, error } = await supabase
            .from('positionen')
            .select('*, teilsysteme!inner(projekt_id)', { count: 'exact', head: true })
            .eq('teilsysteme.projekt_id', projektId);

        if (error) throw error;
        return count || 0;
    },

    async getMaterialCount(projektId: string): Promise<number> {
        // Material -> Positionen -> Teilsysteme -> Projekt
        const { count, error } = await supabase
            .from('material')
            .select('*, positionen!inner(teilsysteme!inner(projekt_id))', { count: 'exact', head: true })
            .eq('positionen.teilsysteme.projekt_id', projektId);

        if (error) throw error;
        return count || 0;
    },

    async getRecentActivity(projektId: string) {
        // Fetch latest 1 from each to simulate activity stream
        const [teilsysteme, positionen, material] = await Promise.all([
            supabase.from('teilsysteme').select('name, created_at, id').eq('projekt_id', projektId).order('created_at', { ascending: false }).limit(1),
            supabase.from('positionen').select('name, created_at, id, teilsysteme!inner(projekt_id)').eq('teilsysteme.projekt_id', projektId).order('created_at', { ascending: false }).limit(1),
            supabase.from('material').select('name, created_at, id, positionen!inner(teilsysteme!inner(projekt_id))').eq('positionen.teilsysteme.projekt_id', projektId).order('created_at', { ascending: false }).limit(1)
        ]);

        const activities = [
            ...(teilsysteme.data || []).map(i => ({ action: 'Teilsystem erstellt', target: i.name, time: i.created_at, link: `/${projektId}/teilsysteme` })),
            ...(positionen.data || []).map(i => ({ action: 'Position erstellt', target: i.name, time: i.created_at, link: `/${projektId}/positionen` })),
            ...(material.data || []).map(i => ({ action: 'Material erfasst', target: i.name, time: i.created_at, link: `/${projektId}/material` }))
        ];

        return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
    }
};
