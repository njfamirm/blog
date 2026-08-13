---
title: "Not-Invented-Here Syndrome: An Honest Audit of My Three Years"
summary: "For three years we wrote everything ourselves — the database, the backend, the state machine. An honest audit of what not-invented-here syndrome actually cost, and why every migration since has deleted code."
date: 2026-08-12
tags:
  - software-architecture
  - engineering-culture
  - technical-debt
  - dependencies
  - refactoring
---

**The short version:** for three years we treated every dependency as a compromise and built our own database, HTTP layer, state machine, and signals. It was measurably fast and structurally unsound. Migrating to Postgres, Hono, XState, React, and Astro **deleted** thousands of lines rather than adding them. Not-invented-here syndrome doesn't produce a leaner codebase; it produces one nobody else can help you carry.

A few days ago I stumbled on one of my own old LinkedIn posts, where I challenged the community: _"If you wanted to convince someone like me, who uses a web component library like lit.dev, to use React, what reasons would you give? Keeping in mind that we want to build a high-quality project, not just something easy to learn..."_

I was convinced I already had the answer: there is no real difference, and Lit is simply better. I was trained inside a specific engineering culture — one where the highest virtue was technical perfectionism, staying as close to native as possible, and shipping code with as few dependencies as you could get away with.

I've been writing software for about five years. That is the whole basis for what follows: **three years where we made things unnecessarily hard on ourselves, and two years where we focused on faster development**. This is an audit of a path I actively helped walk and argued for.

## The Problem Was Never Web Components

My issue was never Lit, or web components, or any single technology. Those are excellent. The problem was a _posture_ that showed up in every layer, by default.

We used `node:http` directly. Not because that was the right call for what we were building, but because using a framework felt like a compromise. Routing, parsing, error handling — all of it rebuilt by hand, over and over, and never as well as the version we could have had for free. What exactly is wrong with something like [Hono](https://hono.dev/) that we couldn't go near it? What was I building where micro-optimizations at that layer decided anything?

The same reflex applied to general-purpose databases, ORMs, finite state machines, and essentially every other ready-made tool. The reasoning felt airtight at the time: not using a package meant being closer to the standard, and closer to the standard meant a cleaner architecture.

That path wasn't nothing, though. It left me with the habit of not taking a decision at face value just because it turned up in a tutorial or a changelog, and with time spent in layers I would otherwise never have opened. I was one contributor among others; mostly what I got was the chance to watch these things being built up close.

## The Sharpest Example: We Wrote Our Own Database

Yes. Really.

And credit where it's due: **it was fast.** Genuinely, measurably fast. On the benchmarks we ran, it beat the alternatives we compared it against, and that was very satisfying.

Then you start listing what it didn't handle. No WAL. No fsync discipline, so a power cut mid-write left torn pages on disk. No MVCC, no row locking, so concurrent writers interleaved freely. No crash recovery, no checkpointing, no atomicity past a single write. Not one letter of ACID, and no realistic path to earning them. We had written the ten percent that's fun and skipped the ninety percent that prevents catastrophic failure.

Here's the trap, stated plainly: **a benchmark only measures the happy path.** Durability shows up exclusively in the failure path, which is precisely the path your own benchmark of your own engine will never exercise. We were measuring the dimension we were good at and calling it a win.

Yes, a serious SQL database like PostgreSQL is heavier. But a fully-loaded truck carries more than a fast, stripped-down motorbike, and that weight _is_ the payload. What reads as bloat from the outside is decades of accumulated answers to failure modes I hadn't even thought to ask about yet.

## The Loneliness of a Custom Stack Is a Technical Cost

When you build everything yourself, **you share no problems with anyone.** There's no thread to search, no issue to read, no one who has hit your exact bug before — and no model trained on it either. That sounds like an emotional complaint, and it is, but it's also a hard engineering constraint on your throughput.

It shows up most brutally in hiring. Onboarding a new engineer onto a deeply custom stack is enormously difficult, and the failure is _not theirs_ — they're perfectly capable people who happen to have learned the tools the rest of the world uses. The fix isn't better documentation or more patient mentoring; it's being standard enough that their existing knowledge transfers on day one instead of month three.

And it isn't only new hires. Sooner or later this code lands on an engineering manager who never chose any of it and inherits the debt anyway.

## What We Changed So the Business Could Move

None of this was a rewrite for its own sake. Every one of these changes happened because something the business was asking for sat behind it, blocked.

**Custom NoSQL → SQL.** The store had no joins, so every endpoint that assembled a payload for the client fetched several collections separately and stitched them together in application code — by hand, with our own consistency assumptions, in a slightly different way each time. Every new feature paid that tax on the way in, then paid it again in bugs. In SQL it's a join. Thousands of lines went with it, and shipping an endpoint stopped being a small project.

**SSG + CSR → SSR + CSR.** Static generation was blocking the roadmap: anything dynamic or per-user meant fighting the build model, and some of what the business asked for couldn't be built at all. We now push as much as we reasonably can to the server. The reasoning we dropped along the way is the part worth flagging: we used to move work to the client specifically to keep load off the server. Server capacity is something you can buy. Your team's time isn't, and we were spending it to protect the resource we could have simply paid for. After the switch, features that had been effectively unbuildable started shipping. Nothing about our engineering ability changed; the architecture had been the constraint the entire time.

**Lit + Eleventy → React + Astro.** Ordinary requirements stopped being research projects, and that shows up directly in what we can promise and when. Virtual scrolling for a large list is one search and one dependency in a mainstream ecosystem. Against the current, it was something we had to build first and then keep alive forever.

**Our own FSM and signals → XState, plain hooks, and often nothing at all.** The bill here was paid in debugging. Our signals were very hard to trace: when something updated unexpectedly, answering _why_ meant rebuilding a dependency graph in your head across files, and that time came out of the same week the feature was due. The state library turned out to be simpler than what we'd built ourselves, which was already a bad sign — and in a lot of places we didn't need a state machine at all: idle, loading, error, data collapsed into a fetch and a small hook.

**Custom backend → Hono.** Simpler _and_ faster, with less of our own code to keep alive. This is the one that most directly refutes my old reasoning: I had assumed there was a trade at all. There wasn't.

Those middle two are really the same story. We had accumulated a whole stack of small homegrown packages, and they weren't peripheral: they sat directly on our technical bottlenecks and quietly decided the architecture for us. The problem was never effort, it was scope — we hadn't seen anything close to the range of scenarios a mature state library has already been forced to handle. And what we ended up with was our own invented vocabulary, mapping onto nothing the wider community used, so every new person had to learn our dialect before they could even reach the actual problem. Behind XState there are years of contributors absorbing edge cases on everyone's behalf. Behind ours, there was us.

Look at the shape of that list. Almost every migration **removed** code. That's the detail I'd most want my past self to see: the outcome of adopting community tooling wasn't a bloated codebase — it was a dramatically smaller one. We had been mistaking volume of self-written infrastructure for architectural purity.

## The Community Isn't Always Right Either

I don't want any of this read as "follow the crowd." The community does get things wrong, and hype is a real force — anyone who has been around a few years has a list of tools everyone agreed were the standard right up until they weren't. That's a real cost of the path we chose, and I'd rather name it than pretend it away. We take the common road knowing it will sometimes be the wrong one, and knowing that when it is, we'll be turning around alongside everyone else rather than on our own.

But writing off the community wholesale is a different move entirely. How much of all that work does any one of us actually understand? Setting aside the accumulated effort of thousands of engineers because some part of it is fashion-driven asks an enormous amount of your own judgment. More, I think, than mine could carry.

What my earlier thinking missed either way is that self-written infrastructure isn't entropy-free. It's entropy you own outright, with no community to help you amortize it.

## The Future We Thought We Were Buying

The clearest thing this audit turns up: we were paying real, daily, compounding costs to protect against problems we had never actually measured ourselves hitting. That isn't engineering rigor; it's insurance against a risk nobody underwrote.

And the story we told ourselves about those costs was always about the future. Own every layer, and years from now there'd be less to maintain, fewer surprises, less support load pressing down on the business. That's an honest motivation, and not a stupid one.

It just doesn't survive contact with how software actually gets supported. Leaning on yourself costs development speed first, and slow delivery breaks a business long before a render benchmark does. Then it costs coverage: we were a handful of people, and a handful of people never sees the range of scenarios thousands of contributors have already been forced to handle. Both of those bills come due _later_ — in exactly the years we thought we were protecting. Community-backed code is the better bet for ten years out too. It keeps getting fixed, extended, and learned by people we haven't hired yet, while anything we wrote ourselves stays frozen at the understanding we had the week we shipped it.

I should be careful about how far I generalize that, though. We were a small team building a product that needed to reach its market, and every conclusion above is calibrated to exactly that. Where the constraints are far stricter and the failure mode is something worse than a slow quarter, some of what I've written here is probably the wrong call. The claim isn't that our answer is the right answer. It's that it fit the shape of our problem, which is the thing I wasn't checking before.

## What I Take From It

The thing I'd least like this piece to become is a verdict on those years. I came out of them able to ask what sits underneath a tool before reaching for it, and that isn't a small thing to be handed. The people I learned it from were doing their honest best with what they knew at the time, and I was one of them. Pointing fingers — at myself or at anyone else — misses what's actually worth looking at. The posture is the subject here, not whoever happened to be holding it.

I may well change course again; this article is evidence I'm willing to. But so far, leaning on the community's accumulated work has given the better answer to the problems actually in front of us. The part I deliberately left out — how I weigh a dependency now, question by question — is the one I want to write next.

---

If you've worked inside this posture, or you're arguing with someone who still does, I'd like to hear how it went for you — leave a response below, or find me on [LinkedIn](https://www.linkedin.com/in/njfamirm-me/).
