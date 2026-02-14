'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    MessageSquare, X, Send, Bot, User, Sparkles,
    Search, Info, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStore } from '@/lib/mock/store';
import { cn } from '@/lib/utils';

interface Message {
    role: 'bot' | 'user';
    content: string;
    timestamp: Date;
    type?: 'data' | 'text' | 'error';
}

export const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'bot',
            content: 'Hallo! Ich bin Ihr MethaDesk Assistent. Wie kann ich Ihnen heute bei Ihren Projekten oder Teilsystemen helfen?',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { projektId } = useParams() as { projektId?: string };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const response = processQuery(input, projektId);
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1000);
    };

    const processQuery = (query: string, currentProjId?: string): Message => {
        const q = query.toLowerCase();
        const projekte = mockStore.getProjekte();
        const activeProj = currentProjId ? projekte.find((p: any) => p.id === currentProjId) : null;

        // Contextual greeting or help
        if (q.includes('hallo') || q.includes('hi') || q.includes('hilfe')) {
            return {
                role: 'bot',
                content: 'Ich kann Ihnen Informationen zu Projekten, Teilsystemen (TS) und Zuständigkeiten geben. Fragen Sie mich z.B.: "Wer ist der Projektleiter?" oder "Zeig mir alle Teilsysteme".',
                timestamp: new Date()
            };
        }

        // Project Info
        if (q.includes('projektleiter') || q.includes('verantwortlich') || q.includes('leiter')) {
            if (activeProj) {
                return {
                    role: 'bot',
                    content: `Der Projektleiter für "${activeProj.projektname}" ist ${activeProj.projektleiter}. Bauleiter ist ${activeProj.bauleiter}.`,
                    timestamp: new Date()
                };
            }
            return {
                role: 'bot',
                content: 'Bitte wählen Sie zuerst un Projekt aus, damit ich Ihnen genauere Informationen geben kann.',
                timestamp: new Date()
            };
        }

        if (q.includes('bauleiter')) {
            if (activeProj) {
                return {
                    role: 'bot',
                    content: `Der Bauleiter für "${activeProj.projektname}" es ${activeProj.bauleiter}.`,
                    timestamp: new Date()
                };
            }
        }

        if (q.includes('polier')) {
            if (activeProj) {
                return {
                    role: 'bot',
                    content: `Der Polier für "${activeProj.projektname}" ist ${activeProj.polier}.`,
                    timestamp: new Date()
                };
            }
        }

        // Teilsysteme Info
        if (q.includes('teilsystem') || q.includes('ts')) {
            if (!currentProjId) return { role: 'bot', content: 'In welchem Projekt soll ich suchen?', timestamp: new Date() };

            const teilsysteme = mockStore.getTeilsysteme(currentProjId);

            // Search for specific TS number or name
            const tsMatch = q.match(/\d{4}/);
            const tsByNumber = tsMatch ? teilsysteme.find((t: any) => t.teilsystemNummer === tsMatch[0]) : null;
            const tsByName = teilsysteme.find((t: any) => q.includes(t.name.toLowerCase()));

            const ts = tsByNumber || tsByName;

            if (ts) {
                const details = [
                    `📌 **${ts.name}** (TS ${ts.teilsystemNummer || '?'})`,
                    `━━━━━━━━━━━━━━━━━━`,
                    `🔹 **Status:** ${ts.status.toUpperCase()}`,
                    `🔹 **Plan-Status:** ${ts.planStatus || 'offen'}`,
                    `🔹 **KS:** ${ts.ks || '—'}`,
                    `📅 **Eröffnet:** ${ts.eroeffnetAm} (von ${ts.eroeffnetDurch})`,
                    ts.montagetermin ? `📅 **Montage:** ${ts.montagetermin}` : null,
                    ts.lieferfrist ? `🚚 **Frist:** ${ts.lieferfrist}` : null,
                    ts.abgabePlaner ? `📋 **Plan-Abgabe:** ${ts.abgabePlaner}` : null,
                    ts.wemaLink ? `🔗 **WEMA:** ${ts.wemaLink}` : null,
                    ts.bemerkung ? `\n📝 **Bemerkung:** ${ts.bemerkung}` : null
                ].filter(Boolean).join('\n');

                return {
                    role: 'bot',
                    content: details,
                    timestamp: new Date()
                };
            }

            if (q.includes('status')) {
                const openTs = teilsysteme.filter((t: any) => t.status === 'offen').length;
                const inProgress = teilsysteme.filter((t: any) => t.status === 'in arbeit').length;
                const done = teilsysteme.filter((t: any) => t.status === 'abgeschlossen' || t.status === 'verbaut').length;

                return {
                    role: 'bot',
                    content: `📊 **Projekt-Status:**\n- Gesamte Teilsysteme: ${teilsysteme.length}\n- ✅ Abgeschlossen/Verbaut: ${done}\n- 🚧 In Arbeit: ${inProgress}\n- ⭕ Offen: ${openTs}`,
                    timestamp: new Date()
                };
            }

            const tsList = teilsysteme.map((t: any) => `- TS ${t.teilsystemNummer || '?'}: ${t.name}`).join('\n');
            return {
                role: 'bot',
                content: `Hier sind die Teilsysteme für dieses Projekt:\n${tsList}`,
                timestamp: new Date()
            };
        }

        if (q.includes('projekte')) {
            const list = projekte.map((p: any) => `- ${p.projektname} (#${p.projektnummer})`).join('\n');
            return {
                role: 'bot',
                content: `Ich habe folgende Projekte im System gefunden:\n${list}`,
                timestamp: new Date()
            };
        }

        return {
            role: 'bot',
            content: 'Entschuldigung, das habe ich nicht ganz verstanden. Ich kann nach Projekten, Teilsystemen, deren Status oder verantwortlichen Personen suchen.',
            timestamp: new Date()
        };
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] h-[550px] animate-in slide-in-from-bottom-5 duration-300">
                    <Card className="h-full flex flex-col shadow-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 overflow-hidden glassmorphism">
                        <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-white">
                                    <CardTitle className="text-base font-black">MethaDesk AI</CardTitle>
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Online • Projekt Assistent
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>

                        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex flex-col max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm whitespace-pre-wrap",
                                        msg.role === 'user'
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-slate-100 dark:bg-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-800"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800">
                                        <div className="flex gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="p-4 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <form
                                className="flex w-full gap-2 items-center"
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            >
                                <div className="relative flex-1">
                                    <Input
                                        placeholder="Nachricht schreiben..."
                                        className="h-11 pl-4 pr-10 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-primary shadow-sm"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                                </div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl shadow-lg bg-primary hover:bg-orange-600 transition-all shrink-0"
                                    disabled={!input.trim()}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {/* Trigger Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center p-0",
                    isOpen ? "rotate-90 bg-slate-900 hover:bg-slate-800" : "bg-primary hover:bg-orange-600 hover:scale-110"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="h-6 w-6 text-white" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
                        </div>
                    </div>
                )}
            </Button>
        </div>
    );
};
