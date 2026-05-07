# CVHT Backend — Node.js + Express + MongoDB + TypeScript

## Cài đặt và chạy

### 1. Cài dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
```bash
cp .env.example .env
# Chỉnh MONGODB_URI và JWT_SECRET trong .env
```

### 3. Seed dữ liệu mẫu
```bash
npm run seed
```

### 4. Chạy development
```bash
npm run dev
# Server chạy tại http://localhost:5000
```

### 5. Build production
```bash
npm run build
npm start
```

## Tài khoản mẫu (sau khi seed)
| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| CVHT  | cvht001@ut.edu.vn       | cvht123456 |
| Admin | admin@ut.edu.vn         | admin123456|
| SV    | 22020001@ut.edu.vn      | 22020001   |

## API Endpoints
| Method | Endpoint                          | Mô tả                    |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/login                   | Đăng nhập                |
| GET    | /api/auth/me                      | Thông tin user hiện tại  |
| GET    | /api/students?classId=&status=    | Danh sách sinh viên      |
| POST   | /api/students                     | Thêm sinh viên           |
| GET    | /api/students/:id/grades          | Điểm của 1 sinh viên     |
| GET    | /api/grades?classId=&semesterId=  | Bảng điểm lớp            |
| POST   | /api/grades/bulk                  | Import điểm hàng loạt    |
| GET    | /api/forum/:classId               | Bài viết diễn đàn        |
| POST   | /api/forum                        | Đăng bài                 |
| GET    | /api/messages/conversations       | Danh sách hội thoại      |
| POST   | /api/messages                     | Gửi tin nhắn             |
| GET    | /api/notifications                | Thông báo                |
| GET    | /api/classes                      | Danh sách lớp            |
| GET    | /api/health                       | Kiểm tra server          |
