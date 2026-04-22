export class ApiResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }

  static success<T>(data: T, message = 'Thành công'): ApiResponseDto<T> {
    return new ApiResponseDto({
      statusCode: 200,
      message,
      data,
    });
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Thành công',
  ): ApiResponseDto<T[]> {
    return new ApiResponseDto({
      statusCode: 200,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }
}
