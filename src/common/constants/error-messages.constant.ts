export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
  UNAUTHORIZED: 'Bạn chưa đăng nhập',
  FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này',
  TOKEN_EXPIRED: 'Token đã hết hạn, vui lòng đăng nhập lại',

  // User
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_ALREADY_EXISTS: 'Email đã được sử dụng',
  USER_INACTIVE: 'Tài khoản đã bị vô hiệu hóa',

  // Organization
  ORGANIZATION_NOT_FOUND: 'Không tìm thấy tổ chức',
  ORGANIZATION_CODE_EXISTS: 'Mã tổ chức đã tồn tại',

  // Attendance
  ALREADY_CHECKED_IN: 'Bạn đã check-in hôm nay rồi',
  NOT_CHECKED_IN: 'Bạn chưa check-in hôm nay',
  ALREADY_CHECKED_OUT: 'Bạn đã check-out hôm nay rồi',

  // General
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  INTERNAL_SERVER_ERROR: 'Đã xảy ra lỗi hệ thống',
} as const;
