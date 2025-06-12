# PawPal - Pet Lovers Social Media Platform

PawPal is a social media platform designed specifically for pet lovers to share stories, images, and experiences about their beloved pets. The platform enables users to connect, interact, and build a community around their shared love for pets.

## Features

### 1. User Authentication
![Signup Page](frontend/public/images/signup.png)
![Login Page](frontend/public/images/login.png)
- Secure registration and login system
- Profile management with customizable bio
- Password change functionality
- Profile picture support

### 2. Home/Gallery Page
![Home Page](frontend/public/images/home.png)
![Gallery Page](frontend/public/images/gallery.png)
- Dynamic feed of pet posts
- Advanced filtering options:
  - Search by breed
  - Filter by tags
  - Sort by newest/oldest/most liked
- Responsive grid layout
- Interactive post cards with animations

### 3. Create Post Page
![Create Post Page](frontend/public/images/create-post.png)
- Image upload functionality
- Form fields for:
  - Title
  - Pet breed
  - Description
  - Tags
- Real-time preview
- Animated pet bubbles for visual appeal

### 4. Profile Page
![Profile1 Page](frontend/public/images/profile1.png)
![Profile2 Page](frontend/public/images/profile2.png)
- User information display
- Stats overview:
  - Total posts
  - Saved posts
  - Total likes
- Bio section
- Edit profile functionality

### 5. Post Interaction Features
- Like/Unlike posts
- Save posts for later viewing
- Comment system:
  - Add comments
  - Reply to comments
  - Edit/delete comments
  - Nested replies

### 6. Search and Filter
- Breed-based filtering
- Tag-based search
- Text search in titles and content
- Sort options:
  - Newest first
  - Oldest first
  - Most liked

## Technical Stack

### Frontend
- React.js
- Material-UI
- Framer Motion for animations
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage

### Database Schema

#### User
```javascript
{
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
  createdAt: Date
}
```

#### PetPost
```javascript
{
  title: String,
  content: String,
  breed: String,
  imageUrl: String,
  tags: [String],
  user: ObjectId,
  likes: [ObjectId],
  savedBy: [ObjectId],
  comments: [{
    user: ObjectId,
    content: String,
    replies: [{
      user: ObjectId,
      content: String,
      createdAt: Date
    }],
    createdAt: Date
  }],
  createdAt: Date
}
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Posts
- GET `/api/posts` - Get all posts with filters
- POST `/api/posts/create` - Create new post
- GET `/api/posts/:id` - Get single post
- PUT `/api/posts/:id` - Update post
- DELETE `/api/posts/:id` - Delete post

### Interactions
- PUT `/api/posts/:id/like` - Like/Unlike post
- PUT `/api/posts/:id/save` - Save/Unsave post
- POST `/api/posts/:id/comment` - Add comment
- POST `/api/posts/:id/comment/:commentId/reply` - Add reply

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/laibaaa21/pawpal.git
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Run the application
```bash
# Run backend
cd backend
npm start

# Run frontend
cd frontend
npm start
```


