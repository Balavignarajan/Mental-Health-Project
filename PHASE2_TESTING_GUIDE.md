# Phase 2 Testing Guide - Authentication APIs

This guide provides step-by-step testing instructions to verify that Phase 2 (Authentication APIs) is working correctly.

## Prerequisites

Before testing, ensure:
1. ✅ Backend server is running on `http://localhost:5000`
2. ✅ MongoDB is connected (backend should show "✅ MongoDB connected")
3. ✅ Frontend dev server is running (via backend or separately)
4. ✅ Environment variables are configured (`.env` file exists in root)

## Test Setup

### 1. Open Browser DevTools
- Press `F12` or `Right-click → Inspect`
- Go to **Console** tab (for error messages)
- Go to **Network** tab (to see API calls)
- Go to **Application** tab → **Local Storage** (to check token storage)

---

## Test Case 1: User Signup Flow

### Steps:
1. **Navigate to Signup Page**
   - Go to: `http://localhost:5000/signup` or click "Sign Up" link
   - ✅ Should see the signup form

2. **Fill Signup Form**
   - Enter First Name: `John`
   - Enter Last Name: `Doe`
   - Enter Mobile: `1234567890` (optional, not validated)
   - Enter Email: `testuser@example.com` (use a unique email each time)
   - Enter Password: `password123` (must be at least 6 characters)
   - ✅ All fields should accept input

3. **Submit Signup**
   - Click "Continue" button
   - ✅ Button should show "Creating account..." (loading state)
   - ✅ Network tab should show POST request to `/api/auth/signup`
   - ✅ On success: Should navigate to `/otp` page
   - ✅ Should see email address displayed on OTP page

### Expected Results:
- ✅ Signup API call succeeds (status 201)
- ✅ Response: `{ success: true, message: "Signup successful. Verify email.", data: { userId: "..." } }`
- ✅ Navigates to OTP page with email in state
- ❌ If email already exists: Error message "Email already registered"

### Common Issues:
- **Error: Network Error**: Backend not running
- **Error: 500 Internal Server Error**: Check MongoDB connection
- **Error: Email already registered**: Use a different email address

---

## Test Case 2: Email Verification Flow

**Note**: Email verification requires backend email service configured. If email service is not configured:
- Check backend console/logs for the verification URL
- The verification link format is: `http://localhost:5000/verify-email?email=testuser@example.com&token=<long-hex-string>`

### Option A: Using Email Link (Recommended)
1. **Check Email**
   - Check your email inbox for verification email
   - If email service is not configured, check backend console/logs
   - ✅ Email should contain a verification link

2. **Click Verification Link**
   - Click the link in the email (or copy from backend logs)
   - Link format: `http://localhost:5000/verify-email?email=testuser@example.com&token=<token>`
   - ✅ Should redirect to `/otp` page with token in URL
   - ✅ Should automatically verify email (check Network tab for POST to `/api/auth/verify-email`)
   - ✅ On success: Should redirect to `/login` page

### Option B: Manual Testing (If no email service)
1. **Navigate to OTP Page with Token**
   - Go to: `http://localhost:5000/otp?email=testuser@example.com&token=<token-from-backend-logs>`
   - ✅ Should automatically verify and redirect to login

### Expected Results:
- ✅ Verification API call succeeds (status 200)
- ✅ Response: `{ success: true, message: "Email verified", data: null }`
- ✅ Redirects to `/login` page
- ✅ User account is now verified

### Common Issues:
- **Error: Invalid verify token**: Token expired or already used
- **Error: User not found**: Email doesn't match
- **Token not in URL**: Check email link format

---

## Test Case 3: User Login Flow

### Steps:
1. **Navigate to Login Page**
   - Go to: `http://localhost:5000/login`
   - ✅ Should see login form

2. **Enter Email**
   - Enter the email you used for signup: `testuser@example.com`
   - Click "Continue"
   - ✅ Should navigate to `/password` page
   - ✅ Email should be displayed on password page

3. **Enter Password**
   - Enter the password you used: `password123`
   - Click "Login" button
   - ✅ Button should show "Logging in..." (loading state)
   - ✅ Network tab should show POST request to `/api/auth/login`

4. **Check Token Storage**
   - Go to DevTools → Application → Local Storage
   - ✅ Should see `accessToken` stored
   - ✅ Should see `refreshToken` stored

5. **Check Navigation**
   - ✅ Should redirect to `/user-home` page
   - ✅ Should see user header (not visitor header)

### Expected Results:
- ✅ Login API call succeeds (status 200)
- ✅ Response: `{ success: true, message: "Login success", data: { accessToken: "...", refreshToken: "..." } }`
- ✅ Tokens stored in localStorage
- ✅ Navigates to `/user-home`
- ✅ Request headers should include `Authorization: Bearer <token>` in subsequent API calls

### Error Scenarios:
- **Invalid credentials**: Error message "Invalid credentials"
- **Email not verified**: Error message "Email not verified"
- **Network Error**: Backend not running

---

## Test Case 4: Token Interceptor Testing

### Steps:
1. **Login First** (Complete Test Case 3)

2. **Check API Calls with Token**
   - Open Network tab in DevTools
   - Navigate to any protected page or trigger an API call
   - ✅ Check any API request headers
   - ✅ Should see: `Authorization: Bearer <accessToken>`

3. **Test Token Refresh (Advanced)**
   - Manually expire the access token (wait 15 minutes or modify in localStorage)
   - Make an API call that requires authentication
   - ✅ Interceptor should automatically refresh token
   - ✅ Check Network tab for `/api/auth/refresh` call
   - ✅ Original request should retry with new token

### Expected Results:
- ✅ All authenticated API calls include Bearer token
- ✅ Token refresh works automatically on 401 errors
- ✅ User stays logged in after token refresh

---

## Test Case 5: Error Handling

### Test Invalid Login:
1. Go to `/login`
2. Enter email: `wrong@example.com`
3. Enter password: `wrongpassword`
4. Click "Login"
5. ✅ Should show error: "Invalid credentials" or "Login failed. Please check your credentials."

### Test Validation Errors:
1. Go to `/signup`
2. Leave fields empty and click "Continue"
3. ✅ Should show validation error for required fields
4. Enter invalid email format (e.g., `notanemail`)
5. ✅ Should show email validation error
6. Enter password less than 6 characters
7. ✅ Should show password length error

### Test Already Registered Email:
1. Go to `/signup`
2. Enter an email that already exists
3. Complete form and submit
4. ✅ Should show error: "Email already registered"

---

## Test Case 6: Logout Flow (If Implemented)

### Steps:
1. **Login First** (Complete Test Case 3)
2. **Find Logout Button** (in header or user menu)
3. **Click Logout**
   - ✅ Should call `/api/auth/logout` API
   - ✅ Should clear tokens from localStorage
   - ✅ Should redirect to login page

**Note**: Logout functionality might not be visible in UI yet, but the API endpoint exists.

---

## Verification Checklist

After completing all tests, verify:

- [ ] ✅ Signup creates new user successfully
- [ ] ✅ Email verification works (or shows appropriate message if email service not configured)
- [ ] ✅ Login stores tokens correctly
- [ ] ✅ Tokens are included in API request headers
- [ ] ✅ Navigation works correctly (signup → otp → login → user-home)
- [ ] ✅ Error messages display correctly
- [ ] ✅ Form validation works
- [ ] ✅ Loading states show during API calls
- [ ] ✅ Network requests show correct endpoints and data

---

## Quick Test Script

For quick testing, you can use this sequence:

1. **Signup**: Navigate to `/signup` → Fill form → Submit
2. **Verify**: Check backend logs for verification URL → Copy URL → Open in browser
3. **Login**: Navigate to `/login` → Enter email → Enter password → Submit
4. **Verify Tokens**: Check localStorage for `accessToken` and `refreshToken`
5. **Check Headers**: Make any API call → Check Network tab → Verify `Authorization` header exists

---

## Troubleshooting

### Backend Not Running
- **Symptom**: Network errors, "Cannot connect to API"
- **Solution**: Start backend server with `npm run dev` or `start-dev.bat`

### MongoDB Not Connected
- **Symptom**: 500 errors on signup/login
- **Solution**: Check MongoDB connection string in `.env` file

### Email Service Not Configured
- **Symptom**: No verification emails received
- **Solution**: 
  - Check backend console for verification URL (backend logs it)
  - Configure email service in `.env` (MAIL_HOST, MAIL_USER, MAIL_PASS)
  - Or manually copy verification URL from backend logs

### CORS Errors
- **Symptom**: CORS errors in console
- **Solution**: Check `CORS_ORIGIN` in backend `.env` matches frontend URL

### Tokens Not Stored
- **Symptom**: Can't access protected pages after login
- **Solution**: Check localStorage in DevTools → Application tab

---

## Success Criteria

Phase 2 is considered **complete and working** if:
- ✅ All test cases pass
- ✅ No console errors
- ✅ API calls succeed (check Network tab)
- ✅ Tokens are stored and used correctly
- ✅ Error handling works
- ✅ User can complete full signup → verify → login flow

---

## Next Steps After Testing

If all tests pass:
- ✅ Phase 2 is complete!
- ✅ Ready to proceed to Phase 3 (Test/Assessment APIs)
- ✅ Consider adding Auth Context (optional enhancement)

If tests fail:
- ❌ Check error messages in console
- ❌ Verify backend is running and connected to MongoDB
- ❌ Check Network tab for failed API calls
- ❌ Review error responses from backend

