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
    "I like computers."


uptimeLine : String
uptimeLine =
    "est. 2006 · self-taught"


spec : List { key : String, value : String }
spec =
    [ { key = "focus", value = "robotics · ml systems" }
    , { key = "languages", value = "zig · c · cuda · python" }
    , { key = "hardware", value = "stm32 · scopes" }
    , { key = "os", value = "linux" }
    ]


nowFeed : List { topic : String, detail : String, status : String }
nowFeed =
    [ { topic = "glu"
      , detail = "shared-memory transport + io_uring — making robots talk faster than they can move"
      , status = "active"
      }
    , { topic = "world models"
      , detail = "latent rollouts, jepa-style objectives — can a network imagine physics?"
      , status = "studying"
      }
    , { topic = "multimodal representation learning & modality gap"
      , detail = "researching about how to remove modality gap and learn perfect multimodal representation for improving robot perception"
      , status = "researching"
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
