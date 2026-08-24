module Content.Site exposing
    ( domains
    , elsewhere
    , nowFeed
    , spec
    , statement
    , uptimeLine
    )


domains : String
domains =
    "ai / robotics / systems / electronics"


statement : String
statement =
    "I build machines, systems, and ideas."


uptimeLine : String
uptimeLine =
    "est. 2006 · self-taught · no institution was consulted"


spec : List { key : String, value : String }
spec =
    [ { key = "focus", value = "robotics · ml systems" }
    , { key = "languages", value = "zig · c · cuda · python" }
    , { key = "hardware", value = "stm32 · scopes · solder" }
    , { key = "os", value = "linux" }
    , { key = "tracking", value = "none. zero scripts." }
    ]


nowFeed : List { topic : String, detail : String, status : String }
nowFeed =
    [ { topic = "glu"
      , detail = "shared-memory transport + io_uring — making robots talk faster than they can move"
      , status = "active"
      }
    , { topic = "world models"
      , detail = "latent rollouts, jepa-style objectives — can a network imagine physics?"
      , status = "researching"
      }
    , { topic = "plast v2"
      , detail = "redesign around a graph scheduler that owns memory lifetimes"
      , status = "building"
      }
    , { topic = "control theory"
      , detail = "state-space, LQR, and what PID hides from you"
      , status = "studying"
      }
    ]


elsewhere : List { label : String, url : String }
elsewhere =
    [ { label = "github", url = "https://github.com/Vixel2006" }
    , { label = "x", url = "https://x.com/this_vixel" }
    , { label = "mail", url = "mailto:yusufshihata2006@gmail.com" }
    , { label = "linkedin", url = "https://www.linkedin.com/in/yusufmohamed2006" }
    ]
