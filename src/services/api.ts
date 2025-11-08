const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
    pagination?: {
        current: number;
        pages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

class ApiService {
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        this.baseUrl = API_BASE_URL;
        // Initialize token from localStorage if available
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('ethiobus_token');
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                success: false,
                message: 'Network error occurred'
            }));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string, role: 'admin' | 'driver'): Promise<ApiResponse<{ token: string; user: any }>> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password, role }),
        });

        const result = await this.handleResponse<{ token: string; user: any }>(response);

        if (result.success && result.data?.token) {
            this.token = result.data.token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('ethiobus_token', result.data.token);
                localStorage.setItem('ethiobus_user', JSON.stringify(result.data.user));
            }
        }

        return result;
    }

    async logout(): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/auth/logout`, {
                method: 'POST',
                headers: this.getHeaders(),
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ethiobus_token');
                localStorage.removeItem('ethiobus_user');
            }
        }
    }

    async getCurrentUser(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    // Admin endpoints
    async getAdminDashboard(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/admin/dashboard`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async getDrivers(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.search) queryParams.set('search', params.search);
        if (params?.status) queryParams.set('status', params.status);

        const response = await fetch(`${this.baseUrl}/admin/drivers?${queryParams}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async updateDriver(id: string, data: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/admin/drivers/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async getAdminSchedules(params?: { date?: string; status?: string; routeId?: string }): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        if (params?.date) queryParams.set('date', params.date);
        if (params?.status) queryParams.set('status', params.status);
        if (params?.routeId) queryParams.set('routeId', params.routeId);

        const response = await fetch(`${this.baseUrl}/admin/schedules?${queryParams}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async getAdminIncidents(params?: { status?: string; severity?: string; type?: string }): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.set('status', params.status);
        if (params?.severity) queryParams.set('severity', params.severity);
        if (params?.type) queryParams.set('type', params.type);

        const response = await fetch(`${this.baseUrl}/admin/incidents?${queryParams}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    // Driver endpoints
    async getDriverDashboard(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/dashboard`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async getDriverSchedules(params?: { date?: string; status?: string }): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        if (params?.date) queryParams.set('date', params.date);
        if (params?.status) queryParams.set('status', params.status);

        const response = await fetch(`${this.baseUrl}/driver/schedules?${queryParams}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async startSchedule(scheduleId: string): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/schedules/${scheduleId}/start`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async completeSchedule(scheduleId: string, data: { passengerCount?: number; notes?: string }): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/schedules/${scheduleId}/complete`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async updateLocation(scheduleId: string, latitude: number, longitude: number): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/schedules/${scheduleId}/location`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ latitude, longitude }),
        });
        return this.handleResponse(response);
    }

    async reportIncident(data: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/incidents`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async getDriverIncidents(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/driver/incidents`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    // Passenger endpoints (public)
    async getRoutes(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/passenger/routes`);
        return this.handleResponse(response);
    }

    async searchRoutes(from: string, to: string): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams({ from, to });
        const response = await fetch(`${this.baseUrl}/passenger/routes/search?${queryParams}`);
        return this.handleResponse(response);
    }

    async getRoute(id: string): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/passenger/routes/${id}`);
        return this.handleResponse(response);
    }

    async getSchedules(routeId: string, date?: string): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams({ routeId });
        if (date) queryParams.set('date', date);

        const response = await fetch(`${this.baseUrl}/passenger/schedules?${queryParams}`);
        return this.handleResponse(response);
    }

    async getScheduleTracking(scheduleId: string): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/passenger/schedules/${scheduleId}/tracking`);
        return this.handleResponse(response);
    }

    async getAnnouncements(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/passenger/announcements`);
        return this.handleResponse(response);
    }

    // Health check
    async healthCheck(): Promise<ApiResponse<any>> {
        const response = await fetch(`${this.baseUrl}/health`);
        return this.handleResponse(response);
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
export type { ApiResponse };
