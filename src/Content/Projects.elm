module Content.Projects exposing (gluTopology, projects, research)

import Types exposing (Project, ResearchEntry)


{-| Things with repos. Ordered by how much they matter to me, not by date.
-}
projects : List Project
projects =
    [ { id = "glu"
      , name = "glu"
      , tagline = "Robotics communication infrastructure. One binary, predictable latency."
      , domain = "robotics middleware"
      , lang = "zig"
      , status = "active"
      , period = "2026—"
      , url = "https://github.com/Vixel2006/glu"
      , urlLabel = "source"
      , why = """I was getting into robotics programming for the first time, I tried to learn ROS 2, I found it very boring and complex, with a lot of abstractions, so I thought I can make a much simpler version that is performant, reliable, and lightweight, so I'm building glu."""
      , engineering =
            [ "Shared-memory transport between processes on the same host — zero-copy where it matters most."
            , "io_uring on Linux for network I/O; TCP when delivery matters, UDP when latency does."
            , "Peer discovery, so nodes find each other without a central master process."
            , "Message schemas defined once and turned into code — types checked at compile time, not at runtime."
            , "A simple determinstic daemon for discovery and managing the nodes."
            ]
      , stack = [ "zig", "posix", "io_uring", "shared memory", "tcp / udp", "codegen", "linux daemon" ]
      }
    , { id = "plast"
      , name = "plast"
      , tagline = "A deep learning engine written from scratch — no framework magic."
      , domain = "deep learning systems"
      , lang = "c / cuda"
      , status = "maybe done"
      , period = "2025—"
      , url = "https://github.com/Vixel2006/plast"
      , urlLabel = "source"
      , why = """I didn't want to treat the training stack as a black box. Building my own means every autograd edge, kernel launch and allocator decision passes through my hands — which turns "deep learning frameworks" from magic into machinery I fully understand, now that I have much more experience I can think of million better ways to make it a better library, so maybe I will return to it someday in the future"""
      , engineering =
            [ "Hand-optimized CUDA kernels instead of vendor calls everywhere."
            , "A graph-based scheduler that owns execution order and memory lifetimes."
            , "A minimal JIT backend to strip runtime overhead out of the hot path."
            , "Autograd built from first principles, not bolted on."
            ]
      , stack = [ "c", "cuda", "autograd", "jit" ]
      }
    , { id = "grf"
      , name = "grf"
      , tagline = "Multimodal fusion layers with linear-scaling attention for vision-language models."
      , domain = "research"
      , lang = "multimodal learning"
      , status = "preprint"
      , period = "2026"
      , url = "https://github.com/Vixel2006/GRF"
      , urlLabel = "preprint"
      , why = """Cross-modal attention gets expensive quadratically as you fuse longer sequences. GRF is an attempt at fusion layers that scale linearly without gutting downstream quality — explored through a pre-print on multimodal fusion in transformer architectures."""
      , engineering =
            [ "Linear-scaling attention variant for fused vision-language sequences."
            , "Fusion layer design compared against standard cross-attention baselines."
            , "Experiments run on tooling that grew into plast."
            ]
      , stack = [ "transformers", "attention", "vision-language" ]
      }
    ]


research : List ResearchEntry
research =
    [ { id = "world-models"
      , kind = "notes"
      , title = "World models for robot control"
      , abstract = "Working toward predictive models that learn dynamics in latent space — the long-term goal is a robot that imagines the outcome of an action before committing actuators to it."
      , status = "exploring"
      , links = []
      , notes =
            [ "Studying JEPA-style predictive architectures versus pixel-reconstruction approaches."
            , "Latent rollouts: cheap imagination, but how much physics do they actually retain?"
            , "glu's telemetry stream could double as the data plumbing for training such models."
            ]
      , related =
                [ ( "project: glu", "#/projects" )
                , ( "field note: zig", "#/writing/2026-07-09-zig" )
                ]
      }
    , { id = "representation-learning"
      , kind = "notes"
      , title = "What should a representation remember?"
      , abstract = "Ongoing notes on representation learning: contrastive versus reconstructive objectives, what a policy actually needs from its encoder, and how much of the world a compressed state can afford to forget."
      , status = "ongoing"
      , links = []
      , notes =
            [ "Contrastive objectives throw away detail — sometimes exactly the detail control needs."
            , "Small-scale experiments before scaling: measure what survives compression."
            ]
      , related = [ ( "project: plast", "#/projects" ) ]
      }
    , { id = "grf-fusion"
      , kind = "paper"
      , title = "GRF: multimodal fusion at linear cost"
      , abstract = "A pre-print on multimodal fusion layers in transformer architectures. Cross-attention cost explodes as fused sequences grow; GRF explores a linear-scaling attention mechanism for vision-language models and measures where it holds up."
      , status = "preprint"
      , links = [ ( "github.com/Vixel2006/GRF", "https://github.com/Vixel2006/GRF" ) ]
      , notes =
            [ "Attention over the fused sequence drops from quadratic to linear in length."
            , "Quality gap measured against standard cross-attention baselines."
            ]
      , related = [ ( "project: grf", "#/projects" ), ( "project: plast", "#/projects" ) ]
      }
    ]


{-| The honest way to draw architecture diagrams.
-}
gluTopology : String
gluTopology =
    """  DRIVERS                      GLU BUS                       CONSUMERS
 ┌──────────┐   publish    ┌─────────────────┐   subscribe   ┌──────────────┐
 │ camera   │ ───────────▶ │ shared mem rings│ ────────────▶ │ control loop │
 │ imu      │ ───────────▶ │ io_uring net    │ ────────────▶ │ logger       │
 │ teleop   │ ───────────▶ │ discovery       │ ────────────▶ │ telemetry    │
 │ ...      │ ───────────▶ │ typed msgs      │ ────────────▶ │ ...          │
 └──────────┘              └─────────────────┘               └──────────────┘
        same host: shm, zero copy   ·   off host: tcp/udp over io_uring"""
