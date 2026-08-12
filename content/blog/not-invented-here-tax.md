---
title: 'The Not-Invented-Here Tax: Pure Engineering Against Market Reality'
summary: "I spent years avoiding dependencies because I believed writing everything myself was the cleaner, more standard path. Then I changed strategy and shipped more. An honest audit of the Not-Invented-Here trap, what it actually costs, and how to pick dependencies deliberately instead of religiously."
date: 2026-08-12
tags:
  - software-architecture
  - engineering-culture
  - technical-debt
  - dependencies
  - best-practice
---

I was scrolling through my old LinkedIn posts last week, and then through the archive of this very blog. The pattern is impossible to miss: I was trained inside a very specific engineering culture — one where the highest virtue was technical perfectionism, staying as close to native as possible, and shipping code with as few dependencies as you could get away with.

So let me ask an honest question, without pretending I have the answer: **what is actually correct here?**

I'm not claiming to have found some absolute truth. What I can claim is that I walked one path far enough to pay its full price, and that over the last couple of years a deliberate strategy shift produced noticeably better outcomes — for the product, for the team, and for me. This post is an attempt to reason about why, with the specificity the question deserves.

## The Culture I Was Trained In

My default posture used to be maximum avoidance of external tooling. And this was never only about frontend frameworks like Lit — it went much deeper. Lightweight Node.js frameworks like Hono, general-purpose databases, ORMs, finite state machine libraries, and pretty much any other ready-made tool: all of it triggered the same reflex. *We can write this ourselves, and ours will be leaner.*

The reasoning felt airtight at the time. Not using a package meant being closer to the standard. Closer to the standard meant a cleaner architecture. A cleaner architecture meant everything would sit at its most optimal state.

You can watch this belief operate in my own writing. In [Mastering Eleventy Folder Structures](/en/blog/eleventy-folder-structure-guide) I spent an entire article designing a custom folder layout that deliberately walks away from Eleventy's defaults — a dedicated `site/` input, a split between `_include` and `_layout`, an underscore-prefixed naming convention of my own invention. Everything I wrote there is defensible in isolation. What I didn't account for is that **every deviation from a framework's default is a permanent tax** paid by every new contributor, every plugin that assumes the convention, and every future upgrade. I optimized for my own taste and quietly billed the cost to everyone downstream.

[Self-Hosting Decap CMS](/en/blog/self-hosting-decap-cms) is the purer artifact. There, I stood up and operated an OAuth backend specifically so I wouldn't have to depend on Netlify. The constraint that motivated it was real and I'd probably make the same call again for that project. The problem is that the *instinct* generalized far beyond its valid scope: I had traded a free, managed, someone-else's-pager dependency for a service I now had to keep alive — and I filed that under "independence" instead of under "operational cost."

The net result of years of this: we were permanently busy building infrastructure that the rest of the community had long since stopped worrying about.

## The Cost Is Not the Code — It's the Ownership

The build-versus-buy conversation almost always gets framed around the wrong number. Everybody argues about how long it takes to write the thing. That's the cheap part, and often it genuinely *is* cheaper — a minimal router really is a couple hundred lines, and a hand-rolled state machine really can be simpler than pulling in a library.

What that estimate leaves out is everything that happens after the merge:

- **No changelog, no upgrade path.** When the platform moves, someone on your team has to notice and port it.
- **No security feed.** A CVE against a popular package arrives as a Dependabot PR. A vulnerability in your bespoke auth layer arrives as an incident.
- **No documentation, no ecosystem.** Onboarding cost is paid in senior engineer hours, forever, and the only reference implementation is the code itself.
- **Edge cases you haven't hit yet.** A widely used library's real value isn't its API surface; it's the thousands of production edge cases already discovered and fixed by people who aren't you.

That last one is the killer. When you hand-roll an ORM-shaped data layer, you are not competing with the library's happy path — you are competing with years of accumulated fixes around connection pooling, transaction nesting, timezone coercion, and N+1 detection. You will rediscover those bugs one production incident at a time.

## Being Out of Sync With the Community Is a Technical Cost

This is the lesson that reframed the whole thing for me: **sharing the community's problems is itself an asset.**

When you pick a tool with a tiny community, or write everything from scratch, you are opting out of thousands of tested solutions — and out of the shared vocabulary that makes it possible to describe a problem to another engineer in one sentence. Hiring changes shape too: "we use Hono and Drizzle" is a two-day ramp-up; "we use our in-house framework" is a two-month one.

There's a newer dimension that didn't exist when I formed these opinions, and it's not a small one. In 2026, a meaningful share of engineering throughput flows through models that were trained on public code. Popular libraries have enormous, high-quality representation in that training data. Your internal framework has exactly zero — and no amount of context stuffing fully closes that gap. I made [a related argument about governing AI code generation](/en/blog/patchlike-fix-bug) — enforcing architectural contracts through standardized system prompts — but I framed the ecosystem as something to *constrain*. I now think the more important variable is whether the model has ever seen your stack at all. Choosing an obscure or bespoke foundation now carries a productivity penalty on top of every cost it already had.

## The Milliseconds Argument Doesn't Survive a Profiler

We are not an enormous enterprise. We're small, fast-moving teams dealing with a pile of technical bottlenecks and — far more often — business bottlenecks. When you're building a B2B platform full of composite, dynamic scenarios, the primary concern simply cannot be a few milliseconds of processing time.

And this holds up when you actually measure it. Run a profile on a typical B2B request and the budget goes to network round trips, database query planning, and cold starts. The framework overhead you agonized over is a rounding error against the total. Amdahl's law is unsentimental about this: optimizing a component that accounts for two percent of your latency caps your possible improvement at two percent. Even under the strictest metrics I can construct, that difference — at our scale, weighed against the business value created — is close to nothing.

Meanwhile, the constraint runs the other way at scale. When data volume grows, you need concepts like virtual DOM diffing or virtual scrolling. In a mainstream ecosystem, those are one search and one dependency away. When you're deliberately swimming against the current — say, insisting on native web components with no supporting tooling — you end up reinventing the wheel for the most ordinary requirements, and your version ships later with fewer edge cases handled.

## The Seam Where Business Meets Engineering

Let me be precise about what I'm *not* saying. I'm not claiming the native browser primitives built by the platform giants are flawed. How could I? From a pure engineering standpoint they're more elegant and less buggy than most of what sits on top of them.

What I'm criticizing is an over-engineered mindset that only ever looks at its own side of the table.

Complex business scenarios look genuinely painful from a developer's chair. But we don't get to reject business requirements from a technical position. **The business matters.** My job as the technical side of this equation is to align myself with the product's needs without damaging the core architecture of the application. Yes, there's friction in that. With enough thought, you can almost always find a path where both sides get what they need.

Here's where the real pain lives, and it's the thesis of this whole post: at the exact seam where the business connects to the engineering team, our attention should not be consumed by arguments about packages and base infrastructure. That budget is finite, and it should be spent on domain modeling and correctness — not on whether we're allowed to install a router. Let the work move.

## Deliberate Selection, Not Blind Consumption

None of this is an argument for opening the project and installing packages without thinking. It's an argument for **strategic, conscious selection**, which is a different discipline entirely.

We shouldn't fall off one side of the roof and wire every business artery so tightly to third-party packages that we lose the ability to change them tomorrow. And we shouldn't fall off the other side and spend all our time manufacturing wheels. The questions I now ask before adopting anything:

- **Artery or leaf?** Does this touch a core business flow, or is it a contained utility? Leaves are cheap to get wrong. Arteries are not.
- **What's the exit cost?** If I put this behind an adapter, can one engineer replace it in a sprint? If the answer is no, that's not a dependency — that's a merger.
- **Does it own my domain model, or just transform it?** An ORM that dictates the shape of your entities has reached further into your system than a router that only sees requests and responses.
- **Does it leak?** Once a library's types are spread across your domain layer, removing it becomes a refactor of the whole codebase rather than a swap.
- **What's the project's health?** Release cadence, issue triage latency, bus factor. These are measurable, and they're better predictors than GitHub stars.

Notice that this is the same argument I made in [The Architecture of Sanity](/en/blog/patchlike-fix-bug), just pointed in the opposite direction. There I argued for hard boundaries around business logic to contain the blast radius of failure. Bounded contexts do exactly the same work for dependencies: with a real boundary, a package is a contained, reversible decision. Without one, a package is a structural commitment. The thing I got wrong in that post is that I treated self-written infrastructure as entropy-free. It isn't. It's entropy you own outright, with no community to help amortize it.

For what it's worth, my own archive already contains both answers. [The searchable reading list](/en/blog/strapi-custom-api) worked precisely because I took an off-the-shelf platform and extended it at the edge instead of building a CMS. And [lorem-ipsum.ir](/en/blog/lorem-ipsum-ir-launched) worked because refusing a backend round trip for text generation was genuinely the right call for that problem's scale. The variable was never "dependency, yes or no." It was whether the decision matched the actual shape of the problem.

## Where I Actually Stand

Evaluating a technology on paper is a completely different activity from testing it in practice and watching it collide with a real organization's real problems. Maybe I'll change course again in a year — this post is evidence that I'm willing to. But right now, the pragmatic approach and leaning on the community's accumulated power has given the best answer to the problems in front of us.

I'd genuinely like to hear where you land on this. Have you been caught in the technical perfectionism trap? How do you draw the line between clean code and agile delivery?
