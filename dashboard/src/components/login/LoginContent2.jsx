const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.phone_number, // ✅ FIX
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Cookies.set('access_token', data.access_token, { expires: 1 });
      Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
      Cookies.set('user_role', data.role.toUpperCase(), { expires: 1 });
      Cookies.set('user_id', data.user_id, { expires: 1 });

      window.dispatchEvent(new Event('auth-change'));

      let redirectPath = '/dashboard';

      if (data.role.toUpperCase() === 'ADMIN' || data.role.toUpperCase() === 'SUPER_ADMIN') {
        redirectPath = '/dash';
      } else if (data.role.toUpperCase() === 'STAFF') {
        redirectPath = '/hrmDashboard';
      } else if (data.role.toUpperCase() === 'CUSTOMER') {
        redirectPath = '/customerDashboard';
      }

      setTimeout(() => navigate(redirectPath), 100);
    } else {
      setError(data.detail || 'Invalid login credentials');
    }
  } catch (err) {
    console.error("Login error:", err);
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
