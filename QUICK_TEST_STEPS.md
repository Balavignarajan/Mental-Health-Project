# Quick Test Steps - Phase 2 Authentication

## ⚡ Quick Test Sequence

### 1. Start Backend Server
```bash
cd E:\Freelance\MentalHealth
npm run dev
# OR double-click start-dev.bat
```
✅ Verify: Server running on `http://localhost:5000`

---

### 2. Open Browser & DevTools
- Open: `http://localhost:5000`
- Press `F12` to open DevTools
- Go to **Network** tab (to see API calls)
- Go to **Application** → **Local Storage** (to check tokens)

---

### 3. Test Signup
1. Navigate to: `http://localhost:5000/signup`
2. Fill form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test123@example.com` (use unique email)
   - Password: `password123` (min 6 chars)
3. Click "Continue"
4. ✅ Check Network tab: Should see `POST /api/auth/signup` with status 201
5. ✅ Should redirect to `/otp` page

---

### 4. Test Email Verification
**Option A: If email service configured**
- Check email inbox for verification link
- Click the link

**Option B: If email service NOT configured**
- Check backend console/logs for verification URL
- Copy the URL and open in browser
- Format: `http://localhost:5000/verify-email?email=test123@example.com&token=<long-token>`

✅ Should automatically verify and redirect to `/login`

---

### 5. Test Login
1. Navigate to: `http://localhost:5000/login`
2. Enter email: `test123@example.com`
3. Click "Continue"
4. Enter password: `password123`
5. Click "Login"
6. ✅ Check Network tab: Should see `POST /api/auth/login` with status 200
7. ✅ Check Local Storage: Should see `accessToken` and `refreshToken`
8. ✅ Should redirect to `/user-home`

---

### 6. Verify Token Usage
1. After login, check Network tab
2. Make any API call (navigate to another page)
3. ✅ Check request headers: Should see `Authorization: Bearer <token>`

---

## ✅ Success Indicators

- [ ] Signup API call succeeds
- [ ] Email verification works (or shows appropriate handling)
- [ ] Login API call succeeds
- [ ] Tokens stored in localStorage
- [ ] Redirects to user-home after login
- [ ] Authorization header included in API calls
- [ ] No console errors

---

## ❌ Common Issues

| Issue | Solution |
|-------|----------|
| Network Error | Backend not running - start server |
| 500 Error | MongoDB not connected - check `.env` |
| Email not received | Check backend logs for verification URL |
| CORS Error | Check `CORS_ORIGIN` in `.env` |
| Invalid credentials | Email not verified - complete verification first |

---

## 📝 Full Testing Guide

For detailed test cases and troubleshooting, see: `PHASE2_TESTING_GUIDE.md`

