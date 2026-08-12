---
title: 'An Honest Audit of My Not-Invented-Here Years'
draft: true
summary: "For three years I avoided every ready-made tool I could, because I believed writing it myself was cleaner and more standard. Here is what that posture actually cost — layer by layer, with the real migrations — what changed when I switched strategy, and why almost every refactor since has deleted code rather than added it."
date: 2026-08-12
tags:
  - software-architecture
  - engineering-culture
  - technical-debt
  - dependencies
  - refactoring
---

I was scrolling through my old LinkedIn posts last week, and then through the archive of this very blog. The pattern is impossible to miss. I was trained inside a very specific engineering culture — one where the highest virtue was technical perfectionism, staying as close to native as possible, and shipping code with as few dependencies as you could get away with.

I've been writing software for about five years. For the first three of them I was fully on that path. For the last two I've been shifting course, gradually and with a lot of friction. That's the whole basis for what follows: three years where it didn't work, and two years where it's finally starting to.

> ⚠️ I'm certainly wrong about parts of this. My experience is limited, and I'm not going to pretend otherwise. What I can say is that the old approach didn't work for us, and that I paid for that knowledge in full. Everything below is "we," and I mean it: I argued for these decisions too. This is an audit of a path I helped walk, not a complaint about someone else's.

## The Problem Was Never Web Components

Let me get this out of the way, because it's the easiest thing to misread. My issue was never Lit, or web components, or any single technology. Those are excellent. The problem was a *posture* that showed up everywhere, in every layer, by default.

We used raw HTTP. Not because raw HTTP was the right call for what we were building, but because using a framework felt like a compromise. It caused endless friction — routing, parsing, error handling, all of it rebuilt by hand, badly, over and over. And I have to ask myself honestly: what exactly is wrong with something like [Hono](https://hono.dev/) that we couldn't go near it? What was I building where micro-optimizations at that layer were the deciding factor?

The same reflex applied to general-purpose databases, ORMs, finite state machines, and essentially every other ready-made tool. The reasoning felt airtight at the time: not using a package meant being closer to the standard, and closer to the standard meant a cleaner architecture.

You can watch this belief operate in my own writing. In [Mastering Eleventy Folder Structures](/en/blog/eleventy-folder-structure-guide) I spent an entire article designing a custom folder layout that deliberately walks away from Eleventy's defaults. Everything in it is defensible in isolation. What I didn't account for is that **every deviation from a framework's default is a permanent tax** paid by every new contributor and every future upgrade. [Self-Hosting Decap CMS](/en/blog/self-hosting-decap-cms) is the purer artifact: I stood up and operated an OAuth backend specifically so I wouldn't have to depend on Netlify. The constraint behind that one was real, and I'd probably make the same call again for that project. The problem is that the *instinct* generalized far beyond its valid scope.

## The Sharpest Example: We Wrote Our Own Database

Yes. Really.

And I want to be fair to it: **it was fast.** Genuinely, measurably fast. On the benchmarks we ran, it beat the alternatives we compared it against, and that was very satisfying.

Then you start listing the scenarios that weren't handled, and the list doesn't stop:

- **The power cuts out mid-write.** What state is on disk when the process comes back? Is it a valid state at all?
- **A write lands half-finished.** A record is partially serialized when the process dies. Nothing detects that on the next read, so you now serve corrupted data as if it were fine.
- **Recovery after an unclean shutdown.** There's no log to replay and nothing to replay it against, so "recovery" means hoping.
- **Write ordering and durability.** When a write is acknowledged, has it actually reached disk, or is it sitting in an OS buffer? If two writes must land in order, what enforces it?
- **Concurrent writers.** Two processes touching the same data with no transactional isolation is a data-loss bug waiting for enough traffic.

Every one of those is a scenario we simply had not built, and — this is the important part — we were never going to have the time to build them properly. That's not a sprint of work. Write-ahead logging, fsync discipline, crash recovery, isolation levels: that *is* what those systems are. We had written the ten percent that's fun and skipped the ninety percent that's the actual product.

Here's the trap I'd fallen into, stated plainly: **a benchmark only measures the happy path.** Durability shows up exclusively in the failure path, which is precisely the path your own benchmark of your own engine will never exercise. We were measuring the dimension we were good at and calling it a win.

Yes, a serious SQL database like PostgreSQL is heavier. But a fully-loaded truck obviously carries more than a fast, stripped-down motorbike — and that weight *is* the payload. What reads as bloat from the outside is decades of accumulated answers to failure modes I hadn't even thought to ask about yet.

## The Loneliness Is a Technical Cost

This is the part I find hardest to convey to people who haven't lived it.

When you build everything yourself, you have nothing off-the-shelf and — much worse — **you share no problems with anyone.** There's no thread to search, no issue to read, no one who has hit your exact bug before. It's you, and you, and you. Nobody is coming to help. That sounds like an emotional complaint, and it is, but it's also a hard engineering constraint on your throughput.

It shows up most brutally in hiring. Try onboarding a new engineer onto a deeply custom stack. It is enormously difficult, and the failure is *not theirs* — they're perfectly capable people who happen to have learned the tools the rest of the world uses. The fix isn't better documentation or more patient mentoring. The fix is to be more standard and more common, so that their existing knowledge transfers on day one instead of month three.

There's a newer dimension too, and it isn't small. A meaningful share of engineering throughput now flows through models trained on public code. Widely used libraries have enormous representation in that training data. An in-house framework has none, and no amount of context stuffing fully closes that gap. When I first wrote about [governing AI code generation](/en/blog/patchlike-fix-bug), I treated the ecosystem as something to *constrain* — I even argued for encoding an approved list of lightweight dependencies into the team's system prompts, which in hindsight is this exact reflex wearing a governance costume. The more consequential variable is whether the model has ever seen your stack at all. It cuts both ways: it's a real conformity pressure and I'm uneasy about how much it will homogenize what people choose. But pretending it isn't a factor doesn't make it one less.

## What Actually Changed

We've been refactoring for two years now, and it's still stressful and still expensive. I want to be precise about the motivation, because it's the opposite of what it looks like: **we are not doing this for prettier code.** We're not repeating the over-engineering mistake in a new costume. We hit a genuine dead end on an important product, and changing was not optional.

Here's the concrete ledger. Each of these is a real migration with a real outcome:

**Custom NoSQL → SQL.** This one deleted thousands of lines. The bulk of that deletion was a single category of code: merging data. Because the store had no joins, every endpoint that needed to assemble a payload for the client had to fetch several collections separately and stitch them together in application code — by hand, with our own consistency assumptions, in a slightly different way each time. That was a permanent source of bugs and an enormous surface to maintain. In SQL it is a join. The database does it, correctly, and the code that used to do it is gone.

**SSG → SSR.** Our static-generation architecture was producing serious business bottlenecks: anything genuinely dynamic or per-user meant fighting the build model, and a whole class of requirements simply couldn't be expressed. After the switch we shipped a significant number of business-facing features in a short window — features that were effectively unbuildable before. Nothing about our engineering ability changed; the architecture had been the constraint the entire time.

**Lit + Eleventy → React + Astro.** Less friction across the board and a clear increase in development speed, largely because the ordinary requirements stopped being research projects. When you need something like virtual scrolling for a large list, in a mainstream ecosystem it's one search and one dependency. Swimming against the current, it was a build.

**Our own FSM → XState, and often no FSM at all.** The library turned out to be simpler than what we had built ourselves, which was already a bad sign. The bigger realization came after: in many places we didn't need a state machine at all. The data-loading states were so constrained — idle, loading, error, data — that the whole apparatus collapsed into a fetch and a very simple hook. We had built a general-purpose mechanism for a problem that never needed one.

**Signals → plain hooks.** Our signal-based flows were extremely hard to trace. When something updated unexpectedly, answering *why* meant reconstructing a dependency graph in your head across files. Plain hooks are less clever and easier to follow, and traceability turned out to be worth far more to us than the elegance we gave up.

**Custom backend → Hono.** Simpler *and* faster. This is the one that most directly refutes my old reasoning, because I had assumed the trade existed at all. It didn't — we got better performance and a smaller codebase in the same move.

Look at the shape of that list. Almost every migration **removed** code. That's the detail I'd most want my past self to see: the outcome of adopting community tooling wasn't a bloated codebase — it was a dramatically smaller one. We had been mistaking volume of self-written infrastructure for architectural purity.

There's an earlier version of the same lesson in my own archive, and I missed it at the time. [The searchable reading list](/en/blog/strapi-custom-api) worked precisely because I took an off-the-shelf platform and extended it at the edge instead of building a CMS from scratch.

## The Community Isn't Always Right Either

I don't want any of this read as "follow the crowd." The community gets things wrong constantly, and hype is a real force. Anyone who has been around a few years has a graveyard of tools that everyone agreed were the standard right up until they weren't.

I'd go further with an observation I find genuinely interesting. In a smaller ecosystem like Lit, the average package quality tends to be *higher*. I don't think that's because the technology is better — I think it's a self-selection effect. The people who ended up there generally arrived with deeper knowledge, because it isn't the door most people walk in through. In a huge ecosystem like React, you get more of everything, and that includes more bad packages. That's not a criticism of React; it's just what scale does to a distribution. It means "popular" is a signal about ecosystem size, not about quality, and you still have to evaluate each dependency on its own.

But writing off the community wholesale? Are we gods of code? How much of this enormous ocean do any of us actually understand? Rejecting the accumulated work of thousands of engineers because some of it is fashion-driven is its own kind of arrogance — and it's the one I was practicing.

So the answer isn't "always build" or "always install." It's **deliberate selection**, which is a real discipline. The questions I ask now:

- **Artery or leaf?** Does this touch a core business flow, or is it contained? Leaves are cheap to get wrong.
- **What's the exit cost?** If it sits behind an adapter, can one engineer replace it in a sprint? If not, that's not a dependency — it's a merger. (And I'll admit the tension here: an adapter thick enough to make a swap easy is itself a small reinvention. There's no free version of this.)
- **Does it own my domain model, or just transform it?** An ORM that dictates entity shape has reached much further in than a router that only sees requests and responses.
- **Project health.** Release cadence, issue triage latency, bus factor — measurable, and far better predictors than star counts.

This is the same argument I make in [The Architecture of Sanity](/en/blog/patchlike-fix-bug), just pointed the other way: hard boundaries exist to limit how far a failure propagates, and they do exactly that job for dependencies too. The thing my earlier thinking missed is that self-written infrastructure isn't entropy-free. It's entropy you own outright, with no community to help you amortize it.

## Don't Pay Today for a Bottleneck You'll Never Reach

The strongest thing I can say against my old self is this: we were paying real, daily, compounding costs to protect against problems we had never actually measured hitting.

I'm not claiming those problems are imaginary. Maybe in ten years our bottleneck genuinely becomes render performance and we're forced into another refactor. Fine — I'll take that trade. Right now, and plausibly for the next nine years, we ship fast. Paying today for a limit we will probably never reach is not engineering rigor; it's insurance against a risk nobody underwrote.

And the discipline that goes with it: **you don't get to decide this on paper.** Reasoning about which architecture is theoretically faster is a completely different activity from benchmarking it, and different again from watching it collide with a real product's real requirements. Measure the thing. Under load. On the failure path too. Almost every time I've done that, the component I was agonizing over turned out to be a rounding error against network round trips and database work.

That was also true of [lorem-ipsum.ir](/en/blog/lorem-ipsum-ir-launched), for what it's worth — refusing a backend round trip for text generation really was correct there. The variable was never "dependency, yes or no." It's whether the decision matches the actual measured shape of the problem.

## What I Take From It

The most valuable side effect of this whole shift is one I didn't anticipate: it makes you continuously refactor and argue with your own old code. You stop defending past decisions because they're yours. This post is itself an instance of that.

I've been at this two years and I'm still in the middle of it. Maybe I'll change course again — this article is evidence I'm willing to. But right now, leaning on the community's accumulated work has given the best answer to the problems actually in front of us.

This subject is far bigger than one article, and I've barely scratched it here. I'll be writing more about it.

I'd genuinely like to hear where you land. Have you been caught in this trap? How do you draw the line between clean code and shipping?
