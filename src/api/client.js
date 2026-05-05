const API_BASE = "/api";
const TYPE = "rei";

/// Core fetch wrapper — cookie session auth via credentials: 'include'
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...options.headers };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `HTTP ${res.status}`);
  }

  return res.json();
}

/// For mutation endpoints that return {success, error} instead of data
async function mutation(path, options) {
  const result = await request(path, options);
  // ActionVoidResult: {success: true} on success, {success: false, error: string} on failure
  if (result && result.success === false) {
    throw new Error(result.error || "操作失败");
  }
  return result;
}

export const api = {
  // Auth — cookie session
  login(username, password) {
    return request("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  logout() {
    return request("/logout", { method: "POST" });
  },
  checkAuth() {
    return request("/auth/me");
  },

  // Posts — read (no auth required)
  async getPosts() {
    const res = await request(`/posts?type=${TYPE}`);
    return res.data; // unwrap {data: [...]} envelope
  },
  async getPost(id) {
    const res = await request(`/posts/${id}?type=${TYPE}`);
    return res.data; // unwrap {data: {...}} envelope
  },

  // Posts — write (admin session required)
  async createPost({ title, content }) {
    const res = await mutation("/posts", {
      method: "POST",
      body: JSON.stringify({ title, content, type: "rei" }),
    });
    return res.data; // unwrap {data: {id, title, ...}} envelope
  },
  updatePost(id, { title, content }) {
    return mutation(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content, type: "rei" }),
    });
  },
  deletePost(id) {
    return mutation(`/posts/${id}`, {
      method: "DELETE",
    });
  },

  // Photos — album (public read, admin write)
  /**
   * 获取相册列表
   * @param {{ includeHidden?: boolean }} [options]
   * @returns {Promise<Array>}
   */
  async getPhotos(options = {}) {
    const { includeHidden = false } = options;
    const query = includeHidden ? "?includeHidden=true" : "";
    const res = await request(`/photos${query}?type=${TYPE}`);
    return res.data;
  },

  /**
   * 获取单个 photo 详情
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getPhoto(id) {
    const res = await request(`/photos/${id}`);
    return res.data;
  },

  /**
   * 创建 photo（JSON 方式）
   * @param {{ title?: string; description?: string; coverUrl?: string; type?: string; isHidden?: boolean }} payload
   * @returns {Promise<Object>}
   */
  async createPhotoJson(payload) {
    const res = await mutation("/photos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  /**
   * 创建 photo（FormData：拖拽上传）
   * @param {FormData} formData
   * @returns {Promise<Object>}
   */
  async createPhotoForm(formData) {
    const res = await mutation("/photos", {
      method: "POST",
      body: formData,
    });
    return res.data;
  },

  /**
   * 更新 photo（至少一个字段）
   * @param {number|string} id
   * @param {{ title?: string; description?: string; coverUrl?: string; type?: string; isHidden?: boolean }} payload
   * @returns {Promise<Object>}
   */
  async updatePhoto(id, payload) {
    const res = await mutation(`/photos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  /**
   * 删除 photo
   * @param {number|string} id
   * @returns {Promise<{success: boolean}>}
   */
  deletePhoto(id) {
    return mutation(`/photos/${id}`, {
      method: "DELETE",
    });
  },
};
