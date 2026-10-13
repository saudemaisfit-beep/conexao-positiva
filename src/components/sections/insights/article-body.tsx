import Image from "next/image";
import type { ArticleBlock } from "@/content/types";

/** Corpo editorial do artigo (equivalente ao componente Prose). Uma coluna de leitura de ~68 caracteres. */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex max-w-[68ch] flex-col gap-6 text-body-lg">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph":
            return <p key={key}>{block.text}</p>;
          case "heading":
            return block.level === 2 ? (
              <h2 key={key} className="mt-8 text-h2 font-normal text-balance">
                {block.text}
              </h2>
            ) : (
              <h3 key={key} className="mt-4 text-h4 font-bold text-balance">
                {block.text}
              </h3>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={key}
                className={`flex flex-col gap-2 pl-6 marker:font-semibold marker:text-accent ${block.ordered ? "list-decimal" : "list-disc"}`}
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <figure key={key} className="my-4 flex flex-col gap-3 border-l-4 border-accent pl-6">
                <blockquote className="font-display text-h3 leading-snug font-bold text-balance">
                  <p>{block.text}</p>
                </blockquote>
                {block.cite && (
                  <figcaption className="text-small text-muted">{block.cite}</figcaption>
                )}
              </figure>
            );
          case "image":
            return (
              <figure key={key} className="my-4 flex flex-col gap-3">
                <Image
                  src={block.image.src}
                  alt={block.image.alt}
                  width={block.image.width}
                  height={block.image.height}
                  sizes="(min-width: 1024px) 46rem, 100vw"
                  className="rounded-lg"
                />
                {block.caption && (
                  <figcaption className="text-small text-muted">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "callout":
            return (
              <div
                key={key}
                className="my-4 flex flex-col gap-2 rounded-lg bg-primary-soft p-6 md:p-8"
              >
                {block.title && <p className="font-display text-h4 font-bold">{block.title}</p>}
                <p>{block.text}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
