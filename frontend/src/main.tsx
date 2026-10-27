import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/home/home'
import PrivateRoute from './pages/components/layouts/PrivateRoute'
import SignUpPage from './pages/auth/signup/signup'
import LoginPage from './pages/auth/login/login'
import Header from './pages/components/layouts/header/header'
import Footer from './pages/components/layouts/footer/footer'
import { AuthProvider } from './pages/providers/auth-provides'
import NotificationBar from './pages/components/notification-bar'
import { NotificationProvider } from './pages/providers/notification-provider'
import SearchBook from './pages/search_books/search-books'
import BookshelfPage from './pages/bookshelf/page/index'
import OtherUserBookshelfPage from './pages/bookshelf/page/show'
import PreferenceResult from './pages/preference/page/index'
import UndiagnosedUpdate from './pages/preference/page/update/undiagnosed'
import NotFound from './pages/components/layouts/NotFound'
import GenreStatistic from './pages/genre_statistic/page'
import AuthorStatistic from './pages/author_statistic/page'
import BookPosts from './pages/post/page'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Header />
          <NotificationBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/preference" element={<PreferenceResult />} />
                <Route path="/preference/update" element={<UndiagnosedUpdate />} />
                <Route path="/genre-statistic" element={<GenreStatistic />} />
                <Route path="/author-statistic" element={<AuthorStatistic />} />
                <Route path="/search_book" element={<SearchBook />} />
                <Route path="/bookshelf" element={<BookshelfPage />} />
                <Route path="/bookshelf/:id" element={<OtherUserBookshelfPage />} />
                <Route path="/books/:isbn/posts" element={<BookPosts />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
