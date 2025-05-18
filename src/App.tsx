import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import UserProfile from './components/UserProfile'
import CreatePost from './components/CreatePost'
import PostFeed from './components/PostFeed'
import MountRushmore from './components/MountRushmore'
import './App.css'

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">Agorei</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create" className="hover:underline">Create Post</Link>
        <Link to="/rushmore" className="hover:underline">Mount Rushmore</Link>
      </div>
    </nav>
  )
}

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAuth()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AuthRoutes() {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:text-indigo-500"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { currentUser, logout } = useAuth()
  return (
    <>
      {currentUser && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <AuthRoutes />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>
                <UserProfile />
                <PostFeed />
                <div className="text-center mt-4">
                  <button
                    onClick={logout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <div>
                <UserProfile />
                <CreatePost />
                <div className="text-center mt-4">
                  <button
                    onClick={logout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rushmore"
          element={
            <ProtectedRoute>
              <div>
                <UserProfile />
                <MountRushmore />
                <div className="text-center mt-4">
                  <button
                    onClick={logout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
