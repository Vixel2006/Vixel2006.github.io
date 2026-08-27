module Pages.About exposing (about)

{-| The about document, kept as markdown so the author can edit prose without
touching layout code.
-}


about : String
about =
    """A self-thought nerd, I started programming at late 11, studied calculus, and linear algebra at 14, I love the process of writing low-level code that is close to the machine where every line of code really matter, I'm interesting in physical ai, which is basically how to make ai do the boring stuff for you, currently researching different ways to make neural networks learn a multimodal joint representation so that we can fuse agents' inputs from different sensors into a latent space to plan and take actions in.

I build [glu](https://github.com/Vixel2006/glu), a robotics middleware in Zig, and [plast](https://github.com/Vixel2006/plast), a deep learning engine in C/CUDA. The long game is a software stack for robotics built from the ground up — no bloat, no abstractions that leak, no corporate rot — with machine intelligence that actually understands physics running on top of it: world models, representation learning, agents that model the world rather than paraphrase the internet.

This site is my lab notebook. What I'm building, breaking, reading and failing at — documented as honestly as I can manage.

---

## Why robotics

I have always been interested in a lot of stuff, I want to write unix systems code, embedded code, design electronics, and experiment with neural networks, which makes robotics a great fit for me, and how useful and transformative this technology can be is a cherry of the top for me tbh.

> NOTE: currently on the bench — STM32 boards, a logic analyzer, and more jumper wires than any one desk should contain. Control theory textbooks are winning so far.

## Things I'm learning right now (reading papers, doing projects is the only way you get better)

- Embedded systems & electronics
- Control theory
- Reinforcement learning
- World models & representation learning
- Robotics middleware design

## What I want to build eventually

- A complete open software stack for robots, built bottom-up: middleware, control, and learned models designed together instead of stapled apart.
- A robot running entirely on software I wrote — from the wire protocol up to the world model.
- Tooling that makes embodied intelligence cheaper to build, so more people can do it.

## Contact

The fastest way to reach me is [email](mailto:yusufshihata2006@gmail.com). I'm also on [GitHub](https://github.com/Vixel2006), [X](https://x.com/this_vixel) and [LinkedIn](https://www.linkedin.com/in/yusufmohamed2006).

---

> webmaster: vixel
> pgp: ask nicely
> uptime: since 2006
> personality: hacker, forever"""
