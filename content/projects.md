## glu

**Robotics communication infrastructure. One binary, predictable latency.**

Domain: robotics middleware · Lang: zig · Status: active · Period: 2026—

[source](https://github.com/Vixel2006/glu)

I was getting into robotics programming for the first time, I tried to learn ROS 2, I found it very boring and complex, with a lot of abstractions, so I thought I can make a much simpler version that is performant, reliable, and lightweight, so I'm building glu.

- it must be just a **robotics communication middleware**, not an **OS**.
- it must be one lightweight binary that can be used in compute constrained systems, with no abstraction overhead and massive layers to setup.
- it must be very easy and boring to use, if you have to think about communication while using it instead on working on the robot logic and brain then **glu** had failed.
- it must scale well for real-world massive projects.

---

## grf

**Multimodal fusion layers with linear-scaling attention for vision-language models.**

Domain: research · Status: preprint · Period: May 2025 - July 2025

[preprint](https://github.com/Vixel2006/GRF)

Cross-modal attention gets expensive quadratically as you fuse longer sequences. GRF is an attempt at fusion layers that scale linearly without gutting downstream quality — explored through a pre-print on multimodal fusion in transformer architectures.

- a not so bad trial to make multimodal models more compute efficient.
