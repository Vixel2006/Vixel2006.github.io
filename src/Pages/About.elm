module Pages.About exposing (about)

{-| The about document, kept as markdown so the author can edit prose without
touching layout code.
-}


about : String
about =
    """I taught myself to write code at 11, calculus at 14, Lagrangian mechanics at 16. Since then I've lived somewhere between C, Zig, CUDA and whatever problem refuses to leave me alone. In two years college takes the "self-taught" label away from me — I intend to make the most of it while it's still mine.

I build [glu](https://github.com/Vixel2006/glu), a robotics middleware in Zig, and [plast](https://github.com/Vixel2006/plast), a deep learning engine in C/CUDA. The long game is a software stack for robotics built from the ground up — no bloat, no abstractions that leak, no corporate rot — with machine intelligence that actually understands physics running on top of it: world models, representation learning, agents that model the world rather than paraphrase the internet.

This site is my lab notebook. What I'm building, breaking, reading and failing at — documented as honestly as I can manage.

---

## Why robotics

Software that only lives on a screen always felt like half the story. Robots force every abstraction you write to survive contact with physics — timing budgets, sensor noise, gravity. That constraint is exactly what makes the engineering interesting: you can't argue your way out of a bug that ends with a broken actuator.

## Why systems

Because performance is a design decision, not an afterthought. I like being close enough to the metal to know what the machine is actually doing — allocators, schedulers, syscalls, cache lines. Understanding the whole stack is the difference between *using* tools and *making* them. Zig is currently my favorite place to stand: C-level control, compile-time metaprogramming, and no hidden control flow.

## Why AI

Not wrappers — foundations. I care about the training systems, the architectures, and eventually models that hold a predictive representation of the world good enough to act in it. Deep learning gave us perception; world models are how it gets imagination. Someone has to build the infrastructure that makes those trainable at robot timescales — I want to be one of those someones.

> NOTE: currently on the bench — STM32 boards, a logic analyzer, and more jumper wires than any one desk should contain. Control theory textbooks are winning so far.

## Things I'm learning right now

- Embedded systems & electronics
- Control theory
- Reinforcement learning
- World models & representation learning
- Robotics middleware design
- Compilers, slowly and stubbornly

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
> theme: catppuccin mocha, forever"""
