---
title: 'Separating Commits in Git: A Guide to Streamlining Your Workflow'
description: Explain git-separate for a better experience when using trunk-based deployment.
socialImage: assets/img/blog/git-separate/cover.jpg
type:
  - Training
keywords:
  - git
---

Hi everyone,
Today I want to speak about a problem that I have in my daily work with Git when using a trunk-based deployment pattern, and how can solve it with some commands.
First, we need to know about trunk-based deployment, then I will present my problem.

Let's dive in!

## What is Trunk-based deployment?

TDB, or Trunk-based pattern is a modern way for developers to work together using version control, where each developer divides their work into small batches and merges that work into the trunk at least once a day.

The key difference between this approach and git-flow workflow is **scope**.
Feature branches typically involve multiple developers and take days or even weeks of work. In contrast, branches in TDB typically last no more than a few hours, with many developers merging their changes into the trunk frequently.

{% image "assets/img/blog/git-separate/trunk-based-deployment.jpg", "Trunk-based deployment process explanation." %}

The above paragraph was taken from the Google Cloud [article](https://cloud.google.com/architecture/devops/devops-tech-trunk-based-development) about DevOps in trunk-based development, you can refer to this article for more information.

## Our problem

Sometimes it happens that we want to create a feature that depends on several packages, and generally, we have to do several things together and then create a pull request.
At this time, it will be perfect to easily commit wherever we want, and after finishing the work, we can apply according to the rules of TBD pull request, and all our code can be easily reviewed and merged.

There are two git commands we need to learn for solving this problem. I'll explain briefly below, but you can skip it if you already know them.

## Git rebase

Rebasing is the process of moving or combining a sequence of commits to a new base commit. changing the base of your branch from one commit to another making it appear as if you'd created your branch from a different commit. Internally, Git accomplishes this by creating new commits and applying them to the specified base.

{% image "assets/img/blog/git-separate/git-rebase.jpg", "Git rebase explanation" %}

read more about this command on the [Atlassian blog](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase).

## Git cherry-pick

Cherry-pick enables arbitrary Git commits to be picked by reference and appended to the current working HEAD. Cherry picking is the act of picking a commit from a branch and applying it to another.

read more about this command on the [Atlassian blog](https://www.atlassian.com/git/tutorials/cherry-pick).

## Solution

Now that we know about Trunk-based deployment, git rebase, and git cherry-pick commands, we can use them to solve our problem of having multiple commits from multiple packages and features in a single branch.

Let's say we have a commit history like this:

{% image "assets/img/blog/git-separate/big-pr-screenshot.jpg", "screenshot of Github pull request with many commits." %}

This is a bad situation because it makes the review process too long and complicated. We need to separate these commits into multiple branches, one for each feature and package.

Let's start by separating the first and last commits, which are about the `package-1` feature. These two commits only change **a single feature in a single package**, so they are a good candidate for separation.

First, create a new branch from the trunk branch, then, we need to copy the hash of these two commits. and we can use the git `cherry-pick` command to copy them into a new branch called `feat/package-1`.

```sh
git switch -c feat/package-1 origin/next
git cherry-pick <hash of first commit>
git cherry-pick <hash of second commit>
```

{% image "assets/img/blog/git-separate/git-commit-screenshot.jpg", "Screenshot of terminal use git cherry-pick to separate commit." %}

> if you have a conflict when want to cherry-pick, you must first rebase your branch with a trunk to resolve any conflict, if you still have conflict, that's occurred maybe because you don't commit correctly! you can use rebase to fix the commit issue.

Now we have a new branch with new two commits. We can create a pull request for this branch and merge it into the trunk branch.
Once the pull request is approved and merged, we can rebase the first branch with the trunk branch.

{% image "assets/img/blog/git-separate/git-rebase-branch-screenshot.jpg", "Screenshot of terminal use git rebase." %}

This will remove the two commits from the first branch and keep our commit history clean, then you must force push the branch.

{% image "assets/img/blog/git-separate/smaller-pr-screenshot.jpg", "Screenshot of Github pull request with fewer commits that are removed by git rebase and cherry-pick." %}

We can use the same process to separate the other commits in our history. This will give us a nice, clean commit history with one commit per feature and package, with a full cover of the trunk-based deployment pattern.

In the end, I have shared my shell function, used by me daily for separating commits:

```sh
gsep () {
  currentBranch=$(git rev-parse --abbrev-ref HEAD) && \
  git fetch origin && \
  git switch -c feat/$1 origin/next && \
  shift && \
  git cherry-pick $@ && \
  git push -u && \
  gh pr create -a @me --base next --fill --web && \
  git switch $currentBranch;
}
```

This function takes the name of a feature as its argument and creates a new branch called `feat/$1`. It cherry-picks the specified commits into the new branch and creates a pull request for it. then switches back to the original branch.

I hope this article will help you to have a better experience with git and trunk-based deployment.
Thanks for reading!
