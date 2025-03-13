import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Bell, 
  User,
  History,
  Filter,
  X,
  BarChart,
  PieChart,
  TrendingUp,
  Settings,
  LogOut,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { analyticsData, notifications, serviceProviders, upcomingBookings, userData } from '../../Constants';

const CustDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.filter(n => !n.read).length
  );

  const maxBookings = Math.max(...analyticsData.monthlyBookings.map(b => b.count));
  const maxRatings = Math.max(...analyticsData.ratingDistribution.map(r => r.count));
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
  
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadNotifications > 0) {
      setUnreadNotifications(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Huduma Mtaani</h1>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  className="p-2 text-gray-500 hover:text-blue-600 relative"
                  onClick={handleNotificationClick}
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === 'booking' && (
                                <Calendar className="w-5 h-5 text-blue-500" />
                              )}
                              {notification.type === 'reminder' && (
                                <Bell className="w-5 h-5 text-yellow-500" />
                              )}
                              {notification.type === 'review' && (
                                <MessageSquare className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="ml-3 flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-600"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                    <a
                      href="#profile"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <a
                      href="#settings"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </a>
                    <div className="border-t border-gray-100">
                      <a
                        href="#logout"
                        className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Search className="w-5 h-5 inline mr-2" />
            Find Services
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5 inline mr-2" />
            History
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart className="w-5 h-5 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Search Section */}
        {activeTab === 'search' && (
          <div>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600"
              >
                {showFilters ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Filter className="w-5 h-5" />
                )}
              </button>
            </div>

            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Service Type</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                  </select>
                  <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Location</option>
                    <option value="nairobi">Nairobi</option>
                    <option value="mombasa">Mombasa</option>
                    <option value="kisumu">Kisumu</option>
                  </select>
                  <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
            )}

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-gray-600">{provider.service}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1">{provider.rating}</span>
                    </div>
                    <p className="text-gray-600 mt-2">KSH {provider.price}</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{booking.service}</h3>
                  <p className="text-gray-600">{booking.provider}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {booking.date}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {booking.time}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                  <button className="text-red-600 hover:text-red-700">
                    Cancel
                  </button>
                  <button className="text-blue-600 hover:text-blue-700">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Section */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">House Cleaning</h3>
                  <p className="text-gray-600">Jane Doe</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      2024-03-15
                    </span>
                    <span className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      Completed
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{analyticsData.stats.totalBookings}</p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{analyticsData.stats.completedServices}</p>
                <p className="text-sm text-gray-500 mt-1">Services completed</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold mt-2">{analyticsData.stats.averageRating}</p>
                <p className="text-sm text-gray-500 mt-1">Out of 5</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold mt-2">KSH {analyticsData.stats.totalSpent}</p>
                <p className="text-sm text-gray-500 mt-1">All services</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Usage Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Service Usage Distribution</h3>
                <div className="space-y-4">
                  {analyticsData.serviceUsage.map((item) => (
                    <div key={item.service}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.service}</span>
                        <span>{item.count} bookings</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Bookings */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
                <div className="flex items-end justify-between h-48">
                  {analyticsData.monthlyBookings.map((item) => (
                    <div key={item.month} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-blue-600 rounded-t"
                        style={{
                          height: `${(item.count / maxBookings) * 100}%`,
                        }}
                      />
                      <span className="text-sm mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {analyticsData.ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center">
                      <div className="w-16 flex items-center">
                        <span className="mr-2">{item.stars}</span>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${(item.count / maxRatings) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="ml-4 w-16 text-right text-sm text-gray-600">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustDashboard;