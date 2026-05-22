# Personal Site

This context describes the scaffold decisions for a personal landing page. Positioning and visual language remain intentionally flexible until content and design work begin.

## Language

**Senior Software Engineer**:
A technical practitioner with several years of production experience who designs, builds, and improves software systems with strong product judgment.
_Avoid_: Freelancer, coder

**Product Engineer**:
An engineer who connects implementation choices to user experience, business value, and product outcomes.
_Avoid_: Full-stack developer as the primary label

**Senior Product Engineer**:
The primary public identity for Alexander Rasputin: a product-minded senior engineer who builds product experiences across interfaces, workflows, integrations, and application boundaries, uses strong UX judgment, and applies agentic engineering to move from product direction to polished production software faster.
_Avoid_: AI Product Engineer as the primary label when the intended meaning is product engineering amplified by agentic workflows

**Full-Stack Product Engineer**:
An engineer who can build across the stack while staying focused on user-facing product outcomes.
_Avoid_: Full-stack engineer when it implies generic implementation without product ownership

**Mobile and Web Product Engineering**:
Engineering work focused on building product-facing mobile and web applications with attention to implementation quality and user experience.
_Avoid_: Frontend-only work when the intended scope includes mobile applications and product judgment

**Agentic Engineering**:
The use of AI agents, orchestration, and automation as part of software design, development, and delivery workflows.
_Avoid_: AI engineering when the intended meaning is agent-enabled software work

**End-to-End Application Delivery**:
The ability to design and build user-facing applications across frontend, backend, and integration boundaries.
_Avoid_: Full-stack as a standalone value proposition

**End-to-End Product Engineering**:
Product engineering that can span UX direction, frontend implementation, backend workflows, integrations, automation, and delivery across web, mobile, desktop, and emerging 3D interfaces.
_Avoid_: Mobile and web as the full scope when the current practice is broader

**Product Idea to Working Experience**:
The core loop Alexander likes to own: shaping product direction, designing the interface, wiring the workflows behind it, and refining the details until the result is usable, coherent, and good to use.
_Avoid_: End-to-end delivery as corporate shorthand when the intended meaning is craft-led product building

**Ownership Under Ambiguity**:
The ability to move a product forward when the opportunity, UX, implementation path, or team process is not fully defined yet.
_Avoid_: Startup toughness when the intended meaning is creative product ownership

**Code and UX Craft**:
The discipline of building interfaces where implementation quality and user experience quality are treated as the same product concern.
_Avoid_: UI polish when the intended meaning includes engineering quality

**Scroll-Driven 3D Landing Page**:
A single-page site where normal content sections and a persistent Three.js scene transition together as the user scrolls.
_Avoid_: Multi-page portfolio when the intended experience is one continuous landing page

**React SPA**:
A Vite-powered React single-page app used as the main application shell for the landing experience.
_Avoid_: Astro or SolidJS for this project

**React Three Fiber Scene**:
A React-owned Three.js scene built with `@react-three/fiber` and related ecosystem packages.
_Avoid_: Hand-managed Three.js lifecycle when React Three Fiber provides the clearer integration path

**Zustand Store**:
A small client-side state store for shared UI and scene state that should not require prop drilling.
_Avoid_: Using Zustand for transient per-frame values

**Zod Schema**:
A runtime validation schema used for local data, configuration, environment-like values, and future external payloads.
_Avoid_: Trusting unvalidated content shapes

**React i18next Layer**:
The React translation layer built with i18next and react-i18next for current English copy and future locales.
_Avoid_: Custom translation helpers

**CSS Variable Design System**:
A plain CSS design system built from global CSS variables, cascade layers, modern CSS features, and light/dark theme tokens.
_Avoid_: Tailwind or runtime CSS-in-JS

**Extendable Color Tokens**:
A minimal token set for brand, primary, theme surfaces, neutral greys, semantic colors, and future design experiments.
_Avoid_: Locking the final visual palette during scaffolding

**Experimental Gradient Texture**:
A future visual direction involving gradients, noise, and grain effects that can be explored after the scaffold.
_Avoid_: Baking a specific gradient/noise design into the scaffold

**Role-Based Typography Tokens**:
Typography tokens and utility classes named by UI role, such as body, h1-h6, button, label, caption, and overline.
_Avoid_: Tailwind dependency or purely numeric text scales as the only authoring model

**Tailwind-Style Spacing Scale**:
A numeric spacing token scale such as `--spacing-1`, `--spacing-2`, and upward steps that grow predictably.
_Avoid_: One-off spacing values scattered through components

**Semantic Layout Tokens**:
Layout tokens derived from the spacing scale, such as page padding, section padding, and heading margins.
_Avoid_: Repeating raw spacing scale values for layout-level decisions

**Component CSS Modules**:
Component-scoped CSS Modules used for non-trivial React UI components.
_Avoid_: Large shared class soup or inline style objects for UI styling

**System-First Theme**:
A light/dark theme model that follows `prefers-color-scheme` by default and allows a manual user override.
_Avoid_: Theme that ignores the operating system preference

**Biome Tooling**:
Biome is the formatter and linter for the project.
_Avoid_: ESLint and Prettier unless Biome proves insufficient

**Vitest Unit Layer**:
Vitest is the unit and lightweight integration test runner for TypeScript, schemas, stores, and pure utilities.
_Avoid_: Leaving state and schema logic untested

**Playwright E2E Layer**:
A browser-level Playwright test suite for checking navigation, sections, contact links, and eventual scene integration.
_Avoid_: Relying only on unit tests for an interactive landing experience

**Scaffold Smoke Tests**:
Minimal starter tests that prove each configured testing layer runs without pretending to cover unfinished features.
_Avoid_: Fake comprehensive tests during scaffolding

**TSL Scene**:
A Three.js scene whose custom visual language is authored with TSL, the Three.js Shading Language.
_Avoid_: Hand-written GLSL as the default shader path

**R3F TSL Boundary**:
React Three Fiber owns scene composition and lifecycle, while TSL owns custom material and shader expression.
_Avoid_: Treating TSL and React Three Fiber as competing approaches

**Three.js-Heavy Experience**:
A landing page where the primary visual and interaction language is a persistent Three.js scene rather than a mostly static document with decorative canvas.
_Avoid_: Decorative background canvas

**Evolving 3D World**:
A single coherent Three.js world that changes camera, light, material, and atmosphere across sections instead of replacing itself with unrelated scenes.
_Avoid_: Separate disconnected 3D motif per section

**Celestial Visual Direction**:
A deferred visual direction inspired by space, sunsets, planets, and atmospheric light.
_Avoid_: Locking specific celestial assets before the scaffold exists

**Scene Scaffold**:
The minimal Three.js integration structure needed to implement the final scroll-driven world later.
_Avoid_: Placeholder visual design that pretends to be the final scene

**Contact Link Block**:
A simple contact section made of direct email and social/profile links.
_Avoid_: Contact form before a submission workflow exists

**Selected Work Cards**:
A lightweight work section made of a small number of project cards with placeholder data until final projects are chosen.
_Avoid_: Full case study system before the content exists

**Separated Site Structure**:
A project organization where content data, page sections, primitives, design tokens, and scene code have separate ownership from the beginning.
_Avoid_: Large catch-all page or component files

**Runtime-Owned Components**:
A component structure grouped by responsibility: React UI components and React Three Fiber scene modules live in separate subtrees.
_Avoid_: Mixing DOM UI components and Three.js scene modules in a generic component folder

**Performance-Aware React Structure**:
A React project structure that avoids barrel imports, isolates heavy scene code, prefers direct imports, and keeps render subscriptions narrow.
_Avoid_: Convenience structure that bloats bundles or causes broad re-renders

**Shared Types**:
Cross-cutting TypeScript definitions that describe site concepts used by multiple components or APIs.
_Avoid_: Duplicating shared shapes across components

**Localized Site Data**:
Structured static site content organized so English is the first locale and additional languages can be added later.
_Avoid_: Hardcoded copy inside components

**Static Single-Page Experience**:
A no-server-runtime landing page shipped as static files while using client-side JavaScript heavily for Three.js and reactive UI.
_Avoid_: Server-rendered application runtime

**Search Preview Metadata**:
The title, description, canonical URL, social preview tags, and preview image that describe the current landing page and can later be authored per route.
_Avoid_: SEO system, content marketing platform, full content framework

**Landing-First Metadata Model**:
A small typed metadata shape authored for the single landing page now, with route-scoped ownership so future pages can add metadata without redesigning the model.
_Avoid_: Hardcoded one-off tags, CMS-shaped metadata before content pages exist

**Cloudflare Workers Hosting**:
The static-deployment target for the site, using Workers + Static Assets (Cloudflare's 2026-recommended successor to Pages). Chosen for unified DNS + hosting under a single provider, unlimited free-tier bandwidth, the largest edge network among comparable static hosts, and a single deployment unit that grows from pure static to optional serverless without product migration. Headers live in `public/_headers`; SPA fallback is configured via `assets.not_found_handling: "single-page-application"` in `wrangler.jsonc`; analytics is auto-injected by Cloudflare and needs no NPM package.
_Avoid_: Treating the host as interchangeable when its `_headers` format, `wrangler.jsonc` schema, CSP origins, and analytics integration shape parts of the repo.

**Simple Section Model**:
The content structure of **Hero**, **About**, **Work**, and **Contact** as the complete first version of the site.
_Avoid_: Extra sections before the core story exists

**Agentic Coding**:
A disciplined software development practice that uses AI agents, orchestration, and engineering judgment to design, implement, review, and evolve code.
_Avoid_: Vibe coding

**Multi-Agent Orchestration**:
The coordination of multiple AI agents or workflows to explore, implement, verify, and refine software work.
_Avoid_: AI automation when the intended meaning is coordinated engineering workflows

**End-to-End Agentic Product Building**:
Using AI agents, orchestration, and engineering judgment to independently explore, design, implement, verify, and iterate product ideas across the full delivery path.
_Avoid_: Vibe coding or unsupervised AI output

**Expanding Creative Engineering Craft**:
The ongoing learning practice of pushing beyond existing strengths into new expressive and technical mediums such as Three.js, 3D, shaders, desktop applications, backend workflows, and automation.
_Avoid_: Treating exploration as lack of focus when it is guided by product craft

**Product Pipeline Work**:
Behind-the-scenes product engineering that connects systems and automates operational workflows, such as webhook pipelines, ticket generation, integrations, and event-driven business flows.
_Avoid_: Only showing visual interface work when backend workflow work is part of the value

**Humble Builder Voice**:
A personal tone that presents strong product, craft, and agentic engineering ability with curiosity, warmth, and evidence rather than hype.
_Avoid_: Grandiose AI positioning or over-claiming independence

**Story-Led Personal Profile**:
A personal site model that tells a coherent story around Alexander, his product engineering practice, selected work, experiments, and personal craft without becoming a strict CV.
_Avoid_: Résumé-only portfolio or workshop-as-the-main-identity

**Pasteable Profile Context**:
A compact document that can be given to an AI or design tool as context for who Alexander is, what his strengths are, and how the landing page should feel.
_Avoid_: Final landing page copy when the goal is source context for exploration

**Whole-Person Craft**:
The idea that Alexander's product taste and engineering craft are shaped by broader practices such as surfing, photography, woodcrafting, and other hands-on exploration.
_Avoid_: Lifestyle content that distracts from product engineering

**Startup Scale-Up Experience**:
Experience building products inside a startup while the organization grows significantly, including changing team size, delivery pressure, product maturity, and collaboration needs.
_Avoid_: Startup experience when the scale-up context is important evidence

**Early Engineering Hire**:
An engineer who joins when the engineering organization is still forming and helps create product, technical, and collaboration patterns that survive later growth.
_Avoid_: Employee count as trivia when the significance is ownership and leverage

## Relationships

- Positioning language is still being refined, but **Senior Product Engineer** is the resolved primary identity for the landing page
- **Product Engineer**, **Full-Stack Product Engineer**, and **Agentic Engineering** are supporting positioning concepts, not competing primary labels
- **Senior Software Engineer** remains credible proof, but should not be the main public identity
- **End-to-End Product Engineering** broadens the scope of **Senior Product Engineer** beyond mobile and web without turning the identity into generic full-stack engineering
- **Product Idea to Working Experience** is the canonical phrase for the core loop Alexander owns
- **Mobile and Web Product Engineering** remains important historical proof, not the complete current scope
- **Startup Scale-Up Experience** supports the seniority claim as evidence, but should not become the hero identity
- **Early Engineering Hire** strengthens **Startup Scale-Up Experience** as interview/CV-level proof, not first-touch landing page copy
- **Ownership Under Ambiguity** is the main thing the early-hire story should prove
- **End-to-End Agentic Product Building** is the current acceleration layer on top of Alexander's product engineering practice
- **Product Pipeline Work** is evidence for **End-to-End Product Engineering**
- **Expanding Creative Engineering Craft** is the learning/exploration layer that keeps the site feeling alive rather than résumé-like
- **Humble Builder Voice** is the tone constraint for explaining **End-to-End Agentic Product Building**
- **Story-Led Personal Profile** is the preferred page model for the landing experience: the page should tell a story around Alexander rather than behave like a strict CV
- **Pasteable Profile Context** should combine a profile brief and landing page creative brief in one document
- **Whole-Person Craft** supports **Humble Builder Voice** by making Alexander's taste and curiosity feel human and grounded
- **Agentic Coding** is a practical expression of **Agentic Engineering**, not the primary headline label
- **Multi-Agent Orchestration** is an advanced capability within **Agentic Coding**
- **Multi-Agent Orchestration** supports **End-to-End Agentic Product Building**
- **End-to-End Application Delivery** describes the execution range of a **Full-Stack Product Engineer**
- **Code and UX Craft** is the quality bar for user-facing product work
- A **Scroll-Driven 3D Landing Page** presents the **Simple Section Model** as one continuous experience
- A **React SPA** owns the page shell, reactive UI, and static single-page routing
- A **React Three Fiber Scene** provides the React-native integration path for the Three.js layer
- A **Zustand Store** can hold shared UI/scene state, but animation-frame values stay in refs/R3F state
- A **Zod Schema** validates localized content and future external data shapes
- The **React i18next Layer** handles translations for the **Localized Site Data**
- A **CSS Variable Design System** defines shared theme, typography, spacing, and surface tokens
- **Extendable Color Tokens** define the initial color token contract
- **Experimental Gradient Texture** is a later design exploration, not a scaffold requirement
- **Role-Based Typography Tokens** define the initial text system
- A **Tailwind-Style Spacing Scale** provides the primitive spacing system
- **Semantic Layout Tokens** define page and section layout spacing on top of the primitive scale
- **Component CSS Modules** style concrete React UI pieces
- A **System-First Theme** controls light/dark mode through CSS variables and optional stored override
- **Biome Tooling** owns linting and formatting
- The **Vitest Unit Layer** covers schemas, stores, and utilities
- The **Playwright E2E Layer** covers the browser-visible landing experience
- **Scaffold Smoke Tests** verify tooling only until a fuller workflow is defined
- A **TSL Scene** provides the experimental Three.js layer for the **Scroll-Driven 3D Landing Page**
- The **R3F TSL Boundary** keeps scene composition separate from shader/material authoring
- A **Three.js-Heavy Experience** uses React as the shell and interaction layer
- An **Evolving 3D World** is the preferred structure for the **Three.js-Heavy Experience**
- The **Celestial Visual Direction** will guide later design work but remains unresolved during scaffolding
- A **Scene Scaffold** should provide implementation hooks without introducing throwaway visual concepts
- A **Contact Link Block** is the first contact model for the site
- **Selected Work Cards** are the first work model for the site
- A **Separated Site Structure** keeps the simple site maintainable as visuals and content become more complex
- **Runtime-Owned Components** make React UI and Three.js scene boundaries explicit
- A **Performance-Aware React Structure** shapes imports, folder boundaries, and state subscriptions
- **Shared Types** live in `src/types`
- **Localized Site Data** lives under `src/data`
- The site is a **Static Single-Page Experience** until a real server-side need appears
- **Cloudflare Workers Hosting** is the deploy surface for the **Static Single-Page Experience**, with git-integrated CD via Workers Builds and per-PR preview URLs

## Example dialogue

> **Dev:** "Should the hero introduce me as a freelancer?"
> **Domain expert:** "Do not lock final positioning during scaffolding; keep candidate language flexible."
> **Dev:** "Should the scaffold be centered on agentic engineering?"
> **Domain expert:** "Anchor it in **Product Engineering** and make **Agentic Engineering** the future-facing differentiator."
> **Dev:** "What should the landing page call Alexander?"
> **Domain expert:** "Use **Senior Product Engineer** as the primary identity. Explain the scope through **End-to-End Product Engineering** and the AI angle through **Agentic Engineering** that accelerates product-quality delivery."
> **Dev:** "What should the CarOnSale early-hire story prove?"
> **Domain expert:** "It should prove **Ownership Under Ambiguity**, but keep it as supporting evidence. The hero should not lead with company growth numbers."
> **Dev:** "How should the AI acceleration angle sound?"
> **Domain expert:** "Use **Humble Builder Voice**. Show that agentic workflows help Alexander build more independently and move faster, but keep the tone curious, grounded, and proof-led."
> **Dev:** "Should the site feel like a CV?"
> **Domain expert:** "No. Use the **Story-Led Personal Profile** model: tell a coherent story around Alexander, with work, experiments, learning, and personal craft as supporting material."
> **Dev:** "What kind of document should come out of the positioning work?"
> **Domain expert:** "Create a **Pasteable Profile Context** that can be dropped into an AI or design tool: first who Alexander is, then how to write and design for him."
> **Dev:** "Is this vibe coding?"
> **Domain expert:** "No. The public phrase is **Agentic Engineering**; **Agentic Coding** describes the structured, reviewed, orchestrated practice underneath it."
> **Dev:** "Can we say full-stack?"
> **Domain expert:** "Yes, but as **End-to-End Application Delivery** in service of product quality, not as the main identity."
> **Dev:** "How much structure should the first site have?"
> **Domain expert:** "Keep the **Simple Section Model**: **Hero**, **About**, **Work**, and **Contact**."
> **Dev:** "Do we need React?"
> **Domain expert:** "Yes. Use a **React SPA** because the site is JavaScript-heavy and React Three Fiber is the strongest ecosystem fit."
> **Dev:** "Can we still use TSL with React Three Fiber?"
> **Domain expert:** "Yes. Use the **R3F TSL Boundary**: React Three Fiber composes the scene, and TSL defines custom materials/shaders."
> **Dev:** "Do we need app state and validation libraries?"
> **Domain expert:** "Yes. Use a **Zustand Store** for shared client state and **Zod Schema** definitions for content/config validation."
> **Dev:** "Should translations use a library?"
> **Domain expert:** "Yes. Use the **React i18next Layer** instead of custom translation helpers."
> **Dev:** "What CSS approach should the React app use?"
> **Domain expert:** "Use a **CSS Variable Design System** with **Component CSS Modules**; avoid Tailwind and runtime CSS-in-JS."
> **Dev:** "Should the final palette be locked now?"
> **Domain expert:** "No. Use **Extendable Color Tokens** and leave gradients, noise, grain, and brand color experimentation for later."
> **Dev:** "How should typography tokens be named?"
> **Domain expert:** "Use **Role-Based Typography Tokens** like body, h1-h6, button, label, caption, and overline."
> **Dev:** "How should spacing work?"
> **Domain expert:** "Use a **Tailwind-Style Spacing Scale** for primitives and **Semantic Layout Tokens** for page, section, and heading spacing."
> **Dev:** "How should theme work?"
> **Domain expert:** "Use a **System-First Theme** with a manual light/dark toggle."
> **Dev:** "What tooling should be scaffolded?"
> **Domain expert:** "Use **Biome Tooling**, a **Vitest Unit Layer**, and a **Playwright E2E Layer** from the beginning."
> **Dev:** "How much test coverage should the scaffold include?"
> **Domain expert:** "Use **Scaffold Smoke Tests** only; detailed workflow expectations can move into AGENTS.md later."
> **Dev:** "Is the Three.js scene decorative?"
> **Domain expert:** "No. This is a **Three.js-Heavy Experience**; React provides the shell, while Three.js carries much of the visual identity."
> **Dev:** "Should each section have a separate 3D scene?"
> **Domain expert:** "No. Use one **Evolving 3D World** and define the exact **Celestial Visual Direction** after the scaffold."
> **Dev:** "Should the scaffold include a placeholder planet or visual prototype?"
> **Domain expert:** "No. Keep a **Scene Scaffold** only, so the real visual direction can be implemented later."
> **Dev:** "Should the contact section have a form?"
> **Domain expert:** "No. Start with a **Contact Link Block** containing email and social links."
> **Dev:** "Should work be a full portfolio system?"
> **Domain expert:** "No. Start with lightweight **Selected Work Cards**."
> **Dev:** "Should the scaffold be a single simple page file?"
> **Domain expert:** "No. Keep a **Separated Site Structure** so primitives, sections, data, design tokens, and scene code stay small."
> **Dev:** "How should components be grouped?"
> **Domain expert:** "Use **Runtime-Owned Components**: React UI components and Three.js scene components live in separate subtrees."
> **Dev:** "Should there be a data folder from the beginning?"
> **Domain expert:** "Yes. Use `src/data` for **Localized Site Data**, not for premature external data plumbing."
> **Dev:** "Does this need a server runtime?"
> **Domain expert:** "No. Ship a **Static Single-Page Experience**; the heavy interactivity lives in client-side React and Three.js."
> **Dev:** "Where should the site be hosted?"
> **Domain expert:** "Use **Cloudflare Workers Hosting** with Static Assets for unified DNS + hosting, unlimited free-tier bandwidth, the largest edge network, and a single deployment unit that grows into serverless without product migration; the **Static Single-Page Experience** ships there as static files with git-integrated CD."

## Flagged ambiguities

- The primary identity is **Senior Product Engineer**; supporting language is still being refined.
- The canonical loop phrase is **Product Idea to Working Experience**.
- "Agentic Engineering" is a future-facing differentiator, but should support the product engineering identity rather than replace it.
- Do not narrow Alexander's current positioning to mobile and web only. Mobile/web are strong proof areas, but the current scope includes backend workflows, integrations, desktop applications, product pipelines, and 3D/Three.js exploration.
- "Full Stack Engineer" may be reframed later as **Full-Stack Product Engineer** or **End-to-End Application Delivery**, but should not become the main headline label.
- The one-liner is intentionally deferred; scaffold sections should support multiple future positioning directions.
- Alexander was the second engineering hire at CarOnSale after the CTO; CarOnSale then grew from roughly 20 people to roughly 300 people during his tenure. This is important evidence for **Early Engineering Hire** and **Startup Scale-Up Experience**, but should be held for CV, interviews, deeper case-study context, or a subtle proof point rather than used as the main landing page identity.
- Alexander's current direction is not only faster coding; it is **End-to-End Agentic Product Building**, where AI orchestration and workflows let him build and iterate complete product experiences independently instead of waiting on slower handoffs.
- The landing page voice should stay humble and exploratory: strong claims need proof, texture, and curiosity, not self-mythologizing.
- A current freelance proof point is Bikepark Thunersee Trailpass work: a webhook pipeline for generating customer tickets. This should support **Product Pipeline Work** and show range beyond visual frontend work.
- Three.js/3D exploration should be positioned as **Expanding Creative Engineering Craft**, not as a finished identity claim until project proof exists.
- The site should be a **Story-Led Personal Profile**, not a strict CV. It can include workshop-like experiments, surfing, photography, woodcrafting, and other hands-on interests as texture for **Whole-Person Craft**, as long as professional product engineering remains the spine.
- The visual reference is a **Scroll-Driven 3D Landing Page** with sparse text, persistent navigation, and section-based scene transitions; it should inspire structure and motion without being copied.
- React was selected over Astro and SolidJS because the site is JavaScript-heavy, React Three Fiber has the strongest ecosystem fit, and LLMs are especially effective at producing React examples.
- TSL is intentionally experimental/future-facing and should be isolated inside the scene module so the rest of the site remains stable.
- Astro and SolidJS were considered, but dropped in favor of a Vite-powered **React SPA**.
- React structure should follow standard SPA performance discipline: avoid barrel imports, isolate heavy modules, use narrow state subscriptions, and keep transient animation state out of React render state.
- Biome replaces the ESLint/Prettier baseline unless a specific plugin gap appears.
- Playwright tests should focus on stable browser behavior first; visual/canvas assertions can be added once the real Three.js scene exists.
- The scaffold should include only enough tests to prove Vitest, React Testing Library, and Playwright are wired correctly.
- The eventual visual mood likely leans toward space, sunsets, planets, and atmospheric light, but exact forms are intentionally deferred until after the scaffold.
- The first implementation should avoid throwaway Three.js visuals and focus on clean project structure, integration points, and section hooks.
- Contact should avoid backend assumptions for now; use direct links until a form submission workflow is explicitly needed.
- X should be included as a likely contact/social link.
- Work should stay lightweight until final project content exists.
- Avoid 500-line files; split early by responsibility even while the site is still small.
- Three.js-specific renderable code should live under a dedicated Three.js subtree, with subdirectories for scenes, shaders, materials, and related render pieces.
- Site copy should not be hardcoded inside components because the page should be translatable later.
- English is the only initial locale, but the content shape should allow future locales.
- i18next and react-i18next are the translation baseline for the React SPA.
- CSS variables are the shared token contract between DOM UI and Three.js scene configuration.
- Initial color variables: `--color-brand`, `--color-primary`, `--color-bg`, `--color-fg`, `--color-surface`, `--color-border`, `--color-grey-[100-500]`, `--color-success-[100-500]`, `--color-error-[100-500]`, `--color-warning-[100-500]`, `--color-info-[100-500]`, and `--color-primary-[100-500]`.
- The likely theme foundation is black/white per light/dark mode with occasional brand color use.
- Gradient, noise, and grain effects are desired future design experiments but should not be specified in the scaffold beyond extensible token hooks.
- Typography should use Tailwind-like semantic roles without adding Tailwind.
- `h1` through `h4` should be meaningfully distinct; `h3` must not feel too small by default.
- Spacing should start with primitive tokens like `--spacing-1`, `--spacing-2`, and so on, then expose semantic aliases like `--padding-page-x`, `--padding-page-y`, `--padding-section-x`, `--padding-section-y`, `--margin-heading-x`, and `--margin-heading-y`.
- Three.js components may define their own spatial units later, but DOM UI should start from the shared spacing system.
- CSS Modules should be used for non-trivial components; global CSS is reserved for reset, base styles, themes, and design tokens.
- Theme state defaults to `prefers-color-scheme`, supports manual light/dark override, and can persist the override in localStorage.
- Avoid server runtime assumptions in the scaffold; API routes are optional future additions, not part of the first architecture.
- **Cloudflare Workers Hosting** was chosen over Vercel because the domain DNS already lives at Cloudflare, the free tier has no bandwidth cap, and the edge network is larger; the alternative (Vercel) has slightly more polished DX and Speed Insights, but introduces a second vendor. Workers + Static Assets was chosen over Cloudflare Pages because Cloudflare's 2026 guidance points all new projects at Workers — Pages has feature parity but no future investment, and adding serverless later means staying inside the same product. The architecture stays portable — CSP, headers, SPA fallback, and analytics are the host-shaped surfaces and can be re-translated if needed.
