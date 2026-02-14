import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="px-6 py-6 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xl">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            METHA<span className="text-primary">Desk</span> <span className="font-light text-slate-400 text-lg align-top">pro</span>
          </span>
        </div>
        <Link href="/login">
          <Button variant="outline" className="font-bold">Anmelden</Button>
        </Link>
      </header>

      <main className="flex-1">
        <section className="px-6 py-24 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-primary text-sm font-bold mb-8 border border-orange-100">
            <Zap className="h-4 w-4" />
            <span>Jetzt neu: MethaDesk Pro v1.0</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Die Zukunft Ihrer <span className="text-primary">Bauverwaltung</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
            Die zentrale Plattform für METHABAU Projektleiter und Teams zur effizienten Steuerung von Positionen, Materialien und Lieferanten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 text-lg font-bold">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold">
                Konto erstellen
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-slate-50 py-24 px-6 border-y border-slate-200">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Echtzeit-Übersicht',
                desc: 'Alle Teilsysteme und deren Status auf einen Blick.',
                icon: CheckCircle2
              },
              {
                title: 'Strukturierte Daten',
                desc: 'Klare Hierarchie von Teilsystemen bis zum kleinsten Material.',
                icon: Zap
              },
              {
                title: 'Rollenbasiert',
                desc: 'Sicherer Zugriff für Admin, Projektleiter und Mitarbeiter.',
                icon: ShieldCheck
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} METHABAU AG. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}
