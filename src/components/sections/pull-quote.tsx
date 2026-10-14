/** Citação de destaque em largura total. */
export function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <section className="section-spacing">
      <figure className="container-site flex reveal flex-col gap-6">
        <span aria-hidden="true" className="h-1 w-16 rounded-full bg-accent" />
        <blockquote>
          <p className="max-w-5xl font-display text-h1 leading-tight font-normal tracking-[-0.02em] text-balance">
            {quote}
          </p>
        </blockquote>
        {attribution && <figcaption className="text-muted">{attribution}</figcaption>}
      </figure>
    </section>
  );
}
