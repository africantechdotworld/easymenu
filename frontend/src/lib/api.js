const BASE_URL = 'http://localhost:5000/api';

export const getRestaurantProfile = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/restaurants/${id}`);
        if (!res.ok) throw new Error('Failed to fetch restaurant');
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const getMenuCategories = async (restaurantId) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/${restaurantId}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const getMenuItemsByCategory = async (categoryId) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/categories/${categoryId}/items`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const signupBusiness = async (signupData) => {
    try {
        const payload = {
            name: signupData.businessName || signupData.name,
            email: signupData.email,
            password: signupData.password
        };

        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        if (data.token) localStorage.setItem('biz-token', data.token);
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const loginBusiness = async (email, password) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        if (data.token) localStorage.setItem('biz-token', data.token);
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const getRestaurantRatings = async (restaurantId) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews/restaurant/${restaurantId}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const reviews = await res.json();

        // Calculate rating averages and distribution
        const totalReviews = reviews.length;
        let averageRating = 0;
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        if (totalReviews > 0) {
            const sum = reviews.reduce((acc, curr) => {
                const r = Math.round(curr.rating);
                if (ratingDistribution[r] !== undefined) ratingDistribution[r]++;
                return acc + curr.rating;
            }, 0);
            averageRating = sum / totalReviews;
        }

        return { success: true, data: { averageRating, totalReviews, reviews, ratingDistribution } };
    } catch (error) {
        console.error(error);
        return { success: true, data: { averageRating: 0, totalReviews: 0, reviews: [], ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } };
    }
};

export const getMenuItemReviews = async (menuItemId) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews/item/${menuItemId}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const getMenuItemRatingStats = async (menuItemId) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews/item/${menuItemId}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const reviews = await res.json();

        // Calculate rating averages and distribution
        const totalReviews = reviews.length;
        let averageRating = 0;
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        if (totalReviews > 0) {
            const sum = reviews.reduce((acc, curr) => {
                const r = Math.round(curr.rating);
                if (ratingDistribution[r] !== undefined) ratingDistribution[r]++;
                return acc + curr.rating;
            }, 0);
            averageRating = sum / totalReviews;
        }

        return { success: true, data: { averageRating, totalReviews, ratingDistribution } };
    } catch (error) {
        console.error(error);
        return { success: true, data: { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } };
    }
};

export const submitReview = async (reviewData) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit review');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const getRestaurantSpecials = async (restaurantId) => {
    try {
        // For now we mock the specials or hit an endpoint. We didn't create a specials model, 
        // so we will return mock data to prevent errors.
        return { success: true, data: [] };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getAuthProfile = async () => {
    try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const updateAuthProfile = async (updateData) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update profile');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

// Menu Category Management
export const createCategory = async (categoryData) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/categories`, {
            method: 'POST',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create category');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update category');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/categories/${categoryId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete category');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

// Menu Item Management
export const createMenuItem = async (itemData) => {
    try {
        const formData = new FormData();
        for (const key in itemData) {
            if (key === 'image' && itemData[key] instanceof File) {
                formData.append('image', itemData[key]);
            } else {
                formData.append(key, typeof itemData[key] === 'object' ? JSON.stringify(itemData[key]) : itemData[key]);
            }
        }

        const res = await fetch(`${BASE_URL}/menu/items`, {
            method: 'POST',
            headers: authHeaders(), // FormData sets boundary automatically, don't set Content-Type
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create menu item');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const updateMenuItem = async (itemId, itemData) => {
    try {
        const formData = new FormData();
        for (const key in itemData) {
            if (key === 'image' && itemData[key] instanceof File) {
                formData.append('image', itemData[key]);
            } else if (itemData[key] !== undefined) {
                formData.append(key, typeof itemData[key] === 'object' ? JSON.stringify(itemData[key]) : itemData[key]);
            }
        }

        const res = await fetch(`${BASE_URL}/menu/items/${itemId}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update menu item');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const deleteMenuItem = async (itemId) => {
    try {
        const res = await fetch(`${BASE_URL}/menu/items/${itemId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete menu item');
        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const authHeaders = () => {
    const token = localStorage.getItem('biz-token');
    return {
        'Authorization': `Bearer ${token}`
    };
};
