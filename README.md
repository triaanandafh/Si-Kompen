# Si-Kompen

**Sistem Informasi Kompensasi Presensi Mahasiswa** — a web app for managing student attendance compensation ("kompen") at the Information Technology Department, Politeknik Negeri Malang.

Students submit compensation requests for a course, and admins review them and move them through the approval flow. Before this app, the process was handled manually on paper.

<!-- Add 2-3 screenshots here, for example:
![Student dashboard](docs/screenshots/dashboard.png)
![Admin submissions](docs/screenshots/admin-pengajuan.png)
-->

---

## ✨ Features

### 👨‍🎓 Student (Mahasiswa)
* Log in with NIM or email
* Submit a compensation request (course, lecturer, semester, class, task, hours)
* View request history and current status
* Print the request document
* View own profile

### 👨‍💼 Admin
* Dashboard with request counts by status and the latest submissions
* Manage lecturers (Dosen)
* Manage courses (Matkul), each linked to a lecturer
* Review incoming requests and update their status

### 🔄 Approval Flow
```text
MENUNGGU_TTD_DOSEN  →  VERIFIKASI_KPS  →  DISETUJUI
                                        ↘  DITOLAK


🛠 Tech Stack
Layer | Tools
Framework: Next.js 16 (App Router), React 19
Language: TypeScript
Styling: Tailwind CSS 4
Database: PostgreSQL
ORM: Prisma 7 with the @prisma/adapter-pg driver adapter
Auth (current): bcryptjs password hashing, server actions
Tooling: ESLint, tsx

👤 Author
Tria Ananda Fadillah — D-IV Sistem Informasi Bisnis, Politeknik Negeri Malang.

GitHub: @triaanandafh