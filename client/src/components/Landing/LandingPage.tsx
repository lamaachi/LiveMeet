import React, { useState, useEffect } from 'react';
import JoinRoomModal from '../Auth/JoinRoomModal';
import ChatRoom from '../chat/ChatRoom';

// SVG Icons
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<{ roomId: string; roomName: string } | null>(null);
  
  const chatMessages = [
    { user: 'Alex', message: 'Hey team, ready for the project discussion?', time: '2:34 PM' },
    { user: 'Sarah', message: 'Yes! I have the latest designs to share', time: '2:35 PM' },
    { user: 'Mike', message: 'Perfect timing, joining now 🚀', time: '2:35 PM' },
    { user: 'You', message: 'Let\'s make some progress!', time: '2:36 PM' }
  ];
  
  const fullText = 'Chat. Connect. Collaborate.';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % chatMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinRoom = (roomId: string, username: string) => {
    // Here you would emit a 'join_room' event to the server
    console.log(`Joining room ${roomId} as ${username}`);
    setCurrentRoom({ roomId, roomName: `Room ${roomId}` });
    setIsJoinModalOpen(false);
  };

  const handleCreateRoom = (username: string) => {
    // Here you would emit a 'create_room' event to the server
    console.log(`Creating a new room as ${username}`);
    // For now, we'll just generate a random room ID. In a real app, the server would provide this.
    const roomId = `room_${Date.now()}`;
    setCurrentRoom({ roomId, roomName: `New Room` });
    setIsJoinModalOpen(false);
  };

  const features = [
    {
      icon: <LightningIcon />,
      title: "Real-Time Messaging",
      description: "Instant messaging with Socket.IO for lightning-fast communication and live typing indicators."
    },
    {
      icon: <UsersIcon />,
      title: "Multiple Rooms",
      description: "Create or join unlimited chat rooms. Perfect for teams, projects, or community discussions."
    },
    {
      icon: <GlobeIcon />,
      title: "Always Online",
      description: "Cloud-hosted with 99.9% uptime. Your conversations are always accessible from anywhere."
    }
  ];

  const testimonials = [
    {
      name: "Emma Thompson",
      role: "Project Manager, DevCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "LiveMeet keeps our distributed team connected. Simple, fast, and reliable.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Lead Developer, StartupHub",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Perfect for quick team discussions. Love the simplicity and real-time features.",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Community Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "Our community loves the instant chat rooms. Easy setup and great performance.",
      rating: 5
    }
  ];

  if (currentRoom) {
    return <ChatRoom roomId={currentRoom.roomId} roomName={currentRoom.roomName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <MessageIcon />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                LiveMeet
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {['Rooms', 'Features', 'Pricing', 'About'].map((item) => (
                <a key={item} href="#" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium">
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="text-slate-300 hover:text-white transition-colors font-medium">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Start Chatting
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 space-y-4 bg-slate-800/95 backdrop-blur-lg rounded-2xl mt-4 px-6">
              {['Rooms', 'Features', 'Pricing', 'About'].map((item) => (
                <a key={item} href="#" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-700 space-y-4">
                <button className="w-full text-left text-slate-300 hover:text-white transition-colors font-medium py-2">
                  Sign In
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl">
                  Start Chatting
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
              <span className="text-sm font-medium text-blue-200">💬 Real-time text chat rooms</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Simple Text Rooms
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Real-Time Chat
              </span>
            </h1>

            {/* Typed Subheading */}
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 h-8">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>

            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create or join chat rooms instantly. No downloads, no complexity – just fast, 
              reliable messaging powered by Socket.IO technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
              >
                <span>Join a Room</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  →
                </div>
              </button>
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center space-x-3">
                <MessageIcon />
                <span>Create Room</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time messaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <span>Works on all devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Demo */}
        <div className="max-w-4xl mx-auto mt-20 px-6">
          <div className="relative">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-4 shadow-2xl transform perspective-1000 hover:scale-[1.02] transition-transform duration-500">
              <div className="bg-slate-900 rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="text-white font-semibold">#general-chat</h3>
                      <span className="text-slate-400 text-sm">4 online</span>
                    </div>
                    <div className="text-slate-400 text-sm">Room ID: ABC123</div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="p-6 space-y-4 min-h-[300px]">
                  {chatMessages.slice(0, currentMessage + 1).map((msg, index) => (
                    <div key={index} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.user === 'You' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : 'bg-slate-700 text-slate-200'
                      }`}>
                        <div className="text-xs opacity-75 mb-1">{msg.user} • {msg.time}</div>
                        <div>{msg.message}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span>Someone is typing...</span>
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="p-6 border-t border-slate-700">
                  <div className="flex items-center space-x-4 bg-slate-800 rounded-2xl p-4">
                    <input 
                      type="text" 
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                      disabled
                    />
                    <button className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-4 py-2 text-white font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Built for Speed &
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Simplicity
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need for instant team communication, without the bloat.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition-all duration-300 hover:transform hover:scale-105">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Trusted by Teams
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i}/>
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-3xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Start Chatting in Seconds
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              No downloads, no sign-ups required. Just enter a room and start talking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Join a Room Now
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300">
                Create New Room
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <MessageIcon />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  LiveMeet
                </span>
              </div>
              <p className="text-slate-400">
                Simple, fast, real-time chat rooms for everyone.
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Chat Rooms', 'Features', 'API', 'Status'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Bug Report', 'Feature Request'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 lg:mb-0">
              © 2025 LiveMeet. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Twitter', 'Discord', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-slate-400 hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      
    </div>
  );
};

export default LandingPage;
