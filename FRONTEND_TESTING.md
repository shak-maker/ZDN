# Frontend Testing Guide

## 🚀 Quick Start
1. Open browser: http://localhost:5173/
2. Login with: `admin` / `admin123`
3. Test the features below

## ✅ Test Checklist

### 1. Authentication
- [ ] Login page loads correctly
- [ ] Can login with admin credentials
- [ ] Can login with user credentials
- [ ] Logout works properly
- [ ] Protected routes redirect to login when not authenticated

### 2. Reports List Page
- [ ] Reports table displays correctly
- [ ] Search functionality works
- [ ] Pagination works (if more than 10 reports)
- [ ] View button opens report details
- [ ] Edit button opens edit form
- [ ] Delete button works (with confirmation)
- [ ] "New Report" button works

### 3. Create New Report
- [ ] Form loads correctly
- [ ] All input fields work
- [ ] Date pickers work
- [ ] Can add multiple detail rows
- [ ] Can remove detail rows
- [ ] "Preview JSON" button shows modal with canonical JSON
- [ ] Can save report successfully
- [ ] Form validation works (required fields)

### 4. Edit Report
- [ ] Form pre-fills with existing data
- [ ] Can modify all fields
- [ ] Can add/remove detail rows
- [ ] Can save changes
- [ ] Can cancel and return to list

### 5. View Report
- [ ] Report details display correctly
- [ ] Summary information shows
- [ ] Detail table shows all measurements
- [ ] "View JSON" button works
- [ ] "Download JSON" button works
- [ ] Edit and Back buttons work

### 6. JSON Preview/Download
- [ ] JSON preview modal shows correct canonical format
- [ ] JSON matches the expected schema
- [ ] Download creates a valid JSON file
- [ ] JSON is properly formatted

### 7. Responsive Design
- [ ] Works on desktop
- [ ] Works on tablet size
- [ ] Works on mobile size
- [ ] Navigation drawer works on mobile

## 🐛 Common Issues & Solutions

### Issue: "Loading..." screen stuck
**Solution**: Check if backend is running on port 3001

### Issue: Login fails
**Solution**: 
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API calls

### Issue: Forms don't save
**Solution**:
1. Check browser console for validation errors
2. Ensure all required fields are filled
3. Check network tab for API errors

### Issue: JSON preview doesn't work
**Solution**:
1. Check if all required fields are filled
2. Look for JavaScript errors in console
3. Verify the preview modal opens

## 🔍 Browser Developer Tools

### Console Tab
- Check for JavaScript errors
- Look for network request failures
- Verify API calls are being made

### Network Tab
- Monitor API requests to localhost:3001
- Check response status codes
- Verify request/response data

### Application Tab
- Check localStorage for JWT token
- Verify authentication state

## 📱 Test on Different Devices

### Desktop (1920x1080)
- Full navigation sidebar visible
- All features accessible
- Optimal user experience

### Tablet (768x1024)
- Navigation drawer collapses
- Touch-friendly interface
- Responsive layout

### Mobile (375x667)
- Mobile navigation menu
- Touch-optimized forms
- Scrollable content

## 🎯 Expected Behavior

### Login Flow
1. Visit http://localhost:5173/
2. Redirected to /login
3. Enter credentials
4. Redirected to /reports
5. See reports list

### Create Report Flow
1. Click "New Report"
2. Fill out form fields
3. Add detail rows
4. Click "Preview JSON"
5. Review canonical JSON
6. Click "Save"
7. Redirected to reports list
8. New report appears in list

### View Report Flow
1. Click "View" on any report
2. See report details page
3. Review summary and details
4. Click "View JSON" to see raw data
5. Click "Download JSON" to save file

## 🚨 Error Scenarios to Test

1. **Network Error**: Disconnect internet, try to save report
2. **Validation Error**: Submit form with missing required fields
3. **Authentication Error**: Try to access protected route without login
4. **Server Error**: Backend not running, try to load reports

## 📊 Performance Testing

- Page load times should be < 2 seconds
- Form interactions should be immediate
- Large lists should paginate properly
- JSON preview should load quickly

## 🔧 Debug Commands

If you need to debug:

```bash
# Check if frontend is running
curl http://localhost:5173

# Check if backend is running  
curl http://localhost:3001

# View frontend logs
# Check browser console

# View backend logs
# Check terminal where backend is running
```

## ✅ Success Criteria

The frontend is working correctly if:
- [ ] All pages load without errors
- [ ] Authentication works properly
- [ ] CRUD operations work for reports
- [ ] JSON preview/download works
- [ ] Responsive design works
- [ ] No console errors
- [ ] All API calls succeed
