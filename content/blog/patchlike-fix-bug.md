---
title: "The Architecture of Sanity: What Actually Contained Our Entropy"
draft: true
summary: "Codebases decay unless you spend energy on them — but most advice about that decay is written by people who haven't paid for it. This is the version I can defend: what boundaries are actually for, when the root cause is that the abstraction exists at all, and the bias no textbook lists."
date: 2026-02-25
tags:
  - software-architecture
  - team-psychology
  - technical-debt
  - AI
  - refactoring
---

Codebases decay unless someone continuously spends energy on them. That much I'd still defend — though I used to reach for the Second Law of Thermodynamics to say it, which was a bad metaphor. A codebase is not a closed system. Energy comes in every day, from people. That's precisely why this is a fight you can win, and why losing it is a choice about where that energy goes, not an inevitability.

The question that matters is not _whether_ to spend the energy. It's what you spend it on. For three years I spent mine on the wrong things and had a very sophisticated vocabulary for why. Here's what I'd say now.

## Boundaries Are About Traceability, Not Aesthetics

The point of architectural boundaries isn't elegance and it isn't compliance with a diagram from a book. It's a much more mundane property: **when something goes wrong, how many places do you have to look?**

I can make that concrete now, because I lived the worst version of it. We used signals extensively for state propagation. On paper this is beautiful — declarative, minimal, no manual wiring. In practice, when a value updated unexpectedly, answering "why did this just change?" meant reconstructing a dependency graph in your head, across files, with no call stack to follow. The elegance was real. The traceability was gone. We eventually replaced most of it with plain, boring hooks that are objectively less clever and take five seconds to read.

The same failure had a backend twin. Our data store had no joins, so every endpoint that needed to assemble a payload fetched several collections and stitched them together in application code — by hand, with slightly different consistency assumptions each time. A single data-shape change didn't have one place to go fix. It had eleven, and they disagreed with each other. That's what an unbounded blast radius actually feels like day to day: not drama, just an ambient tax on every change.

I used to frame this with fake complexity notation — a contained bug is `O(1)` risk, a broken state machine is `O(2^n)`. That was dressing an intuition up as math, and the notation isn't even meaningful here. Here's the honest version of the distinction:

- **Debt that stays put.** An ugly utility function with narrow inputs and outputs is a small liability. You can rewrite it in an afternoon and nothing else notices.
- **Debt that crosses layers.** Anything where a single change forces coordinated edits in several places at once compounds, because every future feature pays it again. This is the only kind worth losing sleep over.

The test isn't how bad the code looks. It's how far the change propagates.

## Sometimes the Root Cause Is That the Abstraction Exists

The standard advice here is "don't patch symptoms in the UI, fix the root cause," and I wrote a whole section arguing it. It's correct and it's also the most-repeated sentence in our industry, so let me add the part that actually cost me something to learn.

We had a hand-written finite state machine at the core of a lot of our flows. When bugs appeared, we did the responsible thing: we traced them back to unhandled transitions and fixed the transitions. That's textbook root-cause analysis. We did it for a long time.

The actual root cause was that the state machine should not have existed. When we finally looked at it honestly, the states we were modeling were: idle, loading, error, data. That's it. We had built a general-purpose transition engine for a problem that was one fetch and one very simple hook. Every "root cause fix" we'd made was a well-executed repair on a structure that shouldn't have been there — which is worse than a patch, because a patch is at least cheap.

So the question to ask before the root-cause hunt: **is this a bug in the mechanism, or is the mechanism itself the bug?** Nobody asks this, because the first answer is flattering and the second one means deleting work you were proud of.

And there's a price I never mentioned in the original version of this post. "Fix the root cause" sounds free when you write it as advice. In our case it meant two years of refactoring, ongoing, with real stress and real cost — not to make the code prettier, but because we had hit a genuine dead end on an important product. Anyone giving this advice without naming that number is selling something.

The compensating detail, and the one that surprised me most: **almost every one of those refactors deleted code.** Moving to SQL removed thousands of lines. Dropping the FSM removed more. We had been mistaking the volume of infrastructure we'd written for architectural rigor. I've written up that whole shift separately in [An Honest Audit of My Not-Invented-Here Years](/en/blog/not-invented-here-audit).

## The Bias That Isn't in the Textbook

I originally filled this section with Optimism Bias, Anchoring Bias, Design Fixation, and a recommendation to use Planning Poker. All of that is real and none of it is mine — I'd read about it, not fought it. Cutting it and replacing it with the one bias that actually held us back for three years:

**We built it, so it's ours.** Code you wrote yourself is not evaluated the same way as code someone else wrote. You know why every strange line is there. You remember the constraint that justified it. That knowledge feels like an advantage, and it is exactly what stops you from seeing that the whole thing should be replaced by a dependency someone else maintains. Nobody in the room is neutral about the system they built, and the more capable the team, the stronger this gets, because a competent team can genuinely keep a bad structure alive for years. Survival gets read as validation.

You can't introspect your way out of this — I tried, for three years. But there is a cheap external instrument, and it's the most useful architectural signal I've found:

**Hire someone and watch how long it takes them to be productive.**

If a genuinely capable engineer takes months to become useful in your codebase, the honest reading is not that they're slow, and it's not that your documentation needs work. It's that your architecture is far enough from the common path that everything they already know fails to transfer. That's a measurable number and it's very hard to argue with. Every custom convention, every from-scratch subsystem, every deviation from a framework's defaults shows up in it. We were paying that number for years and reading it as "our stack is advanced."

The related failure was psychological safety, and I'll keep that from the original because I still believe it: if people are afraid, they will not tell you the architecture is wrong. They will route around it quietly, and you'll find out from the code.

## Rigor on the Wrong Axis Costs You Both

The original version of this section framed velocity and safety as a trade-off to be managed. I now think that framing is wrong, and our own history is the counterexample.

We had architectural rigor. We were disciplined, we cared, we did not ship slop. And the business was still blocked — badly. Our static-generation architecture meant anything genuinely dynamic or per-user had to fight the build model, and a whole class of requirements simply couldn't be expressed. After switching to server rendering, we shipped a significant number of business-facing features in a short window. Features that had been sitting unbuildable.

Nothing about the team's discipline changed in that window. The rigor had been pointed at the wrong axis the entire time — we were carefully protecting properties nobody was going to collect on, while the actual constraint sat somewhere we weren't looking.

That's the failure mode I'd warn about now, more than "cutting corners for the MVP." **The wrong architecture doesn't make you trade safety for speed. It takes both.** And the way you find out which axis matters is not by reasoning about it on paper — it's by measuring, under load, on the failure path, against real requirements. Almost every time I've done that, the thing I was optimizing turned out to be a rounding error next to the thing I wasn't.

## Governing AI Without Repeating the Mistake

Generative AI is a multiplier on whatever your team already is. Weak boundaries plus AI is faster decay, not new decay. That part of the original post I stand by, and the operational advice mostly holds:

- **Treat the system prompt as an architectural contract.** Centralized, deliberate prompts that state your layer boundaries beat ad-hoc per-developer prompting.
- **Split the review.** Let automated review handle mechanical properties — formatting, complexity, coverage — and reserve human attention for semantics: is this business logic correct, does it belong in this layer.
- **Make CI unforgiving,** with tests that deliberately try to break things rather than confirm they work.

One line in the original I want to retract. I wrote that the system prompt should specify your "approved lightweight ecosystems," and I meant it as discipline. Reading it back, that's the Not-Invented-Here reflex wearing a governance costume — the same instinct that had us write our own database, encoded into a contract so it would reproduce itself automatically.

And there's a factor I completely missed, which now outweighs most prompt discipline: **whether the model has ever seen your stack.** Widely used tools have enormous representation in training data. An in-house framework has none, and no amount of context stuffing closes that gap. I'm genuinely uneasy about this — it's a strong pressure toward homogeneity, and I don't think that's healthy for the ecosystem. But pretending it isn't real doesn't make it smaller.

## The Question I Used to Ask Rhetorically

I ended the original post with a rhetorical flourish: _if a core business requirement pivots tomorrow, can your architecture adapt cleanly, or will it cascade into collapse?_

I don't get to ask that one rhetorically anymore. The requirements did pivot. Our architecture could not adapt. The answer was two years of refactoring, a large amount of deleted code, and a product that was blocked the whole time we were finding out.

So the version I'd ask now is narrower and more useful, and it's the one I actually apply: **when this breaks, how many places will I have to look, and how would I know that number before it breaks?** If your answer is a feeling rather than a measurement, that's the work.

---

### References

I'll only list what I've actually leaned on:

1. **A Philosophy of Software Design** — John Ousterhout. The deep-versus-shallow module distinction is the most useful lens I've found for judging whether an abstraction is earning its cost. It would have saved me the state machine.
   `https://web.stanford.edu/~ouster/cgi-bin/book.php`
2. **Martin Fowler's Technical Debt Quadrant.** Useful specifically for separating debt you chose from debt you didn't notice — the two need completely different responses.
   `https://martinfowler.com/bliki/TechnicalDebtQuadrant.html`
