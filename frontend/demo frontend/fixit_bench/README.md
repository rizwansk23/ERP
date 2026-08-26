# Fixit Bench — Flutter ERP

Desktop-first Flutter implementation of the service-desk ERP, following the
project structure you shared and matching the HTML reference's look
(paper/ink/accent palette, Space Grotesk display font, Inter body font,
IBM Plex Mono for numbers).

## Getting started

1. Install Flutter (stable channel) if you haven't already.
2. From this folder:
   ```
   flutter pub get
   flutter run -d windows   # or macos / linux / chrome
   ```
3. Log in from the split Admin / Staff tabs (any non-empty ID + password
   works in this mock build). Use the **PREVIEW: STAFF/ADMIN APP** switch
   in the sidebar to flip roles without signing out.

## What's implemented

- **core/** — colors, fonts (Google Fonts: Space Grotesk / Inter / IBM
  Plex Mono), mock seed data, currency/date formatters, a CSV export
  stub, and `AppState` (a `ChangeNotifier` standing in for the
  `models/`, `utils/`, and future API layer).
- **models/** — `CustomerModel`, `PaymentModel`, `WorkItemModel`,
  `StaffModel`.
- **widgets/** — toast notifications, sidebar nav, primary/outline/ghost
  buttons, text/select/mini/search inputs, filter chips, status
  badges (red/amber/green).
- **screens/auth/** — split login screen, and a lock overlay you can
  trigger from the top-bar lock icon.
- **screens/shared/** — Customer Intake, Payment Dashboard, Works
  Dashboard — visible to both Admin and Staff (Payments' status
  editing and filter chips are Admin-only, matching the reference).
- **screens/admin/** — Dashboard (KPIs + FY/range chips + bar chart),
  Staff Management (credential generator), Form Management (service
  price list), Activity Log (auto-populated from actions taken
  elsewhere in the app), Profile (business info, backup export,
  app-lock password).

## Wiring up a real backend

Right now everything lives in memory inside `AppState` and resets on
restart. To connect a real API/database:

- Replace the in-memory lists in `AppState` with calls into a
  repository/service layer (e.g. `http`/`dio` + your backend).
- Keep the model classes as-is, or generate them from your API schema.
- `core/utils/export_helper.dart` has a working CSV export and a
  stubbed PDF export — add the `pdf` + `printing` packages when you're
  ready for real PDF receipts/reports.

## Notes / next steps

- Fonts are pulled via `google_fonts` at runtime; for a fully offline
  build, bundle the three font families locally and switch
  `app_fonts.dart` to `TextStyle(fontFamily: ...)`.
- The bar chart on the dashboard is a simple hand-rolled bar view
  (no charting package) — swap in `fl_chart` if you want axes/tooltips.
- Table rows use fixed flex ratios; for very small windows, wrap wide
  tables in horizontal scroll (already done) or move to a card layout.
