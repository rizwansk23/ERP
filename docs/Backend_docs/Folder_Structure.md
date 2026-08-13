# Backend Structure 

```
Backend/
├── src/
│   ├── config/                  # env, db config
│   │   ├── index.ts
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   ├── routes/                  # API route definitions
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   └── staff.routes.ts
│   │
│   ├── controllers/             # request/response handling only
│   │   ├── index.ts
│   │   ├── user.controller.ts
│   │   └── staff.controller.ts
│   │
│   ├── services/                # business logic
│   │   ├── index.ts
│   │   ├── user.service.ts
│   │   └── staff.service.ts
│   │
│   ├── repositories/            # DB queries (data access layer)
│   │   ├── user.repository.ts
│   │   └── staff.repository.ts
│   │
│   ├── models/                  # DB schemas / entities
│   │   ├── user.model.ts
│   │   ├── staff.model.ts
│   │   └── task.model.ts
│   │
│   ├── middleware/               # auth, error handler, rate limit
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── user.middleware.ts
│   │   └── staff.middleware.ts
│   │
│   ├── validations/              # request payload validation (zod/joi)
│   │   ├── task.validation.ts
│   │   └── user.validation.ts
│   │
│   ├── utils/                    # helpers
│   │   ├── logger.ts
│   │   └── asyncHandler.ts
│   │
│   ├── constants/
│   │   ├── task.constants.ts
│   │   └── httpStatus.constants.ts
│   │
│   ├── errors/                   # custom error classes
│   │   ├── AppError.ts
│   │   └── NotFoundError.ts
│   │
│   └── app.ts                    # express app setup (middleware, routes)
├── server.ts                 # server bootstrap (listen)
│
├── .env                          # actual secrets (gitignored)
├── .env.example                  # sample env for team
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Layer responsibility
```
Route -> Controller -> Service -> Repository -> Model/DB
```
- **Route**: URL + method mapping only
- **Controller**: parse request, call service, send response
- **Service**: business logic, calls repository
- **Repository**: raw DB queries only
- **Model**: schema/entity definition
