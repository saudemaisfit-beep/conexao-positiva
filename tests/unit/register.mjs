import { registerHooks } from "node:module";

// Nos testes unitários, `import "server-only"` (que só serve para o Next.js impedir o uso no
// browser) resolve para um módulo vazio, como acontece no servidor.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export{}", shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
