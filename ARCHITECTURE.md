# College Admissions Platform - System Architecture

## Tech Stack & Versions

### Frontend
- **React**: 18.2.0
- **Next.js**: 14.0.0 (for SSR, routing, and API routes)
- **Tailwind CSS**: 3.3.0
- **TypeScript**: 5.0.0
- **React Hook Form**: 7.45.0 (form management)
- **React Query**: 4.32.0 (API state management)
- **Zustand**: 4.4.0 (global state)
- **React PDF**: 7.3.0 (PDF generation)
- **Retell SDK**: Latest (voice integration)

### Backend
- **Node.js**: 20.x LTS
- **Express**: 4.18.0
- **TypeScript**: 5.0.0
- **PostgreSQL**: 15.x
- **Prisma ORM**: 5.0.0 (database management)
- **JWT**: 9.0.0 (authentication)
- **bcrypt**: 5.1.0 (password hashing)
- **multer**: 1.4.5 (file uploads)
- **cors**: 2.8.5
- **helmet**: 7.0.0 (security)

### External APIs
- **Anthropic Claude API**: claude-3-sonnet-20240229
- **Retell API**: Voice conversation platform
- **SendGrid**: Email service (optional)

## System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ - React UI      │    │ - REST API      │    │ - User Data     │
│ - Retell Widget │    │ - Auth System   │    │ - Applications  │
│ - PDF Gen       │    │ - LLM Integration│    │ - Interviews    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Retell API    │    │  Anthropic API  │
│                 │    │                 │
│ - Voice Calls   │    │ - LLM Responses │
│ - Transcription │    │ - Content Gen   │
│ - Agent Config  │    │ - Analysis      │
└─────────────────┘    └─────────────────┘
```

## User Types & Features

### Students
1. **Authentication**: Email/password registration and login
2. **Profile Management**: Personal information, academic history
3. **Interview System**: 4-part voice interview via Retell
4. **Application Generation**: PDF and web-based applications
5. **Archetype Profiles**: AI-generated personality/academic profiles
6. **Application Editing**: LLM-assisted editing and improvement
7. **Application Tracking**: Status monitoring across colleges

### Colleges
1. **Authentication**: Email/password registration and login
2. **Profile Management**: Institution information, requirements
3. **Applicant Analytics**: Dashboard with application statistics
4. **Application Review**: View, analyze, and respond to applications
5. **Response Management**: Accept/reject/waitlist decisions
6. **Communication**: Messaging with applicants

## Data Flow Architecture

### Interview Flow
1. Student initiates interview → Frontend calls Retell API
2. Retell conducts voice interview → Transcription sent to backend
3. Backend processes with Claude API → Generates insights
4. Results stored in database → Available for application generation

### Application Flow
1. Student requests application → Backend aggregates profile + interview data
2. Claude API generates application content → PDF generated
3. Application submitted to colleges → Notifications sent
4. College reviews → Decision recorded → Student notified

## Security Considerations
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- CORS configuration for frontend domain
- Rate limiting on API endpoints
- Input validation and sanitization
- Environment variable management for secrets

## Deployment Architecture
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Railway (Node.js hosting)
- **Database**: Railway PostgreSQL
- **File Storage**: Local filesystem (expandable to S3)
- **Environment**: Production/Staging/Development configs