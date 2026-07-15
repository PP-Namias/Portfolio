---
title: 'Building Student Attendance Management System from Scratch'
slug: 'building-student-attendance-management-system-from-scratch'
excerpt: 'Building a full-featured attendance tracking system with barcode scanning, mobile app, and admin dashboard using C# and PostgreSQL.'
featured: false
publishedAt: '2025-09-10T14:00:00Z'
published: true
author: 'PP Namias'
tags: [ csharp, postgresql, desktop, attendance, barcode, project ]
readTime: '6 min read'
---

[youtube:zWqLW4S-Y-A "Project Demo — Student Attendance Management System"]

Every school has the same problem: manual attendance tracking. Paper sheets get lost, Excel files become messy, and teachers spend more time on admin work than actual teaching.

I built the **Student Attendance Management System** to solve that. It's a barcode-based attendance tracking system with a desktop application for admins and a mobile app for teachers to scan barcodes on the go.

## The Problem

At the University of Caloocan City, attendance was tracked the old-fashioned way — calling names, passing around sheets, and manually entering data into spreadsheets. It was:
- **Time-consuming** — 15+ minutes per class just for attendance
- **Error-prone** — manual entry meant typos, missed names, and lost records
- **Hard to analyze** — no easy way to see patterns or generate reports

The goal was simple: build a system where a teacher could mark attendance for an entire class in under 30 seconds.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Desktop App | C# (.NET Framework) |
| Mobile Scanner | C# with camera integration |
| Database | PostgreSQL |
| UI Framework | MaterialDesign UI |
| Architecture | MVVM Pattern |
| Barcode Format | Standard 1D barcodes |

## How It Works

**For teachers:** Open the mobile app, point the camera at a student's barcode ID card, and attendance is logged instantly. No typing, no searching — just scan and go.

**For admins:** The desktop dashboard provides real-time attendance data, reports, and analytics. You can filter by date, class, student, or attendance status.

```csharp
// Core attendance scanning logic
private void OnBarcodeScanned(string studentId)
{
    var attendance = new Attendance
    {
        StudentId = studentId,
        Date = DateTime.Now.Date,
        Time = DateTime.Now.TimeOfDay,
        Status = true // Present
    };

    _attendanceRepository.LogAttendance(attendance);
    UpdateDashboard();
}
```

## Key Features

### Barcode Scanning
Each student gets a unique barcode on their ID card. Teachers scan using any device with a camera. The system works offline and syncs when connectivity is available.

### Admin Dashboard
A comprehensive dashboard showing:
- Attendance statistics and trends
- Real-time monitoring
- Customizable reports
- Absenteeism analysis

### Role-Based Access
- **Teachers:** Mark attendance, view their classes
- **Admins:** Full access — user management, reports, system settings
- **Multi-factor authentication** for security

[youtube:zWqLW4S-Y-A "Full Demo Walkthrough"]

## Database Design

The system uses PostgreSQL with a normalized schema:

```sql
CREATE TABLE Students (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    Course VARCHAR(50),
    Year VARCHAR(10),
    Section VARCHAR(10),
    StudentId TEXT UNIQUE,
    Archived BOOLEAN DEFAULT FALSE
);

CREATE TABLE Attendance (
    Id SERIAL PRIMARY KEY,
    StudentId INTEGER REFERENCES Students(StudentId),
    Status BOOLEAN,
    Date DATE,
    Time TIME,
    Archived BOOLEAN DEFAULT FALSE
);
```

## Challenges I Faced

### Barcode Camera Integration
Getting the camera to scan barcodes reliably was the hardest part. Different lighting conditions, angles, and barcode qualities meant I had to fine-tune the scanning parameters extensively.

**Lesson learned:** Always test with real hardware early. Simulators don't tell you how the camera will behave in a dimly lit classroom.

### Offline-First Design
Schools don't always have reliable internet. I built the mobile app to queue scans locally and sync when connectivity returns. This required careful conflict resolution to avoid duplicate entries.

### MVVM Architecture
This was my first real project using the MVVM pattern. It took a while to wrap my head around data binding and separation of concerns, but once it clicked, the code became much cleaner and more maintainable.

## Results

- **14 GitHub stars** — real engagement from other developers
- **5 forks** — people actually found it useful enough to build on
- **Live demo** deployed on GitHub Pages
- **Barcode-based** — 30-second attendance for a class of 40

## What I Learned

This project taught me more than any course ever could:

1. **Full-stack desktop development** — C#, PostgreSQL, UI design
2. **Camera integration** — working with hardware APIs
3. **Offline architecture** — designing for unreliable networks
4. **MVVM pattern** — clean separation of concerns
5. **User research** — talking to actual teachers about their pain points

## Try It Yourself

The project is open source on GitHub:

- **GitHub:** [Student-Attendance-Management-System](https://github.com/PP-Namias/Student-Attendance-Management-System)
- **Live Demo:** [pp-namias.github.io/Student-Attendance-Management-System](https://pp-namias.github.io/Student-Attendance-Management-System)
- **License:** MIT

---

*This was my first serious project — the one that taught me I could actually build real software. Up next: how I went from desktop apps to full-stack engineering.*
