# Fixit Bench — Flutter Frontend Folder Structure

```text
lib/
├── core/                          # App-wide configurations and utilities
│   ├── constants/
│   │   ├── app_colors.dart        # --paper, --surface, --accent, etc.
│   │   ├── app_fonts.dart         # Space Grotesk, Inter, IBM Plex Mono
│   │   └── mock_data.dart         # Temp arrays (services, works, payments)
│   └── utils/
│       ├── formatters.dart        # Helper for date/time and currency formatting
│       └── export_helper.dart     # PDF and Excel export logic
│
├── models/                        # Data representations
│   ├── customer_model.dart
│   ├── payment_model.dart
│   ├── work_item_model.dart
│   └── staff_model.dart
│
├── widgets/                       # Reusable UI components across the app
│   ├── app_toast.dart             # Custom toast notification logic
│   ├── app_sidebar.dart           # Sidebar navigation component
│   ├── custom_button.dart         # Primary and ghost buttons
│   ├── custom_input.dart          # Text fields, selects, and mini-inputs
│   └── status_badge.dart          # Red, amber, green dots/badges
│
├── screens/                       # Main views organized by access role
│   │
│   ├── auth/                      # Unauthenticated views
│   │   ├── login_screen.dart      # Handles both Admin and Staff tabs
│   │   └── lock_overlay.dart      # Application lock pin/password screen
│   │
│   ├── shared/                    # Modules accessible by BOTH Admin and Staff
│   │   ├── intake_screen.dart     # Customer Intake module
│   │   ├── payments_screen.dart   # Logic handles full list (Admin) vs search (Staff)
│   │   └── works_screen.dart      # Job tracking and status updates
│   │
│   └── admin/                     # Modules strictly for the Admin role
│       ├── dashboard_screen.dart  # KPIs, FY filtering, and charts
│       ├── staff_mgmt_screen.dart # View staff and generate credentials
│       ├── form_mgmt_screen.dart  # Service pricing and custom fields
│       ├── activity_log_screen.dart # Audit trail for staff actions
│       └── profile_screen.dart    # Business info, backups, and app lock settings
│
└── main.dart                      # App entry point, theme setup, and routing shell
```
