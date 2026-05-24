import { useState } from 'react';
import { FileText, BookOpen, Code, BookMarked, ChevronRight } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

export function DocsView() {
  const { showToast } = useAstra();

  const sections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      desc: 'Learn how to integrate ASTRA into your workflow',
      articles: ['Quick start guide', 'Installation', 'Configuration'],
    },
    {
      icon: Code,
      title: 'API Reference',
      desc: 'Complete API documentation for ASTRA endpoints',
      articles: ['Review API', 'Docs generation', 'Chat API'],
    },
    {
      icon: BookMarked,
      title: 'Guides',
      desc: 'Deep dives into specific features and use cases',
      articles: ['PR analysis workflow', 'Custom review rules', 'Best practices'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-astra-purple-light" />
          <h2 className="text-2xl font-light italic font-serif text-astra-text">Documentation</h2>
        </div>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Guides, references, and resources</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div key={section.title} className="border border-astra-border bg-astra-elevated p-6 hover:border-astra-text transition-colors group">
            <section.icon className="w-6 h-6 text-astra-purple-light mb-4" />
            <h3 className="text-sm font-bold font-sans text-astra-text mb-1">{section.title}</h3>
            <p className="text-[11px] text-astra-muted font-sans mb-4">{section.desc}</p>
            <div className="flex flex-col gap-1">
              {section.articles.map((article) => (
                <button
                  key={article}
                  onClick={() => showToast(`Documentation: ${article} — coming soon`, 'info')}
                  className="flex items-center gap-2 text-[11px] font-sans text-astra-muted hover:text-astra-text transition-colors py-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  {article}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
