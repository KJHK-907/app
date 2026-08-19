# DJ schedule API setup

The app reads a public, read-only JSON endpoint. Staff continue editing the
underlying Google Sheet; no Google credentials are bundled in the app.

## Sheet

Create a worksheet named `Schedule` with these exact headers:

| Header           | Required | Format                                |
| ---------------- | -------- | ------------------------------------- |
| `id`             | yes      | stable unique text                    |
| `day`            | yes      | Monday–Sunday                         |
| `startTime`      | yes      | `HH:mm` or a Google Sheets time value |
| `endTime`        | yes      | `HH:mm` or a Google Sheets time value |
| `showName`       | yes      | text                                  |
| `djName`         | no       | text                                  |
| `description`    | no       | text                                  |
| `genre`          | no       | text                                  |
| `linkUrl`        | no       | public HTTPS URL                      |
| `active`         | no       | TRUE/FALSE; blank means active        |
| `effectiveStart` | no       | `YYYY-MM-DD`                          |
| `effectiveEnd`   | no       | `YYYY-MM-DD`                          |

Shows must last at least one hour and use whole-hour durations. If staff enter
the same show in consecutive hourly rows, the app combines those rows into one
continuous block. Keep the show name, DJ, description, and genre identical on
those rows so they can be combined.

## Apps Script

1. Create a standalone Apps Script project and paste in
   `google-apps-script/ScheduleApi.gs`.
2. In **Project Settings → Script properties**, add `SPREADSHEET_ID` using the
   ID from the Sheet URL.
3. Deploy as a **Web app**, executing as the owner and allowing access to
   **Anyone**. The schedule is public, but the Sheet itself does not need to be.
4. Copy the deployment URL ending in `/exec`.

## App

Copy `.env.example` to `.env` and set:

```text
EXPO_PUBLIC_SCHEDULE_API_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Restart Expo after changing the value. The URL is public and is compiled into
the mobile app; it must not contain credentials or secret tokens.
