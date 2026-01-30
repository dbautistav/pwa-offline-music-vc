# Tasks: CDN Toggle and Lucide Icons

**Input**: Design documents from `/specs/001-cdn-toggle-and-lucide-icons/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual testing required - no test framework configured in this project

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `pages/`, `components/`, repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install lucide-react dependency in package.json

**Checkpoint**: Dependencies installed - ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No foundational tasks needed - this is a simple frontend enhancement to existing components

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Toggle Between Local and CDN Audio Sources (Priority: P1) 🎯 MVP

**Goal**: Allow users to switch between local media folder and CDN audio sources via a toggle in the Header, with state persistence across sessions and automatic offline handling.

**Independent Test**: Toggle the switch in the header and verify that audio tracks play from the correct source (local vs CDN URL format). Verify toggle state persists after page refresh and browser restart. Verify CDN option is disabled when offline and mode auto-switches to local.

### Implementation for User Story 1

- [X] T002 [US1] Add AudioSourceMode type definition at top of pages/index.tsx
- [X] T003 [US1] Add STORAGE_KEY_AUDIO_SOURCE_MODE constant in pages/index.tsx
- [X] T004 [US1] Add getTrackUrl utility function in pages/index.tsx
- [X] T005 [US1] Add audioSourceMode state to Home component in pages/index.tsx
- [X] T006 [US1] Add useEffect hook to load saved audioSourceMode from localStorage in pages/index.tsx
- [X] T007 [US1] Add handleToggleMode function in pages/index.tsx
- [X] T008 [US1] Update handleToggleMode to save mode to localStorage in pages/index.tsx
- [X] T009 [US1] Update handleToggleMode to reconstruct track URLs based on new mode in pages/index.tsx
- [X] T010 [US1] Add useEffect hook to auto-switch to local mode when offline in pages/index.tsx
- [X] T011 [US1] Add audio source toggle UI in Header section of pages/index.tsx
- [X] T012 [US1] Add disabled state to CDN radio button when offline in pages/index.tsx
- [X] T013 [US1] Add visual feedback (grayed out text) for CDN option when offline in pages/index.tsx
- [X] T014 [US1] Initialize tracks with URLs constructed from saved audioSourceMode on component mount in pages/index.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - toggle works, persists across sessions, and handles offline mode gracefully

---

## Phase 4: User Story 2 - Replace Audio Icons with Lucide React Icons (Priority: P2)

**Goal**: Replace all emoji-based audio icons (▶️, ⏸️, ⏪, ⏩, 📱) with consistent, modern Lucide React icons for improved visual consistency.

**Independent Test**: Visually verify all audio playback controls display Lucide React icons instead of emojis - Play, Pause, Skip Back, Skip Forward buttons and Cached indicator in track list.

### Implementation for User Story 2

- [X] T015 [P] [US2] Import Lucide React icons at top of components/AudioPlayer.tsx
- [X] T016 [US2] Replace Play button emoji with Play icon in control buttons section of components/AudioPlayer.tsx
- [X] T017 [US2] Replace Pause button emoji with Pause icon in control buttons section of components/AudioPlayer.tsx
- [X] T018 [US2] Replace Skip Back 10s button emoji with SkipBack icon in components/AudioPlayer.tsx
- [X] T019 [US2] Replace Skip Forward 10s button emoji with SkipForward icon in components/AudioPlayer.tsx
- [X] T020 [US2] Replace track list play icon with Play icon in components/AudioPlayer.tsx
- [X] T021 [US2] Replace track list pause icon with Pause icon in components/AudioPlayer.tsx
- [X] T022 [US2] Replace cached track indicator emoji (📱) with Download icon in components/AudioPlayer.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - all emoji icons replaced with Lucide React icons

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Manual testing and validation of complete feature

- [X] T023 [P] Run npm run dev to start development server
- [ ] T024 [MANUAL] Verify toggle switches between Local and CDN modes correctly
- [ ] T025 [MANUAL] Verify audio plays from correct source based on toggle position
- [ ] T026 [MANUAL] Verify toggle state persists after page refresh
- [ ] T027 [MANUAL] Verify toggle state persists after browser restart
- [ ] T028 [MANUAL] Go offline (disconnect network or use DevTools) and verify CDN option is disabled
- [ ] T029 [MANUAL] Verify mode auto-switches to Local when going offline if CDN was active
- [ ] T030 [MANUAL] Verify audio plays from local source while offline
- [ ] T031 [MANUAL] Go back online and verify CDN option is re-enabled
- [ ] T032 [MANUAL] Verify previous mode is restored when coming back online
- [ ] T033 [MANUAL] Verify Play icon displays correctly in control buttons
- [ ] T034 [MANUAL] Verify Pause icon displays correctly in control buttons
- [ ] T035 [MANUAL] Verify Skip Back (10s) icon displays correctly
- [ ] T036 [MANUAL] Verify Skip Forward (10s) icon displays correctly
- [ ] T037 [MANUAL] Verify Cached indicator icon displays correctly in track list
- [ ] T038 [MANUAL] Start playing a track in Local mode and switch to CDN mode while playing
- [ ] T039 [MANUAL] Verify track continues playing seamlessly when switching sources

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A - no foundational tasks needed
- **User Stories (Phase 3+)**: All can proceed in parallel or sequentially after Setup
  - User Story 1 (P1) can start immediately after Setup
  - User Story 2 (P2) can start after Setup or after User Story 1
  - Stories are independent and can be worked on in parallel
- **Polish (Phase 5)**: Depends on both User Story 1 and User Story 2 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Setup - No dependencies on other stories (independent file)

### Within Each User Story

- **User Story 1**: Tasks T002-T014 should be completed sequentially as they build on each other in pages/index.tsx
- **User Story 2**: Task T015 (imports) must be first, then T016-T022 can proceed in parallel (different icon replacements in same file)

### Parallel Opportunities

- **User Story 1**: No parallel opportunities within the story (all tasks in same file, build sequentially)
- **User Story 2**: Tasks T016-T022 can run in parallel after T015 is complete (different icon replacements in same file)
- **Phase 5 (Polish)**: Tasks T023-T039 can run in parallel (different manual testing scenarios)

---

## Parallel Example: User Story 2

```bash
# First, complete the import task:
Task: "Import Lucide React icons at top of components/AudioPlayer.tsx"

# Then launch all icon replacement tasks together:
Task: "Replace Play button emoji with Play icon in control buttons section of components/AudioPlayer.tsx"
Task: "Replace Pause button emoji with Pause icon in control buttons section of components/AudioPlayer.tsx"
Task: "Replace Skip Back 10s button emoji with SkipBack icon in components/AudioPlayer.tsx"
Task: "Replace Skip Forward 10s button emoji with SkipForward icon in components/AudioPlayer.tsx"
Task: "Replace track list play icon with Play icon in components/AudioPlayer.tsx"
Task: "Replace track list pause icon with Pause icon in components/AudioPlayer.tsx"
Task: "Replace cached track indicator emoji (📱) with Download icon in components/AudioPlayer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 3: User Story 1 (T002-T014)
3. **STOP and VALIDATE**: Test User Story 1 independently using T023-T032 (toggle and offline tests only)
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup (T001) → Foundation ready
2. Add User Story 1 (T002-T014) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T015-T022) → Test independently → Deploy/Demo
4. Run full polish checklist (T023-T039) → Final deployment
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (T001) together
2. Once Setup is done:
   - Developer A: User Story 1 (T002-T014) - Toggle implementation
   - Developer B: User Story 2 (T015-T022) - Icon replacement (can start in parallel)
3. Both developers work independently (different files)
4. After both stories complete, team does manual testing together (T023-T039)

---

## Notes

- [P] tasks = different files, no dependencies (or different sections of same file that don't conflict)
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing is required - no automated test framework in this project
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 1 and User Story 2 are independent - can be developed in parallel by different developers
- Avoid: vague tasks, file conflicts, cross-story dependencies that break independence
