# Feature Specification: CDN Toggle and Lucide Icons

**Feature Branch**: `001-cdn-toggle-and-lucide-icons`
**Created**: 2026-01-30
**Status**: Draft
**Input**: User description: "Add a toggle somewhere in the Header, so users can select whether audio files are served from the project's `media` folder (once deployed), or from a CDN. To get the CDN song URL, use the following function: (fileName) => `cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/${fileName}.mp3`; Replace the audio icons with those from `lucide-react`, which are more visually appealing."

## User Scenarios & Testing

### User Story 1 - Toggle Between Local and CDN Audio Sources (Priority: P1)

User wants to switch between playing audio files from the local media folder and from a CDN source. The toggle should be prominently displayed in the Header section and allow instant switching without page reload.

**Why this priority**: This is the primary feature requested and provides flexibility for users to choose between faster local playback (when available) and CDN streaming when local files are not accessible.

**Independent Test**: Can be fully tested by toggling the switch in the header and verifying that audio tracks play from the correct source (local vs CDN URL format).

**Acceptance Scenarios**:

1. **Given** the app is loaded with the toggle in "Local" position, **When** the user selects a track, **Then** the audio plays from the local media folder URL (`./media/{filename}.mp3`)
2. **Given** the app is loaded with the toggle in "CDN" position, **When** the user selects a track, **Then** the audio plays from the CDN URL (`https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`)
3. **Given** the toggle is in "Local" position, **When** the user toggles it to "CDN", **Then** the currently playing track should continue playing from the new source and future tracks will use CDN URLs
4. **Given** the toggle state is set, **When** the page is refreshed, **Then** the toggle state should persist (user's preference should be saved)

---

### User Story 2 - Replace Audio Icons with Lucide React Icons (Priority: P2)

User wants more visually appealing audio icons for the playback controls. All emoji-based icons (⏪, ▶️, ⏸️, ⏩, 📱) should be replaced with consistent, modern Lucide React icons.

**Why this priority**: Improves visual consistency and user experience, making the app look more professional. Lower priority than the CDN toggle but still important for UI polish.

**Independent Test**: Can be visually verified by checking all audio playback controls and ensuring they display Lucide React icons instead of emojis.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** viewing the audio player controls, **Then** all playback buttons (Play, Pause, Previous 10s, Next 10s) should display Lucide React icons
2. **Given** a track is currently playing, **When** viewing the track list, **Then** the play/pause icon in the track item should be a Lucide React icon
3. **Given** the app is loaded, **When** viewing cached tracks in the track list, **Then** the "Cached" indicator should use a Lucide React icon instead of 📱 emoji

---

### Edge Cases

- What happens when CDN URL fails to load (network error, 404)? Should the app automatically fall back to local source?
- How does the toggle interact with offline mode? Should CDN option be disabled when offline?
- What happens if local media files are not yet available (e.g., before deployment)?
- How should the toggle persist across browser sessions (localStorage, cookies, etc.)?

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a toggle switch in the Header section to allow users to select between local and CDN audio sources
- **FR-002**: When toggle is set to "Local", system MUST use local media folder URLs (`./media/{filename}.mp3`) for all audio tracks
- **FR-003**: When toggle is set to "CDN", system MUST use CDN URLs following the pattern: `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`
- **FR-004**: Toggle state MUST persist across page refreshes using browser storage (localStorage recommended)
- **FR-005**: System MUST update all currently playing and future track URLs when toggle state changes
- **FR-006**: All audio playback control icons (Play, Pause, Skip Forward, Skip Backward) MUST use Lucide React icons
- **FR-007**: Track list play/pause indicators MUST use Lucide React icons
- **FR-008**: Cached track indicators MUST use Lucide React icons
- **FR-009**: Install App button icon (📱) MUST be replaced with a Lucide React icon if applicable
- **FR-010**: System MUST handle toggle state changes gracefully without page reload or audio interruption

### Key Entities

- **AudioSourceMode**: Enum representing the two audio source modes ('local' | 'cdn')
- **Track**: Represents an audio track with properties (id, name, url, cached) where url dynamically changes based on AudioSourceMode

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can switch between local and CDN audio sources with a single click in the Header
- **SC-002**: Toggle state persists across browser sessions (survives page refresh and browser restart)
- **SC-003**: All audio playback icons are consistent and use Lucide React icons (no emoji icons remaining)
- **SC-004**: When toggling between sources, audio playback continues seamlessly without interruption (if same track is playing)
- **SC-005**: CDN URLs are correctly formatted following the specified pattern for all tracks
