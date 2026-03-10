# VocabBuilder

## Project Description

VocabBuilder is a web application designed to help users learn new words through a personal dictionary, recommendations, and interactive training.

The application allows users to register, manage their own vocabulary, discover new words, and practice them using a training system.

---

## Live Demo

[Live Pages].(https://vocab-builder-delta.vercel.app/)

---

## Design & API

[Design]. (https://www.figma.com/file/XRhVBdCX1wPyzCRA567kud/VocabBuilder)

[Backend API].( https://vocab-builder-backend.p.goit.global/api-docs/)

---

## Features

### Authentication

- User registration and login
- Form validation using `react-hook-form` + `yup`
- Password visibility toggle
- Error handling with notifications
- Auto-login after successful registration

---

### Dictionary

- Add, edit, delete words
- Words table with progress tracking
- Search with debounce
- Filtering by category
- Server-side pagination
- Statistics dashboard

---

### Recommendations

- Browse words added by other users
- Add words to personal dictionary
- Shared table component

---

### Training

- Interactive word training system
- Progress tracking
- Save training results
- Result modal after completion

---

### UI/UX

- Responsive design (mobile, tablet, desktop)
- Semantic HTML5
- Optimized images and retina support
- Icons via sprite
- Modal windows (ESC, backdrop, close button)

---

## Technologies

- **React / Next.js**
- **TypeScript**
- **Redux / Zustand** (state management)
- **React Query (TanStack Query)**
- **Axios**
- **React Hook Form + Yup**
- **CSS / Modules**
- **MUI (optional components)**

---

## Project Structure

```
app/
│ ├─ (auth routes)/
│ │ ├─ Login/
│ │ ├─ Register/
│ │ ├─ styles/
│ │ └─ layout.tsx
│ └─ (private routes)/
│ ├─ dictionary/
│ ├─ recommend/
│ ├─ training/
│ └─layout.tsx
├─ components/
│ ├─ AuthNavigation/
│ ├─ Dashboard/
│ │ ├─ Filters
│ │ │ └─ SortDropdown/
│ │ └─ Statistics
│ ├─ Header/
│ │ ├─ Header
│ │ ├─ LogoutButton/
│ │ └─ UserMenu
│ ├─ modals/
│ │ ├─AddWordModal/
│ │ ├─EditWordModal/
│ │ ├─MobileMenu/
│ │ ├─WordActionsMenu/
│ │ ├─WordFormFields/
│ │ └─WellDoneModal
│ ├─ ProgressBar/
│ ├─ EmptyState/
│ ├─ words/
│ │ ├─ WordsClient/
│ │ ├─ WordsPagination
│ │ └─ WordsTable
├─ lib/
│ ├─ api/
│ ├─ auth/
│ └─ validation/
├─ public/
├─ services/
├─ types/
└─ middleware.ts
```
