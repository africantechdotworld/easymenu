import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './pages/LandingPage'
import LandingPage from './pages/LandingPage';
import QrScanner from './pages/QrScanner';
import ViewMenu from './components/app/pinging/ViewMenu';
import Favorites from './pages/Favorites';
import ViewRestaurant from './pages/ViewRestaurant';
import AboutPage from './pages/AboutPage';
import RestaurantView from './pages/RestaurantView';
import RestaurantInfo from './pages/RestaurantInfo';
import MenuView from './pages/MenuView';
import ScrollToTop from './widgets/ScrollToTop';
import MenuReviews from './pages/MenuReviews';
import RestaurantReviews from './pages/RestaurantReviews';
import BusinessLogin from './pages/business/Login';
import BusinessSignup from './pages/business/Signup';
import Dashboard from './pages/business/Dashboard';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* LandingPage is the default route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/scanner" element={<QrScanner />} />

        {/* Business Routes */}
        <Route path="/business/login" element={<BusinessLogin />} />
        <Route path="/business/signup" element={<BusinessSignup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* Customer Routes */}
        <Route path="/restaurant/:id" element={<ViewRestaurant />} />
        <Route path="/restaurant/:id/info" element={<RestaurantInfo />} />
        <Route path="/restaurant/:id/menu/:categoryId" element={<MenuView />} />
        <Route path="/restaurant/:id/reviews" element={<RestaurantReviews />} />
        <Route path="/restaurant/:id/menu/:menuId/reviews" element={<MenuReviews />} />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about-business" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;